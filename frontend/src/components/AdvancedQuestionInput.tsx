"use client";

import SequenceOrder from "@/components/SequenceOrder";
import { isNumberArray, isStringArray, sequenceInitialOrder, type AnswerValue, type Question } from "@/lib/api";

type Props = {
  question: Question;
  value: AnswerValue | undefined;
  onChange: (value: AnswerValue) => void;
  disabled?: boolean;
};

function numberConfig(question: Question, key: string, fallback: number) {
  const value = question.configuration?.[key];
  return typeof value === "number" && Number.isFinite(value) ? value : fallback;
}

export function isAdvancedQuestion(type: string) {
  return ["fill_blanks", "table_select", "code_order", "code_output", "code_fix", "image_hotspot", "graph_point", "number_line", "slider_experiment"].includes(type);
}

export function initialAdvancedValue(question: Question): AnswerValue | undefined {
  if (question.type === "fill_blanks") {
    const template = typeof question.configuration?.template === "string" ? question.configuration.template : "";
    return Array.from({ length: Math.max(0, template.split("___").length - 1) }, () => "");
  }
  if (question.type === "table_select") return [] as string[];
  if (question.type === "code_order") return sequenceInitialOrder(question);
  if (question.type === "code_fix") return typeof question.configuration?.code === "string" ? question.configuration.code : "";
  return undefined;
}

export function hasAdvancedAnswer(question: Question, value: AnswerValue | undefined) {
  if (question.type === "fill_blanks") return isStringArray(value) && value.length > 0 && value.every((item) => item.trim());
  if (question.type === "table_select") return isStringArray(value) && value.length > 0;
  if (question.type === "code_order") return isNumberArray(value) && value.length === (question.options?.length ?? 0);
  if (question.type === "image_hotspot" || question.type === "graph_point") return isNumberArray(value) && value.length === 2;
  if (question.type === "number_line" || question.type === "slider_experiment") return typeof value === "number";
  return typeof value === "string" && value.trim().length > 0;
}

export default function AdvancedQuestionInput({ question, value, onChange, disabled = false }: Props) {
  if (question.type === "fill_blanks") {
    const template = typeof question.configuration?.template === "string" ? question.configuration.template : "";
    const parts = template.split("___");
    const answers = isStringArray(value) ? value : Array.from({ length: Math.max(0, parts.length - 1) }, () => "");
    return (
      <div className="rounded-[14px] border border-[rgba(21,23,28,.08)] bg-[#f6f4ee] p-4 text-[14px] leading-[2.5]">
        {parts.map((part, index) => (
          <span key={index}>
            {part}
            {index < parts.length - 1 && (
              <input
                disabled={disabled}
                value={answers[index] ?? ""}
                onChange={(event) => {
                  const next = [...answers];
                  next[index] = event.target.value;
                  onChange(next);
                }}
                aria-label={`Пропуск ${index + 1}`}
                className="mx-1 h-9 min-w-[120px] max-w-[220px] rounded-[9px] border border-[rgba(21,23,28,.15)] bg-white px-3 text-[13px] font-semibold outline-none focus:border-[#16a34a]"
              />
            )}
          </span>
        ))}
      </div>
    );
  }

  if (question.type === "table_select") {
    const columns = Array.isArray(question.configuration?.columns) ? question.configuration.columns.filter((item): item is string => typeof item === "string") : [];
    const rows = Array.isArray(question.configuration?.rows) ? question.configuration.rows.filter((row): row is string[] => Array.isArray(row) && row.every((item) => typeof item === "string")) : [];
    const selected = isStringArray(value) ? value : [];
    return (
      <div className="overflow-x-auto rounded-[14px] border border-[rgba(21,23,28,.1)]">
        <table className="w-full min-w-[460px] border-collapse text-[13px]">
          <thead><tr>{columns.map((column) => <th key={column} className="border-b border-r border-[rgba(21,23,28,.08)] bg-[#eef7ec] px-3 py-2.5 text-left last:border-r-0">{column}</th>)}</tr></thead>
          <tbody>{rows.map((row, rowIndex) => <tr key={rowIndex}>{row.map((cell, columnIndex) => {
            const key = `${rowIndex}:${columnIndex}`;
            const active = selected.includes(key);
            return <td key={key} className="border-b border-r border-[rgba(21,23,28,.07)] p-1.5 last:border-r-0"><button type="button" disabled={disabled} aria-pressed={active} onClick={() => onChange(active ? selected.filter((item) => item !== key) : [...selected, key])} className={`w-full rounded-[9px] px-2 py-2.5 text-left transition-colors ${active ? "bg-[#16a34a] text-white" : "hover:bg-[#f6f4ee]"}`}>{cell}</button></td>;
          })}</tr>)}</tbody>
        </table>
      </div>
    );
  }

  if (question.type === "code_order" && question.options) {
    return <SequenceOrder options={question.options} order={isNumberArray(value) ? value : sequenceInitialOrder(question)} disabled={disabled} onChange={onChange} />;
  }

  if (question.type === "code_output") {
    return <CodeTextTask code={String(question.configuration?.code ?? "")} value={typeof value === "string" ? value : ""} onChange={onChange} disabled={disabled} mode="output" />;
  }

  if (question.type === "code_fix") {
    return <CodeTextTask code={String(question.configuration?.code ?? "")} value={typeof value === "string" ? value : String(question.configuration?.code ?? "")} onChange={onChange} disabled={disabled} mode="fix" />;
  }

  if (question.type === "image_hotspot") {
    return <ImageHotspot question={question} value={isNumberArray(value) ? value : []} onChange={onChange} disabled={disabled} />;
  }

  if (question.type === "graph_point") {
    return <GraphPoint question={question} value={isNumberArray(value) ? value : []} onChange={onChange} disabled={disabled} />;
  }

  if (question.type === "number_line" || question.type === "slider_experiment") {
    const min = numberConfig(question, "min", 0);
    const max = numberConfig(question, "max", 100);
    const step = numberConfig(question, "step", 1);
    const current = typeof value === "number" ? value : min;
    const unit = typeof question.configuration?.unit === "string" ? question.configuration.unit : "";
    return (
      <div className="rounded-[14px] border border-[rgba(21,23,28,.08)] bg-[#f6f4ee] p-4">
        <div className="mb-3 flex items-end justify-between gap-4"><span className="text-[11px] font-bold text-[#6b6f76]">{min}{unit}</span><strong className="rounded-full bg-white px-3 py-1.5 text-[14px] text-[#15803d]">{current}{unit}</strong><span className="text-[11px] font-bold text-[#6b6f76]">{max}{unit}</span></div>
        <input type="range" min={min} max={max} step={step} value={current} disabled={disabled} onChange={(event) => onChange(Number(event.target.value))} className="w-full accent-[#16a34a]" aria-label={question.type === "number_line" ? "Точка на числовой прямой" : "Параметр эксперимента"} />
        {question.type === "slider_experiment" && typeof question.configuration?.observation === "string" && <p className="mt-3 text-[12px] text-[#6b6f76]">{question.configuration.observation.replace("{value}", String(current))}</p>}
      </div>
    );
  }

  return null;
}

function CodeTextTask({ code, value, onChange, disabled, mode }: { code: string; value: string; onChange: (value: string) => void; disabled: boolean; mode: "output" | "fix" }) {
  return <div className="grid gap-3"><pre className="overflow-x-auto rounded-[13px] bg-[#15171c] p-4 font-mono text-[13px] leading-relaxed text-white"><code>{code}</code></pre>{mode === "output" ? <input disabled={disabled} value={value} onChange={(event) => onChange(event.target.value)} className="h-11 rounded-[13px] border border-[rgba(21,23,28,.1)] bg-[#f6f4ee] px-4 text-[13.5px] outline-none focus:border-[#16a34a]" placeholder="Что выведет программа?" /> : <textarea disabled={disabled} value={value} onChange={(event) => onChange(event.target.value)} spellCheck={false} rows={9} className="rounded-[13px] bg-[#15171c] px-4 py-3 font-mono text-[13px] leading-relaxed text-white outline-none focus:ring-1 focus:ring-[#16a34a]" aria-label="Исправленный код" />}</div>;
}

function ImageHotspot({ question, value, onChange, disabled }: { question: Question; value: number[]; onChange: (value: number[]) => void; disabled: boolean }) {
  const url = String(question.configuration?.image_url ?? "");
  return <button type="button" disabled={disabled} onClick={(event) => { const rect = event.currentTarget.getBoundingClientRect(); onChange([(event.clientX - rect.left) / rect.width, (event.clientY - rect.top) / rect.height]); }} className="relative block aspect-video w-full overflow-hidden rounded-[16px] border border-[rgba(21,23,28,.12)] bg-[#ece9df] bg-contain bg-center bg-no-repeat" style={{ backgroundImage: `url(${JSON.stringify(url)})` }} aria-label="Выберите область изображения">{value.length === 2 && <span className="absolute h-5 w-5 -translate-x-1/2 -translate-y-1/2 rounded-full border-[3px] border-white bg-[#ff4d3d] shadow" style={{ left: `${value[0] * 100}%`, top: `${value[1] * 100}%` }} />}</button>;
}

function GraphPoint({ question, value, onChange, disabled }: { question: Question; value: number[]; onChange: (value: number[]) => void; disabled: boolean }) {
  const xMin = numberConfig(question, "x_min", -5), xMax = numberConfig(question, "x_max", 5), yMin = numberConfig(question, "y_min", -5), yMax = numberConfig(question, "y_max", 5);
  const toX = (x: number) => ((x - xMin) / (xMax - xMin)) * 100;
  const toY = (y: number) => 100 - ((y - yMin) / (yMax - yMin)) * 100;
  return <button type="button" disabled={disabled} onClick={(event) => { const rect = event.currentTarget.getBoundingClientRect(); const x = xMin + ((event.clientX - rect.left) / rect.width) * (xMax - xMin); const y = yMax - ((event.clientY - rect.top) / rect.height) * (yMax - yMin); onChange([Number(x.toFixed(3)), Number(y.toFixed(3))]); }} className="relative block aspect-[16/10] w-full overflow-hidden rounded-[16px] border border-[rgba(21,23,28,.12)] bg-[linear-gradient(rgba(21,23,28,.06)_1px,transparent_1px),linear-gradient(90deg,rgba(21,23,28,.06)_1px,transparent_1px)] bg-[size:10%_10%]" aria-label="Выберите точку на графике"><span className="absolute left-0 right-0 h-px bg-[#6b6f76]" style={{ top: `${toY(0)}%` }} /><span className="absolute bottom-0 top-0 w-px bg-[#6b6f76]" style={{ left: `${toX(0)}%` }} />{value.length === 2 && <span className="absolute h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#ff4d3d] ring-4 ring-white" style={{ left: `${toX(value[0])}%`, top: `${toY(value[1])}%` }} />}<span className="absolute bottom-2 right-3 rounded bg-white/80 px-2 py-1 text-[11px] font-bold">{value.length === 2 ? `(${value[0]}; ${value[1]})` : "Нажмите на график"}</span></button>;
}
