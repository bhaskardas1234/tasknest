from sqlalchemy import Column, Integer, String, Text, Boolean, TIMESTAMP, ForeignKey, Table
from sqlalchemy.orm import relationship
from settings import Base
import datetime

# ===================== USERS TABLE =====================
class User(Base):
    __tablename__ = 'users'

    id = Column(Integer, primary_key=True, autoincrement=True)
    username = Column(String(255), nullable=False)
    password = Column(String(255), nullable=False)
    mode = Column(String(50), default='user')
    image = Column(String(255), nullable=True)
    email = Column(String(255), unique=True, nullable=False)
    profession = Column(String(100), nullable=True)
    institution = Column(String(255), nullable=True)
    phone_number = Column(String(20), nullable=True)
    linkedin_url = Column(String(255), nullable=True)
    gender = Column(String(10), nullable=True)
    country = Column(String(100), nullable=True)
    created_at = Column(TIMESTAMP, default=datetime.datetime.utcnow)
    updated_at = Column(TIMESTAMP, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)

    # Relationships
    categories = relationship("UserCategory", back_populates="user")
    shared_tasks = relationship("UserTask", back_populates="user")


# ===================== CATEGORY TABLE =====================
class Category(Base):
    __tablename__ = 'category'

    category_id = Column(Integer, primary_key=True, autoincrement=True)
    category_name = Column(String(100), nullable=False)

    # Relationships
    tasks = relationship("Task", back_populates="category")
    users = relationship("UserCategory", back_populates="category")

# ===================== TASK TABLE =====================
class Task(Base):
    __tablename__ = 'task'

    task_id = Column(Integer, primary_key=True, autoincrement=True)
    task_title = Column(String(255), nullable=False)
    deadline = Column(TIMESTAMP, nullable=True)
    priority = Column(String(50), default='Medium')
    description = Column(Text, nullable=True)
    status = Column(String(50), default='Pending')
    starred = Column(Boolean, default=False)
    reminder = Column(TIMESTAMP, nullable=True)

    
    category_id = Column(Integer, ForeignKey("category.category_id", ondelete="SET NULL"), nullable=True)

    # Relationships
    
    category = relationship("Category", back_populates="tasks")
    shared_users = relationship("UserTask", back_populates="task")

# ===================== USER_CATEGORY MAPPING TABLE =====================
class UserCategory(Base):
    __tablename__ = 'user_category'

    id = Column(Integer, primary_key=True, autoincrement=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    category_id = Column(Integer, ForeignKey("category.category_id", ondelete="CASCADE"), nullable=False)

    user = relationship("User", back_populates="categories")
    category = relationship("Category", back_populates="users")

# ===================== USER_TASK MAPPING TABLE =====================
class UserTask(Base):
    __tablename__ = 'user_task'

    id = Column(Integer, primary_key=True, autoincrement=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    task_id = Column(Integer, ForeignKey("task.task_id", ondelete="CASCADE"), nullable=False)

    user = relationship("User", back_populates="shared_tasks")
    task = relationship("Task", back_populates="shared_users")
