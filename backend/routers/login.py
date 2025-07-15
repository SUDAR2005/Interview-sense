from fastapi import APIRouter, HTTPException
import hashlib
from database.db import users_collection
from models.schemas import LoginModel, UserModel

router = APIRouter()

def hash_password(password: str) -> str:
    return hashlib.sha256(password.encode()).hexdigest()

@router.post('/login')
async def login(data: LoginModel):
    regno = data.regno
    password = data.password

    user = users_collection.find_one({"regNo": regno})
    if user:
        if user.get("password") == hash_password(password):
            # Return only relevant fields matching UserModel
            return {
                "_id": str(user.get("_id")),
                "regno": user.get("regNo"),
                "name": user.get("name"),
                "department": user.get("department"),
                "year": user.get("year")
            }
        raise HTTPException(status_code=401, detail="Incorrect Password")

    raise HTTPException(status_code=404, detail="User not found. Please Sign-in")
