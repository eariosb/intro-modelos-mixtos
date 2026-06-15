// Shared content types for the Mixed Models course (MDX-based architecture).

/** Front-matter metadata stored at the top of each module's .mdx file. */
export interface ModuleMeta {
  /** Lesson/module title shown as the page heading. */
  title: string;
  /** URL slug, e.g. "01-introduccion-modelos-mixtos". */
  slug: string;
  /** Short subtitle / tagline shown under the title. */
  subtitle: string;
  /** Learning objective(s) for the module. */
  objective: string | string[];
  /** 1-based position of the module within the course. */
  order: number;
  /** Dataset(s) used in this module, shown in the lesson header. */
  datasets?: string[];
}

/** A module entry combining its front matter with the file location. */
export interface ModuleEntry {
  meta: ModuleMeta;
  /** File name (without directory), e.g. "01-introduccion-modelos-mixtos.mdx". */
  fileName: string;
}

export type CalloutType = 'tip' | 'info' | 'warning' | 'success';

export interface CalloutProps {
  type?: CalloutType;
  title?: string;
  children: React.ReactNode;
}

export interface RCellProps {
  /** Unique id within the lesson, used for restore-original tracking. */
  id: string;
  /** Short label shown above the cell. */
  title?: string;
  /** Initial / default R code shown in the editor. */
  code: string;
}

export interface SASAccordionProps {
  title: string;
  code: string;
}

export interface QuizQuestion {
  question: string;
  options: string[];
  /** Index into `options` of the correct answer. */
  correctIndex: number;
  explanation?: string;
}

export interface QuizProps {
  questions: QuizQuestion[];
  title?: string;
}

export interface FlashcardItem {
  front: string;
  back: string;
}

export interface FlashcardProps {
  items: FlashcardItem[];
  title?: string;
}

export interface ProcessStep {
  title: string;
  description: string;
}

export interface ProcessStepsProps {
  steps: ProcessStep[];
  title?: string;
}

export interface DataTableProps {
  caption?: string;
  columns: string[];
  rows: (string | number)[][];
}
