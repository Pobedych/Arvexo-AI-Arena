import Link from "next/link";
import { currentLesson, currentLessonIndex, currentLessonModule, trackPct } from "@/lib/mockData";
import { Eyebrow, Card } from "@/components/ui";

const days = [
  { label: "Пн", h: 34, active: true },
  { label: "Вт", h: 58, active: true },
  { label: "Ср", h: 14, active: false },
  { label: "Чт", h: 44, active: true },
  { label: "Пт", h: 70, dark: true },
  { label: "Сб", h: 14, active: false },
  { label: "Вс", h: 24, active: false },
];

export default function Dashboard() {
  return (
    <div>
      <Eyebrow>Твоя арена</Eyebrow>
      <h1 className="font-[family-name:var(--font-display)] text-[clamp(30px,4vw,50px)] font-semibold tracking-[-.02em] mb-7">
        С возвращением, Андрей
      </h1>

      <div className="grid md:grid-cols-[1.5fr_1fr] gap-3.5 mb-3.5">
        <Card className="rounded-[28px] p-7 flex flex-col shadow-[0_20px_48px_-38px_rgba(21,23,28,.35)]">
          <Eyebrow>Продолжить</Eyebrow>
          <h2 className="font-[family-name:var(--font-display)] text-[26px] font-semibold tracking-[-.015em] mb-2.5 max-w-[380px]">
            Урок {currentLessonIndex + 1} — {currentLesson.title}
          </h2>
          <p className="text-[13.5px] text-[#6b6f76] leading-relaxed mb-5 max-w-[340px]">
            {currentLessonModule.title}. Продолжи, чтобы двигаться дальше по треку.
          </p>
          <div className="flex items-center gap-2 mt-auto">
            <Link
              href={`/app/lesson/${currentLesson.id}`}
              className="inline-flex items-center h-11 px-5 rounded-full bg-[#15171c] text-white font-bold text-[13.5px] gap-1.5 hover:opacity-85 transition-opacity"
            >
              Продолжить →
            </Link>
            <span className="text-xs text-[#6b6f76]">{trackPct}% трека готово</span>
          </div>
        </Card>

        <Card dark className="rounded-[28px] p-6.5 shadow-[0_20px_48px_-38px_rgba(21,23,28,.35)]">
          <p className="text-white/50 text-[11px] font-bold tracking-[.12em] uppercase mb-2">Готовность к турниру</p>
          <strong className="font-[family-name:var(--font-display)] text-[56px] font-semibold block leading-[.95] text-[#ffb100]">
            42%
          </strong>
          <div className="h-2 rounded-full bg-white/[.14] my-3.5">
            <span className="block h-full w-[42%] rounded-full bg-[#ffb100]" />
          </div>
          <p className="text-[12.5px] text-white/62 leading-relaxed">Пройди ещё 2 темы, чтобы выйти на арену уверенно.</p>
        </Card>
      </div>

      <div className="grid sm:grid-cols-3 gap-3.5">
        <Card>
          <Link href="/app/leaderboard" className="text-[#16a34a] text-[11px] font-bold tracking-[.12em] uppercase mb-3 block">
            Рейтинг недели →
          </Link>
          <div className="grid gap-2">
            <div className="flex items-center gap-2">
              <span className="w-5 font-extrabold text-xs text-[#ffb100]">1</span>
              <span className="w-6 h-6 rounded-full bg-[#e8e6df]" />
              <strong className="flex-1 text-[12.5px]">Мира К.</strong>
              <span className="text-xs text-[#6b6f76]">98</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-5 font-extrabold text-xs text-[#6b6f76]">2</span>
              <span className="w-6 h-6 rounded-full bg-[#e8e6df]" />
              <strong className="flex-1 text-[12.5px]">Данил С.</strong>
              <span className="text-xs text-[#6b6f76]">94</span>
            </div>
            <div className="flex items-center gap-2 bg-[#16a34a]/[.07] rounded-[10px] py-1 px-2 -mx-2">
              <span className="w-5 font-extrabold text-xs text-[#16a34a]">7</span>
              <span className="w-6 h-6 rounded-full bg-[#16a34a]" />
              <strong className="flex-1 text-[12.5px]">Ты</strong>
              <span className="text-xs text-[#16a34a] font-bold">86</span>
            </div>
          </div>
        </Card>

        <div className="rounded-[24px] bg-[#ffb100] p-5 shadow-[0_14px_36px_-32px_rgba(21,23,28,.3)]">
          <p className="text-[#15171c]/55 text-[11px] font-bold tracking-[.12em] uppercase mb-2">20 июля · 60 мин</p>
          <h3 className="text-[16px] font-extrabold tracking-[-.015em] mb-3.5">AI Basics Tournament</h3>
          <Link
            href="/app/tournament"
            className="inline-flex items-center h-[38px] px-3.5 rounded-full bg-[#15171c] text-[#ffb100] font-bold text-[12.5px] hover:opacity-85 transition-opacity"
          >
            Участвовать →
          </Link>
        </div>

        <Card>
          <p className="text-[#6b6f76] text-[11px] font-bold tracking-[.12em] uppercase mb-3">Бейджи</p>
          <div className="flex gap-2">
            <span className="w-9.5 h-9.5 rounded-xl bg-[#15171c] grid place-items-center text-base">🔥</span>
            <span className="w-9.5 h-9.5 rounded-xl bg-[#16a34a] grid place-items-center text-base">🧠</span>
            <span className="w-9.5 h-9.5 rounded-xl bg-[rgba(21,23,28,.08)] grid place-items-center text-base opacity-40">🏆</span>
          </div>
        </Card>
      </div>

      <div className="grid md:grid-cols-[1.3fr_1fr_1fr] gap-3.5 mt-3.5">
        <Card>
          <div className="flex justify-between items-baseline mb-4">
            <p className="text-[#6b6f76] text-[11px] font-bold tracking-[.12em] uppercase">Активность за неделю</p>
            <strong className="text-xs text-[#16a34a]">4 из 7 дней</strong>
          </div>
          <div className="flex items-end gap-2.5 h-[76px] mb-2.5">
            {days.map((d) => (
              <div key={d.label} className="flex-1 flex flex-col items-center gap-1.5">
                <div
                  className="w-full rounded-[7px]"
                  style={{ height: `${d.h}px`, background: d.dark ? "#15171c" : d.active ? "#16a34a" : "rgba(21,23,28,.08)" }}
                />
                <span className="text-[10px] text-[#a8a49b]">{d.label}</span>
              </div>
            ))}
          </div>
          <p className="text-[11.5px] text-[#6b6f76]">В среднем 18 минут в день · рекорд серии 6 дней</p>
        </Card>

        <Card>
          <p className="text-[#6b6f76] text-[11px] font-bold tracking-[.12em] uppercase mb-3.5">Ближайшее</p>
          <div className="grid gap-2.5">
            <div className="flex gap-2.5 items-center">
              <span className="w-8.5 h-8.5 rounded-[10px] bg-[#f6f4ee] grid place-items-center text-sm shrink-0">📘</span>
              <div>
                <strong className="text-[12.5px] block">
                  Урок {currentLessonIndex + 1} — {currentLesson.title}
                </strong>
                <span className="text-[11px] text-[#6b6f76]">Сегодня</span>
              </div>
            </div>
            <div className="flex gap-2.5 items-center">
              <span className="w-8.5 h-8.5 rounded-[10px] bg-[#f6f4ee] grid place-items-center text-sm shrink-0">🏁</span>
              <div>
                <strong className="text-[12.5px] block">AI Basics Tournament</strong>
                <span className="text-[11px] text-[#6b6f76]">20 июля · 10:00</span>
              </div>
            </div>
            <div className="flex gap-2.5 items-center">
              <span className="w-8.5 h-8.5 rounded-[10px] bg-[#f6f4ee] grid place-items-center text-sm shrink-0">🔔</span>
              <div>
                <strong className="text-[12.5px] block">Повторение метрик</strong>
                <span className="text-[11px] text-[#6b6f76]">Напоминание завтра</span>
              </div>
            </div>
          </div>
        </Card>

        <Card>
          <p className="text-[#6b6f76] text-[11px] font-bold tracking-[.12em] uppercase mb-3.5">Последние события</p>
          <div className="grid gap-2.5">
            <div className="flex gap-2 items-start">
              <span className="w-1.5 h-1.5 rounded-full bg-[#16a34a] mt-1.5 shrink-0" />
              <span className="text-xs leading-relaxed">
                Прошёл урок «Признаки и target» <span className="text-[#a8a49b]">· 2ч назад</span>
              </span>
            </div>
            <div className="flex gap-2 items-start">
              <span className="w-1.5 h-1.5 rounded-full bg-[#ffb100] mt-1.5 shrink-0" />
              <span className="text-xs leading-relaxed">
                Получил бейдж «7 дней подряд» <span className="text-[#a8a49b]">· вчера</span>
              </span>
            </div>
            <div className="flex gap-2 items-start">
              <span className="w-1.5 h-1.5 rounded-full bg-[#16a34a] mt-1.5 shrink-0" />
              <span className="text-xs leading-relaxed">
                Завершил модуль «Введение в AI» <span className="text-[#a8a49b]">· 3 дня назад</span>
              </span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
