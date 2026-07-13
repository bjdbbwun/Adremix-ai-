import os
from dotenv import load_dotenv

load_dotenv()

class Config:
    GEMINI_API_KEY: str = os.getenv("GEMINI_API_KEY", "")
    MODEL_NAME: str = "gemini-3.1-flash-lite"
    TEMPERATURE_DOCTOR: float = 0.7
    TEMPERATURE_GAP: float = 1.0
    TEMPERATURE_PREDICTOR: float = 0.5
    MAX_OUTPUT_TOKENS: int = 8192
    OUTPUT_DIR: str = "output"

    @classmethod
    def validate(cls):
        if not cls.GEMINI_API_KEY:
            raise ValueError("GEMINI_API_KEY غير موجود. ضعه في ملف .env")

config = Config()
