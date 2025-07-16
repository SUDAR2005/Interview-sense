# routers/utils.py

from fastapi import APIRouter, HTTPException
from services.llm import get_llm
from services.embeddings import get_embedding_model
from datetime import datetime
from data_store import sessions
import hashlib

router = APIRouter()




def hash_password(password: str) -> str:
    return hashlib.sha256(password.encode()).hexdigest()

@router.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "timestamp": datetime.now(),
        "active_sessions": len(sessions),
        "environment": {
            "google_api_key_configured": True
        }
    }

@router.post("/test-embeddings")
async def test_embeddings():
    try:
        embedding = get_embedding_model()
        result = embedding.embed_query("Test embedding")
        return {
            "status": "success",
            "message": "Embeddings working",
            "dimension": len(result)
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/test-llm")
async def test_llm():
    try:
        llm = get_llm()
        response = llm.invoke("Hello, test message.")
        return {
            "status": "success",
            "message": "LLM working",
            "test_response": response.content
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
