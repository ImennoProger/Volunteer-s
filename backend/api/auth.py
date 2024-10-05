from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from datetime import timedelta
from fastapi.security import OAuth2PasswordRequestForm
from services.user_service import get_current_user, get_user_by_email
from config import ACCESS_TOKEN_EXPIRE_MINUTES
from database import get_session_local, get_db
from schemas import UserMetadataCreate
from services.auth_service import create_user_metadata, authenticate_user, create_access_token, verify_token
from services.email_service import SendEmailVerify
from fastapi.responses import RedirectResponse
from services.auth_service import oauth2_scheme

router = APIRouter()

@router.post("/register")
def register_user(user_metadata: UserMetadataCreate, db: Session = Depends(get_session_local)):
    db_user_metadata = get_user_by_email(db, email=user_metadata.username)
    if db_user_metadata:
        raise HTTPException(status_code=400, detail="Такой email уже зарегистрирован")
    create_user_metadata(db=db, user_metadata=user_metadata)
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user_metadata.username}, expires_delta=access_token_expires
    )
    SendEmailVerify.sendVerify(access_token, user_metadata.username)
    return {"message": "Регистрация успешна! Пожалуйста, подтвердите свой email перед входом."}

@router.post("/token")
def login_for_access_token(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    user = authenticate_user(form_data.username, form_data.password, db)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )

    role = None
    if user.is_volunteer:
        role = "volunteer"
    elif user.is_cityadm:
        role = "cityadm"
    elif user.is_regionadm:
        role = "regionadm"
    elif user.is_superadm:
        role = "superadm"

    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.email, "role": role}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}

@router.get("/verify-token/{token}")
async def verify_user_token(token: str, db: Session = Depends(get_db)):
    payload = verify_token(token=token)
    email = payload.get("sub")
    db_user = get_user_by_email(db, email=email)
    user = get_current_user(token, db)
    if not email:
        raise  HTTPException(status_code=401, detail="Данные не корректны")
    if db_user is None:
        raise HTTPException(status_code=404, detail="Пользователь не найден")
    if db_user.isActive == True:
        return {"message": "Ваш аккаунт уже активирован", "status": "success", "user": {
            "user_metadata_id": user.user_metadata_id,
            "email": user.email,
            "user_name": user.user_name,
            "user_surname": user.user_surname,
            "user_patronymic": user.user_patronymic
        }}

    db_user.isActive = True
    db.commit()

    redirect_url = f"https://volunteers-portal.ru/login"
    return RedirectResponse(redirect_url)

@router.post("/logout")
def logout(token: str = Depends(oauth2_scheme)):
    # Аннулирование токена: клиент просто удаляет его с клиентской стороны
    return {"message": "Выход выполнен успешно"}