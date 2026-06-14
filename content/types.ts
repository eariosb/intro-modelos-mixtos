// Shared content types for the Mixed Models course.

export interface RCodeCell {
  /** Unique id within the lesson, used for restore-original tracking */
  id: string;
  /** Short label shown above the cell */
  title?: string;
  /** Initial / default R code shown in the editor */
  code: string;
}

export interface SasExample {
  title: string;
  code: string;
}

export interface LessonCallout {
  type: 'tip' | 'info' | 'warning' | 'success';
  title?: string;
  content: string;
}

export interface LessonFlashcard {
  front: string;
  back: string;
}

export interface LessonQuizQuestion {
  question: string;
  options: string[];
  /** Index into `options` of the correct answer */
  correctIndex: number;
  explanation?: string;
}

export interface LessonProcessStep {
  title: string;
  description: string;
}

export interface LessonDataTable {
  caption?: string;
  columns: string[];
  rows: (string | number)[][];
}

export interface Lesson {
  slug: string;
  title: string;
  /** 3-5 learning objectives */
  objectives: string[];
  /** Markdown content (supports $$ LaTeX $$ via remark-math/rehype-katex) */
  content: string;
  /** Archivo Markdown alternativo cargado desde disk para contenido extenso */
  markdownFile?: string;
  /** Executable R code cells (in order of appearance) */
  rCells: RCodeCell[];
  /** Optional collapsible SAS reference examples */
  sasExamples?: SasExample[];
  /** Dataset(s) used, for the "datasets" note in the lesson header */
  datasets?: string[];
  /** Highlighted tip/warning/info boxes shown after the main content */
  callouts?: LessonCallout[];
  /** Flujo de pasos del proceso de análisis (ProcessSteps) */
  processSteps?: LessonProcessStep[];
  /** Tabla(s) de datos o resultados de ejemplo */
  dataTables?: LessonDataTable[];
  /** Flashcards de repaso al final de la lección */
  flashcards?: LessonFlashcard[];
  /** Quiz de autoevaluación al final de la lección */
  quiz?: LessonQuizQuestion[];
}

export interface Module {
  slug: string;
  title: string;
  description: string;
  lessons: Lesson[];
  /** Modules without lessons yet show as "próximamente" in the sidebar */
  comingSoon?: boolean;
}
