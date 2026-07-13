"use client";

import { type Question } from "@/lib/api";

type Props = {
  question: Question;
  value: number[];
  onChange: (value: number[]) => void;
  disabled?: boolean;
};

export default function GroupSort({ question, value, onChange, disabled = false }: Props) {
  const cards = question.options ?? [];
  const configuredCategories = question.configuration?.categories;
  const categories = Array.isArray(configuredCategories)
    ? configuredCategories.filter((item): item is string => typeof item === "string")
    : [];

  return (
    <fieldset className="grid gap-3">
      <legend className="sr-only">Распределите карточки по категориям</legend>
      <div className="flex flex-wrap gap-2" aria-hidden="true">
        {categories.map((category, index) => (
          <span key={`${category}-${index}`} className="rounded-full bg-[#eef7ec] px-3 py-1.5 text-[11px] font-extrabold text-[#15803d]">
            {category}
          </span>
        ))}
      </div>
      <div className="grid gap-2.5 sm:grid-cols-2">
        {cards.map((card, cardIndex) => (
          <label key={`${card}-${cardIndex}`} className="grid gap-2 rounded-[14px] border border-[rgba(21,23,28,.08)] bg-[#f6f4ee] p-3.5">
            <span className="text-[13.5px] font-bold leading-snug">{card}</span>
            <select
              disabled={disabled}
              value={value[cardIndex] ?? -1}
              onChange={(event) => {
                const next = [...value];
                next[cardIndex] = Number(event.target.value);
                onChange(next);
              }}
              className="h-10 min-w-0 rounded-[10px] border border-[rgba(21,23,28,.12)] bg-white px-3 text-[13px] focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-[#16a34a]"
              aria-label={`Категория для «${card}»`}
            >
              <option value={-1}>Выберите категорию</option>
              {categories.map((category, categoryIndex) => (
                <option key={`${category}-${categoryIndex}`} value={categoryIndex}>{category}</option>
              ))}
            </select>
          </label>
        ))}
      </div>
    </fieldset>
  );
}
