from datetime import datetime, timedelta
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session
from passlib.context import CryptContext
from jose import jwt, JWTError
from services.user_service import get_user_by_email
from config import ALGORITHM, SECRET_KEY
from models import User, UserMetadata
from schemas import UserMetadataCreate
from fastapi import HTTPException, Depends, status

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

def create_user_metadata(db: Session, user_metadata: UserMetadataCreate):
    hashed_password = pwd_context.hash(user_metadata.hashed_password)
    db_user_metadata = UserMetadata(
        email=user_metadata.username,
        user_name=user_metadata.user_name,
        user_surname=user_metadata.user_surname,
        user_patronymic=user_metadata.user_patronymic,
        hashed_password=hashed_password,
        age=user_metadata.age,
        country_id=user_metadata.country,
        city_id=user_metadata.city
    )
    db.add(db_user_metadata)
    db.commit()
    db.refresh(db_user_metadata)
    return db_user_metadata

def authenticate_user(email: str, password: str, db: Session):
    user = db.query(User).filter(User.email == email).first()
    db_user_metadata = get_user_by_email(db, email=email)
    if not user:
        return False
    if not pwd_context.verify(password, user.hashed_password):
        return False
    if not db_user_metadata.isActive:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Аккаунт не активирован. Пожалуйста, подтвердите ваш email.",
        )
    return user

def create_access_token(data: dict, expires_delta: timedelta | None = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

def verify_token(token: str = Depends(oauth2_scheme)):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email: str = payload.get("sub")
        if email is None:
            raise HTTPException(status_code=403, detail="Token is invalid or expired")
        return payload
    except JWTError:
        raise HTTPException(status_code=403, detail="Token is invalid or expired")