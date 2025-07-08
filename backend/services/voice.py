from fastapi import HTTPException
import speech_recognition as sr

def get_voice_input_from_file(file_path: str):
    """Extract text from audio file"""
    r = sr.Recognizer()
    try:
        with sr.AudioFile(file_path) as source:
            audio = r.record(source)
        text = r.recognize_google(audio)
        return text
    except sr.UnknownValueError:
        raise HTTPException(status_code=400, detail="Could not understand audio")
    except sr.RequestError as e:
        raise HTTPException(status_code=500, detail=f"Speech recognition error: {str(e)}")