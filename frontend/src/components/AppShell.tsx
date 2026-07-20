"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";
import { ArvexoLogo } from "@/components/ArvexoLogo";
import { api, STREAK_UPDATED_EVENT, type ApiUser } from "@/lib/api";

function streakLabel(days: number) {
  const mod10 = days % 10;
  const mod100 = days % 100;
  if (mod10 === 1 && mod100 !== 11) return "день";
  if ([2, 3, 4].includes(mod10) && ![12, 13, 14].includes(mod100)) return "дня";
  return "дней";
}

const dockItems = [
  { href: "/app/dashboard", label: "Обзор" },
  { href: "/app/track", label: "AI Track" },
  { href: "/app/practice", label: "Практика" },
  { href: "/app/tournament", label: "Арена" },
];

export default function AppShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const [user, setUser] = useState<ApiUser | null>(null);
  const streakDetailsRef = useRef<HTMLDetailsElement>(null);
  const levelDetailsRef = useRef<HTMLDetailsElement>(null);

  useEffect(() => {
    let cancelled = false;
    const refreshUser = () => {
      api<ApiUser>("/auth/me")
        .then((userData) => {
          if (!cancelled) setUser(userData);
        })
        .catch(() => undefined);
    };

    refreshUser();
    window.addEventListener(STREAK_UPDATED_EVENT, refreshUser);
    return () => {
      cancelled = true;
      window.removeEventListener(STREAK_UPDATED_EVENT, refreshUser);
    };
  }, [pathname]);

  useEffect(() => {
    const closeHeaderPanels = (event: PointerEvent) => {
      const target = event.target as Node;
      [streakDetailsRef.current, levelDetailsRef.current].forEach((details) => {
        if (details?.open && !details.contains(target)) details.open = false;
      });
    };

    document.addEventListener("pointerdown", closeHeaderPanels);
    return () => document.removeEventListener("pointerdown", closeHeaderPanels);
  }, []);

  const displayName = user?.display_name ?? "Пользователь";
  const initials = displayName
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
  const xpPerLevel = 30;
  const levelXp = user ? user.xp % xpPerLevel : 0;
  const xpToNextLevel = xpPerLevel - levelXp;
  const levelProgress = Math.round((levelXp / xpPerLevel) * 100);

  return (
    <div className="min-h-dvh bg-[#f6f4ee] flex flex-col">
      {/* header */}
      <div className="sticky top-0 z-20 flex items-center justify-between gap-2 px-4 sm:px-7 py-3 sm:py-4.5 border-b border-[rgba(21,23,28,.07)] bg-white">
        <Link href="/" className="flex items-center gap-2 sm:gap-2.5 hover:opacity-80 transition-opacity shrink-0">
          <ArvexoLogo wordmarkClassName="hidden sm:inline" />
        </Link>
        <div className="flex items-center gap-1.5 sm:gap-2.5 min-w-0">
          {user && (
            <details ref={streakDetailsRef} name="header-progress" className="group relative block">
              <summary
                aria-label="Подробнее о серии занятий"
                className="flex cursor-pointer list-none items-center gap-1.5 rounded-full bg-[#15171c] px-3.5 py-1.5 text-xs font-medium text-white whitespace-nowrap transition-transform hover:-translate-y-px focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#16a34a] active:scale-[.98] [&::-webkit-details-marker]:hidden"
              >
                <span aria-hidden="true" className={user.streak_extended_today ? "text-[#74bd70]" : "text-white/45"}>
                  ↗
                </span>
                {user.current_streak} {streakLabel(user.current_streak)}
              </summary>
              <div className="absolute right-0 top-[calc(100%+10px)] z-30 w-[300px] rounded-[16px] border border-[rgba(21,23,28,.1)] bg-white p-4 text-[#15171c] shadow-[0_18px_48px_-28px_rgba(21,23,28,.35)]">
                <strong className="block text-[14px] font-semibold">Серия занятий</strong>
                <p className="mt-1 text-[11.5px] leading-relaxed text-[#6b6f76]">
                  Урок, практика или турнир засчитываются как активный день.
                </p>
                <div className="mt-4 grid grid-cols-2 gap-2">
                  <div className="rounded-[12px] bg-[#eef5ec] p-3">
                    <span className="block text-[10px] text-[#5b6558]">Сейчас</span>
                    <strong className="mt-1 block text-[18px] font-semibold text-[#2f742d]">
                      {user.current_streak} {streakLabel(user.current_streak)}
                    </strong>
                  </div>
                  <div className="rounded-[12px] bg-[#f6f4ee] p-3">
                    <span className="block text-[10px] text-[#6b6f76]">Лучший результат</span>
                    <strong className="mt-1 block text-[18px] font-semibold">
                      {user.longest_streak} {streakLabel(user.longest_streak)}
                    </strong>
                  </div>
                </div>
                <p
                  className={`mt-3 rounded-[10px] px-3 py-2 text-[11.5px] leading-relaxed ${
                    user.streak_extended_today ? "bg-[#e7f3e4] text-[#2f742d]" : "bg-[#f6f4ee] text-[#6b6f76]"
                  }`}
                >
                  {user.streak_extended_today ? "Сегодня серия уже продлена." : "Сегодня серия ещё не продлена."}
                </p>
                <Link
                  href="/app/profile"
                  className="mt-3 inline-flex min-h-9 items-center text-[11.5px] font-semibold text-[#2f742d] hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#16a34a]"
                >
                  Посмотреть активность
                </Link>
              </div>
            </details>
          )}
          {user && (
            <details ref={levelDetailsRef} name="header-progress" className="group relative block">
              <summary
                aria-label="Подробнее об уровне"
                className="flex cursor-pointer list-none items-center gap-1.5 rounded-full bg-[#eff5ed] px-3.5 py-1.5 text-xs font-medium whitespace-nowrap transition-transform hover:-translate-y-px focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#16a34a] active:scale-[.98] [&::-webkit-details-marker]:hidden"
              >
                <span aria-hidden="true" className="text-[#52a24f]">★</span>
                Уровень {user.level}
              </summary>
              <div className="absolute right-0 top-[calc(100%+10px)] z-30 w-[300px] rounded-[16px] border border-[rgba(21,23,28,.1)] bg-white p-4 text-[#15171c] shadow-[0_18px_48px_-28px_rgba(21,23,28,.35)]">
                <strong className="block text-[14px] font-semibold">Уровень {user.level}</strong>
                <p className="mt-1 text-[11.5px] leading-relaxed text-[#6b6f76]">
                  Получай XP за завершённые уроки и повышай уровень подготовки.
                </p>
                <div className="mt-4 flex items-end justify-between gap-4">
                  <div>
                    <span className="block text-[10px] text-[#6b6f76]">Всего заработано</span>
                    <strong className="mt-1 block text-[18px] font-semibold text-[#2f742d]">{user.xp} XP</strong>
                  </div>
                  <span className="text-right text-[10px] leading-relaxed text-[#6b6f76]">
                    Ещё {xpToNextLevel} XP<br />до уровня {user.level + 1}
                  </span>
                </div>
                <div
                  role="progressbar"
                  aria-label={`Прогресс до уровня ${user.level + 1}`}
                  aria-valuemin={0}
                  aria-valuemax={xpPerLevel}
                  aria-valuenow={levelXp}
                  className="mt-3 h-2 overflow-hidden rounded-full bg-[#e8e8e3]"
                >
                  <div className="h-full rounded-full bg-[#74bd70]" style={{ width: `${levelProgress}%` }} />
                </div>
                <Link
                  href="/app/profile"
                  className="mt-3 inline-flex min-h-9 items-center text-[11.5px] font-semibold text-[#2f742d] hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#16a34a]"
                >
                  Открыть профиль
                </Link>
              </div>
            </details>
          )}
          <Link
            href="/app/profile"
            className="flex items-center gap-2 md:border-l border-[rgba(21,23,28,.08)] pl-0 md:pl-3 hover:opacity-80 transition-opacity min-w-0"
          >
            <span className="w-[30px] h-[30px] rounded-full bg-[#52a24f] text-white grid place-items-center font-semibold text-[11.5px] shrink-0">
              {initials || "A"}
            </span>
            <span className="hidden sm:inline text-[12.5px] font-medium truncate max-w-[120px]">{displayName}</span>
          </Link>
        </div>
      </div>

      {/* workspace */}
      <div className="flex-1 px-4 sm:px-10 pt-5 sm:pt-9 pb-28 sm:pb-24">
        <div className="max-w-[1000px] mx-auto">{children}</div>
      </div>

      {/* floating dock */}
      <nav
        className="fixed left-1/2 -translate-x-1/2 z-30 flex items-center gap-0.5 sm:gap-1 bg-[#15171c]/90 backdrop-blur-md rounded-full p-1.5 sm:p-2 shadow-[0_16px_36px_-16px_rgba(21,23,28,.4)] max-w-[calc(100%-24px)] overflow-x-auto"
        style={{ bottom: "calc(env(safe-area-inset-bottom, 0px) + 0.75rem)" }}
      >
        {dockItems.map((item) => {
          const active = pathname === item.href || pathname?.startsWith(item.href + "/");
          return (
            <Link
              key={item.href}
              href={item.href}
              className="py-2 sm:py-2.5 px-3 sm:px-5 rounded-full text-[11.5px] sm:text-[13px] font-medium select-none transition-colors whitespace-nowrap"
              style={{
                color: active ? "#15171c" : "rgba(255,255,255,.6)",
                background: active ? "#74bd70" : "transparent",
              }}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
