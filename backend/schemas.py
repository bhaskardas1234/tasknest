
from pydantic import BaseModel, EmailStr
from typing import Optional

class RegisterUser(BaseModel):
    username: str
    password: str
    email: EmailStr
    mode: Optional[str] = "user"
    image: Optional[str] = None
    profession: Optional[str] = None
    institution: Optional[str] = None
    phone_number: Optional[str] = None
    linkedin_url: Optional[str] = None
    gender: Optional[str] = None
    country: Optional[str] = None

    class Config:
        orm_mode = True
class LoginUser(BaseModel):
    email:EmailStr
    password:str
