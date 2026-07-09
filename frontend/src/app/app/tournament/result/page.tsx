import Link from "next/link";

const topics = [
  { title: "Введение в AI", score: "5/5", ok: true },
  { title: "Данные и задачи ML", score: "7/7", ok: true },
  { title: "Обучение и оценка", score: "4/6", ok: false },
  { title: "Responsible AI", score: "1/2", ok: false },
];

export default function TournamentResult() {
  return (
    <div>
      <p className="text-[#16a34a] text-[11px] font-bold tracking-[.12em] uppercase mb-2">Попытка завершена</p>
      <h1 className="font-[family-name:var(--font-display)] text-[clamp(28px,3.8vw,44px)] font-semibold tracking-[-.02em] mb-5.5">
        AI Basics Tournament — результат
      </h1>

      <div className="grid sm:grid-cols-3 gap-3.5 mb-3.5">
        <div className="rounded-[24px] bg-[#15171c] text-white p-6">
          <p className="text-white/50 text-[10.5px] font-bold tracking-[.1em] uppercase mb-2">Баллы</p>
          <strong className="font-[family-name:var(--font-display)] text-[44px] text-[#ffb100] block">
            86<span className="text-[18px] text-white/40">/100</span>
          </strong>
        </div>
        <div className="rounded-[24px] bg-white border border-[rgba(21,23,28,.07)] p-6">
          <p className="text-[#6b6f76] text-[10.5px] font-bold tracking-[.1em] uppercase mb-2">Место</p>
          <strong className="font-[family-name:var(--font-display)] text-[44px] text-[#16a34a] block">
            #7<span className="text-base text-[#6b6f76]"> / 312</span>
          </strong>
        </div>
        <div className="rounded-[24px] bg-white border border-[rgba(21,23,28,.07)] p-6">
          <p className="text-[#6b6f76] text-[10.5px] font-bold tracking-[.1em] uppercase mb-2">Верно</p>
          <strong className="font-[family-name:var(--font-display)] text-[44px] block">
            17<span className="text-base text-[#6b6f76]"> / 20</span>
          </strong>
        </div>
      </div>

      <p className="text-[11px] font-bold tracking-[.1em] uppercase text-[#6b6f76] mb-3">Разбор по темам</p>
      <div className="border border-[rgba(21,23,28,.08)] rounded-2xl overflow-hidden mb-5.5">
        {topics.map((t) => (
          <div key={t.title} className="flex justify-between py-3.5 px-4.5 border-b border-[rgba(21,23,28,.07)] last:border-b-0">
            <span className="text-[13px] font-semibold">{t.title}</span>
            <span className={`text-[12.5px] font-bold ${t.ok ? "text-[#16a34a]" : "text-[#ff4d3d]"}`}>{t.score}</span>
          </div>
        ))}
      </div>

      <div className="flex gap-2.5 flex-wrap">
        <Link
          href="/app/dashboard"
          className="inline-flex items-center h-11.5 px-5.5 rounded-full bg-[#15171c] text-white font-bold text-sm hover:opacity-86 transition-opacity"
        >
          Вернуться в кабинет
        </Link>
        <Link
          href="/app/leaderboard"
          className="inline-flex items-center h-11.5 px-5.5 rounded-full border border-[rgba(21,23,28,.14)] font-semibold text-sm hover:bg-[#f6f4ee] transition-colors"
        >
          Открыть рейтинг →
        </Link>
      </div>
    </div>
  );
}
