from datetime import datetime
from typing import Any
from uuid import UUID

from pydantic import BaseModel, Field


class UserOut(BaseModel):
    id: UUID
    account_user_id: str
    email: str | None
    display_name: str
    avatar_url: str | None
    role: str
    selected_track_id: UUID | None


class AnswerIn(BaseModel):
    question_id: UUID
    answer: dict[str, Any]


class LessonSubmitIn(BaseModel):
    answers: list[AnswerIn]


class QuestionOut(BaseModel):
    id: UUID
    prompt: str
    type: str
    options: list[str] | None
    points: int
    explanation: str | None = None
    correct_answer: dict[str, Any] | None = None


class LessonOut(BaseModel):
    id: UUID
    title: str
    summary: str
    theory: str
    order: int
    status: str
    questions: list[QuestionOut]


class SectionOut(BaseModel):
    id: UUID
    title: str
    order: int
    lessons: list[dict[str, Any]]


class TrackOut(BaseModel):
    id: UUID
    slug: str
    title: str
    description: str
    progress_percent: int
    completed_lessons: int
    total_lessons: int
    current_lesson_id: UUID | None
    sections: list[SectionOut]


class TournamentOut(BaseModel):
    id: UUID
    title: str
    description: str
    starts_at: datetime
    ends_at: datetime
    duration_minutes: int
    status: str
    question_count: int
    max_score: int
    participation_status: str | None = None


class AttemptAnswerIn(BaseModel):
    answers: list[AnswerIn]


class SectionCreateIn(BaseModel):
    track_id: UUID
    title: str
    order: int = 1


class LessonCreateIn(BaseModel):
    section_id: UUID
    title: str
    summary: str = ""
    theory: str
    order: int = 1
    pass_percent: int = 70
    status: str = "draft"


class LessonUpdateIn(BaseModel):
    section_id: UUID | None = None
    title: str | None = None
    summary: str | None = None
    theory: str | None = None
    order: int | None = None
    pass_percent: int | None = None
    status: str | None = None


class QuestionCreateIn(BaseModel):
    lesson_id: UUID | None = None
    title: str
    prompt: str
    type: str = "single_choice"
    options: list[str] | None = None
    correct_answer: dict[str, Any]
    tolerance: float | None = None
    points: int = 1
    explanation: str
    difficulty: str = "easy"
    order: int = 1
    status: str = "draft"


class QuestionUpdateIn(BaseModel):
    lesson_id: UUID | None = None
    title: str | None = None
    prompt: str | None = None
    type: str | None = None
    options: list[str] | None = None
    correct_answer: dict[str, Any] | None = None
    tolerance: float | None = None
    points: int | None = None
    explanation: str | None = None
    difficulty: str | None = None
    order: int | None = None
    status: str | None = None


class TournamentCreateIn(BaseModel):
    track_id: UUID
    title: str
    description: str = ""
    starts_at: datetime
    ends_at: datetime
    duration_minutes: int = 60
    status: str = "draft"
    randomize_questions: bool = True
    question_ids: list[UUID] = Field(default_factory=list)


class TournamentUpdateIn(BaseModel):
    track_id: UUID | None = None
    title: str | None = None
    description: str | None = None
    starts_at: datetime | None = None
    ends_at: datetime | None = None
    duration_minutes: int | None = None
    status: str | None = None
    randomize_questions: bool | None = None


class TournamentQuestionSetIn(BaseModel):
    question_ids: list[UUID]
