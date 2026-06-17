/**
 * Server-only utility for resolving module data.
 *
 * Encapsulates all data-access and validation logic for the module page:
 * - 404 handling (notFound)
 * - Content resolution via lib/courses
 * - objectives normalization (string | string[] → string[])
 *
 * Keeps pages thin: they call this function and pass the result to
 * presentation components, never touching lib/courses directly.
 *
 * ⚠️  Only call this from Server Components (notFound() is a server API).
 */
import { notFound } from 'next/navigation';
import { findModule, getModuleSource, getAdjacentModules } from '@/lib/courses';
import { COURSE_SLUG } from '@/lib/constants';
import type { ModuleEntry, ModuleMeta } from '@/types/course';

export interface ResolvedModuleData {
  meta: ModuleMeta;
  source: string;
  prev: ModuleEntry | undefined;
  next: ModuleEntry | undefined;
  /** Always an array, even when the front-matter has a single string. */
  objectives: string[];
}

/**
 * Resolves all data needed to render a module page.
 * Calls `notFound()` (throws) if the course or slug is invalid.
 */
export function resolveModuleData(
  course: string,
  slug: string,
): ResolvedModuleData {
  if (course !== COURSE_SLUG) notFound();

  const entry = findModule(slug);
  if (!entry) notFound();

  const { meta, fileName } = entry;
  const source = getModuleSource(fileName);
  const { prev, next } = getAdjacentModules(slug);

  const objectives = Array.isArray(meta.objective)
    ? meta.objective
    : [meta.objective];

  return { meta, source, prev, next, objectives };
}
