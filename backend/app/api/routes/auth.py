from fastapi import APIRouter, Depends, HTTPException, Request, Response
from fastapi.responses import RedirectResponse
from sqlalchemy.orm import Session

from app.api.deps import get_current_user
from app.core.config import settings
from app.db.session import get_db
from app.models.entities import ArenaUser
from app.schemas.api import UserOut
from app.services.account_sso import build_start_response, exchange_code, upsert_arena_user
from app.services.gamification import compute_arena_score, current_streak_state
from app.services.session_service import clear_session_cookie, create_session, revoke_session_token

router = APIRouter(prefix="/auth", tags=["auth"])


@router.get("/start")
def auth_start(response: Response, return_to: str = "/app/dashboard") -> RedirectResponse:
    url = build_start_response(response, return_to)
    redirect = RedirectResponse(url, status_code=302)
    for header in response.raw_headers:
        if header[0].lower() == b"set-cookie":
            redirect.raw_headers.append(header)
    return redirect


@router.get("/callback")
async def auth_callback(code: str, state: str, request: Request, response: Response, db: Session = Depends(get_db)) -> RedirectResponse:
    from app.services.account_sso import validate_state

    try:
        return_to = validate_state(request, state)
        account_user = await exchange_code(code)
    except HTTPException:
        failed = RedirectResponse(f"{settings.frontend_url}/login?reason=auth_failed", status_code=302)
        failed.delete_cookie("arena_sso_state", path="/")
        failed.delete_cookie("arena_return_to", path="/")
        return failed

    user = upsert_arena_user(db, account_user)
    db.flush()
    create_session(db, user, request, response)
    db.commit()
    redirect = RedirectResponse(f"{settings.frontend_url}{return_to}", status_code=302)
    for header in response.raw_headers:
        if header[0].lower() == b"set-cookie":
            redirect.raw_headers.append(header)
    redirect.delete_cookie("arena_sso_state", path="/")
    redirect.delete_cookie("arena_return_to", path="/")
    return redirect


@router.post("/logout")
def logout(
    response: Response,
    arena_session: str | None = None,
    request: Request = None,
    db: Session = Depends(get_db),
) -> dict[str, bool]:
    token = request.cookies.get(settings.session_cookie_name) if request else arena_session
    revoke_session_token(db, token)
    db.commit()
    clear_session_cookie(response)
    return {"ok": True}


@router.get("/me", response_model=UserOut)
def me(current_user: ArenaUser = Depends(get_current_user), db: Session = Depends(get_db)) -> UserOut:
    current_user.arena_score = compute_arena_score(db, current_user)
    current_streak, streak_extended_today = current_streak_state(db, current_user)
    return UserOut.model_validate(current_user).model_copy(
        update={
            "current_streak": current_streak,
            "streak_extended_today": streak_extended_today,
        }
    )
