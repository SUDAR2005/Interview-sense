from fastapi import APIRouter, HTTPException
from database.db import users_collection
from models.schemas import LoginModel, UserModel
from services.utils import hash_password
# from config.jwt_config import Settings

from services.utils import authentication_bearer, refresh_bearer

router = APIRouter()

@router.post('/login')
async def login(data: LoginModel):
    regno = data.regno
    password = data.password

    user = users_collection.find_one({"regNo": regno})
    user_data = None
    if user:
        if user.get("password") == hash_password(password):
            # Return only relevant fields matching UserModel
            user_data =  {
                "_id": str(user.get("_id")),
                "regno": user.get("regNo"),
                "name": user.get("name"),
                "department": user.get("department"),
                "year": user.get("year")
            }
            return {
                "access_token": authentication_bearer.create_access_token(subject=user_data),
                "refresh_token": refresh_bearer.create_refresh_token(subject=user_data),
                "user": user_data              
            }
        raise HTTPException(status_code=401, detail="Incorrect Password")

    
    raise HTTPException(status_code=404, detail="User not found. Please Sign-in")
