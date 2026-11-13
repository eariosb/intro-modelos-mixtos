# Modelos Mixtos Aplicados a Ciencias de la Salud

[![Next.js](https://img.shields.io/badge/Next.js-14-black?logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-strict-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-3-38B2AC?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![WebR](https://img.shields.io/badge/WebR-%40r--wasm%2Fwebr-2c7a7b)](https://docs.r-wasm.org/webr/latest/)
[![Deploy with Vercel](https://img.shields.io/badge/Deploy-Vercel-000000?logo=vercel&logoColor=white)](https://vercel.com/)
[![Licencia](https://img.shields.io/badge/Licencia-CC%20BY--NC--SA%204.0-lightgrey)](https://creativecommons.org/licenses/by-nc-sa/4.0/)

## Descripción general

**Modelos Mixtos Aplicados a Ciencias de la Salud** es un curso interactivo,
auto-contenido y gratuito sobre modelos lineales mixtos (LMM), modelos no
lineales mixtos (NLMM), modelos lineales mixtos generalizados (GLMM) y
ecuaciones de estimación generalizadas (GEE), pensado para **profesionales
de la salud, estudiantes de pregrado y posgrado en estadística e
investigadores clínicos, bioestadísticos, epidemiólogos y analistas en
ciencias de datos** que analizan datos longitudinales o de medidas repetidas.

El curso es el complemento interactivo del libro *Introducción a los modelos
mixtos* de **Correa y Salazar (2016)**, Universidad Nacional de Colombia, sede
Medellín. Combina teoría explicada paso a paso, fórmulas en notación LaTeX,
ejemplos aplicados con datasets reales y simulados, y **código R que se
ejecuta directamente en el navegador** (sin instalar R ni paquetes) gracias a
[WebR](https://docs.r-wasm.org/webr/latest/). Cada técnica se acompaña, cuando
corresponde, de su equivalente en **SAS** (`PROC MIXED`, `PROC GLIMMIX`,
`PROC GENMOD`, `PROC GEE`, `PROC NLMIXED`).

Documentación basada en las notas y recomendaciones del profesor Juan Carlos
Salazar de la Universidad Nacional de Colombia, sede Medellín.

Al finalizar el curso, el estudiante será capaz de:

- Reconocer cuándo una pregunta de investigación requiere un modelo mixto.
- Explorar visualmente datos longitudinales y detectar anidamiento, desbalance
  y datos faltantes.
- Especificar, ajustar e interpretar LMM, NLMM y GLMM con `lme4` y `nlme`.
- Elegir estructuras de covarianza apropiadas: CS, AR(1), UN, ARMA(1,1), FA.
- Comparar y seleccionar modelos con AIC, BIC y pruebas de razón de
  verosimilitud.
- Diagnosticar el ajuste con residuos simulados (`DHARMa`) y medidas de
  influencia (`influence.ME`: distancia de Cook, DFBETAS).
- Calcular tamaños muestrales y potencia para estudios longitudinales con
  fórmulas analíticas y simulación (`longpower`, `simr`).
- Ajustar modelos no lineales mixtos (función logística, `nlme::nlme()`) y
  gestionar la sensibilidad a valores iniciales.
- Decidir entre LMM, NLMM, GLMM, GEE, GAMM y alternativas no paramétricas
  según el problema, y traducir el análisis entre R y SAS.

## Características

- Contenido interactivo con teoría y ejemplos prácticos, organizados en 18 módulos progresivos.
- Ejecución de código R en tiempo real en el navegador, vía WebR (sin instalación).
- Visualización de resultados, gráficos y salidas de consola adaptadas al tamaño de la respuesta (máx. 30 líneas por defecto, expandibles con "+").
- Alternativas equivalentes en SAS para cada método, en paneles colapsables.
- Componentes pedagógicos: callouts, quizzes, flashcards, tablas de datos y pasos de proceso.
- Diseño responsivo, minimalista y accesible (paleta sobria, tipografía Inter).
- Generado de forma estática, optimizado para despliegue en Vercel.
- Preparado para ejecutarse con Docker / Docker Compose.
- **Pizarra docente integrada** (`@cursos/blackboard`): aula digital reutilizable sobre Excalidraw — trazo libre, fórmulas KaTeX, matrices, capturas de pantalla, código R ejecutable, asistente IA con RAG, páginas múltiples, modo presentación, sesiones con preguntas y exportación PDF/Markdown. Ver la sección [Pizarra docente](#pizarra-docente--aula-digital-integrada) y `packages/blackboard/README.md`.

## Pizarra docente — aula digital integrada

La pizarra convierte el curso en un aula interactiva: el docente puede
**navegar → capturar → arrastrar → anotar → guardar → exportar** sin salir de
la aplicación, con la teoría del módulo y el código embebido siempre visibles
al lado del lienzo.

Documentación: [Manual de usuario de la pizarra](docs/MANUAL-PIZARRA.md),
[arquitectura y desarrollo](docs/ARQUITECTURA-PIZARRA.md) y
[checklist de verificación manual](docs/MANUAL-TESTING.md).

Para el contenido estadístico ampliado: [anexo técnico de paquetes R para
modelos mixtos](docs/ANEXO-PAQUETES-MIXTOS-R.md) y [nuevo módulo de estructuras
de varianza con `sommer`](content/modules/19-estructuras-varianza-sommer.mdx).
En el curso están disponibles como [módulo aplicado de `sommer`](/cursos/modelos-mixtos/modulos/estructuras-varianza-sommer)
y [anexo de paquetes R](/cursos/modelos-mixtos/modulos/anexo-paquetes-modelos-mixtos).

### Layout tipo dock (60 % / 40 %)

- En escritorio (`md+`) el panel queda **anclado a la izquierda ocupando el
  60 % del viewport** y el contenido del curso refluye al 40 % restante
  (`components/MainColumn.tsx`) — la pizarra nunca tapa la lección.
- En pantallas angostas y en modo pantalla completa se comporta como overlay
  a todo lo ancho.
- Botones flotantes (abrir pizarra, capturar) se ocultan mientras el panel
  está dockeado; todas sus acciones viven dentro del panel.

### Organización del panel: un lienzo dominante

```
┌───────────────────────────────────────────────┐
│ Barra de sesión (única fila superior)         │
├───┬─────────────────────────────┬─────────────┤
│ ‹ │                             │ IA · export │
│n/m│                             │ clear · fs  │
│ › │          LIENZO             │─────────────│
│ ＋│        (Excalidraw)         │ pasos ‹ ›   │
│del│                             │ spotlight   │
│cap│                             │ presentar   │
│gal│                             │ atajos      │
│frm│                             │ rol doc/est │
│mat│                             │ cerrar      │
│not│                             │             │
│pre│                             │             │
│cmp│                             │             │
│dgn│                             │             │
├───┴─────────────────────────────┴─────────────┤
│ ▸ Asistente IA   ▸ Cajón de recursos          │
└───────────────────────────────────────────────┘
```

- **Riel izquierdo**: navegación de páginas (anterior / contador / siguiente /
  crear / borrar), captura rápida y acceso al cajón de recursos (Capturas,
  Fórmulas, Matrices, Notas, Preguntas, Comparar, Diagnóstico) — botones
  compactos con `title`/`aria-label`.
- **Riel derecho**: acciones rápidas de IA, exportar, limpiar, fullscreen,
  controles de presentación (pasos, spotlight, modo presentación), atajos,
  conmutador docente/estudiante y cerrar.
- **Inferior**: asistente IA y cajón de recursos colapsados en tiras finas —
  el canvas ocupa todo el alto disponible salvo la barra de sesión.
- Todo el chrome desaparece en modo presentación.

### Páginas múltiples por módulo

Cada módulo puede tener varias páginas de pizarra. La navegación
(`PageNav`, riel izquierdo) permite ir atrás/adelante, crear y eliminar
páginas (con confirmación). Las operaciones se serializan — *flush* del
guardado pendiente, persistencia de la página actual y carga/selección de la
siguiente — para que los cambios rápidos de página nunca mezclen contenido
entre lienzos. Los guardados *debounced* (400 ms) se etiquetan por `sceneId`
para impedir escrituras cruzadas al cambiar de página, y la sesión recuerda
la página activa (`session.activeSceneId`) para restaurarla al reanudar la
clase.

### Elementos técnicos sobre el lienzo

Las fórmulas (KaTeX), matrices, tablas, salidas R y capturas se insertan como
**imágenes raster con `customData`** que conserva el payload estructurado:
doble clic reabre el editor (`ElementEditor`), se modifica y se re-renderiza
el elemento en su posición — no son objetos Excalidraw nativos. Los binarios
(`files`) se persisten junto a la escena, por lo que los elementos técnicos
sobreviven recargas y exportaciones.

### Capturas de pantalla

- `Ctrl+Shift+S` (o el botón de captura del riel izquierdo) activa la selección de región
  (`CaptureOverlay`): cualquier tabla, gráfico o fragmento de la lección se
  captura y arrastra al lienzo.
- Las capturas se guardan en una **biblioteca persistente** con metadatos,
  etiquetas, búsqueda y filtros (`CaptureManager`, `CaptureGallery`).

### Asistente IA con fundamentación (RAG)

- Proveedor **DeepSeek / OpenAI-compatible**, configurable en el panel de
  Ajustes (API key local en el navegador, nunca en el repositorio).
- Recuperación **BM25** sobre el corpus del curso (`content/modules/*.mdx` +
  bibliografía) vía `/api/rag-corpus` — las respuestas citan fuentes reales
  del material.
- *Tool calls* inyectados desde la app (`BoardToolOps`): `insert_math`,
  `insert_matrix`, `run_r` (vía WebR) y `cite`; las respuestas pasan por un
  validador anti-alucinación antes de mostrarse.
- El código R generado puede abrirse en un sandbox `RCell` bajo el lienzo.

### Modo presentación y rol docente/estudiante

- `P` conmuta presentación: desaparece todo el chrome y los elementos se
  revelan por pasos con `→`/`←` (o Espacio/PageDown/PageUp); cada elemento
  lleva un `boardStep` en `customData`.
- `S` arma el **spotlight** (rectángulo de atención sobre el lienzo); `Esc`
  desarma → limpia → sale de presentación, en ese orden.
- `useBroadcast` sincroniza el rol (docente dirigiendo clase / estudiante)
  entre pestañas mediante `BroadcastChannel`.
- Las preguntas de estudiantes se registran en `QuestionsPanel` y viajan en
  la sesión.

### Sesiones, persistencia y exportación

- `SessionToolbar`: iniciar/finalizar sesión con estado (`En curso`,
  horas), historial y exportación del informe.
- Reanudar una sesión restaura también la **página de pizarra activa** y la
  **conversación del asistente** (persistida por sesión en `bb-chat`).
- Persistencia local **versionada** en IndexedDB (fallback `localStorage`):
  escena v3, sesión v2, captura v2, ajustes/chat/eventos v1; escrituras
  *debounced* + `lastKnownGood` y migraciones en `lib/persistence/`.
- Exportación **PDF** (jsPDF) con el periodo de sesión, **todas las páginas
  de la pizarra del módulo** (rasterizadas con `exportToBlob`), capturas,
  preguntas e interacciones con el asistente; y **Markdown** con capturas
  (código R, salidas), preguntas y chat verificado.
- Observabilidad: *ring buffer* de ~500 eventos persistidos (panel
  Diagnóstico) con fallback en memoria.

### Atajos de teclado

| Atajo | Acción |
| --- | --- |
| `Ctrl+Shift+B` | Abrir/cerrar la pizarra |
| `Ctrl+Shift+S` | Capturar región de pantalla |
| `P` | Entrar/salir de modo presentación |
| `S` | Armar/desarmar spotlight |
| `→` / `←` (en presentación) | Revelar / retroceder un paso |
| `Esc` | Desarmar spotlight → limpiar → salir de presentación |

## Tecnologías utilizadas

- [Next.js 14](https://nextjs.org/) (App Router) + [TypeScript](https://www.typescriptlang.org/) estricto
- [Tailwind CSS](https://tailwindcss.com/) + [`@tailwindcss/typography`](https://github.com/tailwindlabs/tailwindcss-typography)
- [`webr`](https://docs.r-wasm.org/webr/latest/) — R completo vía WebAssembly, 100% en el cliente
- [`@uiw/react-codemirror`](https://uiwjs.github.io/react-codemirror/) con modos de R y SAS para resaltado de sintaxis
- [`react-markdown`](https://github.com/remarkjs/react-markdown) + [`remark-math`](https://github.com/remarkjs/remark-math) + [`rehype-katex`](https://github.com/remarkjs/remark-math/tree/main/packages/rehype-katex) + [KaTeX](https://katex.org/) para notación matemática
- [`@excalidraw/excalidraw`](https://excalidraw.com/) — canvas de la pizarra docente
- [`jspdf`](https://github.com/parallax/jsPDF) — informes de sesión en PDF
- IndexedDB (`idb-keyval`) con fallback `localStorage` — persistencia local de escenas, sesiones, capturas y eventos
- [Jest](https://jestjs.io/) + [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/) para pruebas
- [Docker](https://www.docker.com/) / Docker Compose para empaquetado y despliegue
- [Vercel](https://vercel.com/) como plataforma de despliegue recomendada

## Estructura del curso

| Mód. | Título | Contenido principal |
| ---- | ------ | -------------------- |
| 1 | Introducción a los Modelos Mixtos | Motivación, datos longitudinales y diferencia entre efectos fijos y aleatorios. |
| 2 | Análisis Exploratorio de Datos Longitudinales | Gráficos de perfiles, perfiles promedio y detección de patrones de anidamiento con `ggplot2`. |
| 3 | Modelo Lineal Mixto (LMM) | Especificación del LMM con `lme4` y `nlme`, e interpretación de la salida del modelo. ★ Apéndice A: Bayes empírico y shrinkage (BLUPs como medias posteriores). ★ Apéndice B: algoritmo EM/E-step, M-step y convergencia. |
| 4 | Modelos Lineales Mixtos básicos | Interpretación de interceptos y pendientes aleatorias en trayectorias clínicas. |
| 5 | Covarianza y correlación en LMM | Comparación de estructuras CS, AR(1) y no estructurada; matriz de covarianza residual. ★ Apéndice: estructuras avanzadas FA, HF, ARMA(1,1) y GLS-AR(1) puro vs. LMM. |
| 6 | Diagnóstico con residuos simulados (DHARMa) | Validación de supuestos, detección de outliers y documentación de desviaciones del modelo. ★ Apéndice: distancia de Cook y DFBETAS con `influence.ME`, eliminación de sujetos influyentes. |
| 7 | GLMM binomial y Poisson | Familias binomial y Poisson para respuestas no gaussianas con efectos aleatorios. |
| 8 | Comparación y selección de modelos | AIC/BIC y pruebas de razón de verosimilitud para elegir entre especificaciones anidadas. |
| 9 | Casos integradores: splines, diagnóstico y comunicación | Caso clínico completo: especificación, splines, diagnóstico DHARMa, selección y comunicación de resultados. |
| 10 | Modelos marginales y GEE | GEE vs. GLMM, estructuras de correlación de trabajo y errores estándar tipo sándwich. |
| 11 | Estructuras de varianza avanzadas | Correlaciones complejas, heterocedasticidad y estructuras de trabajo para modelos marginales. |
| 12 | Modelos para intervenciones y cambios temporales | Series interrumpidas, variables dependientes del tiempo y cambios de pendiente. |
| 13 | Modelos no paramétricos y robustos | GAMM, transformaciones y bootstrap para trayectorias no lineales. |
| 14 | Recomendaciones para datos longitudinales y medidas repetidas | Guía experta: exploración, efectos aleatorios, covarianza, selección de modelos, diagnóstico y árbol de decisión. |
| 15 | Aplicación práctica comparada en R y SAS | Implementación lado a lado de las recomendaciones del Módulo 14, con dos casos clínicos integradores. |
| 16 | Modelos No Lineales Mixtos (NLMM) | Función logística de 3 parámetros, ajuste con `nlme::nlme()`, gestión de valores iniciales, comparación NLMM vs. LMM con datos SPRUCE1. |
| 17 | Potencia estadística y diseño de estudios longitudinales | Fórmulas analíticas de tamaño muestral, `longpower::lmmpower()` y `simr::powerSim()` para estudios longitudinales con efectos aleatorios. |
| 18 | Ejercicios propuestos | Ejercicios del Cap. 8 de Correa y Salazar (2016): Enalapril, Clínicas, Pilas; ejercicios complementarios con soluciones ocultables. |

> ★ = sección añadida como apéndice al módulo original.

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
`mgcv`, `influence.ME`, `longpower`, `simr`); puede tardar entre 10 y 30
segundos según la conexión. Ejecuciones posteriores son casi instantáneas
porque la instancia de WebR se reutiliza.

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
  layout.tsx                                  # Layout raíz, fuente Inter, WebRProvider, BlackboardProvider
  page.tsx                                    # Portada / índice del curso
  cursos/[course]/modulos/[slug]/page.tsx     # Página genérica de cada módulo (MDX)
components/
  layout/Logo.tsx             # Logo tipográfico del curso (SVG inline)
  AppLayout.tsx               # Shell (sidebar + main + footer + pizarra)
  Sidebar.tsx                 # Índice colapsable del curso (desktop + drawer móvil)
  Footer.tsx                  # Pie de página con logo, licencia y créditos
  ProgressBar.tsx             # Barra de progreso (usa useCourseProgress)
  LessonProgressTracker.tsx   # Marca el módulo actual como completado
  RCell.tsx                   # Celda de código R editable y ejecutable
  ConsoleOutput.tsx           # Salida de consola truncada (con expandir "+")
  SASAccordion.tsx            # Acordeón con código SAS de referencia
  Callout.tsx, Quiz.tsx, Flashcard.tsx, DataTable.tsx, ProcessSteps.tsx
  WebRProvider.tsx            # Contexto global de WebR
  CourseBlackboard.tsx        # Wrapper del curso: rieles, asistente, cajón y sesión↔pizarra
  PageNav.tsx                 # Navegación serializada de páginas del riel izquierdo
  DynamicCourseBlackboard.tsx # Lazy-load del panel (solo se descarga al abrirlo)
  MainColumn.tsx              # Columna de contenido: dock 60/40 cuando la pizarra está abierta
  SessionToolbar.tsx          # Sesiones de clase: iniciar/finalizar, historial, exportar PDF/MD
  ToolsDrawer.tsx             # Cajón de recursos colapsable (capturas, fórmulas, matrices…)
  PresentationControls.tsx    # Pasos, spotlight y modo presentación (fila o riel vertical)
  ShortcutsHelp.tsx           # Ayuda de atajos de teclado
  QuestionsPanel.tsx          # Registro de preguntas de estudiantes
  CaptureTrigger/Overlay/Manager/Gallery.tsx  # Captura de región + biblioteca
  ElementEditor.tsx           # Re-edición de fórmulas/matrices insertadas en el lienzo
  FormulaPalette.tsx, MatrixBuilder.tsx, NotesPanel.tsx, DiagnosticsPanel.tsx
content/
  modules/                    # Un .mdx por módulo: NN-slug-metodo.mdx
mdx-components.tsx            # Mapa global de componentes MDX (RCell, Quiz, etc.)
types/
  course.ts                   # Tipos centralizados: ModuleMeta, RCellProps, QuizProps, ...
lib/
  webr.ts                      # Instancia compartida de WebR, captura de salidas/plots
  courses.ts                   # Lectura de content/modules/*.mdx (frontmatter + fuente)
hooks/
  useWebR.ts                   # useRCell(): ejecución de celdas R contra WebR
  useProgress.ts               # useMarkLessonComplete() / useCourseProgress()
packages/
  blackboard/                  # Paquete @cursos/blackboard (pizarra plegable integrada)
    src/
      components/              # BlackboardPanel, BlackboardCanvas, BlackboardToolbar,
                               # BlackboardAssistant, BlackboardContextBridge, …
      hooks/                   # useBlackboard, useBlackboardScene, useBlackboardLLM, …
      lib/                     # context, reducer, assistant (tools, board-ops), events,
                               # prompts, storage (IndexedDB/localStorage/memoria),
                               # persistence (versionado + migraciones), llm, graph, export
scripts/
  generate-mdx.ts              # Herramienta de migración/mantenimiento (histórica)
```

## Arquitectura de contenido (MDX)

Todo el contenido pedagógico vive en `content/modules/` como archivos
`.mdx`, **uno por módulo**, nombrados `NN-slug-metodo.mdx` (dos dígitos de
orden + slug en kebab-case basado en el método/tema estadístico, nunca en el
nombre del dataset). Cada archivo es autónomo: front matter YAML + contenido
MDX que solo depende de los componentes globales registrados en
`mdx-components.tsx`.

### Front matter

```yaml
---
title: "Título del módulo"
slug: "slug-del-metodo"
subtitle: "Una línea de contexto/resumen"
objective:
  - "Primer objetivo de aprendizaje"
  - "Segundo objetivo"
order: 4
datasets:
  - "Nombre del dataset (paquete)"
---
```

### Componentes disponibles dentro del MDX

| Componente | Uso |
| --- | --- |
| `<Callout type="tip\|info\|warning\|success" title="...">...</Callout>` | Recuadro destacado |
| `<RCell id="..." title="..." code={\`...\`} />` | Celda de código R ejecutable (WebR) |
| `<SASAccordion title="..." code={\`...\`} />` | Acordeón con código SAS de referencia |
| `<DataTable caption="..." columns={[...]} rows={[...]} />` | Tabla de datos/resultados |
| `<ProcessSteps title="..." steps={[{title, description}, ...]} />` | Lista numerada de pasos |
| `<Flashcards items={[{front, back}, ...]} />` | Grid de flashcards de repaso |
| `<Quiz questions={[{question, options, correctIndex, explanation}, ...]} />` | Autoevaluación |

Fórmulas LaTeX se escriben igual que antes: `$...$` para inline y `$$...$$`
para bloque (soportado vía `remark-math` + `rehype-katex`).

### Ejemplo mínimo de un módulo nuevo

```mdx
---
title: "Modelos mixtos bayesianos: una introducción"
slug: "intro-modelos-bayesianos"
subtitle: "Priors, MCMC y brms en el contexto de medidas repetidas."
objective:
  - "Explicar la diferencia entre inferencia frecuentista y bayesiana."
  - "Ajustar un LMM bayesiano simple con brms."
order: 19
datasets:
  - "sleepstudy (lme4)"
---

## Motivación

Los modelos bayesianos permiten incorporar conocimiento previo...

<Callout type="info" title="¿Por qué bayesiano?">
Los intervalos de credibilidad tienen una interpretación directa de probabilidad.
</Callout>

<RCell id="brms-fit" title="Ajustar un LMM bayesiano" code={`library(brms)
mod <- brm(Reaction ~ Days + (Days | Subject), data = sleepstudy)
summary(mod)`} />

<Quiz questions={[
  {
    question: "¿Qué representa un intervalo de credibilidad del 95%?",
    options: ["Lo mismo que un IC frecuentista", "La región que contiene el 95% de la probabilidad posterior", "Un valor p"],
    correctIndex: 1,
    explanation: "A diferencia del IC frecuentista, tiene una interpretación probabilística directa sobre el parámetro."
  }
]} />
```

Para que aparezca en la barra lateral y en la portada basta con guardar el
archivo en `content/modules/19-intro-modelos-bayesianos.mdx` — `lib/courses.ts`
lee el directorio en build/runtime y ordena los módulos por el campo `order`
del front matter. No es necesario tocar componentes ni rutas.

## Principios de diseño (SOLID)

- **Single Responsibility**: cada componente de bloque (`Callout`, `RCell`,
  `SASAccordion`, `Quiz`, `Flashcards`, `DataTable`, `ProcessSteps`) renderiza
  exactamente un tipo de contenido y no conoce el resto de la lección.
- **Open/Closed**: añadir o editar un módulo es agregar/editar un `.mdx` en
  `content/modules/` — no requiere modificar `app/cursos/.../page.tsx`,
  `Sidebar` ni `lib/courses.ts`.
- **Liskov / interfaces uniformes**: los props de cada componente de bloque
  están centralizados en `types/course.ts` (`RCellProps`, `QuizProps`,
  `FlashcardProps`, `DataTableProps`, `ProcessStepsProps`, `CalloutProps`,
  `SASAccordionProps`), de modo que cualquier `.mdx` puede usarlos de forma
  intercambiable y predecible.
- **Interface Segregation**: `lib/courses.ts` expone solo lo que las páginas
  necesitan (`getAllModules`, `findModule`, `getModuleSource`,
  `getAdjacentModules`) sin filtrar detalles de `gray-matter` o del sistema
  de archivos.
- **Dependency Inversion**: la página dinámica
  (`app/cursos/[course]/modulos/[slug]/page.tsx`) y el `Sidebar` dependen de
  la abstracción `lib/courses.ts`, no del formato de archivo subyacente — si
  el contenido se migrara a un CMS, solo cambiaría esa capa.

## Pruebas

```bash
npm test
```

- `hooks/useProgress.test.ts` — cubre `useCourseProgress` y
  `useMarkLessonComplete`.
- `components/Callout.test.tsx` — cubre el renderizado de `Callout` con sus
  distintos `type` y títulos.
- `packages/blackboard/src/lib/` — eventos (`events.test.ts`), herramientas
  del asistente (`assistant/tools.test.ts`), prompts del sistema
  (`prompts/system.test.ts`), migraciones y storage en memoria.
- `packages/blackboard/src/components/BlackboardCanvas.test.tsx` — regresión
  de la guarda anti-contaminación entre escenas y persistencia de `files`.
- `components/PageNav.test.tsx` — navegación, creación, borrado y filtrado
  por módulo de las páginas de la pizarra.
- `lib/session-store.test.ts` — CRUD de sesiones, capturas, preguntas,
  secciones visitadas y puntero `activeSceneId`.
- `lib/markdown-export.test.ts` — exportación de la sesión a Markdown.

En total: **17 suites, 91 tests** (incluye 1 snapshot).

## Contribución

Todo el contenido pedagógico vive en `content/modules/` como archivos `.mdx`
— uno por módulo —, por lo que se puede **editar o ampliar sin tocar
componentes ni rutas**:

1. Haz un fork y crea una rama descriptiva (`feat/modulo-19-...`,
   `fix/typo-modulo-3`).
2. Para añadir un módulo nuevo, crea `content/modules/NN-slug.mdx` con el
   front matter correcto (`title`, `slug`, `order`, `objective[]`, `datasets[]`).
   `lib/courses.ts` lo detecta automáticamente y lo inserta en la barra
   lateral ordenado por `order`.
3. Para editar contenido existente, modifica directamente el `.mdx`
   correspondiente: los componentes `<RCell>`, `<Callout>`, `<Quiz>`,
   `<Flashcards>`, `<DataTable>`, `<ProcessSteps>` y `<SASAccordion>` están
   disponibles en cualquier módulo sin importación adicional.
4. Ejecuta `npm run dev` y `npm test` antes de abrir el pull request.
5. Describe en el PR qué módulo/sección se modifica y por qué.

Los reportes de errores (de contenido o de la aplicación) pueden abrirse como
*issues*, indicando el módulo afectado y, si aplica, el código R que falla.

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

Agradecimientos por supuesto a (Juan Carlos Salazar & Juan Carlos correa) por su libro escrito en conjunto, el material compartido y
las discusiones en clases del Departamento de Estadística de la Universidad Nacional de colombia, sede Medellin, como también al material de referencia de (Pinheiro & Bates, Verbeke & Molenberghs, West, Welch & Galecki, entre otros) que inspiran el contenido, orden y los ejemplos y la progresión pedagógica de este curso.
