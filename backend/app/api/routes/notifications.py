from hashlib import sha256
from urllib.parse import urlsplit
from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session

from app.api.deps import get_current_user
from app.core.config import settings
from app.db.session import get_db
from app.models.entities import ArenaUser, Notification, PushSubscription, now_utc
from app.schemas.api import (
    NotificationListOut,
    NotificationOut,
    PushConfigOut,
    PushSubscriptionIn,
    PushUnsubscribeIn,
)

router = APIRouter(prefix="/notifications", tags=["notifications"])


def _notification_out(notification: Notification) -> NotificationOut:
    return NotificationOut(
        id=notification.id,
        kind=notification.kind.value,
        title=notification.title,
        body=notification.body,
        href=notification.href,
        created_at=notification.created_at,
        read_at=notification.read_at,
    )


def _endpoint_hash(endpoint: str) -> str:
    return sha256(endpoint.encode("utf-8")).hexdigest()


def _validate_push_endpoint(endpoint: str) -> None:
    parsed = urlsplit(endpoint)
    if parsed.scheme != "https" or not parsed.netloc:
        raise HTTPException(status_code=400, detail="Push endpoint must be an HTTPS URL")


@router.get("", response_model=NotificationListOut)
def list_notifications(
    limit: int = Query(default=20, ge=1, le=50),
    user: ArenaUser = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    rows = (
        db.query(Notification)
        .filter(Notification.user_id == user.id)
        .order_by(Notification.created_at.desc())
        .limit(limit)
        .all()
    )
    unread_count = (
        db.query(Notification)
        .filter(Notification.user_id == user.id, Notification.read_at.is_(None))
        .count()
    )
    return NotificationListOut(items=[_notification_out(row) for row in rows], unread_count=unread_count)


@router.post("/{notification_id}/read", response_model=NotificationOut)
def read_notification(
    notification_id: UUID,
    user: ArenaUser = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    notification = (
        db.query(Notification)
        .filter(Notification.id == notification_id, Notification.user_id == user.id)
        .one_or_none()
    )
    if not notification:
        raise HTTPException(status_code=404, detail="Notification not found")
    if notification.read_at is None:
        notification.read_at = now_utc()
        db.commit()
        db.refresh(notification)
    return _notification_out(notification)


@router.post("/read-all")
def read_all_notifications(user: ArenaUser = Depends(get_current_user), db: Session = Depends(get_db)):
    updated = (
        db.query(Notification)
        .filter(Notification.user_id == user.id, Notification.read_at.is_(None))
        .update({"read_at": now_utc()}, synchronize_session=False)
    )
    db.commit()
    return {"ok": True, "updated": updated}


@router.get("/push/config", response_model=PushConfigOut)
def push_config(user: ArenaUser = Depends(get_current_user), db: Session = Depends(get_db)):
    subscribed = (
        db.query(PushSubscription)
        .filter(PushSubscription.user_id == user.id, PushSubscription.enabled == True)  # noqa: E712
        .count()
        > 0
    )
    return PushConfigOut(
        enabled=settings.web_push_enabled,
        public_key=settings.web_push_vapid_public_key or None,
        subscribed=subscribed,
    )


@router.post("/push/subscribe", response_model=PushConfigOut)
def subscribe_push(
    payload: PushSubscriptionIn,
    user: ArenaUser = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    if not settings.web_push_enabled:
        raise HTTPException(status_code=503, detail="Web Push is not configured")
    _validate_push_endpoint(payload.endpoint)
    endpoint_hash = _endpoint_hash(payload.endpoint)
    subscription = db.query(PushSubscription).filter(PushSubscription.endpoint_hash == endpoint_hash).one_or_none()
    if not subscription:
        subscription = PushSubscription(
            user_id=user.id,
            endpoint_hash=endpoint_hash,
            endpoint=payload.endpoint,
            p256dh=payload.keys.p256dh,
            auth=payload.keys.auth,
        )
        db.add(subscription)
    else:
        subscription.user_id = user.id
        subscription.endpoint = payload.endpoint
        subscription.p256dh = payload.keys.p256dh
        subscription.auth = payload.keys.auth
        subscription.enabled = True
    db.commit()
    return PushConfigOut(enabled=True, public_key=settings.web_push_vapid_public_key, subscribed=True)


@router.delete("/push/subscribe", response_model=PushConfigOut)
def unsubscribe_push(
    payload: PushUnsubscribeIn,
    user: ArenaUser = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    endpoint_hash = _endpoint_hash(payload.endpoint)
    subscription = (
        db.query(PushSubscription)
        .filter(PushSubscription.user_id == user.id, PushSubscription.endpoint_hash == endpoint_hash)
        .one_or_none()
    )
    if subscription:
        subscription.enabled = False
        db.commit()
    return PushConfigOut(
        enabled=settings.web_push_enabled,
        public_key=settings.web_push_vapid_public_key or None,
        subscribed=False,
    )
