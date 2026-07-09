import Link from "next/link";
import { candidates } from "@/lib/mockData";

export default function Employers() {
  return (
    <div className="min-h-screen bg-white">
      <div className="flex justify-between items-center w-[min(1120px,calc(100%-48px))] mx-auto py-6.5 border-b border-[rgba(21,23,28,.08)]">
        <Link href="/" className="flex items-center gap-2.5 hover:opacity-80 transition-opacity">
          <span className="w-[30px] h-[30px] rounded-lg bg-[#15171c] grid place-items-center text-white font-extrabold text-[13px] font-[family-name:var(--font-display)]">
            A
          </span>
          <strong className="text-[15px] tracking-tight">Arvexo Arena</strong>
          <span className="text-[11px] text-[#6b6f76] bg-[#f6f4ee] rounded-full py-1 px-2.5 font-bold">Для работодателей</span>
        </Link>
        <Link
          href="/"
          className="inline-flex items-center h-[38px] px-4.5 rounded-lg border border-[rgba(21,23,28,.16)] text-[#15171c] font-semibold text-[13px] hover:bg-[#f6f4ee] transition-colors"
        >
          ← На сайт
        </Link>
      </div>

      <div className="w-[min(1000px,calc(100%-48px))] mx-auto py-14 pb-20">
        <p className="text-[#16a34a] text-[11px] font-bold tracking-[.12em] uppercase mb-2.5">Кабинет работодателя</p>
        <h1 className="font-[family-name:var(--font-display)] text-[clamp(28px,3.6vw,42px)] font-semibold tracking-[-.02em] mb-3.5">
          Кандидаты с подтверждённым уровнем AI-знаний
        </h1>
        <p className="text-[14.5px] text-[#6b6f76] leading-relaxed max-w-[560px] mb-9">
          Каждый результат — реальная попытка на турнире с автопроверкой, а не самооценка в резюме.
        </p>

        <div className="grid sm:grid-cols-3 gap-3 mb-9">
          <div className="border border-[rgba(21,23,28,.08)] rounded-2xl p-4.5">
            <strong className="font-[family-name:var(--font-display)] text-[26px] block">1,204</strong>
            <span className="text-xs text-[#6b6f76]">кандидата в базе</span>
          </div>
          <div className="border border-[rgba(21,23,28,.08)] rounded-2xl p-4.5">
            <strong className="font-[family-name:var(--font-display)] text-[26px] block">312</strong>
            <span className="text-xs text-[#6b6f76]">прошли AI Basics Tournament</span>
          </div>
          <div className="border border-[rgba(21,23,28,.08)] rounded-2xl p-4.5">
            <strong className="font-[family-name:var(--font-display)] text-[26px] block">86%</strong>
            <span className="text-xs text-[#6b6f76]">средний балл топ-100</span>
          </div>
        </div>

        <p className="text-[11px] font-bold tracking-[.1em] uppercase text-[#6b6f76] mb-3">Топ по AI Basics Tournament</p>
        <div className="border border-[rgba(21,23,28,.1)] rounded-2xl overflow-hidden">
          {candidates.map((c) => (
            <div key={c.rank} className="flex items-center gap-3.5 py-4 px-5 border-b border-[rgba(21,23,28,.07)] last:border-b-0">
              <span className="w-[26px] font-extrabold text-[13px] text-[#6b6f76]">{c.rank}</span>
              <span className="w-9 h-9 rounded-full bg-[#e8e6df] shrink-0" />
              <div className="flex-1">
                <strong className="text-[13.5px] block">{c.name}</strong>
                <span className="text-[11.5px] text-[#6b6f76]">{c.role}</span>
              </div>
              <div className="flex gap-1.5 flex-wrap">
                <span className="text-[10.5px] bg-[#f6f4ee] rounded-full py-1 px-2.5 text-[#6b6f76]">{c.tag}</span>
              </div>
              <strong className="text-[15px] text-[#16a34a] w-11 text-right">{c.score}</strong>
              <button className="inline-flex items-center h-8 px-3.5 rounded-full border border-[rgba(21,23,28,.14)] font-semibold text-[11.5px] whitespace-nowrap hover:bg-[#f6f4ee] transition-colors">
                Профиль →
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
