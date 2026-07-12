"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { api, type Track } from "@/lib/api";

const tracks = [
  { slug: "ai", icon: "AI", title: "AI Track", desc: "12 уроков · от основ AI до responsible AI", enabled: true },
  { slug: "math", icon: "MT", title: "Math Track", desc: "Интерактивные задания и мини-проверки по математике", enabled: true },
  { slug: "security", icon: "SC", title: "Security Track", desc: "Скоро", enabled: false },
];

export default function Onboarding() {
  const router = useRouter();
  const [selected, setSelected] = useState("ai");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function continueWithTrack() {
    setLoading(true);
    setError(null);
    try {
      await api<Track>(`/tracks/${selected}/select`, { method: "POST" });
      router.push("/app/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Не удалось выбрать трек");
    } finally {
      setLoading(false);
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
          Начни с одного — остальные откроются позже.
        </p>

        <div className="grid gap-3 text-left mb-7">
          {tracks.map((track) => {
            const isSelected = track.enabled && selected === track.slug;
            return (
              <button
                type="button"
                key={track.slug}
                disabled={!track.enabled}
                onClick={() => setSelected(track.slug)}
                className={`flex items-center gap-3.5 rounded-2xl py-4.5 px-5 text-left w-full transition-colors ${
                  isSelected ? "border-2 border-[#16a34a] bg-[#16a34a]/[.04]" : "border border-[rgba(21,23,28,.1)]"
                } ${!track.enabled ? "opacity-50 cursor-default" : "cursor-pointer"}`}
              >
                <span className={`w-10 h-10 rounded-[11px] grid place-items-center text-[12px] font-extrabold shrink-0 ${isSelected ? "bg-[#16a34a] text-white" : "bg-[#f6f4ee]"}`}>
                  {track.icon}
                </span>
                <div className="flex-1">
                  <strong className="text-[14.5px] block mb-0.5">{track.title}</strong>
                  <span className="text-xs text-[#6b6f76]">{track.desc}</span>
                </div>
                {isSelected && <span className="text-[#16a34a] font-extrabold text-base">✓</span>}
              </button>
            );
          })}
        </div>

        {error && <p className="text-[#ff4d3d] text-xs font-semibold mb-3">{error}</p>}

        <button
          onClick={continueWithTrack}
          disabled={loading}
          className="inline-flex items-center h-12.5 px-7.5 rounded-[10px] bg-[#15171c] text-white font-bold text-[14.5px] hover:opacity-86 transition-opacity disabled:opacity-50"
        >
          {loading ? "Выбираем..." : "Продолжить"}
        </button>
      </div>
    </div>
  );
}
