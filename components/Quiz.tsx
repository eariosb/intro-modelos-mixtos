'use client';

import { useState } from 'react';
import clsx from 'clsx';
import type { QuizQuestion, QuizProps } from '@/types/course';

function QuizItem({ q, index }: { q: QuizQuestion; index: number }) {
  const [selected, setSelected] = useState<number | null>(null);

  return (
    <div className="rounded border border-ink-200 bg-white p-4">
      <p className="text-sm font-medium text-ink-900">
        {index + 1}. {q.question}
      </p>
      <div className="mt-3 space-y-2">
        {q.options.map((opt, i) => {
          const isSelected = selected === i;
          const isCorrect = i === q.correctIndex;
          const showState = selected !== null;
          return (
            <button
              key={opt}
              type="button"
              onClick={() => setSelected(i)}
              disabled={selected !== null}
              aria-pressed={isSelected}
              className={clsx(
                'block w-full rounded border px-3 py-2 text-left text-sm transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-500',
                !showState && 'border-ink-200 hover:border-accent-300 hover:bg-accent-50',
                showState && isCorrect && 'border-emerald-300 bg-emerald-50 text-emerald-800',
                showState && isSelected && !isCorrect && 'border-red-300 bg-red-50 text-red-800',
                showState && !isSelected && !isCorrect && 'border-ink-200 text-ink-500 opacity-70'
              )}
            >
              {opt}
              {showState && isCorrect && ' ✓'}
              {showState && isSelected && !isCorrect && ' ✗'}
            </button>
          );
        })}
      </div>
      {selected !== null && q.explanation && (
        <p className="mt-3 rounded bg-ink-50 px-3 py-2 text-xs text-ink-600">
          <span className="font-semibold text-ink-700">Explicación: </span>
          {q.explanation}
        </p>
      )}
    </div>
  );
}

/**
 * Self-assessment quiz rendered at the end of a lesson. Each question
 * is answered independently and reveals immediate feedback.
 */
export function Quiz({ questions, title }: QuizProps) {
  if (!questions?.length) return null;
  return (
    <section className="my-8">
      <h3 className="mb-3 text-lg font-semibold text-ink-900">
        {title ?? 'Autoevaluación'}
      </h3>
      <div className="space-y-3">
        {questions.map((q, i) => (
          <QuizItem key={q.question} q={q} index={i} />
        ))}
      </div>
    </section>
  );
}
