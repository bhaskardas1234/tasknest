from datetime import timedelta, datetime
from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import JSONResponse
from sqlalchemy.orm import Session
from fastapi_jwt_auth import AuthJWT
from settings import SessionLocal, redis_client
from models import User
from schemas import RegisterUser, LoginUser
from service.authService import create_user

auth = APIRouter(prefix="/auth", tags=["Auth"])

# Dependency to get DB session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# ---------------------- Register ----------------------
@auth.post("/register")
def register(user: RegisterUser, Authorize: AuthJWT = Depends(), db: Session = Depends(get_db)):
    existing_user = db.query(User).filter(User.email == user.email).first()
    if existing_user:
        return JSONResponse(
            content={"status": "error", "message": "User already exists"},
            status_code=400
        )

    new_user = create_user(db, user)

    access_token = Authorize.create_access_token(
        subject=user.email,
        expires_time=timedelta(days=30)  # 30-day token
    )

    return JSONResponse(
        content={"status": "success", "access_token": access_token},
        status_code=201
    )

# ---------------------- Login ----------------------
@auth.post("/login")
def login(user: LoginUser, Authorize: AuthJWT = Depends(), db: Session = Depends(get_db)):
    db_user = db.query(User).filter(User.email == user.email).first()
    
    if not db_user or ( False if db_user.password==""else False if user.password==db_user.password else True):
        raise HTTPException(status_code=401, detail="Invalid email or password")

    access_token = Authorize.create_access_token(
        subject=db_user.email,
        expires_time=timedelta(days=30)  # 30-day token
    )

    return JSONResponse(
        content={"status": "success", "access_token": access_token},
        status_code=200
    )

# ---------------------- Logout ----------------------
@auth.post("/logout")
def logout(Authorize: AuthJWT = Depends()):
    Authorize.jwt_required()

    jti = Authorize.get_raw_jwt()['jti']  # unique identifier for token
    exp_timestamp = Authorize.get_raw_jwt()['exp']
    current_timestamp = int(datetime.utcnow().timestamp())
    ttl = exp_timestamp - current_timestamp

    # Save token's jti in Redis so we can block it later
    redis_client.setex(f"blacklist:{jti}", ttl, "true")

    return {"msg": "Successfully logged out"}

# ---------------------- Protect Route Example ----------------------
@auth.get("/protected")
def protected(Authorize: AuthJWT = Depends()):
    Authorize.jwt_required()

    jti = Authorize.get_raw_jwt()['jti']
    if redis_client.get(f"blacklist:{jti}"):
        raise HTTPException(status_code=401, detail="Token has been revoked")

    current_user = Authorize.get_jwt_subject()
    return {"message": f"Hello {current_user}, you're authorized!"}
