from datetime import datetime

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session, selectinload

from app.db.session import get_db
from app.models.entities import (
    ContentStatus,
    Lesson,
    Section,
    Tournament,
    TournamentQuestion,
    TournamentStatus,
    Track,
    now_utc,
)
from app.schemas.api import PublicTournamentOut, PublicTrackOut

router = APIRouter(prefix="/catalog", tags=["public catalog"])


def _aware(value: datetime) -> datetime:
    now = now_utc()
    return value if value.tzinfo is not None else value.replace(tzinfo=now.tzinfo)


def _public_tournament_status(tournament: Tournament) -> str:
    now = now_utc()
    if _aware(tournament.ends_at) <= now:
        return "finished"
    if _aware(tournament.starts_at) <= now:
        return "active"
    return "upcoming"


@router.get("/tracks", response_model=list[PublicTrackOut])
def list_public_tracks(db: Session = Depends(get_db)):
    tracks = (
        db.query(Track)
        .options(selectinload(Track.sections).selectinload(Section.lessons))
        .filter(Track.status == ContentStatus.published)
        .order_by(Track.title)
        .all()
    )
    output = []
    for track in tracks:
        sections = []
        for section in sorted(track.sections, key=lambda item: item.order):
            published_lessons = [lesson for lesson in section.lessons if lesson.status == ContentStatus.published]
            if published_lessons:
                sections.append({"title": section.title, "lesson_count": len(published_lessons)})
        output.append(
            {
                "id": track.id,
                "slug": track.slug,
                "title": track.title,
                "description": track.description,
                "section_count": len(sections),
                "lesson_count": sum(section["lesson_count"] for section in sections),
                "sections": sections,
            }
        )
    return output


@router.get("/tournaments", response_model=list[PublicTournamentOut])
def list_public_tournaments(db: Session = Depends(get_db)):
    rows = (
        db.query(Tournament, Track)
        .join(Track, Track.id == Tournament.track_id)
        .options(selectinload(Tournament.questions).selectinload(TournamentQuestion.question))
        .filter(
            Track.status == ContentStatus.published,
            Tournament.status.notin_([TournamentStatus.draft, TournamentStatus.cancelled]),
        )
        .order_by(Tournament.starts_at)
        .all()
    )
    return [
        {
            "id": tournament.id,
            "track_slug": track.slug,
            "track_title": track.title,
            "title": tournament.title,
            "description": tournament.description,
            "starts_at": tournament.starts_at,
            "ends_at": tournament.ends_at,
            "duration_minutes": tournament.duration_minutes,
            "status": _public_tournament_status(tournament),
            "question_count": len(tournament.questions),
            "max_score": sum(item.question.points for item in tournament.questions),
        }
        for tournament, track in rows
    ]
