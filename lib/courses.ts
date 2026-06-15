import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import matter from 'gray-matter';
import type { ModuleEntry, ModuleMeta } from '@/types/course';

const MODULES_DIR = join(process.cwd(), 'content', 'modules');

/**
 * Single entry point for resolving course content from
 * `content/modules/*.mdx`. Pages depend on this module instead of reading
 * the filesystem directly (DIP) — if content storage is ever restructured
 * (e.g. a CMS), only this file needs to change.
 */

let cachedEntries: ModuleEntry[] | null = null;

function readModuleFile(fileName: string): ModuleEntry {
  const raw = readFileSync(join(MODULES_DIR, fileName), 'utf-8');
  const { data } = matter(raw);
  return { meta: data as ModuleMeta, fileName };
}

/** All modules, sorted by their `order` front-matter field. */
export function getAllModules(): ModuleEntry[] {
  if (cachedEntries) return cachedEntries;
  const files = readdirSync(MODULES_DIR).filter((f) => f.endsWith('.mdx'));
  const entries = files.map(readModuleFile);
  entries.sort((a, b) => a.meta.order - b.meta.order);
  cachedEntries = entries;
  return entries;
}

/** Find a module entry by its front-matter `slug`. */
export function findModule(slug: string): ModuleEntry | undefined {
  return getAllModules().find((entry) => entry.meta.slug === slug);
}

/** Raw MDX source (without front matter) for a given module file. */
export function getModuleSource(fileName: string): string {
  const raw = readFileSync(join(MODULES_DIR, fileName), 'utf-8');
  const { content } = matter(raw);
  return content;
}

export interface AdjacentModules {
  prev?: ModuleEntry;
  next?: ModuleEntry;
}

/** Previous/next modules relative to the given slug, by `order`. */
export function getAdjacentModules(slug: string): AdjacentModules {
  const modules = getAllModules();
  const idx = modules.findIndex((entry) => entry.meta.slug === slug);
  if (idx === -1) return {};
  return {
    prev: idx > 0 ? modules[idx - 1] : undefined,
    next: idx < modules.length - 1 ? modules[idx + 1] : undefined,
  };
}
