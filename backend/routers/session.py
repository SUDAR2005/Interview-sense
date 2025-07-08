# routers/session.py

from fastapi import APIRouter, HTTPException
from models.schemas import SessionInfo
from data_store import sessions, vector_stores
from typing import List
from datetime import datetime
import os, shutil

router = APIRouter()

@router.post("/start-interview")
async def start_interview(session_id: str = None):
    import uuid
    if not session_id:
        session_id = str(uuid.uuid4())

    if session_id not in sessions:
        sessions[session_id] = {
            'created_at': datetime.now(),
            'chat_history': [],
            'resume_uploaded': False,
            'message_count': 0
        }

    return {
        "message": "Interview session started",
        "session_id": session_id,
        "instructions": "Please upload your resume using the /upload-resume endpoint."
    }

@router.get("/sessions", response_model=List[SessionInfo])
async def get_sessions():
    return [
        SessionInfo(
            session_id=sid,
            created_at=data['created_at'],
            resume_uploaded=data['resume_uploaded'],
            message_count=data['message_count']
        ) for sid, data in sessions.items()
    ]

@router.get("/sessions/{session_id}", response_model=SessionInfo)
async def get_session_info(session_id: str):
    if session_id not in sessions:
        raise HTTPException(status_code=404, detail="Session not found")
    data = sessions[session_id]
    return SessionInfo(
        session_id=session_id,
        created_at=data['created_at'],
        resume_uploaded=data['resume_uploaded'],
        message_count=data['message_count']
    )

@router.get("/sessions/{session_id}/history")
async def get_chat_history(session_id: str):
    if session_id not in sessions:
        raise HTTPException(status_code=404, detail="Session not found")
    return {
        "session_id": session_id,
        "chat_history": sessions[session_id]['chat_history'],
        "message_count": sessions[session_id]['message_count']
    }

@router.post("/sessions/{session_id}/reset")
async def reset_session(session_id: str):
    if session_id not in sessions:
        raise HTTPException(status_code=404, detail="Session not found")
    sessions[session_id]['chat_history'] = []
    sessions[session_id]['message_count'] = 0
    return {"message": f"Session {session_id} chat history reset successfully"}

@router.delete("/sessions/{session_id}")
async def delete_session(session_id: str):
    if session_id not in sessions:
        raise HTTPException(status_code=404, detail="Session not found")
    try:
        session_data = sessions.pop(session_id)
        vector_stores.pop(session_id, None)
        db_directory = session_data.get('db_directory')
        if db_directory and os.path.exists(db_directory):
            shutil.rmtree(db_directory)
        return {"message": f"Session {session_id} deleted successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error deleting session: {str(e)}")
