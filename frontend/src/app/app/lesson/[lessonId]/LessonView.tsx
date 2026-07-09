"use client";

import { useState } from "react";
import Link from "next/link";
import type { Lesson } from "@/lib/mockData";
import { modules, lessons } from "@/lib/mockData";

export default function LessonView({ lesson }: { lesson: Lesson }) {
  const [selected, setSelected] = useState<number | null>(null);
  const [checked, setChecked] = useState(false);

  const lessonModule = modules.find((m) => m.id === lesson.moduleId)!;
  const index = lessons.findIndex((l) => l.id === lesson.id);
  const nextLesson = lessons[index + 1];
  const isCorrect = selected === lesson.question.correct;

  return (
    <div>
      <div className="flex justify-between items-center mb-1.5 flex-wrap gap-3">
        <p className="text-[#6b6f76] text-[11px] font-bold tracking-[.12em] uppercase">
          {lessonModule.title} · Урок {index + 1} из {lessons.length}
        </p>
        <Link href="/app/track" className="text-xs text-[#16a34a] font-bold">
          ← К треку
        </Link>
      </div>
      <h1 className="font-[family-name:var(--font-display)] text-[clamp(22px,3vw,32px)] font-semibold tracking-[-.015em] mb-6">
        {lesson.title}
      </h1>

      <div className="rounded-[24px] bg-white border border-[rgba(21,23,28,.07)] py-7.5 px-8 mb-3.5 shadow-[0_10px_30px_-24px_rgba(21,23,28,.3)]">
        <p className="font-[family-name:var(--font-display)] italic text-[18px] font-medium leading-relaxed text-[#15171c] tracking-[-.005em]">
          {lesson.theory}
        </p>
      </div>

      <div className="rounded-[24px] bg-white border border-[rgba(22,163,74,.18)] p-6.5 shadow-[0_10px_30px_-24px_rgba(22,163,74,.18)]">
        <p className="text-[#16a34a] text-[11px] font-bold tracking-[.12em] uppercase mb-3.5">Проверь себя</p>
        <h3 className="text-base font-bold tracking-[-.01em] leading-snug mb-4.5">{lesson.question.prompt}</h3>

        {lesson.question.options.map((text, i) => (
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
            <strong className="text-[12.5px] text-[#16a34a]">✓ Верно.</strong>{" "}
            <span className="text-[12.5px]">{lesson.question.explain}</span>
          </div>
        )}
        {checked && !isCorrect && (
          <div className="rounded-[14px] bg-[rgba(255,77,61,.08)] border border-[rgba(255,77,61,.2)] py-3.5 px-4 mt-1.5">
            <strong className="text-[12.5px] text-[#ff4d3d]">✗ Не совсем.</strong>{" "}
            <span className="text-[12.5px]">{lesson.question.explain}</span>
          </div>
        )}

        <div className="flex gap-2.5 mt-4.5 flex-wrap">
          {selected !== null && !checked && (
            <button
              onClick={() => setChecked(true)}
              className="inline-flex items-center h-[42px] px-5 rounded-full bg-[#16a34a] text-white font-bold text-[13px] hover:opacity-86 transition-opacity"
            >
              Проверить ответ
            </button>
          )}
          {checked && (
            <Link
              href={nextLesson ? `/app/lesson/${nextLesson.id}` : "/app/track"}
              className="inline-flex items-center h-[42px] px-5 rounded-full bg-[#15171c] text-white font-bold text-[13px] ml-auto hover:opacity-85 transition-opacity"
            >
              {nextLesson ? "Следующий урок →" : "Вернуться к треку →"}
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
