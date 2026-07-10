from datetime import timedelta
from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session, selectinload

from app.api.deps import get_current_user
from app.db.session import get_db
from app.models.entities import (
    ArenaUser,
    ParticipationStatus,
    Question,
    Tournament,
    TournamentAnswer,
    TournamentAttempt,
    TournamentInvitation,
    TournamentStatus,
    now_utc,
)
from app.schemas.api import AttemptAnswerIn, TournamentOut
from app.services.gamification import record_activity
from app.services.grading import grade_question

router = APIRouter(prefix="/tournaments", tags=["tournaments"])


def _aware(value):
    now = now_utc()
    return value if value.tzinfo is not None else value.replace(tzinfo=now.tzinfo)


def _tournament(db: Session, tournament_id: UUID) -> Tournament:
    from app.models.entities import TournamentQuestion

    tournament = db.query(Tournament).options(selectinload(Tournament.questions).selectinload(TournamentQuestion.question)).filter(Tournament.id == tournament_id).one_or_none()
    if not tournament:
        raise HTTPException(status_code=404, detail="Tournament not found")
    return tournament


def _max_score(tournament: Tournament) -> int:
    return sum(item.question.points for item in tournament.questions)


def _sync_status(tournament: Tournament) -> None:
    now = now_utc()
    starts_at = _aware(tournament.starts_at)
    ends_at = _aware(tournament.ends_at)
    if tournament.status == TournamentStatus.published and starts_at <= now < ends_at:
        tournament.status = TournamentStatus.active
    elif tournament.status in {TournamentStatus.published, TournamentStatus.active} and now >= ends_at:
        tournament.status = TournamentStatus.finished


def _attempt(db: Session, user: ArenaUser, tournament: Tournament) -> TournamentAttempt | None:
    return db.query(TournamentAttempt).filter(TournamentAttempt.user_id == user.id, TournamentAttempt.tournament_id == tournament.id).one_or_none()


def _invitation(db: Session, user: ArenaUser, tournament: Tournament) -> TournamentInvitation | None:
    return db.query(TournamentInvitation).filter(TournamentInvitation.user_id == user.id, TournamentInvitation.tournament_id == tournament.id).one_or_none()


def _submit_attempt(db: Session, attempt: TournamentAttempt, tournament: Tournament, auto: bool = False) -> TournamentAttempt:
    answers = {str(row.question_id): row for row in db.query(TournamentAnswer).filter(TournamentAnswer.attempt_id == attempt.id).all()}
    score = 0
    for item in tournament.questions:
        row = answers.get(str(item.question_id))
        is_correct, points = grade_question(item.question, row.answer if row else None)
        if row:
            row.is_correct = is_correct
            row.points_awarded = points
        score += points
    attempt.score = score
    attempt.max_score = _max_score(tournament)
    attempt.submitted_at = now_utc()
    attempt.status = ParticipationStatus.auto_submitted if auto else ParticipationStatus.submitted
    return attempt


@router.get("", response_model=list[TournamentOut])
def list_tournaments(db: Session = Depends(get_db), current_user: ArenaUser = Depends(get_current_user)):
    from app.models.entities import TournamentQuestion

    tournaments = db.query(Tournament).options(selectinload(Tournament.questions).selectinload(TournamentQuestion.question)).order_by(Tournament.starts_at).all()
    output = []
    for tournament in tournaments:
        _sync_status(tournament)
        attempt = _attempt(db, current_user, tournament)
        invitation = db.query(TournamentInvitation).filter(TournamentInvitation.user_id == current_user.id, TournamentInvitation.tournament_id == tournament.id).one_or_none()
        output.append(
            TournamentOut(
                id=tournament.id,
                title=tournament.title,
                description=tournament.description,
                starts_at=tournament.starts_at,
                ends_at=tournament.ends_at,
                duration_minutes=tournament.duration_minutes,
                status=tournament.status.value,
                question_count=len(tournament.questions),
                max_score=_max_score(tournament),
                participation_status=attempt.status.value if attempt else ("invited" if invitation else None),
            )
        )
    db.commit()
    return output


@router.post("/{tournament_id}/register")
def register(tournament_id: UUID, db: Session = Depends(get_db), current_user: ArenaUser = Depends(get_current_user)):
    tournament = _tournament(db, tournament_id)
    _sync_status(tournament)
    if tournament.status not in {TournamentStatus.published, TournamentStatus.active}:
        raise HTTPException(status_code=400, detail="Tournament registration is closed")
    invitation = _invitation(db, current_user, tournament)
    if not invitation:
        raise HTTPException(status_code=403, detail="Tournament invitation required")
    attempt = _attempt(db, current_user, tournament)
    if not attempt:
        attempt = TournamentAttempt(user_id=current_user.id, tournament_id=tournament.id, status=ParticipationStatus.registered, max_score=_max_score(tournament))
        db.add(attempt)
    invitation.status = "accepted"
    db.commit()
    return {"status": attempt.status.value}


@router.post("/{tournament_id}/start")
def start(tournament_id: UUID, db: Session = Depends(get_db), current_user: ArenaUser = Depends(get_current_user)):
    tournament = _tournament(db, tournament_id)
    _sync_status(tournament)
    if tournament.status != TournamentStatus.active:
        raise HTTPException(status_code=400, detail="Tournament is not active")
    attempt = _attempt(db, current_user, tournament)
    if not attempt:
        raise HTTPException(status_code=403, detail="Tournament registration required")
    if attempt.status in {ParticipationStatus.submitted, ParticipationStatus.auto_submitted}:
        raise HTTPException(status_code=400, detail="Attempt is already submitted")
    if not attempt.started_at:
        now = now_utc()
        attempt.started_at = now
        attempt.due_at = min(now + timedelta(minutes=tournament.duration_minutes), _aware(tournament.ends_at))
        attempt.status = ParticipationStatus.in_progress
    record_activity(current_user)
    db.commit()
    return {"attempt_id": attempt.id, "status": attempt.status.value, "started_at": attempt.started_at, "due_at": attempt.due_at}


@router.get("/{tournament_id}/attempt")
def get_attempt(tournament_id: UUID, db: Session = Depends(get_db), current_user: ArenaUser = Depends(get_current_user)):
    tournament = _tournament(db, tournament_id)
    attempt = _attempt(db, current_user, tournament)
    if not attempt:
        raise HTTPException(status_code=404, detail="Attempt not found")
    if attempt.status == ParticipationStatus.in_progress and attempt.due_at and _aware(attempt.due_at) <= now_utc():
        _submit_attempt(db, attempt, tournament, auto=True)
        db.commit()
    return {
        "attempt_id": attempt.id,
        "status": attempt.status.value,
        "started_at": attempt.started_at,
        "due_at": attempt.due_at,
        "questions": [
            {"id": item.question.id, "prompt": item.question.prompt, "type": item.question.type.value, "options": item.question.options, "points": item.question.points}
            for item in tournament.questions
        ],
    }


@router.put("/{tournament_id}/answers")
def save_answers(tournament_id: UUID, payload: AttemptAnswerIn, db: Session = Depends(get_db), current_user: ArenaUser = Depends(get_current_user)):
    tournament = _tournament(db, tournament_id)
    attempt = _attempt(db, current_user, tournament)
    if not attempt or attempt.status != ParticipationStatus.in_progress:
        raise HTTPException(status_code=400, detail="No active attempt")
    if attempt.due_at and _aware(attempt.due_at) <= now_utc():
        _submit_attempt(db, attempt, tournament, auto=True)
        db.commit()
        raise HTTPException(status_code=400, detail="Attempt time is over")
    existing = {str(row.question_id): row for row in db.query(TournamentAnswer).filter(TournamentAnswer.attempt_id == attempt.id).all()}
    question_ids = {str(item.question_id) for item in tournament.questions}
    for item in payload.answers:
        if str(item.question_id) not in question_ids:
            continue
        row = existing.get(str(item.question_id))
        if row:
            row.answer = item.answer
        else:
            db.add(TournamentAnswer(attempt_id=attempt.id, question_id=item.question_id, answer=item.answer))
    db.commit()
    return {"saved": len(payload.answers)}


@router.post("/{tournament_id}/submit")
def submit(tournament_id: UUID, db: Session = Depends(get_db), current_user: ArenaUser = Depends(get_current_user)):
    tournament = _tournament(db, tournament_id)
    attempt = _attempt(db, current_user, tournament)
    if not attempt or attempt.status not in {ParticipationStatus.in_progress, ParticipationStatus.registered}:
        raise HTTPException(status_code=400, detail="No submittable attempt")
    auto = bool(attempt.due_at and _aware(attempt.due_at) <= now_utc())
    _submit_attempt(db, attempt, tournament, auto=auto)
    db.commit()
    return {"status": attempt.status.value, "score": attempt.score, "max_score": attempt.max_score}


@router.get("/{tournament_id}/result")
def result(tournament_id: UUID, db: Session = Depends(get_db), current_user: ArenaUser = Depends(get_current_user)):
    tournament = _tournament(db, tournament_id)
    _sync_status(tournament)
    attempt = _attempt(db, current_user, tournament)
    if not attempt or attempt.status not in {ParticipationStatus.submitted, ParticipationStatus.auto_submitted}:
        raise HTTPException(status_code=404, detail="Result not available")
    if tournament.status != TournamentStatus.finished:
        return {"status": attempt.status.value, "score": attempt.score, "max_score": attempt.max_score, "review_available": False}
    answers = {str(row.question_id): row for row in db.query(TournamentAnswer).filter(TournamentAnswer.attempt_id == attempt.id).all()}
    review = []
    for item in tournament.questions:
        row = answers.get(str(item.question_id))
        review.append(
            {
                "question_id": item.question_id,
                "prompt": item.question.prompt,
                "answer": row.answer if row else None,
                "correct_answer": item.question.correct_answer,
                "is_correct": row.is_correct if row else False,
                "points": row.points_awarded if row else 0,
                "explanation": item.question.explanation,
            }
        )
    return {"status": attempt.status.value, "score": attempt.score, "max_score": attempt.max_score, "review_available": True, "review": review}


def public_display_name(display_name: str) -> str:
    parts = [part for part in display_name.strip().split() if part]
    if len(parts) < 2:
        return display_name
    return f"{parts[0]} {parts[1][0]}."


@router.get("/{tournament_id}/leaderboard")
def leaderboard(tournament_id: UUID, db: Session = Depends(get_db), current_user: ArenaUser = Depends(get_current_user)):
    tournament = _tournament(db, tournament_id)
    _sync_status(tournament)
    participation = _attempt(db, current_user, tournament)
    if not participation:
        raise HTTPException(status_code=403, detail="Not a participant")
    if tournament.status != TournamentStatus.finished:
        return {"tournament_id": tournament.id, "status": tournament.status.value, "rows": []}

    attempts = (
        db.query(TournamentAttempt)
        .filter(
            TournamentAttempt.tournament_id == tournament_id,
            TournamentAttempt.status.in_([ParticipationStatus.submitted, ParticipationStatus.auto_submitted]),
        )
        .all()
    )

    def duration_seconds(attempt: TournamentAttempt) -> float:
        if attempt.started_at and attempt.submitted_at:
            return (_aware(attempt.submitted_at) - _aware(attempt.started_at)).total_seconds()
        return float("inf")

    def submitted_key(attempt: TournamentAttempt):
        return _aware(attempt.submitted_at) if attempt.submitted_at else _aware(now_utc())

    ordered = sorted(attempts, key=lambda a: (-a.score, duration_seconds(a), submitted_key(a)))
    users = {u.id: u for u in db.query(ArenaUser).filter(ArenaUser.id.in_([a.user_id for a in ordered])).all()}

    rows = []
    rank = 0
    prev_key = None
    for index, attempt in enumerate(ordered):
        key = (attempt.score, duration_seconds(attempt))
        if key != prev_key:
            rank = index + 1
            prev_key = key
        duration = duration_seconds(attempt)
        user = users.get(attempt.user_id)
        is_you = attempt.user_id == current_user.id
        shown_name = user.display_name if (user and is_you) else public_display_name(user.display_name) if user else "Участник"
        rows.append(
            {
                "rank": rank,
                "display_name": shown_name,
                "score": attempt.score,
                "max_score": attempt.max_score,
                "duration_seconds": None if duration == float("inf") else int(duration),
                "status": attempt.status.value,
                "is_you": is_you,
            }
        )

    return {"tournament_id": tournament.id, "status": tournament.status.value, "rows": rows}
