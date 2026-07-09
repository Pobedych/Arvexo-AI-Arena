"use client";

import Link from "next/link";
import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { api, type Tournament, type TournamentResult } from "@/lib/api";

export default function TournamentResultPage() {
  return (
    <Suspense fallback={<div className="text-sm text-[#6b6f76]">Загружаем результат...</div>}>
      <TournamentResultView />
    </Suspense>
  );
}

function TournamentResultView() {
  const search = useSearchParams();
  const [tournament, setTournament] = useState<Tournament | null>(null);
  const [result, setResult] = useState<TournamentResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const tournaments = await api<Tournament[]>("/tournaments");
        const requestedId = search.get("id");
        const selected =
          tournaments.find((item) => item.id === requestedId) ??
          tournaments.find((item) => ["submitted", "auto_submitted"].includes(item.participation_status ?? "")) ??
          tournaments[0];
        if (!selected) throw new Error("Нет турнира для результата");
        setTournament(selected);
        setResult(await api<TournamentResult>(`/tournaments/${selected.id}/result`));
      } catch (err) {
        setError(err instanceof Error ? err.message : "Результат пока недоступен");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [search]);

  if (loading) {
    return <div className="text-sm text-[#6b6f76]">Загружаем результат...</div>;
  }

  if (!result || !tournament) {
    return (
      <div>
        <p className="text-sm text-[#ff4d3d] mb-3">{error ?? "Результат пока недоступен"}</p>
        <Link href="/app/tournament" className="text-[#16a34a] text-sm font-bold">К турниру</Link>
      </div>
    );
  }

  const correctCount = result.review?.filter((item) => item.is_correct).length ?? 0;
  const totalCount = result.review?.length ?? tournament.question_count;

  return (
    <div>
      <p className="text-[#16a34a] text-[11px] font-bold tracking-[.12em] uppercase mb-2">Попытка завершена</p>
      <h1 className="font-[family-name:var(--font-display)] text-[clamp(28px,3.8vw,44px)] font-semibold mb-5.5">
        {tournament.title} — результат
      </h1>

      <div className="grid sm:grid-cols-3 gap-3.5 mb-3.5">
        <Metric dark label="Баллы" value={`${result.score}`} suffix={`/${result.max_score}`} />
        <Metric label="Статус" value={result.status === "auto_submitted" ? "Авто" : "OK"} />
        <Metric label="Верно" value={`${correctCount}`} suffix={` / ${totalCount}`} />
      </div>

      {!result.review_available && (
        <div className="rounded-2xl bg-[#ffb100] p-5 mb-5.5">
          <h3 className="text-sm font-extrabold mb-1">Разбор откроется после завершения турнира</h3>
          <p className="text-[12.5px] text-[#15171c]/65">Баллы уже сохранены, правильные ответы backend пока не раскрывает.</p>
        </div>
      )}

      {result.review_available && result.review && (
        <>
          <p className="text-[11px] font-bold tracking-[.1em] uppercase text-[#6b6f76] mb-3">Разбор заданий</p>
          <div className="border border-[rgba(21,23,28,.08)] rounded-2xl overflow-hidden mb-5.5 bg-white">
            {result.review.map((item, index) => (
              <div key={item.question_id} className="py-3.5 px-4.5 border-b border-[rgba(21,23,28,.07)] last:border-b-0">
                <div className="flex justify-between gap-3 mb-1">
                  <span className="text-[13px] font-semibold">#{index + 1} {item.prompt}</span>
                  <span className={`text-[12.5px] font-bold ${item.is_correct ? "text-[#16a34a]" : "text-[#ff4d3d]"}`}>
                    {item.points} баллов
                  </span>
                </div>
                <p className="text-[12px] text-[#6b6f76] leading-relaxed">{item.explanation}</p>
              </div>
            ))}
          </div>
        </>
      )}

      <div className="flex gap-2.5 flex-wrap">
        <Link href="/app/dashboard" className="inline-flex items-center h-11.5 px-5.5 rounded-full bg-[#15171c] text-white font-bold text-sm hover:opacity-86 transition-opacity">
          Вернуться в кабинет
        </Link>
        <Link href="/app/tournament" className="inline-flex items-center h-11.5 px-5.5 rounded-full border border-[rgba(21,23,28,.14)] font-semibold text-sm hover:bg-[#f6f4ee] transition-colors">
          Открыть турниры
        </Link>
        {result.review_available && (
          <Link
            href={`/app/leaderboard?id=${tournament.id}`}
            className="inline-flex items-center h-11.5 px-5.5 rounded-full border border-[rgba(21,23,28,.14)] font-semibold text-sm hover:bg-[#f6f4ee] transition-colors"
          >
            Таблица лидеров
          </Link>
        )}
      </div>
    </div>
  );
}

function Metric({ label, value, suffix = "", dark = false }: { label: string; value: string; suffix?: string; dark?: boolean }) {
  return (
    <div className={`rounded-[24px] p-6 ${dark ? "bg-[#15171c] text-white" : "bg-white border border-[rgba(21,23,28,.07)]"}`}>
      <p className={`${dark ? "text-white/50" : "text-[#6b6f76]"} text-[10.5px] font-bold tracking-[.1em] uppercase mb-2`}>{label}</p>
      <strong className={`font-[family-name:var(--font-display)] text-[44px] block ${dark ? "text-[#ffb100]" : "text-[#16a34a]"}`}>
        {value}<span className={`text-[18px] ${dark ? "text-white/40" : "text-[#6b6f76]"}`}>{suffix}</span>
      </strong>
    </div>
  );
}
