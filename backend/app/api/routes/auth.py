from fastapi import APIRouter, Depends, Request, Response
from fastapi.responses import RedirectResponse
from sqlalchemy.orm import Session

from app.api.deps import get_current_user
from app.core.config import settings
from app.db.session import get_db
from app.models.entities import ArenaUser
from app.schemas.api import UserOut
from app.services.account_sso import build_start_response, exchange_code, upsert_arena_user
from app.services.session_service import clear_session_cookie, create_session, revoke_session_token

router = APIRouter(prefix="/auth", tags=["auth"])


@router.get("/start")
def auth_start(response: Response, return_to: str = "/app/dashboard") -> RedirectResponse:
    return RedirectResponse(build_start_response(response, return_to), status_code=302)


@router.get("/callback")
async def auth_callback(code: str, state: str, request: Request, response: Response, db: Session = Depends(get_db)) -> RedirectResponse:
    from app.services.account_sso import validate_state

    return_to = validate_state(request, state)
    account_user = await exchange_code(code)
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
def me(current_user: ArenaUser = Depends(get_current_user)) -> ArenaUser:
    return current_user
