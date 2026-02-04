"use client";

import React from "react";
import { QUESTIONS, BLOCKS, type BlockId } from "@/lib/questions";
import { computeSummary, type AnswersMap } from "@/lib/scoring";
import BlockIntroLoader from "@/components/BlockIntroLoader";
import { tBlock, type Lang } from "@/lib/i18n";
import SaveProgress, { loadProgress } from "@/components/SaveProgress";
import DarkModeToggle from "@/components/DarkModeToggle";
import { useRouter } from "next/navigation";

type Props = {
  childAgeYears: number;
  lang: Lang;
  onComplete: (answers: AnswersMap) => void;
};

export default function TestWizard({ childAgeYears, lang, onComplete }: Props) {
  const router = useRouter();
  // Try to load saved progress
  const savedProgress = React.useMemo(() => loadProgress(), []);
  const [idx, setIdx] = React.useState(savedProgress?.currentIndex ?? 0);
  const [answers, setAnswers] = React.useState<AnswersMap>(savedProgress?.answers ?? {});

  /** ===== INTRO STATE ===== */
  const [showIntro, setShowIntro] = React.useState(false);
  const [introBlock, setIntroBlock] = React.useState<BlockId>("social");
  const [showBlockComplete, setShowBlockComplete] = React.useState(false);
  const [completedBlock, setCompletedBlock] = React.useState<BlockId | null>(null);

  const hasShownFirstIntroRef = React.useRef(false);
  const lastBlockRef = React.useRef<BlockId | null>(null);

  const q = QUESTIONS[idx];

  /** ===== BLOCK INTRO TRIGGER ===== */
  React.useEffect(() => {
    const currentBlock = q.block;

    // 1) birinchi kirishda 1 marta
    if (!hasShownFirstIntroRef.current) {
      hasShownFirstIntroRef.current = true;
      lastBlockRef.current = currentBlock;
      setIntroBlock(currentBlock);
      setShowIntro(true);
      window.setTimeout(() => setShowIntro(false), 2000);
      return;
    }

    // 2) keyingi bloklarga o'tganda
    if (lastBlockRef.current !== currentBlock) {
      lastBlockRef.current = currentBlock;
      setIntroBlock(currentBlock);
      setShowIntro(true);
      window.setTimeout(() => setShowIntro(false), 2000);
      return;
    }
  }, [q.block]);

  /** ===== INTRO RENDER ===== */
  if (showIntro) {
    const meta = tBlock(lang, introBlock);
    return <BlockIntroLoader title={meta.title} desc={meta.desc} focus={meta.focus} />;
  }

  // Check if we're at the last question of current block
  const currentBlockQuestionsList = QUESTIONS.filter((question) => question.block === q.block);
  const currentQuestionIndexInBlock = currentBlockQuestionsList.findIndex((question) => question.id === q.id);
  const isLastQuestionInBlock = currentQuestionIndexInBlock === currentBlockQuestionsList.length - 1;

  /** ===== PROGRESS ===== */
  const total = QUESTIONS.length;
  const progress = Math.round(((idx + 1) / total) * 100);
  const currentValue: 0 | 1 | 2 = (answers[q.id] ?? 0) as 0 | 1 | 2;

  // Get current block info
  const blockIndex = BLOCKS.findIndex((b) => b.id === q.block);
  const blockTitle = BLOCKS[blockIndex]?.title ?? "";
  const isLastBlock = blockIndex === BLOCKS.length - 1;

  /** ===== HANDLERS ===== */
  function setAnswer(v: 0 | 1 | 2) {
    setAnswers((p) => ({ ...p, [q.id]: v }));
  }

  function prev() {
    if (idx > 0) {
      setShowBlockComplete(false);
      setIdx((x) => x - 1);
    }
  }

  function next() {
    const merged: AnswersMap = { ...answers, [q.id]: currentValue };
    setAnswers(merged);

    // If this is the last question in the block, show completion screen
    if (isLastQuestionInBlock && !isLastBlock) {
      setCompletedBlock(q.block);
      setShowBlockComplete(true);
      return;
    }

    // If this is the last question overall, complete test
    if (idx === total - 1) {
      onComplete(merged);
      return;
    }

    setIdx((x) => x + 1);
  }

  function goToNextBlock() {
    setShowBlockComplete(false);
    // Find first question of next block
    const nextBlockIndex = blockIndex + 1;
    if (nextBlockIndex < BLOCKS.length) {
      const nextBlock = BLOCKS[nextBlockIndex];
      const nextBlockFirstQuestion = QUESTIONS.findIndex((q) => q.block === nextBlock.id);
      if (nextBlockFirstQuestion !== -1) {
        setIdx(nextBlockFirstQuestion);
      }
    }
  }

  function showResults() {
    const merged: AnswersMap = { ...answers, [q.id]: currentValue };
    onComplete(merged);
  }

  /** ===== LABELS ===== */
  const labels =
    lang === "ru"
      ? {
          yes: "Да / часто",
          sometimes: "Иногда",
          no: "Нет / редко",
          back: "Назад",
          next: "Далее",
          finish: "Завершить",
          nextBlock: "Перейти к следующему блоку",
          showResults: "Показать результаты",
          blockComplete: "Блок завершён",
          blockCompleteText: "Вы ответили на все вопросы этого блока. Переходите к следующему блоку.",
          q: "Вопрос",
          block: "Блок",
          score: "Общий риск",
          note: "Это скрининг, не диагноз.",
        }
      : {
          yes: "Ha / ko'pincha",
          sometimes: "Ba'zan",
          no: "Yo'q / kam",
          back: "Orqaga",
          next: "Keyingi",
          finish: "Yakunlash",
          nextBlock: "Keyingi blokka o'tish",
          showResults: "Natijani ko'rish",
          blockComplete: "Blok yakunlandi",
          blockCompleteText: "Siz ushbu blokdagi barcha savollarga javob berdingiz. Keyingi blokka o'ting.",
          q: "Savol",
          block: "Blok",
          score: "Umumiy risk",
          note: "Bu skrining, tashxis emas.",
        };

  /** ===== BLOCK COMPLETE SCREEN ===== */
  if (showBlockComplete && completedBlock) {
    const completedBlockInfo = BLOCKS.find((b) => b.id === completedBlock);
    return (
      <div className="min-h-dvh bg-gradient-to-br from-indigo-50 via-white to-emerald-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 transition-colors duration-300 px-4 pt-6 pb-10 flex items-center justify-center">
        <div className="mx-auto max-w-md rounded-2xl glass dark:bg-slate-800/50 p-8 shadow-xl ring-1 ring-slate-200/50 dark:ring-slate-700/50 animate-scaleIn">
          <div className="text-center">
            <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-r from-emerald-500 to-emerald-600 flex items-center justify-center">
              <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-2">
              {labels.blockComplete}
            </h2>
            <p className="text-slate-700 dark:text-slate-300 mb-2">
              {completedBlockInfo?.title}
            </p>
            <p className="text-sm text-slate-600 dark:text-slate-400 mb-6">
              {labels.blockCompleteText}
            </p>
            <button
              onClick={goToNextBlock}
              className="w-full rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-500 dark:from-indigo-500 dark:to-indigo-600 px-6 py-4 text-base font-bold text-white shadow-lg shadow-indigo-500/25 dark:shadow-indigo-500/40 transition-all hover:from-indigo-700 hover:to-indigo-600 dark:hover:from-indigo-600 dark:hover:to-indigo-700 hover:shadow-xl hover:-translate-y-0.5"
            >
              {labels.nextBlock}
              <svg className="inline ml-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-dvh bg-gradient-to-br from-indigo-50 via-white to-emerald-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 transition-colors duration-300 px-4 pt-6 pb-10">
      {/* Dark Mode Toggle */}
      <div className="fixed top-4 right-4 z-50 animate-fadeIn">
        <DarkModeToggle />
      </div>
      <div className="mx-auto max-w-md rounded-2xl glass dark:bg-slate-800/50 p-5 shadow-lg ring-1 ring-slate-200/50 dark:ring-slate-700/50 hover-lift animate-fadeIn">
        {/* HEADER */}
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="rounded-full bg-indigo-50 dark:bg-indigo-900/30 px-3 py-1.5 text-xs font-bold text-indigo-700 dark:text-indigo-300 ring-1 ring-indigo-100 dark:ring-indigo-800">
              {labels.block}: {blockTitle}
            </div>
            <div className="mt-1.5 text-xs font-semibold text-slate-600 dark:text-slate-400">
              {labels.q} {idx + 1} / {total}
            </div>
          </div>

          <div className="rounded-xl bg-gradient-to-br from-indigo-50 to-white dark:from-indigo-900/30 dark:to-slate-700 px-3 py-2 text-xs font-bold text-indigo-700 dark:text-indigo-300 ring-1 ring-indigo-100 dark:ring-indigo-800 shadow-sm">
            {progress}%
          </div>
        </div>

        {/* Save Progress */}
        <div className="mt-3">
          <SaveProgress answers={answers} currentIndex={idx} totalQuestions={total} />
        </div>

        {/* PROGRESS BAR */}
        <div className="mt-4 h-2.5 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700">
          <div
            className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-indigo-600 dark:from-indigo-400 dark:to-indigo-500 transition-all duration-300 shadow-sm"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* QUESTION */}
        <div className="mt-4 rounded-xl bg-gradient-to-br from-white to-slate-50 dark:from-slate-800 dark:to-slate-700 p-5 ring-1 ring-slate-200/50 dark:ring-slate-700/50 shadow-sm hover-lift animate-scaleIn">
          <div className="text-base font-bold leading-relaxed text-slate-900 dark:text-slate-100 mb-5">
            {q.text}
          </div>

          <div className="grid gap-3">
            <Answer label={labels.yes} active={currentValue === 2} onClick={() => setAnswer(2)} />
            <Answer label={labels.sometimes} active={currentValue === 1} onClick={() => setAnswer(1)} />
            <Answer label={labels.no} active={currentValue === 0} onClick={() => setAnswer(0)} />
          </div>
        </div>

        {/* ACTIONS */}
        <div className="mt-5 flex gap-3">
          <button
            type="button"
            onClick={prev}
            disabled={idx === 0}
            className="flex-1 rounded-xl bg-white dark:bg-slate-700 px-4 py-3 text-sm font-bold text-slate-700 dark:text-slate-300 ring-1 ring-slate-300 dark:ring-slate-600 transition-all hover:bg-slate-50 dark:hover:bg-slate-600 hover:ring-slate-400 dark:hover:ring-slate-500 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {labels.back}
          </button>

          <button
            type="button"
            onClick={() => {
              if (isLastQuestionInBlock && isLastBlock) {
                showResults();
              } else {
                next();
              }
            }}
            className="flex-1 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-500 dark:from-indigo-500 dark:to-indigo-600 px-4 py-3 text-sm font-bold text-white shadow-md shadow-indigo-500/25 dark:shadow-indigo-500/40 transition-all hover:from-indigo-700 hover:to-indigo-600 dark:hover:from-indigo-600 dark:hover:to-indigo-700 hover:shadow-lg"
          >
            {isLastQuestionInBlock && isLastBlock
              ? labels.showResults
              : isLastQuestionInBlock
              ? labels.nextBlock
              : idx === total - 1
              ? labels.finish
              : labels.next}
          </button>
        </div>

        <p className="mt-4 text-center text-xs text-slate-500 dark:text-slate-400">{labels.note}</p>
      </div>
    </div>
  );
}

function Answer({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-full rounded-xl px-4 py-3.5 text-left text-sm font-semibold ring-1 transition-all hover-lift ${
        active
          ? "bg-gradient-to-r from-indigo-600 to-indigo-500 dark:from-indigo-500 dark:to-indigo-600 text-white ring-indigo-200 dark:ring-indigo-700 shadow-md shadow-indigo-500/20 dark:shadow-indigo-500/40 scale-105"
          : "bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 ring-slate-300 dark:ring-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700 hover:ring-slate-400 dark:hover:ring-slate-500"
      }`}
    >
      {label}
    </button>
  );
}
