# Checklist manual de verificación — Pizarra digital

Ejecutable por un tercero sin contexto. Navegador de referencia: **Chrome** (salvo que se indique otro). Todas las pruebas asumen `pnpm dev` corriendo y una página de módulo abierta (`/cursos/mlm/modulos/lmm` o equivalente).

Convenciones: "pizarra" = panel lateral que se abre con `Ctrl+Shift+B` o el botón flotante; "docente/alumno" = pestañas con ese modo activo en el toggle de la barra de herramientas.

---

### F-01 · Dibujo libre y persistencia

Precondiciones: pizarra abierta en modo docente.

1. Seleccionar lápiz en la toolbar de Excalidraw y escribir "test" a mano alzada. Esperado: trazo visible.
2. Cambiar a otra página de la pizarra (botón `+ Nueva` en la barra de páginas) y volver a la primera. Esperado: el trazo sigue presente.
3. Recargar la pestaña (F5) y reabrir la pizarra. Esperado: el trazo persiste.
4. Cambiar de pestaña del navegador a mitad de un trazo largo y volver. Esperado: el trazo quedó guardado (flush por `visibilitychange`); pérdida máxima < 1 s.

Fallos conocidos: ninguno.

---

### F-02 · Captura por región → biblioteca → lienzo

Precondiciones: una página de módulo con contenido visible.

1. Pulsar `Ctrl+Shift+S` y arrastrar un rectángulo sobre una tabla del módulo. Esperado: aparece en la pestaña **Capturas** del cajón inferior.
2. En Capturas: renombrarla a "tabla-covariables" y añadir etiqueta `lmm`. Esperado: queda guardada al salir del campo.
3. Arrastrar la miniatura al lienzo. Esperado: imagen insertada, centrada en el viewport.
4. Recargar la página y abrir Capturas. Esperado: la captura persiste con nombre y etiqueta.

---

### F-03 · Docente avanza paso → alumno lo ve

Precondiciones: dos pestañas Chrome, misma máquina, docente en A, alumno en B, mismo módulo y misma página de pizarra.

1. En A: escribir "paso 0" con lápiz. Esperado: visible en ambas.
2. En A: pulsar `→`. Esperado: `currentStep` pasa a 1 en A y en B (ver rótulo `paso 1/N` en A).
3. En A: dibujar "paso 1" y pulsar `P` (modo presentación). Esperado: toolbar/cajón/chat de A se ocultan; B sigue normal.
4. En A: pulsar `←`. Esperado: lo dibujado en paso 1 se oculta en ambas pestañas (opacidad 0).
5. En A: pulsar `Esc`. Esperado: A sale de presentación; ambas vuelven a mostrar todo.

Fallos conocidos: el modo estudiante **no bloquea edición local** (solo sincroniza vista). Paso 2 puede fallar en Safari (BroadcastChannel iOS).

---

### F-04 · Spotlight

Precondiciones: pizarra abierta, docente.

1. Pulsar `S` (o 🔦). Esperado: cursor en cruz sobre el lienzo.
2. Arrastrar un rectángulo. Esperado: el resto del lienzo se oscurece; en la pestaña alumno se ve igual.
3. Pulsar `Esc`. Esperado: foco desaparece en ambas.

---

### F-05 · Re-edición de fórmula/matriz por doble clic

Precondiciones: al menos una fórmula o matriz insertada en el lienzo (pestañas Fórmulas/Matrices del cajón).

1. Hacer doble clic sobre la fórmula/matriz en el lienzo. Esperado: se abre el editor con el contenido precargado (no el crop de Excalidraw).
2. Cambiar un valor (matriz) o el LaTeX (fórmula) y pulsar "Actualizar". Esperado: el raster se regenera en el mismo sitio y tamaño.
3. Recargar y reabrir. Esperado: el elemento refleja la edición.

---

### F-06 · Asistente con grounding (DeepSeek configurado)

Precondiciones: ⚙ Configuración → proveedor DeepSeek, modelo `deepseek-chat`, API key válida.

1. Preguntar: "¿Qué estructura de covarianza conviene para medidas repetidas igualmente espaciadas?" Esperado: respuesta en 5 secciones con referencias `[bib:...]` o `[mod:...]`.
2. Pedir: "inserta la fórmula del LMM con intercepto aleatorio". Esperado: la fórmula aparece en el lienzo (tool `insert_math`) y el texto lo confirma.
3. Pedir: "ejecuta `1+1` en R". Esperado: el asistente reporta `[1] 2` (tool `run_r` con WebR).
4. Diagnóstico (pestaña del cajón): verificar eventos `corpus-loaded` y `tool-result`.

Sin API key: el asistente responde con el MockProvider (formato de contrato) — nunca deja la UI colgada.

---

### F-07 · Sesión completa → PDF y Markdown

Precondiciones: una sesión con ≥1 captura, ≥1 pregunta, ≥1 intercambio con el asistente.

1. Pulsar `⏹ Finalizar`. Esperado: rótulo "Finalizada" en la barra de sesión.
2. Pulsar `📄 PDF`. Esperado: descarga un PDF con portada, secciones, capturas, preguntas, interacciones del asistente y pizarra.
3. Pulsar `⬇ MD`. Esperado: descarga `.md` con las mismas secciones en texto (capturas por nombre).
4. Iniciar `▶ Nueva` sesión. Esperado: contadores y preguntas vuelven a cero; la anterior sigue listada en el gestor de sesiones.

---

### F-08 · Recuperación ante fallo

Precondiciones: pizarra con contenido.

1. Abrir DevTools → Application → IndexedDB → confirmar `bb-scenes`, `mlm-sessions`, `mlm-captures`, `bb-chat`, `bb-events` presentes.
2. Cerrar la pestaña abruptamente (End task) y reabrir el módulo. Esperado: la pizarra restaura el último estado guardado (≤400 ms de pérdida).
3. En Diagnóstico, verificar que no hay `save-missed` repetidos (≥3/semana → reconsiderar WAL).

---

## Firma de verificación

| Fecha | Ejecutor | Navegador | Flujos OK | Incidencias |
|---|---|---|---|---|
| | | | | |
