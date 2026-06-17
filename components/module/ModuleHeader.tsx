interface Props {
  title: string;
  subtitle?: string;
  datasets?: string[];
}

/**
 * Module page header: title, optional subtitle, and optional datasets badge.
 * Pure presentational — receives only primitives, no data-fetching inside.
 */
export function ModuleHeader({ title, subtitle, datasets }: Props) {
  return (
    <>
      <h1 className="text-2xl font-semibold tracking-tight text-ink-900 sm:text-3xl">
        {title}
      </h1>

      {subtitle && (
        <p className="mt-2 text-sm text-ink-500">{subtitle}</p>
      )}

      {datasets && datasets.length > 0 && (
        <p className="mt-2 text-sm text-ink-500">
          <span className="font-medium text-ink-600">Datasets:</span>{' '}
          {datasets.join(', ')}
        </p>
      )}
    </>
  );
}
