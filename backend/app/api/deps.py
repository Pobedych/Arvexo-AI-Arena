from fastapi import Cookie, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.core.config import settings
from app.db.session import get_db
from app.models.entities import ArenaUser, UserRole
from app.services.session_service import get_user_by_session_token


def get_or_create_local_user(db: Session) -> ArenaUser:
    account_user_id = "local-development-user"
    user = db.query(ArenaUser).filter(ArenaUser.account_user_id == account_user_id).one_or_none()
    if user is None:
        user = ArenaUser(
            account_user_id=account_user_id,
            email="developer@localhost",
            display_name="Локальный пользователь",
            role=UserRole.admin,
        )
        db.add(user)
        db.commit()
        db.refresh(user)
    return user


def get_current_user(
    session_token: str | None = Cookie(default=None, alias=settings.session_cookie_name),
    db: Session = Depends(get_db),
) -> ArenaUser:
    user = get_user_by_session_token(db, session_token)
    if not user and settings.app_env == "development":
        user = get_or_create_local_user(db)
    if not user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Authentication required")
    if not user.is_active:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Account is blocked")
    return user


def get_current_admin(current_user: ArenaUser = Depends(get_current_user)) -> ArenaUser:
    if current_user.role != UserRole.admin:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Admin access required")
    return current_user
