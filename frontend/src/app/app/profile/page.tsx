import Link from "next/link";
import { heatSeed, heatColors } from "@/lib/mockData";

const badges = [
  { icon: "🔥", label: "Серия 5+", bg: "#15171c", dim: false },
  { icon: "🧠", label: "Модуль 1", bg: "#16a34a", dim: false },
  { icon: "🏁", label: "1-й турнир", bg: "#ffb100", dim: false },
  { icon: "🏆", label: "Топ-3", bg: "rgba(21,23,28,.08)", dim: true },
];

const settings = [
  { label: "Напоминания об уроках", on: true },
  { label: "Показывать профиль работодателям", on: true },
  { label: "Email-уведомления о турнирах", on: false },
];

export default function Profile() {
  return (
    <div>
      <div className="flex items-center justify-between gap-4.5 mb-6.5 flex-wrap">
        <div className="flex items-center gap-4.5">
          <span className="w-16 h-16 rounded-full bg-[#16a34a] text-white grid place-items-center font-bold text-[22px] shrink-0">АК</span>
          <div>
            <h1 className="font-[family-name:var(--font-display)] text-[clamp(24px,3vw,32px)] font-semibold tracking-[-.02em] mb-1">
              Андрей Ковалёв
            </h1>
            <p className="text-[13px] text-[#6b6f76]">Студент · Arvexo Account · на платформе с марта 2026</p>
          </div>
        </div>
        <div className="text-right rounded-[18px] bg-[#15171c] py-3.5 px-5.5">
          <p className="text-white/50 text-[10px] font-bold tracking-[.1em] uppercase mb-1">Рейтинг</p>
          <strong className="font-[family-name:var(--font-display)] text-[30px] text-[#ffb100] block leading-none">1487</strong>
          <span className="text-[11px] text-[#16a34a] font-bold">+34 за неделю</span>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
        <div className="rounded-2xl bg-white border border-[rgba(21,23,28,.07)] p-4">
          <strong className="font-[family-name:var(--font-display)] text-2xl block">4</strong>
          <span className="text-[11.5px] text-[#6b6f76]">уровень</span>
        </div>
        <div className="rounded-2xl bg-white border border-[rgba(21,23,28,.07)] p-4">
          <strong className="font-[family-name:var(--font-display)] text-2xl block">4/12</strong>
          <span className="text-[11.5px] text-[#6b6f76]">AI Track</span>
        </div>
        <div className="rounded-2xl bg-white border border-[rgba(21,23,28,.07)] p-4">
          <strong className="font-[family-name:var(--font-display)] text-2xl block">2</strong>
          <span className="text-[11.5px] text-[#6b6f76]">турнира пройдено</span>
        </div>
        <div className="rounded-2xl bg-[#15171c] text-white p-4">
          <strong className="font-[family-name:var(--font-display)] text-2xl block text-[#ffb100]">6</strong>
          <span className="text-[11.5px] text-white/55">дней подряд</span>
        </div>
      </div>

      <div className="rounded-[20px] bg-white border border-[rgba(21,23,28,.07)] py-4.5 px-5 mb-3.5">
        <p className="text-[#6b6f76] text-[10.5px] font-bold tracking-[.1em] uppercase mb-3">Активность за 11 недель</p>
        <div
          className="grid gap-[3px] max-w-[340px]"
          style={{ gridTemplateColumns: "repeat(11,1fr)", gridAutoFlow: "column", gridTemplateRows: "repeat(7,1fr)" }}
        >
          {heatSeed.map((v, i) => (
            <span key={i} className="w-[11px] h-[11px] rounded-[3px]" style={{ background: heatColors[v] }} />
          ))}
        </div>
      </div>

      <div className="grid md:grid-cols-[1.3fr_1fr] gap-3.5 mb-3.5">
        <div className="rounded-[20px] bg-white border border-[rgba(21,23,28,.07)] p-5">
          <p className="text-[#6b6f76] text-[10.5px] font-bold tracking-[.1em] uppercase mb-3.5">Бейджи</p>
          <div className="flex gap-2.5 flex-wrap">
            {badges.map((b) => (
              <div key={b.label} className="text-center" style={b.dim ? { opacity: 0.35 } : undefined}>
                <span className="w-11 h-11 rounded-[13px] grid place-items-center text-lg mb-1.5" style={{ background: b.bg }}>
                  {b.icon}
                </span>
                <span className="text-[10.5px] text-[#6b6f76] block">{b.label}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="rounded-[20px] bg-white border border-[rgba(21,23,28,.07)] p-5">
          <p className="text-[#6b6f76] text-[10.5px] font-bold tracking-[.1em] uppercase mb-3.5">Настройки</p>
          <div className="grid gap-2.5">
            {settings.map((s) => (
              <div key={s.label} className="flex justify-between items-center">
                <span className="text-[12.5px]">{s.label}</span>
                <span
                  className="w-9 h-5 rounded-full relative inline-block"
                  style={{ background: s.on ? "#16a34a" : "rgba(21,23,28,.12)" }}
                >
                  <span
                    className="absolute top-0.5 w-4 h-4 rounded-full bg-white"
                    style={s.on ? { right: "2px" } : { left: "2px" }}
                  />
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <Link
        href="/app/dashboard"
        className="inline-flex items-center h-11 px-5 rounded-full bg-[#15171c] text-white font-bold text-[13.5px] hover:opacity-85 transition-opacity"
      >
        ← Кабинет
      </Link>
    </div>
  );
}
