"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { api, type Attempt, type Question, type Tournament } from "@/lib/api";

type AnswerValue = number | number[] | string;

function formatTime(totalSeconds: number) {
  const m = Math.floor(totalSeconds / 60);
  const s = totalSeconds % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

export default function TournamentLivePage() {
  return (
    <Suspense fallback={<div className="text-sm text-[#6b6f76]">Загружаем попытку...</div>}>
      <TournamentLive />
    </Suspense>
  );
}

function TournamentLive() {
  const router = useRouter();
  const search = useSearchParams();
  const [tournament, setTournament] = useState<Tournament | null>(null);
  const [attempt, setAttempt] = useState<Attempt | null>(null);
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<Record<string, AnswerValue>>({});
  const [secondsLeft, setSecondsLeft] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const tournaments = await api<Tournament[]>("/tournaments");
        const requestedId = search.get("id");
        const selected =
          tournaments.find((item) => item.id === requestedId) ??
          tournaments.find((item) => item.participation_status === "in_progress") ??
          tournaments.find((item) => item.status === "active") ??
          tournaments[0];
        if (!selected) throw new Error("Нет доступного турнира");
        setTournament(selected);
        await api<{ attempt_id: string }>(`/tournaments/${selected.id}/start`, { method: "POST" });
        const attemptData = await api<Attempt>(`/tournaments/${selected.id}/attempt`);
        setAttempt(attemptData);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Не удалось открыть попытку");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [search]);

  useEffect(() => {
    if (!attempt?.due_at) return;
    const tick = () => {
      const left = Math.max(0, Math.floor((new Date(attempt.due_at as string).getTime() - Date.now()) / 1000));
      setSecondsLeft(left);
    };
    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, [attempt?.due_at]);

  const question = attempt?.questions[current] ?? null;
  const progress = useMemo(() => attempt ? Math.round(((current + 1) / attempt.questions.length) * 100) : 0, [attempt, current]);

  async function saveCurrent() {
    if (!tournament || !question) return;
    setSaving(true);
    setError(null);
    try {
      await api<{ saved: number }>(`/tournaments/${tournament.id}/answers`, {
        method: "PUT",
        body: JSON.stringify({
          answers: [
            {
              question_id: question.id,
              answer: toApiAnswer(question, answers[question.id]),
            },
          ],
        }),
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Не удалось сохранить ответ");
    } finally {
      setSaving(false);
    }
  }

  async function submit() {
    if (!tournament) return;
    if (question) await saveCurrent();
    try {
      await api<{ status: string; score: number; max_score: number }>(`/tournaments/${tournament.id}/submit`, { method: "POST" });
      router.push(`/app/tournament/result?id=${tournament.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Не удалось завершить попытку");
    }
  }

  async function next() {
    await saveCurrent();
    setCurrent((index) => Math.min((attempt?.questions.length ?? 1) - 1, index + 1));
  }

  if (loading) {
    return <div className="text-sm text-[#6b6f76]">Загружаем попытку...</div>;
  }

  if (!attempt || !tournament || !question) {
    return <div className="text-sm text-[#ff4d3d]">{error ?? "Попытка недоступна"}</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-5 flex-wrap gap-3">
        <p className="text-[#6b6f76] text-[11px] font-bold tracking-[.12em] uppercase">
          {tournament.title} · вопрос {current + 1} из {attempt.questions.length}
        </p>
        <div className="flex items-center gap-1.5 bg-[#15171c] text-white rounded-full py-1.5 px-3.5 text-[13px] font-extrabold">
          {formatTime(secondsLeft)}
        </div>
      </div>
      <div className="h-[5px] rounded-full bg-[rgba(21,23,28,.1)] mb-5.5">
        <span className="block h-full rounded-full bg-[#16a34a]" style={{ width: `${progress}%` }} />
      </div>

      <div className="rounded-[24px] bg-white border border-[rgba(21,23,28,.07)] p-6.5 shadow-[0_10px_30px_-24px_rgba(21,23,28,.3)]">
        <p className="text-[#6b6f76] text-[11px] font-bold tracking-[.12em] uppercase mb-3.5">{question.points} баллов</p>
        <h3 className="text-base font-bold leading-snug mb-4.5">{question.prompt}</h3>

        <AnswerControl question={question} value={answers[question.id]} onChange={(value) => setAnswers((currentAnswers) => ({ ...currentAnswers, [question.id]: value }))} />

        {error && <p className="text-[#ff4d3d] text-xs font-semibold mt-3">{error}</p>}

        <div className="flex gap-2.5 mt-5 flex-wrap">
          <button onClick={() => setCurrent((index) => Math.max(0, index - 1))} className="inline-flex items-center h-[42px] px-5 rounded-full border border-[rgba(21,23,28,.12)] bg-white font-semibold text-[13px] hover:bg-[#f6f4ee] transition-colors">
            Предыдущий
          </button>
          <button onClick={next} disabled={saving} className="inline-flex items-center h-[42px] px-5 rounded-full bg-[#16a34a] text-white font-bold text-[13px] hover:opacity-86 transition-opacity disabled:opacity-45">
            {current === attempt.questions.length - 1 ? "Сохранить" : "Следующий"}
          </button>
          <button onClick={submit} className="inline-flex items-center h-[42px] px-5 rounded-full bg-[#15171c] text-white font-bold text-[13px] ml-auto hover:opacity-85 transition-opacity">
            Завершить попытку
          </button>
        </div>
      </div>
    </div>
  );
}

function AnswerControl({ question, value, onChange }: { question: Question; value: AnswerValue | undefined; onChange: (value: AnswerValue) => void }) {
  if (question.type === "single_choice") {
    return question.options?.map((text, index) => <Choice key={text} selected={value === index} onClick={() => onChange(index)}>{text}</Choice>);
  }
  if (question.type === "multiple_choice") {
    return question.options?.map((text, index) => {
      const selected = Array.isArray(value) && value.includes(index);
      return (
        <Choice
          key={text}
          selected={selected}
          onClick={() => {
            const current = Array.isArray(value) ? value : [];
            onChange(selected ? current.filter((item) => item !== index) : [...current, index]);
          }}
        >
          {text}
        </Choice>
      );
    });
  }
  return (
    <input
      value={typeof value === "string" ? value : ""}
      onChange={(event) => onChange(event.target.value)}
      inputMode={question.type === "number" ? "decimal" : "text"}
      className="w-full h-11 rounded-[13px] bg-[#f6f4ee] border border-[rgba(21,23,28,.08)] px-4 text-[13.5px] outline-none focus:border-[#16a34a]"
      placeholder={question.type === "number" ? "Введите число" : "Введите ответ"}
    />
  );
}

function Choice({ selected, onClick, children }: { selected: boolean; onClick: () => void; children: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="block w-full text-left py-3.5 px-4 rounded-[13px] text-[13.5px] mb-2.5 border-[1.5px]"
      style={{
        borderColor: selected ? "#16a34a" : "rgba(21,23,28,.08)",
        background: selected ? "rgba(22,163,74,.06)" : "#f6f4ee",
      }}
    >
      {children}
    </button>
  );
}

function toApiAnswer(question: Question, value: AnswerValue | undefined) {
  if (question.type === "single_choice") return { option: value };
  if (question.type === "multiple_choice") return { options: Array.isArray(value) ? value : [] };
  if (question.type === "number") return { number: Number(value) };
  return { text: String(value ?? "") };
}
