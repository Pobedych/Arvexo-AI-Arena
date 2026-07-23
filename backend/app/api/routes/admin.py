import csv
from io import StringIO
from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import Response
from sqlalchemy.orm import Session
from sqlalchemy.orm import selectinload

from app.api.deps import get_current_admin
from app.db.session import get_db
from app.models.entities import (
    AdminActionLog,
    ArenaUser,
    ContentStatus,
    Lesson,
    LessonProgress,
    LessonStep,
    Question,
    QuestionType,
    Section,
    Tournament,
    TournamentAnswer,
    TournamentAttempt,
    TournamentInvitation,
    TournamentQuestion,
    TournamentStatus,
    Track,
)
from app.schemas.api import (
    InviteUserIn,
    LessonCreateIn,
    LessonUpdateIn,
    QuestionCreateIn,
    QuestionUpdateIn,
    SectionCreateIn,
    SectionUpdateIn,
    TournamentCreateIn,
    TournamentQuestionSetIn,
    TournamentUpdateIn,
    TrackUpdateIn,
)
from app.services.audit import log_admin_action
from app.services.notifications import notify_lesson_published, notify_tournament_published

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


def _validate_question_configuration(question_type: QuestionType, options: list[str] | None, configuration: dict | None, correct_answer: dict) -> None:
    if question_type == QuestionType.sequence:
        if not options or len(options) < 2 or any(not option.strip() for option in options):
            raise HTTPException(status_code=400, detail="Sequence needs at least two non-empty elements")
        expected_order = correct_answer.get("order")
        if expected_order != list(range(len(options))):
            raise HTTPException(status_code=400, detail="Sequence answer must contain every element in the configured order")
    elif question_type == QuestionType.matching:
        right = (configuration or {}).get("right") or []
        matches = correct_answer.get("matches") or []
        if not options or len(options) < 2 or len(right) != len(options) or any(not item.strip() for item in [*options, *right]):
            raise HTTPException(status_code=400, detail="Matching needs at least two complete pairs")
        if matches != list(range(len(options))):
            raise HTTPException(status_code=400, detail="Matching answer must contain every configured pair")
    elif question_type == QuestionType.group_sort:
        categories = (configuration or {}).get("categories") or []
        groups = correct_answer.get("groups") or []
        if not options or len(options) < 2 or any(not str(item).strip() for item in options):
            raise HTTPException(status_code=400, detail="Group sort needs at least two non-empty cards")
        if len(categories) < 2 or any(not str(item).strip() for item in categories):
            raise HTTPException(status_code=400, detail="Group sort needs at least two non-empty categories")
        if len({str(item).strip().lower() for item in categories}) != len(categories):
            raise HTTPException(status_code=400, detail="Group sort categories must be unique")
        if len(groups) != len(options) or any(not isinstance(group, int) or isinstance(group, bool) or group < 0 or group >= len(categories) for group in groups):
            raise HTTPException(status_code=400, detail="Every group sort card must have a valid category")
    elif question_type == QuestionType.fill_blanks:
        template = str((configuration or {}).get("template") or "")
        blanks = correct_answer.get("blanks") or []
        if not template.strip() or template.count("___") < 1:
            raise HTTPException(status_code=400, detail="Fill blanks needs a template with at least one ___ placeholder")
        if len(blanks) != template.count("___") or any(not str(item).strip() for item in blanks):
            raise HTTPException(status_code=400, detail="Fill blanks needs one answer for every placeholder")
    elif question_type == QuestionType.table_select:
        columns = (configuration or {}).get("columns") or []
        rows = (configuration or {}).get("rows") or []
        cells = correct_answer.get("cells") or []
        if not columns or not rows or any(not isinstance(row, list) or len(row) != len(columns) for row in rows):
            raise HTTPException(status_code=400, detail="Table select needs columns and equally sized rows")
        valid_cells = {f"{row_index}:{column_index}" for row_index in range(len(rows)) for column_index in range(len(columns))}
        if not cells or any(str(cell) not in valid_cells for cell in cells):
            raise HTTPException(status_code=400, detail="Table select needs at least one valid answer cell")
    elif question_type == QuestionType.code_order:
        if not options or len(options) < 2 or any(not str(option).strip() for option in options):
            raise HTTPException(status_code=400, detail="Code order needs at least two non-empty lines")
        if correct_answer.get("order") != list(range(len(options))):
            raise HTTPException(status_code=400, detail="Code order answer must contain every configured line")
    elif question_type == QuestionType.code_output:
        if not str((configuration or {}).get("code") or "").strip() or not str(correct_answer.get("text") or "").strip():
            raise HTTPException(status_code=400, detail="Code output needs a code snippet and expected output")
    elif question_type == QuestionType.code_fix:
        code = correct_answer.get("code")
        accepted_codes = correct_answer.get("accepted_codes") or []
        if not str((configuration or {}).get("code") or "").strip():
            raise HTTPException(status_code=400, detail="Code fix needs broken starter code")
        if not str(code or "").strip() and not any(str(item or "").strip() for item in accepted_codes):
            raise HTTPException(status_code=400, detail="Code fix needs an expected fixed solution")
    elif question_type in (QuestionType.image_hotspot, QuestionType.graph_point):
        point = correct_answer.get("point") or []
        if len(point) != 2 or any(not isinstance(value, (int, float)) or isinstance(value, bool) for value in point):
            raise HTTPException(status_code=400, detail="Point question needs numeric x and y coordinates")
        if question_type == QuestionType.image_hotspot and not str((configuration or {}).get("image_url") or "").strip():
            raise HTTPException(status_code=400, detail="Image hotspot needs an image URL")
        if question_type == QuestionType.graph_point:
            required = ("x_min", "x_max", "y_min", "y_max")
            if any(not isinstance((configuration or {}).get(key), (int, float)) for key in required):
                raise HTTPException(status_code=400, detail="Graph point needs numeric axis boundaries")
    elif question_type in (QuestionType.number_line, QuestionType.slider_experiment):
        config = configuration or {}
        if any(not isinstance(config.get(key), (int, float)) or isinstance(config.get(key), bool) for key in ("min", "max", "step")):
            raise HTTPException(status_code=400, detail="Range question needs numeric min, max and step")
        if config["min"] >= config["max"] or config["step"] <= 0:
            raise HTTPException(status_code=400, detail="Range question boundaries or step are invalid")
        number = correct_answer.get("number")
        if not isinstance(number, (int, float)) or isinstance(number, bool) or number < config["min"] or number > config["max"]:
            raise HTTPException(status_code=400, detail="Range question answer must be inside its boundaries")
    elif question_type == QuestionType.code_text:
        code = correct_answer.get("code")
        accepted_codes = correct_answer.get("accepted_codes") or []
        if not str(code or "").strip() and not any(str(item or "").strip() for item in accepted_codes):
            raise HTTPException(status_code=400, detail="Code question needs an expected solution")


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
        "steps": [
            {"id": step.id, "title": step.title, "body": step.body, "order": step.order}
            for step in sorted(lesson.steps, key=lambda step: step.order)
        ],
    }


def _question_dict(question: Question) -> dict:
    return {
        "id": question.id,
        "lesson_id": question.lesson_id,
        "title": question.title,
        "prompt": question.prompt,
        "type": question.type.value,
        "options": question.options,
        "configuration": question.configuration,
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


@router.get("/users/{user_id}")
def user_card(user_id: UUID, _: ArenaUser = Depends(get_current_admin), db: Session = Depends(get_db)):
    user = db.get(ArenaUser, user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    progress = db.query(LessonProgress).filter(LessonProgress.user_id == user.id).all()
    lessons = {lesson.id: lesson for lesson in db.query(Lesson).filter(Lesson.id.in_([row.lesson_id for row in progress])).all()} if progress else {}
    attempts = db.query(TournamentAttempt).filter(TournamentAttempt.user_id == user.id).all()
    tournaments = {t.id: t for t in db.query(Tournament).filter(Tournament.id.in_([a.tournament_id for a in attempts])).all()} if attempts else {}
    invitations = db.query(TournamentInvitation).filter(TournamentInvitation.user_id == user.id).all()
    return {
        "id": user.id,
        "account_user_id": user.account_user_id,
        "email": user.email,
        "display_name": user.display_name,
        "role": user.role.value,
        "selected_track_id": user.selected_track_id,
        "is_active": user.is_active,
        "created_at": user.created_at,
        "progress": [
            {
                "lesson_id": row.lesson_id,
                "lesson_title": lessons[row.lesson_id].title if row.lesson_id in lessons else None,
                "status": row.status.value,
                "best_score": row.best_score,
                "max_score": row.max_score,
            }
            for row in progress
        ],
        "attempts": [
            {
                "tournament_id": attempt.tournament_id,
                "tournament_title": tournaments[attempt.tournament_id].title if attempt.tournament_id in tournaments else None,
                "status": attempt.status.value,
                "score": attempt.score,
                "max_score": attempt.max_score,
                "started_at": attempt.started_at,
                "submitted_at": attempt.submitted_at,
            }
            for attempt in attempts
        ],
        "invitations": [{"tournament_id": row.tournament_id, "status": row.status} for row in invitations],
    }


@router.post("/users/{user_id}/block")
def block_user(user_id: UUID, admin: ArenaUser = Depends(get_current_admin), db: Session = Depends(get_db)):
    user = db.get(ArenaUser, user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    if user.id == admin.id:
        raise HTTPException(status_code=400, detail="You cannot block yourself")
    user.is_active = False
    log_admin_action(db, admin, "block_user", "user", user.id, f"Заблокирован пользователь {user.display_name}")
    db.commit()
    return {"ok": True, "is_active": user.is_active}


@router.post("/users/{user_id}/unblock")
def unblock_user(user_id: UUID, admin: ArenaUser = Depends(get_current_admin), db: Session = Depends(get_db)):
    user = db.get(ArenaUser, user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    user.is_active = True
    log_admin_action(db, admin, "unblock_user", "user", user.id, f"Разблокирован пользователь {user.display_name}")
    db.commit()
    return {"ok": True, "is_active": user.is_active}


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
            "sections": [_section_dict(section) for section in track.sections],
        }
        for track in tracks
    ]


def _section_dict(section: Section) -> dict:
    return {
        "id": section.id,
        "track_id": section.track_id,
        "title": section.title,
        "order": section.order,
        "lessons_count": len(section.lessons),
    }


@router.patch("/tracks/{track_id}")
def update_track(track_id: UUID, payload: TrackUpdateIn, admin: ArenaUser = Depends(get_current_admin), db: Session = Depends(get_db)):
    track = db.get(Track, track_id)
    if not track:
        raise HTTPException(status_code=404, detail="Track not found")
    data = payload.model_dump(exclude_unset=True)
    if "status" in data:
        data["status"] = _content_status(data["status"])
    for key, value in data.items():
        setattr(track, key, value)
    log_admin_action(db, admin, "update_track", "track", track.id, f"Обновлён трек {track.title}")
    db.commit()
    db.refresh(track)
    return {"id": track.id, "slug": track.slug, "title": track.title, "description": track.description, "status": track.status.value}


@router.post("/sections")
def create_section(payload: SectionCreateIn, admin: ArenaUser = Depends(get_current_admin), db: Session = Depends(get_db)):
    if not db.get(Track, payload.track_id):
        raise HTTPException(status_code=404, detail="Track not found")
    section = Section(track_id=payload.track_id, title=payload.title, order=payload.order)
    db.add(section)
    db.flush()
    log_admin_action(db, admin, "create_section", "section", section.id, f"Создан раздел {section.title}")
    db.commit()
    db.refresh(section)
    return _section_dict(section)


@router.patch("/sections/{section_id}")
def update_section(section_id: UUID, payload: SectionUpdateIn, admin: ArenaUser = Depends(get_current_admin), db: Session = Depends(get_db)):
    section = db.get(Section, section_id)
    if not section:
        raise HTTPException(status_code=404, detail="Section not found")
    data = payload.model_dump(exclude_unset=True)
    for key, value in data.items():
        setattr(section, key, value)
    log_admin_action(db, admin, "update_section", "section", section.id, f"Обновлён раздел {section.title}")
    db.commit()
    db.refresh(section)
    return _section_dict(section)


def _reset_lesson_progress(db: Session, lesson_id: UUID | None) -> None:
    """Wipe learners' progress for a lesson whose question set just changed underneath them."""
    if not lesson_id:
        return
    db.query(LessonProgress).filter(LessonProgress.lesson_id == lesson_id).delete()


def _purge_question_dependencies(db: Session, question_id: UUID) -> None:
    db.query(TournamentAnswer).filter(TournamentAnswer.question_id == question_id).delete()
    db.query(TournamentQuestion).filter(TournamentQuestion.question_id == question_id).delete()


def _purge_lesson_dependencies(db: Session, lesson: Lesson) -> None:
    db.query(LessonProgress).filter(LessonProgress.lesson_id == lesson.id).delete()
    for question in lesson.questions:
        _purge_question_dependencies(db, question.id)


@router.delete("/sections/{section_id}")
def delete_section(section_id: UUID, admin: ArenaUser = Depends(get_current_admin), db: Session = Depends(get_db)):
    section = db.get(Section, section_id)
    if not section:
        raise HTTPException(status_code=404, detail="Section not found")
    for lesson in section.lessons:
        _purge_lesson_dependencies(db, lesson)
    log_admin_action(db, admin, "delete_section", "section", section.id, f"Удалён раздел {section.title}")
    db.delete(section)
    db.commit()
    return {"ok": True}


@router.get("/lessons")
def list_lessons(_: ArenaUser = Depends(get_current_admin), db: Session = Depends(get_db)):
    lessons = db.query(Lesson).options(selectinload(Lesson.questions), selectinload(Lesson.steps)).order_by(Lesson.order).all()
    return [_lesson_dict(lesson) for lesson in lessons]


@router.post("/lessons")
def create_lesson(payload: LessonCreateIn, admin: ArenaUser = Depends(get_current_admin), db: Session = Depends(get_db)):
    if not db.get(Section, payload.section_id):
        raise HTTPException(status_code=404, detail="Section not found")
    if not payload.theory.strip() and not payload.steps:
        raise HTTPException(status_code=400, detail="Add theory text or at least one step")
    lesson = Lesson(
        section_id=payload.section_id,
        title=payload.title,
        summary=payload.summary,
        theory=payload.theory,
        order=payload.order,
        pass_percent=payload.pass_percent,
        status=_content_status(payload.status),
        steps=[LessonStep(title=step.title, body=step.body, order=step.order) for step in payload.steps],
    )
    db.add(lesson)
    db.flush()
    if lesson.status == ContentStatus.published:
        notify_lesson_published(db, lesson)
    log_admin_action(db, admin, "create_lesson", "lesson", lesson.id, f"Создан урок {lesson.title}")
    db.commit()
    db.refresh(lesson)
    return _lesson_dict(lesson)


@router.patch("/lessons/{lesson_id}")
def update_lesson(lesson_id: UUID, payload: LessonUpdateIn, admin: ArenaUser = Depends(get_current_admin), db: Session = Depends(get_db)):
    lesson = db.get(Lesson, lesson_id)
    if not lesson:
        raise HTTPException(status_code=404, detail="Lesson not found")
    previous_status = lesson.status
    data = payload.model_dump(exclude_unset=True)
    if "section_id" in data and not db.get(Section, data["section_id"]):
        raise HTTPException(status_code=404, detail="Section not found")
    if "status" in data:
        data["status"] = _content_status(data["status"])
    steps = data.pop("steps", None)
    next_theory = data.get("theory", lesson.theory)
    next_steps = steps if steps is not None else [{"body": step.body} for step in lesson.steps]
    if not next_theory.strip() and not next_steps:
        raise HTTPException(status_code=400, detail="Add theory text or at least one step")
    for key, value in data.items():
        setattr(lesson, key, value)
    if steps is not None:
        lesson.steps = [LessonStep(title=step["title"], body=step["body"], order=step["order"]) for step in steps]
    if previous_status != ContentStatus.published and lesson.status == ContentStatus.published:
        notify_lesson_published(db, lesson)
    log_admin_action(db, admin, "update_lesson", "lesson", lesson.id, f"Обновлён урок {lesson.title}")
    db.commit()
    db.refresh(lesson)
    return _lesson_dict(lesson)


@router.delete("/lessons/{lesson_id}")
def delete_lesson(lesson_id: UUID, admin: ArenaUser = Depends(get_current_admin), db: Session = Depends(get_db)):
    lesson = db.get(Lesson, lesson_id)
    if not lesson:
        raise HTTPException(status_code=404, detail="Lesson not found")
    _purge_lesson_dependencies(db, lesson)
    log_admin_action(db, admin, "delete_lesson", "lesson", lesson.id, f"Удалён урок {lesson.title}")
    db.delete(lesson)
    db.commit()
    return {"ok": True}


@router.get("/questions")
def list_questions(_: ArenaUser = Depends(get_current_admin), db: Session = Depends(get_db)):
    questions = db.query(Question).order_by(Question.created_at.desc()).all()
    return [_question_dict(question) for question in questions]


@router.post("/questions")
def create_question(payload: QuestionCreateIn, admin: ArenaUser = Depends(get_current_admin), db: Session = Depends(get_db)):
    if payload.lesson_id and not db.get(Lesson, payload.lesson_id):
        raise HTTPException(status_code=404, detail="Lesson not found")
    question_type = _question_type(payload.type)
    _validate_question_configuration(question_type, payload.options, payload.configuration, payload.correct_answer)
    question = Question(
        lesson_id=payload.lesson_id,
        title=payload.title,
        prompt=payload.prompt,
        type=question_type,
        options=payload.options,
        configuration=payload.configuration,
        correct_answer=payload.correct_answer,
        tolerance=payload.tolerance,
        points=payload.points,
        explanation=payload.explanation,
        difficulty=payload.difficulty,
        order=payload.order,
        status=_content_status(payload.status),
    )
    db.add(question)
    _reset_lesson_progress(db, question.lesson_id)
    db.flush()
    log_admin_action(db, admin, "create_question", "question", question.id, f"Создано задание {question.title}")
    db.commit()
    db.refresh(question)
    return _question_dict(question)


CONTENT_AFFECTING_QUESTION_FIELDS = {"lesson_id", "type", "options", "configuration", "correct_answer", "tolerance", "points", "status"}


@router.patch("/questions/{question_id}")
def update_question(question_id: UUID, payload: QuestionUpdateIn, admin: ArenaUser = Depends(get_current_admin), db: Session = Depends(get_db)):
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
    next_type = data.get("type", question.type)
    next_options = data.get("options", question.options)
    next_configuration = data.get("configuration", question.configuration)
    next_correct_answer = data.get("correct_answer", question.correct_answer)
    _validate_question_configuration(next_type, next_options, next_configuration, next_correct_answer)
    old_lesson_id = question.lesson_id
    if CONTENT_AFFECTING_QUESTION_FIELDS & data.keys():
        _reset_lesson_progress(db, old_lesson_id)
        _reset_lesson_progress(db, data.get("lesson_id"))
    for key, value in data.items():
        setattr(question, key, value)
    log_admin_action(db, admin, "update_question", "question", question.id, f"Обновлено задание {question.title}")
    db.commit()
    db.refresh(question)
    return _question_dict(question)


@router.delete("/questions/{question_id}")
def delete_question(question_id: UUID, admin: ArenaUser = Depends(get_current_admin), db: Session = Depends(get_db)):
    question = db.get(Question, question_id)
    if not question:
        raise HTTPException(status_code=404, detail="Question not found")
    _reset_lesson_progress(db, question.lesson_id)
    _purge_question_dependencies(db, question_id)
    log_admin_action(db, admin, "delete_question", "question", question.id, f"Удалено задание {question.title}")
    db.delete(question)
    db.commit()
    return {"ok": True}


@router.get("/tournaments")
def list_tournaments(_: ArenaUser = Depends(get_current_admin), db: Session = Depends(get_db)):
    tournaments = db.query(Tournament).options(selectinload(Tournament.questions).selectinload(TournamentQuestion.question)).order_by(Tournament.starts_at.desc()).all()
    return [_tournament_dict(tournament) for tournament in tournaments]


@router.post("/tournaments")
def create_tournament(payload: TournamentCreateIn, admin: ArenaUser = Depends(get_current_admin), db: Session = Depends(get_db)):
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
    log_admin_action(db, admin, "create_tournament", "tournament", tournament.id, f"Создан турнир {tournament.title}")
    db.commit()
    db.refresh(tournament)
    return _tournament_dict(tournament)


@router.patch("/tournaments/{tournament_id}")
def update_tournament(tournament_id: UUID, payload: TournamentUpdateIn, admin: ArenaUser = Depends(get_current_admin), db: Session = Depends(get_db)):
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
    log_admin_action(db, admin, "update_tournament", "tournament", tournament.id, f"Обновлён турнир {tournament.title}")
    db.commit()
    db.refresh(tournament)
    return _tournament_dict(tournament)


@router.put("/tournaments/{tournament_id}/questions")
def set_tournament_questions(tournament_id: UUID, payload: TournamentQuestionSetIn, admin: ArenaUser = Depends(get_current_admin), db: Session = Depends(get_db)):
    tournament = db.get(Tournament, tournament_id)
    if not tournament:
        raise HTTPException(status_code=404, detail="Tournament not found")
    db.query(TournamentQuestion).filter(TournamentQuestion.tournament_id == tournament.id).delete()
    for order, question_id in enumerate(payload.question_ids, start=1):
        if not db.get(Question, question_id):
            raise HTTPException(status_code=404, detail=f"Question not found: {question_id}")
        db.add(TournamentQuestion(tournament_id=tournament.id, question_id=question_id, order=order))
    log_admin_action(db, admin, "set_tournament_questions", "tournament", tournament.id, f"Обновлён состав заданий: {len(payload.question_ids)}")
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
def publish_tournament(tournament_id: UUID, admin: ArenaUser = Depends(get_current_admin), db: Session = Depends(get_db)):
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
    notifications_created = notify_tournament_published(db, tournament, users)
    log_admin_action(db, admin, "publish_tournament", "tournament", tournament.id, f"Опубликован турнир {tournament.title}; приглашений: {created}")
    db.commit()
    return {
        "ok": True,
        "status": tournament.status.value,
        "invitations_created": created,
        "notifications_created": notifications_created,
    }


@router.post("/tournaments/{tournament_id}/cancel")
def cancel_tournament(tournament_id: UUID, admin: ArenaUser = Depends(get_current_admin), db: Session = Depends(get_db)):
    tournament = db.get(Tournament, tournament_id)
    if not tournament:
        raise HTTPException(status_code=404, detail="Tournament not found")
    if tournament.status == TournamentStatus.finished:
        raise HTTPException(status_code=400, detail="Finished tournament cannot be cancelled")
    tournament.status = TournamentStatus.cancelled
    db.query(TournamentInvitation).filter(
        TournamentInvitation.tournament_id == tournament.id,
        TournamentInvitation.status.in_(["created", "seen"]),
    ).update({"status": "expired"}, synchronize_session=False)
    log_admin_action(db, admin, "cancel_tournament", "tournament", tournament.id, f"Отменён турнир {tournament.title}")
    db.commit()
    return {"ok": True, "status": tournament.status.value}


@router.get("/tournaments/{tournament_id}/invitations")
def tournament_invitations(tournament_id: UUID, _: ArenaUser = Depends(get_current_admin), db: Session = Depends(get_db)):
    rows = (
        db.query(TournamentInvitation, ArenaUser)
        .join(ArenaUser, ArenaUser.id == TournamentInvitation.user_id)
        .filter(TournamentInvitation.tournament_id == tournament_id)
        .order_by(TournamentInvitation.created_at)
        .all()
    )
    return [
        {
            "id": invitation.id,
            "user_id": user.id,
            "display_name": user.display_name,
            "email": user.email,
            "status": invitation.status,
            "created_at": invitation.created_at,
        }
        for invitation, user in rows
    ]


@router.post("/tournaments/{tournament_id}/invite")
def invite_user(tournament_id: UUID, payload: InviteUserIn, admin: ArenaUser = Depends(get_current_admin), db: Session = Depends(get_db)):
    tournament = db.get(Tournament, tournament_id)
    if not tournament:
        raise HTTPException(status_code=404, detail="Tournament not found")
    if tournament.status not in {TournamentStatus.published, TournamentStatus.active}:
        raise HTTPException(status_code=400, detail="Tournament must be published to invite users")
    user = db.get(ArenaUser, payload.user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    invitation = (
        db.query(TournamentInvitation)
        .filter(TournamentInvitation.user_id == user.id, TournamentInvitation.tournament_id == tournament.id)
        .one_or_none()
    )
    if invitation:
        if invitation.status == "expired":
            invitation.status = "created"
    else:
        invitation = TournamentInvitation(user_id=user.id, tournament_id=tournament.id, status="created")
        db.add(invitation)
    log_admin_action(db, admin, "invite_user", "tournament", tournament.id, f"Пользователь {user.display_name} приглашён в {tournament.title}")
    db.commit()
    return {"ok": True, "status": invitation.status}


@router.get("/tournaments/{tournament_id}/attempts/{user_id}")
def attempt_detail(tournament_id: UUID, user_id: UUID, _: ArenaUser = Depends(get_current_admin), db: Session = Depends(get_db)):
    attempt = (
        db.query(TournamentAttempt)
        .filter(TournamentAttempt.tournament_id == tournament_id, TournamentAttempt.user_id == user_id)
        .one_or_none()
    )
    if not attempt:
        raise HTTPException(status_code=404, detail="Attempt not found")
    answers = {str(row.question_id): row for row in db.query(TournamentAnswer).filter(TournamentAnswer.attempt_id == attempt.id).all()}
    items = (
        db.query(TournamentQuestion)
        .options(selectinload(TournamentQuestion.question))
        .filter(TournamentQuestion.tournament_id == tournament_id)
        .order_by(TournamentQuestion.order)
        .all()
    )
    return {
        "attempt_id": attempt.id,
        "user_id": attempt.user_id,
        "status": attempt.status.value,
        "score": attempt.score,
        "max_score": attempt.max_score,
        "started_at": attempt.started_at,
        "submitted_at": attempt.submitted_at,
        "answers": [
            {
                "question_id": item.question_id,
                "prompt": item.question.prompt,
                "type": item.question.type.value,
                "answer": answers[str(item.question_id)].answer if str(item.question_id) in answers else None,
                "correct_answer": item.question.correct_answer,
                "is_correct": answers[str(item.question_id)].is_correct if str(item.question_id) in answers else None,
                "points_awarded": answers[str(item.question_id)].points_awarded if str(item.question_id) in answers else 0,
                "points": item.question.points,
            }
            for item in items
        ],
    }


@router.post("/tournaments/{tournament_id}/finish")
def finish_tournament(tournament_id: UUID, admin: ArenaUser = Depends(get_current_admin), db: Session = Depends(get_db)):
    from app.api.routes.tournaments import _finalize_attempts

    tournament = (
        db.query(Tournament)
        .options(selectinload(Tournament.questions).selectinload(TournamentQuestion.question))
        .filter(Tournament.id == tournament_id)
        .one_or_none()
    )
    if not tournament:
        raise HTTPException(status_code=404, detail="Tournament not found")
    tournament.status = TournamentStatus.finished
    _finalize_attempts(db, tournament)
    log_admin_action(db, admin, "finish_tournament", "tournament", tournament.id, f"Завершён турнир {tournament.title}")
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


@router.get("/audit-log")
def audit_log(_: ArenaUser = Depends(get_current_admin), db: Session = Depends(get_db)):
    rows = (
        db.query(AdminActionLog, ArenaUser)
        .join(ArenaUser, ArenaUser.id == AdminActionLog.admin_id)
        .order_by(AdminActionLog.created_at.desc())
        .limit(200)
        .all()
    )
    return [
        {
            "id": entry.id,
            "admin_id": admin.id,
            "admin_name": admin.display_name,
            "action": entry.action,
            "target_type": entry.target_type,
            "target_id": entry.target_id,
            "description": entry.description,
            "created_at": entry.created_at,
        }
        for entry, admin in rows
    ]


DANGEROUS_CSV_PREFIXES = ("=", "+", "-", "@", "\t", "\r", "\n")


def csv_safe(value) -> str:
    text = "" if value is None else str(value)
    if text.startswith(DANGEROUS_CSV_PREFIXES):
        return "'" + text
    return text


@router.get("/tournaments/{tournament_id}/results.csv")
def tournament_results_csv(tournament_id: UUID, _: ArenaUser = Depends(get_current_admin), db: Session = Depends(get_db)):
    rows = tournament_results(tournament_id, _, db)
    buffer = StringIO()
    writer = csv.writer(buffer)
    writer.writerow(["place", "display_name", "email", "status", "score", "max_score", "started_at", "submitted_at"])
    for row in rows:
        writer.writerow(
            [
                csv_safe(row["place"]),
                csv_safe(row["display_name"]),
                csv_safe(row["email"] or ""),
                csv_safe(row["status"]),
                csv_safe(row["score"]),
                csv_safe(row["max_score"]),
                csv_safe(row["started_at"] or ""),
                csv_safe(row["submitted_at"] or ""),
            ]
        )
    return Response(buffer.getvalue(), media_type="text/csv; charset=utf-8")
