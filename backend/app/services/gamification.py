from datetime import timedelta

from sqlalchemy import func
from sqlalchemy.orm import Session

from app.models.entities import (
    ArenaUser,
    LessonProgress,
    LessonStatus,
    ParticipationStatus,
    Tournament,
    TournamentAttempt,
    TournamentStatus,
    now_utc,
)


def record_activity(user: ArenaUser) -> None:
    """Update the daily streak for any qualifying learning activity (lesson, practice, tournament)."""
    today = now_utc().date()
    if user.last_active_date == today:
        return
    if user.last_active_date == today - timedelta(days=1):
        user.current_streak += 1
    else:
        user.current_streak = 1
    user.last_active_date = today
    user.longest_streak = max(user.longest_streak, user.current_streak)


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
