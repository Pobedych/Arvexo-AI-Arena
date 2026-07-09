from functools import lru_cache

from pydantic import AnyHttpUrl, field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8", extra="ignore")

    app_env: str = "development"
    api_host: str = "0.0.0.0"
    api_port: int = 8000
    database_url: str = "sqlite:///./arena_dev.db"

    frontend_url: AnyHttpUrl = "http://localhost:3000"
    account_api_url: AnyHttpUrl = "http://localhost:8032"
    account_sso_start_url: AnyHttpUrl = "http://localhost:8032/sso/start"
    arena_sso_client_id: str = "arvexo-arena"
    arena_sso_client_secret: str = "dev_arena_secret"
    arena_sso_redirect_uri: AnyHttpUrl = "http://localhost:8000/auth/callback"

    session_cookie_name: str = "arena_session"
    session_ttl_days: int = 30
    cookie_secure: bool = False
    cookie_samesite: str = "lax"
    admin_account_ids: list[str] = []
    admin_emails: list[str] = []

    @field_validator("admin_account_ids", "admin_emails", mode="before")
    @classmethod
    def split_csv(cls, value: str | list[str]) -> list[str]:
        if isinstance(value, list):
            return value
        if not value:
            return []
        return [item.strip() for item in value.split(",") if item.strip()]


@lru_cache
def get_settings() -> Settings:
    return Settings()


settings = get_settings()
