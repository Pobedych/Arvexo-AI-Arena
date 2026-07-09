"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { api, formatDuration, type Leaderboard, type Tournament } from "@/lib/api";

export default function LeaderboardPage() {
  return (
    <Suspense fallback={<div className="text-sm text-[#6b6f76]">Загружаем таблицу лидеров...</div>}>
      <LeaderboardView />
    </Suspense>
  );
}

function LeaderboardView() {
  const search = useSearchParams();
  const [tournament, setTournament] = useState<Tournament | null>(null);
  const [board, setBoard] = useState<Leaderboard | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const tournaments = await api<Tournament[]>("/tournaments");
        const requestedId = search.get("id");
        const selected =
          tournaments.find((item) => item.id === requestedId) ??
          tournaments.find((item) => item.status === "finished") ??
          tournaments.find((item) => item.participation_status) ??
          tournaments[0];
        if (!selected) throw new Error("Нет доступных турниров");
        setTournament(selected);
        setBoard(await api<Leaderboard>(`/tournaments/${selected.id}/leaderboard`));
      } catch (err) {
        setError(err instanceof Error ? err.message : "Таблица лидеров пока недоступна");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [search]);

  const rows = useMemo(() => board?.rows ?? [], [board]);

  if (loading) {
    return <div className="text-sm text-[#6b6f76]">Загружаем таблицу лидеров...</div>;
  }

  if (error || !tournament || !board) {
    return <p className="text-sm text-[#ff4d3d]">{error ?? "Таблица лидеров пока недоступна"}</p>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-5 flex-wrap gap-3">
        <div>
          <p className="text-[#16a34a] text-[11px] font-bold tracking-[.12em] uppercase mb-2">Таблица лидеров</p>
          <h1 className="font-[family-name:var(--font-display)] text-[clamp(26px,3.4vw,40px)] font-semibold tracking-[-.02em]">
            {tournament.title}
          </h1>
        </div>
      </div>

      {board.status !== "finished" && (
        <div className="rounded-2xl bg-[#ffb100] p-5 mb-5.5">
          <h3 className="text-sm font-extrabold mb-1">Таблица откроется после завершения турнира</h3>
          <p className="text-[12.5px] text-[#15171c]/65">
            Места и баллы участников станут видны, когда турнир перейдёт в статус «завершён».
          </p>
        </div>
      )}

      {board.status === "finished" && rows.length === 0 && (
        <p className="text-sm text-[#6b6f76]">Пока нет отправленных попыток по этому турниру.</p>
      )}

      {board.status === "finished" && rows.length > 0 && (
        <div className="border border-[rgba(21,23,28,.08)] rounded-[20px] overflow-hidden">
          {rows.map((row) => (
            <div
              key={`${row.rank}-${row.display_name}`}
              className="flex items-center gap-3.5 py-3.5 px-4.5 border-b border-[rgba(21,23,28,.07)] last:border-b-0"
              style={{ background: row.is_you ? "rgba(22,163,74,.07)" : "transparent" }}
            >
              <span className="w-[22px] font-extrabold text-[13px]" style={{ color: row.rank <= 3 ? "#ffb100" : "#6b6f76" }}>
                {row.rank}
              </span>
              <span className="w-8 h-8 rounded-full bg-[#e8e6df] shrink-0" />
              <strong className="flex-1 text-[13px]">{row.display_name}{row.is_you ? " (ты)" : ""}</strong>
              <span className="text-[11px] text-[#6b6f76] w-24 text-right">{formatDuration(row.duration_seconds)}</span>
              <strong className="w-11 text-right text-sm text-[#16a34a]">{row.score}/{row.max_score}</strong>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
