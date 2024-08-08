from email.message import EmailMessage
import smtplib
from typing import List
from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.responses import RedirectResponse
import pydantic
from sqlalchemy.orm import Session
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from jose import JWTError, jwt
from datetime import datetime, timedelta
from passlib.context import CryptContext

from database import SessionLocal, engine
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from models import Country, City, CountryCreate, CityCreate, UserMetadataCreate, UserMetadata, User, Event, Category, EventRead, UserMetadataRead, EventCreate
import ssl
from sqlalchemy.orm import joinedload

app = FastAPI()

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

origins = [
    "*"
]

def get_session_local():
    yield SessionLocal()

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,  # Allows all origins from the list
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods
    allow_headers=["*"],  # Allows all headers
)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

SECRET_KEY = "your_secret_key"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

@app.delete("/users/{user_metadata_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_user(user_metadata_id: int, db: Session = Depends(get_db)):
    user = db.query(UserMetadata).filter(UserMetadata.user_metadata_id == user_metadata_id).first()
    if user is None:
        raise HTTPException(status_code=404, detail="Пользователь не найден")
    
    db.delete(user)
    db.commit()

    return {"message": "Пользователь удалён успешно"}

@app.put("/users/block/{user_metadata_id}")
def block_user(user_metadata_id: int, db: Session = Depends(get_db)):
    user = db.query(UserMetadata).filter(UserMetadata.user_metadata_id == user_metadata_id).first()
    if user is None:
        raise HTTPException(status_code=404, detail="Пользователь не найден")
    
    #user.isActive = False вместо isActive нужно добавить поле isBanned
    #db.commit()

    return {"message": "Пользователь заблокирован"}

@app.put("/users/unblock/{user_metadata_id}")
def unblock_user(user_metadata_id: int, db: Session = Depends(get_db)):
    user = db.query(UserMetadata).filter(UserMetadata.user_metadata_id == user_metadata_id).first()
    if user is None:
        raise HTTPException(status_code=404, detail="Пользователь не найден")
    
    #user.isActive = True   вместо isActive нужно добавить поле isBanned
    #db.commit()

    return {"message": "Пользователь разблокирован"}

@app.get("/users/", response_model=List[UserMetadataRead])
def read_users(db: Session = Depends(get_db)):
    users = db.query(UserMetadata).all()
    
    if not users:
        raise HTTPException(status_code=404, detail="Users not found")

    return users

@app.delete("/events/{event_id}", status_code=204)
async def delete_event(event_id: int, db: Session = Depends(get_db)):
    event = db.query(Event).filter(Event.event_id == event_id).first()
    if event:
        db.delete(event)
        db.commit()
    else:
        raise HTTPException(status_code=404, detail="Event not found")


@app.post("/events/")
def create_event(event: EventCreate, db: Session = Depends(get_session_local), token: str = Depends(oauth2_scheme)):
    # Получаем текущего пользователя
    current_user = get_current_user(token, db)
    if not current_user:
        raise HTTPException(status_code=401, detail="Не авторизован")

    # Получаем данные из таблицы user_metadata
    user_metadata = db.query(UserMetadata).filter(UserMetadata.email == current_user.email).first()
    if not user_metadata:
        raise HTTPException(status_code=404, detail="Пользователь не найден")

    # Получаем user_id для текущего пользователя
    user = db.query(User).filter(User.email == current_user.email).first()
    if not user:
        raise HTTPException(status_code=404, detail="Пользователь не найден в таблице User")

    # Получаем или создаем категорию
    category = db.query(Category).filter(Category.category_name == event.category_name).first()
    if not category:
        # Если категория не найдена, создаем новую
        category = Category(category_name=event.category_name)
        db.add(category)
        db.commit()  # Сохраняем категорию в базе данных
        db.refresh(category)  # Получаем присвоенный category_id

    # Создаем запись в таблице event
    db_event = Event(
        event_name=event.event_name,
        short_description=event.short_description,
        full_description=event.full_description,
        start_date=datetime.strptime(event.start_date, '%Y-%m-%d'),
        end_date=datetime.strptime(event.end_date, '%Y-%m-%d'),
        country_id=user_metadata.country_id,
        city_id=user_metadata.city_id,
        category_id=category.category_id,  # Используем ID категории
        required_volunteers=event.required_volunteers,
        registered_volunteers=0,  # Начальное значение
        participation_points=event.participation_points,
        rewards=event.rewards,
        user_id=user.user_id,  # Используем user_id из таблицы User
        creation_date=datetime.utcnow(),
        event_status=True
    )
    db.add(db_event)
    db.commit()
    db.refresh(db_event)
    return {"message": "Мероприятие создано успешно", "event_id": db_event.event_id}


@app.get("/events/", response_model=List[EventRead])
def read_events(db: Session = Depends(get_db)):
    # Используем joinedload для предварительной загрузки связанных данных
    events = db.query(Event).options(
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
            "event_status": event.event_status
        }
        events_with_details.append(event_details)
    
    return events_with_details


class UserInDB(pydantic.BaseModel):
    username: str
    email: str

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


def get_user_by_email(db: Session, email: str):
    return db.query(UserMetadata).filter(UserMetadata.email == email).first()

def get_usermetadata_by_email(db: Session, email: str):
    return db.query(UserMetadata).filter(UserMetadata.email == email).first()

def create_user_metadata(db: Session, user_metadata: UserMetadataCreate):
    
    hashed_password = pwd_context.hash(user_metadata.hashed_password)
    db_user_metadata = UserMetadata(
        email=user_metadata.username, ##email из UserMetadata, user_metadata.username из UserMetadataCreate, куда и идёт запрос на регу
        user_name=user_metadata.user_name,
        user_surname=user_metadata.user_surname,
        user_patronymic=user_metadata.user_patronymic,
        hashed_password=hashed_password,
        age=user_metadata.age,
        country_id=user_metadata.country,
        city_id=user_metadata.city)

    db.add(db_user_metadata)
    db.commit()
    db.refresh(db_user_metadata)
    return db_user_metadata

@app.post("/register")
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

class SendEmailVerify:
    
  def sendVerify(token, receiver):
    
    email_address = "loskutnikova.all@gmail.com" 
    email_app_password = "nuoj nnpt cuup sjls"   #внешний пароль приложения mail.ru
    context = ssl.SSLContext(ssl.PROTOCOL_TLS)
    
    
    html_content = f"""
    <html>
    <body>
        <h2>Подтверждение аккаунта</h2>
        <p>Нажмите на кнопку ниже, чтобы подтвердить ваш аккаунт:</p>
        <a href="http://185.242.118.144:8000/verify-token/{token}" style="
            display: inline-block;
            padding: 10px 20px;
            font-size: 16px;
            font-weight: bold;
            color: white;
            background-color: #4CAF50;
            text-align: center;
            text-decoration: none;
            border-radius: 5px;
        ">Подтвердить аккаунт</a>
    </body>
    </html>
    """
    context = ssl.SSLContext(ssl.PROTOCOL_TLS)
    # Создание сообщения
    msg = EmailMessage()
    msg['Subject'] = "Подтверждение email"
    msg['From'] = email_address
    msg['To'] = receiver
    msg.set_content("Для подтверждения аккаунта нажмите на кнопку ниже.")
    msg.add_alternative(html_content, subtype='html')
    server = smtplib.SMTP('smtp.gmail.com:587')
    server.ehlo()
    server.starttls(context=context)
    server.login(email_address, email_app_password)
    server.sendmail(email_address, receiver, msg.as_string())
    server.quit()


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

# Create access token
def create_access_token(data: dict, expires_delta: timedelta | None = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

@app.post("/token")
def login_for_access_token(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    user = authenticate_user(form_data.username, form_data.password, db)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.email}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}


def verify_token(token: str = Depends(oauth2_scheme)):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email: str = payload.get("sub")
        if email is None:
            raise HTTPException(status_code=403, detail="Token is invalid or expired")
        return payload
    except JWTError:
        raise HTTPException(status_code=403, detail="Token is invalid or expired")

@app.get("/verify-token/{token}")
async def verify_user_token(token: str, db: Session = Depends(get_db)):
    payload = verify_token(token=token)
    email = payload.get("sub")
    db_user = get_user_by_email(db, email=email)

    if not email:
        raise  HTTPException(
            status_code=401, detail="Данные не корректны"
        )
    if db_user is None:
        raise HTTPException(status_code=404, detail="Пользователь не найден")
    if db_user.isActive == True:
        return {"message": "Ваш аккаунт уже активирован", "status": "success"}

    db_user.isActive=True
    db.commit()

    redirect_url = f"http://185.242.118.144:3000/protected?token={token}"
    return RedirectResponse(redirect_url)
    #return {"message": "Token is valid"}

@app.get("/protected")
async def read_protected_data(token: str = Depends(oauth2_scheme)):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email: str = payload.get("sub")
        if email is None:
            raise HTTPException(status_code=403, detail="Token is invalid or expired")
        
        return {"message": "Protected data", "status": "success"}
    except JWTError:
        raise HTTPException(status_code=403, detail="Token is invalid or expired")

@app.get("/countries/", response_model=list[CountryCreate])
def read_countries(db: Session = Depends(get_db)):
    return db.query(Country).all()


@app.get("/cities/{country_id}", response_model=list[CityCreate])
def read_cities(country_id: int, db: Session = Depends(get_db)):
    return db.query(City).filter(City.country_id == country_id).all()
