# routers/chat.py
from fastapi import APIRouter, HTTPException
from models.schemas import ChatMessage, ChatResponse
from data_store import sessions, vector_stores
from services.llm import get_llm, hr_prompt_template
from services.rag import build_rag_chain, format_chat_history
from datetime import datetime

import os
import shutil
from fastapi import Query

router = APIRouter()

@router.post("/chat", response_model=ChatResponse)
async def chat(chat_message: ChatMessage):
    session_id = chat_message.session_id
    if not session_id:
        raise HTTPException(status_code=400, detail="Session ID is required")

    if session_id not in sessions:
        raise HTTPException(status_code=404, detail="Session not found. Please start a new session.")

    session = sessions[session_id]
    if not session['resume_uploaded']:
        return ChatResponse(
            response="Please upload your resume first using the /upload-resume endpoint.",
            session_id=session_id,
            timestamp=datetime.now()
        )

    db = vector_stores.get(session_id)
    if not db:
        raise HTTPException(status_code=400, detail="Resume data not found. Please re-upload your resume.")

    llm = get_llm()
    rag_chain = build_rag_chain(db, hr_prompt_template, llm)

    formatted_history = format_chat_history(session['chat_history'])
    response = rag_chain.invoke({
        "context": "",
        "chat_history": formatted_history,
        "question": chat_message.message
    })

    session['chat_history'].append(f"Candidate: {chat_message.message}")
    session['chat_history'].append(f"HR: {response}")
    session['message_count'] += 1

    return ChatResponse(
        response=response,
        session_id=session_id,
        timestamp=datetime.now()
    )

@router.post("/end-session")
async def end_session(session_id: str = Query(...)):
    # Clean up session and vector store
    if session_id in sessions:
        del sessions[session_id]
    print(vector_stores[session_id])
    if session_id in vector_stores:
        del vector_stores[session_id]

    # Delete the persistent directory
    db_directory = f"./chroma_db_{session_id}"
    if os.path.exists(db_directory):
        shutil.rmtree(db_directory)

    return {"message": f"Session {session_id} ended and data deleted."}

