/**
 * Static param generation for /cursos/[course]/modulos/[slug].
 *
 * Extracted from page.tsx so that file stays focused on rendering.
 * Re-exported from page.tsx (Next.js requires the export to live there).
 */
import { getAllModules } from '@/lib/courses';
import { COURSE_SLUG } from '@/lib/constants';

export function generateStaticParams() {
  return getAllModules().map((entry) => ({
    course: COURSE_SLUG,
    slug: entry.meta.slug,
  }));
}
