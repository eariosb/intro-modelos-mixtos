/**
 * One-time migration script: splits content/modules.ts (modules 1-3) and
 * content/modules-extra.ts (modules 4-13) into one file per module under
 * content/modules/, plus an index.ts that re-aggregates everything.
 *
 * Usage (from the project root):
 *   node scripts/split-modules.js
 *
 * Requires the `typescript` package (already in devDependencies).
 *
 * Safe to re-run: it only reads modules.ts/modules-extra.ts and (re)writes
 * files under content/modules/. It does NOT delete or modify the source
 * files — after verifying the output, update imports manually (see README,
 * "Plan de migración a content/modules/ por módulo") and only then remove
 * the old arrays if desired.
 */
const ts = require('typescript');
const fs = require('fs');
const path = require('path');

const ROOT = path.join(process.cwd(), 'content');
const OUT = path.join(ROOT, 'modules');
fs.mkdirSync(OUT, { recursive: true });

function parse(file) {
  const text = fs.readFileSync(file, 'utf-8');
  const sf = ts.createSourceFile(file, text, ts.ScriptTarget.Latest, true, ts.ScriptKind.TS);
  return { text, sf };
}

function findArrayLiteral(sf, varName) {
  let result = null;
  sf.forEachChild((node) => {
    if (ts.isVariableStatement(node)) {
      for (const decl of node.declarationList.declarations) {
        if (
          decl.name.getText(sf) === varName &&
          decl.initializer &&
          ts.isArrayLiteralExpression(decl.initializer)
        ) {
          result = decl.initializer;
        }
      }
    }
  });
  return result;
}

const { sf: sfModules } = parse(path.join(ROOT, 'modules.ts'));
const { sf: sfExtra } = parse(path.join(ROOT, 'modules-extra.ts'));

const modulesArr = findArrayLiteral(sfModules, 'modules');
const extraArr = findArrayLiteral(sfExtra, 'extraModules');

// First 3 elements of `modules` are ObjectLiteralExpressions (modules 1-3)
const first3 = modulesArr.elements.filter((e) => ts.isObjectLiteralExpression(e));
// extraModules has all 10 (modules 4-13)
const extra10 = extraArr.elements.filter((e) => ts.isObjectLiteralExpression(e));

if (first3.length !== 3) throw new Error('Expected 3 inline modules in modules.ts, got ' + first3.length);
if (extra10.length !== 10) throw new Error('Expected 10 modules in modules-extra.ts, got ' + extra10.length);

const fileNames = [
  '01-introduccion',
  '02-exploracion-datos',
  '03-lmm',
  '04-lmm-basico',
  '05-estructuras-covarianza',
  '06-diagnostico',
  '07-glmm',
  '08-seleccion-modelos',
  '09-casos-integradores',
  '10-gee',
  '11-varianza',
  '12-intervenciones',
  '13-nonlineal',
];

const allNodes = [
  ...first3.map((n) => ({ node: n, sf: sfModules })),
  ...extra10.map((n) => ({ node: n, sf: sfExtra })),
];

const exportNames = [];
allNodes.forEach(({ node, sf }, i) => {
  const exportName = `module${String(i + 1).padStart(2, '0')}`;
  exportNames.push(exportName);
  const objText = node.getText(sf);
  const fileContent = `import type { Module } from '../types';\n\nexport const ${exportName}: Module = ${objText};\n`;
  fs.writeFileSync(path.join(OUT, `${fileNames[i]}.ts`), fileContent);
});

// Build index.ts
const importLines = exportNames.map((name, i) => `import { ${name} } from './${fileNames[i]}';`).join('\n');
const indexContent = `import type { Module } from '../types';
${importLines}

/**
 * Course content for "Introducción a los Modelos Mixtos".
 * Each module lives in its own file under /content/modules.
 * To add a new module: create NN-slug.ts exporting a \`Module\`,
 * import it here, and add it to this array.
 */
export const modules: Module[] = [
${exportNames.map((n) => `  ${n},`).join('\n')}
];

/** Flat list of all lessons with a reference to their parent module. */
export const allLessons = modules.flatMap((m) =>
  m.lessons.map((l) => ({ module: m, lesson: l }))
);

export function findLesson(slug: string) {
  return allLessons.find((entry) => entry.lesson.slug === slug);
}

export function getAdjacentLessons(slug: string) {
  const idx = allLessons.findIndex((entry) => entry.lesson.slug === slug);
  if (idx === -1) return { prev: undefined, next: undefined };
  return {
    prev: idx > 0 ? allLessons[idx - 1] : undefined,
    next: idx < allLessons.length - 1 ? allLessons[idx + 1] : undefined,
  };
}
`;
fs.writeFileSync(path.join(OUT, 'index.ts'), indexContent);

console.log('Wrote', fileNames.length, 'module files + index.ts in', OUT);
