import Link from "next/link";

const tracks = [
  { icon: "🤖", title: "AI Track", desc: "12 уроков · от основ AI до responsible AI", enabled: true },
  { icon: "💻", title: "Data Track", desc: "Скоро", enabled: false },
  { icon: "🔐", title: "Security Track", desc: "Скоро", enabled: false },
];

export default function Onboarding() {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-6">
      <div className="w-full max-w-[640px] text-center">
        <span className="inline-grid w-11 h-11 rounded-xl bg-[#15171c] place-items-center text-white font-extrabold text-[17px] font-[family-name:var(--font-display)] mb-6">
          A
        </span>
        <p className="text-[#16a34a] text-[11px] font-bold tracking-[.12em] uppercase mb-2.5">Шаг 1 из 1</p>
        <h1 className="font-[family-name:var(--font-display)] text-[clamp(26px,3.4vw,38px)] font-semibold tracking-[-.02em] mb-3">
          Какой трек тебе интересен?
        </h1>
        <p className="text-[14.5px] text-[#6b6f76] leading-relaxed mb-8">
          Начни с одного — остальные откроются позже. Можно проходить несколько параллельно.
        </p>

        <div className="grid gap-3 text-left mb-7">
          {tracks.map((t) =>
            t.enabled ? (
              <div
                key={t.title}
                className="flex items-center gap-3.5 border-2 border-[#16a34a] rounded-2xl py-4.5 px-5 bg-[#16a34a]/[.04]"
              >
                <span className="w-10 h-10 rounded-[11px] bg-[#16a34a] text-white grid place-items-center text-lg shrink-0">
                  {t.icon}
                </span>
                <div className="flex-1">
                  <strong className="text-[14.5px] block mb-0.5">{t.title}</strong>
                  <span className="text-xs text-[#6b6f76]">{t.desc}</span>
                </div>
                <span className="text-[#16a34a] font-extrabold text-base">✓</span>
              </div>
            ) : (
              <div
                key={t.title}
                className="flex items-center gap-3.5 border border-[rgba(21,23,28,.1)] rounded-2xl py-4.5 px-5 opacity-50"
              >
                <span className="w-10 h-10 rounded-[11px] bg-[#f6f4ee] grid place-items-center text-lg shrink-0">{t.icon}</span>
                <div className="flex-1">
                  <strong className="text-[14.5px] block mb-0.5">{t.title}</strong>
                  <span className="text-xs text-[#6b6f76]">{t.desc}</span>
                </div>
              </div>
            )
          )}
        </div>

        <Link
          href="/app/dashboard"
          className="inline-flex items-center h-12.5 px-7.5 rounded-[10px] bg-[#15171c] text-white font-bold text-[14.5px] hover:opacity-86 transition-opacity"
        >
          Продолжить →
        </Link>
      </div>
    </div>
  );
}
