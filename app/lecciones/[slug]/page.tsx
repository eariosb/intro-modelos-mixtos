import Link from 'next/link';
import { notFound } from 'next/navigation';
import { allLessons } from '@/content/modules';
import { useModuleContent } from '@/hooks/useModuleContent';
import { AppLayout } from '@/components/AppLayout';
import { Breadcrumb } from '@/components/Breadcrumb';
import { LessonContent } from '@/components/LessonContent';
import { RCell } from '@/components/RCell';
import { SASAccordion } from '@/components/SASAccordion';
import { LessonProgressTracker } from '@/components/LessonProgressTracker';
import { Callout } from '@/components/Callout';
import { Flashcard } from '@/components/Flashcard';
import { Quiz } from '@/components/Quiz';
import { DataTable } from '@/components/DataTable';
import { ProcessSteps } from '@/components/ProcessSteps';

export function generateStaticParams() {
  return allLessons.map(({ lesson }) => ({ slug: lesson.slug }));
}

export default function LessonPage({ params }: { params: { slug: string } }) {
  const content = useModuleContent(params.slug);
  if (!content) notFound();

  const { module, lesson, prev, next, markdown: lessonMarkdown } = content;

  return (
    <AppLayout>
      <LessonProgressTracker slug={lesson.slug} />
      <Breadcrumb module={module} lesson={lesson} />

      <h1 className="text-2xl font-semibold tracking-tight text-ink-900 sm:text-3xl">
        {lesson.title}
      </h1>

      {lesson.datasets && lesson.datasets.length > 0 && (
        <p className="mt-2 text-sm text-ink-500">
          <span className="font-medium text-ink-600">Datasets:</span> {lesson.datasets.join(', ')}
        </p>
      )}

      <div className="mt-4 rounded border border-accent-100 bg-accent-50 p-4">
        <h2 className="text-sm font-semibold text-accent-800">Objetivos de aprendizaje</h2>
        <ul className="mt-2 list-inside list-disc space-y-1 text-sm text-accent-900">
          {lesson.objectives.map((obj) => (
            <li key={obj}>{obj}</li>
          ))}
        </ul>
      </div>

      <div className="mt-6">
        <LessonContent content={lessonMarkdown} />
      </div>

      {lesson.processSteps && lesson.processSteps.length > 0 && (
        <ProcessSteps steps={lesson.processSteps} title="Flujo de análisis" />
      )}

      {lesson.dataTables?.map((table) => (
        <DataTable key={table.caption ?? table.columns.join('-')} {...table} />
      ))}

      {lesson.callouts?.map((c) => (
        <Callout key={c.title ?? c.content.slice(0, 24)} type={c.type} title={c.title}>
          <p>{c.content}</p>
        </Callout>
      ))}

      {lesson.rCells.map((cell, i) => (
        <div key={cell.id}>
          <RCell cell={cell} />
          {/* Show the matching SAS example right after its R counterpart, if any */}
          {lesson.sasExamples?.[i] && <SASAccordion example={lesson.sasExamples[i]} />}
        </div>
      ))}

      {/* Any remaining SAS examples without a 1:1 R cell pairing */}
      {lesson.sasExamples?.slice(lesson.rCells.length).map((example) => (
        <SASAccordion key={example.title} example={example} />
      ))}

      {lesson.flashcards && lesson.flashcards.length > 0 && (
        <Flashcard cards={lesson.flashcards} />
      )}

      {lesson.quiz && lesson.quiz.length > 0 && <Quiz questions={lesson.quiz} />}

      <nav className="mt-12 flex items-center justify-between gap-4 border-t border-ink-200 pt-6 text-sm">
        {prev ? (
          <Link
            href={`/lecciones/${prev.lesson.slug}`}
            className="flex flex-col rounded px-3 py-2 text-left hover:bg-ink-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-500"
          >
            <span className="text-xs text-ink-400">← Anterior</span>
            <span className="font-medium text-ink-700">{prev.lesson.title}</span>
          </Link>
        ) : (
          <span />
        )}
        {next ? (
          <Link
            href={`/lecciones/${next.lesson.slug}`}
            className="flex flex-col rounded px-3 py-2 text-right hover:bg-ink-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-500"
          >
            <span className="text-xs text-ink-400">Siguiente →</span>
            <span className="font-medium text-ink-700">{next.lesson.title}</span>
          </Link>
        ) : (
          <span />
        )}
      </nav>
    </AppLayout>
  );
}
