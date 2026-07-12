"use client";

import { deterministicShuffledIndices, type Question } from "@/lib/api";

type Props = {
  question: Question;
  value: number[];
  onChange: (value: number[]) => void;
  disabled?: boolean;
};

export default function MatchingPairs({ question, value, onChange, disabled = false }: Props) {
  const left = question.options ?? [];
  const configuredRight = question.configuration?.right;
  const right = Array.isArray(configuredRight) ? configuredRight.filter((item): item is string => typeof item === "string") : [];
  const rightOrder = deterministicShuffledIndices(`${question.id}:right`, right.length);

  return (
    <fieldset className="grid gap-3">
      <legend className="sr-only">Сопоставьте элементы</legend>
      {left.map((term, index) => (
        <label key={`${term}-${index}`} className="grid gap-1.5 rounded-[13px] border border-[rgba(21,23,28,.08)] bg-[#f6f4ee] p-3 sm:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)] sm:items-center sm:gap-4">
          <span className="text-[13.5px] font-bold">{term}</span>
          <select
            disabled={disabled}
            value={value[index] ?? -1}
            onChange={(event) => {
              const next = [...value];
              next[index] = Number(event.target.value);
              onChange(next);
            }}
            className="h-10 min-w-0 rounded-[10px] border border-[rgba(21,23,28,.12)] bg-white px-3 text-[13px] focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-[#16a34a]"
            aria-label={`Соответствие для «${term}»`}
          >
            <option value={-1}>Выберите соответствие</option>
            {rightOrder.map((rightIndex) => (
              <option key={rightIndex} value={rightIndex}>{right[rightIndex]}</option>
            ))}
          </select>
        </label>
      ))}
    </fieldset>
  );
}
