import enum
import uuid
from datetime import date, datetime, timezone

from sqlalchemy import Boolean, Date, DateTime, Enum, Float, ForeignKey, Integer, JSON, String, Text, UniqueConstraint
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.base import Base


def now_utc() -> datetime:
    return datetime.now(timezone.utc)


class TimestampMixin:
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=now_utc, nullable=False)
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=now_utc, onupdate=now_utc, nullable=False)


class UserRole(str, enum.Enum):
    user = "user"
    admin = "admin"


class LessonStatus(str, enum.Enum):
    not_started = "not_started"
    in_progress = "in_progress"
    completed = "completed"


class ContentStatus(str, enum.Enum):
    draft = "draft"
    published = "published"
    archived = "archived"


class QuestionType(str, enum.Enum):
    single_choice = "single_choice"
    multiple_choice = "multiple_choice"
    short_text = "short_text"
    number = "number"
    sequence = "sequence"
    matching = "matching"
    group_sort = "group_sort"
    fill_blanks = "fill_blanks"
    table_select = "table_select"
    code_order = "code_order"
    code_output = "code_output"
    code_fix = "code_fix"
    image_hotspot = "image_hotspot"
    graph_point = "graph_point"
    number_line = "number_line"
    slider_experiment = "slider_experiment"
    code_text = "code_text"


class TournamentStatus(str, enum.Enum):
    draft = "draft"
    published = "published"
    active = "active"
    finished = "finished"
    cancelled = "cancelled"


class ParticipationStatus(str, enum.Enum):
    invited = "invited"
    registered = "registered"
    in_progress = "in_progress"
    submitted = "submitted"
    auto_submitted = "auto_submitted"
    missed = "missed"


class ArenaUser(TimestampMixin, Base):
    __tablename__ = "arena_users"

    XP_PER_LEVEL = 30

    id: Mapped[uuid.UUID] = mapped_column(primary_key=True, default=uuid.uuid4)
    account_user_id: Mapped[str] = mapped_column(String(80), unique=True, index=True, nullable=False)
    email: Mapped[str | None] = mapped_column(String(255), index=True)
    display_name: Mapped[str] = mapped_column(String(160), default="Пользователь Arvexo", nullable=False)
    avatar_url: Mapped[str | None] = mapped_column(String(500))
    role: Mapped[UserRole] = mapped_column(Enum(UserRole), default=UserRole.user, nullable=False)
    selected_track_id: Mapped[uuid.UUID | None] = mapped_column(ForeignKey("tracks.id"))
    is_active: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)

    xp: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    current_streak: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    longest_streak: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    last_active_date: Mapped[date | None] = mapped_column(Date)

    sessions: Mapped[list["ArenaSession"]] = relationship(back_populates="user", cascade="all, delete-orphan")

    @property
    def level(self) -> int:
        return self.xp // self.XP_PER_LEVEL + 1


class ArenaSession(TimestampMixin, Base):
    __tablename__ = "arena_sessions"

    id: Mapped[uuid.UUID] = mapped_column(primary_key=True, default=uuid.uuid4)
    token_hash: Mapped[str] = mapped_column(String(64), unique=True, index=True, nullable=False)
    user_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("arena_users.id"), nullable=False)
    user_agent: Mapped[str | None] = mapped_column(String(500))
    ip_address: Mapped[str | None] = mapped_column(String(80))
    expires_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False)
    revoked_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))

    user: Mapped[ArenaUser] = relationship(back_populates="sessions")


class Track(TimestampMixin, Base):
    __tablename__ = "tracks"

    id: Mapped[uuid.UUID] = mapped_column(primary_key=True, default=uuid.uuid4)
    slug: Mapped[str] = mapped_column(String(80), unique=True, nullable=False)
    title: Mapped[str] = mapped_column(String(160), nullable=False)
    description: Mapped[str] = mapped_column(Text, default="", nullable=False)
    status: Mapped[ContentStatus] = mapped_column(Enum(ContentStatus), default=ContentStatus.published, nullable=False)

    sections: Mapped[list["Section"]] = relationship(back_populates="track", order_by="Section.order", cascade="all, delete-orphan")


class Section(TimestampMixin, Base):
    __tablename__ = "sections"

    id: Mapped[uuid.UUID] = mapped_column(primary_key=True, default=uuid.uuid4)
    track_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("tracks.id"), nullable=False)
    title: Mapped[str] = mapped_column(String(160), nullable=False)
    order: Mapped[int] = mapped_column(Integer, nullable=False)

    track: Mapped[Track] = relationship(back_populates="sections")
    lessons: Mapped[list["Lesson"]] = relationship(back_populates="section", order_by="Lesson.order", cascade="all, delete-orphan")


class Lesson(TimestampMixin, Base):
    __tablename__ = "lessons"

    id: Mapped[uuid.UUID] = mapped_column(primary_key=True, default=uuid.uuid4)
    section_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("sections.id"), nullable=False)
    title: Mapped[str] = mapped_column(String(220), nullable=False)
    summary: Mapped[str] = mapped_column(Text, default="", nullable=False)
    theory: Mapped[str] = mapped_column(Text, nullable=False)
    order: Mapped[int] = mapped_column(Integer, nullable=False)
    pass_percent: Mapped[int] = mapped_column(Integer, default=70, nullable=False)
    status: Mapped[ContentStatus] = mapped_column(Enum(ContentStatus), default=ContentStatus.published, nullable=False)

    section: Mapped[Section] = relationship(back_populates="lessons")
    questions: Mapped[list["Question"]] = relationship(back_populates="lesson", order_by="Question.order", cascade="all, delete-orphan")
    steps: Mapped[list["LessonStep"]] = relationship(back_populates="lesson", order_by="LessonStep.order", cascade="all, delete-orphan")


class LessonStep(TimestampMixin, Base):
    __tablename__ = "lesson_steps"

    id: Mapped[uuid.UUID] = mapped_column(primary_key=True, default=uuid.uuid4)
    lesson_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("lessons.id"), nullable=False)
    title: Mapped[str] = mapped_column(String(220), default="", nullable=False)
    body: Mapped[str] = mapped_column(Text, nullable=False)
    order: Mapped[int] = mapped_column(Integer, default=1, nullable=False)

    lesson: Mapped[Lesson] = relationship(back_populates="steps")


class Question(TimestampMixin, Base):
    __tablename__ = "questions"

    id: Mapped[uuid.UUID] = mapped_column(primary_key=True, default=uuid.uuid4)
    lesson_id: Mapped[uuid.UUID | None] = mapped_column(ForeignKey("lessons.id"))
    title: Mapped[str] = mapped_column(String(220), nullable=False)
    prompt: Mapped[str] = mapped_column(Text, nullable=False)
    type: Mapped[QuestionType] = mapped_column(Enum(QuestionType), nullable=False)
    options: Mapped[list[str] | None] = mapped_column(JSON)
    configuration: Mapped[dict | None] = mapped_column(JSON)
    correct_answer: Mapped[dict] = mapped_column(JSON, nullable=False)
    tolerance: Mapped[float | None] = mapped_column(Float)
    points: Mapped[int] = mapped_column(Integer, default=1, nullable=False)
    explanation: Mapped[str] = mapped_column(Text, nullable=False)
    difficulty: Mapped[str] = mapped_column(String(30), default="easy", nullable=False)
    order: Mapped[int] = mapped_column(Integer, default=1, nullable=False)
    status: Mapped[ContentStatus] = mapped_column(Enum(ContentStatus), default=ContentStatus.published, nullable=False)

    lesson: Mapped[Lesson | None] = relationship(back_populates="questions")


class LessonProgress(TimestampMixin, Base):
    __tablename__ = "lesson_progress"
    __table_args__ = (UniqueConstraint("user_id", "lesson_id", name="uq_user_lesson_progress"),)

    id: Mapped[uuid.UUID] = mapped_column(primary_key=True, default=uuid.uuid4)
    user_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("arena_users.id"), nullable=False)
    lesson_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("lessons.id"), nullable=False)
    status: Mapped[LessonStatus] = mapped_column(Enum(LessonStatus), default=LessonStatus.not_started, nullable=False)
    best_score: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    max_score: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    completed_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))


class ActivityLog(TimestampMixin, Base):
    __tablename__ = "activity_logs"
    __table_args__ = (UniqueConstraint("user_id", "activity_date", name="uq_user_activity_date"),)

    id: Mapped[uuid.UUID] = mapped_column(primary_key=True, default=uuid.uuid4)
    user_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("arena_users.id"), nullable=False)
    activity_date: Mapped[date] = mapped_column(Date, nullable=False)
    action_count: Mapped[int] = mapped_column(Integer, default=0, nullable=False)


class Tournament(TimestampMixin, Base):
    __tablename__ = "tournaments"

    id: Mapped[uuid.UUID] = mapped_column(primary_key=True, default=uuid.uuid4)
    track_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("tracks.id"), nullable=False)
    title: Mapped[str] = mapped_column(String(220), nullable=False)
    description: Mapped[str] = mapped_column(Text, default="", nullable=False)
    starts_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False)
    ends_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False)
    duration_minutes: Mapped[int] = mapped_column(Integer, default=60, nullable=False)
    status: Mapped[TournamentStatus] = mapped_column(Enum(TournamentStatus), default=TournamentStatus.published, nullable=False)
    randomize_questions: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)

    questions: Mapped[list["TournamentQuestion"]] = relationship(back_populates="tournament", order_by="TournamentQuestion.order", cascade="all, delete-orphan")


class TournamentQuestion(Base):
    __tablename__ = "tournament_questions"
    __table_args__ = (UniqueConstraint("tournament_id", "question_id", name="uq_tournament_question"),)

    tournament_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("tournaments.id"), primary_key=True)
    question_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("questions.id"), primary_key=True)
    order: Mapped[int] = mapped_column(Integer, nullable=False)

    tournament: Mapped[Tournament] = relationship(back_populates="questions")
    question: Mapped[Question] = relationship()


class TournamentInvitation(TimestampMixin, Base):
    __tablename__ = "tournament_invitations"
    __table_args__ = (UniqueConstraint("user_id", "tournament_id", name="uq_user_tournament_invitation"),)

    id: Mapped[uuid.UUID] = mapped_column(primary_key=True, default=uuid.uuid4)
    user_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("arena_users.id"), nullable=False)
    tournament_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("tournaments.id"), nullable=False)
    status: Mapped[str] = mapped_column(String(30), default="created", nullable=False)


class TournamentAttempt(TimestampMixin, Base):
    __tablename__ = "tournament_attempts"
    __table_args__ = (UniqueConstraint("user_id", "tournament_id", name="uq_user_tournament_attempt"),)

    id: Mapped[uuid.UUID] = mapped_column(primary_key=True, default=uuid.uuid4)
    user_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("arena_users.id"), nullable=False)
    tournament_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("tournaments.id"), nullable=False)
    status: Mapped[ParticipationStatus] = mapped_column(Enum(ParticipationStatus), default=ParticipationStatus.registered, nullable=False)
    started_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))
    due_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))
    submitted_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))
    score: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    max_score: Mapped[int] = mapped_column(Integer, default=0, nullable=False)


class TournamentAnswer(TimestampMixin, Base):
    __tablename__ = "tournament_answers"
    __table_args__ = (UniqueConstraint("attempt_id", "question_id", name="uq_attempt_question_answer"),)

    id: Mapped[uuid.UUID] = mapped_column(primary_key=True, default=uuid.uuid4)
    attempt_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("tournament_attempts.id"), nullable=False)
    question_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("questions.id"), nullable=False)
    answer: Mapped[dict] = mapped_column(JSON, nullable=False)
    is_correct: Mapped[bool | None] = mapped_column(Boolean)
    points_awarded: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
