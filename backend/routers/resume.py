from fastapi import APIRouter, UploadFile, File, Form, HTTPException
from models.schemas import UploadResponse
from services.resume_processor import generate_data_store
from data_store import sessions, vector_stores
import tempfile, os
import uuid
from datetime import datetime

router = APIRouter()

@router.post("/upload-resume", response_model=UploadResponse)
async def upload_resume(file: UploadFile = File(...), session_id: str = Form(None)):
    if not file.filename.lower().endswith('.pdf'):
        raise HTTPException(status_code=400, detail="Only PDF files are allowed")

    if not session_id:
        session_id = str(uuid.uuid4())

    with tempfile.NamedTemporaryFile(delete=False, suffix=".pdf") as tmp_file:
        tmp_file.write(await file.read())
        tmp_path = tmp_file.name

    try:
        db, chunk_count = generate_data_store(tmp_path, session_id)
        vector_stores[session_id] = db

        sessions[session_id] = {
            'created_at': datetime.now(),
            'chat_history': [],
            'resume_uploaded': True,
            'message_count': 0,
            'db_directory': f'./chroma_db_{session_id}'
        }

        return UploadResponse(
            message="Resume uploaded and processed successfully",
            session_id=session_id,
            chunks_created=chunk_count
        )
    finally:
        os.unlink(tmp_path)
