"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import type { ReactNode } from "react";
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

  const displayName = user?.display_name ?? "Пользователь";
  const initials = displayName
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();

  return (
    <div className="min-h-dvh bg-[#f6f4ee] flex flex-col">
      {/* header */}
      <div className="sticky top-0 z-20 flex items-center justify-between gap-2 px-4 sm:px-7 py-3 sm:py-4.5 border-b border-[rgba(21,23,28,.07)] bg-white">
        <Link href="/" className="flex items-center gap-2 sm:gap-2.5 hover:opacity-80 transition-opacity shrink-0">
          <span className="w-8 h-8 rounded-[9px] bg-[#15171c] grid place-items-center text-[#74bd70] font-semibold text-[13px] font-[family-name:var(--font-display)]">
            A
          </span>
          <strong className="hidden sm:inline text-[14.5px] font-semibold tracking-tight whitespace-nowrap">Arvexo Arena</strong>
        </Link>
        <div className="flex items-center gap-1.5 sm:gap-2.5 min-w-0">
          {user && (
            <div className="hidden md:flex items-center gap-1.5 bg-[#15171c] text-white rounded-full py-1.5 px-3.5 text-xs font-medium whitespace-nowrap">
              <span
                aria-label={user.streak_extended_today ? "Серия продлена сегодня" : "Серия ещё не продлена сегодня"}
                className={user.streak_extended_today ? "text-[#74bd70]" : "text-white/35"}
                role="img"
              >
                ↗
              </span>{" "}
              {user.current_streak} {streakLabel(user.current_streak)}
            </div>
          )}
          {user && (
            <div className="hidden md:flex items-center gap-1.5 bg-[#eff5ed] rounded-full py-1.5 px-3.5 text-xs font-medium whitespace-nowrap">
              <span className="text-[#52a24f]">★</span> Уровень {user.level}
            </div>
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
