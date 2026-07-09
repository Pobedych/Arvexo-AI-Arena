"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import type { ReactNode } from "react";
import { api, type ApiUser } from "@/lib/api";

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
    api<ApiUser>("/auth/me").then(setUser).catch(() => undefined);
  }, []);

  const displayName = user?.display_name ?? "Пользователь";
  const initials = displayName
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();

  return (
    <div className="min-h-screen flex items-center justify-center sm:px-6 sm:pt-6 sm:pb-14">
      <div className="relative w-full max-w-[1160px] h-screen sm:h-[calc(100vh-48px)] sm:max-h-[920px] bg-white sm:rounded-[32px] border-0 sm:border border-[rgba(21,23,28,.07)] shadow-none sm:shadow-[0_40px_90px_-50px_rgba(21,23,28,.45)] flex flex-col overflow-hidden">
        {/* header */}
        <div className="flex items-center justify-between gap-2 px-4 sm:px-7 py-3 sm:py-4.5 border-b border-[rgba(21,23,28,.07)] shrink-0">
          <Link href="/" className="flex items-center gap-2 sm:gap-2.5 hover:opacity-80 transition-opacity shrink-0">
            <span className="w-8 h-8 rounded-[9px] bg-[#15171c] grid place-items-center text-[#ffb100] font-extrabold text-[13px] font-[family-name:var(--font-display)]">
              A
            </span>
            <strong className="hidden sm:inline text-[14.5px] tracking-tight whitespace-nowrap">Arvexo Arena</strong>
          </Link>
          <div className="flex items-center gap-1.5 sm:gap-2.5 min-w-0">
            <div className="hidden md:flex items-center gap-1.5 bg-[#15171c] text-white rounded-full py-1.5 px-3.5 text-xs font-bold whitespace-nowrap">
              <span className="text-[#ff9d3d]">🔥</span> 6 дней
            </div>
            <div className="hidden md:flex items-center gap-1.5 bg-[#f6f4ee] rounded-full py-1.5 px-3.5 text-xs font-bold whitespace-nowrap">
              <span className="text-[#ffb100]">★</span> Уровень 4
            </div>
            <Link
              href="/app/profile"
              className="flex items-center gap-2 md:border-l border-[rgba(21,23,28,.08)] pl-0 md:pl-3 hover:opacity-80 transition-opacity min-w-0"
            >
              <span className="w-[30px] h-[30px] rounded-full bg-[#16a34a] text-white grid place-items-center font-bold text-[11.5px] shrink-0">
                {initials || "A"}
              </span>
              <span className="hidden sm:inline text-[12.5px] font-semibold truncate max-w-[120px]">{displayName}</span>
            </Link>
          </div>
        </div>

        {/* workspace */}
        <div className="flex-1 overflow-y-auto px-4 sm:px-10 pt-5 sm:pt-9 pb-24 sm:pb-19">
          <div className="max-w-[1000px] mx-auto">{children}</div>
        </div>

        {/* floating dock */}
        <nav className="absolute bottom-3 sm:bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-0.5 sm:gap-1 bg-[#15171c] rounded-full p-1.5 sm:p-2 shadow-[0_16px_36px_-16px_rgba(21,23,28,.4)] max-w-[calc(100%-24px)] overflow-x-auto">
          {dockItems.map((item) => {
            const active = pathname === item.href || pathname?.startsWith(item.href + "/");
            return (
              <Link
                key={item.href}
                href={item.href}
                className="py-2 sm:py-2.5 px-3 sm:px-5 rounded-full text-[11.5px] sm:text-[13px] font-bold select-none transition-colors whitespace-nowrap"
                style={{
                  color: active ? "#15171c" : "rgba(255,255,255,.6)",
                  background: active ? "#ffb100" : "transparent",
                }}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
