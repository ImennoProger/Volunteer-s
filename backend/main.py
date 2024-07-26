from email.message import EmailMessage
import smtplib
from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.responses import RedirectResponse
from sqlalchemy.orm import Session
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from jose import JWTError, jwt
from datetime import datetime, timedelta
from passlib.context import CryptContext

from database import SessionLocal, engine
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from models import Country, City, CountryCreate, CityCreate, UserMetadataCreate, UserMetadata, User
import ssl

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

# Dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# Your JWT secret and algorithm
SECRET_KEY = "your_secret_key"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

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
