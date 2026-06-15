/**
 * Migration / maintenance tool: regenerates `content/modules/*.mdx` from
 * the legacy `content/modules.ts` + `content/modules-extra.ts` data and the
 * loose `content/modules-md/*.md` files.
 *
 * This script is intentionally kept after the migration as a reference for
 * how the original TS-based content was transformed into MDX — it is NOT
 * part of the build and is safe to delete once no longer needed.
 *
 * Usage:
 *   npx tsx scripts/generate-mdx.ts
 */
import * as ts from 'typescript';
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { join } from 'node:path';

const ROOT = join(process.cwd(), 'content');
const OUT_DIR = join(ROOT, 'modules');
const MD_DIR = join(ROOT, 'modules-md');

mkdirSync(OUT_DIR, { recursive: true });

// ---------------------------------------------------------------------
// Minimal TS AST -> plain JS value evaluator (handles the subset of
// syntax used in modules.ts / modules-extra.ts: object/array literals,
// strings, template strings, numbers, identifiers referencing imports
// we don't need, and spread of `extraModules`).
// ---------------------------------------------------------------------
function evalNode(node: ts.Node, sf: ts.SourceFile): unknown {
  if (ts.isObjectLiteralExpression(node)) {
    const obj: Record<string, unknown> = {};
    for (const prop of node.properties) {
      if (ts.isPropertyAssignment(prop)) {
        const key = prop.name.getText(sf).replace(/^['"]|['"]$/g, '');
        obj[key] = evalNode(prop.initializer, sf);
      }
    }
    return obj;
  }
  if (ts.isArrayLiteralExpression(node)) {
    const arr: unknown[] = [];
    for (const el of node.elements) {
      if (ts.isSpreadElement(el)) {
        const spread = evalNode(el.expression, sf);
        if (Array.isArray(spread)) arr.push(...spread);
        continue;
      }
      arr.push(evalNode(el, sf));
    }
    return arr;
  }
  if (ts.isStringLiteral(node) || ts.isNoSubstitutionTemplateLiteral(node)) {
    return node.text;
  }
  if (ts.isTemplateExpression(node)) {
    // Only plain template strings are used in this dataset (no ${} interpolation
    // except literal text); reconstruct via getText and strip backticks/escapes.
    const raw = node.getText(sf);
    return rawTemplateToString(raw);
  }
  if (ts.isNumericLiteral(node)) {
    return Number(node.text);
  }
  if (node.kind === ts.SyntaxKind.TrueKeyword) return true;
  if (node.kind === ts.SyntaxKind.FalseKeyword) return false;
  if (ts.isParenthesizedExpression(node)) return evalNode(node.expression, sf);
  throw new Error(`Unsupported node kind: ${ts.SyntaxKind[node.kind]} :: ${node.getText(sf).slice(0, 60)}`);
}

/** Converts the raw source text of a template literal (including backticks) to its string value. */
function rawTemplateToString(raw: string): string {
  // Strip surrounding backticks
  let s = raw.slice(1, -1);
  // Unescape sequences that are meaningful inside JS template literals
  s = s
    .replace(/\\`/g, '`')
    .replace(/\\\$/g, '$')
    .replace(/\\\\/g, '\\');
  return s;
}

function parseModulesArray(file: string, varName: string): unknown[] {
  const text = readFileSync(file, 'utf-8');
  const sf = ts.createSourceFile(file, text, ts.ScriptTarget.Latest, true, ts.ScriptKind.TS);
  let arrayNode: ts.ArrayLiteralExpression | undefined;
  sf.forEachChild((node) => {
    if (ts.isVariableStatement(node)) {
      for (const decl of node.declarationList.declarations) {
        if (decl.name.getText(sf) === varName && decl.initializer && ts.isArrayLiteralExpression(decl.initializer)) {
          arrayNode = decl.initializer;
        }
      }
    }
  });
  if (!arrayNode) throw new Error(`Could not find array literal for ${varName} in ${file}`);
  const elements: ts.NodeArray<ts.Expression> = arrayNode.elements;

  // Handle the spread of `extraModules` specially: for modules.ts the spread
  // element references `extraModules` imported from modules-extra.ts, which
  // we resolve recursively.
  const result: unknown[] = [];
  for (const el of elements) {
    if (ts.isSpreadElement(el) && ts.isIdentifier(el.expression) && el.expression.text === 'extraModules') {
      result.push(...parseModulesArray(join(ROOT, 'modules-extra.ts'), 'extraModules'));
      continue;
    }
    result.push(evalNode(el, sf));
  }
  return result;
}

// ---------------------------------------------------------------------
// Types mirroring content/types.ts (legacy) for the parsed plain objects.
// ---------------------------------------------------------------------
interface RCodeCell {
  id: string;
  title?: string;
  code: string;
}
interface SasExample {
  title: string;
  code: string;
}
interface LessonCallout {
  type: 'tip' | 'info' | 'warning' | 'success';
  title?: string;
  content: string;
}
interface LessonFlashcard {
  front: string;
  back: string;
}
interface LessonQuizQuestion {
  question: string;
  options: string[];
  correctIndex: number;
  explanation?: string;
}
interface LessonProcessStep {
  title: string;
  description: string;
}
interface LessonDataTable {
  caption?: string;
  columns: string[];
  rows: (string | number)[][];
}
interface Lesson {
  slug: string;
  title: string;
  objectives: string[];
  content: string;
  markdownFile?: string;
  rCells: RCodeCell[];
  sasExamples?: SasExample[];
  datasets?: string[];
  callouts?: LessonCallout[];
  processSteps?: LessonProcessStep[];
  dataTables?: LessonDataTable[];
  flashcards?: LessonFlashcard[];
  quiz?: LessonQuizQuestion[];
}
interface ModuleData {
  slug: string;
  title: string;
  description: string;
  lessons: Lesson[];
  comingSoon?: boolean;
}

// ---------------------------------------------------------------------
// File-name / slug mapping: NN-slug-metodo.mdx, derived from the
// statistical method/topic of each module (not the dataset name).
// ---------------------------------------------------------------------
const FILE_SLUGS: Record<string, string> = {
  introduccion: 'introduccion-modelos-mixtos',
  'exploracion-datos': 'exploracion-graficos-perfiles',
  lmm: 'especificacion-lmm-lme4-nlme',
  'lmm-basico': 'lmm-intercepto-pendiente-aleatorios',
  'estructuras-covarianza': 'estructuras-covarianza-cs-ar1-un',
  diagnostico: 'diagnostico-residuos-dharma',
  glmm: 'glmm-binomial-poisson',
  'seleccion-modelos': 'seleccion-modelos-aic-bic-lrt',
  'casos-integradores': 'splines-y-caso-integrador',
  'modulo-10-gee': 'modelos-marginales-gee',
  'modulo-11-varianza': 'estructuras-varianza-avanzadas',
  'modulo-12-intervenciones': 'intervenciones-cambios-temporales',
  'modulo-13-nonlineal': 'gamm-modelos-no-lineales-robustos',
  'modulo-14-recomendaciones': 'recomendaciones-practicas-longitudinales',
  'modulo-15-aplicacion-practica': 'aplicacion-practica-r-sas',
};

function escapeYaml(s: string): string {
  return s.replace(/\\/g, '\\\\').replace(/"/g, '\\"');
}

function yamlString(s: string): string {
  return `"${escapeYaml(s)}"`;
}

function yamlStringArray(arr: string[]): string {
  if (arr.length === 0) return '[]';
  return '\n' + arr.map((s) => `  - ${yamlString(s)}`).join('\n');
}

/** Serialize a JS value to a JSX-expression-friendly literal (for MDX component props). */
function toJsLiteral(value: unknown, indent = 0): string {
  const pad = '  '.repeat(indent);
  const padInner = '  '.repeat(indent + 1);
  if (typeof value === 'string') {
    // Use JSON.stringify for safe escaping; switch to template literal if it
    // contains characters that read poorly when escaped (backslashes for LaTeX).
    if (value.includes('\\') || value.includes('\n')) {
      return '`' + value.replace(/\\/g, '\\\\').replace(/`/g, '\\`').replace(/\$\{/g, '\\${') + '`';
    }
    return JSON.stringify(value);
  }
  if (typeof value === 'number' || typeof value === 'boolean') return String(value);
  if (Array.isArray(value)) {
    if (value.length === 0) return '[]';
    const items = value.map((v) => `${padInner}${toJsLiteral(v, indent + 1)}`).join(',\n');
    return `[\n${items}\n${pad}]`;
  }
  if (value && typeof value === 'object') {
    const entries = Object.entries(value as Record<string, unknown>)
      .map(([k, v]) => `${padInner}${k}: ${toJsLiteral(v, indent + 1)}`)
      .join(',\n');
    return `{\n${entries}\n${pad}}`;
  }
  return 'null';
}

function escapeCodeFence(code: string): string {
  // Ensure the code itself doesn't contain a line that is exactly ``` (would break the fence)
  return code.replace(/\r\n/g, '\n');
}

function buildMdxBody(lesson: Lesson, markdownBody: string): string {
  const parts: string[] = [];

  parts.push(markdownBody.trim());

  if (lesson.processSteps?.length) {
    parts.push(
      `<ProcessSteps title="Flujo de análisis" steps={${toJsLiteral(lesson.processSteps)}} />`
    );
  }

  for (const table of lesson.dataTables ?? []) {
    const props: string[] = [];
    if (table.caption) props.push(`caption=${JSON.stringify(table.caption)}`);
    props.push(`columns={${toJsLiteral(table.columns)}}`);
    props.push(`rows={${toJsLiteral(table.rows)}}`);
    parts.push(`<DataTable ${props.join(' ')} />`);
  }

  for (const callout of lesson.callouts ?? []) {
    const titleAttr = callout.title ? ` title=${JSON.stringify(callout.title)}` : '';
    parts.push(`<Callout type="${callout.type}"${titleAttr}>\n${callout.content.trim()}\n</Callout>`);
  }

  const rCells = lesson.rCells ?? [];
  const sasExamples = lesson.sasExamples ?? [];
  rCells.forEach((cell, i) => {
    const titleAttr = cell.title ? ` title=${JSON.stringify(cell.title)}` : '';
    parts.push(
      `<RCell id="${cell.id}"${titleAttr} code={${toJsLiteral(escapeCodeFence(cell.code))}} />`
    );
    const sas = sasExamples[i];
    if (sas) {
      parts.push(`<SASAccordion title=${JSON.stringify(sas.title)} code={${toJsLiteral(escapeCodeFence(sas.code))}} />`);
    }
  });
  // Any remaining SAS examples without a 1:1 R cell pairing
  for (const sas of sasExamples.slice(rCells.length)) {
    parts.push(`<SASAccordion title=${JSON.stringify(sas.title)} code={${toJsLiteral(escapeCodeFence(sas.code))}} />`);
  }

  if (lesson.flashcards?.length) {
    parts.push(`<Flashcards items={${toJsLiteral(lesson.flashcards)}} />`);
  }

  if (lesson.quiz?.length) {
    parts.push(`<Quiz questions={${toJsLiteral(lesson.quiz)}} />`);
  }

  return parts.join('\n\n') + '\n';
}

function main() {
  const modules = parseModulesArray(join(ROOT, 'modules.ts'), 'modules') as ModuleData[];

  console.log(`Parsed ${modules.length} modules.`);

  modules.forEach((mod, idx) => {
    const order = idx + 1;
    const lesson = mod.lessons[0];
    if (!lesson) {
      console.warn(`Module ${mod.slug} has no lessons, skipping.`);
      return;
    }
    if (mod.lessons.length > 1) {
      console.warn(`Module ${mod.slug} has ${mod.lessons.length} lessons; only the first is migrated by this script.`);
    }

    let markdownBody = lesson.content;
    if (lesson.markdownFile) {
      const mdPath = join(MD_DIR, lesson.markdownFile);
      if (existsSync(mdPath)) {
        markdownBody = readFileSync(mdPath, 'utf-8');
      } else {
        console.warn(`markdownFile ${lesson.markdownFile} not found for ${mod.slug}`);
      }
    }

    const fileSlug = FILE_SLUGS[mod.slug];
    if (!fileSlug) throw new Error(`No file slug mapping for module "${mod.slug}"`);

    const fileName = `${String(order).padStart(2, '0')}-${fileSlug}.mdx`;

    const subtitle = mod.description;
    const objective = lesson.objectives ?? [];

    const frontmatterLines = [
      '---',
      `title: ${yamlString(lesson.title)}`,
      `slug: ${yamlString(fileSlug)}`,
      `subtitle: ${yamlString(subtitle)}`,
      `objective:${yamlStringArray(objective)}`,
      `order: ${order}`,
    ];
    if (lesson.datasets?.length) {
      frontmatterLines.push(`datasets:${yamlStringArray(lesson.datasets)}`);
    }
    frontmatterLines.push('---', '');

    const body = buildMdxBody(lesson, markdownBody);
    const fileContent = frontmatterLines.join('\n') + '\n' + body;

    writeFileSync(join(OUT_DIR, fileName), fileContent, 'utf-8');
    console.log(`Wrote ${fileName} (order ${order}, slug "${fileSlug}")`);
  });
}

main();
