import Link from "next/link";
import type { ReactNode } from "react";

export function ErrorScene({
  code,
  glyph,
  title,
  subtitle,
  primaryHref,
  primaryLabel,
  secondaryHref,
  secondaryLabel,
  extra,
}: {
  code: string;
  glyph: string;
  title: string;
  subtitle: string;
  primaryHref: string;
  primaryLabel: string;
  secondaryHref?: string;
  secondaryLabel?: string;
  extra?: ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#f6f4ee] flex items-center justify-center px-6 py-16">
      <div className="w-full max-w-[560px] text-center">
        <div className="inline-flex items-center gap-2 bg-white border border-[rgba(21,23,28,.08)] rounded-full py-1.5 px-4 text-[11px] font-bold tracking-[.1em] uppercase text-[#6b6f76] mb-7">
          <span>{glyph}</span> Arvexo Arena
        </div>
        <strong className="font-[family-name:var(--font-display)] text-[clamp(72px,14vw,132px)] font-semibold leading-none block mb-2 text-[#15171c]">
          {code}
        </strong>
        <h1 className="font-[family-name:var(--font-display)] text-[clamp(21px,3vw,28px)] font-semibold tracking-[-.02em] mb-3 max-w-[460px] mx-auto">
          {title}
        </h1>
        <p className="text-[14px] text-[#6b6f76] leading-relaxed max-w-[440px] mx-auto mb-8">{subtitle}</p>
        {extra}
        <div className="flex gap-2.5 justify-center flex-wrap">
          <Link
            href={primaryHref}
            className="inline-flex items-center h-12 px-6 rounded-full bg-[#16a34a] text-white font-bold text-[14px] shadow-[0_14px_28px_-14px_rgba(22,163,74,.5)] hover:opacity-87 transition-opacity"
          >
            {primaryLabel}
          </Link>
          {secondaryHref && secondaryLabel && (
            <Link
              href={secondaryHref}
              className="inline-flex items-center h-12 px-6 rounded-full border border-[rgba(21,23,28,.14)] font-bold text-[14px] text-[#15171c] hover:bg-white transition-colors"
            >
              {secondaryLabel}
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
