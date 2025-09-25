import os
from pathlib import Path
from dotenv import load_dotenv
from typing import List

# Load environment from project root .env if present
load_dotenv()

class Settings:
    def __init__(self):
        self.env: str = os.getenv("ENV", "development")
        self.port: int = int(os.getenv("CHATBOT_PORT", "5000"))
        self.host: str = os.getenv("CHATBOT_HOST", "0.0.0.0")
        self.log_level: str = os.getenv("LOG_LEVEL", "INFO").upper()

        # Security between Express and this service
        self.api_key: str | None = os.getenv("CHATBOT_API_KEY")

        # CORS
        cors = os.getenv("CORS_ALLOW_ORIGINS", "*")
        self.cors_allow_origins: List[str] = [o.strip() for o in cors.split(",") if o.strip()]

        # Data directory for sqlite and artifacts
        base_dir = os.getenv("CHATBOT_DATA_DIR", str(Path(__file__).resolve().parents[2] / "data"))
        self.data_dir: Path = Path(base_dir)
        self.data_dir.mkdir(parents=True, exist_ok=True)
        self.sqlite_path: Path = self.data_dir / "chatbot.db"
        # Chroma vector store directory (local persistence)
        self.chroma_dir: Path = self.data_dir / "chroma"
        self.chroma_dir.mkdir(parents=True, exist_ok=True)

        # CrewAI + Memory settings
        self.crewai_enabled: bool = os.getenv("CREWAI_ENABLED", "false").lower() == "true"
        # Local embedding model for vector memory
        self.embedding_model: str = os.getenv("EMBEDDING_MODEL", "all-MiniLM-L6-v2")

        # Gemini settings (used when running CrewAI with Gemini LLM)
        self.gemini_api_key: str | None = os.getenv("GEMINI_API_KEY")
        self.gemini_model: str = os.getenv("GEMINI_MODEL", "gemini-1.5-flash")

settings = Settings()
