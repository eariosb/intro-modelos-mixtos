import type { ReactNode } from 'react';
import type { MDXComponents } from 'mdx/types';
import { Callout } from '@/components/Callout';
import { RCell } from '@/components/RCell';
import { SASAccordion } from '@/components/SASAccordion';
import { Quiz } from '@/components/Quiz';
import { Flashcards } from '@/components/Flashcard';
import { DataTable } from '@/components/DataTable';
import { ProcessSteps } from '@/components/ProcessSteps';

// MDXComponents maps to native HTML element props, where children is optional.
// All table wrappers use { children?: ReactNode } to satisfy that contract.

function MdxTable({ children }: { children?: ReactNode }) {
  return (
    <div className="my-6 w-full overflow-x-auto rounded border border-ink-200">
      <table className="min-w-full divide-y divide-ink-200 text-sm">
        {children}
      </table>
    </div>
  );
}

function MdxThead({ children }: { children?: ReactNode }) {
  return <thead className="bg-accent-50">{children}</thead>;
}

function MdxTh({ children }: { children?: ReactNode }) {
  return (
    <th className="px-4 py-2.5 text-left text-xs font-semibold uppercase tracking-wide text-accent-800">
      {children}
    </th>
  );
}

function MdxTd({ children }: { children?: ReactNode }) {
  return (
    <td className="px-4 py-2.5 align-top text-ink-700 border-t border-ink-100">
      {children}
    </td>
  );
}

function MdxTr({ children }: { children?: ReactNode }) {
  return (
    <tr className="even:bg-ink-50 hover:bg-accent-50/40 transition-colors">
      {children}
    </tr>
  );
}

function MdxTbody({ children }: { children?: ReactNode }) {
  return <tbody className="divide-y divide-ink-100">{children}</tbody>;
}

/**
 * Global MDX component map used to render lesson content from
 * /content/modules/*.mdx. Every lesson is self-contained and only
 * depends on the components registered here.
 */
export const mdxComponents: MDXComponents = {
  Callout,
  RCell,
  SASAccordion,
  Quiz,
  Flashcards,
  DataTable,
  ProcessSteps,
  // GFM table elements -- styled to match the course palette
  table: MdxTable,
  thead: MdxThead,
  th: MdxTh,
  td: MdxTd,
  tr: MdxTr,
  tbody: MdxTbody,
};
