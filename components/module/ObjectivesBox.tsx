interface Props {
  /** Pre-normalized array — callers should convert string | string[] before passing. */
  objectives: string[];
}

/**
 * Highlighted box listing the learning objectives for a module.
 * Expects objectives already normalized to string[] (see resolveModuleData).
 */
export function ObjectivesBox({ objectives }: Props) {
  return (
    <div className="mt-4 rounded border border-accent-100 bg-accent-50 p-4">
      <h2 className="text-sm font-semibold text-accent-800">
        Objetivos de aprendizaje
      </h2>
      <ul className="mt-2 list-inside list-disc space-y-1 text-sm text-accent-900">
        {objectives.map((obj) => (
          <li key={obj}>{obj}</li>
        ))}
      </ul>
    </div>
  );
}
