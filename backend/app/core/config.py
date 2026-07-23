from functools import lru_cache

from pydantic import AnyHttpUrl
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
    admin_account_ids: str = ""
    admin_emails: str = ""
    tournament_scheduler_enabled: bool = True
    tournament_scheduler_interval_seconds: int = 30
    web_push_vapid_public_key: str = ""
    web_push_vapid_private_key: str = ""
    web_push_vapid_subject: str = "mailto:support@arvexo.ru"
    streak_reminder_hour_utc: int = 17

    @staticmethod
    def split_csv(value: str) -> list[str]:
        if not value:
            return []
        return [item.strip() for item in value.split(",") if item.strip()]

    @property
    def admin_account_id_list(self) -> list[str]:
        return self.split_csv(self.admin_account_ids)

    @property
    def admin_email_list(self) -> list[str]:
        return [email.lower() for email in self.split_csv(self.admin_emails)]

    @property
    def web_push_enabled(self) -> bool:
        return bool(self.web_push_vapid_public_key and self.web_push_vapid_private_key)


def validate_production_settings(settings: "Settings") -> None:
    if settings.app_env != "production":
        return
    if settings.arena_sso_client_secret == "dev_arena_secret":
        raise ValueError("Default SSO secret is forbidden in production")
    if not settings.cookie_secure:
        raise ValueError("Secure cookies are required in production")
    if str(settings.frontend_url).startswith("http://"):
        raise ValueError("Production frontend_url must use HTTPS")
    if str(settings.account_api_url).startswith("http://"):
        raise ValueError("Production account_api_url must use HTTPS")
    if settings.database_url.startswith("sqlite"):
        raise ValueError("Production database_url must not be SQLite")
    if bool(settings.web_push_vapid_public_key) != bool(settings.web_push_vapid_private_key):
        raise ValueError("Both Web Push VAPID keys must be configured together")
    if settings.web_push_enabled and not settings.web_push_vapid_subject.startswith(("mailto:", "https://")):
        raise ValueError("Web Push VAPID subject must start with mailto: or https://")


@lru_cache
def get_settings() -> Settings:
    return Settings()


settings = get_settings()
