"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { api, toApiAnswer, type AnswerValue, type PracticeCheckResult, type Question } from "@/lib/api";

const QUESTION_COUNT = 3;

export default function Practice() {
  const [questions, setQuestions] = useState<Question[] | null>(null);
  const [idx, setIdx] = useState(0);
  const [selected, setSelected] = useState<AnswerValue | undefined>(undefined);
  const [result, setResult] = useState<PracticeCheckResult | null>(null);
  const [score, setScore] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [checking, setChecking] = useState(false);

  useEffect(() => {
    load();
  }, []);

  function load() {
    setQuestions(null);
    setIdx(0);
    setSelected(undefined);
    setResult(null);
    setScore(0);
    setError(null);
    api<Question[]>(`/practice/questions?limit=${QUESTION_COUNT}`)
      .then(setQuestions)
      .catch((err) => setError(err instanceof Error ? err.message : "Не удалось загрузить вопросы"));
  }

  const done = questions !== null && idx >= questions.length;
  const q = questions && !done ? questions[idx] : null;
  const progress = questions ? Math.round((idx / questions.length) * 100) : 0;

  async function check() {
    if (!q || selected === undefined) return;
    setChecking(true);
    setError(null);
    try {
      const response = await api<PracticeCheckResult>("/practice/check", {
        method: "POST",
        body: JSON.stringify({ question_id: q.id, answer: toApiAnswer(q, selected) }),
      });
      setResult(response);
      if (response.is_correct) setScore((s) => s + 1);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Не удалось проверить ответ");
    } finally {
      setChecking(false);
    }
  }

  function next() {
    setIdx((v) => v + 1);
    setSelected(undefined);
    setResult(null);
  }

  if (error && !questions) {
    return <p className="text-sm text-[#ff4d3d]">{error}</p>;
  }

  if (!questions) {
    return <div className="text-sm text-[#6b6f76]">Подбираем вопросы...</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-1.5 flex-wrap gap-3">
        <p className="text-[#6b6f76] text-[11px] font-bold tracking-[.12em] uppercase">Быстрая практика · вперемешку по темам</p>
        <div className="flex items-center gap-1.5 bg-[#f6f4ee] rounded-full py-1.5 px-3 text-xs font-bold">
          <span className="text-[#16a34a]">✓</span> {score} верно из {questions.length}
        </div>
      </div>
      <h1 className="font-[family-name:var(--font-display)] text-[clamp(22px,3vw,32px)] font-semibold tracking-[-.015em] mb-2">
        Разминка перед турниром
      </h1>
      <p className="text-[13.5px] text-[#6b6f76] leading-relaxed mb-5.5 max-w-[520px]">
        Несколько случайных вопросов из разных тем трека — без теории, сразу к делу. Помогает повторить изученное и найти пробелы.
      </p>

      <div className="h-[5px] rounded-full bg-[rgba(21,23,28,.1)] mb-5">
        <span className="block h-full rounded-full bg-[#16a34a] transition-all" style={{ width: `${progress}%` }} />
      </div>

      {!done && q && (
        <div className="rounded-[24px] bg-white border border-[rgba(22,163,74,.18)] p-6.5 shadow-[0_10px_30px_-24px_rgba(22,163,74,.18)]">
          <p className="text-[#16a34a] text-[11px] font-bold tracking-[.12em] uppercase mb-3.5">
            Вопрос {idx + 1} из {questions.length}
          </p>
          <h3 className="text-base font-bold tracking-[-.01em] leading-snug mb-4.5">{q.prompt}</h3>

          {q.type === "single_choice" &&
            q.options?.map((text, optionIndex) => (
              <button
                type="button"
                key={text}
                onClick={() => !result && setSelected(optionIndex)}
                disabled={Boolean(result)}
                aria-pressed={selected === optionIndex}
                className="block w-full text-left py-3.5 px-4 rounded-[13px] cursor-pointer text-[13.5px] font-medium mb-2.5 border-[1.5px] transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#16a34a] disabled:cursor-default"
                style={{
                  borderColor: selected === optionIndex ? "#16a34a" : "rgba(21,23,28,.08)",
                  background: selected === optionIndex ? "rgba(22,163,74,.06)" : "#f6f4ee",
                }}
              >
                {text}
              </button>
            ))}

          {error && <p className="text-[#ff4d3d] text-xs font-semibold mt-1.5">{error}</p>}

          {result && result.is_correct && (
            <div role="status" aria-live="polite" className="rounded-[14px] bg-[rgba(22,163,74,.08)] border border-[rgba(22,163,74,.2)] py-3.5 px-4 mt-1.5">
              <strong className="text-[12.5px] text-[#16a34a]">✓ Верно.</strong> <span className="text-[12.5px]">{result.explanation}</span>
            </div>
          )}
          {result && !result.is_correct && (
            <div role="status" aria-live="polite" className="rounded-[14px] bg-[rgba(255,77,61,.08)] border border-[rgba(255,77,61,.2)] py-3.5 px-4 mt-1.5">
              <strong className="text-[12.5px] text-[#ff4d3d]">✗ Не совсем.</strong> <span className="text-[12.5px]">{result.explanation}</span>
            </div>
          )}

          <div className="flex gap-2.5 mt-4.5 flex-wrap">
            {selected !== undefined && !result && (
              <button
                onClick={check}
                disabled={checking}
                className="inline-flex items-center h-[42px] px-5 rounded-full bg-[#16a34a] text-white font-bold text-[13px] hover:opacity-86 transition-opacity disabled:opacity-50"
              >
                Проверить ответ
              </button>
            )}
            {result && (
              <button
                onClick={next}
                className="inline-flex items-center h-[42px] px-5 rounded-full bg-[#15171c] text-white font-bold text-[13px] ml-auto hover:opacity-85 transition-opacity"
              >
                Дальше →
              </button>
            )}
          </div>
        </div>
      )}

      {done && (
        <div className="rounded-[24px] bg-[#15171c] text-white p-8 text-center">
          <p className="text-[#16a34a] text-[11px] font-bold tracking-[.12em] uppercase mb-2.5">Разминка завершена</p>
          <strong className="font-[family-name:var(--font-display)] text-[44px] font-semibold block mb-2.5">
            {score} / {questions.length}
          </strong>
          <div className="flex gap-2.5 justify-center flex-wrap mt-2.5">
            <button
              onClick={load}
              className="inline-flex items-center h-[42px] px-5 rounded-full bg-[#16a34a] text-white font-bold text-[13px] hover:opacity-86 transition-opacity"
            >
              Ещё раз
            </button>
            <Link
              href="/app/track"
              className="inline-flex items-center h-[42px] px-5 rounded-full bg-white/[.12] text-white font-bold text-[13px] hover:opacity-85 transition-opacity"
            >
              К AI Track →
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
