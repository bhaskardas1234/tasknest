from datetime import timedelta, datetime
from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import JSONResponse
from sqlalchemy.orm import Session
from fastapi_jwt_auth import AuthJWT
from settings import SessionLocal, redis_client
from models import User,Category,UserCategory
from schemas import RegisterUser, LoginUser,GoogleAuth
from service.authService import create_user
from google.oauth2 import id_token
from google.auth.transport import requests


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

    # Create new user
    new_user = create_user(db, user)

    # Fetch default categories
    default_categories = db.query(Category).filter(
        Category.category_name.in_(["work", "personal", "wishlist", "event", "birthday", "dailyplan"])).all()

    # Map each category to the new user
    for category in default_categories:
        db.add(UserCategory(user_id=new_user.id, category_id=category.category_id))

    db.commit()

    # Generate access and refresh tokens
    access_token = Authorize.create_access_token(subject=user.email, expires_time=timedelta(days=30))
    refresh_token = Authorize.create_refresh_token(subject=user.email)

    # Set refresh token in HttpOnly cookie
    response = JSONResponse(
        content={"status": "success", "access_token": access_token},
        status_code=201
    )
    response.set_cookie(
        "access_token", access_token, httponly=False, secure=False, max_age=timedelta(days=30)
    )
    Authorize.set_refresh_cookies(refresh_token)

    return response


# ---------------------- Google Login -------------------
@auth.post("/google-auth")
def google_login(payload: GoogleAuth, Authorize: AuthJWT = Depends(), db: Session = Depends(get_db)):
    try:
        idinfo = id_token.verify_oauth2_token(
            payload.token,
            requests.Request(),
            "599450515753-huv81qig80su5ik590ggimtj5gn2jtqe.apps.googleusercontent.com"  # Ensure this is your correct Google client ID
        )

        email = idinfo["email"]
        name = idinfo.get("name", "")
        picture = idinfo.get("picture", "")

        user = db.query(User).filter(User.email == email).first()

        if not user:
            google_user_data = RegisterUser(
                username=name,
                password="",  # not used for Google users
                email=email,
                mode="google",
                image=picture,
                profession="",
                institution="",
                phone_number="",
                linkedin_url="",
                gender="",
                country=""
            )

            # Create user with your service
            new_user = create_user(db, google_user_data)

            # Assign default categories
            default_categories = db.query(Category).filter(
                Category.category_name.in_(
                    ["work", "personal", "wishlist", "event", "birthday", "dailyplan"]
                )
            ).all()

            for category in default_categories:
                db.add(UserCategory(user_id=new_user.id, category_id=category.category_id))

            db.commit()
            user = new_user

        # Generate JWTs
        access_token = Authorize.create_access_token(subject=user.email, expires_time=timedelta(days=30))
        refresh_token = Authorize.create_refresh_token(subject=user.email)

        response = JSONResponse(
            content={
                "status": "success",
                "access_token": access_token,
                "email": user.email,
                "name": user.username,
                "picture": user.image
            },
            status_code=200
        )

        Authorize.set_refresh_cookies(refresh_token)
        return response

    except ValueError:
        raise HTTPException(status_code=401, detail="Invalid Google token")


# ---------------------- Login ----------------------
@auth.post("/login")
def login(user: LoginUser, Authorize: AuthJWT = Depends(), db: Session = Depends(get_db)):
    db_user = db.query(User).filter(User.email == user.email).first()

    if not db_user or user.password != db_user.password:
        raise HTTPException(status_code=401, detail="Invalid email or password")

    access_token = Authorize.create_access_token(subject=db_user.email)
    refresh_token = Authorize.create_refresh_token(subject=db_user.email)

    # Set refresh token in HttpOnly cookie
    response = JSONResponse(content={"status": "success", "access_token": access_token}, status_code=200)
    Authorize.set_refresh_cookies(refresh_token)
    return response


# ---------------------- Logout ----------------------
@auth.post("/logout")
def logout(Authorize: AuthJWT = Depends()):
    Authorize.jwt_required()

    jti = Authorize.get_raw_jwt()['jti']
    exp_timestamp = Authorize.get_raw_jwt()['exp']
    current_timestamp = int(datetime.utcnow().timestamp())
    ttl = exp_timestamp - current_timestamp

    redis_client.setex(f"blacklist:{jti}", ttl, "true")

    # Clear refresh token cookie
    response = JSONResponse(content={"msg": "Successfully logged out"})
    Authorize.unset_refresh_cookies(response)  # Unsets the refresh token cookie
    return response


# ---------------------- Refresh Token ----------------------
@auth.post("/refresh")
def refresh(Authorize: AuthJWT = Depends()):
    try:
        Authorize.jwt_refresh_token_required()
    except Exception as e:
        raise HTTPException(status_code=401, detail="Invalid refresh token")

    current_user = Authorize.get_jwt_subject()
    new_access_token = Authorize.create_access_token(subject=current_user)

    return {"access_token": new_access_token}

# # ---------------------- Register ----------------------
# @auth.post("/register")
# def register(user: RegisterUser, Authorize: AuthJWT = Depends(), db: Session = Depends(get_db)):
#     existing_user = db.query(User).filter(User.email == user.email).first()
#     if existing_user:
#         return JSONResponse(
#             content={"status": "error", "message": "User already exists"},
#             status_code=400
#         )

#     # Create new user
#     new_user = create_user(db, user)

#     # Fetch default categories
#     default_categories = db.query(Category).filter(
#         Category.category_name.in_(["work", "personal", "wishlist", "event", "birthday", "dailyplan"])
#     ).all()

#     # Map each category to the new user
#     for category in default_categories:
#         db.add(UserCategory(user_id=new_user.id, category_id=category.category_id))

#     db.commit()

#     # Generate access and refresh tokens
#     access_token = Authorize.create_access_token(
#         subject=user.email,
#         expires_time=timedelta(days=30)
#     )
#     refresh_token = Authorize.create_refresh_token(subject=user.email)

#     # Set refresh token in HttpOnly cookie
#     Authorize.set_refresh_cookies(refresh_token)

#     return JSONResponse(
#         content={"status": "success", "access_token": access_token},
#         status_code=201
#     )
# # ----------------------Sign up with google-------------------
# @auth.post("/google-auth")
# def google_login(payload: GoogleAuth, Authorize: AuthJWT = Depends(), db: Session = Depends(get_db)):
#     try:
#         idinfo = id_token.verify_oauth2_token(
#             payload.token,
#             requests.Request(),
#             "599450515753-huv81qig80su5ik590ggimtj5gn2jtqe.apps.googleusercontent.com"
#         )

#         email = idinfo["email"]
#         name = idinfo.get("name", "")
#         picture = idinfo.get("picture", "")

#         user = db.query(User).filter(User.email == email).first()

#         if not user:
#             # Construct RegisterUser schema to use your create_user function
#             google_user_data = RegisterUser(
#                 username=name,
#                 password="",  # not used for Google users
#                 email=email,
#                 mode="google",
#                 image=picture,
#                 profession="",
#                 institution="",
#                 phone_number="",
#                 linkedin_url="",
#                 gender="",
#                 country=""
#             )

#             # Create user with your service
#             new_user = create_user(db, google_user_data)

#             # Assign default categories
#             default_categories = db.query(Category).filter(
#                 Category.category_name.in_(
#                     ["work", "personal", "wishlist", "event", "birthday", "dailyplan"]
#                 )
#             ).all()

#             for category in default_categories:
#                 db.add(UserCategory(user_id=new_user.id, category_id=category.category_id))

#             db.commit()
#             user = new_user

#         # Generate JWTs
#         access_token = Authorize.create_access_token(subject=user.email, expires_time=timedelta(days=30))
#         refresh_token = Authorize.create_refresh_token(subject=user.email)
#         print(refresh_token)
#         Authorize.set_refresh_cookies(refresh_token)

#         return JSONResponse(
#             content={
#                 "status": "success",
#                 "access_token": access_token,
#                 "email": user.email,
#                 "name": user.username,
#                 "picture": user.image
#             },
#             status_code=200
#         )

#     except ValueError:
#         raise HTTPException(status_code=401, detail="Invalid Google token")

# # ---------------------- Login ----------------------
# @auth.post("/login")
# def login(user: LoginUser, Authorize: AuthJWT = Depends(), db: Session = Depends(get_db)):
#     db_user = db.query(User).filter(User.email == user.email).first()

#     if not db_user or user.password != db_user.password:
#         raise HTTPException(status_code=401, detail="Invalid email or password")

#     access_token = Authorize.create_access_token(subject=db_user.email)
#     refresh_token = Authorize.create_refresh_token(subject=db_user.email)

#     # Set refresh token in HttpOnly cookie
#     Authorize.set_refresh_cookies(refresh_token)

#     return JSONResponse(
#         content={"status": "success", "access_token": access_token},
#         status_code=200
#     )

# # ---------------------- Logout ----------------------

# @auth.post("/logout")
# def logout(Authorize: AuthJWT = Depends()):
#     Authorize.jwt_required()

#     jti = Authorize.get_raw_jwt()['jti']
#     exp_timestamp = Authorize.get_raw_jwt()['exp']
#     current_timestamp = int(datetime.utcnow().timestamp())
#     ttl = exp_timestamp - current_timestamp

#     redis_client.setex(f"blacklist:{jti}", ttl, "true")

#     # Clear refresh token cookie
#     response = JSONResponse(content={"msg": "Successfully logged out"})
#     Authorize.unset_refresh_cookies(response)
#     return response

# @auth.post("/refresh")
# def refresh(Authorize: AuthJWT = Depends()):
#     try:
#         Authorize.jwt_refresh_token_required()
#     except Exception as e:
#         raise HTTPException(status_code=401, detail="Invalid refresh token")

#     current_user = Authorize.get_jwt_subject()
#     new_access_token = Authorize.create_access_token(subject=current_user)

#     return {"access_token": new_access_token}

