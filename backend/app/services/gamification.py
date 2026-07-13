from datetime import timedelta

from sqlalchemy import func
from sqlalchemy.orm import Session

from app.models.entities import (
    ActivityLog,
    ArenaUser,
    LessonProgress,
    LessonStatus,
    ParticipationStatus,
    Tournament,
    TournamentAttempt,
    TournamentStatus,
    now_utc,
)


def record_activity(db: Session, user: ArenaUser) -> None:
    """Update the daily streak and activity log for any qualifying learning activity (lesson, practice, tournament)."""
    today = now_utc().date()

    log = db.query(ActivityLog).filter(ActivityLog.user_id == user.id, ActivityLog.activity_date == today).one_or_none()
    if not log:
        log = ActivityLog(user_id=user.id, activity_date=today, action_count=0)
        db.add(log)
    log.action_count += 1

    if user.last_active_date == today:
        return
    if user.last_active_date == today - timedelta(days=1):
        user.current_streak += 1
    else:
        user.current_streak = 1
    user.last_active_date = today
    user.longest_streak = max(user.longest_streak, user.current_streak)


def activity_history(db: Session, user: ArenaUser, days: int) -> list[dict]:
    """Return a daily activity series for the requested trailing range."""
    days = max(1, days)
    today = now_utc().date()
    start = today - timedelta(days=days - 1)
    rows = (
        db.query(ActivityLog.activity_date, ActivityLog.action_count)
        .filter(ActivityLog.user_id == user.id, ActivityLog.activity_date >= start, ActivityLog.activity_date <= today)
        .all()
    )
    progress_rows = (
        db.query(LessonProgress.completed_at, LessonProgress.best_score)
        .filter(
            LessonProgress.user_id == user.id,
            LessonProgress.status == LessonStatus.completed,
            LessonProgress.completed_at.isnot(None),
        )
        .all()
    )
    counts = {row.activity_date: row.action_count for row in rows}
    xp_counts: dict = {}
    for row in progress_rows:
        completed_date = row.completed_at.date()
        if start <= completed_date <= today:
            xp_counts[completed_date] = xp_counts.get(completed_date, 0) + row.best_score
    return [
        {
            "date": (start + timedelta(days=offset)).isoformat(),
            "count": counts.get(start + timedelta(days=offset), 0),
            "xp": xp_counts.get(start + timedelta(days=offset), 0),
        }
        for offset in range(days)
    ]


def weekly_activity(db: Session, user: ArenaUser) -> list[dict]:
    """Return the last 7 days (oldest first) with an activity count for each day."""
    return activity_history(db, user, 7)


def sync_xp(db: Session, user: ArenaUser) -> None:
    """Recompute total XP as the sum of best scores across completed lessons."""
    total = (
        db.query(func.coalesce(func.sum(LessonProgress.best_score), 0))
        .filter(LessonProgress.user_id == user.id, LessonProgress.status == LessonStatus.completed)
        .scalar()
    )
    user.xp = int(total or 0)


def compute_arena_score(db: Session, user: ArenaUser) -> float | None:
    """Average percentage score across finished tournaments the user completed."""
    rows = (
        db.query(TournamentAttempt.score, TournamentAttempt.max_score)
        .join(Tournament, Tournament.id == TournamentAttempt.tournament_id)
        .filter(
            TournamentAttempt.user_id == user.id,
            TournamentAttempt.status.in_([ParticipationStatus.submitted, ParticipationStatus.auto_submitted]),
            Tournament.status == TournamentStatus.finished,
        )
        .all()
    )
    percentages = [row.score / row.max_score * 100 for row in rows if row.max_score]
    if not percentages:
        return None
    return round(sum(percentages) / len(percentages), 1)
