from dotenv import load_dotenv
import os
load_dotenv()


class settings:
    MONGO_URI: str = os.getenv("MONGO_URI")
    DATABASE_NAME: str = os.getenv("DATABASE_NAME")

    JWT_SECRET: str = os.getenv("JWT_SECRET")
    ALGORITHM: str = os.getenv("ALGORITHM")
    ACCESS_TOKEN_EXPIRE_MINUTES: int = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES"))

    SUPABASE_URL:str = os.getenv("SUPABASE_URL")
    SUPABASE_KEY:str = os.getenv("SUPABASE_KEY")
    SUPABASE_BUCKET:str = os.getenv("SUPABASE_BUCKET")

settings = settings()
