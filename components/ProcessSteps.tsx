export interface ProcessStep {
  title: string;
  description: string;
}

/**
 * Numbered vertical step list used to lay out an analysis workflow
 * (e.g. "explorar → especificar → ajustar → diagnosticar → comparar").
 */
export function ProcessSteps({ steps, title }: { steps: ProcessStep[]; title?: string }) {
  if (!steps?.length) return null;
  return (
    <section className="my-6">
      {title && <h3 className="mb-3 text-lg font-semibold text-ink-900">{title}</h3>}
      <ol className="space-y-3">
        {steps.map((step, i) => (
          <li key={step.title} className="flex gap-3 rounded border border-ink-200 bg-white p-3">
            <span className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-accent-500 text-sm font-semibold text-white">
              {i + 1}
            </span>
            <div>
              <p className="text-sm font-semibold text-ink-900">{step.title}</p>
              <p className="text-sm text-ink-600">{step.description}</p>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}
