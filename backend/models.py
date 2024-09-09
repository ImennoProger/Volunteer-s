from sqlalchemy import Column, Integer, String, Date, Boolean, ForeignKey, JSON, TIMESTAMP, UniqueConstraint, event, MetaData, Float, DateTime
from sqlalchemy.orm import relationship, declarative_base
from pydantic import BaseModel
from datetime import datetime

# Создаем экземпляр MetaData
metadata = MetaData()

# Создаем базовый класс с использованием MetaData
Base = declarative_base(metadata=metadata)

class ChatMessage(Base):
    __tablename__ = 'chat_messages'

    id = Column(Integer, primary_key=True, index=True)
    sender_id = Column(Integer, ForeignKey('user_metadata.user_metadata_id'))
    recipient_id = Column(Integer, ForeignKey('user_metadata.user_metadata_id'))
    message = Column(String, nullable=False)
    time = Column(DateTime, default=datetime.utcnow)
    delivered = Column(Boolean, default=False)

    sender = relationship("UserMetadata", foreign_keys=[sender_id])
    recipient = relationship("UserMetadata", foreign_keys=[recipient_id])

class UserMetadata(Base):
    __tablename__ = "user_metadata"

    user_metadata_id = Column(Integer, primary_key=True, unique=True, index=True)
    email = Column(String, unique=True)
    hashed_password = Column(String)
    user_name = Column(String)
    user_surname = Column(String)
    user_patronymic = Column(String)
    age = Column(String)
    isActive = Column(Boolean, default=False)
    status = Column(Boolean, default=True)

    country_id = Column(Integer, ForeignKey("country.country_id", onupdate="CASCADE", ondelete="SET NULL"))
    city_id = Column(Integer, ForeignKey("city.city_id", onupdate="CASCADE", ondelete="SET NULL"))
    role_id = Column(Integer)

    country = relationship("Country", back_populates="users")
    city = relationship("City", back_populates="users")

    __table_args__ = (
        UniqueConstraint('email', name='uq_user_metadata_email'),
        UniqueConstraint('hashed_password', name='uq_user_metadata_hashed_password'),
    )

class User(Base):
    __tablename__ = "user"

    user_id = Column(Integer, primary_key=True, unique=True, index=True)
    email = Column(String, unique=True)
    hashed_password = Column(String)
    createdat = Column(TIMESTAMP, default=datetime.utcnow)

    user_metadata_id = Column(Integer, ForeignKey("user_metadata.user_metadata_id", onupdate="CASCADE", ondelete="CASCADE"))

    events = relationship("Event", back_populates="creator")
    permissions = relationship("UserPermission", back_populates="user")
    roles = relationship("UserRole", back_populates="user")
    registrations = relationship("EventRegistration", back_populates="user")
    volunteer_orgs = relationship("UserVolunteerOrg", back_populates="user")

# Событие для синхронизации данных
@event.listens_for(UserMetadata, 'after_insert')
def create_user_from_metadata(mapper, connection, target):
    connection.execute(
        User.__table__.insert().values(
            email=target.email,
            hashed_password=target.hashed_password,
            user_metadata_id=target.user_metadata_id
        )
    )

# Обновление данных при изменении
@event.listens_for(UserMetadata, 'after_update')
def update_user_from_metadata(mapper, connection, target):
    connection.execute(
        User.__table__.update().
        where(User.user_metadata_id == target.user_metadata_id).
        values(email=target.email, hashed_password=target.hashed_password)
    )

class Role(Base):
    __tablename__ = "role"

    role_id = Column(Integer, primary_key=True, unique=True)
    role_name = Column(String, unique=True)

    users = relationship("UserRole", back_populates="role")
    permissions = relationship("RolePermission", back_populates="role")

class Country(Base):
    __tablename__ = "country"

    country_id = Column(Integer, primary_key=True, unique=True)
    country_name = Column(String)

    city = relationship("City", back_populates="country")
    users = relationship("UserMetadata", back_populates="country")
    events = relationship("Event", back_populates="country")
    volunteer_orgs = relationship("VolunteerOrg", back_populates="country")
    class Config:
        from_attributes = True

class City(Base):
    __tablename__ = "city"

    city_id = Column(Integer, primary_key=True, unique=True)
    city_name = Column(String)

    country_id = Column(Integer, ForeignKey("country.country_id"))
    country = relationship("Country", back_populates="city")
    users = relationship("UserMetadata", back_populates="city")
    events = relationship("Event", back_populates="city")
    volunteer_orgs = relationship("VolunteerOrg", back_populates="city")
    class Config:
        from_attributes = True

class VolunteerOrg(Base):
    __tablename__ = "volunteer_org"

    vol_id = Column(Integer, primary_key=True, unique=True)
    vol_name = Column(String)
    vol_description = Column(String)
    country_id = Column(Integer, ForeignKey("country.country_id", onupdate="CASCADE", ondelete="SET NULL"))
    city_id = Column(Integer, ForeignKey("city.city_id", onupdate="CASCADE", ondelete="SET NULL"))
    vol_foundation_date = Column(Date)
    vol_contact_person = Column(Integer)
    vol_phone = Column(Integer)
    vol_email = Column(String)
    vol_status = Column(Boolean)
    vol_count_members = Column(Integer)

    country = relationship("Country", back_populates="volunteer_orgs")
    city = relationship("City", back_populates="volunteer_orgs")
    members = relationship("UserVolunteerOrg", back_populates="volunteer_org")
    class Config:
        from_attributes = True

class Event(Base):
    __tablename__ = "event"

    event_id = Column(Integer, primary_key=True, unique=True)
    event_name = Column(String)
    short_description = Column(String)
    full_description = Column(String)
    start_date = Column(Date)
    end_date = Column(Date)
    country_id = Column(Integer, ForeignKey("country.country_id", onupdate="CASCADE", ondelete="SET NULL"))
    city_id = Column(Integer, ForeignKey("city.city_id", onupdate="CASCADE", ondelete="SET NULL"))
    category_id = Column(Integer, ForeignKey("category.category_id", onupdate="CASCADE", ondelete="SET NULL"))
    required_volunteers = Column(Integer)
    registered_volunteers = Column(Integer)
    participation_points = Column(Integer)
    rewards = Column(String)
    image = Column(String)
    user_id = Column(Integer, ForeignKey("user.user_id", onupdate="CASCADE", ondelete="CASCADE"))
    creation_date = Column(Date)
    event_status = Column(Boolean)
    latitude = Column(Float)
    longitude = Column(Float)

    country = relationship("Country", back_populates="events")
    city = relationship("City", back_populates="events")
    category = relationship("Category", back_populates="events")
    creator = relationship("User", back_populates="events")
    registrations = relationship("EventRegistration", back_populates="event")
    class Config:
        from_attributes = True

class Category(Base):
    __tablename__ = "category"

    category_id = Column(Integer, primary_key=True, unique=True)
    category_name = Column(String, unique=True)

    events = relationship("Event", back_populates="category")
    class Config:
        from_attributes = True

class EventRegistration(Base):
    __tablename__ = "event_registration"

    registration_id = Column(Integer, primary_key=True, unique=True)
    user_id = Column(Integer, ForeignKey("user.user_id", onupdate="CASCADE", ondelete="CASCADE"))
    event_id = Column(Integer, ForeignKey("event.event_id", onupdate="CASCADE", ondelete="CASCADE"))
    registration_date = Column(Date)

    user = relationship("User", back_populates="registrations")
    event = relationship("Event", back_populates="registrations")
    class Config:
        from_attributes = True

class UserVolunteerOrg(Base):
    __tablename__ = "user_volunteer_org"

    user_volunteer_org_id = Column(Integer, primary_key=True, unique=True)
    user_id = Column(Integer, ForeignKey("user.user_id", onupdate="CASCADE", ondelete="CASCADE"))
    vol_id = Column(Integer, ForeignKey("volunteer_org.vol_id", onupdate="CASCADE", ondelete="CASCADE"))
    join_date = Column(Date)

    user = relationship("User", back_populates="volunteer_orgs")
    volunteer_org = relationship("VolunteerOrg", back_populates="members")
    class Config:
        from_attributes = True

class Permission(Base):
    __tablename__ = "permission"

    permission_id = Column(Integer, primary_key=True, unique=True)
    permission_name = Column(String, unique=True)
    permission_details = Column(JSON)

    user_permissions = relationship("UserPermission", back_populates="permission")
    role_permissions = relationship("RolePermission", back_populates="permission")
    class Config:
        from_attributes = True

class RolePermission(Base):
    __tablename__ = "rolepermission"

    rolepermissions_id = Column(Integer, primary_key=True, unique=True)
    role_id = Column(Integer, ForeignKey("role.role_id", onupdate="CASCADE", ondelete="CASCADE"))
    permission_id = Column(Integer, ForeignKey("permission.permission_id", onupdate="CASCADE", ondelete="CASCADE"))

    role = relationship("Role", back_populates="permissions")
    permission = relationship("Permission", back_populates="role_permissions")
    class Config:
        from_attributes = True

class UserPermission(Base):
    __tablename__ = "user_permission"

    user_permission_id = Column(Integer, primary_key=True, unique=True)
    user_id = Column(Integer, ForeignKey("user.user_id", onupdate="CASCADE", ondelete="CASCADE"))
    permission_id = Column(Integer, ForeignKey("permission.permission_id", onupdate="CASCADE", ondelete="CASCADE"))

    user = relationship("User", back_populates="permissions")
    permission = relationship("Permission", back_populates="user_permissions")
    class Config:
        from_attributes = True

class UserRole(Base):
    __tablename__ = "user_role"

    user_role_id = Column(Integer, primary_key=True, unique=True)
    role_id = Column(Integer, ForeignKey("role.role_id", onupdate="CASCADE", ondelete="CASCADE"))
    user_id = Column(Integer, ForeignKey("user.user_id", onupdate="CASCADE", ondelete="CASCADE"))

    user = relationship("User", back_populates="roles")
    role = relationship("Role", back_populates="users")
    class Config:
        from_attributes = True

class UserMetadataCreate(BaseModel):
    username: str  # для совместимости с запросом
    hashed_password: str
    user_name: str
    user_surname: str
    user_patronymic: str
    age: int
    country: int
    city: int

class UserMetadataRead(BaseModel):
    user_metadata_id: int
    email: str
    user_name: str
    user_surname: str
    user_patronymic: str
    age: str
    isActive: bool
    country_id: int
    city_id: int
    #role_id: int

    class Config:
        from_attributes = True

class CountryCreate(BaseModel):
    country_id: int
    country_name: str
    class Config:
        from_attributes = True

class CityCreate(BaseModel):
    city_id: int
    country_id: int
    city_name: str
    class Config:
        from_attributes = True

class EventRead(BaseModel):
    event_id: int
    event_name: str
    short_description: str
    full_description: str
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
    event_name: str
    short_description: str
    full_description: str
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

class UserInDB(BaseModel):
    username: str
    email: str