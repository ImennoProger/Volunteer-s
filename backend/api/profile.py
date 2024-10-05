from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
from sqlalchemy.orm import Session
from models import UserMetadata, Country, City
from schemas import UserMetadataReadProfile
from database import get_db
from services.user_service import get_current_user
from fastapi.security import OAuth2PasswordBearer
from uuid import uuid4
import os

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

UPLOAD_DIR = "uploads/avatars"

router = APIRouter()

@router.get("/profile/", response_model=UserMetadataReadProfile)
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

@router.post("/profile/avatar/")
async def upload_avatar(
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    token: str = Depends(oauth2_scheme)
):
    current_user = get_current_user(token, db)
    
    if file.content_type not in ["image/jpeg", "image/png"]:
        raise HTTPException(status_code=400, detail="Invalid file type. Only JPEG and PNG are allowed.")
    
    filename = f"{uuid4()}.{file.filename.split('.')[-1]}"
    file_path = os.path.join(UPLOAD_DIR, filename)
    
    with open(file_path, "wb") as f:
        f.write(await file.read())
    
    current_user.avatar_image = file_path
    db.add(current_user)
    db.commit()
    
    return {"message": "Avatar updated successfully", "avatar_url": file_path}