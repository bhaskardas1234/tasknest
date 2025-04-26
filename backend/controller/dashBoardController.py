from datetime import timedelta, datetime
from pydantic import BaseModel
from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import JSONResponse
from sqlalchemy.orm import Session
from fastapi_jwt_auth import AuthJWT
from settings import SessionLocal, redis_client
from models import Category, User, UserCategory,Task,UserTask
from schemas import RegisterUser, LoginUser,Category as CategorySchema ,TaskSchema,StatusUpdate
from service.dashBoardService import *






dashBoard= APIRouter(tags=["Auth"])

# Dependency to get DB session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()










# Middleware to check JWT and blacklist
def authorize_user(Authorize: AuthJWT = Depends()):
    Authorize.jwt_required()
    jti = Authorize.get_raw_jwt()['jti']
    if redis_client.get(f"blacklist:{jti}"):
        raise HTTPException(status_code=401, detail="Token has been revoked")
    return Authorize.get_jwt_subject()


# GET: Fetch categories linked to a specific user
@dashBoard.get("/categories")
def get_user_categories(db: Session = Depends(get_db), user_email=Depends(authorize_user)):
    # Step 1: Find user by email
    user = db.query(User).filter(User.email == user_email).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    # Step 2: Get user_id
    user_id = user.id

    # Step 3: Find category_ids from user_category table
    user_category_entries = db.query(UserCategory).filter(UserCategory.user_id == user_id).all()
    category_ids = [uc.category_id for uc in user_category_entries]

    # Step 4: Fetch all categories where ID in category_ids
    categories = db.query(Category).filter(Category.category_id.in_(category_ids)).all()

    # Step 5: Return both category name and ID
    category_list = [
        {
            "category_id": category.category_id,
            "category_name": category.category_name
        }
        for category in categories
    ]

    return JSONResponse(
        content={"message": "Fetched user-specific categories", "categories": category_list},
        status_code=200
    )




@dashBoard.post("/category")
def add_category(data: CategorySchema, db: Session = Depends(get_db), user_email=Depends(authorize_user)):
    # Step 1: Check if category exists
    category = db.query(Category).filter(Category.category_name == data.category_name).first()
    
    # Step 2: If not, create it
    if not category:
        category = Category(category_name=data.category_name)
        db.add(category)
        db.commit()
        db.refresh(category)

    # Step 3: Get user from email
    user = db.query(User).filter(User.email == user_email).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    # Step 4: Check if user already mapped to this category
    existing_mapping = db.query(UserCategory).filter(
        UserCategory.user_id == user.id,
        UserCategory.category_id == category.category_id
    ).first()

    if existing_mapping:
        return JSONResponse(
            content={"message": "Category already linked to user", "category": category.category_name},
            status_code=200
        )

    # Step 5: Create mapping in user_category
    user_category = UserCategory(user_id=user.id, category_id=category.category_id)
    db.add(user_category)
    db.commit()

    return JSONResponse(
        content={"message": "Category created and linked to user", "category": category.category_name},
        status_code=200
    )


# create the new task(add)
@dashBoard.post("/task")
def create_task(data: TaskSchema, db: Session = Depends(get_db), user_email=Depends(authorize_user)):
    user = db.query(User).filter(User.email == user_email).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    new_task = Task(
        task_title=data.task_title,
        deadline=data.deadline,
        priority=data.priority,
        description=data.description,
        status=data.status,
        starred=data.starred,
        reminder=data.reminder,
        category_id=data.category_id
    )

    db.add(new_task)
    db.commit()
    db.refresh(new_task)

    user_task = UserTask(user_id=user.id, task_id=new_task.task_id)
    db.add(user_task)
    db.commit()
    return JSONResponse(
            content={"message": "Task created and linked to user", "task_id": new_task.task_id},
            status_code=200
        )
# delete thetask
@dashBoard.delete("/task/{task_id}")
def delete_task(task_id: int, db: Session = Depends(get_db), user_email=Depends(authorize_user)):
    user = db.query(User).filter(User.email == user_email).first()

    # Check if task is shared with the user
    mapping = db.query(UserTask).filter_by(user_id=user.id, task_id=task_id).first()
    if not mapping:
        raise HTTPException(status_code=403, detail="You are not authorized to delete this task")

    # Delete from user_task table
    db.delete(mapping)

    # Delete the actual task if it exists
    task = db.query(Task).filter_by(task_id=task_id).first()
    if task:
        db.delete(task)
        db.commit()
        return JSONResponse(
            content={"message": "Task deleted successfully"},
            status_code=200
        )
        

    raise HTTPException(status_code=404, detail="Task not found")

# update the task
@dashBoard.put("/task/{task_id}")
def update_task(task_id: int, data: TaskSchema, db: Session = Depends(get_db), user_email=Depends(authorize_user)):
    user = db.query(User).filter(User.email == user_email).first()

    mapping = db.query(UserTask).filter_by(user_id=user.id, task_id=task_id).first()
    if not mapping:
        raise HTTPException(status_code=403, detail="You are not authorized to edit this task")

    task = db.query(Task).filter_by(task_id=task_id).first()
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")

    for attr, value in data.dict(exclude_unset=True).items():
        setattr(task, attr, value)

    db.commit()
    db.refresh(task)
    return JSONResponse(
            content={"message": "Task updated successfully"},
            status_code=200
        )

@dashBoard.patch("/task/{task_id}/star")
def toggle_starred(task_id: int, db: Session = Depends(get_db), user_email=Depends(authorize_user)):
    user = db.query(User).filter(User.email == user_email).first()
    mapping = db.query(UserTask).filter_by(user_id=user.id, task_id=task_id).first()
    if not mapping:
        raise HTTPException(status_code=403, detail="Not authorized for this task")

    task = db.query(Task).filter_by(task_id=task_id).first()
    task.starred = not task.starred
    db.commit()
    return JSONResponse(
            content={"message": f"Task starred = {task.starred}"},
            status_code=200
        )
  



@dashBoard.patch("/task/{task_id}/status")
def update_status(task_id: int, data: StatusUpdate, db: Session = Depends(get_db), user_email=Depends(authorize_user)):
    user = db.query(User).filter(User.email == user_email).first()
    mapping = db.query(UserTask).filter_by(user_id=user.id, task_id=task_id).first()
    if not mapping:
        raise HTTPException(status_code=403, detail="Unauthorized access")

    task = db.query(Task).filter_by(task_id=task_id).first()
    task.status = data.status
    db.commit()
    return JSONResponse(
            content={"message": f"Task status updated to {data.status}"},
            status_code=200
        )

# this one to fetch all task 
@dashBoard.get("/tasks/grouped-by-category")
def get_tasks_grouped_by_category(db: Session = Depends(get_db), user_email=Depends(authorize_user)):
    user = db.query(User).filter(User.email == user_email).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    # Fetch task_ids shared with the user
    task_ids = db.query(UserTask.task_id).filter(UserTask.user_id == user.id).all()
    task_ids = [t[0] for t in task_ids]

    # Fetch task details with category
    tasks = db.query(Task).filter(Task.task_id.in_(task_ids)).all()

    # Group tasks by category
    grouped = {}
    for task in tasks:
        cat_id = task.category.category_id if task.category else None
        cat_name = task.category.category_name if task.category else "Uncategorized"

        if cat_id not in grouped:
            grouped[cat_id] = {
                "category_id": cat_id,
                "category_name": cat_name,
                "tasks": []
            }

        grouped[cat_id]["tasks"].append({
            "task_id": task.task_id,
            "task_title": task.task_title,
            "deadline": task.deadline,
            "priority": task.priority,
            "description": task.description,
            "status": task.status,
            "starred": task.starred,
            "reminder": task.reminder
        })

    return list(grouped.values())

    
    




 
