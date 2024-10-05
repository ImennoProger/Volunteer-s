from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from models import Country, City
from schemas import CountryCreate, CityCreate
from database import get_db

router = APIRouter()

@router.get("/countries/", response_model=list[CountryCreate])
def read_countries(db: Session = Depends(get_db)):
    return db.query(Country).all()

@router.get("/cities/{country_id}", response_model=list[CityCreate])
def read_cities(country_id: int, db: Session = Depends(get_db)):
    return db.query(City).filter(City.country_id == country_id).all()
