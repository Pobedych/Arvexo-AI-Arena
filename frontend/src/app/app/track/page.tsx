"use client";

import Link from "next/link";
import { type ReactNode, useEffect, useState } from "react";
import { api, currentLesson, type Track, type TrackLesson } from "@/lib/api";
import { Eyebrow, Card } from "@/components/ui";

export default function TrackPage() {
  const [track, setTrack] = useState<Track | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [viewMode, setViewMode] = useState<"sections" | "path">("sections");

  useEffect(() => {
    api<Track>("/tracks/ai")
      .then((data) => {
        setTrack(data);
        setError("");
      })
      .catch((err) => setError(err instanceof Error ? err.message : "Не удалось загрузить AI Track"))
      .finally(() => setLoading(false));
  }, []);

  async function selectTrack() {
    try {
      const selected = await api<Track>("/tracks/ai/select", { method: "POST" });
      setTrack(selected);
      setError("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Не удалось выбрать трек");
    }
  }

  if (loading) {
    return <div className="text-sm text-[#6b6f76]">Загружаем AI Track...</div>;
  }

  if (error || !track) {
    return (
      <div className="rounded-[16px] border border-[rgba(255,77,61,.25)] bg-[rgba(255,77,61,.06)] px-5 py-4 text-sm text-[#b42318]">
        {error || "Не удалось загрузить AI Track"}
      </div>
    );
  }

  const lesson = currentLesson(track);

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-4.5">
        <div>
          <Eyebrow>AI Track</Eyebrow>
          <h1 className="font-[family-name:var(--font-display)] text-[clamp(28px,3.6vw,44px)] font-semibold">
            Карта подготовки
          </h1>
        </div>
        {lesson && (
          <Link
            href={`/app/lesson/${lesson.id}`}
            className="inline-flex items-center min-h-11.5 px-5.5 py-2.5 rounded-full bg-[#16a34a] text-white font-bold text-sm hover:opacity-86 transition-opacity max-w-full sm:max-w-[420px] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#15171c] active:scale-[.98]"
          >
            Урок {lesson.order}: {lesson.title}
          </Link>
        )}
      </div>

      <Card className="rounded-[20px] p-5 mb-5.5">
        <p className="text-[#16a34a] text-[10.5px] font-bold tracking-[.1em] uppercase mb-3">Прогресс</p>
        <strong className="font-[family-name:var(--font-display)] text-[42px] block">{track.progress_percent}%</strong>
        <p className="text-xs text-[#6b6f76] leading-relaxed">
          {track.total_lessons} уроков: от основ AI до ответственного использования технологий
        </p>
      </Card>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5.5">
        <Stat value={`${track.completed_lessons} / ${track.total_lessons}`} label="уроков пройдено" />
        <Stat value={`${Math.max(track.total_lessons - track.completed_lessons, 0)}`} label="осталось уроков" />
        <Stat value={track.progress_percent >= 70 ? "Готов" : "Подготовка"} label="статус к турниру" />
        <button
          onClick={selectTrack}
          className="rounded-2xl bg-[#15171c] text-white py-3.5 px-4 text-left hover:opacity-90 transition-opacity focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#16a34a] active:scale-[.98]"
        >
          <strong className="font-[family-name:var(--font-display)] text-[22px] block text-[#74bd70]">AI</strong>
          <span className="text-[11.5px] text-white/55">выбрать трек</span>
        </button>
      </div>

      <div className="grid lg:grid-cols-[minmax(0,1fr)_250px] gap-5 items-start">
        <div>
          <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
            <p className="text-[11px] font-bold tracking-[.1em] uppercase text-[#6b6f76]">Учебный план</p>
            <div aria-label="Вид учебного плана" role="group" className="inline-grid grid-cols-2 rounded-[12px] border border-[rgba(21,23,28,.1)] bg-white p-1">
              <ViewButton active={viewMode === "sections"} onClick={() => setViewMode("sections")}>
                По темам
              </ViewButton>
              <ViewButton active={viewMode === "path"} onClick={() => setViewMode("path")}>
                Маршрут
              </ViewButton>
            </div>
          </div>

          {viewMode === "sections" ? (
            <div className="grid gap-3 md:grid-cols-2">
              {track.sections.map((section) => (
                <SectionPanel key={section.id} section={section} />
              ))}
            </div>
          ) : (
            <div>
              {track.sections.map((section) => {
                const done = section.lessons.filter((item) => item.status === "completed").length;
                return (
                  <div key={section.id} className="mb-5.5">
                    <div className="flex justify-between items-baseline mb-2 pl-0.5">
                      <h3 className="text-[13px] font-bold text-[#15171c]">{section.title}</h3>
                      <span className="text-[11px] text-[#6b6f76] font-semibold">
                        {done}/{section.lessons.length}
                      </span>
                    </div>
                    <div className="relative pl-0.5">
                      <div className="absolute left-[19px] top-5 bottom-5 w-0.5 bg-[rgba(21,23,28,.1)]" />
                      {section.lessons.map((item) => (
                        <LessonRow key={item.id} lesson={item} />
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div className="grid gap-3.5 lg:sticky lg:top-[92px]">
          <Card className="rounded-[20px] p-5">
            <p className="text-[#6b6f76] text-[10.5px] font-bold tracking-[.1em] uppercase mb-3">Навыки трека</p>
            <div className="flex flex-wrap gap-1.5">
              {["ML базовый", "Работа с данными", "Метрики качества", "Этика AI"].map((skill, index) => (
                <span key={skill} className={`text-[11px] rounded-full py-1.5 px-2.5 ${index === 0 ? "bg-[#16a34a] text-white" : "bg-[#f6f4ee]"}`}>
                  {skill}
                </span>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

function ViewButton({ active, onClick, children }: { active: boolean; onClick: () => void; children: ReactNode }) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className={`min-h-8 rounded-[9px] px-3 text-[11.5px] font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-[#16a34a] ${
        active ? "bg-[#15171c] text-white" : "text-[#6b6f76] hover:text-[#15171c]"
      }`}
    >
      {children}
    </button>
  );
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div className="rounded-2xl bg-white border border-[rgba(21,23,28,.07)] py-3.5 px-4">
      <strong className="font-[family-name:var(--font-display)] text-[22px] block">{value}</strong>
      <span className="text-[11.5px] text-[#6b6f76]">{label}</span>
    </div>
  );
}

type TrackSection = Track["sections"][number];

function SectionPanel({ section }: { section: TrackSection }) {
  const done = section.lessons.filter((item) => item.status === "completed").length;
  const active = section.lessons.some((item) => item.unlocked && item.status !== "completed");

  return (
    <section
      className={`rounded-[20px] border p-4 sm:p-5 ${
        active ? "border-[rgba(22,163,74,.28)] bg-[#eef5ec] md:col-span-2" : "border-[rgba(21,23,28,.08)] bg-white"
      }`}
    >
      <div className="mb-4 flex items-start justify-between gap-4">
        <div>
          <h3 className="text-[14px] font-semibold leading-snug text-[#15171c]">{section.title}</h3>
          <p className="mt-1 text-[11px] text-[#6b6f76]">
            {active ? "Продолжай с доступного задания" : done === section.lessons.length ? "Тема завершена" : "Откроется по порядку"}
          </p>
        </div>
        <span className={`shrink-0 text-[11px] font-semibold ${active ? "text-[#377d35]" : "text-[#6b6f76]"}`}>
          {done}/{section.lessons.length}
        </span>
      </div>
      <div className={`grid gap-2 ${active ? "md:grid-cols-3" : ""}`}>
        {section.lessons.map((item) => (
          <LessonRow key={item.id} lesson={item} variant="card" />
        ))}
      </div>
    </section>
  );
}

function LessonRow({ lesson, variant = "path" }: { lesson: TrackLesson; variant?: "path" | "card" }) {
  const completed = lesson.status === "completed";
  const current = lesson.unlocked && !completed;
  const icon = completed ? "✓" : lesson.order;
  const sub = completed ? `Пройден · ${lesson.best_score}/${lesson.max_score}` : current ? "Доступен сейчас" : "Заблокирован";
  const nodeClass = completed
    ? "bg-[#16a34a] text-white"
    : current
      ? "bg-[#15171c] text-[#74bd70] shadow-[0_0_0_4px_rgba(22,163,74,.16)]"
      : "bg-[#f6f4ee] text-[#a8a49b] border border-[rgba(21,23,28,.1)]";
  const className =
    variant === "card"
      ? `flex min-h-[70px] items-center gap-3 rounded-[13px] border px-3 py-2.5 transition-colors ${
          current
            ? "border-[rgba(22,163,74,.28)] bg-white hover:border-[#16a34a]"
            : completed
              ? "border-[rgba(22,163,74,.16)] bg-white"
              : "border-[rgba(21,23,28,.07)] bg-white/55"
        }`
      : `flex items-center gap-3.5 py-2.5 px-2.5 rounded-[13px] relative ${current ? "bg-[#16a34a]/[.06]" : ""}`;
  const content = (
    <>
      <span className={`w-[34px] h-[34px] rounded-full grid place-items-center text-[12px] font-semibold shrink-0 relative z-10 ${nodeClass}`}>{icon}</span>
      <div className="min-w-0">
        <strong className={`text-[13px] block ${lesson.unlocked ? "font-bold text-[#15171c]" : "font-medium text-[#a8a49b]"}`}>{lesson.title}</strong>
        <span className={`text-[11px] block ${lesson.unlocked ? "text-[#6b6f76]" : "text-[#a8a49b]"}`}>{sub}</span>
      </div>
    </>
  );

  return lesson.unlocked ? (
    <Link href={`/app/lesson/${lesson.id}`} className={className}>
      {content}
    </Link>
  ) : (
    <div className={className}>{content}</div>
  );
}
