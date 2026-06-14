# Modelos Mixtos Aplicados a Ciencias de la Salud

[![Next.js](https://img.shields.io/badge/Next.js-14-black?logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-strict-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-3-38B2AC?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![WebR](https://img.shields.io/badge/WebR-%40r--wasm%2Fwebr-2c7a7b)](https://docs.r-wasm.org/webr/latest/)
[![Deploy with Vercel](https://img.shields.io/badge/Deploy-Vercel-000000?logo=vercel&logoColor=white)](https://vercel.com/)
[![Licencia](https://img.shields.io/badge/Licencia-CC%20BY--NC--SA%204.0-lightgrey)](https://creativecommons.org/licenses/by-nc-sa/4.0/)

## Descripción general

**Modelos Mixtos Aplicados a Ciencias de la Salud** es un curso interactivo,
auto-contenido y gratuito sobre modelos lineales mixtos (LMM), modelos
lineales mixtos generalizados (GLMM) y ecuaciones de estimación generalizadas
(GEE), pensado para **profesionales de la salud, estudiantes de pregrado y  posgrado en estadistica e investigadores clinicos, bioestadísticos, epidemiólogos y analistas en ciencias de datos** que analizan datos longitudinales o de medidas repetidas.

El curso combina teoría explicada paso a paso, fórmulas en notación LaTeX,
ejemplos aplicados con datasets reales y simulados, y **código R que se
ejecuta directamente en el navegador** (sin instalar R ni paquetes) gracias a
[WebR](https://docs.r-wasm.org/webr/latest/). Cada técnica se acompaña, cuando
corresponde, de su equivalente en **SAS** (`PROC MIXED`, `PROC GLIMMIX`,
`PROC GENMOD`, `PROC GEE`, `PROC GAM`).

Documentación basada en las notas y recomendaciones del profesor Juan Carlos Salazar de la Universidad Nacional de Colombia, sede Medellín.

Al finalizar el curso, el estudiante será capaz de:

- Reconocer cuándo una pregunta de investigación requiere un modelo mixto.
- Explorar visualmente datos longitudinales y detectar anidamiento, desbalance
  y datos faltantes.
- Especificar, ajustar e interpretar LMM y GLMM con `lme4` y `nlme`.
- Elegir estructuras de covarianza y correlaciones de trabajo adecuadas
  (CS, AR(1), no estructurada, GEE).
- Comparar y seleccionar modelos con AIC, BIC y pruebas de razón de
  verosimilitud.
- Diagnosticar el ajuste con residuos simulados (`DHARMa`).
- Decidir entre LMM, GLMM, GEE, GAMM y alternativas no paramétricas según el
  problema, y traducir el análisis entre R y SAS.

## Características

- Contenido interactivo con teoría y ejemplos prácticos, organizados en 15 módulos progresivos.
- Ejecución de código R en tiempo real en el navegador, vía WebR (sin instalación).
- Visualización de resultados, gráficos y salidas de consola adaptadas al tamaño de la respuesta.
- Alternativas equivalentes en SAS para cada método, en paneles colapsables.
- Componentes pedagógicos: callouts, quizzes, flashcards, tablas de datos y pasos de proceso.
- Diseño responsivo, minimalista y accesible (paleta sobria, tipografía Inter).
- enerado de forma estática, optimizado para despliegue en Vercel.
- Preparado para ejecutarse con Docker / Docker Compose.

## Tecnologías utilizadas

- [Next.js 14](https://nextjs.org/) (App Router) + [TypeScript](https://www.typescriptlang.org/) estricto
- [Tailwind CSS](https://tailwindcss.com/) + [`@tailwindcss/typography`](https://github.com/tailwindlabs/tailwindcss-typography)
- [`@r-wasm/webr`](https://docs.r-wasm.org/webr/latest/) — R completo vía WebAssembly, 100% en el cliente
- [`@uiw/react-codemirror`](https://uiwjs.github.io/react-codemirror/) con modos de R y SAS para resaltado de sintaxis
- [`react-markdown`](https://github.com/remarkjs/react-markdown) + [`remark-math`](https://github.com/remarkjs/remark-math) + [`rehype-katex`](https://github.com/remarkjs/remark-math/tree/main/packages/rehype-katex) + [KaTeX](https://katex.org/) para notación matemática
- [Jest](https://jestjs.io/) + [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/) para pruebas
- [Docker](https://www.docker.com/) / Docker Compose para empaquetado y despliegue
- [Vercel](https://vercel.com/) como plataforma de despliegue recomendada

## Estructura del curso

| Mód. | Título | Contenido principal |
| ---- | ------ | -------------------- |
| 1 | Introducción a los Modelos Mixtos | Motivación, datos longitudinales y diferencia entre efectos fijos y aleatorios. |
| 2 | Análisis Exploratorio de Datos Longitudinales | Gráficos de perfiles, perfiles promedio y detección de patrones de anidamiento con `ggplot2`. |
| 3 | Modelo Lineal Mixto (LMM) | Especificación del LMM con `lme4` y `nlme`, e interpretación de la salida del modelo. |
| 4 | Modelos Lineales Mixtos básicos | Interpretación de interceptos y pendientes aleatorias en trayectorias clínicas. |
| 5 | Covarianza y correlación en LMM | Comparación de estructuras CS, AR(1) y no estructurada; matriz de covarianza residual. |
| 6 | Diagnóstico con residuos simulados (DHARMa) | Validación de supuestos, detección de outliers y documentación de desviaciones del modelo. |
| 7 | GLMM binomial y Poisson | Familias binomial y Poisson para respuestas no gaussianas con efectos aleatorios. |
| 8 | Comparación y selección de modelos | AIC/BIC y pruebas de razón de verosimilitud para elegir entre especificaciones anidadas. |
| 9 | Casos integradores: splines, diagnóstico y comunicación | Caso clínico completo: especificación, splines, diagnóstico DHARMa, selección y comunicación de resultados. |
| 10 | Modelos marginales y GEE | GEE vs. GLMM, estructuras de correlación de trabajo y errores estándar tipo sándwich. |
| 11 | Estructuras de varianza avanzadas | Correlaciones complejas, heterocedasticidad y estructuras de trabajo para modelos marginales. |
| 12 | Modelos para intervenciones y cambios temporales | Series interrumpidas, variables dependientes del tiempo y cambios de pendiente. |
| 13 | Modelos no paramétricos y robustos | GAMM, transformaciones y bootstrap para trayectorias no lineales. |
| 14 | Recomendaciones para datos longitudinales y medidas repetidas | Guía experta: exploración, efectos aleatorios, covarianza, selección de modelos, diagnóstico y árbol de decisión. |
| 15 | Aplicación práctica comparada en R y SAS | Implementación lado a lado de las recomendaciones del Módulo 14, con dos casos clínicos integradores. |

## Instalación y uso local

Requisitos: [Node.js](https://nodejs.org/) ≥ 20, npm ≥ 9 (o pnpm/yarn) y Git.

```bash
git clone <url-del-repositorio>
cd "Curso Intro MLM"
npm install
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000). La primera vez que pulses
"▶ Ejecutar" en una celda de código R, WebR descargará el runtime y los
paquetes precargados (`lme4`, `nlme`, `ggplot2`, `dplyr`, `DHARMa`, `geepack`,
`mgcv`); puede tardar entre 10 y 30 segundos según la conexión. Ejecuciones
posteriores son casi instantáneas porque la instancia de WebR se reutiliza.

> **Nota:** WebR requiere que el sitio se sirva con las cabeceras
> `Cross-Origin-Embedder-Policy: credentialless` y
> `Cross-Origin-Opener-Policy: same-origin`. Estas cabeceras ya están
> configuradas en `next.config.js` y `vercel.json`.

### Otros comandos útiles

```bash
npm run build   # build de producción
npm run start   # sirve el build de producción
npm run lint    # linting con ESLint
npm test        # pruebas con Jest + React Testing Library
```

## Ejecución con Docker

```bash
docker build -t curso-modelos-mixtos .
docker run -p 3000:3000 curso-modelos-mixtos
```

O con Docker Compose:

```bash
docker compose up --build
```

La imagen usa `next.config.js` con `output: 'standalone'`, por lo que el
contenedor final solo incluye lo necesario para ejecutar `node server.js`.

## Despliegue en Vercel

El proyecto incluye `vercel.json` con el framework detectado (`nextjs`) y las
cabeceras COOP/COEP necesarias para WebR. Basta con importar el repositorio en
[Vercel](https://vercel.com/new) — no se requieren variables de entorno
adicionales.

## Estructura del proyecto

```
app/
  layout.tsx                  # Layout raíz, fuente Inter, WebRProvider
  page.tsx                    # Portada / índice del curso
  lecciones/[slug]/page.tsx   # Página genérica de cada lección
components/
  layout/Logo.tsx             # Logo tipográfico del curso (SVG inline)
  AppLayout.tsx               # Shell (sidebar + main + footer)
  Sidebar.tsx                 # Índice colapsable del curso (desktop + drawer móvil)
  Footer.tsx                  # Pie de página con logo, licencia y créditos
  Breadcrumb.tsx
  ProgressBar.tsx             # Barra de progreso (usa useCourseProgress)
  LessonProgressTracker.tsx   # Marca la lección actual como completada
  LessonContent.tsx           # Render de markdown + LaTeX
  RCell.tsx                   # Celda de código R editable y ejecutable
  ConsoleOutput.tsx           # Salida de consola truncada (con expandir "+")
  SASAccordion.tsx            # Acordeón con código SAS de referencia
  Callout.tsx, Quiz.tsx, Flashcard.tsx, DataTable.tsx, ProcessSteps.tsx
  WebRProvider.tsx            # Contexto global de WebR
content/
  types.ts                    # Tipos de módulos/lecciones
  modules.ts                  # Módulos 1-3 (inline) + re-exporta extraModules (4-15)
  modules-extra.ts            # Módulos 4-15
  markdown-loader.ts          # Carga lecciones largas desde content/modules-md/*.md
hooks/
  useWebR.ts                  # useRCell(): ejecución de celdas R contra WebR
  useProgress.ts              # useMarkLessonComplete() / useCourseProgress()
  useModuleContent.ts         # useModuleContent(slug): módulo+lección+vecinos+markdown
lib/
  webr.ts                     # Instancia compartida de WebR, captura de salidas/plots
```

## Principios de diseño

- **Contenido desacoplado del código**: cada módulo y lección se define como
  datos (`content/modules.ts` / `content/modules-extra.ts`), siguiendo los
  tipos de `content/types.ts`. Añadir o editar contenido no requiere tocar
  componentes ni rutas.
- **Hooks como capa de acceso**: `app/lecciones/[slug]/page.tsx` no importa
  directamente la capa de contenido — depende de `hooks/useModuleContent.ts`,
  que resuelve módulo, lección, vecinos y markdown.
- **Componentes de bloque uniformes**: `Callout`, `DataTable`, `Flashcard`,
  `Quiz`, `ProcessSteps` y `SASAccordion` reciben únicamente los props que
  necesitan y se renderizan de forma uniforme para cualquier lección.

## Pruebas

```bash
npm test
```

- `hooks/useProgress.test.ts` — cubre `useCourseProgress` y
  `useMarkLessonComplete`.
- `components/Callout.test.tsx` — cubre el renderizado de `Callout` con sus
  distintos `type` y títulos.

## Contribución

El contenido pedagógico vive como datos en `content/modules.ts` y
`content/modules-extra.ts` (objetos `Module`/`Lesson` tipados en
`content/types.ts`), por lo que se puede **editar o ampliar sin tocar
componentes ni rutas**:

1. Haz un fork y crea una rama descriptiva (`feat/modulo-16-...`,
   `fix/typo-modulo-3`).
2. Para añadir o corregir una lección, edita el `Module` correspondiente:
   `objectives`, `content` (markdown con soporte `$...$`/`$$...$$`), `rCells`,
   `sasExamples`, `callouts`, `dataTables`, `flashcards` y `quiz` son todos
   opcionales salvo `objectives`, `content` y `rCells`.
3. Ejecuta `npm run dev` y `npm test` antes de abrir el pull request.
4. Describe en el PR qué módulo/lección se modifica y por qué.

Los reportes de errores (de contenido o de la aplicación) pueden abrirse como
*issues*, indicando el módulo/lección afectado y, si aplica, el código R que
falla.

## Licencia

Material con fines educativos, distribuido bajo
[CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/): se
permite compartir y adaptar el contenido con atribución, para fines no
comerciales y bajo la misma licencia.

## Créditos y autoría

- **Autor:** Esneider Rios
- **Universidad Nacional de Colombia — Sede Medellín**
- **Facultad de Ciencias · Departamento de Estadística**
- **Año:** 2026

Agradecimientos al material de referencia clásico de modelos mixtos (Pinheiro
& Bates, Verbeke & Molenberghs, West, Welch & Galecki, entre otros) que inspira
los ejemplos y la progresión pedagógica de este curso.
