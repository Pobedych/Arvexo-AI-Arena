"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { api, type ApiUser, type Tournament, type Track } from "@/lib/api";

const settings = [
  { label: "Напоминания об уроках", on: true },
  { label: "Показывать профиль работодателям", on: false },
  { label: "Email-уведомления о турнирах", on: false },
];

export default function Profile() {
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
      .catch((err) => setLoadError(err instanceof Error ? err.message : "Не удалось загрузить профиль"))
      .finally(() => setLoading(false));
  }, []);

  const initials = useMemo(() => {
    const name = user?.display_name ?? "Arvexo";
    return name
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0])
      .join("")
      .toUpperCase();
  }, [user?.display_name]);

  const finishedTournaments = tournaments.filter((item) => ["submitted", "auto_submitted"].includes(item.participation_status ?? "")).length;

  if (loading) {
    return <div className="text-sm text-[#6b6f76]">Загружаем профиль...</div>;
  }

  if (loadError || !user || !track) {
    return <div className="text-sm text-[#ff4d3d]">{loadError ?? "Не удалось загрузить профиль"}</div>;
  }

  return (
    <div>
      <div className="flex items-center justify-between gap-4.5 mb-6.5 flex-wrap">
        <div className="flex items-center gap-4.5">
          <span className="w-16 h-16 rounded-full bg-[#16a34a] text-white grid place-items-center font-bold text-[22px] shrink-0">{initials || "A"}</span>
          <div>
            <h1 className="font-[family-name:var(--font-display)] text-[clamp(24px,3vw,32px)] font-semibold mb-1">
              {user.display_name}
            </h1>
            <p className="text-[13px] text-[#6b6f76]">
              {user.email ?? "Arvexo Account"} · {user.role === "admin" ? "администратор" : "участник"}
            </p>
          </div>
        </div>
        <div className="text-right rounded-[18px] bg-[#15171c] py-3.5 px-5.5">
          <p className="text-white/50 text-[10px] font-bold tracking-[.1em] uppercase mb-1">AI Track</p>
          <strong className="font-[family-name:var(--font-display)] text-[30px] text-[#ffb100] block leading-none">{track.progress_percent}%</strong>
          <span className="text-[11px] text-[#16a34a] font-bold">{track.completed_lessons}/{track.total_lessons} уроков</span>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
        <Stat value={user.role === "admin" ? "Admin" : "User"} label="роль" />
        <Stat value={`${track.completed_lessons}/${track.total_lessons}`} label="AI Track" />
        <Stat value={`${finishedTournaments}`} label="турниров завершено" />
        <div className="rounded-2xl bg-[#15171c] text-white p-4">
          <strong className="font-[family-name:var(--font-display)] text-2xl block text-[#ffb100]">{tournaments.length}</strong>
          <span className="text-[11.5px] text-white/55">турниров доступно</span>
        </div>
      </div>

      <div className="grid md:grid-cols-[1.3fr_1fr] gap-3.5 mb-3.5">
        <div className="rounded-[20px] bg-white border border-[rgba(21,23,28,.07)] p-5">
          <p className="text-[#6b6f76] text-[10.5px] font-bold tracking-[.1em] uppercase mb-3.5">Текущий трек</p>
          <h3 className="text-[16px] font-extrabold mb-1">{track.title}</h3>
          <p className="text-[12.5px] text-[#6b6f76] leading-relaxed mb-3">{track.description}</p>
          <div className="h-2 rounded-full bg-[rgba(21,23,28,.1)]">
            <span className="block h-full rounded-full bg-[#16a34a]" style={{ width: `${track.progress_percent}%` }} />
          </div>
        </div>
        <div className="rounded-[20px] bg-white border border-[rgba(21,23,28,.07)] p-5">
          <p className="text-[#6b6f76] text-[10.5px] font-bold tracking-[.1em] uppercase mb-3.5">Настройки</p>
          <div className="grid gap-2.5">
            {settings.map((setting) => (
              <div key={setting.label} className="flex justify-between items-center gap-3">
                <span className="text-[12.5px]">{setting.label}</span>
                <span className="w-9 h-5 rounded-full relative inline-block shrink-0" style={{ background: setting.on ? "#16a34a" : "rgba(21,23,28,.12)" }}>
                  <span className="absolute top-0.5 w-4 h-4 rounded-full bg-white" style={setting.on ? { right: "2px" } : { left: "2px" }} />
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <Link href="/app/dashboard" className="inline-flex items-center h-11 px-5 rounded-full bg-[#15171c] text-white font-bold text-[13.5px] hover:opacity-85 transition-opacity">
        Кабинет
      </Link>
    </div>
  );
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div className="rounded-2xl bg-white border border-[rgba(21,23,28,.07)] p-4">
      <strong className="font-[family-name:var(--font-display)] text-2xl block">{value}</strong>
      <span className="text-[11.5px] text-[#6b6f76]">{label}</span>
    </div>
  );
}
