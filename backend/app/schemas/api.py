from datetime import datetime
from typing import Any
from uuid import UUID

from pydantic import BaseModel, Field, field_validator

AnswerScalar = str | int | float | bool
AnswerValue = AnswerScalar | list[AnswerScalar] | None
MAX_ANSWER_TEXT_LENGTH = 2000
MAX_ANSWER_LIST_LENGTH = 50
MAX_ANSWER_FIELDS = 10


class UserOut(BaseModel):
    id: UUID
    account_user_id: str
    email: str | None
    display_name: str
    avatar_url: str | None
    role: str
    selected_track_id: UUID | None
    xp: int
    level: int
    current_streak: int
    longest_streak: int
    arena_score: float | None = None


class AnswerIn(BaseModel):
    question_id: UUID
    answer: dict[str, AnswerValue] = Field(default_factory=dict)

    @field_validator("answer")
    @classmethod
    def validate_answer_shape(cls, value: dict[str, AnswerValue]) -> dict[str, AnswerValue]:
        if len(value) > MAX_ANSWER_FIELDS:
            raise ValueError(f"Answer has too many fields (max {MAX_ANSWER_FIELDS})")
        for item in value.values():
            if isinstance(item, str) and len(item) > MAX_ANSWER_TEXT_LENGTH:
                raise ValueError(f"Answer text is too long (max {MAX_ANSWER_TEXT_LENGTH} chars)")
            if isinstance(item, list) and len(item) > MAX_ANSWER_LIST_LENGTH:
                raise ValueError(f"Answer list is too long (max {MAX_ANSWER_LIST_LENGTH} items)")
        return value


class LessonSubmitIn(BaseModel):
    answers: list[AnswerIn] = Field(max_length=100)


class QuestionOut(BaseModel):
    id: UUID
    prompt: str
    type: str
    options: list[str] | None
    points: int
    explanation: str | None = None
    correct_answer: dict[str, Any] | None = None
    chart_data: dict[str, Any] | None = None


class LessonBlockOut(BaseModel):
    id: UUID
    order: int
    kind: str
    theory: str | None = None
    question: QuestionOut | None = None


class LessonOut(BaseModel):
    id: UUID
    title: str
    summary: str
    theory: str
    order: int
    status: str
    questions: list[QuestionOut]
    blocks: list[LessonBlockOut] = Field(default_factory=list)


class AnswerCheckIn(BaseModel):
    answer: dict[str, AnswerValue] = Field(default_factory=dict)


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
    topics: list[str] = Field(default_factory=list)
    readiness: str | None = None


class AttemptAnswerIn(BaseModel):
    answers: list[AnswerIn] = Field(max_length=100)


class SectionCreateIn(BaseModel):
    track_id: UUID
    title: str
    order: int = 1


class SectionUpdateIn(BaseModel):
    title: str | None = None
    order: int | None = None


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
    chart_data: dict[str, Any] | None = None


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
    chart_data: dict[str, Any] | None = None


class LessonBlockCreateIn(BaseModel):
    lesson_id: UUID
    order: int = 1
    kind: str
    theory: str | None = None
    question_id: UUID | None = None


class LessonBlockUpdateIn(BaseModel):
    order: int | None = None
    kind: str | None = None
    theory: str | None = None
    question_id: UUID | None = None


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


class TrackUpdateIn(BaseModel):
    title: str | None = None
    description: str | None = None
    status: str | None = None


class InviteUserIn(BaseModel):
    user_id: UUID
