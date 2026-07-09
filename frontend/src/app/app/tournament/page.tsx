import Link from "next/link";

export default function TournamentInvite() {
  return (
    <div>
      <div className="inline-flex items-center gap-1.5 bg-[#16a34a] text-white rounded-full py-1.5 px-3.5 text-[11.5px] font-bold mb-4">
        <span className="w-1.5 h-1.5 rounded-full bg-white animate-[pulse_1.6s_infinite]" /> Регистрация открыта
      </div>
      <h1 className="font-[family-name:var(--font-display)] text-[clamp(28px,4vw,48px)] font-semibold tracking-[-.02em] mb-6.5">
        AI Basics Tournament
      </h1>

      <div className="grid md:grid-cols-[1.5fr_1fr] gap-3.5">
        <div className="rounded-[26px] bg-white border border-[rgba(21,23,28,.07)] p-6.5 shadow-[0_16px_40px_-32px_rgba(21,23,28,.35)]">
          <p className="text-sm leading-relaxed text-[#6b6f76] mb-5 max-w-[420px]">
            Проверь знания AI Track: данные, ML-задачи, train/test split, метрики, responsible AI.
          </p>
          <div className="grid gap-2 mb-5.5">
            <div className="flex justify-between py-2.5 px-3.5 rounded-xl bg-[#f6f4ee] text-[12.5px]">
              <span className="text-[#6b6f76]">Формат</span>
              <strong>20 задач · 100 баллов</strong>
            </div>
            <div className="flex justify-between py-2.5 px-3.5 rounded-xl bg-[#f6f4ee] text-[12.5px]">
              <span className="text-[#6b6f76]">Готовность</span>
              <strong className="text-[#16a34a]">42%</strong>
            </div>
          </div>
          <Link
            href="/app/tournament/live"
            className="inline-flex items-center h-12 px-6 rounded-full bg-[#16a34a] text-white font-bold text-[14.5px] shadow-[0_14px_28px_-14px_rgba(22,163,74,.5)] hover:opacity-87 transition-opacity"
          >
            Участвовать →
          </Link>
        </div>
        <div className="rounded-[26px] bg-[#15171c] text-white p-6.5 shadow-[0_16px_40px_-32px_rgba(21,23,28,.35)]">
          <div className="w-16 h-16 rounded-[18px] bg-[#ffb100] text-[#15171c] grid place-items-center mb-4">
            <strong className="text-[22px] font-extrabold leading-none">20</strong>
          </div>
          <p className="text-[11.5px] text-white/50 mb-1">Окно старта</p>
          <h3 className="text-[19px] font-bold mb-2">10:00–18:00</h3>
          <p className="text-xs text-white/55">
            Попытка: <strong className="text-white">60 минут</strong>
          </p>
        </div>
      </div>
    </div>
  );
}
