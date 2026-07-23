"use client";

import Link from "next/link";
import { type CSSProperties, FormEvent, useEffect, useState } from "react";

import { ArvexoLogo } from "@/components/ArvexoLogo";
import { LandingMotionLayer } from "@/components/LandingMotion";

type GoalRecommendation = {
  title: string;
  copy: string;
  label: string;
  href: string;
};

const recommendations: Record<"track" | "practice" | "tournament", GoalRecommendation> = {
  track: {
    title: "Начни с AI Track",
    copy: "Короткий маршрут поможет собрать базу и перейти к практике.",
    label: "Открыть AI Track",
    href: "/tracks",
  },
  practice: {
    title: "Сначала собери профиль участника",
    copy: "После регистрации Arena откроет практику и сохранит твой результат.",
    label: "Начать бесплатно",
    href: "/app/practice",
  },
  tournament: {
    title: "Выбери ближайший турнир",
    copy: "Посмотри формат, темы и время старта, затем оцени готовность.",
    label: "Смотреть турниры",
    href: "/tournaments",
  },
};

const modes = [
  {
    label: "AI Track",
    title: "Разобраться в теме",
    copy: "Короткие уроки, примеры и задания по машинному обучению.",
    href: "/tracks",
  },
  {
    label: "Практика",
    title: "Проверить себя",
    copy: "Быстрые вопросы покажут, что повторить перед стартом.",
    href: "/app/practice",
  },
  {
    label: "Турниры",
    title: "Выступить на арене",
    copy: "Решай задачи на время и сохраняй результат в профиле.",
    href: "/tournaments",
  },
];

function recommendationFor(value: string) {
  const normalized = value.toLowerCase();
  if (normalized.includes("турнир") || normalized.includes("соревн")) return recommendations.tournament;
  if (normalized.includes("провер") || normalized.includes("задач") || normalized.includes("практи")) return recommendations.practice;
  return recommendations.track;
}

export default function Landing() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [goal, setGoal] = useState("");
  const [recommendation, setRecommendation] = useState<GoalRecommendation | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/auth/me", { credentials: "include" })
      .then((response) => {
        if (cancelled) return;
        setIsAuthenticated(response.ok);
      })
      .catch(() => undefined);
    return () => {
      cancelled = true;
    };
  }, []);

  const submitGoal = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const value = goal.trim();
    if (!value) return;
    setRecommendation(recommendationFor(value));
  };

  const selectGoal = (value: string) => {
    setGoal(value);
    setRecommendation(recommendationFor(value));
  };

  const appHref = (href: string) => (isAuthenticated ? href : "/login");

  return (
    <div className="landing-page min-h-dvh bg-[#f6f4ee] text-[#15171c]">
      <LandingMotionLayer />
      <a
        href="#main"
        className="fixed left-4 top-3 z-50 -translate-y-20 rounded-full bg-[#15171c] px-4 py-2 text-xs text-white focus:translate-y-0"
      >
        К содержанию
      </a>

      <header className="landing-header sticky top-0 z-40 border-b border-[rgba(21,23,28,.08)] bg-white/94 backdrop-blur-md">
        <div className="mx-auto flex min-h-[68px] w-[min(1180px,calc(100%-32px))] items-center gap-6">
          <Link href="/" aria-label="Arvexo Arena, главная" className="landing-brand mr-auto flex shrink-0 items-center gap-2.5">
            <ArvexoLogo markClassName="landing-brand-mark" />
          </Link>

          <nav aria-label="Основная навигация" className="hidden items-center gap-1 md:flex">
            <Link href="/tracks" className="landing-nav-link rounded-full px-3 py-2 text-[12.5px] font-medium text-[#5f636b] transition-colors hover:bg-[#f1f1ef] hover:text-[#15171c]">
              Треки
            </Link>
            <Link href="/tournaments" className="landing-nav-link rounded-full px-3 py-2 text-[12.5px] font-medium text-[#5f636b] transition-colors hover:bg-[#f1f1ef] hover:text-[#15171c]">
              Турниры
            </Link>
          </nav>

          <Link
            href={isAuthenticated ? "/app/dashboard" : "/login"}
            className="inline-flex h-10 shrink-0 items-center rounded-full bg-[#15171c] px-5 text-[12.5px] font-medium text-white transition-transform hover:-translate-y-px focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#15171c] active:scale-[.98]"
          >
            {isAuthenticated ? "Кабинет" : "Войти"}
          </Link>
        </div>
      </header>

      <main id="main">
        <section className="mx-auto flex min-h-[calc(100dvh-68px)] w-[min(920px,calc(100%-32px))] flex-col items-center justify-center py-16 sm:py-20">
          <div className="landing-hero-copy max-w-[880px] text-center" data-landing-reveal>
            <h1 className="text-balance text-[clamp(46px,7.2vw,104px)] font-medium leading-[.96] tracking-[-.065em]">
              <span className="landing-hero-word" style={{ "--word-index": 0 } as CSSProperties}>К чему</span>{" "}
              <span className="landing-hero-word" style={{ "--word-index": 1 } as CSSProperties}>ты хочешь</span>{" "}
              <span className="landing-hero-word" style={{ "--word-index": 2 } as CSSProperties}>подготовиться?</span>
            </h1>
            <p className="mx-auto mt-6 max-w-[610px] text-[clamp(15px,1.5vw,19px)] leading-relaxed text-[#5f636b]">
              Опиши цель. Arena предложит урок, практику или ближайший турнир.
            </p>
          </div>

          <form onSubmit={submitGoal} className="landing-goal-form mt-11 w-full max-w-[760px] sm:mt-12" data-landing-reveal>
            <label htmlFor="learning-goal" className="mb-2.5 ml-4 block text-[12.5px] font-medium text-[#5f636b]">
              Спроси Arena
            </label>
            <div className="landing-goal-composer grid grid-cols-[minmax(0,1fr)_44px] items-end gap-3 rounded-[28px] border border-[rgba(21,23,28,.16)] bg-white p-4 pl-5 shadow-[0_18px_48px_-38px_rgba(21,23,28,.35)] transition-colors focus-within:border-[#5ca959]">
              <textarea
                id="learning-goal"
                name="learning_goal"
                rows={2}
                value={goal}
                onChange={(event) => setGoal(event.target.value)}
                placeholder="Например: хочу понять классификацию и проверить себя"
                required
                className="min-h-[54px] max-h-[150px] resize-y bg-transparent text-[15px] leading-relaxed text-[#15171c] outline-none placeholder:text-[#8b8f94]"
              />
              <button
                type="submit"
                aria-label="Подобрать следующий шаг"
                className="landing-submit grid h-11 w-11 place-items-center rounded-full bg-[#74bd70] text-lg font-medium text-[#102011] transition-transform hover:-translate-y-px focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#3f7e3d] active:scale-[.96]"
              >
                →
              </button>
            </div>

            <div aria-label="Примеры целей" className="mt-3.5 flex flex-wrap justify-center gap-2">
              {[
                "Разобраться в машинном обучении",
                "Проверить знания перед турниром",
                "Найти ближайший турнир",
              ].map((value, index) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => selectGoal(value)}
                  className="landing-goal-suggestion min-h-[38px] rounded-full border border-[rgba(21,23,28,.1)] bg-transparent px-4 text-[12px] text-[#5f636b] transition-colors hover:border-[rgba(21,23,28,.18)] hover:bg-white hover:text-[#15171c] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#5ca959]"
                >
                  {index === 0 ? "Разобраться в ML" : index === 1 ? "Проверить себя" : "Выбрать турнир"}
                </button>
              ))}
            </div>

            {recommendation && (
              <div key={recommendation.href} aria-live="polite" className="landing-recommendation mt-3.5 grid items-center gap-5 rounded-[22px] border border-[#78b875] bg-[#edf4eb] p-5 text-left sm:grid-cols-[minmax(0,1fr)_auto]">
                <div>
                  <span className="text-[11px] font-semibold text-[#377236]">Следующий шаг</span>
                  <strong className="mt-1 block text-[15px] font-semibold">{recommendation.title}</strong>
                  <p className="mt-1 text-[12.5px] leading-relaxed text-[#5f636b]">{recommendation.copy}</p>
                </div>
                <Link href={recommendation.href.startsWith("/app/") ? appHref(recommendation.href) : recommendation.href} className="inline-flex h-11 items-center justify-center rounded-full bg-[#15171c] px-5 text-[12.5px] font-medium text-white transition-transform hover:-translate-y-px active:scale-[.98]">
                  {recommendation.label}
                </Link>
              </div>
            )}
          </form>
        </section>

        <section id="tracks" className="mx-auto w-[min(1120px,calc(100%-32px))] scroll-mt-24 py-24 sm:py-32" aria-labelledby="actions-title">
          <h2 id="actions-title" className="max-w-[760px] text-balance text-[clamp(38px,5vw,76px)] font-medium leading-[.98] tracking-[-.055em]" data-landing-reveal>
            Что можно сделать сейчас
          </h2>
          <div className="landing-mode-list mt-12 border-t border-[rgba(21,23,28,.16)]" data-landing-reveal>
            {modes.map((mode) => (
              <Link
                key={mode.label}
                href={mode.href.startsWith("/app/") ? appHref(mode.href) : mode.href}
                className="landing-mode-row group grid min-h-[126px] items-center gap-5 border-b border-[rgba(21,23,28,.1)] py-6 hover:bg-white md:grid-cols-[140px_minmax(220px,.75fr)_minmax(260px,1fr)_28px] md:gap-7"
              >
                <span className="text-[12px] text-[#72767d]">{mode.label}</span>
                <strong className="text-[20px] font-medium tracking-[-.025em]">{mode.title}</strong>
                <p className="text-[13.5px] leading-relaxed text-[#5f636b]">{mode.copy}</p>
                <i aria-hidden="true" className="hidden text-[#72767d] not-italic transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-[#4f964c] md:block">
                  ↗
                </i>
              </Link>
            ))}
          </div>
        </section>

        <section id="tournament" className="mx-auto w-[min(1120px,calc(100%-32px))] scroll-mt-24 py-24 sm:py-32" aria-labelledby="tournament-title">
          <article className="landing-tournament grid min-h-[580px] overflow-hidden rounded-[28px] border border-[rgba(21,23,28,.1)] bg-[#e8f1e5] lg:grid-cols-[minmax(0,1.3fr)_minmax(320px,.7fr)]" data-landing-reveal>
            <div className="flex min-h-[500px] flex-col items-start p-8 sm:p-14 lg:p-[72px]">
              <span className="text-[12px] font-medium text-[#377236]">Ближайший турнир</span>
              <h2 id="tournament-title" className="mt-auto max-w-[750px] text-balance text-[clamp(48px,6vw,96px)] font-medium leading-[.92] tracking-[-.07em]">
                AI Sprint: классификация данных
              </h2>
              <p className="mt-6 max-w-[560px] text-[14px] leading-relaxed text-[#5f636b]">
                Личный зачёт, 60 минут. Подготовься в AI Track и проверь знания перед стартом.
              </p>
              <Link href="/tournaments" className="mt-7 inline-flex h-11 items-center rounded-full bg-[#15171c] px-5 text-[12.5px] font-medium text-white transition-transform hover:-translate-y-px active:scale-[.98]">
                Открыть турнир
              </Link>
            </div>
            <dl className="grid content-end border-t border-[rgba(21,23,28,.1)] bg-white/65 p-8 lg:border-l lg:border-t-0">
              {[
                ["Старт", "Воскресенье, 18:00"],
                ["Формат", "Личный зачёт"],
                ["Темы", "Данные, модели, метрики"],
              ].map(([term, value]) => (
                <div key={term} className="landing-tournament-fact border-b border-[rgba(21,23,28,.1)] py-5 last:border-b-0">
                  <dt className="text-[11px] text-[#72767d]">{term}</dt>
                  <dd className="mt-2 text-[14px] font-medium">{value}</dd>
                </div>
              ))}
            </dl>
          </article>
        </section>

        <section className="mx-auto w-[min(1120px,calc(100%-32px))] py-24 sm:py-32" aria-labelledby="profile-title">
          <div className="landing-profile-story grid gap-14 border-t border-[rgba(21,23,28,.16)] pt-14 lg:grid-cols-[minmax(0,1fr)_minmax(380px,.8fr)] lg:gap-28" data-landing-reveal>
            <div>
              <h2 id="profile-title" className="text-balance text-[clamp(38px,5vw,76px)] font-medium leading-[.98] tracking-[-.055em]">
                Весь прогресс в одном профиле
              </h2>
              <p className="mt-6 max-w-[560px] text-[14px] leading-relaxed text-[#5f636b]">
                Продолжай с того места, где остановился. Результаты уроков, практики и турниров остаются рядом.
              </p>
              <Link href={isAuthenticated ? "/app/dashboard" : "/login"} className="mt-8 inline-flex items-center gap-3 text-[13px] font-medium text-[#377e3a]">
                Открыть обзор <span aria-hidden="true">↗</span>
              </Link>
            </div>
            <ul className="list-none">
              {[
                ["Уроки", "Видно, что пройти дальше"],
                ["Практика", "Понятно, какие темы повторить"],
                ["Турниры", "Результаты сохраняются в профиле"],
              ].map(([label, value], index) => (
                <li key={label} className={`landing-profile-item border-b border-[rgba(21,23,28,.1)] py-6 ${index === 0 ? "pt-0" : ""}`}>
                  <span className="block text-[11px] text-[#72767d]">{label}</span>
                  <strong className="mt-2 block text-[14px] font-medium">{value}</strong>
                </li>
              ))}
            </ul>
          </div>
        </section>

      </main>

      <footer className="mt-10 border-t border-[rgba(21,23,28,.1)]">
        <div className="mx-auto flex min-h-[140px] w-[min(1180px,calc(100%-32px))] flex-col justify-center gap-3 py-8 text-[12px] text-[#72767d] sm:flex-row sm:items-center sm:justify-between">
          <Link href="/" className="flex items-center gap-2.5 text-[#15171c]">
            <ArvexoLogo />
          </Link>
          <span>AI-обучение и соревнования для школьников</span>
        </div>
      </footer>
    </div>
  );
}
