from fastapi import APIRouter, HTTPException, Depends
from database.db import users_collection
from models.schemas import LoginModel, UserModel
from services.utils import hash_password
from fastapi_jwt.jwt import JwtAuthorizationCredentials
from datetime import datetime
# from config.jwt_config import Settings

from services.utils import authentication_bearer, refresh_bearer

router = APIRouter()

@router.post('/login')
async def login(data: LoginModel):
    regno = data.regno
    password = data.password
    
    current_time = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    user = users_collection.find_one({"regNo": regno})
    users_collection.update_one({"regNo": regno}, {"$set": {"last_login": current_time}})
    user_data = None
    if user:
        if user.get("password") == hash_password(password):
            # Return only relevant fields matching UserModel
            user_data =  {
                "_id": str(user.get("_id")),
                "regno": user.get("regNo"),
                "name": user.get("name"),
                "department": user.get("department"),
                "year": user.get("year"),
                "last_login": current_time,
                "apti": user.get("apti"),
                "coding": user.get("coding"),
                "chat_durtion": user.get("chat_durtion")
            }
            
            return {
                "access_token": authentication_bearer.create_access_token(subject=user_data),
                "refresh_token": refresh_bearer.create_refresh_token(subject=user_data),
                "user": user_data              
            }
        raise HTTPException(status_code=401, detail="Incorrect Password")

    
    raise HTTPException(status_code=404, detail="User not found. Please Sign-in")


@router.post("/refresh")
async def refresh_token(credentials: JwtAuthorizationCredentials = Depends(refresh_bearer)):
    new_token = authentication_bearer.create_access_token(subject=credentials.subject)
    return {"access_token": new_token}