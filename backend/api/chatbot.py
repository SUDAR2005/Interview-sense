from fastapi import FastAPI, File, UploadFile, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
import os
import tempfile
import shutil
from langchain_community.document_loaders import PyPDFLoader
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_google_genai import GoogleGenerativeAIEmbeddings, ChatGoogleGenerativeAI
from langchain_community.vectorstores import Chroma
from chromadb.config import Settings
from langchain_core.prompts import PromptTemplate
from langchain.schema.runnable import RunnablePassthrough
from langchain.schema.output_parser import StrOutputParser
from dotenv import load_dotenv
import speech_recognition as sr
import uuid
from datetime import datetime
import json

# Load environment variables
load_dotenv()

app = FastAPI(
    title="HR Interview Chatbot API",
    description="An AI-powered HR interview chatbot with resume analysis",
    version="1.0.0"
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

# Pydantic models for request/response
class ChatMessage(BaseModel):
    message: str
    session_id: Optional[str] = None

class ChatResponse(BaseModel):
    response: str
    session_id: str
    timestamp: datetime

class SessionInfo(BaseModel):
    session_id: str
    created_at: datetime
    resume_uploaded: bool
    message_count: int

class UploadResponse(BaseModel):
    message: str
    session_id: str
    chunks_created: int

class VoiceResponse(BaseModel):
    transcribed_text: str
    response: str
    session_id: str
    timestamp: datetime

# Global storage for sessions and chat histories
sessions = {}
vector_stores = {}

# HR Prompt Template
hr_prompt_template = """
You are an experienced HR interviewer conducting a professional interview. Based on the candidate's resume information provided below, ask relevant and insightful questions.

RESUME CONTEXT:
{context}

CONVERSATION HISTORY:
{chat_history}

CURRENT QUESTION/RESPONSE: {question}

Guidelines for your behavior:
1. Act as a professional, friendly HR interviewer
2. Ask follow-up questions based on the resume content
3. Explore technical skills, experience, and soft skills
4. Ask about projects, achievements, and career goals
5. Keep questions conversational and engaging
6. If the candidate asks about the company/role, provide general positive responses
7. Gradually progress from basic questions to more detailed technical/behavioral ones

If this is the start of conversation, introduce yourself and begin with an opening question.
If the candidate has responded, acknowledge their answer and ask appropriate follow-up questions.

Response:"""

def load_document(path: str):
    """Load a document from a given path"""
    _, ext = os.path.splitext(path)
    if ext.lower() != '.pdf':
        raise TypeError(f"Expected a PDF file, received {ext}")
    loader = PyPDFLoader(path)
    return loader.load()

def split_text(documents):
    """Split the document using text splitter"""
    splitter = RecursiveCharacterTextSplitter(
        chunk_size=300,
        chunk_overlap=100,
        length_function=len,
        add_start_index=True,
    )
    texts = splitter.split_documents(documents)
    print(f"Split {len(documents)} documents into {len(texts)} chunks.")
    return texts

def store_vectordb(embedding, texts, directory='./chroma_db'):
    """Create a vector database"""
    db = Chroma.from_documents(
        texts, 
        embedding, 
        persist_directory=directory,
        client_settings=Settings(anonymized_telemetry=False)
    )
    return db

def generate_data_store(path: str, session_id: str, model='Gemini'):
    """Generate data store for a given PDF path and session"""
    documents = load_document(path=path)
    chunks = split_text(documents=documents)
    
    if model == 'Gemini':
        embedding = GoogleGenerativeAIEmbeddings(
            model='models/embedding-001', 
            google_api_key=os.getenv('GOOGLE_API_KEY')
        )
        db_directory = f'./chroma_db_{session_id}'
        db = store_vectordb(embedding=embedding, texts=chunks, directory=db_directory)
        return db, len(chunks)

def build_rag_chain(db, prompt_template, llm):
    """Build RAG chain"""
    rag_chain = (
        {"context": db.as_retriever(), "chat_history": RunnablePassthrough(), "question": RunnablePassthrough()} 
        | prompt_template 
        | llm
        | StrOutputParser() 
    )
    return rag_chain

def format_chat_history(history):
    """Format chat history for prompt"""
    return "\n".join(history)

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

@app.get("/")
async def root():
    """Root endpoint with API information"""
    return {
        "message": "Welcome to HR Interview Chatbot API",
        "version": "1.0.0",
        "description": "An AI-powered HR interview chatbot with resume analysis",
        "endpoints": {
            "upload_resume": "POST /upload-resume - Upload and process PDF resume",
            "chat": "POST /chat - Chat with HR interviewer",
            "voice_chat": "POST /voice-chat - Voice input processing",
            "start_interview": "POST /start-interview - Start new interview session",
            "sessions": "GET /sessions - List all sessions",
            "session_info": "GET /sessions/{session_id} - Get session details",
            "chat_history": "GET /sessions/{session_id}/history - Get chat history",
            "reset_session": "POST /sessions/{session_id}/reset - Reset chat history",
            "delete_session": "DELETE /sessions/{session_id} - Delete session"
        }
    }

@app.post("/upload-resume", response_model=UploadResponse)
async def upload_resume(file: UploadFile = File(...), session_id: Optional[str] = Form(None)):
    """Upload and process resume PDF"""
    try:
        # Validate file type
        if not file.filename.lower().endswith('.pdf'):
            raise HTTPException(status_code=400, detail="Only PDF files are allowed")
        
        # Generate session ID if not provided
        if not session_id:
            session_id = str(uuid.uuid4())
        
        # Create temporary file
        with tempfile.NamedTemporaryFile(delete=False, suffix='.pdf') as tmp_file:
            content = await file.read()
            tmp_file.write(content)
            tmp_path = tmp_file.name
        
        try:
            # Process document and create vector store
            db, chunk_count = generate_data_store(tmp_path, session_id)
            
            # Store vector database for session
            vector_stores[session_id] = db
            
            # Initialize or update session
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
            # Clean up temporary file
            os.unlink(tmp_path)
            
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing resume: {str(e)}")

@app.post("/start-interview")
async def start_interview(session_id: Optional[str] = None):
    """Start a new interview session"""
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
        "instructions": "Please upload your resume using the /upload-resume endpoint to begin the interview"
    }

@app.post("/chat", response_model=ChatResponse)
async def chat(chat_message: ChatMessage):
    """Chat with the HR interviewer"""
    try:
        session_id = chat_message.session_id
        if not session_id:
            raise HTTPException(status_code=400, detail="Session ID is required")
        
        if session_id not in sessions:
            raise HTTPException(status_code=404, detail="Session not found. Please start a new session.")
        
        session = sessions[session_id]
        
        # Check if resume is uploaded
        if not session['resume_uploaded']:
            return ChatResponse(
                response="Please upload your resume first using the /upload-resume endpoint to begin the interview.",
                session_id=session_id,
                timestamp=datetime.now()
            )
        
        # Get vector store for session
        db = vector_stores.get(session_id)
        if not db:
            raise HTTPException(status_code=400, detail="Resume data not found. Please re-upload your resume.")
        
        # Initialize LLM and prompt template
        llm = ChatGoogleGenerativeAI(
            model='gemini-2.0-flash-exp', 
            google_api_key=os.getenv('GOOGLE_API_KEY')
        )
        
        prompt_template = PromptTemplate(
            input_variables=["context", "chat_history", "question"],
            template=hr_prompt_template,
        )
        
        # Build RAG chain
        rag_chain = build_rag_chain(db, prompt_template, llm)
        
        # Format chat history
        formatted_history = format_chat_history(session['chat_history'])
        
        # Create prompt
        prompt = prompt_template.invoke({
            "context": "",
            "chat_history": formatted_history,
            "question": chat_message.message
        })
        
        # Get response from RAG chain
        response = rag_chain.invoke(prompt.text)
        
        # Update session history
        session['chat_history'].append(f"Candidate: {chat_message.message}")
        session['chat_history'].append(f"HR: {response}")
        session['message_count'] += 1
        
        return ChatResponse(
            response=response,
            session_id=session_id,
            timestamp=datetime.now()
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error in chat: {str(e)}")

@app.post("/voice-chat", response_model=VoiceResponse)
async def voice_chat(audio_file: UploadFile = File(...), session_id: str = Form(...)):
    """Process voice input and return text response"""
    try:
        if session_id not in sessions:
            raise HTTPException(status_code=404, detail="Session not found")
        
        # Validate audio file
        allowed_extensions = ['.wav', '.mp3', '.flac', '.aiff', '.m4a']
        file_ext = os.path.splitext(audio_file.filename)[1].lower()
        if file_ext not in allowed_extensions:
            raise HTTPException(status_code=400, detail=f"Unsupported audio format. Allowed: {allowed_extensions}")
        
        # Save uploaded audio file temporarily
        with tempfile.NamedTemporaryFile(delete=False, suffix=file_ext) as tmp_file:
            content = await audio_file.read()
            tmp_file.write(content)
            tmp_path = tmp_file.name
        
        try:
            # Convert speech to text
            transcribed_text = get_voice_input_from_file(tmp_path)
            
            # Process the text message using existing chat logic
            chat_message = ChatMessage(message=transcribed_text, session_id=session_id)
            chat_response = await chat(chat_message)
            
            return VoiceResponse(
                transcribed_text=transcribed_text,
                response=chat_response.response,
                session_id=session_id,
                timestamp=datetime.now()
            )
                
        finally:
            # Clean up temporary file
            os.unlink(tmp_path)
            
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing voice input: {str(e)}")

@app.get("/sessions", response_model=List[SessionInfo])
async def get_sessions():
    """Get all active sessions"""
    session_list = []
    for session_id, session_data in sessions.items():
        session_list.append(SessionInfo(
            session_id=session_id,
            created_at=session_data['created_at'],
            resume_uploaded=session_data['resume_uploaded'],
            message_count=session_data['message_count']
        ))
    return session_list

@app.get("/sessions/{session_id}", response_model=SessionInfo)
async def get_session_info(session_id: str):
    """Get information about a specific session"""
    if session_id not in sessions:
        raise HTTPException(status_code=404, detail="Session not found")
    
    session_data = sessions[session_id]
    return SessionInfo(
        session_id=session_id,
        created_at=session_data['created_at'],
        resume_uploaded=session_data['resume_uploaded'],
        message_count=session_data['message_count']
    )

@app.get("/sessions/{session_id}/history")
async def get_chat_history(session_id: str):
    """Get chat history for a session"""
    if session_id not in sessions:
        raise HTTPException(status_code=404, detail="Session not found")
    
    return {
        "session_id": session_id,
        "chat_history": sessions[session_id]['chat_history'],
        "message_count": sessions[session_id]['message_count']
    }

@app.post("/sessions/{session_id}/reset")
async def reset_session(session_id: str):
    """Reset chat history for a session"""
    if session_id not in sessions:
        raise HTTPException(status_code=404, detail="Session not found")
    
    sessions[session_id]['chat_history'] = []
    sessions[session_id]['message_count'] = 0
    
    return {"message": f"Session {session_id} chat history reset successfully"}

@app.delete("/sessions/{session_id}")
async def delete_session(session_id: str):
    """Delete a session and cleanup resources"""
    if session_id not in sessions:
        raise HTTPException(status_code=404, detail="Session not found")
    
    try:
        # Remove from memory
        session_data = sessions.pop(session_id)
        if session_id in vector_stores:
            vector_stores.pop(session_id)
        
        # Clean up database directory
        db_directory = session_data.get('db_directory')
        if db_directory and os.path.exists(db_directory):
            shutil.rmtree(db_directory)
        
        return {"message": f"Session {session_id} deleted successfully"}
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error deleting session: {str(e)}")

@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "timestamp": datetime.now(),
        "active_sessions": len(sessions),
        "environment": {
            "google_api_key_configured": bool(os.getenv('GOOGLE_API_KEY'))
        }
    }

# Additional utility endpoints
@app.post("/test-embeddings")
async def test_embeddings():
    """Test if embeddings are working correctly"""
    try:
        embedding = GoogleGenerativeAIEmbeddings(
            model='models/embedding-001', 
            google_api_key=os.getenv('GOOGLE_API_KEY')
        )
        test_text = "This is a test text for embedding"
        result = embedding.embed_query(test_text)
        return {
            "status": "success",
            "message": "Embeddings are working correctly",
            "embedding_dimension": len(result)
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Embedding test failed: {str(e)}")

@app.post("/test-llm")
async def test_llm():
    """Test if LLM is working correctly"""
    try:
        llm = ChatGoogleGenerativeAI(
            model='gemini-2.0-flash-exp', 
            google_api_key=os.getenv('GOOGLE_API_KEY')
        )
        response = llm.invoke("Hello, this is a test message. Please respond briefly.")
        return {
            "status": "success",
            "message": "LLM is working correctly",
            "test_response": response.content
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"LLM test failed: {str(e)}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000, reload=True)