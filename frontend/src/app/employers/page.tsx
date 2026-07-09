import Link from "next/link";

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
          Каждый результат — реальная попытка на турнире с автопроверкой, а не самооценка в резюме. Раздел находится в разработке: доступ к базе кандидатов и публичным результатам турниров появится позже.
        </p>

        <div className="rounded-2xl border border-[rgba(21,23,28,.08)] p-6 max-w-[560px]">
          <strong className="text-[14.5px] block mb-1.5">Хотите узнавать о готовых кандидатах первыми?</strong>
          <p className="text-[13px] text-[#6b6f76] leading-relaxed">
            Напишите нам, и мы подключим вас, когда раздел для работодателей откроется.
          </p>
        </div>
      </div>
    </div>
  );
}
