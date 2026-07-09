import { leagueRows } from "@/lib/mockData";

export default function Leaderboard() {
  return (
    <div>
      <div className="flex justify-between items-center mb-5 flex-wrap gap-3">
        <div>
          <p className="text-[#16a34a] text-[11px] font-bold tracking-[.12em] uppercase mb-2">Рейтинг</p>
          <h1 className="font-[family-name:var(--font-display)] text-[clamp(26px,3.4vw,40px)] font-semibold tracking-[-.02em]">
            AI Basics Tournament
          </h1>
        </div>
        <div className="flex gap-1.5">
          <span className="bg-[#15171c] text-white rounded-full py-2 px-4 text-[12.5px] font-bold">Неделя</span>
          <span className="bg-[#f6f4ee] rounded-full py-2 px-4 text-[12.5px] font-semibold text-[#6b6f76]">Месяц</span>
          <span className="bg-[#f6f4ee] rounded-full py-2 px-4 text-[12.5px] font-semibold text-[#6b6f76]">Всё время</span>
        </div>
      </div>

      <div
        className="flex items-center gap-3 rounded-[18px] p-4.5 mb-3.5"
        style={{ background: "radial-gradient(circle at 90% 0%, rgba(255,255,255,.4), transparent 30%), #16a34a" }}
      >
        <span className="w-10 h-10 rounded-xl bg-white/[.22] grid place-items-center text-lg">🏆</span>
        <div className="flex-1">
          <strong className="text-white text-[14.5px] block">Изумрудная лига</strong>
          <span className="text-white/75 text-xs">Топ-3 повышаются в Сапфировую · 2 дня до конца недели</span>
        </div>
      </div>

      <div className="border border-[rgba(21,23,28,.08)] rounded-[20px] overflow-hidden">
        {leagueRows.map((r) => (
          <div
            key={r.rank}
            className="flex items-center gap-3.5 py-3.5 px-4.5 border-b border-[rgba(21,23,28,.07)] last:border-b-0"
            style={{ background: r.zone === "you" ? "rgba(22,163,74,.07)" : "transparent" }}
          >
            <span className="w-[22px] font-extrabold text-[13px]" style={{ color: r.rank <= 3 ? "#ffb100" : "#6b6f76" }}>
              {r.rank}
            </span>
            <span className="w-8 h-8 rounded-full bg-[#e8e6df] shrink-0" />
            <strong className="flex-1 text-[13px]">{r.name}</strong>
            <span
              className="text-[11px] font-bold"
              style={{ color: r.zone === "promo" ? "#16a34a" : r.zone === "drop" ? "#ff4d3d" : "transparent" }}
            >
              {r.zone === "promo" ? "▲ Повышение" : r.zone === "drop" ? "▼ Зона вылета" : ""}
            </span>
            <strong className="w-11 text-right text-sm text-[#16a34a]">{r.score}</strong>
          </div>
        ))}
      </div>
    </div>
  );
}
