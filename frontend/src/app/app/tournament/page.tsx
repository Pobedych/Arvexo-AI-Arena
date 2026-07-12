"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { api, formatDateTime, type Tournament, type Track } from "@/lib/api";

export default function TournamentPage() {
  return (
    <Suspense fallback={<div className="text-sm text-[#6b6f76]">Загружаем турниры...</div>}>
      <TournamentView />
    </Suspense>
  );
}

function TournamentView() {
  const router = useRouter();
  const search = useSearchParams();
  const [track, setTrack] = useState<Track | null>(null);
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [currentTime, setCurrentTime] = useState(0);

  useEffect(() => {
    const updateCurrentTime = () => setCurrentTime(Date.now());
    updateCurrentTime();
    const timer = window.setInterval(updateCurrentTime, 30_000);
    return () => window.clearInterval(timer);
  }, []);

  function refresh() {
    Promise.all([api<Track>("/tracks/ai"), api<Tournament[]>("/tournaments")])
      .then(([trackData, tournamentData]) => {
        setTrack(trackData);
        setTournaments(tournamentData);
      })
      .catch((err) => setError(err instanceof Error ? err.message : "Не удалось обновить турниры"));
  }

  useEffect(() => {
    Promise.all([api<Track>("/tracks/ai"), api<Tournament[]>("/tournaments")])
      .then(([trackData, tournamentData]) => {
        setTrack(trackData);
        setTournaments(tournamentData);
      })
      .catch((err) => setError(err instanceof Error ? err.message : "Не удалось загрузить турниры"))
      .finally(() => setLoading(false));
  }, []);

  const primary = useMemo(
    () =>
      tournaments.find((item) => item.id === search.get("id")) ??
      tournaments.find((item) => item.status === "active") ??
      tournaments.find((item) => item.status === "published") ??
      tournaments.find((item) => item.participation_status) ??
      tournaments[0],
    [tournaments, search],
  );

  useEffect(() => {
    if (primary?.participation_status === "invited") {
      api(`/tournaments/${primary.id}/invitation/seen`, { method: "POST" }).catch(() => {});
    }
  }, [primary?.id, primary?.participation_status]);

  async function register(tournament: Tournament) {
    setBusyId(tournament.id);
    setError(null);
    try {
      await api<{ status: string }>(`/tournaments/${tournament.id}/register`, { method: "POST" });
      refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Не удалось зарегистрироваться");
    } finally {
      setBusyId(null);
    }
  }

  async function start(tournament: Tournament) {
    setBusyId(tournament.id);
    setError(null);
    try {
      if (!tournament.participation_status || tournament.participation_status === "invited") {
        await api<{ status: string }>(`/tournaments/${tournament.id}/register`, { method: "POST" });
      }
      await api<{ attempt_id: string }>(`/tournaments/${tournament.id}/start`, { method: "POST" });
      router.push(`/app/tournament/live?id=${tournament.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Не удалось начать попытку");
    } finally {
      setBusyId(null);
    }
  }

  if (loading) {
    return <div className="text-sm text-[#6b6f76]">Загружаем турниры...</div>;
  }

  if (!primary) {
    return <div className={`text-sm ${error ? "text-[#ff4d3d]" : "text-[#6b6f76]"}`}>{error ?? "Пока нет доступных турниров."}</div>;
  }

  const withinTournamentWindow = isTournamentWithinWindow(primary, currentTime);
  const canRegister = primary.status === "published" && primary.participation_status === "invited" && primary.question_count > 0;
  const canStart =
    primary.status === "active" &&
    withinTournamentWindow &&
    primary.question_count > 0 &&
    ["invited", "registered", "in_progress"].includes(primary.participation_status ?? "");
  const hasSubmittedAttempt = ["submitted", "auto_submitted"].includes(primary.participation_status ?? "");

  return (
    <div>
      <div className="inline-flex items-center gap-1.5 bg-[#16a34a] text-white rounded-full py-1.5 px-3.5 text-[11.5px] font-bold mb-4">
        <span className="w-1.5 h-1.5 rounded-full bg-white animate-[pulse_1.6s_infinite]" /> {statusLabel(primary, withinTournamentWindow)}
      </div>
      <h1 className="font-[family-name:var(--font-display)] text-[clamp(28px,4vw,48px)] font-semibold mb-6.5">
        {primary.title}
      </h1>

      <div className="grid md:grid-cols-[1.5fr_1fr] gap-3.5">
        <div className="rounded-[26px] bg-white border border-[rgba(21,23,28,.07)] p-6.5 shadow-[0_16px_40px_-32px_rgba(21,23,28,.35)]">
          <p className="text-sm leading-relaxed text-[#6b6f76] mb-5 max-w-[480px]">{primary.description}</p>
          <div className="grid gap-2 mb-5.5">
            <Info label="Формат" value={primary.question_count > 0 ? `${primary.question_count} задач · ${primary.max_score} баллов` : "Задания не опубликованы"} />
            <Info
              label="Готовность"
              value={
                primary.readiness
                  ? primary.readiness === "ready"
                    ? "Готов"
                    : "Стоит подготовиться"
                  : `${track?.progress_percent ?? 0}%`
              }
              accent={primary.readiness !== "prepare"}
            />
            <Info label="Статус участия" value={participationLabel(primary.participation_status)} />
          </div>
          {primary.topics.length > 0 && (
            <div className="mb-5">
              <p className="text-[11px] font-bold tracking-[.1em] uppercase text-[#6b6f76] mb-2">Проверяемые темы</p>
              <div className="flex flex-wrap gap-1.5">
                {primary.topics.map((topic) => (
                  <span key={topic} className="text-[11.5px] font-semibold bg-[#f6f4ee] rounded-full px-3 py-1.5">
                    {topic}
                  </span>
                ))}
              </div>
            </div>
          )}
          {error && <p className="text-[#ff4d3d] text-xs font-semibold mb-3">{error}</p>}
          <div className="flex gap-2.5 flex-wrap items-center">
            {hasSubmittedAttempt ? (
              <button onClick={() => router.push(`/app/tournament/result?id=${primary.id}`)} className="inline-flex items-center h-12 px-6 rounded-full bg-[#15171c] text-white font-bold text-[14.5px] hover:opacity-87 transition-opacity focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#16a34a]">
                Открыть результат
              </button>
            ) : primary.status === "finished" || primary.status === "cancelled" || (primary.status === "active" && !withinTournamentWindow) ? (
              <p className="text-[12.5px] font-semibold text-[#6b6f76]">
                {primary.participation_status === "missed" ? "Попытка пропущена" : "Вы не участвовали в этом турнире"}
              </p>
            ) : primary.status === "active" ? (
              <button
                onClick={() => start(primary)}
                disabled={busyId === primary.id || !canStart || ["submitted", "auto_submitted"].includes(primary.participation_status ?? "")}
                className="inline-flex items-center h-12 px-6 rounded-full bg-[#16a34a] text-white font-bold text-[14.5px] shadow-[0_14px_28px_-14px_rgba(22,163,74,.5)] hover:opacity-87 transition-opacity disabled:opacity-45"
              >
                {!withinTournamentWindow
                  ? "Окно турнира закрыто"
                  : primary.question_count === 0
                    ? "Нет доступных заданий"
                    : !canStart
                      ? "Только по приглашению"
                      : primary.participation_status === "in_progress"
                        ? "Продолжить попытку"
                        : "Начать попытку"}
              </button>
            ) : (
              <button
                onClick={() => register(primary)}
                disabled={busyId === primary.id || !canRegister || primary.participation_status === "registered"}
                className="inline-flex items-center h-12 px-6 rounded-full bg-[#16a34a] text-white font-bold text-[14.5px] shadow-[0_14px_28px_-14px_rgba(22,163,74,.5)] hover:opacity-87 transition-opacity disabled:opacity-45"
              >
                {primary.participation_status === "registered"
                  ? "Ты зарегистрирован"
                  : canRegister
                    ? "Зарегистрироваться"
                    : "Только по приглашению"}
              </button>
            )}
          </div>
        </div>
        <div className="rounded-[26px] bg-[#15171c] text-white p-6.5 shadow-[0_16px_40px_-32px_rgba(21,23,28,.35)]">
          <div className="w-16 h-16 rounded-[18px] bg-[#ffb100] text-[#15171c] grid place-items-center mb-4">
            <strong className="text-[22px] font-extrabold leading-none">{primary.question_count || "—"}</strong>
          </div>
          <p className="text-[11.5px] text-white/50 mb-1">Окно турнира</p>
          <h3 className="text-[17px] font-bold mb-2 leading-snug">
            {formatDateTime(primary.starts_at)} —<br />{formatDateTime(primary.ends_at)}
          </h3>
          <p className="text-xs text-white/55">
            Попытка: <strong className="text-white">{primary.duration_minutes} минут</strong>
          </p>
        </div>
      </div>

      {tournaments.length > 1 && (
        <div className="mt-5 grid gap-2">
          {tournaments.filter((item) => item.id !== primary.id).map((item) => (
            <button key={item.id} onClick={() => router.push(`/app/tournament?id=${item.id}`)} className="text-left rounded-2xl border border-[rgba(21,23,28,.08)] bg-white px-4 py-3">
              <strong className="text-sm">{item.title}</strong>
              <span className="block text-[11px] text-[#6b6f76]">{statusLabel(item, isTournamentWithinWindow(item, currentTime))} · {formatDateTime(item.starts_at)}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function Info({ label, value, accent = false }: { label: string; value: string; accent?: boolean }) {
  return (
    <div className="flex justify-between py-2.5 px-3.5 rounded-xl bg-[#f6f4ee] text-[12.5px] gap-3">
      <span className="text-[#6b6f76]">{label}</span>
      <strong className={accent ? "text-[#16a34a]" : ""}>{value}</strong>
    </div>
  );
}

function statusLabel(tournament: Tournament, withinWindow?: boolean) {
  if (tournament.status === "active") return withinWindow === false ? "Окно турнира закрыто" : "Турнир активен";
  if (tournament.status === "published") return "Регистрация открыта";
  if (tournament.status === "finished") return "Турнир завершён";
  return tournament.status;
}

function isTournamentWithinWindow(tournament: Tournament, currentTime: number) {
  if (currentTime === 0) return tournament.status === "active";
  return new Date(tournament.starts_at).getTime() <= currentTime && currentTime < new Date(tournament.ends_at).getTime();
}

function participationLabel(status: Tournament["participation_status"]) {
  if (status === "invited") return "Есть приглашение";
  if (status === "registered") return "Зарегистрирован";
  if (status === "in_progress") return "Попытка начата";
  if (status === "submitted") return "Ответы отправлены";
  if (status === "auto_submitted") return "Автоотправка";
  if (status === "missed") return "Попытка пропущена";
  return "Не зарегистрирован";
}
