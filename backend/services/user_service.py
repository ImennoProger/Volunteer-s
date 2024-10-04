from sqlalchemy.orm import Session
from fastapi import HTTPException
from jose import jwt, JWTError
from models import UserMetadata, User
from config import SECRET_KEY, ALGORITHM

def get_current_user(token: str, db: Session) -> User:
    try:
        # Декодирование JWT токена
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email: str = payload.get("sub")
        if email is None:
            raise HTTPException(status_code=401, detail="Invalid authentication credentials")

        # Получение пользователя из базы данных
        user = db.query(UserMetadata).filter(UserMetadata.email == email).first()
        if user is None:
            raise HTTPException(status_code=401, detail="User not found")
        return user
    except JWTError as e:
        raise HTTPException(status_code=401, detail=f"Invalid authentication credentials: {str(e)}")

def get_user_metadata_by_token(token: str, db: Session) -> UserMetadata:
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email: str = payload.get("sub")
        if email is None:
            raise HTTPException(status_code=401, detail="Invalid authentication credentials")

        user_metadata = db.query(UserMetadata).filter(UserMetadata.email == email).first()
        if user_metadata is None:
            raise HTTPException(status_code=401, detail="User not found")
        return user_metadata
    except JWTError as e:
        raise HTTPException(status_code=401, detail=f"Invalid authentication credentials: {str(e)}")

def get_user_by_email(db: Session, email: str):
    return db.query(UserMetadata).filter(UserMetadata.email == email).first()

def get_usermetadata_by_email(db: Session, email: str):
    return db.query(UserMetadata).filter(UserMetadata.email == email).first()
