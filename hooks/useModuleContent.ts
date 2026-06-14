import { allLessons, findLesson, getAdjacentLessons } from '@/content/modules';
import { loadLessonMarkdown } from '@/content/markdown-loader';
import type { Lesson, Module } from '@/content/types';

export type LessonEntry = (typeof allLessons)[number];

export interface ModuleContent {
  module: Module;
  lesson: Lesson;
  prev?: LessonEntry;
  next?: LessonEntry;
  /** Markdown body for the lesson, falling back to `lesson.content` if no .md file exists. */
  markdown: string;
}

/**
 * Single entry point for resolving a lesson slug into everything a lesson
 * page needs to render: the owning module, the lesson itself, its
 * prev/next neighbors, and its markdown body.
 *
 * Pages depend on this function instead of importing `content/modules`
 * and `content/markdown-loader` directly (DIP) — if the content layer is
 * ever restructured (e.g. split into per-module files), only this file
 * needs to change.
 *
 * Despite the `use` prefix (kept for naming consistency with the other
 * content/data hooks), this has no internal state or effects, so it is
 * safe to call from Server Components.
 */
export function useModuleContent(slug: string): ModuleContent | undefined {
  const entry = findLesson(slug);
  if (!entry) return undefined;

  const { module, lesson } = entry;
  const { prev, next } = getAdjacentLessons(slug);

  return {
    module,
    lesson,
    prev,
    next,
    markdown: loadLessonMarkdown(lesson) ?? lesson.content,
  };
}
