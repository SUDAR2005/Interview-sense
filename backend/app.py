from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
from routers.resume import router as resume_router
from routers.interview import router as session_router
from routers.chat import router as chat_router
from routers.voice import router as voice_router
from routers.utils import router as utils_router
from routers.aptitude import router as aptitude_router
from routers.coding import router as coding_router
from routers.signup import router as signup_router
from routers.login import router as login_router
from routers.update import router as update_router
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
app.include_router(aptitude_router)
app.include_router(coding_router)
app.include_router(signup_router)
app.include_router(login_router)
app.include_router(update_router)

@app.get("/")
async def root():
    return {
        "message": "Welcome to HR Interview Chatbot API",
        "version": "1.0.0",
        "description": "An AI-powered HR interview chatbot with resume analysis"
    }

if __name__ == "__main__":
    import uvicorn
    try:
        uvicorn.run("app:app", host="0.0.0.0", port=8000, reload=True)
    except Exception as e:
        # import traceback
        print(str(e))
