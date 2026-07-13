"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { api, groupSortInitialValue, isNumberArray, matchingInitialValue, sequenceInitialOrder, toApiAnswer, type AnswerValue, type Attempt, type Question, type Tournament } from "@/lib/api";
import AdvancedQuestionInput, { initialAdvancedValue, isAdvancedQuestion } from "@/components/AdvancedQuestionInput";
import GroupSort from "@/components/GroupSort";
import MatchingPairs from "@/components/MatchingPairs";
import SequenceOrder from "@/components/SequenceOrder";

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
            .filter((question) => question.type === "sequence" || question.type === "matching" || question.type === "group_sort" || isAdvancedQuestion(question.type))
            .map((question) => [
              question.id,
              question.type === "sequence"
                ? sequenceInitialOrder(question)
                : question.type === "matching"
                  ? matchingInitialValue(question)
                  : question.type === "group_sort"
                    ? groupSortInitialValue(question)
                    : initialAdvancedValue(question),
            ] as [string, AnswerValue | undefined])
            .filter((entry): entry is [string, AnswerValue] => entry[1] !== undefined),
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
            className="w-full max-w-[440px] rounded-[28px] border border-white/15 bg-white p-6 shadow-[0_24px_80px_-24px_rgba(21,23,28,.55)] sm:p-7"
          >
            <div className="mb-5 grid h-12 w-12 place-items-center rounded-[16px] bg-[#fff3d6] text-[23px]" aria-hidden="true">🏁</div>
            <h2 id="finish-tournament-title" className="text-[21px] font-extrabold tracking-tight">Готовы завершить?</h2>
            <p id="finish-tournament-description" className="mt-2.5 text-[14px] leading-relaxed text-[#6b6f76]">
              Проверьте ответы перед отправкой. После завершения турнира вернуться к вопросам уже не получится.
            </p>
            <div className="mt-4 flex items-center gap-2 rounded-[14px] bg-[#f1f8ef] px-3.5 py-3 text-[12.5px] font-semibold text-[#26733c]">
              <span className="h-2 w-2 shrink-0 rounded-full bg-[#16a34a]" aria-hidden="true" />
              Текущий ответ сохранится автоматически
            </div>
            <div className="mt-6 flex flex-col gap-2.5 sm:flex-row">
              <button
                type="button"
                autoFocus
                disabled={submitting}
                onClick={() => setConfirmSubmitOpen(false)}
                className="h-12 flex-1 rounded-[14px] bg-[#16a34a] px-5 text-[13px] font-bold text-white transition-colors hover:bg-[#15803d] disabled:opacity-45"
              >
                Продолжить турнир
              </button>
              <button
                type="button"
                disabled={submitting}
                onClick={submit}
                className="h-12 flex-1 rounded-[14px] bg-[#ef2b2d] px-5 text-[13px] font-bold text-white shadow-[0_8px_20px_-10px_rgba(239,43,45,.85)] transition-colors hover:bg-[#d91f22] disabled:opacity-45"
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
      const selected = isNumberArray(value) && value.includes(index);
      return (
        <Choice
          key={text}
          selected={selected}
          onClick={() => {
            const current = isNumberArray(value) ? value : [];
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
        order={isNumberArray(value) ? value : sequenceInitialOrder(question)}
        onChange={onChange}
      />
    );
  }
  if (question.type === "matching" && question.options) {
    return (
      <MatchingPairs
        question={question}
        value={isNumberArray(value) ? value : matchingInitialValue(question)}
        onChange={onChange}
      />
    );
  }
  if (question.type === "group_sort" && question.options) {
    return (
      <GroupSort
        question={question}
        value={isNumberArray(value) ? value : groupSortInitialValue(question)}
        onChange={onChange}
      />
    );
  }
  if (isAdvancedQuestion(question.type)) {
    return <AdvancedQuestionInput question={question} value={value} onChange={onChange} />;
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
