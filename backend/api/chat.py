# api/chat.py

from fastapi import APIRouter, Depends, HTTPException, Header
from sqlalchemy.orm import Session
from typing import List
from models import ChatMessage, UserMetadata
from services.user_service import get_user_metadata_by_token
from database import get_db

router = APIRouter()

def setup_chat_routes(socket_manager):
    @router.get("/chat/history/{recipient_id}", response_model=List[dict])
    async def get_chat_history(
        recipient_id: int,
        authorization: str = Header(...),
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

        # Mark messages as read
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
