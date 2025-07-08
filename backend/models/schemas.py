# models/schemas.py
from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime

class ChatMessage(BaseModel):
    message: str
    session_id: Optional[str] = None

class ChatResponse(BaseModel):
    response: str
    session_id: str
    timestamp: datetime

class VoiceResponse(BaseModel):
    transcribed_text: str
    response: str
    session_id: str
    timestamp: datetime

class UploadResponse(BaseModel):
    message: str
    session_id: str
    chunks_created: int

class SessionInfo(BaseModel):
    session_id: str
    created_at: datetime
    resume_uploaded: bool
    message_count: int