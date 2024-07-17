from sqlalchemy import Column, Integer, String, Date, Boolean, ForeignKey, JSON, TIMESTAMP
from sqlalchemy.orm import relationship
from database import Base, engine

class User(Base):
    __tablename__ = "user"

    user_id = Column(Integer, primary_key=True, index=True)
    username = Column(String)
    hashed_password = Column(String)
    email = Column(String)
    createdat = Column(TIMESTAMP)

    user_metadata = relationship("UserMetadata", back_populates="user")
    events = relationship("Event", back_populates="creator")
    permissions = relationship("UserPermission", back_populates="user")
    roles = relationship("UserRole", back_populates="user")
    registrations = relationship("EventRegistration", back_populates="user")
    volunteer_orgs = relationship("UserVolunteerOrg", back_populates="user")

class UserMetadata(Base):
    __tablename__ = "user_metadata"

    user_metadata_id = Column(Integer, primary_key=True, unique=True, index=True)
    user_name = Column(String)
    user_surname = Column(String)
    user_patronymic = Column(String)
    user_email = Column(String, unique=True)
    country_id = Column(Integer, ForeignKey("country.country_id"))  # исправлено
    region_id = Column(Integer, ForeignKey("region.region_id"))
    city_id = Column(Integer, ForeignKey("city.city_id"))  # исправлено
    role_id = Column(Integer)
    user_id = Column(Integer, ForeignKey("user.user_id"))

    user = relationship("User", back_populates="user_metadata")
    country = relationship("Country", back_populates="users")
    region = relationship("Region", back_populates="users")
    city = relationship("City", back_populates="users")

class Role(Base):
    __tablename__ = "role"

    role_id = Column(Integer, primary_key=True, unique=True)
    role_name = Column(String, unique=True)

    users = relationship("UserRole", back_populates="role")
    permissions = relationship("RolePermission", back_populates="role")

class Region(Base):
    __tablename__ = "region"

    region_id = Column(Integer, primary_key=True, unique=True)
    region_name = Column(String)

    users = relationship("UserMetadata", back_populates="region")
    events = relationship("Event", back_populates="region")
    volunteer_orgs = relationship("VolunteerOrg", back_populates="region")

class City(Base):
    __tablename__ = "city"

    city_id = Column(Integer, primary_key=True, unique=True)
    city_name = Column(String)

    users = relationship("UserMetadata", back_populates="city")
    events = relationship("Event", back_populates="city")
    volunteer_orgs = relationship("VolunteerOrg", back_populates="city")

class VolunteerOrg(Base):
    __tablename__ = "volunteer_org"

    vol_id = Column(Integer, primary_key=True, unique=True)
    vol_name = Column(String)
    vol_description = Column(String)
    country_id = Column(Integer, ForeignKey("country.country_id"))  # исправлено
    region_id = Column(Integer, ForeignKey("region.region_id"))
    city_id = Column(Integer, ForeignKey("city.city_id"))  # исправлено
    vol_foundation_date = Column(Date)
    vol_contact_person = Column(Integer)
    vol_phone = Column(Integer)
    vol_email = Column(String)
    vol_status = Column(Boolean)
    vol_count_members = Column(Integer)

    country = relationship("Country", back_populates="volunteer_orgs")
    region = relationship("Region", back_populates="volunteer_orgs")
    city = relationship("City", back_populates="volunteer_orgs")
    members = relationship("UserVolunteerOrg", back_populates="volunteer_org")

class Event(Base):
    __tablename__ = "event"

    event_id = Column(Integer, primary_key=True, unique=True)
    event_name = Column(String)
    short_description = Column(String)
    full_description = Column(String)
    start_date = Column(Date)
    end_date = Column(Date)
    country_id = Column(Integer, ForeignKey("country.country_id"))  # исправлено
    region_id = Column(Integer, ForeignKey("region.region_id"))
    city_id = Column(Integer, ForeignKey("city.city_id"))  # исправлено
    category_id = Column(Integer, ForeignKey("category.category_id"))
    required_volunteers = Column(Integer)
    registered_volunteers = Column(Integer)
    participation_points = Column(Integer)
    rewards = Column(Integer)
    user_id = Column(Integer, ForeignKey("user.user_id"))
    creation_date = Column(Date)
    event_status = Column(Boolean)

    country = relationship("Country", back_populates="events")
    region = relationship("Region", back_populates="events")
    city = relationship("City", back_populates="events")
    category = relationship("Category", back_populates="events")
    creator = relationship("User", back_populates="events")

class Category(Base):
    __tablename__ = "category"

    category_id = Column(Integer, primary_key=True, unique=True)
    category_name = Column(String, unique=True)

    events = relationship("Event", back_populates="category")

class EventRegistration(Base):
    __tablename__ = "event_registration"

    registration_id = Column(Integer, primary_key=True, unique=True)
    user_id = Column(Integer, ForeignKey("user.user_id"))
    event_id = Column(Integer, ForeignKey("event.event_id"))
    registration_date = Column(Date)

    user = relationship("User", back_populates="registrations")
    event = relationship("Event", back_populates="registrations")

class UserVolunteerOrg(Base):
    __tablename__ = "user_volunteer_org"

    user_volunteer_org_id = Column(Integer, primary_key=True, unique=True)
    user_id = Column(Integer, ForeignKey("user.user_id"))
    vol_id = Column(Integer, ForeignKey("volunteer_org.vol_id"))
    join_date = Column(Date)

    user = relationship("User", back_populates="volunteer_orgs")
    volunteer_org = relationship("VolunteerOrg", back_populates="members")

class Country(Base):
    __tablename__ = "country"

    country_id = Column(Integer, primary_key=True, unique=True)
    country_name = Column(String)

    users = relationship("UserMetadata", back_populates="country")
    events = relationship("Event", back_populates="country")
    volunteer_orgs = relationship("VolunteerOrg", back_populates="country")

class Permission(Base):
    __tablename__ = "permission"

    permission_id = Column(Integer, primary_key=True, unique=True)
    permission_name = Column(String, unique=True)
    permission_details = Column(JSON)

    user_permissions = relationship("UserPermission", back_populates="permission")
    role_permissions = relationship("RolePermission", back_populates="permission")

class RolePermission(Base):
    __tablename__ = "rolepermission"

    rolepermissions_id = Column(Integer, primary_key=True, unique=True)
    role_id = Column(Integer, ForeignKey("role.role_id"))
    permission_id = Column(Integer, ForeignKey("permission.permission_id"))

    role = relationship("Role", back_populates="permissions")
    permission = relationship("Permission", back_populates="role_permissions")

class UserPermission(Base):
    __tablename__ = "user_permission"

    user_permission_id = Column(Integer, primary_key=True, unique=True)
    user_id = Column(Integer, ForeignKey("user.user_id"))
    permission_id = Column(Integer, ForeignKey("permission.permission_id"))

    user = relationship("User", back_populates="permissions")
    permission = relationship("Permission", back_populates="user_permissions")

class UserRole(Base):
    __tablename__ = "user_role"

    user_role_id = Column(Integer, primary_key=True, unique=True)
    role_id = Column(Integer, ForeignKey("role.role_id"))
    user_id = Column(Integer, ForeignKey("user.user_id"))

    user = relationship("User", back_populates="roles")
    role = relationship("Role", back_populates="users")

# Создание таблиц в базе данных, если они не существуют
Base.metadata.create_all(bind=engine)
