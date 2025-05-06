from fastapi import FastAPI
import uvicorn
from controller.authController import auth as auth_router
from controller.dashBoardController import dashBoard as dashBoard_router

from fastapi.middleware.cors import CORSMiddleware
from fastapi_jwt_auth import AuthJWT
from pydantic import BaseModel


# create flask application
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # ✅ Replace with your frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# JWT settings
class Settings(BaseModel):
    authjwt_secret_key: str = "task_nest_1234567890"
    authjwt_token_location: set = {"headers", "cookies"}
    authjwt_cookie_secure: bool = False  # True in production with HTTPS
    authjwt_cookie_csrf_protect: bool = False  # Optional
    authjwt_access_token_expires: int = 60 * 15  # 15 minutes
    authjwt_refresh_token_expires: int = 60 * 60 * 24 * 15 # 15 days

@AuthJWT.load_config
def get_config():
    return Settings()




# Registering Routers (Equivalent to Flask Blueprints)
app.include_router(auth_router)
app.include_router(dashBoard_router)





if __name__ == "__main__":
      uvicorn.run(app, host="0.0.0.0", port=8000, reload=True)
