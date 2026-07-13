"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import {
  api,
  matchingInitialValue,
  sequenceInitialOrder,
  toApiAnswer,
  type AnswerValue,
  type Lesson,
  type LessonStep,
  type PracticeCheckResult,
  type Question,
} from "@/lib/api";
import MarkdownContent from "@/components/MarkdownContent";
import MatchingPairs from "@/components/MatchingPairs";
import SequenceOrder from "@/components/SequenceOrder";

type SubmitResult = {
  score: number;
  max_score: number;
  percent: number;
  completed: boolean;
  results: Array<{ question_id: string; is_correct: boolean; points: number; explanation: string }>;
};

type Block =
  | { kind: "step"; key: string; order: number; step: LessonStep }
  | { kind: "question"; key: string; order: number; question: Question; index: number };

function buildBlocks(lesson: Lesson): Block[] {
  const blocks: Block[] = [
    ...lesson.steps.map((step) => ({ kind: "step" as const, key: `step-${step.id}`, order: step.order, step })),
    ...lesson.questions.map((question, index) => ({ kind: "question" as const, key: `question-${question.id}`, order: question.order, question, index })),
  ];
  return blocks.sort((a, b) => a.order - b.order || (a.kind === "step" ? -1 : b.kind === "step" ? 1 : 0));
}

export default function LessonPage() {
  const params = useParams<{ lessonId: string }>();
  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [answers, setAnswers] = useState<Record<string, AnswerValue>>({});
  const [result, setResult] = useState<SubmitResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [revealCount, setRevealCount] = useState(1);

  useEffect(() => {
    api<Lesson>(`/lessons/${params.lessonId}`)
      .then((lessonData) => {
        setLesson(lessonData);
        setAnswers(Object.fromEntries(
          lessonData.questions
            .filter((question) => question.type === "sequence" || question.type === "matching")
            .map((question) => [question.id, question.type === "sequence" ? sequenceInitialOrder(question) : matchingInitialValue(question)]),
        ));
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [params.lessonId]);

  const blocks = useMemo(() => (lesson ? buildBlocks(lesson) : []), [lesson]);
  const useSteps = (lesson?.steps.length ?? 0) > 0;
  const canSubmit = useMemo(() => lesson?.questions.every((question) => hasAnswer(question, answers[question.id])) ?? false, [lesson, answers]);

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

  const header = (
    <>
      <div className="flex justify-between items-center mb-1.5 flex-wrap gap-3">
        <p className="text-[#6b6f76] text-[11px] font-bold tracking-[.12em] uppercase">
          AI Track · Урок {lesson.order}
        </p>
        <Link href="/app/track" className="text-xs text-[#16a34a] font-bold">
          К треку
        </Link>
      </div>
      <h1 className="font-[family-name:var(--font-display)] text-[clamp(22px,3vw,32px)] font-semibold mb-6">
        {lesson.title}
      </h1>
    </>
  );

  if (!useSteps) {
    return (
      <div>
        {header}

        <nav aria-label="Навигация по уроку" className="flex gap-2 mb-3.5 flex-wrap">
          <a href="#lesson-theory" className="inline-flex items-center h-9 px-4 rounded-full bg-[#15171c] text-white text-xs font-bold focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#16a34a]">
            Материал
          </a>
          <a href="#lesson-questions" className="inline-flex items-center h-9 px-4 rounded-full bg-white border border-[rgba(21,23,28,.1)] text-xs font-bold focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#16a34a]">
            Проверка · заданий: {lesson.questions.length}
          </a>
        </nav>

        <div id="lesson-theory" className="scroll-mt-24 rounded-[24px] bg-white border border-[rgba(21,23,28,.07)] py-7.5 px-8 mb-3.5 shadow-[0_10px_30px_-24px_rgba(21,23,28,.3)]">
          <MarkdownContent content={lesson.theory} />
        </div>

        <div id="lesson-questions" className="scroll-mt-24 rounded-[24px] bg-white border border-[rgba(22,163,74,.18)] p-6.5 shadow-[0_10px_30px_-24px_rgba(22,163,74,.18)]">
          <p className="text-[#16a34a] text-[11px] font-bold tracking-[.12em] uppercase mb-3.5">Проверь себя</p>
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

  const visibleBlocks = blocks.slice(0, Math.min(revealCount, blocks.length));
  const wizardDone = revealCount >= blocks.length;
  const progress = blocks.length ? Math.round((Math.min(revealCount, blocks.length) / blocks.length) * 100) : 0;

  return (
    <div>
      {header}

      <div className="h-[5px] rounded-full bg-[rgba(21,23,28,.1)] mb-5">
        <span className="block h-full rounded-full bg-[#16a34a] transition-all" style={{ width: `${progress}%` }} />
      </div>

      <div className="grid gap-3.5">
        {visibleBlocks.map((block, blockIndex) => {
          const isActive = blockIndex === revealCount - 1 && !wizardDone;
          if (block.kind === "step") {
            return (
              <StepBlock
                key={block.key}
                step={block.step}
                active={isActive}
                onContinue={() => setRevealCount((count) => count + 1)}
              />
            );
          }
          return (
            <MiniCheckBlock
              key={block.key}
              question={block.question}
              active={isActive}
              value={answers[block.question.id]}
              onChange={(value) => setAnswers((current) => ({ ...current, [block.question.id]: value }))}
              onContinue={() => setRevealCount((count) => count + 1)}
            />
          );
        })}
      </div>

      {wizardDone && (
        <div className="rounded-[24px] bg-white border border-[rgba(22,163,74,.18)] p-6.5 shadow-[0_10px_30px_-24px_rgba(22,163,74,.18)] mt-3.5">
          <p className="text-[#16a34a] text-[11px] font-bold tracking-[.12em] uppercase mb-3.5">Материал пройден</p>

          {error && <p className="text-[#ff4d3d] text-xs font-semibold mb-3">{error}</p>}

          {result && (
            <div className={`rounded-[14px] py-3.5 px-4 mb-4 ${result.completed ? "bg-[rgba(22,163,74,.08)] border border-[rgba(22,163,74,.2)]" : "bg-[rgba(255,77,61,.08)] border border-[rgba(255,77,61,.2)]"}`}>
              <strong className={`text-[12.5px] ${result.completed ? "text-[#16a34a]" : "text-[#ff4d3d]"}`}>
                {result.completed ? "Урок завершён." : "Нужно повторить."}
              </strong>{" "}
              <span className="text-[12.5px]">
                {result.score}/{result.max_score} баллов · {result.percent}%
              </span>
            </div>
          )}

          <div className="flex gap-2.5 flex-wrap">
            {!result && (
              <button
                onClick={submit}
                disabled={!canSubmit}
                className="inline-flex items-center h-[42px] px-5 rounded-full bg-[#16a34a] text-white font-bold text-[13px] hover:opacity-86 transition-opacity disabled:opacity-40"
              >
                Завершить урок
              </button>
            )}
            {result && (
              <Link href="/app/track" className="inline-flex items-center h-[42px] px-5 rounded-full bg-[#15171c] text-white font-bold text-[13px] ml-auto hover:opacity-85 transition-opacity">
                Вернуться к треку
              </Link>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function StepBlock({ step, active, onContinue }: { step: LessonStep; active: boolean; onContinue: () => void }) {
  return (
    <div className="rounded-[24px] bg-white border border-[rgba(21,23,28,.07)] py-7.5 px-8 shadow-[0_10px_30px_-24px_rgba(21,23,28,.3)]">
      {step.title && <h2 className="text-lg font-bold mb-3">{step.title}</h2>}
      <MarkdownContent content={step.body} />
      {active && (
        <div className="flex mt-4.5">
          <button
            onClick={onContinue}
            className="inline-flex items-center h-[42px] px-5 rounded-full bg-[#15171c] text-white font-bold text-[13px] hover:opacity-85 transition-opacity"
          >
            Далее →
          </button>
        </div>
      )}
    </div>
  );
}

function MiniCheckBlock({
  question,
  active,
  value,
  onChange,
  onContinue,
}: {
  question: Question;
  active: boolean;
  value: AnswerValue | undefined;
  onChange: (value: AnswerValue) => void;
  onContinue: () => void;
}) {
  const [result, setResult] = useState<PracticeCheckResult | null>(null);
  const [checking, setChecking] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function check() {
    setChecking(true);
    setError(null);
    try {
      const response = await api<PracticeCheckResult>("/practice/check", {
        method: "POST",
        body: JSON.stringify({ question_id: question.id, answer: toApiAnswer(question, value) }),
      });
      setResult(response);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Не удалось проверить ответ");
    } finally {
      setChecking(false);
    }
  }

  return (
    <div className="rounded-[24px] bg-white border border-[rgba(22,163,74,.18)] p-6.5 shadow-[0_10px_30px_-24px_rgba(22,163,74,.18)]">
      <p className="text-[#16a34a] text-[11px] font-bold tracking-[.12em] uppercase mb-3.5">Мини-проверка · {question.points} баллов</p>
      <h3 className="text-base font-bold leading-snug mb-3">{question.prompt}</h3>
      <QuestionInputs question={question} value={value} disabled={!active || Boolean(result)} onChange={onChange} />

      {result && (
        <p className={`text-[12.5px] mt-2 ${result.is_correct ? "text-[#16a34a]" : "text-[#ff4d3d]"}`}>
          {result.is_correct ? "Верно" : "Не совсем"} · {result.explanation}
        </p>
      )}
      {error && <p className="text-[#ff4d3d] text-xs font-semibold mt-2">{error}</p>}

      {active && (
        <div className="flex gap-2.5 mt-4.5 flex-wrap">
          {!result && (
            <button
              onClick={check}
              disabled={checking || !hasAnswer(question, value)}
              className="inline-flex items-center h-[42px] px-5 rounded-full bg-[#16a34a] text-white font-bold text-[13px] hover:opacity-86 transition-opacity disabled:opacity-40"
            >
              Проверить ответ
            </button>
          )}
          {result && (
            <button
              onClick={onContinue}
              className="inline-flex items-center h-[42px] px-5 rounded-full bg-[#15171c] text-white font-bold text-[13px] hover:opacity-85 transition-opacity"
            >
              Далее →
            </button>
          )}
        </div>
      )}
    </div>
  );
}

function QuestionInputs({
  question,
  value,
  disabled,
  onChange,
}: {
  question: Question;
  value: AnswerValue | undefined;
  disabled: boolean;
  onChange: (value: AnswerValue) => void;
}) {
  return (
    <>
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
      {question.type === "sequence" && question.options && (
        <SequenceOrder
          options={question.options}
          order={Array.isArray(value) ? value : sequenceInitialOrder(question)}
          disabled={disabled}
          onChange={onChange}
        />
      )}
      {question.type === "matching" && question.options && (
        <MatchingPairs
          question={question}
          value={Array.isArray(value) ? value : matchingInitialValue(question)}
          disabled={disabled}
          onChange={onChange}
        />
      )}
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
      {question.type === "code_text" && (
        <textarea
          disabled={disabled}
          value={typeof value === "string" ? value : ""}
          onChange={(event) => onChange(event.target.value)}
          spellCheck={false}
          rows={10}
          className="w-full rounded-[13px] bg-[#15171c] border border-white/10 px-4 py-3 font-mono text-[13px] leading-relaxed text-white outline-none focus:border-[#16a34a]"
          placeholder="Напишите решение здесь…"
          aria-label="Код решения"
        />
      )}
    </>
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
      <QuestionInputs question={question} value={value} disabled={disabled} onChange={onChange} />
      {result && (
        <p className={`text-[12.5px] mt-2 ${result.is_correct ? "text-[#16a34a]" : "text-[#ff4d3d]"}`}>
          {result.is_correct ? "Верно" : "Не совсем"} · {result.explanation}
        </p>
      )}
    </div>
  );
}

function hasAnswer(question: Question, value: AnswerValue | undefined) {
  if (question.type === "matching") return Array.isArray(value) && value.length === (question.options?.length ?? 0) && value.every((item) => item >= 0);
  if (question.type === "sequence") return Array.isArray(value) && value.length === (question.options?.length ?? 0);
  return value !== undefined && value !== "";
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
