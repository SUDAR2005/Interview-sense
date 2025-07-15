from fastapi import FastAPI, APIRouter, HTTPException
from models.schemas import SignUpModel
from services import extract_skillrack_data
from database.db import users_collection
import hashlib

# uri = 'http://www.skillrack.com/profile/467065/60b18505f10c543125f8eca3ad204bb6c920'

router = APIRouter()

def hash_password(password: str) -> str:
    return hashlib.sha256(password.encode()).hexdigest()

@router.post('/signup', response_model=SignUpModel)
async def signup(url: str, password: str):
    data = extract_skillrack_data.get_student_data(url=url, year='2026')

    if data['year'] == '2026' and data['department'] == 'IT':
        user_document = {
            "regNo": data["regNo"],
            "name": data["name"],
            "department": data["department"],
            "year": data["year"],
            "password": hash_password(password)
        }

        # Insert into MongoDB
        existing = users_collection.find_one({"regNo": data["regNo"]})
        if existing:
            raise HTTPException(status_code=409, detail="User already registered")
        users_collection.insert_one(user_document)
        return SignUpModel(**data)
    else:
        raise HTTPException(
            status_code=401,
            detail='Only final year IT students are permitted to use the application'
        )