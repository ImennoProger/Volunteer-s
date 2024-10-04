from email.message import EmailMessage
import smtplib
from typing import List
from uuid import uuid4
from fastapi import FastAPI, Depends, HTTPException, status, Header, UploadFile, File
from fastapi.responses import RedirectResponse
from sqlalchemy.orm import Session, joinedload
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from jose import JWTError, jwt
from datetime import datetime, timedelta, timezone
from passlib.context import CryptContext
from fastapi_socketio import SocketManager
from config import ALGORITHM, SECRET_KEY
from services.user_service import get_current_user, get_user_by_email, get_user_metadata_by_token
from database import get_db, get_session_local
from fastapi.middleware.cors import CORSMiddleware
from models import ChatMessage, UserMetadata, User, Country, City, VolunteerOrg, Event, Category, EventRegistration, UserVolunteerOrg
from schemas import (CountryCreate, CityCreate, UserMetadataCreate, UserMetadataRead, 
                     UserMetadataReadForChat, UserMetadataReadProfile, EventRead, 
                     EventCreate, EventRegister)
import ssl
from dotenv import load_dotenv
import os
from api import users, events, auth
from services.auth_service import oauth2_scheme

load_dotenv()

UPLOAD_DIR = "uploads/avatars"

apiBaseUrl = os.getenv('REACT_APP_API_BASE_URL')
app = FastAPI()

if not os.path.exists(UPLOAD_DIR):
    os.makedirs(UPLOAD_DIR)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=["*"],  # переменную origins убрал
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(users.router)
app.include_router(events.router)
app.include_router(auth.router)

@app.get("/profile/", response_model=UserMetadataReadProfile)
def get_user_profile(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    current_user = get_current_user(token, db)
    if not current_user:
        raise HTTPException(status_code=401, detail="Не авторизован")
    user_metadata = db.query(UserMetadata).filter(UserMetadata.user_metadata_id == current_user.user_metadata_id).first()

    if not user_metadata:
        raise HTTPException(status_code=404, detail="User not found")

    user_metadata.country_name = db.query(Country.country_name).filter(Country.country_id == user_metadata.country_id).scalar()
    user_metadata.city_name = db.query(City.city_name).filter(City.city_id == user_metadata.city_id).scalar()
    
    return user_metadata

@app.post("/profile/avatar/")
async def upload_avatar(
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    token: str = Depends(oauth2_scheme)
):
    current_user = get_current_user(token, db)
    # Проверка типа файла
    if file.content_type not in ["image/jpeg", "image/png"]:
        raise HTTPException(status_code=400, detail="Invalid file type. Only JPEG and PNG are allowed.")

    # Создание уникального имени файла
    filename = f"{uuid4()}.{file.filename.split('.')[-1]}"
    file_path = os.path.join(UPLOAD_DIR, filename)

    # Сохранение файла
    with open(file_path, "wb") as f:
        f.write(await file.read())

    # Обновление информации о пользователе
    current_user.avatar_image = file_path
    db.add(current_user)
    db.commit()

    return {"message": "Avatar updated successfully", "avatar_url": file_path}

@app.get("/my-events/", response_model=List[EventRead])
def read_volunteer_events(db: Session = Depends(get_db), token: str = Depends(oauth2_scheme)):
    current_user = get_current_user(token, db)
    if not current_user:
        raise HTTPException(status_code=401, detail="Не авторизован")
    
    events = db.query(Event).join(EventRegistration).filter(
        EventRegistration.user_id == current_user.user_metadata_id
    ).options(
        joinedload(Event.country),
        joinedload(Event.city),
        joinedload(Event.category)
    ).all()



    events_with_details = []
    for event in events:
        event_details = {
            "event_id": event.event_id,
            "event_name": event.event_name,
            "short_description": event.short_description,
            "full_description": event.full_description,
            "start_date": event.start_date,
            "end_date": event.end_date,
            "category_name": event.category.category_name if event.category else None,
            "required_volunteers": event.required_volunteers,
            "participation_points": event.participation_points,
            "rewards": event.rewards,
            "registered_volunteers": event.registered_volunteers,
            "country_name": event.country.country_name if event.country else None,
            "city_name": event.city.city_name if event.city else None,
            "user_id": event.user_id,
            "creation_date": event.creation_date,
            "event_status": event.event_status,
            "image": event.image,
            "latitude": event.latitude,
            "longitude": event.longitude
        }
        events_with_details.append(event_details)


    return events_with_details

@app.get("/countries/", response_model=list[CountryCreate])
def read_countries(db: Session = Depends(get_db)):
    return db.query(Country).all()

@app.get("/cities/{country_id}", response_model=list[CityCreate])
def read_cities(country_id: int, db: Session = Depends(get_db)):
    return db.query(City).filter(City.country_id == country_id).all()

@app.get("/chat/history/{recipient_id}", response_model=List[dict])
async def get_chat_history(
    recipient_id: int,
    authorization: str = Header(...),  # Ожидаем заголовок Authorization
    db: Session = Depends(get_db)
):
    if not authorization.startswith("Bearer "):
        raise HTTPException(status_code=400, detail="Invalid token format")
    
    token = authorization[len("Bearer "):]

    current_user = get_user_metadata_by_token(token, db)

    recipient = db.query(UserMetadata).filter(UserMetadata.user_metadata_id == recipient_id).first()
    if not recipient:
        raise HTTPException(status_code=404, detail="Recipient not found")

    chat_history = db.query(ChatMessage, UserMetadata).join(
        UserMetadata, ChatMessage.sender_id == UserMetadata.user_metadata_id
    ).filter(
        ((ChatMessage.sender_id == current_user.user_metadata_id) & (ChatMessage.recipient_id == recipient_id)) |
        ((ChatMessage.sender_id == recipient_id) & (ChatMessage.recipient_id == current_user.user_metadata_id))
    ).order_by(ChatMessage.time.asc()).all()

    # Маркируем сообщения как прочитанные
    db.query(ChatMessage).filter(
        ChatMessage.sender_id == recipient_id,
        ChatMessage.recipient_id == current_user.user_metadata_id,
        ChatMessage.delivered == False
    ).update({"delivered": True})
    db.commit()
    
    total_unread_count = db.query(ChatMessage).filter(
        ChatMessage.recipient_id == current_user.user_metadata_id,
        ChatMessage.delivered == False
    ).count()

    await socket_manager.emit('unread_messages_count', {
            'count': total_unread_count
        }, room=f"user_{current_user.user_metadata_id}")

    chat_history_response = [
        {
            "sender_id": message.ChatMessage.sender_id,
            "recipient_id": message.ChatMessage.recipient_id,
            "message": message.ChatMessage.message,
            "time": message.ChatMessage.time.isoformat(),
            "delivered": message.ChatMessage.delivered,
            "user_name": f"{message.UserMetadata.user_name} {message.UserMetadata.user_surname}"
        }
        for message in chat_history
    ]

    return chat_history_response


socket_manager = SocketManager(app=app, cors_allowed_origins=[], mount_location='/socket.io')

# Словарь для хранения соединений пользователей
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

def save_message_to_db(sender_id, recipient_id, message, db):
    new_message = ChatMessage(
        sender_id=sender_id,
        recipient_id=recipient_id,
        message=message,
        delivered=False
    )
    db.add(new_message)
    db.commit()
    db.refresh(new_message)
    return new_message

def get_undelivered_messages(user_id, db):
    return db.query(ChatMessage).filter_by(recipient_id=user_id, delivered=False).all()

@app.post("/logout")
def logout(token: str = Depends(oauth2_scheme)):
    # Аннулирование токена: клиент просто удаляет его с клиентской стороны
    return {"message": "Выход выполнен успешно"}