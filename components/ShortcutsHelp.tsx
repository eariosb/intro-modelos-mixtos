'use client';

import { useState } from 'react';

const SHORTCUTS = [
  { keys: 'Ctrl / Cmd + Shift + B', action: 'Abrir/cerrar pizarra' },
  { keys: 'Ctrl / Cmd + Shift + S', action: 'Capturar región de pantalla' },
  { keys: 'P', action: 'Entrar/salir del modo presentación' },
  { keys: 'S', action: 'Armar spotlight (arrastra para enfocar una zona)' },
  { keys: '→ · Espacio · PageDown', action: 'En presentación: revelar el siguiente paso' },
  { keys: '← · PageUp', action: 'En presentación: retroceder un paso' },
  { keys: 'Esc', action: 'Desarmar spotlight → quitar spotlight → salir de presentación' },
  { keys: 'Ctrl / Cmd + Z', action: 'Deshacer en pizarra' },
  { keys: 'Ctrl / Cmd + Shift + Z', action: 'Rehacer en pizarra' },
  { keys: '7', action: 'Seleccionar lápiz en Excalidraw' },
];

export function ShortcutsHelp() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="rounded border border-ink-200 px-2 py-1 text-xs font-medium text-ink-600 hover:bg-ink-100"
        title="Ver atajos de teclado"
      >
        ⌨️ Atajos
      </button>
      {open && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-sm rounded border border-ink-200 bg-white p-4 shadow-xl dark:bg-ink-800 dark:border-ink-700">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-sm font-semibold text-ink-800 dark:text-ink-100">Atajos de teclado</h3>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="text-xs text-ink-400 hover:text-ink-600 dark:text-ink-400 dark:hover:text-ink-200"
              >
                ✕
              </button>
            </div>
            <div className="space-y-2">
              {SHORTCUTS.map((s) => (
                <div key={s.keys} className="flex items-center justify-between text-xs">
                  <kbd className="rounded border border-ink-200 bg-ink-50 px-1.5 py-0.5 font-mono text-ink-700 dark:border-ink-600 dark:bg-ink-700 dark:text-ink-200">
                    {s.keys}
                  </kbd>
                  <span className="text-ink-600 dark:text-ink-300">{s.action}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
