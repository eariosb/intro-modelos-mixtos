import type { MDXComponents } from 'mdx/types';
import { Callout } from '@/components/Callout';
import { RCell } from '@/components/RCell';
import { SASAccordion } from '@/components/SASAccordion';
import { Quiz } from '@/components/Quiz';
import { Flashcards } from '@/components/Flashcard';
import { DataTable } from '@/components/DataTable';
import { ProcessSteps } from '@/components/ProcessSteps';

/**
 * Global MDX component map used to render lesson content from
 * `/content/modules/*.mdx`. Every lesson is self-contained and only
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
};
