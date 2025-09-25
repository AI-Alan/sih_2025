import logging
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .config.settings import settings
from .routers import health, chat

app = FastAPI(
    title="ManMitra Chatbot Service",
    version="0.1.0",
    description="FastAPI microservice for ManMitra mental health chatbot (stress, burnout, career, relationships).",
)

# Configure logging
logging.basicConfig(level=getattr(logging, settings.log_level, logging.INFO), format='[%(asctime)s] %(levelname)s %(name)s: %(message)s')
logger = logging.getLogger("chatbot_fastapi")

# CORS for Express/Frontend integration
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_allow_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Routers
app.include_router(health.router, prefix="/health", tags=["health"]) 
app.include_router(chat.router, prefix="/chat", tags=["chat"]) 


@app.get("/")
def root():
    return {"service": "manmitra-chatbot", "status": "ok", "version": app.version}
