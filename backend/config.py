from pydantic_settings import BaseSettings
from typing import List

class Settings(BaseSettings):
    PROJECT_NAME: str = "X-Cancer AI API"
    VERSION: str = "1.0.0"
    API_V1_STR: str = "/api/v1"
    
    # CORS Configuration
    # In production, set this to your frontend URL(s)
    ALLOWED_ORIGINS: List[str] = ["*"]
    
    # Model Configuration
    DEVICE: str = "cpu" # Default to CPU for stability on free-tier servers
    MODEL_WEIGHTS_DIR: str = "./models"
    
    class Config:
        case_sensitive = True
        env_file = ".env"

settings = Settings()
