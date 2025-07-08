from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
from routers.resume import router as resume_router
from routers.session import router as session_router
from routers.chat import router as chat_router
from routers.voice import router as voice_router
from routers.utils import router as utils_router

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
    allow_headers=["*"],
)

# Include routers
app.include_router(resume_router)
app.include_router(session_router)
app.include_router(chat_router)
app.include_router(voice_router)
app.include_router(utils_router)

@app.get("/")
async def root():
    return {
        "message": "Welcome to HR Interview Chatbot API",
        "version": "1.0.0",
        "description": "An AI-powered HR interview chatbot with resume analysis"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app:app", host="0.0.0.0", port=8000, reload=True)
