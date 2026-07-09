"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const TOTAL_QUESTIONS = 20;
const DURATION_SECONDS = 60 * 60;

const sampleQuestion = {
  points: 10,
  prompt: "Модель имеет высокую accuracy, но низкий recall на редком классе. Какая метрика точнее покажет проблему?",
  options: ["Accuracy", "Recall", "Средняя скорость ответа", "Размер модели"],
  selected: 1,
};

function formatTime(totalSeconds: number) {
  const m = Math.floor(totalSeconds / 60);
  const s = totalSeconds % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

export default function TournamentLive() {
  const router = useRouter();
  const [current, setCurrent] = useState(4);
  const [secondsLeft, setSecondsLeft] = useState(DURATION_SECONDS - 17 * 60 - 42);

  useEffect(() => {
    const interval = setInterval(() => {
      setSecondsLeft((s) => (s > 0 ? s - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const progress = Math.round((current / TOTAL_QUESTIONS) * 100);

  return (
    <div>
      <div className="flex justify-between items-center mb-5 flex-wrap gap-3">
        <p className="text-[#6b6f76] text-[11px] font-bold tracking-[.12em] uppercase">
          AI Basics Tournament · вопрос {current} из {TOTAL_QUESTIONS}
        </p>
        <div className="flex items-center gap-1.5 bg-[#15171c] text-white rounded-full py-1.5 px-3.5 text-[13px] font-extrabold">
          ⏱ {formatTime(secondsLeft)}
        </div>
      </div>
      <div className="h-[5px] rounded-full bg-[rgba(21,23,28,.1)] mb-5.5">
        <span className="block h-full rounded-full bg-[#16a34a]" style={{ width: `${progress}%` }} />
      </div>

      <div className="rounded-[24px] bg-white border border-[rgba(21,23,28,.07)] p-6.5 shadow-[0_10px_30px_-24px_rgba(21,23,28,.3)]">
        <p className="text-[#6b6f76] text-[11px] font-bold tracking-[.12em] uppercase mb-3.5">{sampleQuestion.points} баллов</p>
        <h3 className="text-base font-bold tracking-[-.01em] leading-snug mb-4.5">{sampleQuestion.prompt}</h3>

        {sampleQuestion.options.map((text, i) => (
          <div
            key={text}
            className="py-3.5 px-4 rounded-[13px] text-[13.5px] mb-2.5 border-[1.5px]"
            style={{
              borderColor: i === sampleQuestion.selected ? "#16a34a" : "rgba(21,23,28,.08)",
              background: i === sampleQuestion.selected ? "rgba(22,163,74,.06)" : "#f6f4ee",
            }}
          >
            {text}
          </div>
        ))}

        <div className="flex gap-2.5 mt-5 flex-wrap">
          <button
            onClick={() => setCurrent((c) => Math.max(1, c - 1))}
            className="inline-flex items-center h-[42px] px-5 rounded-full border border-[rgba(21,23,28,.12)] bg-white font-semibold text-[13px] hover:bg-[#f6f4ee] transition-colors"
          >
            ← Предыдущий
          </button>
          <button
            onClick={() => setCurrent((c) => Math.min(TOTAL_QUESTIONS, c + 1))}
            className="inline-flex items-center h-[42px] px-5 rounded-full bg-[#16a34a] text-white font-bold text-[13px] hover:opacity-86 transition-opacity"
          >
            Следующий →
          </button>
          <button
            onClick={() => router.push("/app/tournament/result")}
            className="inline-flex items-center h-[42px] px-5 rounded-full bg-[#15171c] text-white font-bold text-[13px] ml-auto hover:opacity-85 transition-opacity"
          >
            Завершить попытку →
          </button>
        </div>
      </div>
    </div>
  );
}
