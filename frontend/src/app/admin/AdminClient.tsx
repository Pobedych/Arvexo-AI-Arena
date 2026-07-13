"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import MarkdownContent from "@/components/MarkdownContent";

type Dashboard = {
  users: number;
  ai_track_users: number;
  lessons: number;
  questions: number;
  tournaments: number;
  invitations: number;
  attempts: number;
};

type SectionRow = { id: string; track_id: string; title: string; order: number; lessons_count: number };

type Track = {
  id: string;
  title: string;
  slug: string;
  status: string;
  sections: SectionRow[];
};

type LessonStep = { id: string; title: string; body: string; order: number };

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
  steps: LessonStep[];
};

type SequenceBlock =
  | { kind: "step"; tempId: string; title: string; body: string }
  | { kind: "question"; questionId: string };

type Question = {
  id: string;
  lesson_id: string | null;
  title: string;
  prompt: string;
  type: string;
  options: string[] | null;
  configuration: Record<string, unknown> | null;
  correct_answer: Record<string, unknown>;
  tolerance: number | null;
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
  user_id: string;
  display_name: string;
  email: string | null;
  status: string;
  score: number;
  max_score: number;
};

type InvitationRow = {
  id: string;
  user_id: string;
  display_name: string;
  email: string | null;
  status: string;
};

type AttemptDetail = {
  attempt_id: string;
  user_id: string;
  status: string;
  score: number;
  max_score: number;
  answers: Array<{
    question_id: string;
    prompt: string;
    type: string;
    answer: Record<string, unknown> | null;
    correct_answer: Record<string, unknown>;
    is_correct: boolean | null;
    points_awarded: number;
    points: number;
  }>;
};

type UserDetail = {
  id: string;
  display_name: string;
  email: string | null;
  is_active: boolean;
  progress: Array<{ lesson_id: string; lesson_title: string | null; status: string; best_score: number; max_score: number }>;
  attempts: Array<{ tournament_id: string; tournament_title: string | null; status: string; score: number; max_score: number }>;
  invitations: Array<{ tournament_id: string; status: string }>;
};

const tabs = [
  { id: "overview", label: "Обзор" },
  { id: "sections", label: "Разделы" },
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
  if (response.status === 401 && typeof window !== "undefined") {
    window.location.href = "/login?reason=expired";
    throw new Error("Authentication required");
  }
  if (response.status === 403 && typeof window !== "undefined") {
    window.location.href = "/403";
    throw new Error("Admin access required");
  }
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

const statusLabels: Record<string, string> = {
  draft: "Черновик",
  published: "Опубликовано",
  archived: "В архиве",
  active: "Идёт",
  finished: "Завершён",
  cancelled: "Отменён",
};

const typeLabels: Record<string, string> = {
  single_choice: "Один ответ",
  multiple_choice: "Несколько ответов",
  short_text: "Короткий текст",
  number: "Число",
  sequence: "Последовательность",
  matching: "Сопоставление",
  group_sort: "Распределение по категориям",
  fill_blanks: "Заполнение пропусков",
  table_select: "Выбор ячеек таблицы",
  code_order: "Сборка кода из строк",
  code_output: "Результат выполнения кода",
  code_fix: "Исправление кода",
  image_hotspot: "Область изображения",
  graph_point: "Точка на графике",
  number_line: "Числовая прямая",
  slider_experiment: "Эксперимент с параметром",
  code_text: "Код — свободный ввод",
};

const advancedConfigHints: Record<string, string> = {
  fill_blanks: '{"template":"Модель учится на ___, а проверяется на ___."}',
  table_select: '{"columns":["Объект","Тип"],"rows":[["Возраст","Число"],["Город","Категория"]]}',
  code_output: '{"code":"print(2 + 2)"}',
  code_fix: '{"code":"if ready\n    start()"}',
  image_hotspot: '{"image_url":"https://example.com/image.png"}',
  graph_point: '{"x_min":-5,"x_max":5,"y_min":-5,"y_max":5}',
  number_line: '{"min":-10,"max":10,"step":1}',
  slider_experiment: '{"min":0,"max":100,"step":5,"unit":"%","observation":"При {value}% меняется результат"}',
};

function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <label className="grid gap-1.5">
      <span className="flex items-center justify-between gap-3 text-[12px] font-bold">
        {label}
        {hint && <span className="font-medium text-[#858990]">{hint}</span>}
      </span>
      {children}
    </label>
  );
}

export default function AdminClient() {
  const [active, setActive] = useState<Tab>("overview");
  const [dashboard, setDashboard] = useState<Dashboard | null>(null);
  const [tracks, setTracks] = useState<Track[]>([]);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [users, setUsers] = useState<UserRow[]>([]);
  const [results, setResults] = useState<Record<string, ResultRow[]>>({});
  const [invitations, setInvitations] = useState<Record<string, InvitationRow[]>>({});
  const [attemptDetail, setAttemptDetail] = useState<AttemptDetail | null>(null);
  const [userDetail, setUserDetail] = useState<UserDetail | null>(null);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [lessonSearch, setLessonSearch] = useState("");
  const [editingLesson, setEditingLesson] = useState<Lesson | null>(null);
  const [editingSection, setEditingSection] = useState<SectionRow | null>(null);
  const [sequence, setSequence] = useState<SequenceBlock[]>([{ kind: "step", tempId: "new-0", title: "", body: "" }]);
  const [theoryPreview, setTheoryPreview] = useState(false);
  const [questionSearch, setQuestionSearch] = useState("");
  const [questionStatus, setQuestionStatus] = useState("all");
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);
  const [questionType, setQuestionType] = useState("single_choice");
  const [optionValues, setOptionValues] = useState(["", "", "", ""]);
  const [correctOptions, setCorrectOptions] = useState<number[]>([0]);
  const [correctText, setCorrectText] = useState("");
  const [matchingRightValues, setMatchingRightValues] = useState(["", "", "", ""]);
  const [groupCategories, setGroupCategories] = useState(["", ""]);
  const [groupAssignments, setGroupAssignments] = useState([-1, -1, -1, -1]);
  const [advancedConfigText, setAdvancedConfigText] = useState("{}");
  const [numberTolerance, setNumberTolerance] = useState("0");
  const [tournamentQuestionSearch, setTournamentQuestionSearch] = useState("");
  const [selectedQuestionIds, setSelectedQuestionIds] = useState<string[]>([]);
  const [busy, setBusy] = useState(false);
  const [defaultDates] = useState(() => {
    const start = new Date();
    const end = new Date(start.getTime() + 7 * 86400000);
    return { start: start.toISOString(), end: end.toISOString() };
  });

  const sections = useMemo(() => tracks.flatMap((track) => track.sections.map((section) => ({ ...section, trackTitle: track.title }))), [tracks]);
  const aiTrack = tracks.find((track) => track.slug === "ai") ?? tracks[0];
  const filteredLessons = useMemo(() => {
    const query = lessonSearch.trim().toLowerCase();
    return lessons.filter((lesson) => !query || `${lesson.title} ${lesson.summary}`.toLowerCase().includes(query));
  }, [lessonSearch, lessons]);
  const filteredQuestions = useMemo(() => {
    const query = questionSearch.trim().toLowerCase();
    return questions.filter((question) => {
      const matchesQuery = !query || `${question.title} ${question.prompt}`.toLowerCase().includes(query);
      return matchesQuery && (questionStatus === "all" || question.status === questionStatus);
    });
  }, [questionSearch, questionStatus, questions]);
  const tournamentQuestionOptions = useMemo(() => {
    const query = tournamentQuestionSearch.trim().toLowerCase();
    return questions.filter((question) => {
      const matchesQuery = !query || `${question.title} ${question.prompt}`.toLowerCase().includes(query);
      return question.status === "published" && matchesQuery;
    });
  }, [questions, tournamentQuestionSearch]);

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

  function startEditSection(section: SectionRow) {
    setEditingSection(section);
    setNotice("");
    setError("");
  }

  function cancelEditSection() {
    setEditingSection(null);
  }

  async function submitSection(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formEl = event.currentTarget;
    const form = new FormData(formEl);
    try {
      if (editingSection) {
        await api(`/admin/sections/${editingSection.id}`, {
          method: "PATCH",
          body: JSON.stringify({
            title: form.get("title"),
            order: Number(form.get("order") || 1),
          }),
        });
        setNotice("Раздел обновлён");
        cancelEditSection();
      } else {
        await api("/admin/sections", {
          method: "POST",
          body: JSON.stringify({
            track_id: form.get("track_id"),
            title: form.get("title"),
            order: Number(form.get("order") || 1),
          }),
        });
        setNotice("Раздел создан");
        formEl.reset();
      }
      await loadAll();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Не удалось сохранить раздел");
    }
  }

  async function deleteSection(section: SectionRow) {
    const warning = section.lessons_count > 0
      ? `Удалить раздел «${section.title}»? Вместе с ним будут удалены все его уроки (${section.lessons_count}) и их задания.`
      : `Удалить раздел «${section.title}»?`;
    if (!window.confirm(warning)) return;
    try {
      await api(`/admin/sections/${section.id}`, { method: "DELETE" });
      setNotice("Раздел удалён");
      if (editingSection?.id === section.id) cancelEditSection();
      await loadAll();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Не удалось удалить раздел");
    }
  }

  async function deleteLesson(lesson: Lesson) {
    const warning = lesson.questions_count > 0
      ? `Удалить урок «${lesson.title}»? Вместе с ним будут удалены его задания (${lesson.questions_count}) и прогресс учеников по нему.`
      : `Удалить урок «${lesson.title}»? Прогресс учеников по нему тоже будет удалён.`;
    if (!window.confirm(warning)) return;
    try {
      await api(`/admin/lessons/${lesson.id}`, { method: "DELETE" });
      setNotice("Урок удалён");
      if (editingLesson?.id === lesson.id) cancelEditLesson();
      await loadAll();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Не удалось удалить урок");
    }
  }

  async function deleteQuestion(question: Question) {
    if (!window.confirm(`Удалить задание «${question.title}»? Оно будет убрано из всех турниров, где использовалось.`)) return;
    try {
      await api(`/admin/questions/${question.id}`, { method: "DELETE" });
      setNotice("Задание удалено");
      if (editingQuestion?.id === question.id) cancelEditQuestion();
      await loadAll();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Не удалось удалить задание");
    }
  }

  function startEditQuestion(question: Question) {
    setEditingQuestion(question);
    setQuestionType(question.type);
    const options = question.options ?? [];
    setOptionValues(options.length ? [...options] : ["", "", "", ""]);
    setAdvancedConfigText(JSON.stringify(question.configuration ?? {}, null, 2));
    if (question.type === "single_choice") {
      setCorrectOptions([Number((question.correct_answer as { option?: number }).option ?? 0)]);
    } else if (question.type === "multiple_choice") {
      setCorrectOptions(((question.correct_answer as { options?: number[] }).options ?? []).map(Number));
    } else {
      setCorrectOptions([0]);
    }
    if (question.type === "matching") {
      const right = (question.configuration as { right?: string[] } | null)?.right ?? [];
      setMatchingRightValues(right.length ? [...right] : ["", "", "", ""]);
    } else {
      setMatchingRightValues(["", "", "", ""]);
    }
    if (question.type === "group_sort") {
      const categories = (question.configuration as { categories?: string[] } | null)?.categories ?? [];
      const groups = (question.correct_answer as { groups?: number[] }).groups ?? [];
      setGroupCategories(categories.length ? [...categories] : ["", ""]);
      setGroupAssignments(options.map((_, index) => Number(groups[index] ?? -1)));
    } else {
      setGroupCategories(["", ""]);
      setGroupAssignments([-1, -1, -1, -1]);
    }
    if (question.type === "fill_blanks") {
      setCorrectText(JSON.stringify((question.correct_answer as { blanks?: string[] }).blanks ?? [], null, 2));
    } else if (question.type === "table_select") {
      setCorrectText(JSON.stringify((question.correct_answer as { cells?: string[] }).cells ?? [], null, 2));
    } else if (question.type === "image_hotspot" || question.type === "graph_point") {
      setCorrectText(JSON.stringify((question.correct_answer as { point?: number[] }).point ?? [], null, 2));
      setNumberTolerance(String(question.tolerance ?? 0));
    } else if (question.type === "number_line" || question.type === "slider_experiment") {
      setCorrectText(String((question.correct_answer as { number?: number }).number ?? ""));
      setNumberTolerance(String(question.tolerance ?? 0));
    } else if (question.type === "code_output") {
      setCorrectText(String((question.correct_answer as { text?: string }).text ?? ""));
    } else if (question.type === "code_fix") {
      setCorrectText(String((question.correct_answer as { code?: string }).code ?? ""));
    } else if (question.type === "short_text") {
      setCorrectText(String((question.correct_answer as { text?: string }).text ?? ""));
    } else if (question.type === "code_text") {
      setCorrectText(String((question.correct_answer as { code?: string }).code ?? ""));
    } else if (question.type === "number") {
      setCorrectText(String((question.correct_answer as { number?: number }).number ?? ""));
      setNumberTolerance(String(question.tolerance ?? 0));
    } else {
      setCorrectText("");
    }
    setNotice("");
    setError("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function cancelEditQuestion() {
    setEditingQuestion(null);
    setQuestionType("single_choice");
    setOptionValues(["", "", "", ""]);
    setCorrectOptions([0]);
    setCorrectText("");
    setMatchingRightValues(["", "", "", ""]);
    setGroupCategories(["", ""]);
    setGroupAssignments([-1, -1, -1, -1]);
    setAdvancedConfigText("{}");
    setNumberTolerance("0");
  }

  function buildSequence(lesson: Lesson): SequenceBlock[] {
    const stepBlocks = lesson.steps.map((step) => ({ block: { kind: "step" as const, tempId: step.id, title: step.title, body: step.body }, order: step.order, isStep: true }));
    const questionBlocks = questions
      .filter((question) => question.lesson_id === lesson.id)
      .map((question) => ({ block: { kind: "question" as const, questionId: question.id }, order: question.order, isStep: false }));
    return [...stepBlocks, ...questionBlocks]
      .sort((a, b) => a.order - b.order || (a.isStep ? -1 : 1))
      .map((item) => item.block);
  }

  function startEditLesson(lesson: Lesson) {
    setEditingLesson(lesson);
    setSequence(buildSequence(lesson));
    setTheoryPreview(false);
    setNotice("");
    setError("");
  }

  function cancelEditLesson() {
    setEditingLesson(null);
    setSequence([{ kind: "step", tempId: "new-0", title: "", body: "" }]);
    setTheoryPreview(false);
  }

  function addStep() {
    setSequence((current) => [...current, { kind: "step", tempId: `new-${Date.now()}`, title: "", body: "" }]);
  }

  function addQuestionToSequence(questionId: string) {
    if (!questionId) return;
    setSequence((current) => (current.some((block) => block.kind === "question" && block.questionId === questionId) ? current : [...current, { kind: "question", questionId }]));
  }

  function updateStepInSequence(tempId: string, patch: Partial<{ title: string; body: string }>) {
    setSequence((current) => current.map((block) => (block.kind === "step" && block.tempId === tempId ? { ...block, ...patch } : block)));
  }

  function removeFromSequence(index: number) {
    setSequence((current) => current.filter((_, itemIndex) => itemIndex !== index));
  }

  function moveInSequence(index: number, direction: -1 | 1) {
    setSequence((current) => {
      const target = index + direction;
      if (target < 0 || target >= current.length) return current;
      const next = [...current];
      [next[index], next[target]] = [next[target], next[index]];
      return next;
    });
  }

  async function submitLesson(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formEl = event.currentTarget;
    const form = new FormData(formEl);
    if (!sequence.length) {
      setError("Добавьте хотя бы один шаг теории");
      return;
    }
    const steps = sequence
      .map((block, index) => ({ block, order: index + 1 }))
      .filter(({ block }) => block.kind === "step")
      .map(({ block, order }) => ({ title: (block as { title: string }).title, body: (block as { body: string }).body, order }));
    if (steps.some((step) => !step.body.trim())) {
      setError("Заполните текст каждого шага");
      return;
    }
    const questionOrders = sequence
      .map((block, index) => ({ block, order: index + 1 }))
      .filter(({ block }) => block.kind === "question")
      .map(({ block, order }) => ({ id: (block as { questionId: string }).questionId, order }));
    const payload = {
      section_id: form.get("section_id"),
      title: form.get("title"),
      summary: form.get("summary"),
      order: Number(form.get("order") || 1),
      pass_percent: Number(form.get("pass_percent") || 70),
      status: form.get("status"),
      steps,
    };
    try {
      if (editingLesson) {
        await api(`/admin/lessons/${editingLesson.id}`, { method: "PATCH", body: JSON.stringify(payload) });
        setNotice("Урок обновлён");
      } else {
        await api("/admin/lessons", { method: "POST", body: JSON.stringify(payload) });
        setNotice("Урок создан");
      }
      await Promise.all(questionOrders.map(({ id, order }) => api(`/admin/questions/${id}`, { method: "PATCH", body: JSON.stringify({ order }) })));
      if (editingLesson) {
        cancelEditLesson();
      } else {
        formEl.reset();
        setSequence([{ kind: "step", tempId: "new-0", title: "", body: "" }]);
      }
      await loadAll();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Не удалось сохранить урок");
    }
  }

  async function submitQuestion(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formEl = event.currentTarget;
    const form = new FormData(formEl);
    const lastOptionIndex = optionValues.findLastIndex((item) => item.trim());
    const options = optionValues.slice(0, lastOptionIndex + 1).map((item) => item.trim());
    let correctAnswer: Record<string, unknown>;
    let configuration: Record<string, unknown> | null = null;

    if (questionType === "single_choice") {
      if (options.length < 2 || options.some((item) => !item) || correctOptions[0] === undefined || correctOptions[0] >= options.length) {
        setError("Добавьте минимум два варианта и отметьте правильный");
        return;
      }
      correctAnswer = { option: correctOptions[0] };
    } else if (questionType === "multiple_choice") {
      const validAnswers = correctOptions.filter((index) => index < options.length);
      if (options.length < 2 || options.some((item) => !item) || validAnswers.length === 0) {
        setError("Добавьте варианты и отметьте хотя бы один правильный");
        return;
      }
      correctAnswer = { options: validAnswers };
    } else if (questionType === "sequence" || questionType === "code_order") {
      if (options.length < 2 || options.some((item) => !item)) {
        setError(questionType === "code_order" ? "Добавьте минимум две строки кода" : "Добавьте минимум два элемента последовательности");
        return;
      }
      correctAnswer = { order: options.map((_, index) => index) };
    } else if (questionType === "matching") {
      const right = matchingRightValues.slice(0, options.length).map((item) => item.trim());
      if (options.length < 2 || options.some((item) => !item) || right.length !== options.length || right.some((item) => !item)) {
        setError("Заполните минимум две пары для сопоставления");
        return;
      }
      correctAnswer = { matches: options.map((_, index) => index) };
      configuration = { right };
    } else if (questionType === "group_sort") {
      const lastCategoryIndex = groupCategories.findLastIndex((item) => item.trim());
      const categories = groupCategories.slice(0, lastCategoryIndex + 1).map((item) => item.trim());
      const groups = groupAssignments.slice(0, options.length);
      if (options.length < 2 || options.some((item) => !item)) {
        setError("Добавьте минимум две карточки для распределения");
        return;
      }
      if (categories.length < 2 || categories.some((item) => !item) || new Set(categories.map((item) => item.toLowerCase())).size !== categories.length) {
        setError("Добавьте минимум две разные категории");
        return;
      }
      if (groups.length !== options.length || groups.some((group) => group < 0 || group >= categories.length)) {
        setError("Выберите правильную категорию для каждой карточки");
        return;
      }
      correctAnswer = { groups };
      configuration = { categories };
    } else if (Object.hasOwn(advancedConfigHints, questionType)) {
      try {
        const parsed = JSON.parse(advancedConfigText) as unknown;
        if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) throw new Error("not an object");
        configuration = parsed as Record<string, unknown>;
      } catch {
        setError("Конфигурация должна быть корректным JSON-объектом");
        return;
      }
      if (questionType === "fill_blanks" || questionType === "table_select" || questionType === "image_hotspot" || questionType === "graph_point") {
        try {
          const parsedAnswer = JSON.parse(correctText) as unknown;
          if (!Array.isArray(parsedAnswer)) throw new Error("not an array");
          if (questionType === "fill_blanks") correctAnswer = { blanks: parsedAnswer };
          else if (questionType === "table_select") correctAnswer = { cells: parsedAnswer };
          else correctAnswer = { point: parsedAnswer };
        } catch {
          setError("Правильный ответ для этого типа должен быть JSON-массивом");
          return;
        }
      } else if (questionType === "number_line" || questionType === "slider_experiment") {
        if (correctText.trim() === "" || Number.isNaN(Number(correctText))) {
          setError("Укажите правильное числовое значение");
          return;
        }
        correctAnswer = { number: Number(correctText) };
      } else if (questionType === "code_output") {
        if (!correctText.trim()) {
          setError("Укажите ожидаемый результат программы");
          return;
        }
        correctAnswer = { text: correctText };
      } else {
        if (!correctText.trim()) {
          setError("Добавьте исправленный вариант кода");
          return;
        }
        correctAnswer = { code: correctText };
      }
    } else if (questionType === "code_text") {
      if (!correctText.trim()) {
        setError("Добавьте эталонное решение");
        return;
      }
      correctAnswer = { code: correctText };
    } else if (questionType === "short_text") {
      if (!correctText.trim()) {
        setError("Укажите правильный текстовый ответ");
        return;
      }
      correctAnswer = { text: correctText.trim() };
    } else {
      if (correctText.trim() === "" || Number.isNaN(Number(correctText))) {
        setError("Укажите правильный числовой ответ");
        return;
      }
      correctAnswer = { number: Number(correctText) };
    }

    setBusy(true);
    setError("");
    try {
      const payload = {
        lesson_id: form.get("lesson_id") || null,
        title: form.get("title"),
        prompt: form.get("prompt"),
        type: questionType,
        options: options.length ? options : null,
        configuration,
        correct_answer: correctAnswer,
        tolerance: ["number", "image_hotspot", "graph_point", "number_line", "slider_experiment"].includes(questionType) ? Number(numberTolerance || 0) : null,
        points: Number(form.get("points") || 1),
        explanation: form.get("explanation"),
        difficulty: form.get("difficulty"),
        order: Number(form.get("order") || 1),
        status: form.get("status"),
      };
      if (editingQuestion) {
        await api(`/admin/questions/${editingQuestion.id}`, { method: "PATCH", body: JSON.stringify(payload) });
        setNotice("Задание обновлено");
        cancelEditQuestion();
      } else {
        await api("/admin/questions", { method: "POST", body: JSON.stringify(payload) });
        formEl.reset();
        setQuestionType("single_choice");
        setOptionValues(["", "", "", ""]);
        setCorrectOptions([0]);
        setCorrectText("");
        setMatchingRightValues(["", "", "", ""]);
        setGroupCategories(["", ""]);
        setGroupAssignments([-1, -1, -1, -1]);
        setAdvancedConfigText("{}");
        setNumberTolerance("0");
        setNotice("Задание создано");
      }
      await loadAll();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Не удалось сохранить задание");
    } finally {
      setBusy(false);
    }
  }

  async function submitTournament(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formEl = event.currentTarget;
    const form = new FormData(formEl);
    if (selectedQuestionIds.length === 0) {
      setError("Выберите хотя бы одно задание для турнира");
      return;
    }
    try {
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
          question_ids: selectedQuestionIds,
        }),
      });
      formEl.reset();
      setSelectedQuestionIds([]);
      setTournamentQuestionSearch("");
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
    if (!window.confirm("Завершить турнир? После завершения участники больше не смогут отправлять ответы.")) return;
    await api(`/admin/tournaments/${id}/finish`, { method: "POST" });
    setNotice("Турнир завершён");
    await loadAll();
  }

  async function loadResults(id: string) {
    const rows = await api<ResultRow[]>(`/admin/tournaments/${id}/results`);
    setResults((current) => ({ ...current, [id]: rows }));
  }

  async function cancelTournament(id: string) {
    if (!window.confirm("Отменить турнир? Активные приглашения станут неактуальными.")) return;
    try {
      await api(`/admin/tournaments/${id}/cancel`, { method: "POST" });
      setNotice("Турнир отменён");
      await loadAll();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Не удалось отменить турнир");
    }
  }

  async function loadInvitations(id: string) {
    try {
      const rows = await api<InvitationRow[]>(`/admin/tournaments/${id}/invitations`);
      setInvitations((current) => ({ ...current, [id]: rows }));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Не удалось загрузить приглашения");
    }
  }

  async function inviteUser(tournamentId: string, userId: string) {
    if (!userId) return;
    try {
      await api(`/admin/tournaments/${tournamentId}/invite`, { method: "POST", body: JSON.stringify({ user_id: userId }) });
      setNotice("Приглашение отправлено");
      await loadInvitations(tournamentId);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Не удалось отправить приглашение");
    }
  }

  async function loadAttemptDetail(tournamentId: string, userId: string) {
    try {
      const detail = await api<AttemptDetail>(`/admin/tournaments/${tournamentId}/attempts/${userId}`);
      setAttemptDetail(detail);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Не удалось загрузить попытку");
    }
  }

  async function toggleUserBlock(user: UserRow) {
    const action = user.is_active ? "block" : "unblock";
    if (user.is_active && !window.confirm(`Заблокировать пользователя «${user.display_name}»?`)) return;
    try {
      await api(`/admin/users/${user.id}/${action}`, { method: "POST" });
      setNotice(user.is_active ? "Пользователь заблокирован" : "Пользователь разблокирован");
      await loadAll();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Не удалось изменить статус пользователя");
    }
  }

  async function loadUserDetail(userId: string) {
    if (userDetail?.id === userId) {
      setUserDetail(null);
      return;
    }
    try {
      setUserDetail(await api<UserDetail>(`/admin/users/${userId}`));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Не удалось загрузить карточку пользователя");
    }
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

        {active === "sections" && (
          <section className="grid gap-4 lg:grid-cols-[380px_1fr]">
            <form key={editingSection?.id ?? "new-section"} onSubmit={submitSection} className="rounded-[18px] border border-[rgba(21,23,28,.08)] bg-white p-5">
              <div className="mb-4 flex items-center justify-between gap-3">
                <h2 className="text-[17px] font-extrabold">{editingSection ? `Редактировать: ${editingSection.title}` : "Новый раздел"}</h2>
                {editingSection && (
                  <button type="button" onClick={cancelEditSection} className="text-[12px] font-bold text-[#6b6f76]">
                    Отменить
                  </button>
                )}
              </div>
              <div className="grid gap-3">
                {editingSection ? (
                  <input disabled value={tracks.find((track) => track.id === editingSection.track_id)?.title ?? ""} className={inputClass("opacity-60")} />
                ) : (
                  <select name="track_id" required defaultValue={aiTrack?.id} className={inputClass()}>
                    {tracks.map((track) => (
                      <option key={track.id} value={track.id}>{track.title}</option>
                    ))}
                  </select>
                )}
                <input name="title" required placeholder="Название раздела" defaultValue={editingSection?.title ?? ""} className={inputClass()} />
                <input name="order" type="number" placeholder="Порядок" defaultValue={editingSection?.order ?? sections.length + 1} className={inputClass()} />
                <button className="h-11 rounded-full bg-[#15171c] text-[13px] font-bold text-white">
                  {editingSection ? "Обновить раздел" : "Создать раздел"}
                </button>
              </div>
            </form>

            <div className="overflow-hidden rounded-[8px] border border-[rgba(21,23,28,.08)] bg-white">
              {tracks.map((track) => (
                <div key={track.id}>
                  <div className="bg-[#fafafa] px-5 py-2.5 text-[11px] font-bold uppercase tracking-[.08em] text-[#6b6f76]">{track.title}</div>
                  {track.sections.map((section) => (
                    <div key={section.id} className="flex flex-wrap items-center gap-2 border-b border-[rgba(21,23,28,.07)] px-5 py-4 last:border-b-0">
                      <div className="min-w-0 flex-1">
                        <strong className="block truncate text-[13.5px]">{section.order}. {section.title}</strong>
                        <span className="text-[11.5px] text-[#6b6f76]">уроков: {section.lessons_count}</span>
                      </div>
                      <button onClick={() => startEditSection(section)} className="rounded-[6px] border border-[rgba(21,23,28,.14)] px-3 py-1.5 text-[11.5px] font-bold">Редактировать</button>
                      <button
                        onClick={() => deleteSection(section)}
                        className="rounded-[6px] border border-[rgba(255,77,61,.3)] px-3 py-1.5 text-[11.5px] font-bold text-[#b42318]"
                      >
                        Удалить
                      </button>
                    </div>
                  ))}
                  {track.sections.length === 0 && <p className="px-5 py-4 text-[12.5px] text-[#6b6f76]">Разделов пока нет</p>}
                </div>
              ))}
              {tracks.length === 0 && <p className="p-8 text-center text-[13px] text-[#6b6f76]">Треки не найдены</p>}
            </div>
          </section>
        )}

        {active === "lessons" && (
          <section className="grid gap-4 lg:grid-cols-[420px_1fr]">
            <form key={editingLesson?.id ?? "new"} onSubmit={submitLesson} className="rounded-[18px] border border-[rgba(21,23,28,.08)] bg-white p-5">
              <div className="mb-4 flex items-center justify-between gap-3">
                <h2 className="text-[17px] font-extrabold">{editingLesson ? `Редактировать: ${editingLesson.title}` : "Новый урок"}</h2>
                {editingLesson && (
                  <button type="button" onClick={cancelEditLesson} className="text-[12px] font-bold text-[#6b6f76]">
                    Отменить
                  </button>
                )}
              </div>
              <div className="grid gap-3">
                <select name="section_id" required defaultValue={editingLesson?.section_id ?? ""} className={inputClass()}>
                  <option value="">Раздел</option>
                  {sections.map((section) => (
                    <option key={section.id} value={section.id}>
                      {section.trackTitle} / {section.title}
                    </option>
                  ))}
                </select>
                <input name="title" required placeholder="Название" defaultValue={editingLesson?.title ?? ""} className={inputClass()} />
                <input name="summary" placeholder="Краткое описание" defaultValue={editingLesson?.summary ?? ""} className={inputClass()} />

                <div className="rounded-[10px] border border-[rgba(21,23,28,.12)] p-3">
                  <div className="mb-2 flex items-center justify-between gap-3">
                    <span className="text-[12px] font-bold">
                      Шаги урока <span className="font-medium text-[#858990]">· каждый шаг открывается по кнопке «Далее», между шагами можно вставить мини-проверку</span>
                    </span>
                    <button type="button" onClick={() => setTheoryPreview((current) => !current)} className="shrink-0 text-[11.5px] font-bold text-[#16a34a]">
                      {theoryPreview ? "Редактировать" : "Предпросмотр"}
                    </button>
                  </div>

                  <div className="grid gap-2.5">
                    {sequence.map((block, index) => (
                      <div key={block.kind === "step" ? block.tempId : block.questionId} className="rounded-[8px] border border-[rgba(21,23,28,.1)] bg-[#fbfaf6] p-3">
                        <div className="mb-2 flex items-center gap-2">
                          <span className="rounded-[5px] bg-[#f1f2f3] px-2 py-0.5 text-[10.5px] font-bold uppercase tracking-[.04em] text-[#6b6f76]">
                            {block.kind === "step" ? `Шаг ${sequence.slice(0, index + 1).filter((b) => b.kind === "step").length}` : "Мини-проверка"}
                          </span>
                          <span className="ml-auto flex gap-1">
                            <button type="button" title="Вверх" disabled={index === 0} onClick={() => moveInSequence(index, -1)} className="h-6 w-6 text-[12px] text-[#6b6f76] disabled:opacity-25">▲</button>
                            <button type="button" title="Вниз" disabled={index === sequence.length - 1} onClick={() => moveInSequence(index, 1)} className="h-6 w-6 text-[12px] text-[#6b6f76] disabled:opacity-25">▼</button>
                            <button type="button" title="Удалить" onClick={() => removeFromSequence(index)} className="h-6 w-6 text-[14px] text-[#858990]">×</button>
                          </span>
                        </div>
                        {block.kind === "step" ? (
                          <div className="grid gap-1.5">
                            <input
                              value={block.title}
                              onChange={(event) => updateStepInSequence(block.tempId, { title: event.target.value })}
                              placeholder="Заголовок шага (необязательно)"
                              className={inputClass()}
                            />
                            {theoryPreview ? (
                              <div className="rounded-[10px] border border-[rgba(21,23,28,.14)] bg-white px-3.5 py-3">
                                <MarkdownContent content={block.body || "_Пусто_"} />
                              </div>
                            ) : (
                              <textarea
                                value={block.body}
                                onChange={(event) => updateStepInSequence(block.tempId, { body: event.target.value })}
                                placeholder="Текст шага (markdown)"
                                rows={5}
                                className={inputClass("resize-y font-mono text-[12.5px]")}
                              />
                            )}
                          </div>
                        ) : (
                          <p className="text-[12.5px] font-medium">
                            {questions.find((question) => question.id === block.questionId)?.title ?? "Задание удалено"}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>

                  <div className="mt-2.5 flex flex-wrap items-center gap-2">
                    <button type="button" onClick={addStep} className="text-[12px] font-bold text-[#15803d]">+ Добавить шаг</button>
                    {editingLesson && (
                      <select
                        value=""
                        onChange={(event) => {
                          addQuestionToSequence(event.target.value);
                          event.target.value = "";
                        }}
                        className={inputClass("h-9 max-w-[220px] text-[12px]")}
                      >
                        <option value="">+ Вставить мини-проверку…</option>
                        {questions
                          .filter((question) => question.lesson_id === editingLesson.id && !sequence.some((block) => block.kind === "question" && block.questionId === question.id))
                          .map((question) => (
                            <option key={question.id} value={question.id}>{question.title}</option>
                          ))}
                      </select>
                    )}
                  </div>
                  {!editingLesson && (
                    <p className="mt-2 text-[11.5px] text-[#858990]">Задания можно вставить между шагами после того, как урок будет создан и для него добавлены задания в «Банке заданий».</p>
                  )}
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <input name="order" type="number" defaultValue={editingLesson?.order ?? lessons.length + 1} className={inputClass()} />
                  <input name="pass_percent" type="number" defaultValue={editingLesson?.pass_percent ?? 70} className={inputClass()} />
                  <select name="status" defaultValue={editingLesson?.status ?? "draft"} className={inputClass()}>
                    <option value="draft">draft</option>
                    <option value="published">published</option>
                    <option value="archived">archived</option>
                  </select>
                </div>
                <button className="h-11 rounded-full bg-[#15171c] text-[13px] font-bold text-white">
                  {editingLesson ? "Обновить урок" : "Создать урок"}
                </button>
              </div>
            </form>

            <div className="overflow-hidden rounded-[8px] border border-[rgba(21,23,28,.08)] bg-white">
              <div className="border-b border-[rgba(21,23,28,.08)] p-4">
                <input value={lessonSearch} onChange={(event) => setLessonSearch(event.target.value)} placeholder="Поиск по урокам" className={inputClass()} />
              </div>
              {filteredLessons.map((lesson) => (
                <div key={lesson.id} className="flex flex-wrap items-center gap-2 border-b border-[rgba(21,23,28,.07)] px-5 py-4 last:border-b-0">
                  <div className="min-w-0 flex-1">
                    <strong className="block truncate text-[13.5px]">{lesson.order}. {lesson.title}</strong>
                    <span className="text-[11.5px] text-[#6b6f76]">{statusLabels[lesson.status] || lesson.status} · заданий: {lesson.questions_count}</span>
                  </div>
                  <button onClick={() => startEditLesson(lesson)} className="rounded-[6px] border border-[rgba(21,23,28,.14)] px-3 py-1.5 text-[11.5px] font-bold">Редактировать</button>
                  {lesson.status !== "published" && <button onClick={() => patchLesson(lesson.id, "published")} className="rounded-[6px] bg-[#16a34a] px-3 py-1.5 text-[11.5px] font-bold text-white">Опубликовать</button>}
                  {lesson.status !== "archived" && <button onClick={() => patchLesson(lesson.id, "archived")} className="rounded-[6px] border border-[rgba(21,23,28,.14)] px-3 py-1.5 text-[11.5px] font-bold">В архив</button>}
                  <button onClick={() => deleteLesson(lesson)} className="rounded-[6px] border border-[rgba(255,77,61,.3)] px-3 py-1.5 text-[11.5px] font-bold text-[#b42318]">Удалить</button>
                </div>
              ))}
              {filteredLessons.length === 0 && <p className="p-8 text-center text-[13px] text-[#6b6f76]">Уроки не найдены</p>}
            </div>
          </section>
        )}

        {active === "questions" && (
          <section className="grid items-start gap-4 lg:grid-cols-[500px_1fr]">
            <form key={editingQuestion?.id ?? "new-question"} onSubmit={submitQuestion} className="rounded-[8px] border border-[rgba(21,23,28,.1)] bg-white p-5 lg:sticky lg:top-5">
              <div className="mb-5 flex items-end justify-between gap-3">
                <div>
                  <h2 className="text-[18px] font-extrabold">{editingQuestion ? `Редактировать: ${editingQuestion.title}` : "Новое задание"}</h2>
                  <p className="mt-1 text-[12px] text-[#6b6f76]">Правильный ответ задаётся без JSON</p>
                </div>
                {editingQuestion ? (
                  <button type="button" onClick={cancelEditQuestion} className="text-[12px] font-bold text-[#6b6f76]">Отменить</button>
                ) : (
                  <span className="text-[12px] font-bold text-[#6b6f76]">{questions.length} в банке</span>
                )}
              </div>
              <div className="grid gap-4">
                <Field label="Урок">
                  <select name="lesson_id" defaultValue={editingQuestion?.lesson_id ?? ""} className={inputClass()}>
                    <option value="">Без привязки к уроку</option>
                    {lessons.map((lesson) => <option key={lesson.id} value={lesson.id}>{lesson.title}</option>)}
                  </select>
                </Field>
                <Field label="Служебное название" hint="видно только администратору">
                  <input name="title" required placeholder="Например: Основы промптинга, вопрос 1" defaultValue={editingQuestion?.title ?? ""} className={inputClass()} />
                </Field>
                <Field label="Условие задания">
                  <textarea name="prompt" required placeholder="Введите вопрос или условие" rows={4} defaultValue={editingQuestion?.prompt ?? ""} className={inputClass("resize-y")} />
                </Field>
                <Field label="Тип ответа">
                  <select
                    value={questionType}
                    onChange={(event) => {
                      setQuestionType(event.target.value);
                      setCorrectOptions([0]);
                      setCorrectText("");
                      setMatchingRightValues(["", "", "", ""]);
                      setGroupCategories(["", ""]);
                      setGroupAssignments([-1, -1, -1, -1]);
                      setAdvancedConfigText(advancedConfigHints[event.target.value] ?? "{}");
                    }}
                    className={inputClass()}
                  >
                    {Object.entries(typeLabels).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
                  </select>
                </Field>

                {(questionType === "single_choice" || questionType === "multiple_choice" || questionType === "sequence" || questionType === "code_order") && (
                  <fieldset className="grid gap-2">
                    <legend className="mb-1 text-[12px] font-bold">
                      {questionType === "sequence" ? "Элементы в правильном порядке" : questionType === "code_order" ? "Строки кода в правильном порядке" : "Варианты ответа"}
                      <span className="font-medium text-[#858990]">
                        {questionType === "sequence" || questionType === "code_order" ? " · ученику они будут показаны перемешанными" : " · отметьте правильные"}
                      </span>
                    </legend>
                    {optionValues.map((option, index) => {
                      const checked = correctOptions.includes(index);
                      return (
                        <div key={index} className="grid grid-cols-[32px_1fr_32px] items-center gap-2">
                          {questionType === "sequence" || questionType === "code_order" ? (
                            <span className="grid h-6 w-6 place-items-center justify-self-center rounded-full bg-[#eef7ec] text-[11px] font-extrabold text-[#15803d]">{index + 1}</span>
                          ) : (
                            <input
                              type={questionType === "single_choice" ? "radio" : "checkbox"}
                              name="correct_option"
                              checked={checked}
                              onChange={() => setCorrectOptions((current) => questionType === "single_choice" ? [index] : checked ? current.filter((item) => item !== index) : [...current, index])}
                              className="h-4 w-4 justify-self-center accent-[#16a34a]"
                            />
                          )}
                          <input
                            value={option}
                            onChange={(event) => setOptionValues((current) => current.map((item, itemIndex) => itemIndex === index ? event.target.value : item))}
                            placeholder={questionType === "code_order" ? `Строка ${index + 1}` : `Вариант ${index + 1}`}
                            className={inputClass(questionType === "code_order" ? "font-mono" : "")}
                          />
                          <button
                            type="button"
                            title="Удалить вариант"
                            disabled={optionValues.length <= 2}
                            onClick={() => {
                              setOptionValues((current) => current.filter((_, itemIndex) => itemIndex !== index));
                              setCorrectOptions((current) => current.filter((item) => item !== index).map((item) => item > index ? item - 1 : item));
                            }}
                            className="h-8 w-8 text-[18px] text-[#858990] disabled:opacity-25"
                          >×</button>
                        </div>
                      );
                    })}
                    <button type="button" onClick={() => setOptionValues((current) => [...current, ""])} className="mt-1 w-fit text-[12px] font-bold text-[#15803d]">+ Добавить вариант</button>
                  </fieldset>
                )}

                {questionType === "matching" && (
                  <fieldset className="grid gap-2">
                    <legend className="mb-1 text-[12px] font-bold">
                      Пары для сопоставления <span className="font-medium text-[#858990]">· слева термин, справа правильное соответствие</span>
                    </legend>
                    {optionValues.map((left, index) => (
                      <div key={index} className="grid grid-cols-[1fr_28px_1fr_32px] items-center gap-2">
                        <input
                          value={left}
                          onChange={(event) => setOptionValues((current) => current.map((item, itemIndex) => itemIndex === index ? event.target.value : item))}
                          placeholder={`Термин ${index + 1}`}
                          className={inputClass()}
                        />
                        <span aria-hidden="true" className="text-center text-[#858990]">↔</span>
                        <input
                          value={matchingRightValues[index] ?? ""}
                          onChange={(event) => setMatchingRightValues((current) => current.map((item, itemIndex) => itemIndex === index ? event.target.value : item))}
                          placeholder={`Определение ${index + 1}`}
                          className={inputClass()}
                        />
                        <button
                          type="button"
                          title="Удалить пару"
                          disabled={optionValues.length <= 2}
                          onClick={() => {
                            setOptionValues((current) => current.filter((_, itemIndex) => itemIndex !== index));
                            setMatchingRightValues((current) => current.filter((_, itemIndex) => itemIndex !== index));
                          }}
                          className="h-8 w-8 text-[18px] text-[#858990] disabled:opacity-25"
                        >×</button>
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={() => {
                        setOptionValues((current) => [...current, ""]);
                        setMatchingRightValues((current) => [...current, ""]);
                      }}
                      className="mt-1 w-fit text-[12px] font-bold text-[#15803d]"
                    >+ Добавить пару</button>
                  </fieldset>
                )}

                {questionType === "group_sort" && (
                  <fieldset className="grid gap-4 rounded-[16px] border border-[rgba(21,23,28,.08)] bg-[#f8f7f2] p-4">
                    <legend className="px-1 text-[12px] font-bold">
                      Карточки и категории <span className="font-medium text-[#858990]">· задайте правильную группу для каждой карточки</span>
                    </legend>
                    <div className="grid gap-2">
                      <span className="text-[11px] font-extrabold uppercase tracking-[.08em] text-[#6b6f76]">Категории</span>
                      {groupCategories.map((category, index) => (
                        <div key={index} className="grid grid-cols-[1fr_32px] items-center gap-2">
                          <input
                            value={category}
                            onChange={(event) => setGroupCategories((current) => current.map((item, itemIndex) => itemIndex === index ? event.target.value : item))}
                            placeholder={`Категория ${index + 1}`}
                            className={inputClass()}
                          />
                          <button
                            type="button"
                            title="Удалить категорию"
                            disabled={groupCategories.length <= 2}
                            onClick={() => {
                              setGroupCategories((current) => current.filter((_, itemIndex) => itemIndex !== index));
                              setGroupAssignments((current) => current.map((group) => group === index ? -1 : group > index ? group - 1 : group));
                            }}
                            className="h-8 w-8 text-[18px] text-[#858990] disabled:opacity-25"
                          >×</button>
                        </div>
                      ))}
                      <button type="button" onClick={() => setGroupCategories((current) => [...current, ""])} className="mt-1 w-fit text-[12px] font-bold text-[#15803d]">+ Добавить категорию</button>
                    </div>

                    <div className="grid gap-2">
                      <span className="text-[11px] font-extrabold uppercase tracking-[.08em] text-[#6b6f76]">Карточки</span>
                      {optionValues.map((card, index) => (
                        <div key={index} className="grid gap-2 sm:grid-cols-[minmax(0,1fr)_minmax(150px,.65fr)_32px] sm:items-center">
                          <input
                            value={card}
                            onChange={(event) => setOptionValues((current) => current.map((item, itemIndex) => itemIndex === index ? event.target.value : item))}
                            placeholder={`Карточка ${index + 1}`}
                            className={inputClass()}
                          />
                          <select
                            value={groupAssignments[index] ?? -1}
                            onChange={(event) => setGroupAssignments((current) => current.map((item, itemIndex) => itemIndex === index ? Number(event.target.value) : item))}
                            className={inputClass()}
                            aria-label={`Правильная категория карточки ${index + 1}`}
                          >
                            <option value={-1}>Выберите категорию</option>
                            {groupCategories.map((category, categoryIndex) => (
                              <option key={categoryIndex} value={categoryIndex}>{category.trim() || `Категория ${categoryIndex + 1}`}</option>
                            ))}
                          </select>
                          <button
                            type="button"
                            title="Удалить карточку"
                            disabled={optionValues.length <= 2}
                            onClick={() => {
                              setOptionValues((current) => current.filter((_, itemIndex) => itemIndex !== index));
                              setGroupAssignments((current) => current.filter((_, itemIndex) => itemIndex !== index));
                            }}
                            className="h-8 w-8 text-[18px] text-[#858990] disabled:opacity-25"
                          >×</button>
                        </div>
                      ))}
                      <button
                        type="button"
                        onClick={() => {
                          setOptionValues((current) => [...current, ""]);
                          setGroupAssignments((current) => [...current, -1]);
                        }}
                        className="mt-1 w-fit text-[12px] font-bold text-[#15803d]"
                      >+ Добавить карточку</button>
                    </div>
                  </fieldset>
                )}

                {Object.hasOwn(advancedConfigHints, questionType) && (
                  <fieldset className="grid gap-3 rounded-[16px] border border-[rgba(21,23,28,.08)] bg-[#f8f7f2] p-4">
                    <legend className="px-1 text-[12px] font-bold">Настройка интерактивного шаблона</legend>
                    <Field label="Конфигурация" hint="JSON — пример уже подставлен в подсказке">
                      <textarea
                        value={advancedConfigText}
                        onChange={(event) => setAdvancedConfigText(event.target.value)}
                        rows={questionType === "table_select" ? 8 : 5}
                        spellCheck={false}
                        placeholder={advancedConfigHints[questionType]}
                        className={inputClass("resize-y font-mono text-[12px]")}
                      />
                    </Field>

                    {(questionType === "fill_blanks" || questionType === "table_select" || questionType === "image_hotspot" || questionType === "graph_point" || questionType === "code_fix") && (
                      <Field
                        label={questionType === "code_fix" ? "Исправленный код" : "Правильный ответ"}
                        hint={questionType === "fill_blanks" ? 'JSON-массив: ["ответ 1","ответ 2"]' : questionType === "table_select" ? 'ячейки: ["0:1","1:0"]' : questionType === "code_fix" ? "код не запускается" : "координаты: [x,y]"}
                      >
                        <textarea
                          value={correctText}
                          onChange={(event) => setCorrectText(event.target.value)}
                          rows={questionType === "code_fix" ? 9 : 4}
                          spellCheck={questionType !== "code_fix"}
                          className={inputClass(`resize-y ${questionType === "code_fix" ? "font-mono" : ""}`)}
                        />
                      </Field>
                    )}

                    {(questionType === "code_output" || questionType === "number_line" || questionType === "slider_experiment") && (
                      <Field label={questionType === "code_output" ? "Ожидаемый вывод" : "Правильное значение"}>
                        <input
                          type={questionType === "code_output" ? "text" : "number"}
                          step={questionType === "code_output" ? undefined : "any"}
                          value={correctText}
                          onChange={(event) => setCorrectText(event.target.value)}
                          className={inputClass(questionType === "code_output" ? "font-mono" : "")}
                        />
                      </Field>
                    )}

                    {(questionType === "image_hotspot" || questionType === "graph_point" || questionType === "number_line" || questionType === "slider_experiment") && (
                      <Field label={questionType === "image_hotspot" ? "Радиус правильной области" : "Допустимая погрешность"} hint={questionType === "image_hotspot" ? "доля размера изображения, например 0.08" : undefined}>
                        <input type="number" min="0" step="any" value={numberTolerance} onChange={(event) => setNumberTolerance(event.target.value)} className={inputClass()} />
                      </Field>
                    )}
                  </fieldset>
                )}

                {questionType === "short_text" && (
                  <Field label="Правильный ответ" hint="регистр не учитывается">
                    <input value={correctText} onChange={(event) => setCorrectText(event.target.value)} placeholder="Введите эталонный ответ" className={inputClass()} />
                  </Field>
                )}

                {questionType === "code_text" && (
                  <Field label="Эталонное решение" hint="код не запускается; сравнивается текст решения">
                    <textarea
                      value={correctText}
                      onChange={(event) => setCorrectText(event.target.value)}
                      rows={10}
                      spellCheck={false}
                      placeholder="def solve():\n    ..."
                      className={inputClass("resize-y font-mono")}
                    />
                  </Field>
                )}

                {questionType === "number" && (
                  <div className="grid grid-cols-2 gap-3">
                    <Field label="Правильное число">
                      <input type="number" step="any" value={correctText} onChange={(event) => setCorrectText(event.target.value)} className={inputClass()} />
                    </Field>
                    <Field label="Допустимая погрешность">
                      <input type="number" min="0" step="any" value={numberTolerance} onChange={(event) => setNumberTolerance(event.target.value)} className={inputClass()} />
                    </Field>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                  <Field label="Баллы"><input name="points" min="1" type="number" defaultValue={editingQuestion?.points ?? 5} className={inputClass()} /></Field>
                  <Field label="Порядок"><input name="order" min="1" type="number" defaultValue={editingQuestion?.order ?? 1} className={inputClass()} /></Field>
                  <Field label="Сложность">
                    <select name="difficulty" defaultValue={editingQuestion?.difficulty ?? "easy"} className={inputClass()}>
                      <option value="easy">Легко</option><option value="medium">Средне</option><option value="hard">Сложно</option>
                    </select>
                  </Field>
                  <Field label="Статус">
                    <select name="status" defaultValue={editingQuestion?.status ?? "draft"} className={inputClass()}>
                      <option value="draft">Черновик</option><option value="published">Опубликовано</option>
                    </select>
                  </Field>
                </div>
                <Field label="Объяснение ответа">
                  <textarea name="explanation" required placeholder="Что показать пользователю после проверки" rows={3} defaultValue={editingQuestion?.explanation ?? ""} className={inputClass("resize-y")} />
                </Field>
                <button disabled={busy} className="h-11 rounded-[8px] bg-[#15171c] text-[13px] font-bold text-white disabled:opacity-50">
                  {busy ? "Сохраняем..." : editingQuestion ? "Обновить задание" : "Создать задание"}
                </button>
              </div>
            </form>

            <div className="overflow-hidden rounded-[8px] border border-[rgba(21,23,28,.1)] bg-white">
              <div className="grid gap-2 border-b border-[rgba(21,23,28,.08)] p-4 sm:grid-cols-[1fr_150px]">
                <input value={questionSearch} onChange={(event) => setQuestionSearch(event.target.value)} placeholder="Поиск по заданиям" className={inputClass()} />
                <select value={questionStatus} onChange={(event) => setQuestionStatus(event.target.value)} className={inputClass()}>
                  <option value="all">Все статусы</option><option value="draft">Черновики</option><option value="published">Опубликованные</option><option value="archived">Архив</option>
                </select>
              </div>
              {filteredQuestions.map((question) => (
                <div key={question.id} className="border-b border-[rgba(21,23,28,.07)] px-5 py-4 last:border-b-0">
                  <div className="mb-2 flex flex-wrap items-center gap-2">
                    <strong className="min-w-[180px] flex-1 text-[13.5px]">{question.title}</strong>
                    <span className="rounded-[5px] bg-[#f1f2f3] px-2 py-1 text-[10.5px] font-bold text-[#6b6f76]">{typeLabels[question.type] || question.type}</span>
                    <span className="text-[11px] text-[#6b6f76]">{question.points} б.</span>
                  </div>
                  <p className="mb-3 line-clamp-2 text-[12.5px] leading-relaxed text-[#6b6f76]">{question.prompt}</p>
                  <div className="flex items-center gap-2">
                    <span className={`mr-auto text-[11px] font-bold ${question.status === "published" ? "text-[#15803d]" : "text-[#858990]"}`}>{statusLabels[question.status] || question.status}</span>
                    <button onClick={() => startEditQuestion(question)} className="rounded-[6px] border border-[rgba(21,23,28,.14)] px-3 py-1.5 text-[11.5px] font-bold">Редактировать</button>
                    {question.status !== "published" && <button onClick={() => patchQuestion(question.id, "published")} className="rounded-[6px] bg-[#16a34a] px-3 py-1.5 text-[11.5px] font-bold text-white">Опубликовать</button>}
                    {question.status !== "archived" && <button onClick={() => patchQuestion(question.id, "archived")} className="rounded-[6px] border border-[rgba(21,23,28,.14)] px-3 py-1.5 text-[11.5px] font-bold">В архив</button>}
                    <button onClick={() => deleteQuestion(question)} className="rounded-[6px] border border-[rgba(255,77,61,.3)] px-3 py-1.5 text-[11.5px] font-bold text-[#b42318]">Удалить</button>
                  </div>
                </div>
              ))}
              {filteredQuestions.length === 0 && <p className="p-8 text-center text-[13px] text-[#6b6f76]">Задания не найдены</p>}
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
                <fieldset className="overflow-hidden rounded-[8px] border border-[rgba(21,23,28,.14)]">
                  <div className="flex items-center justify-between gap-3 border-b border-[rgba(21,23,28,.08)] bg-[#fafafa] px-3 py-2.5">
                    <span className="text-[12px] font-bold">Задания турнира</span>
                    <span className="text-[11px] font-bold text-[#15803d]">Выбрано: {selectedQuestionIds.length}</span>
                  </div>
                  <div className="border-b border-[rgba(21,23,28,.08)] p-2">
                    <input value={tournamentQuestionSearch} onChange={(event) => setTournamentQuestionSearch(event.target.value)} placeholder="Найти опубликованное задание" className={inputClass()} />
                  </div>
                  <div className="max-h-[240px] overflow-y-auto">
                    {tournamentQuestionOptions.map((question) => (
                      <label key={question.id} className="flex cursor-pointer items-start gap-3 border-b border-[rgba(21,23,28,.06)] px-3 py-2.5 last:border-b-0 hover:bg-[#fafafa]">
                        <input
                          type="checkbox"
                          checked={selectedQuestionIds.includes(question.id)}
                          onChange={() => setSelectedQuestionIds((current) => current.includes(question.id) ? current.filter((id) => id !== question.id) : [...current, question.id])}
                          className="mt-0.5 h-4 w-4 shrink-0 accent-[#16a34a]"
                        />
                        <span className="min-w-0">
                          <strong className="block truncate text-[12px]">{question.title}</strong>
                          <span className="text-[10.5px] text-[#6b6f76]">{typeLabels[question.type]} · {question.points} б.</span>
                        </span>
                      </label>
                    ))}
                    {tournamentQuestionOptions.length === 0 && <p className="p-5 text-center text-[12px] text-[#6b6f76]">Нет подходящих опубликованных заданий</p>}
                  </div>
                  {tournamentQuestionOptions.length > 0 && (
                    <div className="flex gap-3 border-t border-[rgba(21,23,28,.08)] px-3 py-2 text-[11px] font-bold">
                      <button type="button" onClick={() => setSelectedQuestionIds((current) => Array.from(new Set([...current, ...tournamentQuestionOptions.map((question) => question.id)])))} className="text-[#15803d]">Выбрать найденные</button>
                      <button type="button" onClick={() => setSelectedQuestionIds([])} className="text-[#6b6f76]">Очистить</button>
                    </div>
                  )}
                </fieldset>
                <button className="h-11 rounded-[8px] bg-[#15171c] text-[13px] font-bold text-white">Создать турнир</button>
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
                    {["draft", "cancelled"].includes(tournament.status) && (
                      <button onClick={() => publishTournament(tournament.id)} className="rounded-full bg-[#16a34a] px-3 py-1.5 text-[11.5px] font-bold text-white">Опубликовать + инвайты</button>
                    )}
                    {["published", "active"].includes(tournament.status) && (
                      <>
                        <button onClick={() => finishTournament(tournament.id)} className="rounded-full bg-[#15171c] px-3 py-1.5 text-[11.5px] font-bold text-white">Завершить</button>
                        <button onClick={() => cancelTournament(tournament.id)} className="rounded-full border border-[rgba(255,77,61,.3)] px-3 py-1.5 text-[11.5px] font-bold text-[#b42318]">Отменить</button>
                      </>
                    )}
                    <button onClick={() => loadInvitations(tournament.id)} className="rounded-full border border-[rgba(21,23,28,.14)] px-3 py-1.5 text-[11.5px] font-bold">Приглашения</button>
                    <button onClick={() => loadResults(tournament.id)} className="rounded-full border border-[rgba(21,23,28,.14)] px-3 py-1.5 text-[11.5px] font-bold">Результаты</button>
                  </div>
                  {invitations[tournament.id] && (
                    <div className="mt-4 rounded-[12px] border border-[rgba(21,23,28,.08)]">
                      <div className="flex items-center justify-between gap-3 border-b border-[rgba(21,23,28,.08)] bg-[#fafafa] px-3 py-2">
                        <span className="text-[11px] font-bold uppercase tracking-[.06em] text-[#6b6f76]">
                          Приглашения: {invitations[tournament.id].length}
                        </span>
                        <select
                          defaultValue=""
                          onChange={(event) => {
                            inviteUser(tournament.id, event.target.value);
                            event.target.value = "";
                          }}
                          className="rounded-[8px] border border-[rgba(21,23,28,.14)] bg-white px-2 py-1.5 text-[11.5px] font-semibold"
                        >
                          <option value="">+ Пригласить вручную</option>
                          {users
                            .filter((user) => !invitations[tournament.id].some((row) => row.user_id === user.id))
                            .map((user) => (
                              <option key={user.id} value={user.id}>{user.display_name}{user.email ? ` (${user.email})` : ""}</option>
                            ))}
                        </select>
                      </div>
                      {invitations[tournament.id].map((row) => (
                        <div key={row.id} className="grid grid-cols-[1fr_1fr_90px] gap-2 border-b border-[rgba(21,23,28,.06)] px-3 py-2 text-[12px] last:border-b-0">
                          <span className="truncate">{row.display_name}</span>
                          <span className="truncate text-[#6b6f76]">{row.email || "—"}</span>
                          <span className="font-bold">{row.status}</span>
                        </div>
                      ))}
                      {invitations[tournament.id].length === 0 && <p className="px-3 py-3 text-[12px] text-[#6b6f76]">Приглашений пока нет</p>}
                    </div>
                  )}
                  {results[tournament.id] && (
                    <div className="mt-4 overflow-hidden rounded-[12px] border border-[rgba(21,23,28,.08)]">
                      {results[tournament.id].map((row) => (
                        <div key={`${row.place}-${row.user_id}`} className="grid grid-cols-[40px_1fr_110px_70px_80px] items-center gap-2 border-b border-[rgba(21,23,28,.06)] px-3 py-2 text-[12px] last:border-b-0">
                          <span>#{row.place}</span>
                          <span className="truncate">{row.display_name}</span>
                          <span>{row.status}</span>
                          <strong>{row.score}/{row.max_score}</strong>
                          <button onClick={() => loadAttemptDetail(tournament.id, row.user_id)} className="rounded-[6px] border border-[rgba(21,23,28,.14)] px-2 py-1 text-[10.5px] font-bold">Ответы</button>
                        </div>
                      ))}
                      {results[tournament.id].length === 0 && <p className="px-3 py-3 text-[12px] text-[#6b6f76]">Попыток пока нет</p>}
                    </div>
                  )}
                  {attemptDetail && results[tournament.id]?.some((row) => row.user_id === attemptDetail.user_id) && (
                    <div className="mt-3 rounded-[12px] border border-[rgba(21,23,28,.08)] bg-[#fbfaf6] p-3">
                      <div className="mb-2 flex items-center justify-between">
                        <strong className="text-[12.5px]">Ответы участника · {attemptDetail.score}/{attemptDetail.max_score}</strong>
                        <button onClick={() => setAttemptDetail(null)} className="text-[11.5px] font-bold text-[#6b6f76]">Закрыть</button>
                      </div>
                      {attemptDetail.answers.map((item, index) => (
                        <div key={item.question_id} className="border-b border-[rgba(21,23,28,.06)] py-2 text-[12px] last:border-b-0">
                          <p className="mb-0.5 font-semibold">#{index + 1} {item.prompt}</p>
                          <p className="text-[#6b6f76]">
                            Ответ: {item.answer ? JSON.stringify(item.answer) : "—"} · Верный: {JSON.stringify(item.correct_answer)} ·{" "}
                            <span className={item.is_correct ? "font-bold text-[#15803d]" : "font-bold text-[#b42318]"}>
                              {item.points_awarded}/{item.points} б.
                            </span>
                          </p>
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
              <div key={user.id} className="border-b border-[rgba(21,23,28,.07)] last:border-b-0">
                <div className="grid items-center gap-2 px-5 py-4 text-[13px] sm:grid-cols-[1fr_220px_70px_80px_180px]">
                  <strong className="truncate">{user.display_name}</strong>
                  <span className="truncate text-[#6b6f76]">{user.email || "email не передан"}</span>
                  <span>{user.role}</span>
                  <span className={user.is_active ? "text-[#16a34a]" : "text-[#ff4d3d]"}>{user.is_active ? "active" : "blocked"}</span>
                  <span className="flex gap-2">
                    <button onClick={() => loadUserDetail(user.id)} className="rounded-[6px] border border-[rgba(21,23,28,.14)] px-3 py-1.5 text-[11.5px] font-bold">
                      {userDetail?.id === user.id ? "Скрыть" : "Карточка"}
                    </button>
                    <button
                      onClick={() => toggleUserBlock(user)}
                      className={`rounded-[6px] px-3 py-1.5 text-[11.5px] font-bold ${user.is_active ? "border border-[rgba(255,77,61,.3)] text-[#b42318]" : "bg-[#16a34a] text-white"}`}
                    >
                      {user.is_active ? "Заблокировать" : "Разблокировать"}
                    </button>
                  </span>
                </div>
                {userDetail?.id === user.id && (
                  <div className="grid gap-3 bg-[#fbfaf6] px-5 py-4 text-[12px] sm:grid-cols-2">
                    <div>
                      <p className="mb-1.5 text-[10.5px] font-bold uppercase tracking-[.08em] text-[#6b6f76]">Прогресс обучения</p>
                      {userDetail.progress.length === 0 && <p className="text-[#6b6f76]">Прогресса пока нет</p>}
                      {userDetail.progress.map((row) => (
                        <p key={row.lesson_id} className="py-0.5">
                          {row.lesson_title ?? "Урок"} — <strong>{row.status}</strong> ({row.best_score}/{row.max_score})
                        </p>
                      ))}
                    </div>
                    <div>
                      <p className="mb-1.5 text-[10.5px] font-bold uppercase tracking-[.08em] text-[#6b6f76]">Турниры</p>
                      {userDetail.attempts.length === 0 && <p className="text-[#6b6f76]">Попыток пока нет</p>}
                      {userDetail.attempts.map((row) => (
                        <p key={row.tournament_id} className="py-0.5">
                          {row.tournament_title ?? "Турнир"} — <strong>{row.status}</strong> ({row.score}/{row.max_score})
                        </p>
                      ))}
                      {userDetail.invitations.length > 0 && (
                        <p className="mt-1.5 text-[#6b6f76]">Приглашений: {userDetail.invitations.length}</p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </section>
        )}
      </div>
    </main>
  );
}
