from datetime import datetime
from typing import Any
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field, field_validator

AnswerScalar = str | int | float | bool
AnswerValue = AnswerScalar | list[AnswerScalar] | None
MAX_ANSWER_TEXT_LENGTH = 2000
MAX_ANSWER_LIST_LENGTH = 50
MAX_ANSWER_FIELDS = 10


class UserOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

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
    streak_extended_today: bool = False
    arena_score: float | None = None


class NotificationOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: UUID
    kind: str
    title: str
    body: str
    href: str
    created_at: datetime
    read_at: datetime | None


class NotificationListOut(BaseModel):
    items: list[NotificationOut]
    unread_count: int


class PushKeysIn(BaseModel):
    p256dh: str = Field(min_length=1, max_length=500)
    auth: str = Field(min_length=1, max_length=500)


class PushSubscriptionIn(BaseModel):
    endpoint: str = Field(min_length=1, max_length=4000)
    keys: PushKeysIn


class PushUnsubscribeIn(BaseModel):
    endpoint: str = Field(min_length=1, max_length=4000)


class PushConfigOut(BaseModel):
    enabled: bool
    public_key: str | None = None
    subscribed: bool = False


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
    configuration: dict[str, Any] | None = None
    points: int
    explanation: str | None = None
    correct_answer: dict[str, Any] | None = None
    order: int = 1


class LessonStepOut(BaseModel):
    id: UUID
    title: str
    body: str
    order: int


class LessonOut(BaseModel):
    id: UUID
    track_slug: str
    track_title: str
    title: str
    summary: str
    theory: str
    order: int
    status: str
    current_block: int = 0
    steps: list[LessonStepOut] = []
    questions: list[QuestionOut]


class LessonProgressUpdate(BaseModel):
    current_block: int = Field(ge=0, le=1000)


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


class TrackSummaryOut(BaseModel):
    id: UUID
    slug: str
    title: str
    description: str
    selected: bool = False


class PublicTrackSectionOut(BaseModel):
    title: str
    lesson_count: int


class PublicTrackOut(BaseModel):
    id: UUID
    slug: str
    title: str
    description: str
    section_count: int
    lesson_count: int
    sections: list[PublicTrackSectionOut]


class PublicTournamentOut(BaseModel):
    id: UUID
    track_slug: str
    track_title: str
    title: str
    description: str
    starts_at: datetime
    ends_at: datetime
    duration_minutes: int
    status: str
    question_count: int
    max_score: int


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


class LessonStepIn(BaseModel):
    title: str = ""
    body: str
    order: int = 1


class LessonCreateIn(BaseModel):
    section_id: UUID
    title: str
    summary: str = ""
    theory: str = ""
    order: int = 1
    pass_percent: int = 70
    status: str = "draft"
    steps: list[LessonStepIn] = []


class LessonUpdateIn(BaseModel):
    section_id: UUID | None = None
    title: str | None = None
    summary: str | None = None
    theory: str | None = None
    order: int | None = None
    pass_percent: int | None = None
    status: str | None = None
    steps: list[LessonStepIn] | None = None


class QuestionCreateIn(BaseModel):
    lesson_id: UUID | None = None
    title: str
    prompt: str
    type: str = "single_choice"
    options: list[str] | None = None
    configuration: dict[str, Any] | None = None
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
    configuration: dict[str, Any] | None = None
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


class TrackUpdateIn(BaseModel):
    title: str | None = None
    description: str | None = None
    status: str | None = None


class InviteUserIn(BaseModel):
    user_id: UUID
