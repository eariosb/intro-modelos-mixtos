import Link from 'next/link';
import { notFound } from 'next/navigation';
import { MDXRemote } from 'next-mdx-remote/rsc';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import { getAllModules, findModule, getModuleSource, getAdjacentModules } from '@/lib/courses';
import { mdxComponents } from '@/mdx-components';
import { AppLayout } from '@/components/AppLayout';
import { LessonProgressTracker } from '@/components/LessonProgressTracker';

/**
 * Course identifier used for this single-course site. Kept as a route
 * segment (`/cursos/[course]/modulos/[slug]`) so the URL structure can
 * support additional courses later without another migration; for now
 * only "modelos-mixtos" is valid.
 */
const COURSE_SLUG = 'modelos-mixtos';

export function generateStaticParams() {
  return getAllModules().map((entry) => ({
    course: COURSE_SLUG,
    slug: entry.meta.slug,
  }));
}

export default function ModulePage({ params }: { params: { course: string; slug: string } }) {
  if (params.course !== COURSE_SLUG) notFound();

  const entry = findModule(params.slug);
  if (!entry) notFound();

  const { meta, fileName } = entry;
  const source = getModuleSource(fileName);
  const { prev, next } = getAdjacentModules(params.slug);

  const objectives = Array.isArray(meta.objective) ? meta.objective : [meta.objective];
  const moduleHref = (slug: string) => `/cursos/${COURSE_SLUG}/modulos/${slug}`;

  return (
    <AppLayout>
      <LessonProgressTracker slug={meta.slug} />

      <nav aria-label="Ruta de navegación" className="mb-4 text-sm text-ink-500">
        <ol className="flex flex-wrap items-center gap-1.5">
          <li>
            <Link href="/" className="hover:text-accent-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-500">
              Curso
            </Link>
          </li>
          <li aria-hidden>/</li>
          <li aria-current="page" className="font-medium text-ink-800">
            {meta.title}
          </li>
        </ol>
      </nav>

      <h1 className="text-2xl font-semibold tracking-tight text-ink-900 sm:text-3xl">
        {meta.title}
      </h1>

      {meta.subtitle && <p className="mt-2 text-sm text-ink-500">{meta.subtitle}</p>}

      {meta.datasets && meta.datasets.length > 0 && (
        <p className="mt-2 text-sm text-ink-500">
          <span className="font-medium text-ink-600">Datasets:</span> {meta.datasets.join(', ')}
        </p>
      )}

      <div className="mt-4 rounded border border-accent-100 bg-accent-50 p-4">
        <h2 className="text-sm font-semibold text-accent-800">Objetivos de aprendizaje</h2>
        <ul className="mt-2 list-inside list-disc space-y-1 text-sm text-accent-900">
          {objectives.map((obj) => (
            <li key={obj}>{obj}</li>
          ))}
        </ul>
      </div>

      <div className="prose prose-ink mt-6 max-w-none prose-headings:font-semibold prose-h2:text-xl prose-h2:mt-8 prose-h3:text-lg prose-a:text-accent-600 prose-code:text-accent-700 prose-code:before:content-none prose-code:after:content-none prose-blockquote:border-accent-300 prose-blockquote:text-ink-600">
        <MDXRemote
          source={source}
          components={mdxComponents}
          options={{
            mdxOptions: {
              remarkPlugins: [remarkMath],
              rehypePlugins: [rehypeKatex],
            },
          }}
        />
      </div>

      <nav className="mt-12 flex items-center justify-between gap-4 border-t border-ink-200 pt-6 text-sm">
        {prev ? (
          <Link
            href={moduleHref(prev.meta.slug)}
            className="flex flex-col rounded px-3 py-2 text-left hover:bg-ink-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-500"
          >
            <span className="text-xs text-ink-400">← Anterior</span>
            <span className="font-medium text-ink-700">{prev.meta.title}</span>
          </Link>
        ) : (
          <span />
        )}
        {next ? (
          <Link
            href={moduleHref(next.meta.slug)}
            className="flex flex-col rounded px-3 py-2 text-right hover:bg-ink-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-500"
          >
            <span className="text-xs text-ink-400">Siguiente →</span>
            <span className="font-medium text-ink-700">{next.meta.title}</span>
          </Link>
        ) : (
          <span />
        )}
      </nav>
    </AppLayout>
  );
}
