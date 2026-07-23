import json
import logging
from datetime import datetime, timedelta
from uuid import UUID

from sqlalchemy.orm import Session

from app.core.config import settings
from app.models.entities import (
    ArenaUser,
    Lesson,
    Notification,
    NotificationKind,
    PushSubscription,
    Section,
    Tournament,
    now_utc,
)

logger = logging.getLogger(__name__)


def create_notification(
    db: Session,
    *,
    user_id: UUID,
    kind: NotificationKind,
    title: str,
    body: str,
    href: str,
    dedupe_key: str,
) -> tuple[Notification, bool]:
    existing = (
        db.query(Notification)
        .filter(Notification.user_id == user_id, Notification.dedupe_key == dedupe_key)
        .one_or_none()
    )
    if existing:
        return existing, False

    notification = Notification(
        user_id=user_id,
        kind=kind,
        title=title,
        body=body,
        href=href,
        dedupe_key=dedupe_key,
    )
    db.add(notification)
    db.flush()
    return notification, True


def notify_lesson_published(db: Session, lesson: Lesson) -> int:
    section = db.get(Section, lesson.section_id)
    if not section:
        return 0
    users = (
        db.query(ArenaUser)
        .filter(ArenaUser.is_active == True, ArenaUser.selected_track_id == section.track_id)  # noqa: E712
        .all()
    )
    created = 0
    for user in users:
        _, was_created = create_notification(
            db,
            user_id=user.id,
            kind=NotificationKind.lesson,
            title=f"Новый урок в {section.track.title}",
            body=f"Урок «{lesson.title}» уже доступен в программе.",
            href="/app/track",
            dedupe_key=f"lesson-published:{lesson.id}",
        )
        created += int(was_created)
    return created


def notify_tournament_published(db: Session, tournament: Tournament, users: list[ArenaUser] | None = None) -> int:
    recipients = users or (
        db.query(ArenaUser)
        .filter(ArenaUser.is_active == True, ArenaUser.selected_track_id == tournament.track_id)  # noqa: E712
        .all()
    )
    created = 0
    for user in recipients:
        _, was_created = create_notification(
            db,
            user_id=user.id,
            kind=NotificationKind.tournament,
            title="Объявлен новый турнир",
            body=f"{tournament.title}. Посмотри условия и время старта.",
            href="/app/tournament",
            dedupe_key=f"tournament-published:{tournament.id}",
        )
        created += int(was_created)
    return created


def _send_push(db: Session, user_id: UUID, notification: Notification) -> bool:
    if not settings.web_push_enabled:
        return False
    subscriptions = (
        db.query(PushSubscription)
        .filter(PushSubscription.user_id == user_id, PushSubscription.enabled == True)  # noqa: E712
        .all()
    )
    if not subscriptions:
        return False

    # pywebpush pulls in the cryptography stack. Import it only when there is
    # an actual delivery to make so ordinary API and seed processes stay lean.
    from pywebpush import WebPushException, webpush

    payload = json.dumps(
        {
            "title": notification.title,
            "body": notification.body,
            "href": notification.href,
            "tag": notification.dedupe_key,
        },
        ensure_ascii=False,
    )
    delivered = False
    for subscription in subscriptions:
        try:
            webpush(
                subscription_info={
                    "endpoint": subscription.endpoint,
                    "keys": {"p256dh": subscription.p256dh, "auth": subscription.auth},
                },
                data=payload,
                vapid_private_key=settings.web_push_vapid_private_key,
                vapid_claims={"sub": settings.web_push_vapid_subject},
                ttl=60 * 60 * 3,
                timeout=5,
            )
            delivered = True
        except WebPushException as exc:
            status_code = getattr(exc.response, "status_code", None)
            if status_code in {404, 410}:
                subscription.enabled = False
            else:
                logger.warning("Web Push delivery failed for subscription %s: %s", subscription.id, exc)
    return delivered


def dispatch_streak_reminders(db: Session, current_time: datetime | None = None) -> int:
    current = current_time or now_utc()
    if current.hour != settings.streak_reminder_hour_utc:
        return 0

    today = current.date()
    yesterday = today - timedelta(days=1)
    users = (
        db.query(ArenaUser)
        .filter(
            ArenaUser.is_active == True,  # noqa: E712
            ArenaUser.current_streak > 0,
            ArenaUser.last_active_date == yesterday,
        )
        .all()
    )
    sent = 0
    for user in users:
        notification, _ = create_notification(
            db,
            user_id=user.id,
            kind=NotificationKind.streak_reminder,
            title=f"Серия из {user.current_streak} дней ждёт тебя",
            body="Заверши урок, практику или турнир сегодня, чтобы сохранить огонёк.",
            href="/app/track",
            dedupe_key=f"streak-reminder:{today.isoformat()}",
        )
        if notification.push_sent_at is None and _send_push(db, user.id, notification):
            notification.push_sent_at = current
            sent += 1
    return sent
