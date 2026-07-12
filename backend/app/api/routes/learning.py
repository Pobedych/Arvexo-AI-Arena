from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import func
from sqlalchemy.orm import Session, selectinload

from app.api.deps import get_current_user
from app.db.session import get_db
from app.models.entities import ArenaUser, ContentStatus, Lesson, LessonBlock, LessonProgress, LessonStatus, Question, Section, Track, now_utc
from app.schemas.api import AnswerCheckIn, AnswerIn, LessonOut, LessonSubmitIn, QuestionOut, TrackOut
from app.services.gamification import record_activity, sync_xp, weekly_activity
from app.services.grading import grade_question

router = APIRouter(tags=["learning"])


def _track_by_slug(db: Session, slug: str) -> Track:
    track = (
        db.query(Track)
        .options(selectinload(Track.sections).selectinload(Section.lessons).selectinload(Lesson.questions))
        .filter(Track.slug == slug, Track.status == ContentStatus.published)
        .one_or_none()
    )
    if not track:
        raise HTTPException(status_code=404, detail="Track is not available")
    return track


def _ai_track(db: Session) -> Track:
    return _track_by_slug(db, "ai")


def _question_out(question: Question) -> QuestionOut:
    return QuestionOut(id=question.id, prompt=question.prompt, type=question.type.value, options=question.options, points=question.points, chart_data=question.chart_data)


def _progress_map(db: Session, user: ArenaUser) -> dict[str, LessonProgress]:
    rows = db.query(LessonProgress).filter(LessonProgress.user_id == user.id).all()
    return {str(row.lesson_id): row for row in rows}


def _ordered_lessons(track: Track) -> list[Lesson]:
    lessons: list[Lesson] = []
    for section in sorted(track.sections, key=lambda item: item.order):
        lessons.extend([lesson for lesson in sorted(section.lessons, key=lambda item: item.order) if lesson.status == ContentStatus.published])
    return lessons


def _is_unlocked(lessons: list[Lesson], progress: dict[str, LessonProgress], lesson: Lesson) -> bool:
    index = lessons.index(lesson)
    if index == 0:
        return True
    prev = progress.get(str(lessons[index - 1].id))
    return bool(prev and prev.status == LessonStatus.completed)


def _track_for_lesson(db: Session, lesson_id: UUID) -> Track | None:
    lesson_row = db.get(Lesson, lesson_id)
    if not lesson_row:
        return None
    section = db.get(Section, lesson_row.section_id)
    track_stub = db.get(Track, section.track_id) if section else None
    return _track_by_slug(db, track_stub.slug) if track_stub else None


def _accessible_lesson(db: Session, user: ArenaUser, lesson_id: UUID) -> tuple[Lesson, dict[str, LessonProgress]]:
    track = _track_for_lesson(db, lesson_id)
    if not track:
        raise HTTPException(status_code=404, detail="Lesson not found")
    lessons = _ordered_lessons(track)
    progress = _progress_map(db, user)
    lesson = next((item for item in lessons if item.id == lesson_id), None)
    if not lesson:
        raise HTTPException(status_code=404, detail="Lesson not found")
    if not _is_unlocked(lessons, progress, lesson):
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Complete previous lesson first")
    return lesson, progress


def _track_payload(db: Session, user: ArenaUser, track: Track) -> dict:
    progress = _progress_map(db, user)
    lessons = _ordered_lessons(track)
    completed = sum(1 for lesson in lessons if progress.get(str(lesson.id)) and progress[str(lesson.id)].status == LessonStatus.completed)
    current = next((lesson for lesson in lessons if _is_unlocked(lessons, progress, lesson) and not (progress.get(str(lesson.id)) and progress[str(lesson.id)].status == LessonStatus.completed)), None)

    sections = []
    for section in sorted(track.sections, key=lambda item: item.order):
        lesson_items = []
        for lesson in sorted(section.lessons, key=lambda item: item.order):
            if lesson.status != ContentStatus.published:
                continue
            row = progress.get(str(lesson.id))
            status_value = row.status.value if row else "not_started"
            current_max_score = sum(q.points for q in lesson.questions if q.status == ContentStatus.published)
            lesson_items.append(
                {
                    "id": lesson.id,
                    "title": lesson.title,
                    "summary": lesson.summary,
                    "order": lesson.order,
                    "status": status_value,
                    "unlocked": _is_unlocked(lessons, progress, lesson),
                    "best_score": min(row.best_score, current_max_score) if row else 0,
                    "max_score": current_max_score,
                }
            )
        sections.append({"id": section.id, "title": section.title, "order": section.order, "lessons": lesson_items})

    return {
        "id": track.id,
        "slug": track.slug,
        "title": track.title,
        "description": track.description,
        "progress_percent": round((completed / len(lessons)) * 100) if lessons else 0,
        "completed_lessons": completed,
        "total_lessons": len(lessons),
        "current_lesson_id": current.id if current else None,
        "sections": sections,
    }


@router.post("/tracks/ai/select", response_model=TrackOut)
def select_ai_track(db: Session = Depends(get_db), current_user: ArenaUser = Depends(get_current_user)):
    track = _ai_track(db)
    current_user.selected_track_id = track.id
    db.commit()
    db.refresh(current_user)
    return _track_payload(db, current_user, track)


@router.get("/tracks/ai", response_model=TrackOut)
def get_ai_track(db: Session = Depends(get_db), current_user: ArenaUser = Depends(get_current_user)):
    return _track_payload(db, current_user, _ai_track(db))


@router.post("/tracks/{slug}/select", response_model=TrackOut)
def select_track(slug: str, db: Session = Depends(get_db), current_user: ArenaUser = Depends(get_current_user)):
    track = _track_by_slug(db, slug)
    current_user.selected_track_id = track.id
    db.commit()
    db.refresh(current_user)
    return _track_payload(db, current_user, track)


@router.get("/tracks/{slug}", response_model=TrackOut)
def get_track(slug: str, db: Session = Depends(get_db), current_user: ArenaUser = Depends(get_current_user)):
    return _track_payload(db, current_user, _track_by_slug(db, slug))


@router.get("/lessons/{lesson_id}", response_model=LessonOut)
def get_lesson(lesson_id: UUID, db: Session = Depends(get_db), current_user: ArenaUser = Depends(get_current_user)):
    lesson, progress = _accessible_lesson(db, current_user, lesson_id)
    blocks = db.query(LessonBlock).filter(LessonBlock.lesson_id == lesson.id).order_by(LessonBlock.order).all()
    return {
        "id": lesson.id,
        "title": lesson.title,
        "summary": lesson.summary,
        "theory": lesson.theory,
        "order": lesson.order,
        "status": progress.get(str(lesson.id)).status.value if progress.get(str(lesson.id)) else "not_started",
        "questions": [_question_out(q) for q in lesson.questions if q.status == ContentStatus.published],
        "blocks": [
            {
                "id": block.id,
                "order": block.order,
                "kind": block.kind.value,
                "theory": block.theory,
                "question": _question_out(block.question) if block.question and block.question.status == ContentStatus.published else None,
            }
            for block in blocks
        ],
    }


@router.post("/lessons/{lesson_id}/questions/{question_id}/check")
def check_lesson_question(lesson_id: UUID, question_id: UUID, payload: AnswerCheckIn, db: Session = Depends(get_db), current_user: ArenaUser = Depends(get_current_user)):
    """Stateless mini-check for an interleaved lesson block (§4.1-style instant feedback). Does not persist progress — final `submit` remains authoritative."""
    lesson, _ = _accessible_lesson(db, current_user, lesson_id)
    question = next((q for q in lesson.questions if q.id == question_id and q.status == ContentStatus.published), None)
    if not question:
        raise HTTPException(status_code=404, detail="Question not found")
    is_correct, points = grade_question(question, payload.answer)
    return {"is_correct": is_correct, "points": points, "max_points": question.points, "explanation": question.explanation}


@router.post("/lessons/{lesson_id}/submit")
def submit_lesson(lesson_id: UUID, payload: LessonSubmitIn, db: Session = Depends(get_db), current_user: ArenaUser = Depends(get_current_user)):
    lesson, _ = _accessible_lesson(db, current_user, lesson_id)
    questions = [question for question in lesson.questions if question.status == ContentStatus.published]
    answers = {str(item.question_id): item.answer for item in payload.answers}
    score = 0
    max_score = 0
    results = []
    for question in questions:
        max_score += question.points
        is_correct, points = grade_question(question, answers.get(str(question.id)))
        score += points
        results.append({"question_id": question.id, "is_correct": is_correct, "points": points, "explanation": question.explanation})

    percent = round((score / max_score) * 100) if max_score else 0
    progress = (
        db.query(LessonProgress)
        .filter(LessonProgress.user_id == current_user.id, LessonProgress.lesson_id == lesson.id)
        .one_or_none()
    )
    if not progress:
        progress = LessonProgress(user_id=current_user.id, lesson_id=lesson.id, best_score=0, max_score=max_score)
        db.add(progress)
    progress.best_score = max(progress.best_score, score)
    progress.max_score = max_score
    progress.status = LessonStatus.completed if percent >= lesson.pass_percent else LessonStatus.in_progress
    if progress.status == LessonStatus.completed and not progress.completed_at:
        progress.completed_at = now_utc()
    record_activity(db, current_user)
    sync_xp(db, current_user)
    db.commit()
    return {"score": score, "max_score": max_score, "percent": percent, "completed": progress.status == LessonStatus.completed, "results": results}


@router.get("/activity/week")
def get_weekly_activity(db: Session = Depends(get_db), current_user: ArenaUser = Depends(get_current_user)):
    return weekly_activity(db, current_user)


@router.get("/practice/questions", response_model=list[QuestionOut])
def practice_questions(limit: int = 3, db: Session = Depends(get_db), current_user: ArenaUser = Depends(get_current_user)):
    track = _ai_track(db)
    lesson_ids = [lesson.id for section in track.sections for lesson in section.lessons if lesson.status == ContentStatus.published]
    questions = (
        db.query(Question)
        .filter(Question.lesson_id.in_(lesson_ids), Question.status == ContentStatus.published)
        .order_by(func.random())
        .limit(max(1, min(limit, 10)))
        .all()
    )
    return [_question_out(q) for q in questions]


@router.post("/practice/check")
def practice_check(payload: AnswerIn, db: Session = Depends(get_db), current_user: ArenaUser = Depends(get_current_user)):
    question = db.query(Question).filter(Question.id == payload.question_id, Question.status == ContentStatus.published).one_or_none()
    if not question:
        raise HTTPException(status_code=404, detail="Question not found")
    is_correct, points = grade_question(question, payload.answer)
    record_activity(db, current_user)
    db.commit()
    return {"is_correct": is_correct, "points": points, "max_points": question.points, "explanation": question.explanation}
