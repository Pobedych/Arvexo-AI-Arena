"use client";

import { useState } from "react";
import Link from "next/link";
import { practiceQuestions } from "@/lib/mockData";
import { Card } from "@/components/ui";

export default function Practice() {
  const [idx, setIdx] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [checked, setChecked] = useState(false);
  const [score, setScore] = useState(0);

  const done = idx >= practiceQuestions.length;
  const q = !done ? practiceQuestions[idx] : null;
  const isCorrect = q && selected === q.correct;
  const progress = Math.round((idx / practiceQuestions.length) * 100);

  const restart = () => {
    setIdx(0);
    setSelected(null);
    setChecked(false);
    setScore(0);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-1.5 flex-wrap gap-3">
        <p className="text-[#6b6f76] text-[11px] font-bold tracking-[.12em] uppercase">Быстрая практика · вперемешку по темам</p>
        <div className="flex items-center gap-1.5 bg-[#f6f4ee] rounded-full py-1.5 px-3 text-xs font-bold">
          <span className="text-[#16a34a]">✓</span> {score} верно из {practiceQuestions.length}
        </div>
      </div>
      <h1 className="font-[family-name:var(--font-display)] text-[clamp(22px,3vw,32px)] font-semibold tracking-[-.015em] mb-2">
        Разминка перед турниром
      </h1>
      <p className="text-[13.5px] text-[#6b6f76] leading-relaxed mb-5.5 max-w-[520px]">
        Три коротких вопроса из разных тем трека — без теории, сразу к делу. Помогает повторить изученное и найти пробелы.
      </p>

      <div className="h-[5px] rounded-full bg-[rgba(21,23,28,.1)] mb-5">
        <span className="block h-full rounded-full bg-[#16a34a] transition-all" style={{ width: `${progress}%` }} />
      </div>

      <div className="grid md:grid-cols-[2fr_1fr] gap-4 items-start">
        <div>
          {!done && q && (
            <div className="rounded-[24px] bg-white border border-[rgba(22,163,74,.18)] p-6.5 shadow-[0_10px_30px_-24px_rgba(22,163,74,.18)]">
              <p className="text-[#16a34a] text-[11px] font-bold tracking-[.12em] uppercase mb-3.5">
                Вопрос {idx + 1} из {practiceQuestions.length}
              </p>
              <h3 className="text-base font-bold tracking-[-.01em] leading-snug mb-4.5">{q.prompt}</h3>

              {q.options.map((text, i) => (
                <div
                  key={i}
                  onClick={() => !checked && setSelected(i)}
                  className="py-3.5 px-4 rounded-[13px] cursor-pointer text-[13.5px] font-medium mb-2.5 border-[1.5px] transition-colors"
                  style={{
                    borderColor: selected === i ? "#16a34a" : "rgba(21,23,28,.08)",
                    background: selected === i ? "rgba(22,163,74,.06)" : "#f6f4ee",
                  }}
                >
                  {text}
                </div>
              ))}

              {checked && isCorrect && (
                <div className="rounded-[14px] bg-[rgba(22,163,74,.08)] border border-[rgba(22,163,74,.2)] py-3.5 px-4 mt-1.5">
                  <strong className="text-[12.5px] text-[#16a34a]">✓ Верно.</strong> <span className="text-[12.5px]">{q.explain}</span>
                </div>
              )}
              {checked && !isCorrect && (
                <div className="rounded-[14px] bg-[rgba(255,77,61,.08)] border border-[rgba(255,77,61,.2)] py-3.5 px-4 mt-1.5">
                  <strong className="text-[12.5px] text-[#ff4d3d]">✗ Не совсем.</strong>{" "}
                  <span className="text-[12.5px]">{q.explain}</span>
                </div>
              )}

              <div className="flex gap-2.5 mt-4.5 flex-wrap">
                {selected !== null && !checked && (
                  <button
                    onClick={() => {
                      setChecked(true);
                      if (isCorrect) setScore((s) => s + 1);
                    }}
                    className="inline-flex items-center h-[42px] px-5 rounded-full bg-[#16a34a] text-white font-bold text-[13px] hover:opacity-86 transition-opacity"
                  >
                    Проверить ответ
                  </button>
                )}
                {checked && (
                  <button
                    onClick={() => {
                      setIdx((v) => v + 1);
                      setSelected(null);
                      setChecked(false);
                    }}
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
                {score} / {practiceQuestions.length}
              </strong>
              <p className="text-[13px] text-white/60 mb-5.5">
                Слабое место — переобучение и метрики. Загляни в AI Track перед турниром.
              </p>
              <div className="flex gap-2.5 justify-center flex-wrap">
                <button
                  onClick={restart}
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

        <div className="grid gap-3.5">
          <Card className="rounded-[20px] p-5">
            <p className="text-[#6b6f76] text-[10.5px] font-bold tracking-[.1em] uppercase mb-3">Слабые темы</p>
            <div className="grid gap-1.5">
              <div className="flex justify-between items-center">
                <span className="text-[12.5px] font-semibold">Переобучение</span>
                <span className="text-[11px] text-[#ff4d3d] font-bold">2 ошибки</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[12.5px] font-semibold">Recall / Precision</span>
                <span className="text-[11px] text-[#6b6f76]">1 ошибка</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[12.5px] font-semibold">Unsupervised</span>
                <span className="text-[11px] text-[#16a34a] font-bold">без ошибок</span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
