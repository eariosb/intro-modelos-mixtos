# Pizarra Digital — Documento de arquitectura y desarrollo

Documento técnico completo del sistema de pizarra digital del curso de Modelos
Lineales Mixtos. Describe el stack, la arquitectura, las decisiones de
ingeniería, la funcionalidad implementada, la estrategia de pruebas y los
beneficios. Documento complementario de `MANUAL-PIZARRA.md` (manual de usuario)
y `MANUAL-TESTING.md` (checklist de QA).

---

## 1. Visión y motivación

El proyecto nació de una necesidad docente concreta:

> Una pizarra que permita explicar, diagramar, formular, calcular y demostrar a
> través de manuscritos, guardar anotaciones para enviar posteriormente a los
> alumnos.

El flujo objetivo era `navegar → capturar → arrastrar → anotar → guardar →
exportar, sin salir de la app`. El resultado es una aplicación docente completa
que convive con el contenido MDX del curso: la pizarra ocupa ~60 % del viewport
y el contenido del módulo el ~40 % restante, de modo que el docente lee el
material mientras dibuja, formula y ejecuta código sobre el mismo espacio.

Principios rectores adoptados durante el desarrollo:

1. **Local-first**: sin backend propio ni base de datos externa; todo vive en el
   navegador del docente (IndexedDB), lo que elimina cuentas, servidores y
   puntos de fallo durante la clase.
2. **Fail-soft**: cada subsistema opcional (LLM, WebR, servicio de visión)
   degrada con elegancia — la pizarra funciona al 100 % sin ellos.
3. **Persistencia verificable**: nada que el docente dibuje debe perderse al
   recargar, cambiar de página o cerrar sesión.
4. **Docencia primero**: cada herramienta existe para el acto de enseñar
   (formular, demostrar, responder preguntas, exportar evidencia), no por
   acumulación de features.

---

## 2. Stack tecnológico

| Capa | Tecnología | Rol |
|---|---|---|
| Framework | Next.js 14 (App Router) | Shell de la aplicación, rutas `/cursos/[course]/modulos/[slug]` |
| UI | React 18 + TypeScript strict | Componentes, type-safety extremo a extremo |
| Estilos | Tailwind CSS + PostCSS | Sistema de diseño (tokens `ink-*`, `accent-*`), modo oscuro por clase `.dark` |
| Motor de pizarra | `@excalidraw/excalidraw` 0.18.1 | Canvas de dibujo a mano alzada, figuras, texto, imágenes |
| Matemática | KaTeX | Render de fórmulas LaTeX y matrices (preview y rasterización) |
| Imágenes | `html-to-image` | Rasterización DOM → PNG (fórmulas, matrices, capturas de región) |
| Estadística | WebR (`@r-wasm/webr`) | R real ejecutándose en WebAssembly dentro del navegador |
| Persistencia | `idb-keyval` + IndexedDB | Escenas, archivos binarios, capturas, sesiones, chat |
| PDF | `jspdf` | Informe de sesión multipágina |
| IA | OpenAI-compatible API (DeepSeek por defecto) | Asistente con RAG y tool calls |
| Retrieval | BM25 propio (`lib/rag/bm25.ts`) | Búsqueda sobre la bibliografía del curso |
| Sincronización | BroadcastChannel | Canal profesor ↔ estudiantes en tiempo real |
| Visión | Proxy `/api/vision/*` → servicio Python (`:8765`) | Contrato That_Board (lápiz IR) |
| Tests | Jest 29 + Testing Library + jest-dom | 20 suites / 97 pruebas |
| Build | `next build`, `vercel.json` incluido | Producción verificada |

---

## 3. Arquitectura

### 3.1 Estructura de directorios

```
packages/blackboard/src/          Paquete de pizarra reutilizable (workspace)
├── components/                   BlackboardCanvas, BlackboardPanel,
│                                 BlackboardAssistant, BlackboardToolbar,
│                                 BlackboardSettingsPanel, BlackboardExport,
│                                 BlackboardContextBridge, BlackboardAnchor,
│                                 BlackboardTrigger, BlackboardSkeleton,
│                                 BlackboardEmbed
├── hooks/                        useBlackboardScene (CRUD de escenas),
│                                 useBlackboardExport, useBlackboardLLM,
│                                 usePresentation, useBlackboard
├── lib/
│   ├── context.tsx               BlackboardProvider + reducer + tipos
│   ├── storage/                  indexeddb / localstorage / memory (fallbacks)
│   ├── persistence/              schema, migración, validadores
│   ├── assistant/                loop, tools, board-ops, validate, latex-runtime
│   ├── llm/                      providers openai/mock/none
│   ├── rag/                      bm25, retrieve, runtime
│   ├── events.ts                 bus de observabilidad
│   ├── steps.ts                  pasos de revelado progresivo
│   └── prompts/system.ts         prompt del asistente docente
└── types/blackboard.ts           Contratos de dominio

components/                       Capa host de la app
├── CourseBlackboard.tsx          Orquestador del panel (layout 60/40)
├── PageNav.tsx                   Riel de páginas (‹ contador ＋ 🗑 ›)
├── ToolsDrawer.tsx               Cajón de herramientas auxiliares
├── SessionToolbar.tsx            Sesión, informes PDF/MD, calibración
├── MatrixBuilder.tsx             Editor de matrices + preview KaTeX
├── FormulaPalette.tsx            Fórmulas frecuentes MLM
├── CaptureGallery.tsx            Biblioteca de capturas
├── CaptureOverlay.tsx            Captura por región del DOM
├── NotesPanel / QuestionsPanel / ModelComparator
├── CalibrationWizard.tsx         Asistente That_Board (4 puntos)
└── DynamicCourseBlackboard.tsx   Wrapper next/dynamic (ssr:false)
```

### 3.2 Diagrama de capas

```
┌──────────────────────────────────────────────────────────────┐
│                     App host (Next.js)                        │
│  app/cursos/.../page.tsx → DynamicCourseBlackboard            │
│  → CourseBlackboard (layout, SessionToolbar, PageNav, rails)  │
├──────────────────────────────────────────────────────────────┤
│              packages/blackboard (workspace pkg)              │
│                                                               │
│  BlackboardProvider (reducer: estado global)                  │
│    ├── BlackboardContextBridge — hidrata escenas del módulo   │
│    ├── BlackboardCanvas — Excalidraw, inserción, persistencia │
│    ├── BlackboardAssistant — chat + tool calls + RAG          │
│    ├── BlackboardToolbar / SettingsPanel / Export             │
│    └── hooks — escena, export, LLM, presentación              │
├──────────────────────────────────────────────────────────────┤
│              Servicios externos (opcionales)                  │
│  LLM (DeepSeek/OpenAI) · WebR (R en WASM) · Visión (:8765)   │
├──────────────────────────────────────────────────────────────┤
│              Persistencia local                               │
│  IndexedDB (bb-scenes, files, capturas, chat)                 │
│  → localStorage (fallback) → memory (tests)                   │
└──────────────────────────────────────────────────────────────┘
```

### 3.3 Estado global (reducer)

`BlackboardProvider` centraliza el estado: escenas activas, escena seleccionada,
settings, mensajes del asistente, contexto de módulo. Acciones clave:

- `UPSERT_SCENE { scene, activate? }` — registra/actualiza una escena. La
  bandera `activate` (default `true`) se introdujo para que la hidratación
  inicial registre páginas sin robar la selección activa.
- `SELECT_SCENE` — cambia la página activa del canvas.
- `SET_LLM_MESSAGES` — rehidrata el chat del asistente desde `bb-chat`.
- Acciones de settings, sesión, preguntas de estudiantes, diagnóstico.

### 3.4 Modelo de escenas y páginas

Cada página del pizarrón es una `BlackboardScene` persistida:

```ts
interface BlackboardScene {
  id: string;                    // 'blackboard/<moduleSlug>' (default)
                                 // 'blackboard/<moduleSlug>/<timestamp>' (páginas)
  elements: ExcalidrawElement[]; // Elementos de Excalidraw
  files: Record<string, BinaryFileData>;  // Binarios de imágenes insertadas
  appState: ...;                 // Fondo, grid, etc.
  updatedAt: number;
}
```

Propiedades de diseño importantes:

- **IDs deterministas**: la página por defecto es `blackboard/<slug>`; las
  adicionales llevan timestamp → el orden por `id` equivale a orden cronológico
  y es **estable** (inmune a reshuffles por `updatedAt` en cada guardado
  debounced).
- **`files` persistidos**: las imágenes insertadas (fórmulas, matrices,
  capturas, plots de R) referencian `fileId`. Los binarios se guardan junto a
  la escena y se restauran con `api.addFiles([...])` antes del `updateScene` —
  sin esto, las imágenes quedaban rotas tras recargar.
- **Scope por módulo**: `StorageProvider.listScenes(moduleSlug)` filtra por
  prefijo, así cada módulo del curso tiene su pizarra independiente.

### 3.5 Persistencia en cascada

`createStorageProvider()` intenta IndexedDB (`bb-scenes`) → localStorage →
memory. IndexedDB es el preferido porque los `files` binarios exceden la cuota
de 5 MB de localStorage. En tests se usa `MemoryStorageProvider` (exportado del
paquete precisamente para eso).

Ciclo de escritura del canvas:

```
onChange(elements, appState, files)
  → latestChangeRef = {sceneId, elements, appState}
  → debounce 400 ms → persistSceneNow()
        dreña latestChangeRef (idempotente)
        scene = {id, elements, files: api.getFiles(), appState, updatedAt}
        saveScene(scene) → storage + UPSERT_SCENE
  → efecto de flush al desmontar/cambiar escena vía ref estable
```

Dos invariantes blindadas por tests:

- **Idempotencia**: `latestChangeRef` se vacía tras cada persistencia — evita el
  bucle infinito save→dispatch→cleanup→flush que congelaba la UI.
- **Atribución correcta**: un flush tardío nunca escribe el contenido de la
  página anterior bajo el id de la nueva (guard por `sceneId`).

### 3.6 Pipeline de inserción de imágenes

Todas las inserciones (fórmulas, matrices, capturas, salidas de R) comparten el
mismo camino:

```
Productor → sendToBlackboard(dataUrl, {boardKind, metadata})
          → (cola si el canvas no está montado)
          → BlackboardCanvas.insertImage()
              Image() → dimensiones naturales
              api.addFiles([{mimeType, dataURL, id: fileId, created}])
              api.updateScene({elements: [...els, imageElementCompleto]})
```

Detalle crítico: `addFiles` en Excalidraw 0.18.1 firma
`(data: BinaryFileData[]) => void` — **array**, no mapa. Pasar un objeto
`{[fileId]: ...}` fallaba en silencio y rompía toda inserción; la interfaz
local `ExcalidrawAPI` estaba mal tipada a mano, por lo que TypeScript no lo
detectó. Los stubs de test ahora replican la firma real para evitar regresiones.

El elemento imagen insertado lleva la forma completa del modelo 0.18 (`angle`,
`seed`, `version`, `versionNonce`, `scale`, `opacity`, `strokeColor`,
`backgroundColor`, `fillStyle`, `strokeWidth`, `strokeStyle`, `roughness`,
`roundness`, `groupIds`, `frameId`, `boundElements`, `link`, `locked`,
`customData`, `status`, `fileId`) — un elemento incompleto reventaba el
renderer al leer campos inexistentes.

### 3.7 Asistente IA con RAG y tool calls

```
Pregunta del docente
  → retrieve() (BM25 sobre corpus del módulo vía /api/rag-corpus)
  → system prompt + contexto bibliográfico + estado del lienzo
  → LLM (openai-compatible, default deepseek-chat)
  → loop de tool calls (lib/assistant/loop.ts):
      insert_formula / insert_matrix / run_r_code / annotate / navigate…
      → board-ops.ts ejecuta contra el canvas real
      → respuesta final con citas de la bibliografía
```

- Sin API key → provider `mock` (respuestas de demostración) o `none`.
- Las respuestas citan fuentes del corpus indexado (BM25 sobre los MDX/docs del
  módulo) — grounding en la bibliografía del curso, no conocimiento libre.
- WebR ejecuta el código R que el asistente genera y su salida (texto/plot) se
  inserta como imagen en el lienzo.

### 3.8 Modo presentación y sincronización docente/estudiante

- `usePresentation` gestiona pasos de revelado progresivo (`lib/steps.ts`),
  spotlight y atajos (P, S, ←/→, Esc escalonado).
- `BroadcastChannel` difunde estado a vistas de estudiantes en otras pestañas/
  dispositivos del mismo origen: contenido, cursor remoto del docente
  (`RemoteCursor` reutiliza el canal, filtra posiciones sin cambio), paso de
  revelado.
- Modo puntero (`pointerMode`, clase `bb-pointer`): agranda los targets
  interactivos a ~44-56 px para uso con puntero a distancia / pantalla táctil.

### 3.9 Contrato de visión (That_Board)

Proxy transparente `app/api/vision/[...path]/route.ts` → servicio Python
(`http://localhost:8765`, override `VISION_SERVICE_URL`). Endpoints:
`GET /blob`, `POST /calibrate/start`, `GET /calibrate/status`,
`GET /homography`. Timeout de 3 s y `503` elegante cuando el servicio no corre.
`CalibrationWizard` guía la calibración de 4 puntos (TL/TR/BR/BL) con sondeo
cada 400 ms y cancelación por Esc. La app funciona completa sin el servicio —
es un add-on para pantallas IR en el aula.

### 3.10 Chrome de Excalidraw minimizable

Tres zonas del chrome de Excalidraw se pueden ocultar vía CSS conmutado en el
contenedor del canvas:

- `bb-min-tools` → `.App-top-bar` + `.App-menu__left` + `.App-menu_bottom`
  (botón global junto al ☰).
- `bb-min-props` → solo `.App-menu__left` (botón en el borde derecho del panel
  de propiedades; aparece/desaparece con el panel vía `MutationObserver`).

Preferencias persistidas en `bb-tools-min` / `bb-props-min`. Los botones usan la
clase `.bb-chrome-btn` (globals.css) con los valores exactos del tema de
Excalidraw (`surface-low/high`, `on-surface`, 40 px `--lg-button-size`) e
iconos SVG de trazo para integrarse visualmente.

---

## 4. Funcionalidad completa

| Área | Capacidad |
|---|---|
| Dibujo | Mano alzada, figuras, flechas, texto, borrador (Excalidraw completo) |
| Páginas | Crear ＋, navegar ‹ ›, borrar 🗑 (vecino válido), persistencia por módulo |
| Fórmulas | Paleta MLM frecuente + LaTeX libre; insertar/copiar LaTeX/R; KaTeX |
| Matrices | Estructuras (identidad, diagonal, AR1, bandeada, personalizada), edición celda a celda con decimales, preview KaTeX lateral, inserción y **re-edición** del elemento en el lienzo |
| Capturas | Recorte por región del DOM, biblioteca con etiquetas/búsqueda, drag al lienzo, botón "A la pizarra", metadatos |
| Código R | Ejecución WebR real, salida texto/plot insertable, comparador de modelos |
| Asistente | Chat con RAG + citas, tool calls que escriben en el lienzo, sandbox |
| Presentación | Revelado progresivo por pasos, spotlight, difusión a estudiantes |
| Sesiones | Nueva/finalizar/historial, resume de página activa y chat |
| Informes | PDF multipágina (rasteriza todas las escenas del módulo), Markdown con narración |
| Observabilidad | Panel de diagnóstico con eventos (errores de inserción visibles) |
| Accesibilidad | Modo puntero (targets grandes), contraste corregido en rieles, `<dialog>` nativo |
| Chrome | Minimizado de toolbar completa y/o panel de propiedades, persistido |

---

## 5. Decisiones de ingeniería relevantes

1. **Local-first sobre backend**: elimina autenticación, despliegue de servidor
   y latencia. El costo — datos atados al navegador — se mitiga con
   exportación PDF/MD/JSON.
2. **Reducer centralizado + bridge de hidratación**: separa el estado global
   (`context.tsx`) del acoplamiento con el storage (`BlackboardContextBridge`)
   y del canvas (`BlackboardCanvas`). El bug de páginas fantasma nació de
   cargar solo la escena default; el fix fue hidratar todo el scope con
   `activate: false`.
3. **Tipos honestos con Excalidraw**: la interfaz `ExcalidrawAPI` local ahora
   refleja las firmas reales (`addFiles(BinaryFileData[])`), y los fakes de
   test las imitan — lección: un mock demasiado laxo oculta bugs de API.
4. **Orden estable de páginas por id**: nunca por `updatedAt` — los guardados
   debounced no deben reordenar la UI debajo del docente.
5. **Guardado idempotente**: drenar `latestChangeRef` tras persistir rompe el
   ciclo save→dispatch→flush que congelaba el canvas.
6. **Errores visibles, no silenciados**: inserciones fallidas muestran mensaje
   rojo junto al botón + evento `insert-failed` en diagnóstico.
7. **CSS dirigido a clases de Excalidraw verificadas en el CSS instalado**
   (`.App-menu__left`, `.App-top-bar`, …) — nunca adivinadas.
8. **Tailwind escanea `packages/**`**: sin la entrada en `content`, las clases
   propias del paquete (p. ej. `z-[9999]`) no generaban CSS — causa raíz del
   botón de minimizar invisible.

---

## 6. Estrategia de pruebas

- **20 suites / 97 tests** (Jest + Testing Library), `tsc --noEmit` limpio,
  `next build` verificado.
- `BlackboardCanvas.test.tsx` — regresión de contaminación entre escenas,
  persistencia de `files`.
- `PageFlow.integration.test.tsx` — stub fiel de Excalidraw (`updateScene`
  emite `onChange`, `getSceneElements` refleja estado): ciclo completo
  crear → dibujar → navegar → borrar → recarga simulada.
- `PageNav.test.tsx`, `MatrixBuilder.test.tsx`,
  `BlackboardContextBridge.test.tsx`, `session-store.test.ts`, …
- Los tests de integración detectaron el bucle infinito de persistencia que los
  unitarios no veían (mock sin `onChange` real).

---

## 7. Beneficios para el piloto universitario

- **Cero infraestructura**: sin servidor, base de datos ni cuentas; cada equipo
  docente es autónomo.
- **Offline-friendly**: tras la primera carga de WebR, funciona sin red.
- **Evidencia exportable**: cada clase produce un PDF/Markdown enviable a los
  estudiantes.
- **Grounding académico**: el asistente cita la bibliografía real del curso —
  apto para departamento de Estadística.
- **Extensible**: el paquete `blackboard` es reutilizable en otros cursos; el
  contrato `/api/vision/*` permite sumar That_Board sin tocar la app.
- **Auditable**: panel de diagnóstico + suite de tests + manual de QA.

---

## 8. Limitaciones conocidas y roadmap

| Ítem | Estado |
|---|---|
| Renombrar/reordenar páginas | Diferido — requiere campo `title` (migración v4) |
| Servicio de visión Python | Contrato listo; implementación externa |
| Claves API | Almacenadas en localStorage del docente; cifrado opcional pendiente |
| Datos atados al navegador | Por diseño local-first; mitigado con exportaciones |
| Multi-docente concurrente | Fuera de alcance (BroadcastChannel es mismo-origen) |

Roadmap sugerido: sincronización entre dispositivos vía servicio externo,
cifrado de claves, página con título editable, recorder de sesión.
