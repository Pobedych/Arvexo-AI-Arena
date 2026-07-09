"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { api, currentLesson, formatDateTime, type ApiUser, type Tournament, type Track } from "@/lib/api";
import { Eyebrow, Card } from "@/components/ui";

const days = [
  { label: "Пн", h: 34, active: true },
  { label: "Вт", h: 58, active: true },
  { label: "Ср", h: 14, active: false },
  { label: "Чт", h: 44, active: true },
  { label: "Пт", h: 70, dark: true },
  { label: "Сб", h: 14, active: false },
  { label: "Вс", h: 24, active: false },
];

export default function Dashboard() {
  const [user, setUser] = useState<ApiUser | null>(null);
  const [track, setTrack] = useState<Track | null>(null);
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    Promise.all([api<ApiUser>("/auth/me"), api<Track>("/tracks/ai"), api<Tournament[]>("/tournaments")])
      .then(([userData, trackData, tournamentData]) => {
        setUser(userData);
        setTrack(trackData);
        setTournaments(tournamentData);
      })
      .catch((err) => setLoadError(err instanceof Error ? err.message : "Не удалось загрузить арену"))
      .finally(() => setLoading(false));
  }, []);

  const lesson = track ? currentLesson(track) : null;
  const nextTournament = useMemo(
    () =>
      tournaments.find((item) => ["active", "published"].includes(item.status)) ??
      tournaments.find((item) => item.participation_status) ??
      tournaments[0],
    [tournaments],
  );

  if (loading) {
    return <div className="text-sm text-[#6b6f76]">Загружаем твою арену...</div>;
  }

  if (loadError || !track) {
    return <div className="text-sm text-[#ff4d3d]">{loadError ?? "Не удалось загрузить арену"}</div>;
  }

  return (
    <div>
      <Eyebrow>Твоя арена</Eyebrow>
      <h1 className="font-[family-name:var(--font-display)] text-[clamp(30px,4vw,50px)] font-semibold mb-7">
        С возвращением, {user?.display_name ?? "участник"}
      </h1>

      <div className="grid md:grid-cols-[1.5fr_1fr] gap-3.5 mb-3.5">
        <Card className="rounded-[28px] p-7 flex flex-col shadow-[0_20px_48px_-38px_rgba(21,23,28,.35)]">
          <Eyebrow>Продолжить</Eyebrow>
          <h2 className="font-[family-name:var(--font-display)] text-[26px] font-semibold mb-2.5 max-w-[420px]">
            {lesson ? `Урок ${lesson.order} — ${lesson.title}` : "AI Track открыт"}
          </h2>
          <p className="text-[13.5px] text-[#6b6f76] leading-relaxed mb-5 max-w-[420px]">
            {lesson?.summary || track.description}
          </p>
          <div className="flex items-center gap-2 mt-auto flex-wrap">
            <Link
              href={lesson ? `/app/lesson/${lesson.id}` : "/app/track"}
              className="inline-flex items-center h-11 px-5 rounded-full bg-[#15171c] text-white font-bold text-[13.5px] hover:opacity-85 transition-opacity"
            >
              Продолжить
            </Link>
            <span className="text-xs text-[#6b6f76]">
              {track.progress_percent}% трека готово · {track.completed_lessons}/{track.total_lessons} уроков
            </span>
          </div>
        </Card>

        <Card dark className="rounded-[28px] p-6.5 shadow-[0_20px_48px_-38px_rgba(21,23,28,.35)]">
          <p className="text-white/50 text-[11px] font-bold tracking-[.12em] uppercase mb-2">Готовность к турниру</p>
          <strong className="font-[family-name:var(--font-display)] text-[56px] font-semibold block leading-[.95] text-[#ffb100]">
            {track.progress_percent}%
          </strong>
          <div className="h-2 rounded-full bg-white/[.14] my-3.5">
            <span className="block h-full rounded-full bg-[#ffb100]" style={{ width: `${track.progress_percent}%` }} />
          </div>
          <p className="text-[12.5px] text-white/62 leading-relaxed">
            {track.progress_percent >= 70 ? "Ты уже хорошо готов к первому турниру." : "Продолжай уроки, чтобы увереннее выйти на арену."}
          </p>
        </Card>
      </div>

      <div className="grid sm:grid-cols-3 gap-3.5">
        <Card>
          <Link href="/app/track" className="text-[#16a34a] text-[11px] font-bold tracking-[.12em] uppercase mb-3 block">
            AI Track
          </Link>
          <strong className="font-[family-name:var(--font-display)] text-[34px] block">{track.completed_lessons}/{track.total_lessons}</strong>
          <p className="text-xs text-[#6b6f76]">уроков завершено</p>
        </Card>

        <div className="rounded-[24px] bg-[#ffb100] p-5 shadow-[0_14px_36px_-32px_rgba(21,23,28,.3)]">
          <p className="text-[#15171c]/55 text-[11px] font-bold tracking-[.12em] uppercase mb-2">
            {nextTournament ? `${formatDateTime(nextTournament.starts_at)} · ${nextTournament.duration_minutes} мин` : "Турнир готовится"}
          </p>
          <h3 className="text-[16px] font-extrabold mb-3.5">{nextTournament?.title ?? "AI Basics Tournament"}</h3>
          <Link
            href="/app/tournament"
            className="inline-flex items-center h-[38px] px-3.5 rounded-full bg-[#15171c] text-[#ffb100] font-bold text-[12.5px] hover:opacity-85 transition-opacity"
          >
            Открыть арену
          </Link>
        </div>

        <Card>
          <p className="text-[#6b6f76] text-[11px] font-bold tracking-[.12em] uppercase mb-3">Профиль</p>
          <strong className="text-[13px] block">{user?.email ?? "Arvexo Account"}</strong>
          <span className="text-[11px] text-[#6b6f76]">{user?.role === "admin" ? "Администратор" : "Участник"}</span>
        </Card>
      </div>

      <div className="grid md:grid-cols-[1.3fr_1fr] gap-3.5 mt-3.5">
        <Card>
          <div className="flex justify-between items-baseline mb-4">
            <p className="text-[#6b6f76] text-[11px] font-bold tracking-[.12em] uppercase">Активность за неделю</p>
            <strong className="text-xs text-[#16a34a]">{track.completed_lessons > 0 ? "есть прогресс" : "старт впереди"}</strong>
          </div>
          <div className="flex items-end gap-2.5 h-[76px] mb-2.5">
            {days.map((d) => (
              <div key={d.label} className="flex-1 flex flex-col items-center gap-1.5">
                <div className="w-full rounded-[7px]" style={{ height: `${d.h}px`, background: d.dark ? "#15171c" : d.active ? "#16a34a" : "rgba(21,23,28,.08)" }} />
                <span className="text-[10px] text-[#a8a49b]">{d.label}</span>
              </div>
            ))}
          </div>
          <p className="text-[11.5px] text-[#6b6f76]">Скоро здесь появится реальная история активности.</p>
        </Card>

        <Card>
          <p className="text-[#6b6f76] text-[11px] font-bold tracking-[.12em] uppercase mb-3.5">Ближайшее</p>
          <div className="grid gap-2.5">
            {lesson && <Agenda icon="📘" title={`Урок ${lesson.order} — ${lesson.title}`} subtitle="Доступен сейчас" />}
            {nextTournament && <Agenda icon="🏁" title={nextTournament.title} subtitle={formatDateTime(nextTournament.starts_at)} />}
          </div>
        </Card>
      </div>
    </div>
  );
}

function Agenda({ icon, title, subtitle }: { icon: string; title: string; subtitle: string }) {
  return (
    <div className="flex gap-2.5 items-center">
      <span className="w-8.5 h-8.5 rounded-[10px] bg-[#f6f4ee] grid place-items-center text-sm shrink-0">{icon}</span>
      <div>
        <strong className="text-[12.5px] block">{title}</strong>
        <span className="text-[11px] text-[#6b6f76]">{subtitle}</span>
      </div>
    </div>
  );
}
