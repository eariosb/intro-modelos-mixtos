import type { ReactNode } from 'react';
import clsx from 'clsx';

export type CalloutType = 'tip' | 'info' | 'warning' | 'success';

const STYLES: Record<CalloutType, { wrap: string; badge: string; icon: string; label: string }> = {
  tip: {
    wrap: 'border-accent-200 bg-accent-50',
    badge: 'text-accent-700',
    icon: '💡',
    label: 'Tip',
  },
  info: {
    wrap: 'border-ink-200 bg-ink-50',
    badge: 'text-ink-700',
    icon: 'ℹ️',
    label: 'Nota',
  },
  warning: {
    wrap: 'border-amber-200 bg-amber-50',
    badge: 'text-amber-800',
    icon: '⚠️',
    label: 'Atención',
  },
  success: {
    wrap: 'border-emerald-200 bg-emerald-50',
    badge: 'text-emerald-800',
    icon: '✅',
    label: 'Buena práctica',
  },
};

/**
 * Inline callout box for tips, warnings, info notes and "buenas
 * prácticas" highlighted within a lesson's narrative.
 */
export function Callout({
  type = 'tip',
  title,
  children,
}: {
  type?: CalloutType;
  title?: string;
  children: ReactNode;
}) {
  const s = STYLES[type];
  return (
    <div className={clsx('my-6 rounded border px-4 py-3', s.wrap)}>
      <p className={clsx('mb-1 flex items-center gap-2 text-sm font-semibold', s.badge)}>
        <span aria-hidden>{s.icon}</span>
        {title ?? s.label}
      </p>
      <div className="prose prose-ink prose-sm max-w-none text-ink-700 prose-p:my-1">
        {children}
      </div>
    </div>
  );
}
