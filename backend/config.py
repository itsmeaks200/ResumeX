from pydantic_settings import BaseSettings
from functools import lru_cache
from pathlib import Path

class Settings(BaseSettings):
    groq_api_key: str = ""
    adzuna_app_id: str = ""
    adzuna_api_key: str = ""
    jsearch_api_key: str = ""
    remotive_api_key: str = ""
    tavily_api_key: str = ""
    
    # Groq Models (using currently available models)
    reasoning_model: str = "llama-3.3-70b-versatile"
    extraction_model: str = "llama-3.3-70b-versatile"
    
    # Temperature settings
    parsing_temp: float = 0.2
    matching_temp: float = 0.3
    suggestion_temp: float = 0.5
    
    class Config:
        env_file = str(Path(__file__).parent / ".env")
        case_sensitive = False

@lru_cache()
def get_settings() -> Settings:
    return Settings()
