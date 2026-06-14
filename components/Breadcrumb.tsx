import Link from 'next/link';
import type { Module, Lesson } from '@/content/types';

export function Breadcrumb({ module, lesson }: { module: Module; lesson: Lesson }) {
  return (
    <nav aria-label="Ruta de navegación" className="mb-4 text-sm text-ink-500">
      <ol className="flex flex-wrap items-center gap-1.5">
        <li>
          <Link href="/" className="hover:text-accent-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-500">
            Curso
          </Link>
        </li>
        <li aria-hidden>/</li>
        <li className="text-ink-600">{module.title}</li>
        <li aria-hidden>/</li>
        <li aria-current="page" className="font-medium text-ink-800">
          {lesson.title}
        </li>
      </ol>
    </nav>
  );
}
