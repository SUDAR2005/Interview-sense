from fastapi import FastAPI, APIRouter, HTTPException
from models.schemas import UserModel, signUpReq
from services import extract_skillrack_data
from database.db import users_collection
import hashlib
from services.utils import hash_password

# uri = 'http://www.skillrack.com/profile/467065/60b18505f10c543125f8eca3ad204bb6c920'

router = APIRouter()

@router.post('/signup', response_model=UserModel)
async def signup(load: signUpReq):
    data = extract_skillrack_data.get_student_data(url=load.url, year='2026')
    print(data)
    if data['year'] == '2026' and data['department'] == 'IT':
        user_document = {
            "regNo": data["regNo"],
            "name": data["name"],
            "department": data["department"],
            "year": data["year"],
            "password": hash_password(load.password),
            "last_logged_in": None,
            "apti": 0,
            "coding": 0,
            "chat_durtion": 0
        }

        # Insert into MongoDB
        existing = users_collection.find_one({"regNo": data["regNo"]})
        if existing:
            raise HTTPException(status_code=409, detail="User already registered")
        users_collection.insert_one(user_document)
        return UserModel(**data)
    else:
        raise HTTPException(
            status_code=401,
            detail='Only final year IT students are permitted to use the application'
        )