from fastapi import FastAPI
from fastapi_socketio import SocketManager

from sockets.chat_socket import setup_socket_manager
from config import ALGORITHM, SECRET_KEY, UPLOAD_DIR
from fastapi.middleware.cors import CORSMiddleware

from dotenv import load_dotenv
import os
from api import users, events, auth, profile, locations, chat

load_dotenv()

apiBaseUrl = os.getenv('REACT_APP_API_BASE_URL')

app = FastAPI()
socket_manager = SocketManager(app=app, cors_allowed_origins=[], mount_location='/socket.io')
setup_socket_manager(socket_manager)
chat.setup_chat_routes(socket_manager)

if not os.path.exists(UPLOAD_DIR):
    os.makedirs(UPLOAD_DIR)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=["*"], 
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(users.router)
app.include_router(events.router)
app.include_router(auth.router)
app.include_router(profile.router)
app.include_router(locations.router)
app.include_router(chat.router)