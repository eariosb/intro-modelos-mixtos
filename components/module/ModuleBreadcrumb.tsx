import Link from 'next/link';
import { COURSE_LABEL } from '@/lib/constants';

interface Props {
  /** Human-readable label for the breadcrumb root link. */
  homeLabel?: string;
  /** Title of the current page shown as the last crumb. */
  title: string;
}

/**
 * Accessible breadcrumb trail for module pages.
 * Root always points to `/` (the course index).
 */
export function ModuleBreadcrumb({ title, homeLabel = COURSE_LABEL }: Props) {
  return (
    <nav aria-label="Ruta de navegación" className="mb-4 text-sm text-ink-500">
      <ol className="flex flex-wrap items-center gap-1.5">
        <li>
          <Link
            href="/"
            className="hover:text-accent-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-500"
          >
            {homeLabel}
          </Link>
        </li>
        <li aria-hidden>/</li>
        <li aria-current="page" className="font-medium text-ink-800">
          {title}
        </li>
      </ol>
    </nav>
  );
}
