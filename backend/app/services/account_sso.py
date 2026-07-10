import secrets
from urllib.parse import urlencode

import httpx
from fastapi import HTTPException, Request, Response, status
from sqlalchemy.orm import Session

from app.core.config import settings
from app.models.entities import ArenaUser, UserRole

STATE_COOKIE = "arena_sso_state"
DEFAULT_RETURN_TO = "/app/dashboard"


def sanitize_return_to(value: str | None) -> str:
    if not value:
        return DEFAULT_RETURN_TO
    if not value.startswith("/") or value.startswith("//") or "\\" in value or "\n" in value or "\r" in value:
        return DEFAULT_RETURN_TO
    return value


def build_start_response(response: Response, return_to: str = DEFAULT_RETURN_TO) -> str:
    state = secrets.token_urlsafe(24)
    safe_return_to = sanitize_return_to(return_to)
    response.set_cookie(STATE_COOKIE, state, max_age=10 * 60, httponly=True, secure=settings.cookie_secure, samesite="lax", path="/")
    response.set_cookie("arena_return_to", safe_return_to, max_age=10 * 60, httponly=True, secure=settings.cookie_secure, samesite="lax", path="/")
    params = {
        "client_id": settings.arena_sso_client_id,
        "redirect_uri": str(settings.arena_sso_redirect_uri),
        "state": state,
    }
    return f"{settings.account_sso_start_url}?{urlencode(params)}"


def validate_state(request: Request, state: str | None) -> str:
    expected = request.cookies.get(STATE_COOKIE)
    if not state or not expected or state != expected:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid SSO state")
    return sanitize_return_to(request.cookies.get("arena_return_to"))


async def exchange_code(code: str) -> dict:
    async with httpx.AsyncClient(timeout=10) as client:
        response = await client.post(
            f"{str(settings.account_api_url).rstrip('/')}/sso/exchange",
            json={
                "client_id": settings.arena_sso_client_id,
                "client_secret": settings.arena_sso_client_secret,
                "code": code,
                "redirect_uri": str(settings.arena_sso_redirect_uri),
            },
        )
    if response.status_code >= 400:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="SSO exchange failed")
    return response.json()["account_user"]


def upsert_arena_user(db: Session, account_user: dict) -> ArenaUser:
    account_id = str(account_user["id"])
    user = db.query(ArenaUser).filter(ArenaUser.account_user_id == account_id).one_or_none()
    email = account_user.get("email")
    display_name = account_user.get("name") or email or "Пользователь Arvexo"
    role = (
        UserRole.admin
        if account_id in settings.admin_account_id_list or (email and email.lower() in settings.admin_email_list)
        else UserRole.user
    )

    if user is None:
        user = ArenaUser(account_user_id=account_id, email=email, display_name=display_name, avatar_url=account_user.get("avatar_url"), role=role)
        db.add(user)
    else:
        user.email = email
        user.display_name = display_name
        user.avatar_url = account_user.get("avatar_url")
        user.role = role
    return user
