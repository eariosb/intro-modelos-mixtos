import { isValidElement, type ReactNode } from 'react';
import type { MDXComponents } from 'mdx/types';
import { Callout } from '@/components/Callout';
import { CodeBlock } from '@/components/CodeBlock';
import { RCell } from '@/components/RCell';
import { SASAccordion } from '@/components/SASAccordion';
import { Quiz } from '@/components/Quiz';
import { Flashcards } from '@/components/Flashcard';
import { DataTable } from '@/components/DataTable';
import { ProcessSteps } from '@/components/ProcessSteps';
import { MatrixBuilder } from '@/components/MatrixBuilder';
import { ModelComparator } from '@/components/ModelComparator';
import { FormulaPalette } from '@/components/FormulaPalette';
import { BlackboardAnchor, BlackboardEmbed } from '@cursos/blackboard';

// MDXComponents maps to native HTML element props, where children is optional.
// All table wrappers use { children?: ReactNode } to satisfy that contract.

function nodeText(node: ReactNode): string {
  if (typeof node === 'string') return node;
  if (typeof node === 'number') return String(node);
  if (Array.isArray(node)) return node.map(nodeText).join('');
  if (isValidElement(node)) {
    return nodeText((node.props as { children?: ReactNode }).children);
  }
  return '';
}

/**
 * Fenced code blocks become a dark reference card with syntax highlighting
 * and a copy button. Language comes from the `language-*` class remark adds
 * to the inner <code> element.
 */
function MdxPre({ children }: { children?: ReactNode }) {
  const child = isValidElement(children) ? children : null;
  const className =
    (child?.props as { className?: string } | undefined)?.className ?? '';
  const lang = /language-(\w+)/.exec(className)?.[1] ?? '';
  return <CodeBlock code={nodeText(children).replace(/\n$/, '')} lang={lang} />;
}

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
  MatrixBuilder,
  ModelComparator,
  FormulaPalette,
  BlackboardAnchor,
  BlackboardEmbed,
  pre: MdxPre,
  // GFM table elements -- styled to match the course palette
  table: MdxTable,
  thead: MdxThead,
  th: MdxTh,
  td: MdxTd,
  tr: MdxTr,
  tbody: MdxTbody,
};
