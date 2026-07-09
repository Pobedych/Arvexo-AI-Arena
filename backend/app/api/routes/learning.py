from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import func
from sqlalchemy.orm import Session, selectinload

from app.api.deps import get_current_user
from app.db.session import get_db
from app.models.entities import ArenaUser, ContentStatus, Lesson, LessonProgress, LessonStatus, Question, Section, Track, now_utc
from app.schemas.api import AnswerIn, LessonOut, LessonSubmitIn, QuestionOut, TrackOut
from app.services.grading import grade_question

router = APIRouter(tags=["learning"])


def _ai_track(db: Session) -> Track:
    track = (
        db.query(Track)
        .options(selectinload(Track.sections).selectinload(Section.lessons).selectinload(Lesson.questions))
        .filter(Track.slug == "ai", Track.status == ContentStatus.published)
        .one_or_none()
    )
    if not track:
        raise HTTPException(status_code=404, detail="AI Track is not available")
    return track


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


def _accessible_lesson(db: Session, user: ArenaUser, lesson_id: UUID) -> tuple[Lesson, dict[str, LessonProgress]]:
    track = _ai_track(db)
    lessons = _ordered_lessons(track)
    progress = _progress_map(db, user)
    lesson = next((item for item in lessons if item.id == lesson_id), None)
    if not lesson:
        raise HTTPException(status_code=404, detail="Lesson not found")
    if not _is_unlocked(lessons, progress, lesson):
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Complete previous lesson first")
    return lesson, progress


@router.post("/tracks/ai/select", response_model=TrackOut)
def select_ai_track(db: Session = Depends(get_db), current_user: ArenaUser = Depends(get_current_user)):
    track = _ai_track(db)
    current_user.selected_track_id = track.id
    db.commit()
    db.refresh(current_user)
    return get_ai_track(db, current_user)


@router.get("/tracks/ai", response_model=TrackOut)
def get_ai_track(db: Session = Depends(get_db), current_user: ArenaUser = Depends(get_current_user)):
    track = _ai_track(db)
    progress = _progress_map(db, current_user)
    lessons = _ordered_lessons(track)
    completed = sum(1 for lesson in lessons if progress.get(str(lesson.id)) and progress[str(lesson.id)].status == LessonStatus.completed)
    current = next((lesson for lesson in lessons if _is_unlocked(lessons, progress, lesson) and not (progress.get(str(lesson.id)) and progress[str(lesson.id)].status == LessonStatus.completed)), None)

    sections = []
    for section in sorted(track.sections, key=lambda item: item.order):
        lesson_items = []
        for lesson in sorted(section.lessons, key=lambda item: item.order):
            row = progress.get(str(lesson.id))
            status_value = row.status.value if row else "not_started"
            lesson_items.append(
                {
                    "id": lesson.id,
                    "title": lesson.title,
                    "summary": lesson.summary,
                    "order": lesson.order,
                    "status": status_value,
                    "unlocked": _is_unlocked(lessons, progress, lesson),
                    "best_score": row.best_score if row else 0,
                    "max_score": row.max_score if row else sum(q.points for q in lesson.questions),
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


@router.get("/lessons/{lesson_id}", response_model=LessonOut)
def get_lesson(lesson_id: UUID, db: Session = Depends(get_db), current_user: ArenaUser = Depends(get_current_user)):
    lesson, progress = _accessible_lesson(db, current_user, lesson_id)
    return {
        "id": lesson.id,
        "title": lesson.title,
        "summary": lesson.summary,
        "theory": lesson.theory,
        "order": lesson.order,
        "status": progress.get(str(lesson.id)).status.value if progress.get(str(lesson.id)) else "not_started",
        "questions": [
            QuestionOut(id=q.id, prompt=q.prompt, type=q.type.value, options=q.options, points=q.points)
            for q in lesson.questions
            if q.status == ContentStatus.published
        ],
    }


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
    db.commit()
    return {"score": score, "max_score": max_score, "percent": percent, "completed": progress.status == LessonStatus.completed, "results": results}


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
    return [QuestionOut(id=q.id, prompt=q.prompt, type=q.type.value, options=q.options, points=q.points) for q in questions]


@router.post("/practice/check")
def practice_check(payload: AnswerIn, db: Session = Depends(get_db), current_user: ArenaUser = Depends(get_current_user)):
    question = db.query(Question).filter(Question.id == payload.question_id, Question.status == ContentStatus.published).one_or_none()
    if not question:
        raise HTTPException(status_code=404, detail="Question not found")
    is_correct, points = grade_question(question, payload.answer)
    return {"is_correct": is_correct, "points": points, "max_points": question.points, "explanation": question.explanation}
