
from pydantic import BaseModel, EmailStr, Field
from typing import Optional
from datetime import datetime

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
    password: Optional[str] = None
class Category(BaseModel):
    category_name: str
    
class TaskSchema(BaseModel):
    task_title: str
    deadline: Optional[datetime] = None
    priority: Optional[str] = 'Medium'
    description: Optional[str] = None
    status: Optional[str] = 'Pending'
    starred: Optional[bool] = False
    reminder: Optional[datetime] = None
    category_id: Optional[int] = None

    class Config:
        orm_mode = True
class StatusUpdate(BaseModel):
    status: str