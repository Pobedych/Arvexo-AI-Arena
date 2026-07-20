"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { api, type Track, type TrackSummary } from "@/lib/api";

function trackIcon(slug: string) {
  if (slug === "math") return "MT";
  return slug.slice(0, 2).toUpperCase();
}

export default function Onboarding() {
  const router = useRouter();
  const [tracks, setTracks] = useState<TrackSummary[]>([]);
  const [selected, setSelected] = useState("");
  const [loadingTracks, setLoadingTracks] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api<TrackSummary[]>("/tracks")
      .then((items) => {
        setTracks(items);
        setSelected(items.find((track) => track.selected)?.slug ?? items[0]?.slug ?? "");
      })
      .catch((err) => setError(err instanceof Error ? err.message : "Не удалось загрузить треки"))
      .finally(() => setLoadingTracks(false));
  }, []);

  async function continueWithTrack() {
    if (!selected) return;
    setSubmitting(true);
    setError(null);
    try {
      await api<Track>(`/tracks/${selected}/select`, { method: "POST" });
      router.push("/app/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Не удалось выбрать трек");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-6">
      <div className="w-full max-w-[640px] text-center">
        <span className="inline-grid w-11 h-11 rounded-xl bg-[#15171c] place-items-center text-white font-extrabold text-[17px] font-[family-name:var(--font-display)] mb-6">
          A
        </span>
        <p className="text-[#16a34a] text-[11px] font-bold tracking-[.12em] uppercase mb-2.5">Шаг 1 из 1</p>
        <h1 className="font-[family-name:var(--font-display)] text-[clamp(26px,3.4vw,38px)] font-semibold mb-3">
          Какой трек тебе интересен?
        </h1>
        <p className="text-[14.5px] text-[#6b6f76] leading-relaxed mb-8">
          Выбери направление сейчас. Переключиться можно будет в учебном плане.
        </p>

        <div className="grid gap-3 text-left mb-7">
          {tracks.map((track) => {
            const active = selected === track.slug;
            return (
              <button
                type="button"
                key={track.id}
                aria-pressed={active}
                onClick={() => setSelected(track.slug)}
                className={`flex w-full items-center gap-3.5 rounded-2xl py-4.5 px-5 text-left transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#16a34a] ${
                  active ? "border-2 border-[#16a34a] bg-[#16a34a]/[.04]" : "border border-[rgba(21,23,28,.1)] hover:border-[rgba(22,163,74,.45)]"
                }`}
              >
                <span className={`w-10 h-10 rounded-[11px] grid place-items-center text-[12px] font-extrabold shrink-0 ${active ? "bg-[#16a34a] text-white" : "bg-[#f6f4ee]"}`}>
                  {trackIcon(track.slug)}
                </span>
                <span className="min-w-0 flex-1">
                  <strong className="text-[14.5px] block mb-0.5">{track.title}</strong>
                  <span className="text-xs text-[#6b6f76]">{track.description}</span>
                </span>
                {active && <span className="text-[#16a34a] font-extrabold text-base">✓</span>}
              </button>
            );
          })}
          {!loadingTracks && tracks.length === 0 && (
            <p className="rounded-2xl border border-[rgba(21,23,28,.1)] px-5 py-6 text-center text-sm text-[#6b6f76]">Доступных треков пока нет.</p>
          )}
        </div>

        {error && <p className="text-[#ff4d3d] text-xs font-semibold mb-3">{error}</p>}

        <button
          onClick={continueWithTrack}
          disabled={loadingTracks || submitting || !selected}
          className="inline-flex items-center h-12.5 px-7.5 rounded-[10px] bg-[#15171c] text-white font-bold text-[14.5px] hover:opacity-86 transition-opacity disabled:opacity-50"
        >
          {loadingTracks ? "Загружаем..." : submitting ? "Выбираем..." : "Продолжить"}
        </button>
      </div>
    </div>
  );
}
