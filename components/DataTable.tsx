export interface DataTableProps {
  caption?: string;
  columns: string[];
  rows: (string | number)[][];
}

/**
 * Small static table for showing example data, model output summaries
 * or comparison rows alongside the narrative text.
 */
export function DataTable({ caption, columns, rows }: DataTableProps) {
  return (
    <div className="my-6 overflow-x-auto rounded border border-ink-200">
      <table className="min-w-full divide-y divide-ink-200 text-sm">
        {caption && (
          <caption className="border-b border-ink-200 bg-ink-50 px-4 py-2 text-left text-xs font-medium text-ink-600">
            {caption}
          </caption>
        )}
        <thead className="bg-ink-50">
          <tr>
            {columns.map((col) => (
              <th
                key={col}
                scope="col"
                className="px-4 py-2 text-left text-xs font-semibold uppercase tracking-wide text-ink-600"
              >
                {col}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-ink-100 bg-white">
          {rows.map((row, i) => (
            <tr key={i} className="hover:bg-ink-50">
              {row.map((cell, j) => (
                <td key={j} className="whitespace-nowrap px-4 py-2 text-ink-700">
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
