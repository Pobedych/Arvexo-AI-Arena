"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  api,
  groupSortInitialValue,
  isNumberArray,
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
import AdvancedQuestionInput, { hasAdvancedAnswer, initialAdvancedValue, isAdvancedQuestion } from "@/components/AdvancedQuestionInput";
import GroupSort from "@/components/GroupSort";
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
  if (!lesson.steps.length) return buildLegacyBlocks(lesson);
  const blocks: Block[] = [
    ...lesson.steps.map((step) => ({ kind: "step" as const, key: `step-${step.id}`, order: step.order, step })),
    ...lesson.questions.map((question, index) => ({ kind: "question" as const, key: `question-${question.id}`, order: question.order, question, index })),
  ];
  return blocks.sort((a, b) => a.order - b.order || (a.kind === "step" ? -1 : b.kind === "step" ? 1 : 0));
}

function buildLegacyBlocks(lesson: Lesson): Block[] {
  const steps = splitTheory(lesson.theory, lesson.id);
  if (!steps.length) {
    return lesson.questions.map((question, index) => ({ kind: "question", key: `question-${question.id}`, order: index + 1, question, index }));
  }
  const questionsByStep = new Map<number, Array<{ question: Question; index: number }>>();
  lesson.questions.forEach((question, index) => {
    const stepIndex = Math.min(steps.length - 1, Math.floor(((index + 1) * steps.length) / (lesson.questions.length + 1)));
    questionsByStep.set(stepIndex, [...(questionsByStep.get(stepIndex) ?? []), { question, index }]);
  });
  return steps.flatMap((step, stepIndex) => [
    { kind: "step" as const, key: `step-${step.id}`, order: stepIndex * 10 + 1, step },
    ...(questionsByStep.get(stepIndex) ?? []).map(({ question, index }, questionIndex) => ({
      kind: "question" as const,
      key: `question-${question.id}`,
      order: stepIndex * 10 + questionIndex + 2,
      question,
      index,
    })),
  ]);
}

function splitTheory(theory: string, lessonId: string): LessonStep[] {
  const headingSections = theory
    .split(/(?=^#{2,3}\s+)/m)
    .map((section) => section.trim())
    .filter(Boolean);
  const sections = headingSections.length > 1 ? headingSections : chunkParagraphs(theory);
  return sections.map((section, index) => {
    const heading = section.match(/^#{1,3}\s+(.+)$/m);
    const body = heading ? section.replace(heading[0], "").trim() : section;
    return {
      id: `${lessonId}-auto-${index}`,
      title: heading?.[1]?.trim() || (index === 0 ? "Разберём основную идею" : `Шаг ${index + 1}`),
      body,
      order: index + 1,
    };
  }).filter((step) => step.body);
}

function chunkParagraphs(theory: string) {
  const paragraphs = theory.split(/\n\s*\n/).map((paragraph) => paragraph.trim()).filter(Boolean);
  const chunks: string[] = [];
  let current = "";
  for (const paragraph of paragraphs) {
    if (current && current.length + paragraph.length > 900) {
      chunks.push(current);
      current = paragraph;
    } else {
      current = current ? `${current}\n\n${paragraph}` : paragraph;
    }
  }
  if (current) chunks.push(current);
  return chunks;
}

function estimateMinutes(blocks: Block[], fromIndex = 0) {
  return blocks.slice(fromIndex).reduce((total, block) => {
    if (block.kind === "question") return total + 2;
    const words = block.step.body.trim().split(/\s+/).filter(Boolean).length;
    return total + Math.max(1, Math.ceil(words / 180));
  }, 0);
}

export default function LessonPage() {
  const params = useParams<{ lessonId: string }>();
  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [answers, setAnswers] = useState<Record<string, AnswerValue>>({});
  const [result, setResult] = useState<SubmitResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentBlock, setCurrentBlock] = useState(0);
  const [furthestBlock, setFurthestBlock] = useState(0);
  const progressSaveQueue = useRef<Promise<void>>(Promise.resolve());

  useEffect(() => {
    api<Lesson>(`/lessons/${params.lessonId}`)
      .then((lessonData) => {
        const savedBlock = Math.max(0, Math.min(lessonData.current_block ?? 0, buildBlocks(lessonData).length));
        setLesson(lessonData);
        setCurrentBlock(savedBlock);
        setFurthestBlock(savedBlock);
        setResult(null);
        setAnswers(Object.fromEntries(
          lessonData.questions
            .filter((question) => question.type === "sequence" || question.type === "matching" || question.type === "group_sort" || isAdvancedQuestion(question.type))
            .map((question) => [
              question.id,
              question.type === "sequence"
                ? sequenceInitialOrder(question)
                : question.type === "matching"
                  ? matchingInitialValue(question)
                  : question.type === "group_sort"
                    ? groupSortInitialValue(question)
                    : initialAdvancedValue(question),
            ] as [string, AnswerValue | undefined])
            .filter((entry): entry is [string, AnswerValue] => entry[1] !== undefined),
        ));
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [params.lessonId]);

  const blocks = useMemo(() => (lesson ? buildBlocks(lesson) : []), [lesson]);
  const canSubmit = useMemo(() => lesson?.questions.every((question) => hasAnswer(question, answers[question.id])) ?? false, [lesson, answers]);

  function saveProgress(lessonId: string, blockIndex: number) {
    progressSaveQueue.current = progressSaveQueue.current
      .catch(() => undefined)
      .then(() => api<{ current_block: number }>(`/lessons/${lessonId}/progress`, {
        method: "PUT",
        body: JSON.stringify({ current_block: blockIndex }),
        keepalive: true,
      }))
      .then(() => undefined)
      .catch(() => undefined);
  }

  function goToBlock(index: number) {
    const next = Math.max(0, Math.min(index, blocks.length));
    setCurrentBlock(next);
    setFurthestBlock((furthest) => Math.max(furthest, next));
    if (lesson) saveProgress(lesson.id, next);
    window.scrollTo({ top: 0, behavior: "smooth" });
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

  const wizardDone = currentBlock >= blocks.length;
  const progress = blocks.length ? Math.round((Math.min(currentBlock, blocks.length) / blocks.length) * 100) : 0;
  const minutesLeft = estimateMinutes(blocks, currentBlock);

  return (
    <div>
      {header}

      <div className="mb-5 rounded-[22px] border border-[rgba(21,23,28,.08)] bg-white p-4 shadow-[0_10px_30px_-26px_rgba(21,23,28,.35)] sm:p-5">
        <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-[10.5px] font-extrabold uppercase tracking-[.12em] text-[#16a34a]">Маршрут урока</p>
            <p className="mt-1 text-[13px] font-bold">{wizardDone ? "Все смысловые блоки пройдены" : `Шаг ${currentBlock + 1} из ${blocks.length}`}</p>
          </div>
          <div className="flex gap-2 text-[11.5px] font-bold text-[#6b6f76]">
            {!wizardDone && <span className="rounded-full bg-[#f6f4ee] px-3 py-1.5">≈ {minutesLeft} мин осталось</span>}
            <span className="rounded-full bg-[#eef7ec] px-3 py-1.5 text-[#15803d]">{progress}%</span>
          </div>
        </div>
        <div className="h-[7px] overflow-hidden rounded-full bg-[rgba(21,23,28,.09)]">
          <span className="block h-full rounded-full bg-[#16a34a] transition-[width] duration-300" style={{ width: `${progress}%` }} />
        </div>
      </div>

      <div className="grid items-start gap-4 lg:grid-cols-[220px_minmax(0,1fr)]">
        <aside className="rounded-[20px] border border-[rgba(21,23,28,.08)] bg-white p-3.5 lg:sticky lg:top-24">
          <p className="mb-3 px-1 text-[10px] font-extrabold uppercase tracking-[.12em] text-[#858990]">Содержание</p>
          <ol className="grid grid-cols-2 gap-1.5 sm:grid-cols-3 lg:grid-cols-1">
            {blocks.map((block, index) => {
              const available = index <= furthestBlock;
              const active = index === currentBlock;
              const complete = index < furthestBlock || wizardDone;
              const label = block.kind === "step" ? block.step.title || `Теория ${index + 1}` : "Мини-проверка";
              return (
                <li key={block.key}>
                  <button
                    type="button"
                    disabled={!available}
                    onClick={() => goToBlock(index)}
                    className={`flex w-full items-center gap-2.5 rounded-[12px] px-2.5 py-2 text-left text-[11.5px] font-bold transition-colors disabled:opacity-45 ${active ? "bg-[#15171c] text-white" : "hover:bg-[#f6f4ee]"}`}
                  >
                    <span className={`grid h-6 w-6 shrink-0 place-items-center rounded-full text-[10px] ${active ? "bg-[#74bd70] text-[#15171c]" : complete ? "bg-[#16a34a] text-white" : "bg-[#f0eee7] text-[#858990]"}`}>
                      {complete ? "✓" : index + 1}
                    </span>
                    <span className="line-clamp-2">{label}</span>
                  </button>
                </li>
              );
            })}
          </ol>
        </aside>

        <main className="min-w-0">
          {blocks.map((block, blockIndex) => (
            <div key={block.key} hidden={blockIndex !== currentBlock}>
              {block.kind === "step" ? (
                <StepBlock
                  step={block.step}
                  active={blockIndex === currentBlock && !wizardDone}
                  onBack={currentBlock > 0 ? () => goToBlock(currentBlock - 1) : undefined}
                  onContinue={() => goToBlock(currentBlock + 1)}
                />
              ) : (
                <MiniCheckBlock
                  question={block.question}
                  active={blockIndex === currentBlock && !wizardDone}
                  value={answers[block.question.id]}
                  onChange={(value) => setAnswers((current) => ({ ...current, [block.question.id]: value }))}
                  onBack={currentBlock > 0 ? () => goToBlock(currentBlock - 1) : undefined}
                  onContinue={() => goToBlock(currentBlock + 1)}
                />
              )}
            </div>
          ))}

          {wizardDone && (
            <div className="rounded-[26px] border border-[rgba(22,163,74,.2)] bg-white p-6 shadow-[0_18px_50px_-36px_rgba(22,163,74,.6)] sm:p-8">
              <div className="mb-5 grid h-14 w-14 place-items-center rounded-[18px] bg-[#eef7ec] text-[26px]" aria-hidden="true">✓</div>
              <p className="text-[11px] font-bold uppercase tracking-[.12em] text-[#16a34a]">Финиш урока</p>
              <h2 className="mt-2 text-[clamp(22px,3vw,30px)] font-extrabold tracking-tight">Главное уже разобрано</h2>
              <p className="mt-2 max-w-[560px] text-[13.5px] leading-relaxed text-[#6b6f76]">Отправьте ответы, чтобы сохранить лучший результат и открыть следующий урок.</p>

              {error && <p className="mt-4 text-xs font-semibold text-[#ff4d3d]">{error}</p>}
              {result && (
                <div className={`mt-5 rounded-[16px] px-4 py-3.5 ${result.completed ? "border border-[rgba(22,163,74,.2)] bg-[rgba(22,163,74,.08)]" : "border border-[rgba(255,77,61,.2)] bg-[rgba(255,77,61,.08)]"}`}>
                  <strong className={`text-[13px] ${result.completed ? "text-[#16a34a]" : "text-[#ff4d3d]"}`}>{result.completed ? "Урок завершён." : "Нужно повторить."}</strong>{" "}
                  <span className="text-[13px]">{result.score}/{result.max_score} баллов · {result.percent}%</span>
                </div>
              )}

              <div className="mt-6 flex flex-wrap gap-2.5">
                <button type="button" onClick={() => goToBlock(Math.max(0, blocks.length - 1))} className="inline-flex h-[42px] items-center rounded-full border border-[rgba(21,23,28,.14)] px-5 text-[13px] font-bold hover:bg-[#f6f4ee]">← Вернуться к уроку</button>
                {!result && <button onClick={submit} disabled={!canSubmit} className="inline-flex h-[42px] items-center rounded-full bg-[#16a34a] px-5 text-[13px] font-bold text-white hover:opacity-86 disabled:opacity-40">Завершить урок</button>}
                {result && <Link href="/app/track" className="inline-flex h-[42px] items-center rounded-full bg-[#15171c] px-5 text-[13px] font-bold text-white">Вернуться к треку</Link>}
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

function StepBlock({ step, active, onBack, onContinue }: { step: LessonStep; active: boolean; onBack?: () => void; onContinue: () => void }) {
  return (
    <div className="rounded-[24px] bg-white border border-[rgba(21,23,28,.07)] py-7.5 px-8 shadow-[0_10px_30px_-24px_rgba(21,23,28,.3)]">
      {step.title && <h2 className="text-lg font-bold mb-3">{step.title}</h2>}
      <MarkdownContent content={step.body} />
      {active && (
        <div className="flex flex-wrap gap-2.5 mt-5">
          {onBack && <button type="button" onClick={onBack} className="inline-flex items-center h-[42px] px-5 rounded-full border border-[rgba(21,23,28,.14)] font-bold text-[13px] hover:bg-[#f6f4ee]">← Назад</button>}
          <button
            onClick={onContinue}
            className="inline-flex items-center h-[42px] px-5 rounded-full bg-[#15171c] text-white font-bold text-[13px] hover:opacity-85 transition-opacity sm:ml-auto"
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
  onBack,
  onContinue,
}: {
  question: Question;
  active: boolean;
  value: AnswerValue | undefined;
  onChange: (value: AnswerValue) => void;
  onBack?: () => void;
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
          {onBack && (
            <button type="button" onClick={onBack} className="inline-flex items-center h-[42px] px-5 rounded-full border border-[rgba(21,23,28,.14)] font-bold text-[13px] hover:bg-[#f6f4ee]">
              ← Назад
            </button>
          )}
          {!result && (
            <button
              onClick={check}
              disabled={checking || !hasAnswer(question, value)}
              className="inline-flex items-center h-[42px] px-5 rounded-full bg-[#16a34a] text-white font-bold text-[13px] hover:opacity-86 transition-opacity disabled:opacity-40 sm:ml-auto"
            >
              Проверить ответ
            </button>
          )}
          {result && (
            <button
              onClick={onContinue}
              className="inline-flex items-center h-[42px] px-5 rounded-full bg-[#15171c] text-white font-bold text-[13px] hover:opacity-85 transition-opacity sm:ml-auto"
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
        const selected = isNumberArray(value) && value.includes(optionIndex);
        return (
          <Choice
            key={text}
            selected={selected}
            disabled={disabled}
            onClick={() => {
              const current = isNumberArray(value) ? value : [];
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
          order={isNumberArray(value) ? value : sequenceInitialOrder(question)}
          disabled={disabled}
          onChange={onChange}
        />
      )}
      {question.type === "matching" && question.options && (
        <MatchingPairs
          question={question}
          value={isNumberArray(value) ? value : matchingInitialValue(question)}
          disabled={disabled}
          onChange={onChange}
        />
      )}
      {question.type === "group_sort" && question.options && (
        <GroupSort
          question={question}
          value={isNumberArray(value) ? value : groupSortInitialValue(question)}
          disabled={disabled}
          onChange={onChange}
        />
      )}
      {isAdvancedQuestion(question.type) && <AdvancedQuestionInput question={question} value={value} disabled={disabled} onChange={onChange} />}
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

function hasAnswer(question: Question, value: AnswerValue | undefined) {
  if (isAdvancedQuestion(question.type)) return hasAdvancedAnswer(question, value);
  if (question.type === "matching") return isNumberArray(value) && value.length === (question.options?.length ?? 0) && value.every((item) => item >= 0);
  if (question.type === "group_sort") return isNumberArray(value) && value.length === (question.options?.length ?? 0) && value.every((item) => item >= 0);
  if (question.type === "sequence") return isNumberArray(value) && value.length === (question.options?.length ?? 0);
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
