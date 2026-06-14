'use client';

import { useMarkLessonComplete } from '@/hooks/useProgress';

/** Client-only helper that records the visit in localStorage progress. */
export function LessonProgressTracker({ slug }: { slug: string }) {
  useMarkLessonComplete(slug);
  return null;
}
