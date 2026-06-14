import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import type { Lesson } from './types';

const markdownDir = join(process.cwd(), 'content', 'modules-md');

export function loadLessonMarkdown(lesson: Lesson): string | null {
  if (!lesson.markdownFile) {
    return null;
  }

  const filePath = join(markdownDir, lesson.markdownFile);
  if (!existsSync(filePath)) {
    return null;
  }

  return readFileSync(filePath, 'utf-8');
}
