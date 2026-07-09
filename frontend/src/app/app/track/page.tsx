import Link from "next/link";
import { modules, lessons, currentLesson, currentLessonIndex, doneCount, totalCount, trackPct } from "@/lib/mockData";
import { Eyebrow, Card } from "@/components/ui";

export default function Track() {
  return (
    <div>
      <div className="flex justify-between items-end gap-4 mb-4.5 flex-wrap">
        <div>
          <Eyebrow>AI Track</Eyebrow>
          <h1 className="font-[family-name:var(--font-display)] text-[clamp(28px,3.6vw,44px)] font-semibold tracking-[-.02em]">
            Карта подготовки
          </h1>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right">
            <strong className="font-[family-name:var(--font-display)] text-[32px] text-[#16a34a] block">{trackPct}%</strong>
            <span className="text-xs text-[#6b6f76]">пройдено трека</span>
          </div>
          <Link
            href={`/app/lesson/${currentLesson.id}`}
            className="inline-flex items-center h-11.5 px-5.5 rounded-full bg-[#16a34a] text-white font-bold text-sm whitespace-nowrap hover:opacity-86 transition-opacity"
          >
            Урок {currentLessonIndex + 1} — {currentLesson.title} →
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5.5">
        <div className="rounded-2xl bg-white border border-[rgba(21,23,28,.07)] py-3.5 px-4">
          <strong className="font-[family-name:var(--font-display)] text-[22px] block">
            {doneCount} / {totalCount}
          </strong>
          <span className="text-[11.5px] text-[#6b6f76]">уроков пройдено</span>
        </div>
        <div className="rounded-2xl bg-white border border-[rgba(21,23,28,.07)] py-3.5 px-4">
          <strong className="font-[family-name:var(--font-display)] text-[22px] block">3ч 40м</strong>
          <span className="text-[11.5px] text-[#6b6f76]">осталось по времени</span>
        </div>
        <div className="rounded-2xl bg-white border border-[rgba(21,23,28,.07)] py-3.5 px-4">
          <strong className="font-[family-name:var(--font-display)] text-[22px] block">91%</strong>
          <span className="text-[11.5px] text-[#6b6f76]">средняя точность</span>
        </div>
        <div className="rounded-2xl bg-[#15171c] text-white py-3.5 px-4">
          <strong className="font-[family-name:var(--font-display)] text-[22px] block text-[#ffb100]">#7</strong>
          <span className="text-[11.5px] text-white/55">место по треку</span>
        </div>
      </div>

      <div className="grid md:grid-cols-[2fr_1fr] gap-5 items-start">
        <div>
          <p className="text-[11px] font-bold tracking-[.1em] uppercase text-[#6b6f76] mb-3">Путь обучения</p>
          {modules.map((m) => {
            const ls = lessons.filter((l) => l.moduleId === m.id);
            const modDone = ls.filter((l) => l.status === "done").length;
            return (
              <div key={m.id} className="mb-5.5">
                <div className="flex justify-between items-baseline mb-2 pl-0.5">
                  <h3 className="text-[13px] font-bold tracking-[-.01em] text-[#15171c]">{m.title}</h3>
                  <span className="text-[11px] text-[#6b6f76] font-semibold">
                    {modDone}/{ls.length}
                  </span>
                </div>
                <div className="relative pl-0.5">
                  <div className="absolute left-[19px] top-5 bottom-5 w-0.5 bg-[rgba(21,23,28,.1)]" />
                  {ls.map((l) => {
                    const icon = l.status === "done" ? "✓" : l.status === "current" ? "▶" : "🔒";
                    const sub = l.status === "done" ? "Пройден" : l.status === "current" ? "Сейчас проходишь" : "Заблокирован";
                    const nodeClass =
                      l.status === "done"
                        ? "bg-[#16a34a] text-white"
                        : l.status === "current"
                        ? "bg-[#15171c] text-[#ffb100] shadow-[0_0_0_4px_rgba(22,163,74,.18)]"
                        : "bg-[#f6f4ee] text-[#a8a49b] border border-[rgba(21,23,28,.1)]";
                    return (
                      <Link
                        key={l.id}
                        href={`/app/lesson/${l.id}`}
                        className={`flex items-center gap-3.5 py-2.5 px-2.5 rounded-[13px] relative ${
                          l.status === "current" ? "bg-[#16a34a]/[.06]" : ""
                        }`}
                      >
                        <span className={`w-[34px] h-[34px] rounded-full grid place-items-center text-[13px] shrink-0 relative z-10 ${nodeClass}`}>
                          {icon}
                        </span>
                        <div>
                          <strong className={`text-[13px] block ${l.status === "upcoming" ? "font-medium text-[#a8a49b]" : "font-bold text-[#15171c]"}`}>
                            {l.title}
                          </strong>
                          <span className={`text-[11px] block ${l.status === "upcoming" ? "text-[#a8a49b]" : "text-[#6b6f76]"}`}>{sub}</span>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        <div className="grid gap-3.5">
          <Card className="rounded-[20px] p-5">
            <Link href="/app/leaderboard" className="text-[#16a34a] text-[10.5px] font-bold tracking-[.1em] uppercase mb-3 block">
              Топ по треку →
            </Link>
            <div className="grid gap-1.5">
              <div className="flex items-center gap-2">
                <span className="w-4 font-extrabold text-[11.5px] text-[#ffb100]">1</span>
                <span className="flex-1 text-xs font-semibold">Мира К.</span>
                <span className="text-[11px] text-[#6b6f76]">12/12</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-4 font-extrabold text-[11.5px] text-[#6b6f76]">2</span>
                <span className="flex-1 text-xs font-semibold">Полина Р.</span>
                <span className="text-[11px] text-[#6b6f76]">11/12</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-4 font-extrabold text-[11.5px] text-[#6b6f76]">3</span>
                <span className="flex-1 text-xs font-semibold">Данил С.</span>
                <span className="text-[11px] text-[#6b6f76]">10/12</span>
              </div>
              <div className="flex items-center gap-2 bg-[#16a34a]/[.07] rounded-[9px] py-1 px-1.5 -mx-1.5">
                <span className="w-4 font-extrabold text-[11.5px] text-[#16a34a]">7</span>
                <span className="flex-1 text-xs font-bold">Ты</span>
                <span className="text-[11px] text-[#16a34a] font-bold">
                  {doneCount}/{totalCount}
                </span>
              </div>
            </div>
          </Card>

          <Card className="rounded-[20px] p-5">
            <p className="text-[#6b6f76] text-[10.5px] font-bold tracking-[.1em] uppercase mb-3">Навыки трека</p>
            <div className="flex flex-wrap gap-1.5">
              <span className="text-[11px] bg-[#16a34a] text-white rounded-full py-1.5 px-2.5">ML базовый</span>
              <span className="text-[11px] bg-[#f6f4ee] rounded-full py-1.5 px-2.5">Работа с данными</span>
              <span className="text-[11px] bg-[#f6f4ee] text-[#a8a49b] rounded-full py-1.5 px-2.5">Метрики качества</span>
              <span className="text-[11px] bg-[#f6f4ee] text-[#a8a49b] rounded-full py-1.5 px-2.5">Этика AI</span>
            </div>
          </Card>

          <div className="rounded-[20px] bg-[#ffb100] p-5">
            <p className="text-[#15171c]/60 text-[10.5px] font-bold tracking-[.1em] uppercase mb-2">Следующий бейдж</p>
            <h3 className="text-sm font-extrabold mb-2.5">«Половина пути» — за 6/12 уроков</h3>
            <div className="h-[7px] rounded-full bg-[rgba(21,23,28,.15)]">
              <span className="block h-full w-[83%] rounded-full bg-[#15171c]" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
