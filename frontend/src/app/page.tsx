import Link from "next/link";

const competitors = [
  { name: "Stepik", gap: "Курсы без турнира — некому показать результат" },
  { name: "Kaggle", gap: "Для специалистов — нет пути для новичка" },
  { name: "Duolingo", gap: "Стрики и лиги — но не про профессиональный навык" },
  { name: "YouTube", gap: "Смотришь — но никто не проверит, что ты понял" },
];

const stats = [
  { value: "1,204", label: "учатся сейчас" },
  { value: "42", label: "турнира в месяц" },
  { value: "12", label: "уроков в AI Track" },
  { value: "100%", label: "автопроверка" },
];

const benefits = [
  {
    title: "Настоящий статус",
    text: "Место в рейтинге и сертификат турнира — то, что можно показать вузу или работодателю.",
  },
  {
    title: "10–20 минут в день",
    text: "Уроки короче серии в игре, но продвигают тебя к цели, а не просто убивают время.",
  },
  {
    title: "Видно, что ты умеешь",
    text: "Работодатели видят разбор твоих турнирных ответов, а не строчку самооценки в резюме.",
  },
];

export default function Landing() {
  return (
    <div className="min-h-screen bg-white">
      {/* nav */}
      <div className="sticky top-4 z-40 flex justify-center px-6 pt-2.5">
        <div className="flex items-center gap-1.5 w-full max-w-[680px] py-2 pl-4.5 pr-2 rounded-full bg-[#15171c] shadow-[0_18px_44px_-22px_rgba(21,23,28,.55)]">
          <Link href="/" className="flex items-center gap-2.5 mr-auto">
            <span className="w-[26px] h-[26px] rounded-[7px] bg-[#16a34a] grid place-items-center text-white font-extrabold text-xs font-[family-name:var(--font-display)]">
              A
            </span>
            <strong className="text-[13.5px] tracking-tight text-white">Arvexo Arena</strong>
          </Link>
          <Link href="/tracks/ai" className="text-[12.5px] text-white/60 font-medium py-2 px-3 rounded-full hover:text-white hover:bg-white/10 transition-colors">
            AI Track
          </Link>
          <Link href="/tournaments" className="text-[12.5px] text-white/60 font-medium py-2 px-3 rounded-full hover:text-white hover:bg-white/10 transition-colors">
            Турниры
          </Link>
          <Link href="/employers" className="text-[12.5px] text-white/60 font-medium py-2 px-3 rounded-full hover:text-white hover:bg-white/10 transition-colors">
            Работодателям
          </Link>
          <Link
            href="/login"
            className="inline-flex items-center h-9 px-4.5 rounded-full bg-[#16a34a] text-white font-bold text-[12.5px] whitespace-nowrap hover:opacity-88 transition-opacity"
          >
            Войти
          </Link>
        </div>
      </div>

      {/* hero */}
      <div className="w-[min(760px,calc(100%-48px))] mx-auto pt-18 text-center">
        <h1 className="font-[family-name:var(--font-display)] text-[clamp(38px,5.2vw,64px)] font-semibold tracking-[-.03em] leading-[1.06] mb-5 text-[#15171c]">
          Учись. Соревнуйся. Докажи, что умеешь.
        </h1>
        <p className="max-w-[520px] mx-auto mb-9 text-[17px] leading-relaxed text-[#6b6f76]">
          Stepik учит, Kaggle — для профи, Duolingo — про язык. У Arvexo Arena после урока есть турнир, а результат видят вуз и работодатель.
        </p>
        <div className="flex gap-3 justify-center flex-wrap mb-11">
          <Link
            href="/onboarding"
            className="inline-flex items-center h-12 px-6.5 rounded-[10px] bg-[#16a34a] text-white font-bold text-[14.5px] hover:opacity-90 transition-opacity"
          >
            Начать бесплатно
          </Link>
          <Link
            href="/tournaments"
            className="inline-flex items-center h-12 px-6 rounded-[10px] border border-[rgba(21,23,28,.16)] text-[#15171c] font-semibold text-[14.5px] hover:bg-[#f6f4ee] transition-colors"
          >
            Смотреть турниры
          </Link>
        </div>
      </div>

      {/* competitor comparison */}
      <div className="w-[min(980px,calc(100%-48px))] mx-auto pb-18">
        <div className="grid grid-cols-2 sm:grid-cols-5 border border-[rgba(21,23,28,.1)] rounded-2xl overflow-hidden">
          {competitors.map((c) => (
            <div key={c.name} className="p-5 border-r border-b sm:border-b-0 border-[rgba(21,23,28,.1)] last:border-r-0">
              <p className="text-[12.5px] font-bold mb-1.5 text-[#15171c]">{c.name}</p>
              <p className="text-[11.5px] text-[#6b6f76] leading-relaxed">{c.gap}</p>
            </div>
          ))}
          <div className="p-5 bg-[#16a34a] col-span-2 sm:col-span-1">
            <p className="text-[12.5px] font-bold mb-1.5 text-white">Arvexo Arena</p>
            <p className="text-[11.5px] text-white/85 leading-relaxed">Урок → турнир → результат, который видят другие</p>
          </div>
        </div>
      </div>

      {/* stat strip */}
      <div className="border-t border-b border-[rgba(21,23,28,.08)]">
        <div className="w-[min(1120px,calc(100%-48px))] mx-auto grid grid-cols-2 sm:grid-cols-4">
          {stats.map((s, i) => (
            <div
              key={s.label}
              className={`py-6.5 px-5 text-center ${i < stats.length - 1 ? "sm:border-r" : ""} border-[rgba(21,23,28,.08)]`}
            >
              <strong className="font-[family-name:var(--font-display)] text-[26px] font-semibold block text-[#15171c]">
                {s.value}
              </strong>
              <span className="text-xs text-[#6b6f76]">{s.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* why not just games */}
      <div className="w-[min(920px,calc(100%-48px))] mx-auto pt-22 pb-2">
        <div className="text-center max-w-[560px] mx-auto mb-14">
          <h2 className="font-[family-name:var(--font-display)] text-[clamp(26px,3.2vw,38px)] font-semibold tracking-[-.02em] leading-tight mb-3.5 text-[#15171c]">
            Тот же азарт победы. Только на кону — реальный навык
          </h2>
          <p className="text-[15px] text-[#6b6f76] leading-relaxed">
            В играх ты прокачиваешь персонажа. Здесь — свои знания, которые видно в резюме и на собеседовании.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 border border-[rgba(21,23,28,.1)] rounded-[14px] overflow-hidden mb-14">
          <div className="p-8 sm:border-r border-b sm:border-b-0 border-[rgba(21,23,28,.1)]">
            <p className="text-[11px] font-bold tracking-[.08em] uppercase text-[#a8a49b] mb-4.5">Обычная игра</p>
            <div className="grid gap-3">
              {[
                "Прогресс исчезает, как только удаляешь приложение",
                "Соревнуешься за виртуальные очки и скины",
                "Никто не увидит и не оценит твой результат",
              ].map((t) => (
                <div key={t} className="flex gap-2.5 items-start">
                  <span className="text-[#c7c4bb]">–</span>
                  <span className="text-[13.5px] text-[#6b6f76] leading-relaxed">{t}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="p-8">
            <p className="text-[11px] font-bold tracking-[.08em] uppercase text-[#16a34a] mb-4.5">Arvexo Arena</p>
            <div className="grid gap-3">
              {[
                "Прогресс сохраняется в профиле и растёт с каждым уроком",
                "Соревнуешься за реальный рейтинг и место в турнире",
                "Результаты видят работодатели и приёмные комиссии",
              ].map((t) => (
                <div key={t} className="flex gap-2.5 items-start">
                  <span className="text-[#16a34a] font-bold">✓</span>
                  <span className="text-[13.5px] text-[#15171c] leading-relaxed">{t}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="grid sm:grid-cols-3 border-t border-[rgba(21,23,28,.1)] mb-14">
          {benefits.map((b, i) => (
            <div
              key={b.title}
              className={`py-7 ${i === 0 ? "pr-6 sm:border-r" : i === 1 ? "px-6 sm:border-r" : "pl-6 sm:pl-6"} border-[rgba(21,23,28,.1)]`}
            >
              <h3 className="text-[14.5px] font-bold mb-2 text-[#15171c]">{b.title}</h3>
              <p className="text-[12.5px] text-[#6b6f76] leading-relaxed">{b.text}</p>
            </div>
          ))}
        </div>

        <div className="border-l-2 border-[#15171c] pl-6 py-1 mb-16">
          <p className="font-[family-name:var(--font-display)] italic text-[clamp(16px,1.8vw,20px)] font-medium leading-relaxed text-[#15171c] mb-3 max-w-[600px]">
            «Взял игрока в стажировку после того, как увидел его разбор на AI Basics Tournament — это было честнее, чем строчка в резюме»
          </p>
          <span className="text-[12.5px] text-[#6b6f76]">— HR, из тех, кто нанимает через Arvexo</span>
        </div>
      </div>

      {/* final CTA */}
      <div className="border-t border-[rgba(21,23,28,.08)]">
        <div className="w-[min(760px,calc(100%-48px))] mx-auto py-18 text-center">
          <h2 className="font-[family-name:var(--font-display)] text-[clamp(24px,3vw,32px)] font-semibold tracking-[-.02em] mb-6 text-[#15171c]">
            Первый урок — сегодня, первый турнир — через неделю
          </h2>
          <Link
            href="/onboarding"
            className="inline-flex items-center h-12.5 px-7 rounded-[10px] bg-[#16a34a] text-white font-bold text-[15px] hover:opacity-90 transition-opacity"
          >
            Зарегистрироваться бесплатно
          </Link>
        </div>
      </div>
    </div>
  );
}
