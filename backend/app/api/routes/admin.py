from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import Response
from sqlalchemy.orm import Session
from sqlalchemy.orm import selectinload

from app.api.deps import get_current_admin
from app.db.session import get_db
from app.models.entities import (
    ArenaUser,
    ContentStatus,
    Lesson,
    LessonProgress,
    Question,
    QuestionType,
    Section,
    Tournament,
    TournamentAttempt,
    TournamentInvitation,
    TournamentQuestion,
    TournamentStatus,
    Track,
)
from app.schemas.api import (
    LessonCreateIn,
    LessonUpdateIn,
    QuestionCreateIn,
    QuestionUpdateIn,
    SectionCreateIn,
    TournamentCreateIn,
    TournamentQuestionSetIn,
    TournamentUpdateIn,
)

router = APIRouter(prefix="/admin", tags=["admin"])


@router.get("/dashboard")
def dashboard(_: ArenaUser = Depends(get_current_admin), db: Session = Depends(get_db)):
    users = db.query(ArenaUser).count()
    ai_track = db.query(Track).filter(Track.slug == "ai").one_or_none()
    ai_users = db.query(ArenaUser).filter(ArenaUser.selected_track_id == ai_track.id).count() if ai_track else 0
    lessons = db.query(Lesson).count()
    questions = db.query(Question).count()
    tournaments = db.query(Tournament).count()
    invitations = db.query(TournamentInvitation).count()
    attempts = db.query(TournamentAttempt).count()
    return {
        "users": users,
        "ai_track_users": ai_users,
        "lessons": lessons,
        "questions": questions,
        "tournaments": tournaments,
        "invitations": invitations,
        "attempts": attempts,
    }


def _content_status(value: str) -> ContentStatus:
    try:
        return ContentStatus(value)
    except ValueError as exc:
        raise HTTPException(status_code=400, detail="Invalid content status") from exc


def _question_type(value: str) -> QuestionType:
    try:
        return QuestionType(value)
    except ValueError as exc:
        raise HTTPException(status_code=400, detail="Invalid question type") from exc


def _tournament_status(value: str) -> TournamentStatus:
    try:
        return TournamentStatus(value)
    except ValueError as exc:
        raise HTTPException(status_code=400, detail="Invalid tournament status") from exc


def _lesson_dict(lesson: Lesson) -> dict:
    return {
        "id": lesson.id,
        "section_id": lesson.section_id,
        "title": lesson.title,
        "summary": lesson.summary,
        "theory": lesson.theory,
        "order": lesson.order,
        "pass_percent": lesson.pass_percent,
        "status": lesson.status.value,
        "questions_count": len(lesson.questions),
    }


def _question_dict(question: Question) -> dict:
    return {
        "id": question.id,
        "lesson_id": question.lesson_id,
        "title": question.title,
        "prompt": question.prompt,
        "type": question.type.value,
        "options": question.options,
        "correct_answer": question.correct_answer,
        "tolerance": question.tolerance,
        "points": question.points,
        "explanation": question.explanation,
        "difficulty": question.difficulty,
        "order": question.order,
        "status": question.status.value,
    }


def _tournament_dict(tournament: Tournament) -> dict:
    max_score = sum(item.question.points for item in tournament.questions)
    return {
        "id": tournament.id,
        "track_id": tournament.track_id,
        "title": tournament.title,
        "description": tournament.description,
        "starts_at": tournament.starts_at,
        "ends_at": tournament.ends_at,
        "duration_minutes": tournament.duration_minutes,
        "status": tournament.status.value,
        "randomize_questions": tournament.randomize_questions,
        "question_count": len(tournament.questions),
        "max_score": max_score,
        "question_ids": [item.question_id for item in tournament.questions],
    }


@router.get("/users")
def list_users(_: ArenaUser = Depends(get_current_admin), db: Session = Depends(get_db)):
    users = db.query(ArenaUser).order_by(ArenaUser.created_at.desc()).limit(200).all()
    return [
        {
            "id": user.id,
            "account_user_id": user.account_user_id,
            "email": user.email,
            "display_name": user.display_name,
            "role": user.role.value,
            "selected_track_id": user.selected_track_id,
            "is_active": user.is_active,
            "created_at": user.created_at,
        }
        for user in users
    ]


@router.get("/tracks")
def list_tracks(_: ArenaUser = Depends(get_current_admin), db: Session = Depends(get_db)):
    tracks = db.query(Track).options(selectinload(Track.sections).selectinload(Section.lessons)).order_by(Track.created_at).all()
    return [
        {
            "id": track.id,
            "slug": track.slug,
            "title": track.title,
            "description": track.description,
            "status": track.status.value,
            "sections": [
                {
                    "id": section.id,
                    "title": section.title,
                    "order": section.order,
                    "lessons_count": len(section.lessons),
                }
                for section in track.sections
            ],
        }
        for track in tracks
    ]


@router.post("/sections")
def create_section(payload: SectionCreateIn, _: ArenaUser = Depends(get_current_admin), db: Session = Depends(get_db)):
    if not db.get(Track, payload.track_id):
        raise HTTPException(status_code=404, detail="Track not found")
    section = Section(track_id=payload.track_id, title=payload.title, order=payload.order)
    db.add(section)
    db.commit()
    db.refresh(section)
    return {"id": section.id, "track_id": section.track_id, "title": section.title, "order": section.order}


@router.get("/lessons")
def list_lessons(_: ArenaUser = Depends(get_current_admin), db: Session = Depends(get_db)):
    lessons = db.query(Lesson).options(selectinload(Lesson.questions)).order_by(Lesson.order).all()
    return [_lesson_dict(lesson) for lesson in lessons]


@router.post("/lessons")
def create_lesson(payload: LessonCreateIn, _: ArenaUser = Depends(get_current_admin), db: Session = Depends(get_db)):
    if not db.get(Section, payload.section_id):
        raise HTTPException(status_code=404, detail="Section not found")
    lesson = Lesson(
        section_id=payload.section_id,
        title=payload.title,
        summary=payload.summary,
        theory=payload.theory,
        order=payload.order,
        pass_percent=payload.pass_percent,
        status=_content_status(payload.status),
    )
    db.add(lesson)
    db.commit()
    db.refresh(lesson)
    return _lesson_dict(lesson)


@router.patch("/lessons/{lesson_id}")
def update_lesson(lesson_id: UUID, payload: LessonUpdateIn, _: ArenaUser = Depends(get_current_admin), db: Session = Depends(get_db)):
    lesson = db.get(Lesson, lesson_id)
    if not lesson:
        raise HTTPException(status_code=404, detail="Lesson not found")
    data = payload.model_dump(exclude_unset=True)
    if "section_id" in data and not db.get(Section, data["section_id"]):
        raise HTTPException(status_code=404, detail="Section not found")
    if "status" in data:
        data["status"] = _content_status(data["status"])
    for key, value in data.items():
        setattr(lesson, key, value)
    db.commit()
    db.refresh(lesson)
    return _lesson_dict(lesson)


@router.get("/questions")
def list_questions(_: ArenaUser = Depends(get_current_admin), db: Session = Depends(get_db)):
    questions = db.query(Question).order_by(Question.created_at.desc()).all()
    return [_question_dict(question) for question in questions]


@router.post("/questions")
def create_question(payload: QuestionCreateIn, _: ArenaUser = Depends(get_current_admin), db: Session = Depends(get_db)):
    if payload.lesson_id and not db.get(Lesson, payload.lesson_id):
        raise HTTPException(status_code=404, detail="Lesson not found")
    question = Question(
        lesson_id=payload.lesson_id,
        title=payload.title,
        prompt=payload.prompt,
        type=_question_type(payload.type),
        options=payload.options,
        correct_answer=payload.correct_answer,
        tolerance=payload.tolerance,
        points=payload.points,
        explanation=payload.explanation,
        difficulty=payload.difficulty,
        order=payload.order,
        status=_content_status(payload.status),
    )
    db.add(question)
    db.commit()
    db.refresh(question)
    return _question_dict(question)


@router.patch("/questions/{question_id}")
def update_question(question_id: UUID, payload: QuestionUpdateIn, _: ArenaUser = Depends(get_current_admin), db: Session = Depends(get_db)):
    question = db.get(Question, question_id)
    if not question:
        raise HTTPException(status_code=404, detail="Question not found")
    data = payload.model_dump(exclude_unset=True)
    if "lesson_id" in data and data["lesson_id"] and not db.get(Lesson, data["lesson_id"]):
        raise HTTPException(status_code=404, detail="Lesson not found")
    if "type" in data:
        data["type"] = _question_type(data["type"])
    if "status" in data:
        data["status"] = _content_status(data["status"])
    for key, value in data.items():
        setattr(question, key, value)
    db.commit()
    db.refresh(question)
    return _question_dict(question)


@router.get("/tournaments")
def list_tournaments(_: ArenaUser = Depends(get_current_admin), db: Session = Depends(get_db)):
    tournaments = db.query(Tournament).options(selectinload(Tournament.questions).selectinload(TournamentQuestion.question)).order_by(Tournament.starts_at.desc()).all()
    return [_tournament_dict(tournament) for tournament in tournaments]


@router.post("/tournaments")
def create_tournament(payload: TournamentCreateIn, _: ArenaUser = Depends(get_current_admin), db: Session = Depends(get_db)):
    if not db.get(Track, payload.track_id):
        raise HTTPException(status_code=404, detail="Track not found")
    tournament = Tournament(
        track_id=payload.track_id,
        title=payload.title,
        description=payload.description,
        starts_at=payload.starts_at,
        ends_at=payload.ends_at,
        duration_minutes=payload.duration_minutes,
        status=_tournament_status(payload.status),
        randomize_questions=payload.randomize_questions,
    )
    db.add(tournament)
    db.flush()
    for order, question_id in enumerate(payload.question_ids, start=1):
        if not db.get(Question, question_id):
            raise HTTPException(status_code=404, detail=f"Question not found: {question_id}")
        db.add(TournamentQuestion(tournament_id=tournament.id, question_id=question_id, order=order))
    db.commit()
    db.refresh(tournament)
    return _tournament_dict(tournament)


@router.patch("/tournaments/{tournament_id}")
def update_tournament(tournament_id: UUID, payload: TournamentUpdateIn, _: ArenaUser = Depends(get_current_admin), db: Session = Depends(get_db)):
    tournament = db.get(Tournament, tournament_id)
    if not tournament:
        raise HTTPException(status_code=404, detail="Tournament not found")
    data = payload.model_dump(exclude_unset=True)
    if "track_id" in data and not db.get(Track, data["track_id"]):
        raise HTTPException(status_code=404, detail="Track not found")
    if "status" in data:
        data["status"] = _tournament_status(data["status"])
    for key, value in data.items():
        setattr(tournament, key, value)
    db.commit()
    db.refresh(tournament)
    return _tournament_dict(tournament)


@router.put("/tournaments/{tournament_id}/questions")
def set_tournament_questions(tournament_id: UUID, payload: TournamentQuestionSetIn, _: ArenaUser = Depends(get_current_admin), db: Session = Depends(get_db)):
    tournament = db.get(Tournament, tournament_id)
    if not tournament:
        raise HTTPException(status_code=404, detail="Tournament not found")
    db.query(TournamentQuestion).filter(TournamentQuestion.tournament_id == tournament.id).delete()
    for order, question_id in enumerate(payload.question_ids, start=1):
        if not db.get(Question, question_id):
            raise HTTPException(status_code=404, detail=f"Question not found: {question_id}")
        db.add(TournamentQuestion(tournament_id=tournament.id, question_id=question_id, order=order))
    db.commit()
    return {"ok": True, "question_count": len(payload.question_ids)}


def _validate_publishable(tournament: Tournament) -> None:
    if not tournament.title or not tournament.description:
        raise HTTPException(status_code=400, detail="Tournament title and description are required")
    if tournament.ends_at <= tournament.starts_at:
        raise HTTPException(status_code=400, detail="Tournament end must be after start")
    if tournament.duration_minutes <= 0:
        raise HTTPException(status_code=400, detail="Attempt duration must be positive")
    if not tournament.questions:
        raise HTTPException(status_code=400, detail="Tournament needs at least one question")
    for item in tournament.questions:
        question = item.question
        if not question.correct_answer or question.points <= 0 or not question.explanation:
            raise HTTPException(status_code=400, detail="All questions need answer, points and explanation")


@router.post("/tournaments/{tournament_id}/publish")
def publish_tournament(tournament_id: UUID, _: ArenaUser = Depends(get_current_admin), db: Session = Depends(get_db)):
    tournament = (
        db.query(Tournament)
        .options(selectinload(Tournament.questions).selectinload(TournamentQuestion.question))
        .filter(Tournament.id == tournament_id)
        .one_or_none()
    )
    if not tournament:
        raise HTTPException(status_code=404, detail="Tournament not found")
    _validate_publishable(tournament)
    tournament.status = TournamentStatus.published
    users = db.query(ArenaUser).filter(ArenaUser.is_active == True, ArenaUser.selected_track_id == tournament.track_id).all()  # noqa: E712
    created = 0
    for user in users:
        exists = (
            db.query(TournamentInvitation)
            .filter(TournamentInvitation.user_id == user.id, TournamentInvitation.tournament_id == tournament.id)
            .one_or_none()
        )
        if not exists:
            db.add(TournamentInvitation(user_id=user.id, tournament_id=tournament.id, status="created"))
            created += 1
    db.commit()
    return {"ok": True, "status": tournament.status.value, "invitations_created": created}


@router.post("/tournaments/{tournament_id}/finish")
def finish_tournament(tournament_id: UUID, _: ArenaUser = Depends(get_current_admin), db: Session = Depends(get_db)):
    tournament = db.get(Tournament, tournament_id)
    if not tournament:
        raise HTTPException(status_code=404, detail="Tournament not found")
    tournament.status = TournamentStatus.finished
    db.commit()
    return {"ok": True, "status": tournament.status.value}


@router.get("/tournaments/{tournament_id}/results")
def tournament_results(tournament_id: UUID, _: ArenaUser = Depends(get_current_admin), db: Session = Depends(get_db)):
    attempts = (
        db.query(TournamentAttempt, ArenaUser)
        .join(ArenaUser, ArenaUser.id == TournamentAttempt.user_id)
        .filter(TournamentAttempt.tournament_id == tournament_id)
        .order_by(TournamentAttempt.score.desc(), TournamentAttempt.submitted_at.asc())
        .all()
    )
    rows = []
    for idx, (attempt, user) in enumerate(attempts, start=1):
        rows.append(
            {
                "place": idx,
                "user_id": user.id,
                "display_name": user.display_name,
                "email": user.email,
                "status": attempt.status.value,
                "score": attempt.score,
                "max_score": attempt.max_score,
                "started_at": attempt.started_at,
                "submitted_at": attempt.submitted_at,
            }
        )
    return rows


@router.get("/tournaments/{tournament_id}/results.csv")
def tournament_results_csv(tournament_id: UUID, _: ArenaUser = Depends(get_current_admin), db: Session = Depends(get_db)):
    rows = tournament_results(tournament_id, _, db)
    lines = ["place,display_name,email,status,score,max_score,started_at,submitted_at"]
    for row in rows:
        values = [
            row["place"],
            row["display_name"],
            row["email"] or "",
            row["status"],
            row["score"],
            row["max_score"],
            row["started_at"] or "",
            row["submitted_at"] or "",
        ]
        lines.append(",".join(f'"{str(value).replace(chr(34), chr(34) + chr(34))}"' for value in values))
    return Response("\n".join(lines), media_type="text/csv; charset=utf-8")
