"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

const dockItems = [
  { href: "/app/dashboard", label: "Обзор" },
  { href: "/app/track", label: "AI Track" },
  { href: "/app/practice", label: "Практика" },
  { href: "/app/tournament", label: "Арена" },
];

export default function AppShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen flex items-center justify-center px-6 pt-6 pb-14">
      <div className="relative w-full max-w-[1160px] h-[calc(100vh-48px)] max-h-[920px] bg-white rounded-[32px] border border-[rgba(21,23,28,.07)] shadow-[0_40px_90px_-50px_rgba(21,23,28,.45)] flex flex-col overflow-hidden">
        {/* header */}
        <div className="flex items-center justify-between gap-4 px-7 py-4.5 border-b border-[rgba(21,23,28,.07)] shrink-0">
          <Link href="/" className="flex items-center gap-2.5 hover:opacity-80 transition-opacity">
            <span className="w-8 h-8 rounded-[9px] bg-[#15171c] grid place-items-center text-[#ffb100] font-extrabold text-[13px] font-[family-name:var(--font-display)]">
              A
            </span>
            <strong className="text-[14.5px] tracking-tight">Arvexo Arena</strong>
          </Link>
          <div className="flex items-center gap-2.5">
            <div className="flex items-center gap-1.5 bg-[#15171c] text-white rounded-full py-1.5 px-3.5 text-xs font-bold">
              <span className="text-[#ff9d3d]">🔥</span> 6 дней
            </div>
            <div className="flex items-center gap-1.5 bg-[#f6f4ee] rounded-full py-1.5 px-3.5 text-xs font-bold">
              <span className="text-[#ffb100]">★</span> Уровень 4
            </div>
            <Link
              href="/app/profile"
              className="flex items-center gap-2 border-l border-[rgba(21,23,28,.08)] pl-3 hover:opacity-80 transition-opacity"
            >
              <span className="w-[30px] h-[30px] rounded-full bg-[#16a34a] text-white grid place-items-center font-bold text-[11.5px]">
                АК
              </span>
              <span className="text-[12.5px] font-semibold">Андрей</span>
            </Link>
          </div>
        </div>

        {/* workspace */}
        <div className="flex-1 overflow-y-auto px-10 pt-9 pb-19">
          <div className="max-w-[1000px] mx-auto">{children}</div>
        </div>

        {/* floating dock */}
        <nav className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-1 bg-[#15171c] rounded-full p-2 shadow-[0_16px_36px_-16px_rgba(21,23,28,.4)]">
          {dockItems.map((item) => {
            const active = pathname === item.href || pathname?.startsWith(item.href + "/");
            return (
              <Link
                key={item.href}
                href={item.href}
                className="py-2.5 px-5 rounded-full text-[13px] font-bold select-none transition-colors"
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
