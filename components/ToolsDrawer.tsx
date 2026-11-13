'use client';

import { useBlackboardContext } from '@cursos/blackboard';
import type { BlackboardCanvasRef } from '@cursos/blackboard';
import { CaptureGallery } from './CaptureGallery';
import { FormulaPalette } from './FormulaPalette';
import { MatrixBuilder } from './MatrixBuilder';
import { NotesPanel } from './NotesPanel';
import { ModelComparator } from './ModelComparator';
import { QuestionsPanel } from './QuestionsPanel';
import { DiagnosticsPanel } from './DiagnosticsPanel';

export const TOOL_TABS = [
  { id: 'capturas', label: 'Capturas', icon: '📷' },
  { id: 'formulas', label: 'Fórmulas', icon: '∑' },
  { id: 'matrices', label: 'Matrices', icon: '▦' },
  { id: 'notas', label: 'Notas', icon: '📝' },
  { id: 'preguntas', label: 'Preguntas', icon: '❓' },
  { id: 'comparador', label: 'Comparar', icon: '⚖️' },
  { id: 'diagnostico', label: 'Diagnóstico', icon: '🩺' },
] as const;

export type ToolTabId = (typeof TOOL_TABS)[number]['id'];

interface ToolsDrawerProps {
  canvasRef: React.RefObject<BlackboardCanvasRef>;
  /** Controlled active tab (set by the board menu bar). */
  active: ToolTabId;
  /** Whether the drawer body is expanded. */
  open: boolean;
}

/**
 * Drawer body — the menu strip lives in CourseBlackboard so the tabs read
 * as a menu bar above the canvas; this component only renders the active
 * tool's panel.
 */
export function ToolsDrawer({ canvasRef, active, open }: ToolsDrawerProps) {
  const { state } = useBlackboardContext();
  const moduleSlug = state.moduleContext?.slug ?? 'global';
  const moduleTitle = state.moduleContext?.title ?? '';

  const content: Record<ToolTabId, React.ReactNode> = {
    capturas: <CaptureGallery />,
    formulas: <FormulaPalette />,
    matrices: <MatrixBuilder canvasRef={canvasRef} />,
    notas: <NotesPanel moduleSlug={moduleSlug} moduleTitle={moduleTitle} />,
    preguntas: <QuestionsPanel />,
    comparador: <ModelComparator />,
    diagnostico: <DiagnosticsPanel />,
  };

  if (!open) return null;
  return (
    <div className="h-56 min-h-0 overflow-hidden border-t border-ink-200 bg-white dark:border-ink-700 dark:bg-ink-900">
      {content[active]}
    </div>
  );
}
