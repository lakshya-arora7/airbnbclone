import os
from typing import List
from pydantic import ConfigDict
from pydantic_settings import BaseSettings

# Absolute path to backend directory: c:\...\backend or /app/backend or /app
BASE_DIR = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
DEFAULT_DB_FILE = os.path.join(BASE_DIR, "airbnb.db").replace("\\", "/")

class Settings(BaseSettings):
    model_config = ConfigDict(case_sensitive=True)

    PROJECT_NAME: str = "Airbnb Clone API"
    API_V1_STR: str = "/api/v1"
    
    # SQLite Database URL - always resolves to backend/airbnb.db unless overridden by env
    DATABASE_URL: str = os.getenv("DATABASE_URL", f"sqlite:///{DEFAULT_DB_FILE}")
    
    # CORS Origins
    BACKEND_CORS_ORIGINS: List[str] = [
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "http://localhost:8000",
        "http://127.0.0.1:8000",
        "*"
    ]
    
    # Static Uploads directory
    UPLOAD_DIR: str = os.path.join(BASE_DIR, "static", "uploads")

settings = Settings()
os.makedirs(settings.UPLOAD_DIR, exist_ok=True)

