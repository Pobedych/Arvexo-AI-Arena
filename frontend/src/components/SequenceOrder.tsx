"use client";

type Props = {
  options: string[];
  order: number[];
  onChange: (order: number[]) => void;
  disabled?: boolean;
};

export default function SequenceOrder({ options, order, onChange, disabled = false }: Props) {
  function move(position: number, direction: -1 | 1) {
    const target = position + direction;
    if (target < 0 || target >= order.length) return;
    const next = [...order];
    [next[position], next[target]] = [next[target], next[position]];
    onChange(next);
  }

  return (
    <ol className="grid gap-2.5" aria-label="Элементы последовательности">
      {order.map((optionIndex, position) => (
        <li key={optionIndex} className="grid grid-cols-[32px_1fr_auto] items-center gap-3 rounded-[13px] border border-[rgba(21,23,28,.08)] bg-[#f6f4ee] py-2.5 px-3">
          <span aria-hidden="true" className="grid h-7 w-7 place-items-center rounded-full bg-white text-xs font-extrabold text-[#16a34a]">
            {position + 1}
          </span>
          <span className="text-[13.5px] font-medium">{options[optionIndex]}</span>
          <span className="flex gap-1">
            <button
              type="button"
              disabled={disabled || position === 0}
              onClick={() => move(position, -1)}
              aria-label={`Переместить «${options[optionIndex]}» выше`}
              className="grid h-8 w-8 place-items-center rounded-lg bg-white font-bold hover:bg-[#eef7ec] focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-[#16a34a] disabled:opacity-30"
            >
              ↑
            </button>
            <button
              type="button"
              disabled={disabled || position === order.length - 1}
              onClick={() => move(position, 1)}
              aria-label={`Переместить «${options[optionIndex]}» ниже`}
              className="grid h-8 w-8 place-items-center rounded-lg bg-white font-bold hover:bg-[#eef7ec] focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-[#16a34a] disabled:opacity-30"
            >
              ↓
            </button>
          </span>
        </li>
      ))}
    </ol>
  );
}
