export type ApiUser = {
  id: string;
  account_user_id: string;
  email: string | null;
  display_name: string;
  avatar_url: string | null;
  role: string;
  selected_track_id: string | null;
  xp: number;
  level: number;
  current_streak: number;
  longest_streak: number;
  arena_score: number | null;
};

export type TrackLesson = {
  id: string;
  title: string;
  summary: string;
  order: number;
  status: "not_started" | "in_progress" | "completed" | string;
  unlocked: boolean;
  best_score: number;
  max_score: number;
};

export type TrackSection = {
  id: string;
  title: string;
  order: number;
  lessons: TrackLesson[];
};

export type Track = {
  id: string;
  slug: string;
  title: string;
  description: string;
  progress_percent: number;
  completed_lessons: number;
  total_lessons: number;
  current_lesson_id: string | null;
  sections: TrackSection[];
};

export type ActivityDay = {
  date: string;
  count: number;
};

export type Question = {
  id: string;
  prompt: string;
  type: "single_choice" | "multiple_choice" | "short_text" | "number" | "sequence" | "matching" | "code_text" | string;
  options: string[] | null;
  configuration?: Record<string, unknown> | null;
  points: number;
  explanation?: string | null;
  correct_answer?: Record<string, unknown> | null;
};

export type Lesson = {
  id: string;
  title: string;
  summary: string;
  theory: string;
  order: number;
  status: string;
  questions: Question[];
};

export type Tournament = {
  id: string;
  title: string;
  description: string;
  starts_at: string;
  ends_at: string;
  duration_minutes: number;
  status: "draft" | "published" | "active" | "finished" | "cancelled" | string;
  question_count: number;
  max_score: number;
  participation_status: "invited" | "registered" | "in_progress" | "submitted" | "auto_submitted" | "missed" | string | null;
  topics: string[];
  readiness: "ready" | "prepare" | string | null;
};

export type Attempt = {
  attempt_id: string;
  status: string;
  started_at: string | null;
  due_at: string | null;
  questions: Question[];
};

export type TournamentResult = {
  status: string;
  score: number;
  max_score: number;
  duration_seconds: number | null;
  place: number | null;
  participants: number | null;
  review_available: boolean;
  review?: Array<{
    question_id: string;
    prompt: string;
    answer: Record<string, unknown> | null;
    correct_answer: Record<string, unknown>;
    is_correct: boolean;
    points: number;
    explanation: string;
    lesson_id: string | null;
    lesson_title: string | null;
  }>;
};

export type PracticeCheckResult = {
  is_correct: boolean;
  points: number;
  max_points: number;
  explanation: string;
};

export type LeaderboardRow = {
  rank: number;
  display_name: string;
  score: number;
  max_score: number;
  duration_seconds: number | null;
  status: string;
  is_you: boolean;
};

export type Leaderboard = {
  tournament_id: string;
  status: string;
  rows: LeaderboardRow[];
};

export class ApiError extends Error {
  status: number;

  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

export async function api<T>(path: string, init: RequestInit = {}): Promise<T> {
  const response = await fetch(`/api${path}`, {
    ...init,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...(init.headers ?? {}),
    },
  });

  if (response.status === 401 && typeof window !== "undefined") {
    window.location.href = "/login?reason=expired";
    throw new ApiError(401, "Authentication required");
  }

  if (!response.ok) {
    let message = response.statusText;
    try {
      const body = await response.json();
      message = body.detail ?? message;
    } catch {
      // Keep the HTTP status text when the server did not return JSON.
    }
    throw new ApiError(response.status, message);
  }

  return response.json() as Promise<T>;
}

export function flattenLessons(track: Track): TrackLesson[] {
  return track.sections.flatMap((section) => section.lessons).sort((a, b) => a.order - b.order);
}

export function currentLesson(track: Track): TrackLesson | null {
  const lessons = flattenLessons(track);
  return lessons.find((lesson) => lesson.id === track.current_lesson_id) ?? lessons.find((lesson) => lesson.unlocked) ?? lessons[0] ?? null;
}

export function formatDateTime(value: string) {
  return new Intl.DateTimeFormat("ru-RU", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}

export function formatDuration(seconds: number | null) {
  if (seconds === null) return "—";
  const minutes = Math.floor(seconds / 60);
  const rest = seconds % 60;
  return `${minutes} мин ${rest.toString().padStart(2, "0")} с`;
}

export type AnswerValue = number | number[] | string;

export function toApiAnswer(question: Question, value: AnswerValue | undefined) {
  if (question.type === "single_choice") return { option: value };
  if (question.type === "multiple_choice") return { options: Array.isArray(value) ? value : [] };
  if (question.type === "number") return { number: Number(value) };
  if (question.type === "sequence") return { order: Array.isArray(value) ? value : [] };
  if (question.type === "matching") return { matches: Array.isArray(value) ? value : [] };
  if (question.type === "code_text") return { code: String(value ?? "") };
  return { text: String(value ?? "") };
}

export function sequenceInitialOrder(question: Question): number[] {
  return deterministicShuffledIndices(question.id, question.options?.length ?? 0);
}

export function deterministicShuffledIndices(id: string, length: number): number[] {
  const order = Array.from({ length }, (_, index) => index);
  const hash = Array.from(id).reduce((value, character) => ((value * 31) + character.charCodeAt(0)) >>> 0, 2166136261);

  for (let index = order.length - 1; index > 0; index -= 1) {
    const swapIndex = (hash + index * 17) % (index + 1);
    [order[index], order[swapIndex]] = [order[swapIndex], order[index]];
  }

  if (order.length > 1 && order.every((value, index) => value === index)) {
    order.push(order.shift() as number);
  }
  return order;
}

export function matchingInitialValue(question: Question): number[] {
  return Array.from({ length: question.options?.length ?? 0 }, () => -1);
}
