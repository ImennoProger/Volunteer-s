from fastapi import FastAPI
from socketio import AsyncServer

from services.message_service import save_message_to_db
from models import ChatMessage
from services.user_service import get_user_metadata_by_token
from database import get_db

app = FastAPI()
socket_manager = AsyncServer(app=app, cors_allowed_origins=[], mount_location='/socket.io')
# Монтируем сервер сокетов в приложение FastAPI
app.mount('/socket.io', socket_manager)

user_connections = {}
room_users = {}

@socket_manager.on('connect')
async def connect(sid, environ):
    query_params = environ.get('QUERY_STRING', '')
    token = None

    if query_params:
        params = dict(qc.split('=') for qc in query_params.split('&'))
        token = params.get('token', None)

    print(f"Socket connected with sid: {sid}")

    if token:
        print(f"Token received: {token}")
        db = next(get_db())

        try:
            user_metadata = get_user_metadata_by_token(token, db)
            user_id = user_metadata.user_metadata_id

            print(f"User authenticated: {user_metadata.user_name} {user_metadata.user_surname}, ID: {user_id}")

            room = f"user_{user_id}"
            await socket_manager.enter_room(sid, room)

            user_connections[user_id] = sid
            if room not in room_users:
                room_users[room] = set()
            room_users[room].add(sid)

            # Получаем список непрочитанных сообщений по каждому пользователю
            unread_counts = {}
            unread_messages = db.query(ChatMessage).filter(
                ChatMessage.recipient_id == user_id,
                ChatMessage.delivered == False
            ).all()
        
            total_unread_count = 0
            for msg in unread_messages:
                sender_id = msg.sender_id
                if sender_id not in unread_counts:
                    unread_counts[sender_id] = 0
                unread_counts[sender_id] += 1
                total_unread_count += 1

            print(f"Unread messages counts for user {user_id}: {unread_counts}")

            # Отправляем количество непрочитанных сообщений по каждому пользователю
            for sender_id, count in unread_counts.items():
                await socket_manager.emit('unread_messages_count', {
                    'user_id': sender_id,
                    'unread_count': count,
                    'count': total_unread_count
                }, room=sid)

            # Отправляем непрочитанные сообщения
            for msg in unread_messages:
                chat_message = {
                    "user_name": f"{msg.sender.user_name} {msg.sender.user_surname}",
                    "message": msg.message,
                    "time": msg.time.isoformat(),
                    "isUser": False
                }
                await socket_manager.emit('chat_message', chat_message, room=sid)

        except Exception as e:
            print(f"Error retrieving user or undelivered messages: {e}")
    else:
        print("No token provided, connection unauthorized")


@socket_manager.on('disconnect')
async def disconnect(sid):
    user_id = None
    room = None

    for uid, connection_sid in list(user_connections.items()):
        if connection_sid == sid:
            user_id = uid
            room = f"user_{user_id}"
            del user_connections[uid]
            break

    if user_id:
        if room in room_users and sid in room_users[room]:
            room_users[room].remove(sid)
            if not room_users[room]:
                del room_users[room]

        await socket_manager.leave_room(sid, room)
        print(f"User {user_id} disconnected and left room {room}")

@socket_manager.on('chat_message')
async def handle_chat_message(sid, data):
    token = data.get("token")
    message = data.get("message")
    recipient_id = data.get("recipient_id")

    db = next(get_db()) 

    try:
        user_metadata = get_user_metadata_by_token(token, db)
        user_id = user_metadata.user_metadata_id

        # Сохраняем сообщение в БД
        chat_message_record = save_message_to_db(user_id, recipient_id, message, db)

        chat_message = {
            "recipient_id": recipient_id,
            "sender_id": user_metadata.user_metadata_id,
            "user_name": f"{user_metadata.user_name} {user_metadata.user_surname}",
            "message": message,
            "time": chat_message_record.time.isoformat(),
            "isUser": True
        }

        # Отправляем сообщение отправителю
        await socket_manager.emit('chat_message', chat_message, room=sid)

        recipient_room = f"user_{recipient_id}"
        if recipient_room in room_users and room_users[recipient_room]:
            for recipient_sid in room_users[recipient_room]:
                # Отправляем сообщение получателю
                await socket_manager.emit('chat_message', chat_message, room=recipient_sid)

                # Подсчитываем количество непрочитанных сообщений от всех пользователей для получателя
                total_unread_count = db.query(ChatMessage).filter(
                    ChatMessage.recipient_id == recipient_id,
                    ChatMessage.delivered == False
                ).count()

                # Отправляем обновленное количество непрочитанных сообщений получателю
                unread_count = db.query(ChatMessage).filter(
                    ChatMessage.sender_id == user_id,
                    ChatMessage.recipient_id == recipient_id,
                    ChatMessage.delivered == False
                ).count()
                await socket_manager.emit('unread_messages_count', {
                    'user_id': user_id,
                    'unread_count': unread_count,
                    'count': total_unread_count 
                }, room=recipient_sid)

        else:
            print(f"Recipient {recipient_id} not connected or not in room {recipient_room}")

    except Exception as e:
        print(f"Error handling chat message: {e}")
        await socket_manager.emit('error', {'detail': str(e)}, room=sid)