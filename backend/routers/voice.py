# routers/voice.py

from fastapi import APIRouter, UploadFile, File, Form, HTTPException
from models.schemas import VoiceResponse, ChatMessage
from services.voice import get_voice_input_from_file
from routers.chat import chat
from datetime import datetime
import tempfile, os

router = APIRouter()

@router.post("/voice-chat", response_model=VoiceResponse)
async def voice_chat(audio_file: UploadFile = File(...), session_id: str = Form(...)):
    allowed_extensions = ['.wav', '.mp3', '.flac', '.aiff', '.m4a']
    ext = os.path.splitext(audio_file.filename)[1].lower()
    if ext not in allowed_extensions:
        raise HTTPException(status_code=400, detail=f"Unsupported format. Allowed: {allowed_extensions}")

    with tempfile.NamedTemporaryFile(delete=False, suffix=ext) as tmp_file:
        tmp_file.write(await audio_file.read())
        tmp_path = tmp_file.name

    try:
        transcribed_text = get_voice_input_from_file(tmp_path)
        chat_message = ChatMessage(message=transcribed_text, session_id=session_id)
        chat_response = await chat(chat_message)

        return VoiceResponse(
            transcribed_text=transcribed_text,
            response=chat_response.response,
            session_id=session_id,
            timestamp=datetime.now()
        )
    finally:
        os.unlink(tmp_path)
