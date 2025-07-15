from fastapi import FastAPI, HTTPException, APIRouter
import hashlib
from database.db import users_collection

router = APIRouter()


def hash_password(password: str) -> str:
    return hashlib.sha256(password.encode()).hexdigest()

@router.post('/login')
def login(regno, password):
    existing = users_collection.find_one({"regNo": regno, 'password': hash_password(password)})
    if existing:
        return {"message": "Login successful", "regNo": regno}
    return {"message": "User doesn't exist. Create a user and Sign in !"}