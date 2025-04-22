
from sqlalchemy import Column, String, Integer, TIMESTAMP
from settings import Base
import datetime

class User(Base):
    __tablename__ = 'users'
    
    # Columns mapping
    id = Column(Integer, primary_key=True, autoincrement=True)
    username = Column(String(255), nullable=False)
    password = Column(String(255), nullable=False)
    mode = Column(String(50), default='user')
    image = Column(String(255), nullable=True)
    email = Column(String(255),unique=True, nullable=False)
    profession = Column(String(100), nullable=True)
    institution = Column(String(255), nullable=True)
    phone_number = Column(String(20), nullable=True)
    linkedin_url = Column(String(255), nullable=True)
    gender = Column(String(10), nullable=True)
    country = Column(String(100), nullable=True)
    created_at = Column(TIMESTAMP, default=datetime.datetime.utcnow)
    updated_at = Column(TIMESTAMP, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)
  
    
    def __repr__(self):
        return f"<User(id={self.id}, username={self.username}, name={self.name}, email={self.email})>"

    # Optionally, you can add validation for certain fields like email or password (e.g., hash the password before saving it).
    # @validates('password')
    # def validate_password(self, key, password):
    #     # Add your password hashing logic here
    #     return password
