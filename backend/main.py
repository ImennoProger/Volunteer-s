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

from sockets.chat_socket import setup_socket_manager
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
from api import users, events, auth, profile, locations
from services.auth_service import oauth2_scheme

load_dotenv()

UPLOAD_DIR = "uploads/avatars"

apiBaseUrl = os.getenv('REACT_APP_API_BASE_URL')

app = FastAPI()
socket_manager = SocketManager(app=app, cors_allowed_origins=[], mount_location='/socket.io')
setup_socket_manager(socket_manager)

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
app.include_router(profile.router)
app.include_router(locations.router)


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