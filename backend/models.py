from sqlalchemy import Column, Integer, String
from database import Base
from database import engine

class User(Base):
    __tablename__ = "user"

    user_id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True)
    hashed_password = Column(String)

# Create the database tables if they don't exist

User.metadata.create_all(bind=engine)
