from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from database import get_db
from models import UserMetadata
from schemas import UserMetadataReadForChat, UserMetadataRead

router = APIRouter()

@router.delete("/users/{user_metadata_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_user(user_metadata_id: int, db: Session = Depends(get_db)):
    user = db.query(UserMetadata).filter(UserMetadata.user_metadata_id == user_metadata_id).first()
    if user is None:
        raise HTTPException(status_code=404, detail="Пользователь не найден")
    
    db.delete(user)
    db.commit()
    return {"message": "Пользователь удалён успешно"}

@router.put("/users/block/{user_metadata_id}")
def block_user(user_metadata_id: int, db: Session = Depends(get_db)):
    user = db.query(UserMetadata).filter(UserMetadata.user_metadata_id == user_metadata_id).first()
    if user is None:
        raise HTTPException(status_code=404, detail="Пользователь не найден")
    
    user.status = False
    db.commit()
    return {"message": "Пользователь заблокирован"}

@router.put("/users/unblock/{user_metadata_id}")
def unblock_user(user_metadata_id: int, db: Session = Depends(get_db)):
    user = db.query(UserMetadata).filter(UserMetadata.user_metadata_id == user_metadata_id).first()
    if user is None:
        raise HTTPException(status_code=404, detail="Пользователь не найден")
    
    user.status = True
    db.commit()
    return {"message": "Пользователь разблокирован"}

@router.get("/chat-users/", response_model=List[UserMetadataReadForChat])
def read_users_chat(db: Session = Depends(get_db)):
    users = db.query(UserMetadata).all()
    if not users:
        raise HTTPException(status_code=404, detail="Пользователи не найдены")
    
    return users

@router.get("/users/", response_model=List[UserMetadataRead])
def read_users(db: Session = Depends(get_db)):
    users = db.query(UserMetadata).all()
    if not users:
        raise HTTPException(status_code=404, detail="Пользователи не найдены")
    
    return users
