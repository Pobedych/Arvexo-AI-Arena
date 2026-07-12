"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useMemo, useState, type MouseEvent } from "react";
import { api, toApiAnswer, type AnswerValue, type ChartData, type GraphPointValue, type Lesson, type Question } from "@/lib/api";
import MarkdownContent from "@/components/MarkdownContent";

type SubmitResult = {
  score: number;
  max_score: number;
  percent: number;
  completed: boolean;
  results: Array<{ question_id: string; is_correct: boolean; points: number; explanation: string }>;
};

type CheckResult = {
  is_correct: boolean;
  points: number;
  max_points: number;
  explanation: string;
};

export default function LessonPage() {
  const params = useParams<{ lessonId: string }>();
  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [answers, setAnswers] = useState<Record<string, AnswerValue>>({});
  const [previewResults, setPreviewResults] = useState<Record<string, CheckResult>>({});
  const [result, setResult] = useState<SubmitResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api<Lesson>(`/lessons/${params.lessonId}`)
      .then(setLesson)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [params.lessonId]);

  const canSubmit = useMemo(() => lesson?.questions.every((question) => answers[question.id] !== undefined && answers[question.id] !== "") ?? false, [lesson, answers]);

  async function checkQuestion(question: Question) {
    if (!lesson) return;
    try {
      const response = await api<CheckResult>(`/lessons/${lesson.id}/questions/${question.id}/check`, {
        method: "POST",
        body: JSON.stringify({ answer: toApiAnswer(question, answers[question.id]) }),
      });
      setPreviewResults((current) => ({ ...current, [question.id]: response }));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Не удалось проверить ответ");
    }
  }

  async function submit() {
    if (!lesson) return;
    setError(null);
    const payload = {
      answers: lesson.questions.map((question) => ({
        question_id: question.id,
        answer: toApiAnswer(question, answers[question.id]),
      })),
    };
    try {
      const response = await api<SubmitResult>(`/lessons/${lesson.id}/submit`, {
        method: "POST",
        body: JSON.stringify(payload),
      });
      setResult(response);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Не удалось отправить ответы");
    }
  }

  if (loading) {
    return <div className="text-sm text-[#6b6f76]">Загружаем урок...</div>;
  }

  if (!lesson) {
    return (
      <div>
        <p className="text-sm text-[#ff4d3d] mb-3">{error ?? "Урок не найден"}</p>
        <Link href="/app/track" className="text-[#16a34a] text-sm font-bold">К AI Track</Link>
      </div>
    );
  }

  const hasBlocks = lesson.blocks.length > 0;
  let questionCursor = 0;

  return (
    <div>
      <div className="flex justify-between items-center mb-1.5 flex-wrap gap-3">
        <p className="text-[#6b6f76] text-[11px] font-bold tracking-[.12em] uppercase">
          Урок {lesson.order}
        </p>
        <Link href="/app/track" className="text-xs text-[#16a34a] font-bold">
          К треку
        </Link>
      </div>
      <h1 className="font-[family-name:var(--font-display)] text-[clamp(22px,3vw,32px)] font-semibold mb-6">
        {lesson.title}
      </h1>

      {!hasBlocks && (
        <div className="rounded-[24px] bg-white border border-[rgba(21,23,28,.07)] py-7.5 px-8 mb-3.5 shadow-[0_10px_30px_-24px_rgba(21,23,28,.3)]">
          <MarkdownContent content={lesson.theory} />
        </div>
      )}

      {hasBlocks && (
        <div className="grid gap-3.5 mb-3.5">
          {lesson.blocks.map((block) => {
            if (block.kind === "theory") {
              return (
                <div key={block.id} className="rounded-[24px] bg-white border border-[rgba(21,23,28,.07)] py-7.5 px-8 shadow-[0_10px_30px_-24px_rgba(21,23,28,.3)]">
                  <MarkdownContent content={block.theory ?? ""} />
                </div>
              );
            }
            if (!block.question) return null;
            const question = block.question;
            const index = questionCursor++;
            return (
              <div key={block.id} className="rounded-[24px] bg-white border border-[rgba(22,163,74,.18)] p-6.5 shadow-[0_10px_30px_-24px_rgba(22,163,74,.18)]">
                <p className="text-[#16a34a] text-[11px] font-bold tracking-[.12em] uppercase mb-3.5">Мини-проверка</p>
                <QuestionBlock
                  question={question}
                  index={index}
                  value={answers[question.id]}
                  disabled={Boolean(result)}
                  onChange={(value) => setAnswers((current) => ({ ...current, [question.id]: value }))}
                  result={result?.results.find((item) => item.question_id === question.id) ?? previewResults[question.id]}
                />
                {!result && !previewResults[question.id] && (
                  <button
                    onClick={() => checkQuestion(question)}
                    disabled={answers[question.id] === undefined || answers[question.id] === ""}
                    className="inline-flex items-center h-9 px-4 mt-3 rounded-full bg-[#15171c] text-white font-bold text-[12.5px] hover:opacity-85 transition-opacity disabled:opacity-40"
                  >
                    Проверить
                  </button>
                )}
              </div>
            );
          })}
        </div>
      )}

      <div className="rounded-[24px] bg-white border border-[rgba(22,163,74,.18)] p-6.5 shadow-[0_10px_30px_-24px_rgba(22,163,74,.18)]">
        <p className="text-[#16a34a] text-[11px] font-bold tracking-[.12em] uppercase mb-3.5">
          {hasBlocks ? "Итог урока" : "Проверь себя"}
        </p>
        {!hasBlocks && (
          <div className="grid gap-5">
            {lesson.questions.map((question, index) => (
              <QuestionBlock
                key={question.id}
                question={question}
                index={index}
                value={answers[question.id]}
                disabled={Boolean(result)}
                onChange={(value) => setAnswers((current) => ({ ...current, [question.id]: value }))}
                result={result?.results.find((item) => item.question_id === question.id)}
              />
            ))}
          </div>
        )}

        {error && <p className="text-[#ff4d3d] text-xs font-semibold mt-4">{error}</p>}

        {result && (
          <div className={`rounded-[14px] py-3.5 px-4 mt-4 ${result.completed ? "bg-[rgba(22,163,74,.08)] border border-[rgba(22,163,74,.2)]" : "bg-[rgba(255,77,61,.08)] border border-[rgba(255,77,61,.2)]"}`}>
            <strong className={`text-[12.5px] ${result.completed ? "text-[#16a34a]" : "text-[#ff4d3d]"}`}>
              {result.completed ? "Урок завершён." : "Нужно повторить."}
            </strong>{" "}
            <span className="text-[12.5px]">
              {result.score}/{result.max_score} баллов · {result.percent}%
            </span>
          </div>
        )}

        <div className="flex gap-2.5 mt-4.5 flex-wrap">
          {!result && (
            <button
              onClick={submit}
              disabled={!canSubmit}
              className="inline-flex items-center h-[42px] px-5 rounded-full bg-[#16a34a] text-white font-bold text-[13px] hover:opacity-86 transition-opacity disabled:opacity-40"
            >
              Отправить ответы
            </button>
          )}
          {result && (
            <Link href="/app/track" className="inline-flex items-center h-[42px] px-5 rounded-full bg-[#15171c] text-white font-bold text-[13px] ml-auto hover:opacity-85 transition-opacity">
              Вернуться к треку
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}

function QuestionBlock({
  question,
  index,
  value,
  disabled,
  onChange,
  result,
}: {
  question: Question;
  index: number;
  value: AnswerValue | undefined;
  disabled: boolean;
  onChange: (value: AnswerValue) => void;
  result?: { is_correct: boolean; points: number; explanation: string };
}) {
  return (
    <div>
      <p className="text-[#6b6f76] text-[11px] font-bold tracking-[.12em] uppercase mb-2">
        Вопрос {index + 1} · {question.points} баллов
      </p>
      <h3 className="text-base font-bold leading-snug mb-3">{question.prompt}</h3>
      {question.type === "single_choice" && question.options?.map((text, optionIndex) => (
        <Choice key={text} selected={value === optionIndex} disabled={disabled} onClick={() => onChange(optionIndex)}>
          {text}
        </Choice>
      ))}
      {question.type === "multiple_choice" && question.options?.map((text, optionIndex) => {
        const selected = Array.isArray(value) && value.includes(optionIndex);
        return (
          <Choice
            key={text}
            selected={selected}
            disabled={disabled}
            onClick={() => {
              const current = Array.isArray(value) ? value : [];
              onChange(selected ? current.filter((item) => item !== optionIndex) : [...current, optionIndex]);
            }}
          >
            {text}
          </Choice>
        );
      })}
      {["short_text", "number"].includes(question.type) && (
        <input
          disabled={disabled}
          value={typeof value === "string" ? value : ""}
          onChange={(event) => onChange(event.target.value)}
          inputMode={question.type === "number" ? "decimal" : "text"}
          className="w-full h-11 rounded-[13px] bg-[#f6f4ee] border border-[rgba(21,23,28,.08)] px-4 text-[13.5px] outline-none focus:border-[#16a34a]"
          placeholder={question.type === "number" ? "Введите число" : "Введите ответ"}
        />
      )}
      {question.type === "ordering" && question.options && (
        <OrderingChoice options={question.options} value={Array.isArray(value) ? value : undefined} disabled={disabled} onChange={onChange} />
      )}
      {question.type === "graph_point" && question.chart_data && (
        <GraphPointPicker chartData={question.chart_data} value={typeof value === "object" && value !== null && "x" in value ? (value as GraphPointValue) : undefined} disabled={disabled} onChange={onChange} />
      )}
      {result && (
        <p className={`text-[12.5px] mt-2 ${result.is_correct ? "text-[#16a34a]" : "text-[#ff4d3d]"}`}>
          {result.is_correct ? "Верно" : "Не совсем"} · {result.explanation}
        </p>
      )}
    </div>
  );
}

function Choice({ selected, disabled, onClick, children }: { selected: boolean; disabled: boolean; onClick: () => void; children: string }) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className="block w-full text-left py-3.5 px-4 rounded-[13px] text-[13.5px] font-medium mb-2.5 border-[1.5px] transition-colors disabled:cursor-default"
      style={{
        borderColor: selected ? "#16a34a" : "rgba(21,23,28,.08)",
        background: selected ? "rgba(22,163,74,.06)" : "#f6f4ee",
      }}
    >
      {children}
    </button>
  );
}

function OrderingChoice({
  options,
  value,
  disabled,
  onChange,
}: {
  options: string[];
  value: number[] | undefined;
  disabled: boolean;
  onChange: (value: AnswerValue) => void;
}) {
  const order = value ?? options.map((_, index) => index);

  function move(position: number, direction: -1 | 1) {
    const target = position + direction;
    if (target < 0 || target >= order.length) return;
    const next = [...order];
    [next[position], next[target]] = [next[target], next[position]];
    onChange(next);
  }

  return (
    <div className="grid gap-2">
      {order.map((optionIndex, position) => (
        <div
          key={optionIndex}
          className="flex items-center gap-3 py-3 px-4 rounded-[13px] text-[13.5px] font-medium border-[1.5px]"
          style={{ borderColor: "rgba(21,23,28,.08)", background: "#f6f4ee" }}
        >
          <span className="text-[#16a34a] font-bold text-[12px] w-4">{position + 1}</span>
          <span className="flex-1">{options[optionIndex]}</span>
          <button
            type="button"
            disabled={disabled || position === 0}
            onClick={() => move(position, -1)}
            className="w-7 h-7 rounded-full bg-white border border-[rgba(21,23,28,.1)] text-xs font-bold disabled:opacity-30"
            aria-label="Переместить выше"
          >
            ↑
          </button>
          <button
            type="button"
            disabled={disabled || position === order.length - 1}
            onClick={() => move(position, 1)}
            className="w-7 h-7 rounded-full bg-white border border-[rgba(21,23,28,.1)] text-xs font-bold disabled:opacity-30"
            aria-label="Переместить ниже"
          >
            ↓
          </button>
        </div>
      ))}
    </div>
  );
}

function GraphPointPicker({
  chartData,
  value,
  disabled,
  onChange,
}: {
  chartData: ChartData;
  value: GraphPointValue | undefined;
  disabled: boolean;
  onChange: (value: AnswerValue) => void;
}) {
  const width = 300;
  const height = 200;
  const pad = 24;

  function toDomain(px: number, py: number): GraphPointValue {
    const x = chartData.x_min + ((px - pad) / (width - 2 * pad)) * (chartData.x_max - chartData.x_min);
    const y = chartData.y_max - ((py - pad) / (height - 2 * pad)) * (chartData.y_max - chartData.y_min);
    return { x: Math.round(x * 100) / 100, y: Math.round(y * 100) / 100 };
  }

  function toPixel(x: number, y: number): [number, number] {
    const px = pad + ((x - chartData.x_min) / (chartData.x_max - chartData.x_min)) * (width - 2 * pad);
    const py = pad + ((chartData.y_max - y) / (chartData.y_max - chartData.y_min)) * (height - 2 * pad);
    return [px, py];
  }

  function handleClick(event: MouseEvent<SVGSVGElement>) {
    if (disabled) return;
    const rect = event.currentTarget.getBoundingClientRect();
    const px = ((event.clientX - rect.left) / rect.width) * width;
    const py = ((event.clientY - rect.top) / rect.height) * height;
    onChange(toDomain(px, py));
  }

  const marker = value ? toPixel(value.x, value.y) : null;
  const curvePoints = chartData.curve?.map(([x, y]) => toPixel(x, y).join(",")).join(" ");

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      onClick={handleClick}
      className="w-full max-w-[420px] rounded-[13px] bg-[#f6f4ee] border border-[rgba(21,23,28,.08)]"
      style={{ cursor: disabled ? "default" : "crosshair" }}
    >
      <line x1={pad} y1={height - pad} x2={width - pad} y2={height - pad} stroke="rgba(21,23,28,.25)" strokeWidth={1.5} />
      <line x1={pad} y1={pad} x2={pad} y2={height - pad} stroke="rgba(21,23,28,.25)" strokeWidth={1.5} />
      {curvePoints && <polyline points={curvePoints} fill="none" stroke="#7c5cff" strokeWidth={2} />}
      {marker && <circle cx={marker[0]} cy={marker[1]} r={6} fill="#16a34a" stroke="white" strokeWidth={2} />}
      <text x={width - pad} y={height - pad + 14} fontSize={9} textAnchor="end" fill="#6b6f76">
        {chartData.x_label ?? "x"}
      </text>
      <text x={pad - 4} y={pad - 6} fontSize={9} textAnchor="start" fill="#6b6f76">
        {chartData.y_label ?? "y"}
      </text>
    </svg>
  );
}
