from fastapi import FastAPI, HTTPException, APIRouter
from pydantic import BaseModel
import hashlib
from database.db import users_collection
from models.schemas import LoginModel

router = APIRouter()


def hash_password(password: str) -> str:
    return hashlib.sha256(password.encode()).hexdigest()

@router.post('/login')
async def login(data: LoginModel):
    regno = data.regno
    password = data.password

    existing = users_collection.find_one({"regNo": regno})
    if existing != None:
        isPasswordCorrect = users_collection.find_one({
            "regNo": regno,
            "password": hash_password(password)
        })
        if isPasswordCorrect:
            return {"message": "Login successful", "regNo": regno}
        raise HTTPException(status_code=401, detail="Incorrect Password")
    raise HTTPException(status_code=404, detail="User not found. Please Sign-in")
