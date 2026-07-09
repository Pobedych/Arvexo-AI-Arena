import hashlib
import secrets
from datetime import timedelta

from fastapi import Request, Response
from sqlalchemy.orm import Session

from app.core.config import settings
from app.models.entities import ArenaSession, ArenaUser, now_utc


def aware(value):
    now = now_utc()
    return value if value.tzinfo is not None else value.replace(tzinfo=now.tzinfo)


def hash_token(token: str) -> str:
    return hashlib.sha256(token.encode("utf-8")).hexdigest()


def create_session(db: Session, user: ArenaUser, request: Request, response: Response) -> str:
    token = secrets.token_urlsafe(48)
    session = ArenaSession(
        token_hash=hash_token(token),
        user_id=user.id,
        user_agent=request.headers.get("user-agent"),
        ip_address=request.client.host if request.client else None,
        expires_at=now_utc() + timedelta(days=settings.session_ttl_days),
    )
    db.add(session)
    response.set_cookie(
        settings.session_cookie_name,
        token,
        max_age=settings.session_ttl_days * 24 * 60 * 60,
        httponly=True,
        secure=settings.cookie_secure,
        samesite=settings.cookie_samesite,
        path="/",
    )
    return token


def clear_session_cookie(response: Response) -> None:
    response.delete_cookie(settings.session_cookie_name, path="/")


def get_user_by_session_token(db: Session, token: str | None) -> ArenaUser | None:
    if not token:
        return None
    session = db.query(ArenaSession).filter(ArenaSession.token_hash == hash_token(token)).one_or_none()
    if not session or session.revoked_at is not None or aware(session.expires_at) <= now_utc():
        return None
    user = session.user
    if not user or not user.is_active:
        return None
    return user


def revoke_session_token(db: Session, token: str | None) -> None:
    if not token:
        return
    session = db.query(ArenaSession).filter(ArenaSession.token_hash == hash_token(token)).one_or_none()
    if session and session.revoked_at is None:
        session.revoked_at = now_utc()
