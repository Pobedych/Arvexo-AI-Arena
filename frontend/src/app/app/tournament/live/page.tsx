"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { api, matchingInitialValue, sequenceInitialOrder, type Attempt, type Question, type Tournament } from "@/lib/api";
import MatchingPairs from "@/components/MatchingPairs";
import SequenceOrder from "@/components/SequenceOrder";

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
  const [confirmSubmitOpen, setConfirmSubmitOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

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
        setAnswers(Object.fromEntries(
          attemptData.questions
            .filter((question) => question.type === "sequence" || question.type === "matching")
            .map((question) => [question.id, question.type === "sequence" ? sequenceInitialOrder(question) : matchingInitialValue(question)]),
        ));
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

  useEffect(() => {
    if (!confirmSubmitOpen) return;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape" && !submitting) setConfirmSubmitOpen(false);
    };
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [confirmSubmitOpen, submitting]);

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
    setSubmitting(true);
    if (question) await saveCurrent();
    try {
      await api<{ status: string; score: number; max_score: number }>(`/tournaments/${tournament.id}/submit`, { method: "POST" });
      router.push(`/app/tournament/result?id=${tournament.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Не удалось завершить попытку");
      setConfirmSubmitOpen(false);
    } finally {
      setSubmitting(false);
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
          <button onClick={() => setConfirmSubmitOpen(true)} disabled={saving || submitting} className="inline-flex items-center h-[42px] px-5 rounded-full bg-[#15171c] text-white font-bold text-[13px] ml-auto hover:opacity-85 transition-opacity disabled:opacity-45">
            Завершить попытку
          </button>
        </div>
      </div>

      {confirmSubmitOpen && (
        <div
          className="fixed inset-0 z-50 grid place-items-center bg-[#15171c]/55 p-4 backdrop-blur-[2px]"
          onClick={() => !submitting && setConfirmSubmitOpen(false)}
        >
          <div
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="finish-tournament-title"
            aria-describedby="finish-tournament-description"
            onClick={(event) => event.stopPropagation()}
            className="w-full max-w-[430px] rounded-[24px] border border-white/15 bg-white p-6 shadow-[0_24px_80px_-24px_rgba(21,23,28,.55)]"
          >
            <div className="mb-5 grid h-11 w-11 place-items-center rounded-full bg-[#fff3d6] text-xl" aria-hidden="true">!</div>
            <h2 id="finish-tournament-title" className="text-[20px] font-extrabold tracking-tight">Завершить турнир?</h2>
            <p id="finish-tournament-description" className="mt-2 text-[13.5px] leading-relaxed text-[#6b6f76]">
              После отправки изменить ответы будет нельзя. Убедитесь, что вы ответили на все вопросы.
            </p>
            <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
              <button
                type="button"
                autoFocus
                disabled={submitting}
                onClick={() => setConfirmSubmitOpen(false)}
                className="h-11 rounded-full border border-[rgba(21,23,28,.14)] px-5 text-[13px] font-bold hover:bg-[#f6f4ee] disabled:opacity-45"
              >
                Отмена
              </button>
              <button
                type="button"
                disabled={submitting}
                onClick={submit}
                className="h-11 rounded-full bg-[#15171c] px-5 text-[13px] font-bold text-white hover:opacity-85 disabled:opacity-45"
              >
                {submitting ? "Завершаем..." : "Завершить турнир"}
              </button>
            </div>
          </div>
        </div>
      )}
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
  if (question.type === "sequence" && question.options) {
    return (
      <SequenceOrder
        options={question.options}
        order={Array.isArray(value) ? value : sequenceInitialOrder(question)}
        onChange={onChange}
      />
    );
  }
  if (question.type === "matching" && question.options) {
    return (
      <MatchingPairs
        question={question}
        value={Array.isArray(value) ? value : matchingInitialValue(question)}
        onChange={onChange}
      />
    );
  }
  if (question.type === "code_text") {
    return (
      <textarea
        value={typeof value === "string" ? value : ""}
        onChange={(event) => onChange(event.target.value)}
        spellCheck={false}
        rows={10}
        className="w-full rounded-[13px] bg-[#15171c] border border-white/10 px-4 py-3 font-mono text-[13px] leading-relaxed text-white outline-none focus:border-[#16a34a]"
        placeholder="Напишите решение здесь…"
        aria-label="Код решения"
      />
    );
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
  if (question.type === "sequence") return { order: Array.isArray(value) ? value : [] };
  if (question.type === "matching") return { matches: Array.isArray(value) ? value : [] };
  if (question.type === "code_text") return { code: String(value ?? "") };
  return { text: String(value ?? "") };
}
