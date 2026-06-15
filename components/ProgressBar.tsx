'use client';

import { useCourseProgress } from '@/hooks/useProgress';

/** Slim progress bar showing overall course completion (persisted in localStorage). */
export function ProgressBar({ totalModules }: { totalModules: number }) {
  const { pct } = useCourseProgress(totalModules);

  return (
    <div className="px-4 py-2">
      <div className="mb-1 flex items-center justify-between text-xs text-ink-500">
        <span>Progreso del curso</span>
        <span>{pct}%</span>
      </div>
      <div
        className="h-1.5 w-full overflow-hidden rounded-full bg-ink-200"
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={pct}
        aria-label="Progreso del curso"
      >
        <div
          className="h-full rounded-full bg-accent-500 transition-all duration-500"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
