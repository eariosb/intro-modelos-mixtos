'use client';

import { useState } from 'react';
import CodeMirror from '@uiw/react-codemirror';
import { StreamLanguage } from '@codemirror/language';
import { r as rMode } from '@codemirror/legacy-modes/mode/r';
import { sas as sasMode } from '@codemirror/legacy-modes/mode/sas';
import { shell as shellMode } from '@codemirror/legacy-modes/mode/shell';
import { oneDark } from '@codemirror/theme-one-dark';

const LANGUAGES: Record<string, { label: string; extension?: ReturnType<typeof StreamLanguage.define> }> = {
  r: { label: 'R', extension: StreamLanguage.define(rMode) },
  sas: { label: 'SAS', extension: StreamLanguage.define(sasMode) },
  bash: { label: 'Shell', extension: StreamLanguage.define(shellMode) },
  sh: { label: 'Shell', extension: StreamLanguage.define(shellMode) },
};

/**
 * Non-executable code fence rendered as a dark reference card with syntax
 * highlighting and a one-click copy button. Used for code that cannot run in
 * the browser (packages unavailable in WebR, SAS, shell commands).
 */
export function CodeBlock({ code, lang }: Readonly<{ code: string; lang: string }>) {
  const [copied, setCopied] = useState(false);
  const language = LANGUAGES[lang.toLowerCase()];
  const label = language?.label ?? (lang ? lang.toUpperCase() : 'Código');

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      // Clipboard API unavailable (insecure context) — fall back to a
      // temporary textarea so the button never fails silently.
      const area = document.createElement('textarea');
      area.value = code;
      area.setAttribute('readonly', '');
      area.style.position = 'fixed';
      area.style.opacity = '0';
      document.body.appendChild(area);
      area.select();
      const ok = document.execCommand('copy');
      document.body.removeChild(area);
      if (ok) {
        setCopied(true);
        setTimeout(() => setCopied(false), 1600);
      }
    }
  };

  return (
    <div className="my-6 overflow-hidden rounded border border-ink-700">
      <div className="flex items-center justify-between gap-3 bg-ink-800 px-4 py-2">
        <span className="rounded bg-ink-700 px-1.5 py-0.5 text-[10px] font-bold tracking-wide text-accent-200">
          {label}
        </span>
        <button
          type="button"
          onClick={() => void copy()}
          aria-label={copied ? 'Código copiado' : 'Copiar código al portapapeles'}
          className="rounded border border-ink-600 px-2.5 py-1 text-xs font-medium text-ink-200 transition-colors hover:border-accent-400 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-400"
        >
          {copied ? 'Copiado' : 'Copiar'}
        </button>
      </div>
      <CodeMirror
        value={code}
        theme={oneDark}
        height="auto"
        editable={false}
        extensions={language?.extension ? [language.extension] : []}
        basicSetup={{ lineNumbers: true, foldGutter: false, highlightActiveLine: false }}
        className="text-sm"
        aria-label={`Código ${label}`}
      />
    </div>
  );
}
