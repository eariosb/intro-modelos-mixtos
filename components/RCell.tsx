'use client';

import { useState } from 'react';
import CodeMirror from '@uiw/react-codemirror';
import { StreamLanguage } from '@codemirror/language';
import { r as rMode } from '@codemirror/legacy-modes/mode/r';
import { useRCell } from '@/hooks/useWebR';
import { ConsoleOutput } from './ConsoleOutput';
import type { RCellProps } from '@/types/course';

const rLanguage = StreamLanguage.define(rMode);

/**
 * An editable, executable R code cell. Runs against the shared WebR
 * instance (lazily booted on first run) and renders console output,
 * plots and R-level errors below the editor.
 */
export function RCell({ id, title, code: initialCode }: RCellProps) {
  const [code, setCode] = useState(initialCode);
  const { state, result, webRStatus, webRError, run } = useRCell();

  const isRunning = state === 'running';
  const isBooting = webRStatus === 'loading' && isRunning;

  return (
    <div className="my-6 overflow-hidden rounded border border-ink-200 bg-ink-50 shadow-sm transition-shadow hover:shadow-md">
      {title && (
        <div className="border-b border-ink-200 bg-white px-4 py-2 text-sm font-medium text-ink-700">
          {title}
        </div>
      )}

      <CodeMirror
        value={code}
        height="auto"
        extensions={[rLanguage]}
        onChange={(value) => setCode(value)}
        basicSetup={{ lineNumbers: true, foldGutter: false, highlightActiveLine: false }}
        className="text-sm"
        aria-label={title ? `Editor de código R: ${title}` : 'Editor de código R'}
      />

      <div className="flex items-center gap-2 border-t border-ink-200 bg-white px-3 py-2">
        <button
          type="button"
          onClick={() => run(code)}
          disabled={isRunning}
          className="inline-flex items-center gap-1.5 rounded bg-accent-500 px-3 py-1.5 text-sm font-medium text-white transition-colors hover:bg-accent-600 disabled:cursor-not-allowed disabled:opacity-60 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-500"
        >
          {isRunning ? (
            <>
              <span className="h-2 w-2 animate-pulse rounded-full bg-white" aria-hidden />
              {isBooting ? 'Cargando R…' : 'Ejecutando…'}
            </>
          ) : (
            <>▶ Ejecutar</>
          )}
        </button>
        <button
          type="button"
          onClick={() => setCode(initialCode)}
          disabled={code === initialCode}
          className="rounded border border-ink-300 px-3 py-1.5 text-sm font-medium text-ink-600 transition-colors hover:bg-ink-100 disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-500"
        >
          Restaurar código original
        </button>
        {isBooting && (
          <span className="text-xs text-ink-500" role="status">
            Iniciando entorno R (WebAssembly) — solo la primera vez puede tardar unos segundos…
          </span>
        )}
      </div>

      {webRStatus === 'error' && (
        <div className="px-4 py-2 text-sm text-red-700 bg-red-50 border-t border-ink-200" role="alert">
          <strong>No se pudo iniciar el entorno R (WebAssembly).</strong>
          <div className="mt-1 text-xs">
            {webRError ?? 'Error desconocido al cargar WebR.'}
          </div>
          {typeof window !== 'undefined' && !window.crossOriginIsolated && (
            <div className="mt-1 text-xs">
              Este sitio no está &quot;cross-origin isolated&quot; (
              <code>window.crossOriginIsolated === false</code>). WebR
              necesita <code>SharedArrayBuffer</code>, lo cual requiere que
              el sitio se sirva por <strong>HTTPS</strong> (o{' '}
              <code>localhost</code>) y que las cabeceras{' '}
              <code>Cross-Origin-Opener-Policy: same-origin</code> y{' '}
              <code>Cross-Origin-Embedder-Policy: credentialless</code>{' '}
              lleguen sin ser eliminadas por un proxy/reverse-proxy.
            </div>
          )}
        </div>
      )}

      {result && (
        <div className="animate-fade-in border-t border-ink-200">
          {result.error && (
            <div className="px-4 py-2 text-sm text-red-700 bg-red-50" role="alert">
              <strong>Error en R:</strong> {result.error}
            </div>
          )}
          {result.text && <ConsoleOutput text={result.text} />}
          {result.plots.map((src, i) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              key={i}
              src={src}
              alt={`Gráfico generado por R (resultado ${i + 1})`}
              className="mx-auto block max-w-full bg-white p-2"
            />
          ))}
        </div>
      )}
    </div>
  );
}
