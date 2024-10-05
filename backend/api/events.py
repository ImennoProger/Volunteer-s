from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session, joinedload
from typing import List
from datetime import datetime
from database import get_db, get_session_local
from models import Event, EventRegistration, UserMetadata, User, Category
from schemas import EventCreate, EventRegister, EventRead
from services.user_service import get_current_user
from services.auth_service import oauth2_scheme

router = APIRouter()

@router.get("/events/", response_model=List[EventRead])
def read_events(db: Session = Depends(get_db)):
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
            "event_status": event.event_status,
            "image": event.image,
            "latitude": event.latitude,
            "longitude": event.longitude
        }
        events_with_details.append(event_details)
    
    return events_with_details

@router.get("/events/{event_id}", response_model=EventRead)
def read_event(event_id: int, db: Session = Depends(get_db)):
    event = db.query(Event).options(
        joinedload(Event.country),
        joinedload(Event.city),
        joinedload(Event.category)
    ).filter(Event.event_id == event_id).first()
    
    if event is None:
        raise HTTPException(status_code=404, detail="Event not found")
    
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
        "event_status": event.event_status,
        "image": event.image,
        "latitude": event.latitude,
        "longitude": event.longitude
    }
    
    return event_details

@router.delete("/events/{event_id}", status_code=204)
async def delete_event(event_id: int, db: Session = Depends(get_db)):
    event = db.query(Event).filter(Event.event_id == event_id).first()
    if event:
        db.delete(event)
        db.commit()
    else:
        raise HTTPException(status_code=404, detail="Event not found")

@router.post("/event-register/")
def register_on_event(event: EventRegister, db: Session = Depends(get_db), token: str = Depends(oauth2_scheme)):
    current_user = get_current_user(token, db)
    if not current_user:
        raise HTTPException(status_code=401, detail="Не авторизован")
    
    existing_registration = db.query(EventRegistration).filter(
        EventRegistration.user_id == current_user.user_metadata_id, 
        EventRegistration.event_id == event.event_id
    ).first()

    if existing_registration:
        return {"message": "Вы уже записаны на это мероприятие"}
        

    db_event_register = EventRegistration(
        user_id=current_user.user_metadata_id,
        event_id=event.event_id,
        registration_date=datetime.utcnow()
    )
    db.add(db_event_register)
    db.commit()
    db.refresh(db_event_register)
    return {"message": "Запись прошла успешно"}

@router.post("/events/")
def create_event(event: EventCreate, db: Session = Depends(get_session_local), token: str = Depends(oauth2_scheme)):
    current_user = get_current_user(token, db)
    if not current_user:
        raise HTTPException(status_code=401, detail="Не авторизован")

    user_metadata = db.query(UserMetadata).filter(UserMetadata.email == current_user.email).first()
    if not user_metadata:
        raise HTTPException(status_code=404, detail="Пользователь не найден")

    user = db.query(User).filter(User.email == current_user.email).first()
    if not user:
        raise HTTPException(status_code=404, detail="Пользователь не найден в таблице User")

    category = db.query(Category).filter(Category.category_name == event.category_name).first()
    if not category:
        category = Category(category_name=event.category_name)
        db.add(category)
        db.commit()
        db.refresh(category)

    db_event = Event(
        event_name=event.event_name,
        short_description=event.short_description,
        full_description=event.full_description,
        start_date=datetime.strptime(event.start_date, '%Y-%m-%d'),
        end_date=datetime.strptime(event.end_date, '%Y-%m-%d'),
        country_id=user_metadata.country_id,
        city_id=user_metadata.city_id,
        category_id=category.category_id,
        required_volunteers=event.required_volunteers,
        registered_volunteers=0,
        participation_points=event.participation_points,
        rewards=event.rewards,
        user_id=user.user_id,
        creation_date=datetime.utcnow(),
        event_status=True,
        image=event.image,
        latitude=event.latitude,
        longitude=event.longitude
    )
    db.add(db_event)
    db.commit()
    db.refresh(db_event)
    return {"message": "Мероприятие создано успешно", "event_id": db_event.event_id}


@router.get("/my-events/", response_model=List[EventRead])
def read_volunteer_events(db: Session = Depends(get_db), token: str = Depends(oauth2_scheme)):
    current_user = get_current_user(token, db)
    if not current_user:
        raise HTTPException(status_code=401, detail="Не авторизован")
    
    events = db.query(Event).join(EventRegistration).filter(
        EventRegistration.user_id == current_user.user_metadata_id
    ).options(
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
            "event_status": event.event_status,
            "image": event.image,
            "latitude": event.latitude,
            "longitude": event.longitude
        }
        events_with_details.append(event_details)

    return events_with_details