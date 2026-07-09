import type { ReactNode } from "react";

export function Eyebrow({ children, color = "#16a34a" }: { children: ReactNode; color?: string }) {
  return (
    <p
      className="text-[11px] font-bold tracking-[.12em] uppercase mb-2"
      style={{ color }}
    >
      {children}
    </p>
  );
}

export function Card({
  children,
  className = "",
  dark = false,
}: {
  children: ReactNode;
  className?: string;
  dark?: boolean;
}) {
  return (
    <div
      className={`rounded-[24px] p-6 shadow-[0_14px_36px_-32px_rgba(21,23,28,.3)] ${
        dark ? "bg-[#15171c] text-white" : "bg-white border border-[rgba(21,23,28,.07)]"
      } ${className}`}
    >
      {children}
    </div>
  );
}
