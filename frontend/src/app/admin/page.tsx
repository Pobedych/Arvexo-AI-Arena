"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import Link from "next/link";

type Dashboard = {
  users: number;
  ai_track_users: number;
  lessons: number;
  questions: number;
  tournaments: number;
  invitations: number;
  attempts: number;
};

type Track = {
  id: string;
  title: string;
  slug: string;
  status: string;
  sections: { id: string; title: string; order: number; lessons_count: number }[];
};

type Lesson = {
  id: string;
  section_id: string;
  title: string;
  summary: string;
  theory: string;
  order: number;
  pass_percent: number;
  status: string;
  questions_count: number;
};

type Question = {
  id: string;
  lesson_id: string | null;
  title: string;
  prompt: string;
  type: string;
  options: string[] | null;
  correct_answer: Record<string, unknown>;
  points: number;
  explanation: string;
  difficulty: string;
  order: number;
  status: string;
};

type Tournament = {
  id: string;
  track_id: string;
  title: string;
  description: string;
  starts_at: string;
  ends_at: string;
  duration_minutes: number;
  status: string;
  question_count: number;
  max_score: number;
  question_ids: string[];
};

type UserRow = {
  id: string;
  email: string | null;
  display_name: string;
  role: string;
  selected_track_id: string | null;
  is_active: boolean;
};

type ResultRow = {
  place: number;
  display_name: string;
  email: string | null;
  status: string;
  score: number;
  max_score: number;
};

const tabs = [
  { id: "overview", label: "Обзор" },
  { id: "lessons", label: "Уроки" },
  { id: "questions", label: "Банк заданий" },
  { id: "tournaments", label: "Турниры" },
  { id: "users", label: "Пользователи" },
] as const;

type Tab = (typeof tabs)[number]["id"];

async function api<T>(path: string, init?: RequestInit): Promise<T> {
  const headers = new Headers(init?.headers);
  if (init?.body && !headers.has("Content-Type")) headers.set("Content-Type", "application/json");
  const response = await fetch(`/api${path}`, { ...init, headers, credentials: "include" });
  if (!response.ok) {
    const data = await response.json().catch(() => ({}));
    throw new Error(data.detail || "Не удалось выполнить запрос");
  }
  if (response.status === 204) return undefined as T;
  return response.json();
}

function inputClass(extra = "") {
  return `w-full rounded-[10px] border border-[rgba(21,23,28,.14)] bg-white px-3.5 py-2.5 text-[13px] outline-none focus:border-[#16a34a] ${extra}`;
}

function isoLocal(value: string) {
  if (!value) return "";
  const date = new Date(value);
  const offset = date.getTimezoneOffset() * 60000;
  return new Date(date.getTime() - offset).toISOString().slice(0, 16);
}

function fromLocal(value: string) {
  return new Date(value).toISOString();
}

export default function AdminPage() {
  const [active, setActive] = useState<Tab>("overview");
  const [dashboard, setDashboard] = useState<Dashboard | null>(null);
  const [tracks, setTracks] = useState<Track[]>([]);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [users, setUsers] = useState<UserRow[]>([]);
  const [results, setResults] = useState<Record<string, ResultRow[]>>({});
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [defaultDates] = useState(() => {
    const start = new Date();
    const end = new Date(start.getTime() + 7 * 86400000);
    return { start: start.toISOString(), end: end.toISOString() };
  });

  const sections = useMemo(() => tracks.flatMap((track) => track.sections.map((section) => ({ ...section, trackTitle: track.title }))), [tracks]);
  const aiTrack = tracks.find((track) => track.slug === "ai") ?? tracks[0];

  async function loadAll() {
    setError("");
    try {
      const [dash, trackRows, lessonRows, questionRows, tournamentRows, userRows] = await Promise.all([
        api<Dashboard>("/admin/dashboard"),
        api<Track[]>("/admin/tracks"),
        api<Lesson[]>("/admin/lessons"),
        api<Question[]>("/admin/questions"),
        api<Tournament[]>("/admin/tournaments"),
        api<UserRow[]>("/admin/users"),
      ]);
      setDashboard(dash);
      setTracks(trackRows);
      setLessons(lessonRows);
      setQuestions(questionRows);
      setTournaments(tournamentRows);
      setUsers(userRows);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Ошибка загрузки админки");
    }
  }

  useEffect(() => {
    let activeRequest = true;
    async function run() {
      await Promise.resolve();
      if (activeRequest) await loadAll();
    }
    void run();
    return () => {
      activeRequest = false;
    };
  }, []);

  async function submitLesson(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    try {
      await api("/admin/lessons", {
        method: "POST",
        body: JSON.stringify({
          section_id: form.get("section_id"),
          title: form.get("title"),
          summary: form.get("summary"),
          theory: form.get("theory"),
          order: Number(form.get("order") || 1),
          pass_percent: Number(form.get("pass_percent") || 70),
          status: form.get("status"),
        }),
      });
      event.currentTarget.reset();
      setNotice("Урок создан");
      await loadAll();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Не удалось создать урок");
    }
  }

  async function submitQuestion(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    try {
      const options = String(form.get("options") || "")
        .split("\n")
        .map((item) => item.trim())
        .filter(Boolean);
      await api("/admin/questions", {
        method: "POST",
        body: JSON.stringify({
          lesson_id: form.get("lesson_id") || null,
          title: form.get("title"),
          prompt: form.get("prompt"),
          type: form.get("type"),
          options: options.length ? options : null,
          correct_answer: JSON.parse(String(form.get("correct_answer") || "{}")),
          points: Number(form.get("points") || 1),
          explanation: form.get("explanation"),
          difficulty: form.get("difficulty"),
          order: Number(form.get("order") || 1),
          status: form.get("status"),
        }),
      });
      event.currentTarget.reset();
      setNotice("Задание создано");
      await loadAll();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Не удалось создать задание");
    }
  }

  async function submitTournament(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    try {
      const questionIds = String(form.get("question_ids") || "")
        .split("\n")
        .map((item) => item.trim())
        .filter(Boolean);
      await api("/admin/tournaments", {
        method: "POST",
        body: JSON.stringify({
          track_id: form.get("track_id"),
          title: form.get("title"),
          description: form.get("description"),
          starts_at: fromLocal(String(form.get("starts_at"))),
          ends_at: fromLocal(String(form.get("ends_at"))),
          duration_minutes: Number(form.get("duration_minutes") || 60),
          status: form.get("status"),
          randomize_questions: form.get("randomize_questions") === "on",
          question_ids: questionIds,
        }),
      });
      event.currentTarget.reset();
      setNotice("Турнир создан");
      await loadAll();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Не удалось создать турнир");
    }
  }

  async function patchLesson(id: string, status: string) {
    await api(`/admin/lessons/${id}`, { method: "PATCH", body: JSON.stringify({ status }) });
    await loadAll();
  }

  async function patchQuestion(id: string, status: string) {
    await api(`/admin/questions/${id}`, { method: "PATCH", body: JSON.stringify({ status }) });
    await loadAll();
  }

  async function publishTournament(id: string) {
    const data = await api<{ invitations_created: number }>(`/admin/tournaments/${id}/publish`, { method: "POST" });
    setNotice(`Турнир опубликован. Приглашений создано: ${data.invitations_created}`);
    await loadAll();
  }

  async function finishTournament(id: string) {
    await api(`/admin/tournaments/${id}/finish`, { method: "POST" });
    setNotice("Турнир завершён");
    await loadAll();
  }

  async function loadResults(id: string) {
    const rows = await api<ResultRow[]>(`/admin/tournaments/${id}/results`);
    setResults((current) => ({ ...current, [id]: rows }));
  }

  return (
    <main className="min-h-screen bg-[#f6f4ee] px-6 py-6">
      <div className="mx-auto max-w-[1180px]">
        <div className="mb-5 flex items-center justify-between gap-4">
          <Link href="/" className="flex items-center gap-2.5">
            <span className="grid h-8 w-8 place-items-center rounded-[9px] bg-[#15171c] text-[13px] font-extrabold text-[#ffb100]">A</span>
            <strong className="text-[15px]">Arena Admin</strong>
          </Link>
          <Link href="/app/dashboard" className="rounded-full border border-[rgba(21,23,28,.14)] bg-white px-4 py-2 text-[12.5px] font-bold">
            Кабинет
          </Link>
        </div>

        <div className="mb-5 flex flex-wrap gap-2 rounded-[18px] bg-[#15171c] p-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActive(tab.id)}
              className="rounded-full px-4 py-2 text-[13px] font-bold"
              style={{ background: active === tab.id ? "#ffb100" : "transparent", color: active === tab.id ? "#15171c" : "rgba(255,255,255,.62)" }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {error && <div className="mb-4 rounded-[12px] border border-[rgba(255,77,61,.25)] bg-[rgba(255,77,61,.08)] px-4 py-3 text-[13px] text-[#b42318]">{error}</div>}
        {notice && <div className="mb-4 rounded-[12px] border border-[rgba(22,163,74,.22)] bg-[rgba(22,163,74,.08)] px-4 py-3 text-[13px] text-[#15803d]">{notice}</div>}

        {active === "overview" && (
          <section>
            <h1 className="mb-4 font-[family-name:var(--font-display)] text-[34px] font-semibold tracking-[-.02em]">Состояние MVP</h1>
            <div className="grid gap-3 sm:grid-cols-4">
              {dashboard &&
                [
                  ["Пользователи", dashboard.users],
                  ["AI Track", dashboard.ai_track_users],
                  ["Уроки", dashboard.lessons],
                  ["Задания", dashboard.questions],
                  ["Турниры", dashboard.tournaments],
                  ["Приглашения", dashboard.invitations],
                  ["Попытки", dashboard.attempts],
                ].map(([label, value]) => (
                  <div key={label} className="rounded-[18px] border border-[rgba(21,23,28,.08)] bg-white p-4">
                    <strong className="block font-[family-name:var(--font-display)] text-[30px]">{value}</strong>
                    <span className="text-[12px] text-[#6b6f76]">{label}</span>
                  </div>
                ))}
            </div>
          </section>
        )}

        {active === "lessons" && (
          <section className="grid gap-4 lg:grid-cols-[420px_1fr]">
            <form onSubmit={submitLesson} className="rounded-[18px] border border-[rgba(21,23,28,.08)] bg-white p-5">
              <h2 className="mb-4 text-[17px] font-extrabold">Новый урок</h2>
              <div className="grid gap-3">
                <select name="section_id" required className={inputClass()}>
                  <option value="">Раздел</option>
                  {sections.map((section) => (
                    <option key={section.id} value={section.id}>
                      {section.trackTitle} / {section.title}
                    </option>
                  ))}
                </select>
                <input name="title" required placeholder="Название" className={inputClass()} />
                <input name="summary" placeholder="Краткое описание" className={inputClass()} />
                <textarea name="theory" required placeholder="Теория" rows={8} className={inputClass()} />
                <div className="grid grid-cols-3 gap-2">
                  <input name="order" type="number" defaultValue={lessons.length + 1} className={inputClass()} />
                  <input name="pass_percent" type="number" defaultValue={70} className={inputClass()} />
                  <select name="status" defaultValue="draft" className={inputClass()}>
                    <option value="draft">draft</option>
                    <option value="published">published</option>
                    <option value="archived">archived</option>
                  </select>
                </div>
                <button className="h-11 rounded-full bg-[#15171c] text-[13px] font-bold text-white">Создать урок</button>
              </div>
            </form>

            <div className="rounded-[18px] border border-[rgba(21,23,28,.08)] bg-white">
              {lessons.map((lesson) => (
                <div key={lesson.id} className="flex items-center gap-3 border-b border-[rgba(21,23,28,.07)] px-5 py-4 last:border-b-0">
                  <div className="min-w-0 flex-1">
                    <strong className="block truncate text-[13.5px]">{lesson.order}. {lesson.title}</strong>
                    <span className="text-[11.5px] text-[#6b6f76]">{lesson.status} · заданий: {lesson.questions_count}</span>
                  </div>
                  <button onClick={() => patchLesson(lesson.id, "published")} className="rounded-full bg-[#16a34a] px-3 py-1.5 text-[11.5px] font-bold text-white">
                    Publish
                  </button>
                  <button onClick={() => patchLesson(lesson.id, "archived")} className="rounded-full border border-[rgba(21,23,28,.14)] px-3 py-1.5 text-[11.5px] font-bold">
                    Archive
                  </button>
                </div>
              ))}
            </div>
          </section>
        )}

        {active === "questions" && (
          <section className="grid gap-4 lg:grid-cols-[460px_1fr]">
            <form onSubmit={submitQuestion} className="rounded-[18px] border border-[rgba(21,23,28,.08)] bg-white p-5">
              <h2 className="mb-4 text-[17px] font-extrabold">Новое задание</h2>
              <div className="grid gap-3">
                <select name="lesson_id" className={inputClass()}>
                  <option value="">Без привязки к уроку</option>
                  {lessons.map((lesson) => <option key={lesson.id} value={lesson.id}>{lesson.title}</option>)}
                </select>
                <input name="title" required placeholder="Название для админа" className={inputClass()} />
                <textarea name="prompt" required placeholder="Условие" rows={4} className={inputClass()} />
                <select name="type" defaultValue="single_choice" className={inputClass()}>
                  <option value="single_choice">single_choice</option>
                  <option value="multiple_choice">multiple_choice</option>
                  <option value="short_text">short_text</option>
                  <option value="number">number</option>
                </select>
                <textarea name="options" placeholder={"Варианты, каждый с новой строки"} rows={4} className={inputClass()} />
                <input name="correct_answer" required defaultValue='{"option":0}' className={inputClass("font-mono")} />
                <div className="grid grid-cols-4 gap-2">
                  <input name="points" type="number" defaultValue={5} className={inputClass()} />
                  <input name="order" type="number" defaultValue={1} className={inputClass()} />
                  <select name="difficulty" defaultValue="easy" className={inputClass()}>
                    <option value="easy">easy</option>
                    <option value="medium">medium</option>
                    <option value="hard">hard</option>
                  </select>
                  <select name="status" defaultValue="draft" className={inputClass()}>
                    <option value="draft">draft</option>
                    <option value="published">published</option>
                    <option value="archived">archived</option>
                  </select>
                </div>
                <textarea name="explanation" required placeholder="Объяснение" rows={3} className={inputClass()} />
                <button className="h-11 rounded-full bg-[#15171c] text-[13px] font-bold text-white">Создать задание</button>
              </div>
            </form>

            <div className="rounded-[18px] border border-[rgba(21,23,28,.08)] bg-white">
              {questions.map((question) => (
                <div key={question.id} className="border-b border-[rgba(21,23,28,.07)] px-5 py-4 last:border-b-0">
                  <div className="mb-2 flex items-center gap-3">
                    <strong className="min-w-0 flex-1 truncate text-[13.5px]">{question.title}</strong>
                    <span className="rounded-full bg-[#f6f4ee] px-2.5 py-1 text-[10.5px] font-bold text-[#6b6f76]">{question.type}</span>
                    <span className="text-[11px] text-[#6b6f76]">{question.points} б.</span>
                  </div>
                  <p className="mb-3 line-clamp-2 text-[12.5px] text-[#6b6f76]">{question.prompt}</p>
                  <div className="flex gap-2">
                    <button onClick={() => patchQuestion(question.id, "published")} className="rounded-full bg-[#16a34a] px-3 py-1.5 text-[11.5px] font-bold text-white">Publish</button>
                    <button onClick={() => patchQuestion(question.id, "archived")} className="rounded-full border border-[rgba(21,23,28,.14)] px-3 py-1.5 text-[11.5px] font-bold">Archive</button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {active === "tournaments" && (
          <section className="grid gap-4 lg:grid-cols-[460px_1fr]">
            <form onSubmit={submitTournament} className="rounded-[18px] border border-[rgba(21,23,28,.08)] bg-white p-5">
              <h2 className="mb-4 text-[17px] font-extrabold">Новый турнир</h2>
              <div className="grid gap-3">
                <select name="track_id" defaultValue={aiTrack?.id} required className={inputClass()}>
                  {tracks.map((track) => <option key={track.id} value={track.id}>{track.title}</option>)}
                </select>
                <input name="title" required placeholder="Название" className={inputClass()} />
                <textarea name="description" required placeholder="Описание" rows={3} className={inputClass()} />
                <div className="grid grid-cols-2 gap-2">
                  <input name="starts_at" type="datetime-local" required defaultValue={isoLocal(defaultDates.start)} className={inputClass()} />
                  <input name="ends_at" type="datetime-local" required defaultValue={isoLocal(defaultDates.end)} className={inputClass()} />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <input name="duration_minutes" type="number" defaultValue={60} className={inputClass()} />
                  <select name="status" defaultValue="draft" className={inputClass()}>
                    <option value="draft">draft</option>
                    <option value="published">published</option>
                  </select>
                </div>
                <label className="flex items-center gap-2 text-[12.5px] font-semibold">
                  <input name="randomize_questions" type="checkbox" defaultChecked /> Случайный порядок заданий
                </label>
                <textarea
                  name="question_ids"
                  placeholder="ID заданий, каждый с новой строки"
                  rows={6}
                  defaultValue={questions.filter((q) => q.status === "published").slice(0, 20).map((q) => q.id).join("\n")}
                  className={inputClass("font-mono")}
                />
                <button className="h-11 rounded-full bg-[#15171c] text-[13px] font-bold text-white">Создать турнир</button>
              </div>
            </form>

            <div className="grid gap-3">
              {tournaments.map((tournament) => (
                <div key={tournament.id} className="rounded-[18px] border border-[rgba(21,23,28,.08)] bg-white p-5">
                  <div className="mb-3 flex items-start gap-3">
                    <div className="min-w-0 flex-1">
                      <strong className="block truncate text-[15px]">{tournament.title}</strong>
                      <span className="text-[11.5px] text-[#6b6f76]">{tournament.status} · {tournament.question_count} заданий · {tournament.max_score} баллов</span>
                    </div>
                    <a href={`/api/admin/tournaments/${tournament.id}/results.csv`} className="rounded-full border border-[rgba(21,23,28,.14)] px-3 py-1.5 text-[11.5px] font-bold">
                      CSV
                    </a>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <button onClick={() => publishTournament(tournament.id)} className="rounded-full bg-[#16a34a] px-3 py-1.5 text-[11.5px] font-bold text-white">Publish + invites</button>
                    <button onClick={() => finishTournament(tournament.id)} className="rounded-full bg-[#15171c] px-3 py-1.5 text-[11.5px] font-bold text-white">Finish</button>
                    <button onClick={() => loadResults(tournament.id)} className="rounded-full border border-[rgba(21,23,28,.14)] px-3 py-1.5 text-[11.5px] font-bold">Results</button>
                  </div>
                  {results[tournament.id] && (
                    <div className="mt-4 overflow-hidden rounded-[12px] border border-[rgba(21,23,28,.08)]">
                      {results[tournament.id].map((row) => (
                        <div key={`${row.place}-${row.email}`} className="grid grid-cols-[48px_1fr_90px_80px] gap-2 border-b border-[rgba(21,23,28,.06)] px-3 py-2 text-[12px] last:border-b-0">
                          <span>#{row.place}</span>
                          <span className="truncate">{row.display_name}</span>
                          <span>{row.status}</span>
                          <strong>{row.score}/{row.max_score}</strong>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {active === "users" && (
          <section className="rounded-[18px] border border-[rgba(21,23,28,.08)] bg-white">
            {users.map((user) => (
              <div key={user.id} className="grid gap-2 border-b border-[rgba(21,23,28,.07)] px-5 py-4 text-[13px] last:border-b-0 sm:grid-cols-[1fr_220px_90px_80px]">
                <strong>{user.display_name}</strong>
                <span className="text-[#6b6f76]">{user.email || "email не передан"}</span>
                <span>{user.role}</span>
                <span className={user.is_active ? "text-[#16a34a]" : "text-[#ff4d3d]"}>{user.is_active ? "active" : "blocked"}</span>
              </div>
            ))}
          </section>
        )}
      </div>
    </main>
  );
}
