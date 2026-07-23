"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

import { LandingMotionLayer } from "@/components/LandingMotion";
import { PublicCatalogChrome } from "@/components/PublicCatalogChrome";
import { api, formatDateTime, type PublicTournament } from "@/lib/api";

const groupMeta = {
  active: { title: "Идут сейчас", description: "Можно присоединиться и начать попытку.", badge: "сейчас" },
  upcoming: { title: "Скоро", description: "Посмотри формат и подготовься заранее.", badge: "скоро" },
  finished: { title: "Завершённые", description: "Прошедшие соревнования остаются в истории Arena.", badge: "завершён" },
} as const;

export default function PublicTournamentsPage() {
  const [tournaments, setTournaments] = useState<PublicTournament[]>([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    Promise.all([
      api<PublicTournament[]>("/catalog/tournaments"),
      fetch("/api/auth/me", { credentials: "include" }).then((response) => response.ok).catch(() => false),
    ])
      .then(([items, authenticated]) => {
        if (cancelled) return;
        setTournaments(items);
        setIsAuthenticated(authenticated);
      })
      .catch((reason) => {
        if (!cancelled) setError(reason instanceof Error ? reason.message : "Не удалось загрузить турниры");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const groups = useMemo(
    () => (["active", "upcoming", "finished"] as const).map((status) => ({ status, items: tournaments.filter((item) => item.status === status) })).filter((group) => group.items.length > 0),
    [tournaments],
  );

  return (
    <PublicCatalogChrome active="tournaments" isAuthenticated={isAuthenticated}>
      <LandingMotionLayer />
      <section className="mx-auto grid min-h-[410px] w-[min(1120px,calc(100%-32px))] items-end gap-10 py-12 sm:py-16 lg:grid-cols-[minmax(0,1fr)_260px]">
        <div data-landing-reveal>
          <h1 className="max-w-[760px] text-balance text-[clamp(44px,6vw,76px)] font-medium leading-[.96] tracking-[-.06em]">Турниры на твоём горизонте</h1>
          <p className="mt-6 max-w-[610px] text-[15px] leading-relaxed text-[#5f636b] sm:text-[17px]">Даты, темы и формат видны без регистрации. Профиль понадобится только для участия и сохранения результата.</p>
        </div>
        <div className="border-t border-[rgba(21,23,28,.16)] pt-5 lg:border-l lg:border-t-0 lg:pl-7" data-landing-reveal>
          <strong className="block text-[52px] font-medium leading-none tracking-[-.06em]">{loading ? "—" : tournaments.filter((item) => item.status !== "finished").length}</strong>
          <span className="mt-2 block text-[12px] text-[#72767d]">актуальных турниров</span>
        </div>
      </section>

      <section className="mx-auto w-[min(1120px,calc(100%-32px))] pb-10" aria-label="Каталог турниров">
        {loading && [0, 1].map((item) => <div key={item} className="h-[260px] animate-pulse border-t border-[rgba(21,23,28,.1)] bg-white/30" />)}
        {error && <div className="border-t border-[#d8a39e] py-10 text-[14px] text-[#9f2d23]">{error}</div>}
        {!loading && !error && groups.length === 0 && (
          <div className="border-t border-[rgba(21,23,28,.16)] py-16">
            <h2 className="text-[28px] font-medium tracking-[-.035em]">Турниры пока не объявлены</h2>
            <p className="mt-3 max-w-[520px] text-[14px] leading-relaxed text-[#5f636b]">Можно начать подготовку в одном из открытых треков.</p>
            <Link href="/tracks" className="mt-6 inline-flex h-11 items-center rounded-full bg-[#15171c] px-5 text-[12.5px] font-medium text-white">Смотреть треки</Link>
          </div>
        )}
        {!loading && !error && groups.map((group) => (
          <div key={group.status} className="mb-16" data-landing-reveal>
            <div className="grid gap-2 border-t border-[rgba(21,23,28,.16)] py-5 sm:grid-cols-[180px_1fr]">
              <h2 className="text-[20px] font-medium">{groupMeta[group.status].title}</h2>
              <p className="text-[12.5px] text-[#72767d]">{groupMeta[group.status].description}</p>
            </div>
            {group.items.map((tournament) => (
              <article key={tournament.id} className={`grid gap-7 border-t border-[rgba(21,23,28,.1)] py-9 sm:py-11 lg:grid-cols-[minmax(0,1fr)_360px] ${group.status === "active" ? "bg-[#e8f1e5] px-5 sm:px-7" : ""}`}>
                <div>
                  <div className="flex flex-wrap items-center gap-3">
                    <span className={`rounded-full px-3 py-1 text-[10.5px] font-semibold ${group.status === "active" ? "bg-[#15171c] text-white" : "border border-[rgba(21,23,28,.12)] text-[#5f636b]"}`}>{groupMeta[group.status].badge}</span>
                    <span className="text-[11px] text-[#3f8240]">{tournament.track_title}</span>
                  </div>
                  <h3 className="mt-5 text-[clamp(28px,4vw,48px)] font-medium leading-[1.02] tracking-[-.045em]">{tournament.title}</h3>
                  <p className="mt-4 max-w-[650px] text-[13.5px] leading-relaxed text-[#5f636b]">{tournament.description}</p>
                </div>
                <div className="flex flex-col border-t border-[rgba(21,23,28,.1)] pt-5 lg:border-l lg:border-t-0 lg:pl-7 lg:pt-0">
                  <dl className="grid grid-cols-2 gap-x-6 gap-y-4 text-[11.5px]">
                    <div className="col-span-2"><dt className="text-[#72767d]">Период</dt><dd className="mt-1 font-medium">{formatDateTime(tournament.starts_at)} — {formatDateTime(tournament.ends_at)}</dd></div>
                    <div><dt className="text-[#72767d]">Время</dt><dd className="mt-1 font-medium">{tournament.duration_minutes} мин</dd></div>
                    <div><dt className="text-[#72767d]">Заданий</dt><dd className="mt-1 font-medium">{tournament.question_count}</dd></div>
                  </dl>
                  <Link href={isAuthenticated ? "/app/tournament" : "/login"} className="mt-7 inline-flex h-11 w-fit items-center rounded-full bg-[#15171c] px-5 text-[12.5px] font-medium text-white transition-transform hover:-translate-y-px active:scale-[.98]">
                    {isAuthenticated ? "Открыть арену" : "Войти для участия"}
                  </Link>
                </div>
              </article>
            ))}
          </div>
        ))}
      </section>
    </PublicCatalogChrome>
  );
}
