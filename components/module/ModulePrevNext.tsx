import Link from 'next/link';
import type { ModuleEntry } from '@/types/course';

interface Props {
  prev: ModuleEntry | undefined;
  next: ModuleEntry | undefined;
  /** Builds the href for a given module slug. Injected to keep this component route-agnostic. */
  moduleHref: (slug: string) => string;
}

/**
 * Bottom navigation bar: links to the previous and next modules.
 * Renders an empty `<span>` on whichever side has no adjacent module
 * so the opposite link stays aligned with `justify-between`.
 */
export function ModulePrevNext({ prev, next, moduleHref }: Props) {
  return (
    <nav
      aria-label="Navegación entre módulos"
      className="mt-12 flex items-center justify-between gap-4 border-t border-ink-200 pt-6 text-sm"
    >
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
  );
}
