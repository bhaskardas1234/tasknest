from sqlalchemy.orm import Session
from models import User
from schemas import RegisterUser  # <- Now from schemas
# from passlib.context import CryptContext
from datetime import datetime

# Password hashing context
# pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def create_user(db: Session, user: RegisterUser):
    # Hash the password
    # hashed_password = pwd_context.hash(user.password)

    # Create a new user instance
    print(user.username,"hii hellow byy byyy")
    new_user = User(
        username=user.username if user.username else "Unknown",
        password=user.password if user.password else "******",
        email=user.email,
        mode=user.mode if user.mode else "user",
        image=user.image if user.image else "",
        profession=user.profession if user.profession else "",
        institution=user.institution if user.institution else "",
        phone_number=user.phone_number if user.phone_number else "",
        linkedin_url=user.linkedin_url if user.linkedin_url else "",
        gender=user.gender if user.gender else "",
        country=user.country if user.country else "",
        created_at=datetime.utcnow(),
        updated_at=datetime.utcnow()
    )


    # Add and commit to database
    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return new_user
