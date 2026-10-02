from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    google_client_id: str
    gemini_api_key: str

    gemini_model: str = "gemini-3.8-flash"

    frontend_url: str = "http://localhost:3000"

    session_cookie_name: str = "internai_session"
    session_expire_days: int = 7

    database_path: str = "internai.db"

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore",
    )


settings = Settings()