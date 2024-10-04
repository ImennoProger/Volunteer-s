from typing import Optional
from pydantic import BaseModel, EmailStr, Field, validator, HttpUrl
from datetime import datetime

class UserAvatarUpdate(BaseModel):
    avatar_image: HttpUrl

class EventRegister(BaseModel):
    event_id: int

class UserMetadataCreate(BaseModel):
    username: str  # для совместимости с запросом
    hashed_password: str = Field(..., min_length=8, max_length=100)
    user_name: str = Field(..., min_length=2)
    user_surname: str = Field(..., min_length=2)
    user_patronymic: Optional[str] = None 
    age: int = Field(..., ge=14) 
    country: int 
    city: int

class UserMetadataRead(BaseModel):
    avatar_image: Optional[str]
    user_metadata_id: int
    email: EmailStr
    user_name: str
    user_surname: str
    user_patronymic: Optional[str]
    age: str
    isActive: bool
    country_id: int
    city_id: int

    class Config:
        from_attributes = True

class UserMetadataReadProfile(BaseModel):
    avatar_image: Optional[str]
    user_metadata_id: int
    email: EmailStr
    user_name: str
    user_surname: str
    user_patronymic: Optional[str]
    age: str
    isActive: bool
    country_id: int
    city_id: int
    country_name: Optional[str]
    city_name: Optional[str]

    class Config:
        from_attributes = True

class UserMetadataReadForChat(BaseModel):
    avatar_image: Optional[str]
    user_metadata_id: int
    email: EmailStr
    user_name: str
    user_surname: str
    user_patronymic: Optional[str]
    age: str
    isActive: bool
    country_id: int
    city_id: int

    class Config:
        from_attributes = True

class CountryCreate(BaseModel):
    country_id: int
    country_name: str = Field(..., min_length=2, max_length=100)
    class Config:
        from_attributes = True

class CityCreate(BaseModel):
    city_id: int
    country_id: int
    city_name: str = Field(..., min_length=2, max_length=100)
    class Config:
        from_attributes = True

class EventRead(BaseModel):
    event_id: int
    event_name: str = Field(..., min_length=2, max_length=100)
    short_description: str = Field(..., min_length=10, max_length=200)
    full_description: str = Field(..., min_length=10, max_length=1000)
    start_date: datetime
    end_date: datetime
    category_name: str
    required_volunteers: int
    participation_points: int
    rewards: str
    registered_volunteers: int
    country_name: str
    city_name: str
    user_id: int
    image: str
    creation_date: datetime
    event_status: bool
    latitude: float
    longitude: float

    class Config:
        from_attributes = True

class EventCreate(BaseModel):
    event_name: str = Field(..., min_length=2, max_length=100)
    short_description: str = Field(..., min_length=10, max_length=200)
    full_description: str = Field(..., min_length=10, max_length=1000)
    start_date: str 
    end_date: str
    category_name: str
    required_volunteers: int
    participation_points: int
    rewards: str
    image: str
    latitude: float
    longitude: float

    class Config:
        from_attributes = True

    @validator('end_date')
    def validate_end_date(cls, end_date, values):
        if 'start_date' in values and end_date < values['start_date']:
            raise ValueError('End date must be after start date')
        return end_date