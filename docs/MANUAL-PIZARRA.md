# Manual de usuario — Pizarra docente digital

Curso *Modelos Mixtos Aplicados a Ciencias de la Salud*.
Versión: piloto universitario 1.0 · Navegador de referencia: **Google Chrome**
(versión reciente). Todo el contenido de la pizarra se guarda **localmente en
el navegador** (IndexedDB): no se sube nada a ningún servidor salvo las
consultas al asistente IA (ver §8).

---

## 1. Visión general

La pizarra convierte el curso en un aula interactiva. El flujo de trabajo
pensado es:

**navegar por el módulo → capturar fragmentos → dibujar/formular/demostrar →
guardar en páginas → exportar el informe de la sesión (PDF o Markdown).**

Cuando la pizarra está abierta, el panel ocupa el 60 % izquierdo de la
pantalla y el contenido del curso se reacomoda al 40 % derecho: teoría y
lienzo siempre visibles a la vez. En pantallas estrechas se comporta como un
panel superpuesto a todo lo ancho.

## 2. Abrir y cerrar

| Acción | Cómo |
|---|---|
| Abrir / cerrar la pizarra | `Ctrl+Shift+B` o el botón flotante ✎ (esquina inferior derecha) |
| Pantalla completa | Botón ⛶ del riel derecho |
| Cerrar | Botón ✕ del riel derecho (o `Ctrl+Shift+B`) |

El panel recuerda si estaba abierto y lo reabre al volver al curso.

## 3. El lienzo (Excalidraw)

El área central es un lienzo de dibujo completo:

- **Lápiz / marcador** — trazo libre (atajo interno `7`).
- Figuras, flechas, texto, borrador, selección y zoom con la toolbar propia
  de Excalidraw (esquina superior izquierda del lienzo).
- **Deshacer / rehacer**: `Ctrl+Z` / `Ctrl+Shift+Z`.
- **Minimizar barras de herramientas**: el botón **−** (esquina superior
  izquierda del lienzo) oculta la toolbar de Excalidraw para usar todo el
  espacio de dibujo; **＋** la restaura. Con la barra oculta los atajos de
  herramientas siguen activos (`7` lápiz, `1` selección, `2` rectángulo,
  `3` elipse, `5` flecha, `8` texto…). La preferencia se recuerda.
- Todo lo dibujado se **guarda automáticamente** ~0.5 s después del último
  cambio (también al cambiar de página, ocultar la pestaña o cerrar).

## 4. Páginas de la pizarra (riel izquierdo)

Cada módulo tiene su propio juego de páginas. En el riel izquierdo, bajo el
botón de captura:

| Botón | Función |
|---|---|
| ‹ n/m › | Ir a la página anterior / siguiente. El contador muestra la página actual y el total. |
| ＋ | Crear una página nueva (queda seleccionada; el lienzo queda limpio). |
| 🗑 | Eliminar la página actual (pide confirmación; cae en la página vecina). |

Las páginas **persisten entre recargas y sesiones** — al volver a un módulo
verás todas las páginas que creaste. Al iniciar sesión se restaura además la
página exacta en la que quedó la clase.

## 5. Capturas de pantalla

Permite traer cualquier parte de la lección al trabajo de pizarra.

1. `Ctrl+Shift+S` o el botón 📷 del riel izquierdo.
2. Arrastra un rectángulo sobre la región (tabla, gráfico, fórmula…).
   `Esc` cancela.
3. La captura se guarda en la **Biblioteca de capturas** (pestaña *Capturas*
   del cajón inferior).

En la biblioteca puedes:

- **Arrastrar** una miniatura al lienzo (suelta donde quieras).
- Botón **"A la pizarra"** — la inserta centrada sin arrastrar.
- Editar nombre, tipo (Fórmula/Gráfico/Tabla/Código/Resultado) y etiquetas.
- Buscar y filtrar por tipo/etiqueta; **Borrar**.

Las capturas viven en la sesión activa y aparecen en los informes (§10).

## 6. Riel derecho — acciones rápidas

| Botón | Acción |
|---|---|
| ✨ | Preguntar a la IA sobre lo que hay en el lienzo (envía imagen + contexto del módulo). |
| 🔍 | Explicar la selección/lo visible del lienzo. |
| ▶ | Pedir al asistente código R para lo que se está trabajando. |
| 📈 | Pedir un gráfico R. |
| ⤓ | Menú de exportación del lienzo actual: descargar **PNG**, descargar **.excalidraw**, o copiar el último LaTeX / último código R generados por el asistente. |
| ⟲ | Limpiar el lienzo completo (pide confirmación). |
| ⛶ | Alternar pantalla completa del panel. |
| ⚙ | Configuración (§9). |
| ✕ | Cerrar la pizarra. |
| 👨‍🏫 / 🎓 | Conmutar rol docente/estudiante (§7). |
| ⌨️ Atajos | Listado de atajos de teclado. |

## 7. Modo presentación

Penal pensado para proyectar: desaparece todo el chrome (rieles, barras) y
solo queda el lienzo.

| Acción | Cómo |
|---|---|
| Entrar/salir de presentación | `P` o el botón 🎭/⏸ del riel derecho |
| Revelar el siguiente elemento | `→`, `Espacio` o `PageDown` (o › de los controles de paso) |
| Retroceder un paso | `←` o `PageUp` |
| Spotlight (foco de atención) | `S` 🔦 y arrastra un rectángulo; el resto del lienzo se oscurece |
| Salir (en orden) | `Esc`: primero desarma el spotlight, luego lo quita, luego sale de presentación |

**Revelado progresivo**: los elementos se van mostrando por pasos. Los
elementos dibujados desde el último avance se estampan con el paso actual al
pulsar ›, así que el orden de revelado sigue el orden de la explicación.

**Sincronización docente/estudiante** (misma clase en dos pestañas del mismo
navegador, ej. proyector + pantalla docente): en la pestaña del proyector
pon el rol 🎓 (estudiante); en la tuya, 👨‍🏫 (docente). Los cambios de página,
paso, spotlight y modo presentación se replican del docente al estudiante en
tiempo real. Estudiantes remotos reciben además tu puntero como cursor.

## 8. Asistente IA

Panel inferior **"✨ Asistente"** (clic en la tira para expandir/contraer).

### Modos

| Pestaña | Qué hace |
|---|---|
| Preguntar | Responde preguntas sobre el contenido del módulo y el lienzo. |
| Explicar | Explica la selección o lo que el lienzo muestra. |
| Generar R | Produce código R listo para ejecutar. |
| Graficar | Produce código R con salida gráfica. |

Escribe en el campo inferior y `Enviar` (o `Enter`). Mientras genera:
**Detener** aborta. **Limpiar** vacía la conversación.

### Citas y fundamentación (RAG)

Las respuestas se fundamentan en el **corpus del curso** (los 18 módulos +
bibliografía). Los fragmentos que sustentan la respuesta se citan y puedes
verificar la fuente. Un validador descarta citas inventadas.

### Acciones automáticas del asistente (tool calls)

Cuando el proveedor lo soporta (DeepSeek/OpenAI), el asistente puede
ejecutar herramientas del aula él mismo:

- `insert_math` — crea una fórmula renderizada directamente en el lienzo.
- `insert_matrix` — inserta una matriz de covarianza.
- `run_r` — ejecuta R en el navegador (WebR) y pega salida/gráfica al lienzo.
- `cite` — citar fuentes verificadas del corpus.

### Ejecutar código R de la IA

Cada bloque ```r de una respuesta tiene **"Ejecutar en RCell"**: abre un
sandbox R bajo la pizarra donde el código corre en el navegador (WebR), con
salida de consola y gráficos.

### Configuración del asistente (⚙)

- **Proveedor**: Simulado (sin API, respuesta de prueba), Anthropic Claude,
  OpenAI, **DeepSeek (OpenAI-compatible)**, u Ollama local.
- **Modelo**: p. ej. `deepseek-chat`, `gpt-4o-mini`.
- **API key**: se pega aquí y **solo se guarda en tu navegador**
  (IndexedDB); nunca sale del equipo salvo hacia el proveedor elegido.
- Sin proveedor configurado, el asistente responde con texto simulado —
  útil para probar la interfaz, no para clase.

## 9. Configuración (⚙)

| Opción | Descripción |
|---|---|
| Proveedor IA / Modelo / API key | Ver §8. Las keys nunca van al repositorio ni al servidor del curso. |
| Tema | Claro / Oscuro / Auto (sistema). |
| **Modo puntero** | Agranda todos los botones del panel (pensado para tablero táctil o lápiz infrarrojo That_Board). |

## 10. Sesiones de clase e informes

La **barra superior** del panel gestiona la sesión:

| Acción | Cómo |
|---|---|
| Iniciar sesión | Automática al entrar; o botón **Nueva sesión** (pide título) |
| Estado | Indicador "En curso" con horas de inicio |
| Historial | 🗂️ **Sesiones**: listar, cargar o borrar sesiones anteriores |
| Finalizar | Botón **Finalizar** (la sesión queda exportable igualmente) |
| **PDF** | Informe completo de la sesión |
| **MD** | Resumen en Markdown (ideal para correo a estudiantes) |
| Calibrar | Solo hardware That_Board (§12) |

### Qué incluye el PDF

Portada con título/fecha/estado · **todas las páginas de la pizarra del
módulo**, una por hoja, en orden · secciones visitadas · biblioteca de
capturas (imágenes incrustadas) · preguntas de estudiantes con su estado ·
conversación con el asistente (incluye citas verificadas).

El **Markdown** incluye el mismo contenido en texto, con las capturas como
rutas/imágenes y el chat formateado.

**Reanudar**: al cargar una sesión desde 🗂️ se restauran también la página
de pizarra activa y la conversación del asistente de esa sesión.

## 11. Cajón de recursos (panel inferior)

Las pestañas del riel izquierdo abren el cajón bajo el lienzo:

| Pestaña | Contenido |
|---|---|
| 📷 Capturas | Biblioteca de capturas (§5) |
| ∑ Fórmulas | Paleta: fórmulas del curso por categoría (Modelos/Covarianzas/Criterios) → **Insertar en pizarra**, copiar LaTeX o copiar el código R equivalente. **+ Nueva fórmula** para guardar las propias. |
| ▦ Matrices | Constructor de matrices de correlación/covarianza: estructura (CS, AR(1), UN, Toeplitz, ARH(1)…) con ρ ajustable, o edición celda a celda personalizada; vista previa KaTeX; insertar al lienzo o copiar como LaTeX/R. |
| 📝 Notas | Notas de texto por módulo, con exportar/importar JSON. |
| ❓ Preguntas | Registro en vivo de preguntas de estudiantes (checkbox de respondida; van al informe). |
| ⚖ Comparar | Tabla comparativa de modelos (AIC, BIC, logLik, df, ΔAIC). Empieza vacía: añade los ajustes reales que obtengas en R. |
| 🩺 Diagnóstico | Registro técnico de eventos (guardados, inserciones, errores). Útil si algo "no se guardó". |

## 12. Elementos técnicos: fórmulas, matrices y capturas sobre el lienzo

Lo que insertas desde la paleta/matrices/capturas llega al lienzo como
**tarjeta-imagen editable**:

- Se mueve, escala y borra como cualquier objeto Excalidraw.
- **Doble clic sobre una fórmula o matriz** reabre su editor con el contenido
  original: modifica y "Actualizar" re-renderiza el elemento **en la misma
  posición**. (Para texto nativo del lienzo, doble clic abre el editor de
  texto normal.)
- Los binarios se guardan con la página, así que sobreviven recargas y salen
  en los informes.

## 13. That_Board (proyector + lápiz IR) — opcional

Si el aula usa el hardware That_Board (cámara + lápiz infrarrojo):

1. Arranca el servicio de visión (Python) en la máquina del aula.
2. En la barra de sesión: **Calibrar** → toca las 4 cruces con el lápiz
   (~10 s).
3. Activa el **Modo puntero** en ⚙ para botones grandes.

Sin el servicio de visión, el botón muestra un aviso y la pizarra funciona
normal con ratón.

## 14. Atajos de teclado

| Atajo | Acción |
|---|---|
| `Ctrl+Shift+B` | Abrir/cerrar la pizarra |
| `Ctrl+Shift+S` | Capturar región de pantalla |
| `P` | Entrar/salir de modo presentación |
| `S` | Armar spotlight |
| `→` / `Espacio` / `PageDown` | Revelar siguiente paso (presentación) |
| `←` / `PageUp` | Retroceder paso |
| `Esc` | Desarmar spotlight → quitarlo → salir de presentación |
| `Ctrl+Z` / `Ctrl+Shift+Z` | Deshacer / rehacer en el lienzo |
| `7` | Lápiz (toolbar Excalidraw) |

(Los atajos se ignoran mientras escribes en un campo de texto.)

## 15. Dónde se guarda todo

| Datos | Lugar |
|---|---|
| Páginas del lienzo (+ imágenes) | IndexedDB `bb-scenes` (por módulo) |
| Sesiones, capturas, preguntas | IndexedDB `bb-session` |
| Chat del asistente (por sesión) | IndexedDB `bb-chat` |
| Ajustes (proveedor, tema, puntero) | IndexedDB `bb-settings` |
| Notas, paleta personalizada, paneles | localStorage |

**Borrar datos de sitio en el navegador borra la pizarra.** Para respaldo:
usa el PDF/MD por sesión; hay además *Exportar/Importar todo* (JSON de notas
y capturas) en la barra lateral del curso.

## 16. Resolución de problemas

| Síntoma | Acción |
|---|---|
| El asistente responde genérico / "simulado" | Falta configurar proveedor + API key en ⚙ (§8) |
| La IA no inserta fórmulas/R al lienzo | El proveedor debe soportar tool calls (DeepSeek u OpenAI); verifica modelo |
| WebR/ejecutar R lento la 1ª vez | Descarga del runtime: 10–30 s, solo la primera vez |
| Una captura falló | Aviso en pantalla; reduce la región y reintenta |
| "Algo no se guardó" | Abre 🩺 Diagnóstico: busca eventos rojos (`save-missed`, `insert-failed`) |
| Borrar datos de sitio en Chrome | Elimina pizarra, sesiones y ajustes — exporta antes el PDF |
| Múltiples pestañas con la misma clase | Usa rol 👨‍🏫 en una y 🎓 en las demás (§7) |
