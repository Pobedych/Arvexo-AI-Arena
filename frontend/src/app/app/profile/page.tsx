"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { api, type ActivityDay, type ApiUser, type Tournament, type Track } from "@/lib/api";

const settings = [
  { id: "lesson-reminders", label: "Напоминания об уроках", on: true },
  { id: "employer-profile", label: "Показывать профиль работодателям", on: false },
  { id: "tournament-email", label: "Email-уведомления о турнирах", on: false },
];

export default function Profile() {
  const router = useRouter();
  const [user, setUser] = useState<ApiUser | null>(null);
  const [track, setTrack] = useState<Track | null>(null);
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [activity, setActivity] = useState<ActivityDay[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    Promise.all([api<ApiUser>("/auth/me"), api<Track>("/tracks/ai"), api<Tournament[]>("/tournaments"), api<ActivityDay[]>("/activity/year")])
      .then(([userData, trackData, tournamentData, activityData]) => {
        setUser(userData);
        setTrack(trackData);
        setTournaments(tournamentData);
        setActivity(activityData);
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

  async function logout() {
    await api<{ ok: boolean }>("/auth/logout", { method: "POST" }).catch(() => undefined);
    router.replace("/login");
  }

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
        <Stat value={`Уровень ${user.level}`} label={`${user.xp} XP · за завершённые уроки`} />
        <div className="rounded-2xl bg-[#15171c] text-white p-4">
          <strong className="font-[family-name:var(--font-display)] text-2xl block text-[#ff9d3d]">🔥 {user.current_streak}</strong>
          <span className="text-[11.5px] text-white/55">дней подряд · рекорд {user.longest_streak}</span>
        </div>
        <Stat
          value={user.arena_score !== null ? `${user.arena_score}%` : "—"}
          label={user.arena_score !== null ? "Arena Score · средний результат турниров" : "Заверши турнир, чтобы получить Arena Score"}
        />
        <Stat value={`${finishedTournaments}`} label="турниров завершено" />
      </div>

      <ActivityCalendar activity={activity} />

      <div className="grid md:grid-cols-[1.3fr_1fr] gap-3.5 mb-3.5">
        <div className="rounded-[20px] bg-white border border-[rgba(21,23,28,.07)] p-5">
          <p className="text-[#6b6f76] text-[10.5px] font-bold tracking-[.1em] uppercase mb-3.5">Текущий трек</p>
          <h3 className="text-[16px] font-extrabold mb-1">{track.title}</h3>
          <p className="text-[12.5px] text-[#6b6f76] leading-relaxed mb-3">
            {track.total_lessons} уроков: от основ AI до ответственного использования технологий
          </p>
          <div className="h-2 rounded-full bg-[rgba(21,23,28,.1)]">
            <span className="block h-full rounded-full bg-[#16a34a]" style={{ width: `${track.progress_percent}%` }} />
          </div>
        </div>
        <div className="rounded-[20px] bg-white border border-[rgba(21,23,28,.07)] p-5">
          <div className="flex items-center justify-between gap-3 mb-3.5">
            <p className="text-[#6b6f76] text-[10.5px] font-bold tracking-[.1em] uppercase">Настройки</p>
            <span className="text-[10px] font-bold text-[#6b6f76] bg-[#f6f4ee] rounded-full px-2 py-1">Скоро</span>
          </div>
          <div className="grid gap-2.5">
            {settings.map((setting) => (
              <div key={setting.id} className="flex justify-between items-center gap-3">
                <span id={`${setting.id}-label`} className="text-[12.5px]">{setting.label}</span>
                <button
                  type="button"
                  role="switch"
                  aria-checked={setting.on}
                  aria-labelledby={`${setting.id}-label`}
                  disabled
                  title="Настройка пока недоступна"
                  className="w-9 h-5 rounded-full relative inline-block shrink-0 disabled:cursor-not-allowed disabled:opacity-65"
                  style={{ background: setting.on ? "#16a34a" : "rgba(21,23,28,.12)" }}
                >
                  <span aria-hidden="true" className="absolute top-0.5 w-4 h-4 rounded-full bg-white" style={setting.on ? { right: "2px" } : { left: "2px" }} />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex gap-2.5 flex-wrap">
        <Link href="/app/dashboard" className="inline-flex items-center h-11 px-5 rounded-full bg-[#15171c] text-white font-bold text-[13.5px] hover:opacity-85 transition-opacity">
          Кабинет
        </Link>
        <button
          type="button"
          onClick={logout}
          className="inline-flex items-center h-11 px-5 rounded-full border border-[rgba(21,23,28,.14)] font-bold text-[13.5px] text-[#6b6f76] hover:bg-[#f6f4ee] transition-colors"
        >
          Выйти
        </button>
      </div>
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

function ActivityCalendar({ activity }: { activity: ActivityDay[] }) {
  const firstDate = activity[0] ? new Date(`${activity[0].date}T00:00:00`) : null;
  const leadingDays = firstDate ? (firstDate.getDay() + 6) % 7 : 0;
  const cells: Array<ActivityDay | null> = [...Array.from({ length: leadingDays }, () => null), ...activity];
  const weekCount = Math.ceil(cells.length / 7);
  const monthMarkers = activity.reduce<Array<{ label: string; column: number }>>((markers, day, index) => {
    const date = new Date(`${day.date}T00:00:00`);
    const previous = index > 0 ? new Date(`${activity[index - 1].date}T00:00:00`) : null;
    if (!previous || previous.getMonth() !== date.getMonth()) {
      markers.push({ label: date.toLocaleDateString("ru-RU", { month: "short" }).replace(".", ""), column: Math.floor((leadingDays + index) / 7) + 1 });
    }
    return markers;
  }, []);
  const totalActions = activity.reduce((sum, day) => sum + day.count, 0);
  const activeDays = activity.filter((day) => day.count > 0).length;

  return (
    <section className="mb-3.5 rounded-[20px] border border-[rgba(21,23,28,.07)] bg-white p-5 sm:p-6">
      <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-[10.5px] font-bold uppercase tracking-[.1em] text-[#6b6f76]">Активность за год</p>
          <p className="mt-1.5 text-[12.5px] text-[#6b6f76]">Уроки, практика и турниры по дням</p>
        </div>
        <div className="flex gap-5 text-right">
          <div><strong className="block text-[18px]">{totalActions}</strong><span className="text-[10.5px] text-[#6b6f76]">действий</span></div>
          <div><strong className="block text-[18px] text-[#16a34a]">{activeDays}</strong><span className="text-[10.5px] text-[#6b6f76]">активных дней</span></div>
        </div>
      </div>
      <div className="overflow-x-auto pb-1">
        <div className="w-max">
          <div
            className="mb-2 grid text-[10px] text-[#9a978f]"
            style={{ gridTemplateColumns: `repeat(${weekCount}, 11px)`, columnGap: "3px" }}
          >
            {monthMarkers.map((month) => <span key={`${month.label}-${month.column}`} className="whitespace-nowrap" style={{ gridColumnStart: month.column }}>{month.label}</span>)}
          </div>
          <div
            className="grid w-max grid-flow-col grid-rows-7 gap-[3px]"
            aria-label={`Активность за год: ${totalActions} действий за ${activeDays} дней`}
          >
            {cells.map((day, index) => (
              <span
                key={day?.date ?? `empty-${index}`}
                title={day ? `${day.date}: ${day.count} действий` : undefined}
                aria-hidden="true"
                className="h-[11px] w-[11px] rounded-[3px]"
                style={{ background: activityColor(day?.count ?? 0), visibility: day ? "visible" : "hidden" }}
              />
            ))}
          </div>
        </div>
      </div>
      <div className="mt-3 flex items-center justify-end gap-1 text-[10px] text-[#9a978f]">
        <span className="mr-1">Меньше</span>
        {[0, 1, 2, 4].map((count) => <span key={count} aria-hidden="true" className="h-[11px] w-[11px] rounded-[3px]" style={{ background: activityColor(count) }} />)}
        <span className="ml-1">Больше</span>
      </div>
    </section>
  );
}

function activityColor(count: number) {
  if (count <= 0) return "rgba(21,23,28,.07)";
  if (count === 1) return "#bce8c9";
  if (count <= 3) return "#62c87d";
  return "#16a34a";
}
