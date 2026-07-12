from uuid import UUID

from sqlalchemy.orm import Session

from app.models.entities import AdminActionLog, ArenaUser


def log_admin_action(db: Session, admin: ArenaUser, action: str, target_type: str, target_id: UUID | str | None = None, description: str = "") -> None:
    """§14.11: record a minimal admin action audit trail entry. Caller is responsible for committing."""
    db.add(
        AdminActionLog(
            admin_id=admin.id,
            action=action,
            target_type=target_type,
            target_id=str(target_id) if target_id is not None else None,
            description=description,
        )
    )
