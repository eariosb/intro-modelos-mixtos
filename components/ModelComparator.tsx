'use client';

import { useState } from 'react';
import clsx from 'clsx';

interface ModelRow {
  id: string;
  name: string;
  formula: string;
  aic: number;
  bic: number;
  logLik: number;
  deviance: number;
  df: number;
}

// Starts empty on purpose: in class the teacher adds models from real R
// output (no fabricated defaults in an academic setting).
const DEFAULT_MODELS: ModelRow[] = [];

export function ModelComparator() {
  const [models, setModels] = useState<ModelRow[]>(DEFAULT_MODELS);
  const [showAdd, setShowAdd] = useState(false);
  const [newName, setNewName] = useState('');
  const [newFormula, setNewFormula] = useState('');
  const [newAic, setNewAic] = useState('');
  const [newBic, setNewBic] = useState('');
  const [newLogLik, setNewLogLik] = useState('');
  const [newDf, setNewDf] = useState('');

  const sorted = [...models].sort((a, b) => a.aic - b.aic);
  const bestAic = sorted[0]?.aic ?? 0;

  const handleAdd = () => {
    const aic = parseFloat(newAic);
    const bic = parseFloat(newBic);
    const logLik = parseFloat(newLogLik);
    const df = parseInt(newDf, 10);
    if (!newName || !newFormula || isNaN(aic)) return;

    const model: ModelRow = {
      id: `m${Date.now()}`,
      name: newName,
      formula: newFormula,
      aic,
      bic: isNaN(bic) ? aic + 2 * df : bic,
      logLik: isNaN(logLik) ? -(aic / 2) + df / 2 : logLik,
      deviance: -2 * (isNaN(logLik) ? -(aic / 2) + df / 2 : logLik),
      df: isNaN(df) ? 1 : df,
    };
    setModels((prev) => [...prev, model]);
    setNewName('');
    setNewFormula('');
    setNewAic('');
    setNewBic('');
    setNewLogLik('');
    setNewDf('');
    setShowAdd(false);
  };

  const handleDelete = (id: string) => {
    setModels((prev) => prev.filter((m) => m.id !== id));
  };

  return (
    <div className="my-6 overflow-hidden rounded border border-ink-200 bg-white shadow-sm">
      <div className="border-b border-ink-200 bg-ink-50 px-4 py-2">
        <p className="text-sm font-semibold text-ink-800">Comparador de modelos</p>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-ink-200 text-sm">
          <thead className="bg-accent-50">
            <tr>
              <th className="px-3 py-2 text-left text-xs font-semibold uppercase text-accent-800">Modelo</th>
              <th className="px-3 py-2 text-left text-xs font-semibold uppercase text-accent-800">Fórmula</th>
              <th className="px-3 py-2 text-right text-xs font-semibold uppercase text-accent-800">AIC</th>
              <th className="px-3 py-2 text-right text-xs font-semibold uppercase text-accent-800">BIC</th>
              <th className="px-3 py-2 text-right text-xs font-semibold uppercase text-accent-800">logLik</th>
              <th className="px-3 py-2 text-right text-xs font-semibold uppercase text-accent-800">df</th>
              <th className="px-3 py-2 text-right text-xs font-semibold uppercase text-accent-800">ΔAIC</th>
              <th className="px-3 py-2"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-ink-100">
            {sorted.length === 0 && (
              <tr>
                <td colSpan={8} className="px-3 py-4 text-center text-xs text-ink-400">
                  Sin modelos. Añade los ajustes que hagas en R (nombre, fórmula y AIC de la salida)
                  para compararlos lado a lado.
                </td>
              </tr>
            )}
            {sorted.map((m) => (
              <tr key={m.id} className={clsx('hover:bg-accent-50/40', m.aic === bestAic && 'bg-accent-50/30')}>
                <td className="px-3 py-2 font-medium text-ink-800">{m.name}</td>
                <td className="px-3 py-2 font-mono text-xs text-ink-600">{m.formula}</td>
                <td className="px-3 py-2 text-right font-mono text-ink-700">{m.aic.toFixed(1)}</td>
                <td className="px-3 py-2 text-right font-mono text-ink-600">{m.bic.toFixed(1)}</td>
                <td className="px-3 py-2 text-right font-mono text-ink-600">{m.logLik.toFixed(1)}</td>
                <td className="px-3 py-2 text-right font-mono text-ink-600">{m.df}</td>
                <td className={clsx(
                  'px-3 py-2 text-right font-mono',
                  m.aic === bestAic ? 'font-semibold text-accent-700' : 'text-ink-500'
                )}>
                  {m.aic === bestAic ? '—' : `+${(m.aic - bestAic).toFixed(1)}`}
                </td>
                <td className="px-3 py-2 text-right">
                  <button
                    type="button"
                    onClick={() => handleDelete(m.id)}
                    className="text-ink-400 hover:text-red-600"
                    aria-label="Eliminar modelo"
                  >
                    ✕
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showAdd ? (
        <div className="border-t border-ink-200 p-3 animate-fade-in">
          <div className="flex flex-wrap items-end gap-2">
            <label className="text-xs text-ink-600">
              Nombre
              <input value={newName} onChange={(e) => setNewName(e.target.value)} className="mt-0.5 block w-32 rounded border border-ink-200 px-2 py-1 text-xs" />
            </label>
            <label className="text-xs text-ink-600">
              Fórmula
              <input value={newFormula} onChange={(e) => setNewFormula(e.target.value)} placeholder="lmer(y ~ ...)" className="mt-0.5 block w-48 rounded border border-ink-200 px-2 py-1 font-mono text-xs" />
            </label>
            <label className="text-xs text-ink-600">
              AIC
              <input value={newAic} onChange={(e) => setNewAic(e.target.value)} type="number" step="0.1" className="mt-0.5 block w-20 rounded border border-ink-200 px-2 py-1 text-xs" />
            </label>
            <label className="text-xs text-ink-600">
              BIC
              <input value={newBic} onChange={(e) => setNewBic(e.target.value)} type="number" step="0.1" className="mt-0.5 block w-20 rounded border border-ink-200 px-2 py-1 text-xs" />
            </label>
            <label className="text-xs text-ink-600">
              logLik
              <input value={newLogLik} onChange={(e) => setNewLogLik(e.target.value)} type="number" step="0.1" className="mt-0.5 block w-20 rounded border border-ink-200 px-2 py-1 text-xs" />
            </label>
            <label className="text-xs text-ink-600">
              df
              <input value={newDf} onChange={(e) => setNewDf(e.target.value)} type="number" className="mt-0.5 block w-16 rounded border border-ink-200 px-2 py-1 text-xs" />
            </label>
            <button
              type="button"
              onClick={handleAdd}
              className="rounded bg-accent-500 px-3 py-1 text-xs font-medium text-white hover:bg-accent-600"
            >
              Añadir
            </button>
            <button
              type="button"
              onClick={() => setShowAdd(false)}
              className="rounded border border-ink-300 px-3 py-1 text-xs text-ink-600 hover:bg-ink-100"
            >
              Cancelar
            </button>
          </div>
        </div>
      ) : (
        <div className="border-t border-ink-200 p-2">
          <button
            type="button"
            onClick={() => setShowAdd(true)}
            className="text-xs text-accent-600 hover:underline"
          >
            + Añadir modelo
          </button>
        </div>
      )}
    </div>
  );
}
