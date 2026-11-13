'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import clsx from 'clsx';
import type { ModuleEntry } from '@/types/course';
import { COURSE_SLUG } from '@/lib/constants';
import { ProgressBar } from './ProgressBar';
import { Logo } from './layout/Logo';
import { ExportPanel } from './ExportPanel';
import { useAllNotes, useModuleNoteCount, type Note } from '@/hooks/useNotes';

function NotesList({ notes, onNavigate }: { notes: Note[]; onNavigate?: () => void }) {
  if (notes.length === 0) {
    return (
      <p className="px-3 py-4 text-xs text-ink-400">
        Aún no tienes notas. Crea notas desde cualquier módulo usando el panel &ldquo;Mis notas&rdquo;.
      </p>
    );
  }
  return (
    <ul className="space-y-0.5">
      {notes.map((note) => {
        const href = `/cursos/${COURSE_SLUG}/modulos/${note.moduleSlug}`;
        return (
          <li key={note.id}>
            <Link
              href={href}
              onClick={onNavigate}
              className="block rounded px-3 py-1.5 text-sm transition-colors hover:bg-ink-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-500"
            >
              <p className="truncate font-medium text-ink-700">{note.title || 'Sin título'}</p>
              <p className="truncate text-xs text-ink-500">{note.content}</p>
              <p className="mt-0.5 text-[10px] text-ink-400">
                {new Date(note.updatedAt).toLocaleDateString('es-CO', { dateStyle: 'short' })}
              </p>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}

function ModuleListItem({ mod, index, active, href, onNavigate }: {
  mod: ModuleEntry;
  index: number;
  active: boolean;
  href: string;
  onNavigate?: () => void;
}) {
  const noteCount = useModuleNoteCount(mod.meta.slug);
  return (
    <li>
      <Link
        href={href}
        onClick={onNavigate}
        aria-current={active ? 'page' : undefined}
        className={clsx(
          'flex items-center gap-1.5 rounded px-3 py-1.5 text-sm transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-500',
          active
            ? 'bg-accent-50 font-medium text-accent-700'
            : 'text-ink-600 hover:bg-ink-100 hover:text-ink-900'
        )}
      >
        <span className="flex-1 truncate">
          {index + 1}. {mod.meta.title}
        </span>
        {noteCount > 0 && (
          <span
            className="h-1.5 w-1.5 flex-shrink-0 rounded-full bg-accent-500"
            aria-label={`${noteCount} nota${noteCount > 1 ? 's' : ''}`}
          />
        )}
      </Link>
    </li>
  );
}

function SidebarContent({ modules, onNavigate }: { modules: readonly ModuleEntry[]; onNavigate?: () => void }) {
  const pathname = usePathname();
  const [view, setView] = useState<'modules' | 'notes'>('modules');
  const { notes } = useAllNotes();

  return (
    <nav aria-label="Índice del curso" className="flex h-full flex-col">
      <div className="border-b border-ink-200 px-4 py-4">
        <Link href="/" onClick={onNavigate} className="inline-flex items-center focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-500">
          <Logo />
        </Link>
        <p className="mt-0.5 text-xs text-ink-500">Curso interactivo con R</p>
      </div>

      <ProgressBar totalModules={modules.length} />

      {/* Toggle: módulos / notas */}
      <div className="flex gap-1 border-b border-ink-200 px-2 py-1.5">
        <button
          type="button"
          onClick={() => setView('modules')}
          className={clsx(
            'flex-1 rounded px-2 py-1 text-xs font-medium transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-500',
            view === 'modules' ? 'bg-accent-50 text-accent-700' : 'text-ink-500 hover:bg-ink-100'
          )}
        >
          Módulos
        </button>
        <button
          type="button"
          onClick={() => setView('notes')}
          className={clsx(
            'flex-1 rounded px-2 py-1 text-xs font-medium transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-500',
            view === 'notes' ? 'bg-accent-50 text-accent-700' : 'text-ink-500 hover:bg-ink-100'
          )}
        >
          Notas{notes.length > 0 && (
            <span className="ml-1 rounded-full bg-accent-100 px-1.5 py-0.5 text-[10px] text-accent-700">{notes.length}</span>
          )}
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-2 py-2">
        {view === 'modules' ? (
          <ul className="space-y-0.5">
            {modules.map((mod, i) => {
              const href = `/cursos/${COURSE_SLUG}/modulos/${mod.meta.slug}`;
              const active = pathname === href;
              return (
                <ModuleListItem
                  key={mod.meta.slug}
                  mod={mod}
                  index={i}
                  active={active}
                  href={href}
                  onNavigate={onNavigate}
                />
              );
            })}
          </ul>
        ) : (
          <NotesList notes={notes} onNavigate={onNavigate} />
        )}
      </div>

      <ExportPanel />
    </nav>
  );
}

/** Desktop sidebar (collapsible) + mobile drawer with the course index. */
export function Sidebar({ modules }: { modules: ModuleEntry[] }) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      {/* Mobile top bar */}
      <div className="flex items-center justify-between border-b border-ink-200 bg-white px-4 py-3 lg:hidden">
        <Link href="/" className="inline-flex items-center focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-500">
          <Logo />
        </Link>
        <button
          type="button"
          onClick={() => setMobileOpen(true)}
          aria-label="Abrir índice del curso"
          className="rounded p-2 text-ink-600 hover:bg-ink-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-500"
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden>
            <path d="M2 5h16M2 10h16M2 15h16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </button>
      </div>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div
            className="absolute inset-0 bg-black/30 animate-fade-in"
            onClick={() => setMobileOpen(false)}
            aria-hidden
          />
          <div className="absolute inset-y-0 left-0 w-72 max-w-[85vw] animate-slide-in bg-white shadow-xl">
            <div className="flex justify-end p-2">
              <button
                type="button"
                onClick={() => setMobileOpen(false)}
                aria-label="Cerrar índice del curso"
                className="rounded p-2 text-ink-500 hover:bg-ink-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-500"
              >
                ✕
              </button>
            </div>
            <SidebarContent modules={modules} onNavigate={() => setMobileOpen(false)} />
          </div>
        </div>
      )}

      {/* Desktop sidebar */}
      <aside
        className={clsx(
          'relative hidden shrink-0 border-r border-ink-200 bg-white transition-all duration-300 lg:block',
          collapsed ? 'w-14' : 'w-72'
        )}
      >
        <button
          type="button"
          onClick={() => setCollapsed((v) => !v)}
          aria-label={collapsed ? 'Expandir índice' : 'Contraer índice'}
          aria-expanded={!collapsed}
          className="absolute -right-3 top-6 z-10 flex h-6 w-6 items-center justify-center rounded-full border border-ink-200 bg-white text-ink-500 shadow-sm hover:bg-ink-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-500"
        >
          <span aria-hidden className={clsx('transition-transform', collapsed && 'rotate-180')}>‹</span>
        </button>
        {collapsed ? (
          <div className="flex h-full flex-col items-center gap-4 py-6 text-ink-400" aria-hidden>
            <span className="rotate-180 text-xs [writing-mode:vertical-rl]">Índice del curso</span>
          </div>
        ) : (
          <SidebarContent modules={modules} />
        )}
      </aside>
    </>
  );
}
