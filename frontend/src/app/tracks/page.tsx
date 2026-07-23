"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { LandingMotionLayer } from "@/components/LandingMotion";
import { PublicCatalogChrome } from "@/components/PublicCatalogChrome";
import { api, type PublicTrack } from "@/lib/api";

export default function PublicTracksPage() {
  const [tracks, setTracks] = useState<PublicTrack[]>([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    Promise.all([
      api<PublicTrack[]>("/catalog/tracks"),
      fetch("/api/auth/me", { credentials: "include" }).then((response) => response.ok).catch(() => false),
    ])
      .then(([items, authenticated]) => {
        if (cancelled) return;
        setTracks(items);
        setIsAuthenticated(authenticated);
      })
      .catch((reason) => {
        if (!cancelled) setError(reason instanceof Error ? reason.message : "Не удалось загрузить треки");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <PublicCatalogChrome active="tracks" isAuthenticated={isAuthenticated}>
      <LandingMotionLayer />
      <section className="mx-auto grid min-h-[410px] w-[min(1120px,calc(100%-32px))] items-end gap-10 py-12 sm:py-16 lg:grid-cols-[minmax(0,1fr)_220px]">
        <div data-landing-reveal>
          <h1 className="max-w-[760px] text-balance text-[clamp(44px,6vw,76px)] font-medium leading-[.96] tracking-[-.06em]">Выбери, чему научиться</h1>
          <p className="mt-6 max-w-[590px] text-[15px] leading-relaxed text-[#5f636b] sm:text-[17px]">Посмотри программу до регистрации. Уроки открываются последовательно, а прогресс сохраняется в профиле.</p>
        </div>
        <div className="border-t border-[rgba(21,23,28,.16)] pt-5 lg:border-l lg:border-t-0 lg:pl-7" data-landing-reveal>
          <strong className="block text-[52px] font-medium leading-none tracking-[-.06em]">{loading ? "—" : String(tracks.length).padStart(2, "0")}</strong>
          <span className="mt-2 block text-[12px] text-[#72767d]">доступных направления</span>
        </div>
      </section>

      <section className="mx-auto w-[min(1120px,calc(100%-32px))] pb-10" aria-label="Доступные треки">
        {loading && [0, 1].map((item) => <div key={item} className="h-[250px] animate-pulse border-t border-[rgba(21,23,28,.1)] bg-white/30" />)}
        {error && <div className="border-t border-[#d8a39e] py-10 text-[14px] text-[#9f2d23]">{error}</div>}
        {!loading && !error && tracks.length === 0 && (
          <div className="border-t border-[rgba(21,23,28,.16)] py-16">
            <h2 className="text-[28px] font-medium tracking-[-.035em]">Новые треки готовятся</h2>
            <p className="mt-3 max-w-[520px] text-[14px] leading-relaxed text-[#5f636b]">Загляни позже — здесь появятся опубликованные программы обучения.</p>
          </div>
        )}
        {!loading && !error && tracks.map((track, index) => (
          <article key={track.id} className="grid gap-7 border-t border-[rgba(21,23,28,.16)] py-10 sm:py-14 lg:grid-cols-[70px_minmax(0,1fr)_260px]" data-landing-reveal>
            <span className="font-mono text-[12px] text-[#72767d]">{String(index + 1).padStart(2, "0")}</span>
            <div>
              <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                <h2 className="text-[clamp(30px,4vw,54px)] font-medium leading-none tracking-[-.05em]">{track.title}</h2>
                <span className="text-[11px] font-semibold uppercase tracking-[.1em] text-[#3f8240]">открыт</span>
              </div>
              <p className="mt-5 max-w-[650px] text-[14px] leading-relaxed text-[#5f636b]">{track.description}</p>
              <div className="mt-6 flex flex-wrap gap-2">
                {track.sections.map((section) => (
                  <span key={section.title} className="rounded-full border border-[rgba(21,23,28,.1)] bg-white/60 px-3 py-1.5 text-[11px] text-[#5f636b]">
                    {section.title} · {section.lesson_count}
                  </span>
                ))}
              </div>
            </div>
            <div className="flex flex-col items-start border-t border-[rgba(21,23,28,.1)] pt-5 lg:border-l lg:border-t-0 lg:pl-7 lg:pt-0">
              <div className="grid grid-cols-2 gap-7">
                <div><strong className="block text-[26px] font-medium">{track.lesson_count}</strong><span className="text-[11px] text-[#72767d]">уроков</span></div>
                <div><strong className="block text-[26px] font-medium">{track.section_count}</strong><span className="text-[11px] text-[#72767d]">раздела</span></div>
              </div>
              <Link href={isAuthenticated ? "/onboarding" : "/login"} className="mt-8 inline-flex h-11 items-center rounded-full bg-[#15171c] px-5 text-[12.5px] font-medium text-white transition-transform hover:-translate-y-px active:scale-[.98]">
                {isAuthenticated ? "Выбрать трек" : "Начать обучение"}
              </Link>
            </div>
          </article>
        ))}
      </section>
    </PublicCatalogChrome>
  );
}
