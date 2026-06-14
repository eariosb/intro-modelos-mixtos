'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import clsx from 'clsx';
import { modules } from '@/content/modules';
import { ProgressBar } from './ProgressBar';
import { Logo } from './layout/Logo';

function SidebarContent({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();

  return (
    <nav aria-label="Índice del curso" className="flex h-full flex-col">
      <div className="border-b border-ink-200 px-4 py-4">
        <Link href="/" onClick={onNavigate} className="inline-flex items-center focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-500">
          <Logo />
        </Link>
        <p className="mt-0.5 text-xs text-ink-500">Curso interactivo con R</p>
      </div>

      <ProgressBar />

      <div className="flex-1 overflow-y-auto px-2 py-2">
        {modules.map((mod) => (
          <div key={mod.slug} className="mb-3">
            <p className="px-2 py-1 text-xs font-semibold uppercase tracking-wide text-ink-400">
              {mod.title}
              {mod.comingSoon && (
                <span className="ml-2 rounded-full bg-ink-100 px-2 py-0.5 text-[10px] font-medium text-ink-500 normal-case">
                  Próximamente
                </span>
              )}
            </p>
            <ul className="space-y-0.5">
              {mod.lessons.map((lesson) => {
                const href = `/lecciones/${lesson.slug}`;
                const active = pathname === href;
                return (
                  <li key={lesson.slug}>
                    <Link
                      href={href}
                      onClick={onNavigate}
                      aria-current={active ? 'page' : undefined}
                      className={clsx(
                        'block rounded px-3 py-1.5 text-sm transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-500',
                        active
                          ? 'bg-accent-50 font-medium text-accent-700'
                          : 'text-ink-600 hover:bg-ink-100 hover:text-ink-900'
                      )}
                    >
                      {lesson.title}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </div>
    </nav>
  );
}

/** Desktop sidebar (collapsible) + mobile drawer with the course index. */
export function Sidebar() {
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
            <SidebarContent onNavigate={() => setMobileOpen(false)} />
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
          <SidebarContent />
        )}
      </aside>
    </>
  );
}
