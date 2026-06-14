'use client';

import { useId, useState } from 'react';
import CodeMirror from '@uiw/react-codemirror';
import { StreamLanguage } from '@codemirror/language';
import { sas as sasMode } from '@codemirror/legacy-modes/mode/sas';
import { oneDark } from '@codemirror/theme-one-dark';
import type { SasExample } from '@/content/types';

const sasLanguage = StreamLanguage.define(sasMode);

/**
 * Collapsible, non-executable SAS reference example. Always rendered
 * with a dark theme to visually distinguish it from the editable,
 * runnable R cells.
 */
export function SASAccordion({ example }: { example: SasExample }) {
  const [open, setOpen] = useState(false);
  const panelId = useId();

  return (
    <div className="my-6 overflow-hidden rounded border border-ink-200">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-controls={panelId}
        className="flex w-full items-center justify-between gap-3 bg-ink-100 px-4 py-3 text-left text-sm font-semibold text-ink-800 transition-colors hover:bg-ink-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-500"
      >
        <span className="flex items-center gap-2">
          <span aria-hidden className="inline-block rounded bg-ink-700 px-1.5 py-0.5 text-[10px] font-bold text-white">SAS</span>
          Alternativa en SAS — {example.title}
        </span>
        <span aria-hidden className={`transition-transform ${open ? 'rotate-180' : ''}`}>▾</span>
      </button>

      {open && (
        <div id={panelId} className="animate-fade-in">
          <p className="bg-ink-800 px-4 py-2 text-xs text-ink-300">
            Este código es ilustrativo y no se ejecuta en el navegador. Requiere una sesión de SAS / SAS Studio.
          </p>
          <CodeMirror
            value={example.code}
            theme={oneDark}
            height="auto"
            editable={false}
            extensions={[sasLanguage]}
            basicSetup={{ lineNumbers: true, foldGutter: false, highlightActiveLine: false }}
            className="text-sm"
          />
        </div>
      )}
    </div>
  );
}
