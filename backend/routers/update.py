from fastapi import APIRouter, HTTPException
from models.schemas import UpdateModel
from database.db import users_collection
router = APIRouter()

@router.post('/update')
async def update_model(update: UpdateModel):
    user = users_collection.find_one({'regNo': update.regNo})
    if(user):
        users_collection.update_one({'regNo': update.regNo}, {'$set': update.model_dump()})
        return {'message': 'Data updated successfully.'}
    raise HTTPException(status_code=401, detail='Invalid user request')
    
    