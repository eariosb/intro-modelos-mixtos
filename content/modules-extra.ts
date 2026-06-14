import type { Module } from './types';

export const extraModules: Module[] = [
  {
    slug: 'lmm-basico',
    title: 'Módulo 4 · Modelos Lineales Mixtos básicos',
    description: 'Interpretación de interceptos y pendientes aleatorias en trayectorias clínicas.',
    lessons: [
      {
        slug: 'lmm-efectos-clinicos',
        title: 'LMM sobre trayectorias de crecimiento en SPRUCE1',
        objectives: [
          'Escribir formalmente un LMM con intercepto y pendiente aleatorios.',
          'Ajustar el modelo con lme4::lmer() y nlme::lme() sobre SPRUCE1.',
          'Interpretar efectos fijos, varianzas de componentes aleatorios y su correlación.',
          'Distinguir REML de ML y saber cuándo usar cada uno.',
          'Visualizar trayectorias individuales junto con la curva poblacional ajustada.',
        ],
        datasets: ['SPRUCE1 (crecimiento de abetos Sitka, Control vs Ozone)'],
        content: `
## De la exploración al modelo

En el Módulo 2 vimos los perfiles individuales de \`log_growth\` para los árboles de **SPRUCE1**: algunas trayectorias suben más rápido que otras, y el punto de partida ("intercepto") tampoco es el mismo para todos. Esa heterogeneidad **no es ruido que debamos ignorar** — es información que el modelo lineal mixto incorpora explícitamente.

Pensemos en una analogía clínica: si midiéramos la presión arterial de 30 pacientes una vez por mes durante un año, esperaríamos que (a) algunos pacientes partan con presiones basales distintas, y (b) algunos respondan más rápido al tratamiento que otros. Un LMM modela ambas fuentes de variación a la vez: la **tendencia promedio** (efectos fijos) y **cuánto se desvía cada individuo** de esa tendencia (efectos aleatorios).

## Especificación formal

Para el árbol (o paciente) $i$ en el tiempo $t$, el modelo con intercepto y pendiente aleatorios se escribe como:

$$
y_{it} = \\underbrace{\\beta_0 + \\beta_1\\, t + \\beta_2\\, \\text{Group}_i + \\beta_3\\, (t \\times \\text{Group}_i)}_{\\text{efectos fijos}} + \\underbrace{b_{0i} + b_{1i}\\, t}_{\\text{efectos aleatorios}} + \\varepsilon_{it}
$$

$$
\\begin{pmatrix} b_{0i} \\\\ b_{1i} \\end{pmatrix} \\sim N\\!\\left(\\begin{pmatrix}0\\\\0\\end{pmatrix}, \\begin{pmatrix}\\tau_0^2 & \\tau_{01} \\\\ \\tau_{01} & \\tau_1^2\\end{pmatrix}\\right), \\qquad \\varepsilon_{it} \\sim N(0, \\sigma^2)
$$

- $\\beta_0,\\dots,\\beta_3$: la curva **promedio poblacional** por grupo — lo que típicamente reportamos en un artículo.
- $b_{0i}, b_{1i}$: cuánto se aparta **el árbol/paciente $i$** del promedio de su grupo, en intercepto y en pendiente.
- $\\tau_0^2, \\tau_1^2$: varianza entre sujetos del intercepto y de la pendiente — **cuánta heterogeneidad hay**.
- $\\tau_{01}$: covarianza entre ambos — por ejemplo, ¿los árboles que parten más altos crecen también más rápido (covarianza positiva) o tienden a "emparejarse" con el tiempo (covarianza negativa)?
- $\\sigma^2$: varianza residual intra-sujeto, lo que el modelo no explica.

## REML vs ML: ¿cuál usar?

\`lmer()\` y \`lme()\` ajustan por **REML** (*Restricted Maximum Likelihood*) por defecto, que corrige el sesgo en la estimación de las varianzas — recomendado para **reportar el modelo final**. Sin embargo, REML no permite comparar modelos con **distintos efectos fijos** mediante pruebas de razón de verosimilitud; para eso (Módulo 8) se usa \`REML = FALSE\` (equivalente a ML).

## Notación en R: lme4 vs nlme

La fórmula \`log_growth ~ time_centered * Group + (time_centered | ID)\` en \`lme4\` es equivalente a separar la parte fija (\`fixed=\`) de la aleatoria (\`random=\`) en \`nlme::lme()\`. Ambas estiman el mismo modelo estadístico; difieren en la sintaxis y en algunas utilidades de diagnóstico (\`nlme\` facilita estructuras de covarianza residual, tema del Módulo 5).
`,
        processSteps: [
          {
            title: 'Explorar',
            description: 'Perfiles individuales y promedio (Módulo 2) para decidir qué efectos aleatorios tienen sentido.',
          },
          {
            title: 'Especificar',
            description: 'Escribir la fórmula: efectos fijos de interés (tiempo, grupo, interacción) + efectos aleatorios por sujeto.',
          },
          {
            title: 'Ajustar',
            description: 'lmer() o lme() con REML para obtener estimaciones insesgadas de las varianzas.',
          },
          {
            title: 'Interpretar',
            description: 'Leer primero los efectos fijos (tendencia poblacional), luego las varianzas/correlación de los aleatorios.',
          },
          {
            title: 'Validar',
            description: 'Diagnosticar residuos (Módulo 6) antes de confiar en las conclusiones.',
          },
        ],
        dataTables: [
          {
            caption: 'Equivalencia de sintaxis entre lme4 y nlme para el mismo LMM',
            columns: ['Elemento', 'lme4::lmer()', 'nlme::lme()'],
            rows: [
              ['Efectos fijos', 'log_growth ~ time_centered * Group', 'fixed = log_growth ~ time_centered * Group'],
              ['Efectos aleatorios', '(time_centered | ID)', 'random = ~ time_centered | ID'],
              ['Método de estimación', 'REML = TRUE (por defecto)', 'method = "REML" (por defecto)'],
              ['Varianza residual', 'sigma(modelo)^2', 'mod$sigma^2'],
              ['Matriz D (aleatorios)', 'VarCorr(modelo)', 'getVarCov(modelo)'],
            ],
          },
        ],
        callouts: [
          {
            type: 'tip',
            title: 'Tip: centrar el tiempo',
            content:
              'Centrar la variable de tiempo (time_centered = time1 - mean(time1)) hace que el intercepto se interprete como el valor esperado en el punto medio del estudio, y suele mejorar la convergencia del optimizador.',
          },
          {
            type: 'warning',
            title: 'Atención: advertencias de convergencia',
            content:
              'Si lmer() reporta "Model failed to converge", no descartes el resultado de inmediato: prueba reescalar variables, simplificar la estructura aleatoria (quitar la pendiente aleatoria) o cambiar el optimizador con lmerControl(optimizer = "bobyqa").',
          },
        ],
        rCells: [
          {
            id: 'spruce-load',
            title: 'Cargar SPRUCE1 y centrar el tiempo',
            code: `# Cargamos los paquetes necesarios (ya estan precargados en el entorno)
library(lme4)
library(ggplot2)
library(dplyr)

# Mismo dataset del Modulo 2: crecimiento de abetos Sitka
spruce <- read.csv("https://raw.githubusercontent.com/jcsalazaru/datasets/main/SPRUCE1.csv")

# Centramos el tiempo: el intercepto representara el punto medio del estudio
spruce <- spruce %>%
  mutate(ID = factor(ID),
         Group = factor(Group),
         time_centered = time1 - mean(time1))

str(spruce)
head(spruce, 8)`,
          },
          {
            id: 'spruce-lmer',
            title: 'Ajustar el LMM con lmer() (intercepto y pendiente aleatorios)',
            code: `library(lme4)

# Efectos fijos: tiempo, grupo y su interaccion
# Efectos aleatorios: intercepto y pendiente propios por arbol (ID)
mod_lmer <- lmer(
  log_growth ~ time_centered * Group + (time_centered | ID),
  data = spruce
)

# 1) Efectos fijos: tendencia promedio por grupo
# 2) Random effects: varianzas tau0^2, tau1^2 y su correlacion
# 3) Residual: sigma^2 (lo no explicado por el modelo)
summary(mod_lmer)

# Componentes de varianza por separado
VarCorr(mod_lmer)`,
          },
          {
            id: 'spruce-nlme-plot',
            title: 'Mismo modelo con nlme y curvas poblacionales por grupo',
            code: `library(nlme)
library(ggplot2)

# nlme separa la formula fija (fixed) de la aleatoria (random)
mod_lme <- lme(
  log_growth ~ time_centered * Group,
  random = ~ time_centered | ID,
  data = spruce
)

summary(mod_lme)

# Prediccion de la curva poblacional (sin efectos aleatorios, re.form = NA)
grid <- expand.grid(
  time_centered = seq(min(spruce$time_centered), max(spruce$time_centered), length.out = 60),
  Group = levels(spruce$Group)
)
grid$fit <- predict(mod_lmer, newdata = grid, re.form = NA)

ggplot() +
  geom_line(data = spruce, aes(time_centered, log_growth, group = ID, color = Group), alpha = 0.25) +
  geom_line(data = grid, aes(time_centered, fit, color = Group), linewidth = 1.4) +
  labs(title = "Trayectorias individuales (tenues) y curva poblacional (gruesa)",
       x = "Tiempo centrado", y = "log(crecimiento)") +
  theme_minimal()`,
          },
        ],
        sasExamples: [
          {
            title: 'Alternativa en SAS: PROC MIXED con intercepto y pendiente aleatorios',
            code: `/* Modelo equivalente: log_growth ~ time_centered * Group + (time_centered | ID) */
PROC MIXED DATA=spruce1 METHOD=REML COVTEST;
  CLASS id group;
  /* Efectos fijos: tiempo, grupo e interaccion */
  MODEL log_growth = time_centered group time_centered*group / SOLUTION DDFM=KENWARDROGER;
  /* Efectos aleatorios: intercepto y pendiente por arbol, matriz D sin restricciones (UN) */
  RANDOM INTERCEPT time_centered / SUBJECT=id TYPE=UN G GCORR;
RUN;

/* SOLUTION imprime los coeficientes de efectos fijos (beta0..beta3).
   G y GCORR imprimen la matriz D estimada y su correlacion (tau01). */`,
          },
        ],
        flashcards: [
          {
            front: '¿Qué representan los efectos fijos en un LMM?',
            back: 'La tendencia o relación promedio en la población (lo que normalmente se reporta e interpreta).',
          },
          {
            front: '¿Qué representan los efectos aleatorios?',
            back: 'Cuánto se desvía cada sujeto/unidad individual respecto al promedio poblacional, modelado como una distribución de varianzas.',
          },
          {
            front: '¿Qué es τ₀₁ (la covarianza entre intercepto y pendiente aleatorios)?',
            back: 'Indica si sujetos que parten más altos (o bajos) tienden también a crecer más rápido o más lento.',
          },
          {
            front: '¿Cuándo usar ML en lugar de REML?',
            back: 'Cuando se van a comparar modelos con distintos efectos fijos mediante pruebas de razón de verosimilitud (LRT).',
          },
        ],
        quiz: [
          {
            question: 'En el modelo log_growth ~ time_centered * Group + (time_centered | ID), ¿qué efecto es aleatorio?',
            options: [
              'El efecto de Group sobre log_growth',
              'El intercepto y la pendiente de time_centered, específicos de cada ID',
              'La interacción time_centered:Group',
              'Ninguno; todo el modelo es de efectos fijos',
            ],
            correctIndex: 1,
            explanation: 'Lo que está dentro del paréntesis, a la izquierda de "|", son los términos con efecto aleatorio por nivel de ID: intercepto (implícito) y time_centered.',
          },
          {
            question: '¿Por qué centramos time1 antes de ajustar el modelo?',
            options: [
              'Es obligatorio para que lmer() funcione',
              'Cambia el significado del efecto del grupo',
              'Mejora la interpretación del intercepto y la estabilidad numérica del ajuste',
              'Elimina la necesidad de efectos aleatorios',
            ],
            correctIndex: 2,
            explanation: 'Centrar el tiempo hace que el intercepto corresponda al punto medio del estudio (más interpretable) y suele facilitar la convergencia.',
          },
          {
            question: '¿Qué deberíamos usar para el modelo final que vamos a reportar?',
            options: ['ML', 'REML', 'Mínimos cuadrados ordinarios', 'No importa, dan lo mismo'],
            correctIndex: 1,
            explanation: 'REML corrige el sesgo en la estimación de los componentes de varianza y es el estándar para el modelo final que se reporta.',
          },
        ],
      },
    ],
  },
  {
    slug: 'estructuras-covarianza',
    title: 'Módulo 5 · Covarianza y correlación en LMM',
    description: 'Comparar estructuras CS, AR(1) y UN y entender la matriz de covarianza residual.',
    lessons: [
      {
        slug: 'estructuras-practicas',
        title: 'Elegir estructuras de covarianza a partir de datos reales',
        objectives: [
          'Diferenciar conceptualmente entre las estructuras CS, AR(1) y UN.',
          'Ajustar las tres estructuras sobre SPRUCE1 con nlme::lme().',
          'Elegir la estructura apropiada según el espaciamiento temporal y el número de ocasiones.',
          'Comparar modelos anidados con AIC/BIC y anova().',
          'Visualizar la matriz de correlación residual estimada.',
        ],
        datasets: ['SPRUCE1 (crecimiento de abetos Sitka, Control vs Ozone)'],
        content: `
## Más allá de la matriz D

En el Módulo 4 modelamos la heterogeneidad **entre sujetos** con efectos aleatorios (intercepto y pendiente). Pero todavía asumimos que, *dentro* de cada árbol, los residuos $\\varepsilon_{it}$ son independientes con varianza constante $\\sigma^2$. En datos longitudinales eso casi nunca es cierto: dos mediciones tomadas con una semana de diferencia suelen parecerse más entre sí que dos mediciones tomadas con un año de diferencia.

La **estructura de covarianza residual** modela justamente esa correlación intra-sujeto que los efectos aleatorios no capturan del todo. Elegir bien esta estructura mejora la eficiencia de las estimaciones y, sobre todo, evita errores estándar mal calculados (demasiado pequeños o demasiado grandes).

## Tres estructuras clásicas

Para un sujeto con $n$ ocasiones de medición, la matriz de correlación residual $R$ ($n \\times n$) puede especificarse de varias formas:

$$
R_{\\text{CS}} = \\begin{pmatrix} 1 & \\rho & \\rho & \\rho \\\\ \\rho & 1 & \\rho & \\rho \\\\ \\rho & \\rho & 1 & \\rho \\\\ \\rho & \\rho & \\rho & 1 \\end{pmatrix}
\\qquad
R_{\\text{AR1}} = \\begin{pmatrix} 1 & \\rho & \\rho^2 & \\rho^3 \\\\ \\rho & 1 & \\rho & \\rho^2 \\\\ \\rho^2 & \\rho & 1 & \\rho \\\\ \\rho^3 & \\rho^2 & \\rho & 1 \\end{pmatrix}
\\qquad
R_{\\text{UN}} = \\begin{pmatrix} 1 & \\rho_{12} & \\rho_{13} & \\rho_{14} \\\\ \\rho_{12} & 1 & \\rho_{23} & \\rho_{24} \\\\ \\rho_{13} & \\rho_{23} & 1 & \\rho_{34} \\\\ \\rho_{14} & \\rho_{24} & \\rho_{34} & 1 \\end{pmatrix}
$$

- **CS (Compound Symmetry / simetría compuesta):** una sola correlación $\\rho$ entre cualquier par de ocasiones, sin importar qué tan separadas estén. Es la estructura implícita de un modelo con solo intercepto aleatorio. Útil cuando los tiempos no son igualmente espaciados o cuando no hay razón para esperar que la correlación decaiga con la distancia.
- **AR(1) (autorregresiva de orden 1):** la correlación decae geométricamente con la distancia temporal — mediciones cercanas se parecen más que las lejanas. Apropiada cuando los tiempos de medición están **igualmente espaciados** y hay un proceso de "memoria corta".
- **UN (sin restricción / unstructured):** cada par de ocasiones tiene su propia correlación $\\rho_{jk}$, estimada libremente. Es la más flexible, pero requiere estimar $n(n-1)/2$ parámetros — solo viable con pocas ocasiones ($n \\le 5$ aprox.) y tamaños de muestra razonables.

## Cómo elegir en la práctica

1. Si las ocasiones de medición **no son equiespaciadas** o son pocas (≤4) y el tamaño muestral lo permite, **UN** suele ser la opción más informativa — y se puede comparar contra CS/AR1 con un LRT (requiere \`method = "ML"\`).
2. Si las ocasiones están equiespaciadas y son muchas, **AR(1)** es un punto de partida razonable y parsimonioso.
3. **CS** es el caso más simple y, de hecho, equivale a un modelo con solo intercepto aleatorio — útil como referencia ("modelo nulo de correlación").
4. La estructura de covarianza interactúa con los **efectos aleatorios**: si ya incluimos pendiente aleatoria, parte de la correlación temporal queda capturada allí, y una estructura residual más simple (CS) puede ser suficiente.
`,
        processSteps: [
          {
            title: 'Diagnosticar',
            description: 'Revisar los residuos del modelo del Módulo 4: ¿quedan patrones de correlación temporal sin explicar?',
          },
          {
            title: 'Proponer',
            description: 'Plantear 2-3 estructuras candidatas (CS, AR1, UN) compatibles con el diseño temporal del estudio.',
          },
          {
            title: 'Ajustar con ML',
            description: 'Reajustar cada candidata con method = "ML" para que los modelos sean comparables por verosimilitud.',
          },
          {
            title: 'Comparar',
            description: 'Usar AIC/BIC y anova() (LRT para modelos anidados) para elegir la estructura más parsimoniosa.',
          },
          {
            title: 'Reportar con REML',
            description: 'Reajustar el modelo elegido con REML (por defecto) para el reporte final de efectos fijos y varianzas.',
          },
        ],
        dataTables: [
          {
            caption: 'Comparación de estructuras de covarianza residual',
            columns: ['Estructura', 'Parámetros de correlación', 'Cuándo usarla', 'Código en nlme'],
            rows: [
              ['CS', '1 (ρ constante)', 'Tiempos no equiespaciados o pocas ocasiones; referencia simple', 'corCompSymm(form = ~ tiempo | ID)'],
              ['AR(1)', '1 (ρ, decae con la distancia)', 'Tiempos equiespaciados, muchas ocasiones', 'corAR1(form = ~ tiempo | ID)'],
              ['UN', 'n(n-1)/2', 'Pocas ocasiones (≤5), máxima flexibilidad', 'corSymm(form = ~ tiempo | ID)'],
            ],
          },
        ],
        callouts: [
          {
            type: 'info',
            title: 'Info: ML para comparar, REML para reportar',
            content: 'Al comparar estructuras de covarianza con anova() o AIC, ambos modelos deben ajustarse con method = "ML". Una vez elegida la estructura, reajusta con REML (el valor por defecto) para los resultados que vas a reportar.',
          },
          {
            type: 'tip',
            title: 'Tip: empieza simple',
            content: 'Si UN no converge o las estimaciones se ven inestables, no es un fracaso: vuelve a AR(1) o CS. Una estructura más simple que converge bien es preferible a una compleja que no.',
          },
        ],
        rCells: [
          {
            id: 'covar-models',
            title: 'Ajustar CS, AR(1) y UN sobre SPRUCE1',
            code: `# Cargamos los paquetes y los datos (mismo dataset del Modulo 4)
library(nlme)
library(dplyr)

spruce <- read.csv("https://raw.githubusercontent.com/jcsalazaru/datasets/main/SPRUCE1.csv")
spruce <- spruce %>%
  mutate(ID = factor(ID),
         Group = factor(Group),
         time_centered = time1 - mean(time1))

# Misma parte fija/aleatoria; cambia solo la estructura de correlacion residual.
# Ajustamos con method = "ML" para poder comparar por verosimilitud.
mod_cs <- lme(log_growth ~ time_centered * Group,
              random = ~ 1 | ID,
              correlation = corCompSymm(form = ~ time_centered | ID),
              data = spruce, method = "ML")

mod_ar1 <- update(mod_cs, correlation = corAR1(form = ~ time_centered | ID))
mod_un  <- update(mod_cs, correlation = corSymm(form = ~ time_centered | ID))

summary(mod_cs)
summary(mod_ar1)
summary(mod_un)`,
          },
          {
            id: 'covar-anova',
            title: 'Comparar AIC/BIC y prueba de razón de verosimilitud',
            code: `# anova() compara los tres modelos anidados (misma parte fija, distinta R)
anova(mod_cs, mod_ar1, mod_un)

# Tabla resumida solo con los criterios de informacion
data.frame(
  modelo = c("CS", "AR1", "UN"),
  AIC = c(AIC(mod_cs), AIC(mod_ar1), AIC(mod_un)),
  BIC = c(BIC(mod_cs), BIC(mod_ar1), BIC(mod_un))
)`,
          },
          {
            id: 'covar-heatmap',
            title: 'Visualizar la matriz de correlación residual (UN)',
            code: `library(ggplot2)

# Matriz de correlacion residual implicada por la estructura UN
cor_un <- corMatrix(mod_un$modelStruct$corStruct)[[1]]
cor_df <- as.data.frame(as.table(cor_un))
colnames(cor_df) <- c("Ocasion_i", "Ocasion_j", "Correlacion")

ggplot(cor_df, aes(Ocasion_i, Ocasion_j, fill = Correlacion)) +
  geom_tile() +
  geom_text(aes(label = round(Correlacion, 2)), color = "white", size = 3) +
  scale_fill_gradient(low = "#2c7a7b", high = "#1a365d") +
  labs(title = "Matriz de correlacion residual estimada (UN)") +
  theme_minimal()`,
          },
        ],
        sasExamples: [
          {
            title: 'Alternativa en SAS: REPEATED con distintas estructuras TYPE=',
            code: `/* Mismo modelo, cambiando solo la estructura de covarianza residual.
   Comparar con: data _null_; set work._aic_bic_; run; o revisar las
   tablas "Fit Statistics" de cada PROC MIXED. */

/* Compound symmetry */
PROC MIXED DATA=spruce1 METHOD=ML;
  CLASS id group;
  MODEL log_growth = time_centered group time_centered*group / SOLUTION;
  REPEATED / SUBJECT=id TYPE=CS;
RUN;

/* Autorregresiva de orden 1 */
PROC MIXED DATA=spruce1 METHOD=ML;
  CLASS id group;
  MODEL log_growth = time_centered group time_centered*group / SOLUTION;
  REPEATED / SUBJECT=id TYPE=AR(1);
RUN;

/* Sin restriccion (UN) */
PROC MIXED DATA=spruce1 METHOD=ML;
  CLASS id group;
  MODEL log_growth = time_centered group time_centered*group / SOLUTION;
  REPEATED / SUBJECT=id TYPE=UN;
RUN;

/* La tabla "Fit Statistics" (-2 Log Likelihood, AIC, BIC) de cada
   PROC permite comparar las tres estructuras. */`,
          },
        ],
        flashcards: [
          {
            front: '¿Qué problema resuelve una estructura de covarianza residual?',
            back: 'Modela la correlación entre mediciones repetidas del mismo sujeto que no quedó capturada por los efectos aleatorios, evitando errores estándar mal calculados.',
          },
          {
            front: '¿Cuándo conviene usar AR(1) en lugar de CS?',
            back: 'Cuando las ocasiones de medición están igualmente espaciadas y se espera que la correlación decaiga con la distancia temporal.',
          },
          {
            front: '¿Cuál es la desventaja principal de la estructura UN?',
            back: 'Requiere estimar n(n-1)/2 parámetros de correlación, lo que solo es viable con pocas ocasiones y muestras suficientemente grandes.',
          },
          {
            front: '¿Con qué método de estimación se deben comparar estructuras de covarianza distintas?',
            back: 'Con ML (no REML), porque REML no permite comparar modelos que difieren en la parte de varianza/covarianza mediante LRT de forma estándar entre estructuras con distinta parametrización.',
          },
        ],
        quiz: [
          {
            question: '¿Qué representa el parámetro ρ en la estructura CS?',
            options: [
              'La varianza residual total',
              'Una correlación constante entre cualquier par de ocasiones del mismo sujeto',
              'La pendiente promedio en el tiempo',
              'El número de ocasiones de medición',
            ],
            correctIndex: 1,
            explanation: 'CS (Compound Symmetry) asume que todas las observaciones del mismo sujeto están igualmente correlacionadas, sin importar la distancia temporal entre ellas.',
          },
          {
            question: 'Un estudio mide a cada paciente en 8 ocasiones igualmente espaciadas. ¿Qué estructura sería un buen punto de partida parsimonioso?',
            options: ['UN', 'AR(1)', 'Ninguna; siempre usar CS', 'Una estructura distinta para cada paciente'],
            correctIndex: 1,
            explanation: 'Con muchas ocasiones equiespaciadas, AR(1) captura el decaimiento de la correlación con la distancia usando un solo parámetro, evitando los n(n-1)/2 parámetros de UN.',
          },
          {
            question: 'Para comparar mod_cs, mod_ar1 y mod_un con anova() de forma válida, ¿qué deben tener en común?',
            options: [
              'Deben tener distintos efectos fijos',
              'Deben ajustarse con method = "ML" y la misma parte fija',
              'Deben tener distintos datasets',
              'No es necesario que compartan nada',
            ],
            correctIndex: 1,
            explanation: 'Para comparar verosimilitudes con LRT/AIC necesitamos modelos anidados ajustados con ML y la misma especificación de efectos fijos; solo cambia la estructura de R.',
          },
        ],
      },
    ],
  },
  {
    slug: 'diagnostico',
    title: 'Módulo 6 · Diagnóstico con residuos simulados (DHARMa)',
    description: 'Residuos simulados para validar supuestos, detectar outliers y documentar desviaciones del modelo.',
    lessons: [
      {
        slug: 'diagnostico-hormonas',
        title: 'Residuos simulados en datos de progesterona',
        objectives: [
          'Ajustar un LMM con pendiente aleatoria sobre datos hormonales.',
          'Explicar por qué los residuos "crudos" de un LMM son difíciles de interpretar.',
          'Generar y leer los residuos simulados de DHARMa (QQ-plot, residual vs. ajustado).',
          'Aplicar pruebas formales de uniformidad, dispersión y outliers.',
          'Documentar hallazgos diagnósticos con recomendaciones claras para el equipo clínico.',
        ],
        datasets: ['progesterone (concentraciones hormonales por ciclo menstrual)'],
        content: `
## ¿Por qué no basta con mirar los residuos "a mano"?

En un modelo de regresión simple, revisar residuos es sencillo: residuo vs. ajustado, QQ-plot, listo. En un LMM la historia es más compleja porque hay **dos fuentes de variación** (efectos aleatorios y residual) y los residuos "crudos" ($y_{it} - \\hat y_{it}$) no siempre siguen una distribución conocida de forma simple, especialmente con tamaños de muestra pequeños o estructuras de covarianza complejas.

El paquete **DHARMa** (*Diagnostics for HierARchical Models*) resuelve esto con **residuos simulados**: simula muchas réplicas de la respuesta a partir del modelo ajustado, y compara dónde cae el valor observado dentro de esa distribución simulada. El resultado es un residuo con una interpretación **uniforme(0,1)** bajo un modelo correcto — sin importar la complejidad del LMM/GLMM subyacente.

## El dataset de progesterona

Los niveles de progesterona (\`logp\`) siguen una curva característica a lo largo del ciclo menstrual: bajos en la fase folicular, con un pico marcado tras la ovulación. Ajustamos un LMM con \`time\` y \`group\` (por ejemplo, mujeres con anovulación vs. ciclos normales) como efectos fijos, y un intercepto y pendiente aleatorios por mujer.

## Qué mirar en los gráficos de DHARMa

\`plot(sim)\` produce dos paneles clave:

- **QQ-plot de residuos uniformes:** si el modelo es adecuado, los puntos deben caer sobre la línea diagonal. Desviaciones sistemáticas sugieren mala especificación de la distribución o de la parte sistemática del modelo.
- **Residual vs. predicho:** busca patrones (curvas, abanicos). Un patrón en forma de abanico sugiere **heterocedasticidad** no modelada; una curva sugiere que falta un término no lineal (por ejemplo, un spline — Módulo 9).

Las pruebas formales complementan la inspección visual:

- \`testUniformity()\`: prueba de Kolmogorov-Smirnov sobre los residuos simulados — un valor p pequeño indica que no siguen Uniforme(0,1).
- \`testDispersion()\`: compara la varianza observada con la simulada — detecta sobre/sub-dispersión.
- \`testOutliers()\`: identifica observaciones que caen fuera del rango de las simulaciones (outliers "DHARMa").

## De los gráficos a las recomendaciones

Un diagnóstico no termina en "el modelo está mal" o "el modelo está bien": el valor clínico está en traducir los hallazgos en **acciones concretas** — ¿agregar un término no lineal?, ¿revisar una observación específica con el equipo clínico?, ¿reportar el hallazgo como limitación si no afecta las conclusiones principales?
`,
        processSteps: [
          {
            title: 'Ajustar',
            description: 'Especificar y ajustar el LMM con la estructura de efectos fijos/aleatorios que mejor representa el diseño del estudio.',
          },
          {
            title: 'Simular',
            description: 'simulateResiduals() genera réplicas de la respuesta bajo el modelo ajustado (típicamente 250-1000 simulaciones).',
          },
          {
            title: 'Inspeccionar',
            description: 'plot(sim) para revisar el QQ-plot y el patrón de residuos vs. predichos.',
          },
          {
            title: 'Probar formalmente',
            description: 'testUniformity(), testDispersion() y testOutliers() para cuantificar las desviaciones observadas.',
          },
          {
            title: 'Documentar',
            description: 'Traducir cada hallazgo en una recomendación: ajustar el modelo, revisar un dato puntual, o reportar como limitación.',
          },
        ],
        dataTables: [
          {
            caption: 'Guía rápida de interpretación de las pruebas DHARMa',
            columns: ['Función', 'Qué evalúa', 'Valor p pequeño sugiere', 'Posible acción'],
            rows: [
              ['testUniformity()', 'Los residuos simulados siguen U(0,1)', 'Mala especificación de la distribución o la media', 'Revisar familia/enlace, agregar términos no lineales'],
              ['testDispersion()', 'Varianza observada vs. simulada', 'Sobre/sub-dispersión', 'Agregar efecto aleatorio adicional o término de dispersión'],
              ['testOutliers()', 'Observaciones fuera del rango simulado', 'Presencia de outliers influyentes', 'Inspeccionar esos sujetos/observaciones con el equipo clínico'],
            ],
          },
        ],
        callouts: [
          {
            type: 'info',
            title: 'Info: ¿cuántas simulaciones?',
            content: 'n = 250 suele ser suficiente para exploración rápida; para el reporte final usa n = 1000 o más, así las pruebas (KS, dispersión) son más estables y reproducibles.',
          },
          {
            type: 'warning',
            title: 'Atención: un "p < 0.05" no es un veredicto automático',
            content: 'Con tamaños de muestra grandes, testUniformity() puede dar p pequeño ante desviaciones triviales. Combina siempre la prueba formal con la inspección visual y el juicio clínico sobre la magnitud del problema.',
          },
        ],
        rCells: [
          {
            id: 'progesterone-lmm',
            title: 'Ajustar el LMM y graficar las trayectorias',
            code: `# Cargamos paquetes y datos
library(lme4)
library(ggplot2)
library(dplyr)

prog <- read.csv("https://raw.githubusercontent.com/jcsalazaru/datasets/main/progesterone.csv")
prog <- prog %>%
  mutate(logp  = as.numeric(gsub(",", ".", logp)),
         id    = factor(id),
         group = factor(group))

# LMM con intercepto y pendiente aleatorios por mujer (id)
mod_prog <- lmer(logp ~ time * group + (time | id), data = prog)
summary(mod_prog)

# Trayectorias observadas con tendencia lineal por grupo
ggplot(prog, aes(time, logp, color = group)) +
  geom_point(alpha = 0.4) +
  geom_smooth(method = "lm", se = FALSE) +
  labs(title = "Progesterona observada por grupo", x = "Tiempo", y = "log(progesterona)") +
  theme_minimal()`,
          },
          {
            id: 'progesterone-dharma',
            title: 'Generar y graficar los residuos simulados',
            code: `library(DHARMa)

# Simulamos 500 replicas de la respuesta bajo el modelo ajustado
sim <- simulateResiduals(mod_prog, n = 500)

# QQ-plot (izquierda) + residuos vs. predicho (derecha)
plot(sim)`,
          },
          {
            id: 'progesterone-tests',
            title: 'Pruebas formales: uniformidad, dispersión y outliers',
            code: `# Cada prueba devuelve un estadistico y un valor p
testUniformity(sim)
testDispersion(sim)
testOutliers(sim)

# Residuos vs. una covariable especifica (ej. tiempo): util para
# detectar heterocedasticidad o falta de ajuste en una variable concreta
plotResiduals(sim, form = prog$time)`,
          },
        ],
        sasExamples: [
          {
            title: 'Alternativa en SAS: PROC MIXED + diagnóstico de residuos',
            code: `/* SAS no tiene un equivalente directo a los residuos simulados de
   DHARMa; el diagnostico tradicional se basa en residuos
   condicionales/marginales y graficos de RESIDUAL. */
PROC MIXED DATA=progesterone1 METHOD=ML PLOTS=ALL;
  CLASS id group;
  MODEL logp = time group time*group / SOLUTION OUTPREDM=preds RESIDUAL;
  RANDOM INTERCEPT time / SUBJECT=id TYPE=UN;
RUN;

/* PLOTS=ALL genera paneles de residuos vs. predicho y QQ-plot de
   residuos estudentizados, analogos (aunque no identicos) a los
   paneles de plot(sim) en DHARMa. */`,
          },
        ],
        flashcards: [
          {
            front: '¿Qué problema resuelven los "residuos simulados" de DHARMa?',
            back: 'Convierten los residuos de cualquier LMM/GLMM (sin importar su complejidad) en valores con distribución Uniforme(0,1) bajo un modelo correcto, facilitando un diagnóstico estandarizado.',
          },
          {
            front: '¿Qué patrón en "residual vs. predicho" sugiere heterocedasticidad no modelada?',
            back: 'Un patrón en forma de abanico (la dispersión de los residuos cambia sistemáticamente con el valor predicho).',
          },
          {
            front: '¿Qué mide testDispersion()?',
            back: 'Compara la varianza observada de los residuos con la varianza esperada bajo el modelo simulado, para detectar sobre- o sub-dispersión.',
          },
          {
            front: '¿Por qué no basta con un valor p significativo para decidir que "el modelo está mal"?',
            back: 'Con muestras grandes, pequeñas desviaciones pueden producir p-valores muy bajos sin ser clínicamente relevantes; hay que combinar la prueba con inspección visual y juicio clínico.',
          },
        ],
        quiz: [
          {
            question: '¿Qué distribución deberían seguir los residuos simulados de DHARMa si el modelo es correcto?',
            options: ['Normal estándar', 'Uniforme(0,1)', 'Chi-cuadrado', 't de Student'],
            correctIndex: 1,
            explanation: 'DHARMa reescala los residuos para que, bajo un modelo correctamente especificado, se distribuyan como Uniforme(0,1), sin importar la familia/distribución original del modelo.',
          },
          {
            question: 'En plotResiduals(sim, form = prog$time), ¿qué estamos evaluando?',
            options: [
              'Si el modelo converge más rápido con el tiempo',
              'Si hay un patrón de los residuos respecto a la variable time que el modelo no capturó',
              'El número de observaciones por valor de time',
              'La correlación entre time y group',
            ],
            correctIndex: 1,
            explanation: 'Graficar los residuos simulados contra una covariable específica ayuda a detectar falta de ajuste o heterocedasticidad asociada a esa variable en particular.',
          },
          {
            question: 'testOutliers(sim) señala varias observaciones como outliers. ¿Cuál es la mejor primera acción?',
            options: [
              'Eliminarlas automáticamente del dataset',
              'Ignorarlas porque DHARMa siempre detecta outliers',
              'Inspeccionarlas individualmente y discutir su plausibilidad clínica antes de decidir qué hacer',
              'Cambiar inmediatamente a un modelo no paramétrico',
            ],
            correctIndex: 2,
            explanation: 'Un outlier estadístico no es automáticamente un error de datos; antes de cualquier acción (corregir, excluir, o dejarlo) se debe revisar su plausibilidad clínica con el equipo correspondiente.',
          },
        ],
      },
    ],
  },
  {
    slug: 'glmm',
    title: 'Módulo 7 · GLMM binomial y Poisson',
    description: 'Familias binomial y Poisson para respuestas no gaussianas con efectos aleatorios.',
    lessons: [
      {
        slug: 'glmm-binario-poisson',
        title: 'Infección ungueal (binomial) y eventos de coldfeet (Poisson)',
        objectives: [
          'Explicar por qué un LMM no es apropiado para respuestas binarias o de conteo.',
          'Especificar un GLMM binomial con intercepto aleatorio (TOENAIL2).',
          'Interpretar coeficientes en la escala logit como odds ratios (OR).',
          'Especificar un GLMM de Poisson con offset para modelar tasas (Coldfeet).',
          'Distinguir la interpretación condicional (por sujeto) de la marginal (poblacional).',
        ],
        datasets: ['TOENAIL2 (infección ungueal, respuesta binaria)', 'Coldfeet (conteos de eventos por centro)'],
        content: `
## Cuando la respuesta no es continua

Los modelos del Módulo 4-6 asumen que, condicional en los efectos aleatorios, la respuesta es **aproximadamente normal** con varianza constante. Esto deja de ser razonable cuando la respuesta es:

- **Binaria** (presencia/ausencia de infección, éxito/fracaso de un tratamiento) → distribución **Bernoulli/binomial**.
- **De conteo** (número de eventos en un periodo) → distribución **Poisson** (o binomial negativa si hay sobredispersión).

Un **GLMM** (*Generalized Linear Mixed Model*) extiende el LMM agregando dos ingredientes: una **familia de distribución** apropiada para la respuesta, y una **función de enlace** $g(\\cdot)$ que conecta el predictor lineal con la media de esa distribución:

$$
g(E[y_{it} \\mid b_i]) = \\beta_0 + \\beta_1 \\, \\text{tiempo}_{it} + \\beta_2 \\, \\text{trat}_i + \\dots + b_{0i}
$$

## Caso 1: infección ungueal (binomial)

\`TOENAIL2\` registra, en visitas repetidas, si la infección ungueal sigue presente ($y=1$) o no ($y=0$) para cada paciente bajo dos tratamientos antifúngicos. Con enlace **logit**:

$$
\\text{logit}\\big(P(y_{it}=1 \\mid b_{0i})\\big) = \\log\\left(\\frac{P(y_{it}=1)}{1-P(y_{it}=1)}\\right) = \\beta_0 + \\beta_1 \\, \\text{time}_{it} + \\beta_2 \\, \\text{treat}_i + \\beta_3 (\\text{time} \\times \\text{treat}) + b_{0i}
$$

Exponenciando un coeficiente $\\beta_k$ obtenemos un **odds ratio (OR)**: $e^{\\beta_2}$ es el OR de seguir infectado para el tratamiento vs. el control, **para un paciente dado** (interpretación condicional, "a nivel de paciente").

## Caso 2: eventos de coldfeet (Poisson con offset)

\`Coldfeet\` registra el número de eventos $y$ observados en $n$ pacientes por centro y tratamiento. Para modelar una **tasa** (eventos por paciente) en lugar de un conteo crudo, usamos un **offset**:

$$
\\log(E[y_{ij}]) = \\log(n_{ij}) + \\beta_0 + \\beta_1 \\, \\text{treat}_j + b_{0i}
$$

El término $\\log(n_{ij})$ se fija con coeficiente 1 (el \`offset()\`), de modo que $\\beta_1$ se interpreta sobre la **tasa** $y_{ij}/n_{ij}$, no sobre el conteo crudo. Exponenciando $\\beta_1$ obtenemos un **rate ratio (RR)**: cuántas veces más (o menos) frecuente es el evento bajo tratamiento, por centro.

## Condicional vs. marginal: una distinción clave

En GLMM, el efecto aleatorio entra **dentro** de la función de enlace (no de forma aditiva en la escala de la respuesta, como en un LMM). Esto tiene una consecuencia importante: los coeficientes de un GLMM son **condicionales** — "para un paciente/centro dado, fijado su efecto aleatorio" — y **no son directamente comparables** con los coeficientes de un modelo marginal (GEE, Módulo 10), que describen el efecto **promedio en la población**. Ambas interpretaciones son válidas; lo importante es no mezclarlas al comunicar resultados.
`,
        processSteps: [
          {
            title: 'Identificar la distribución',
            description: 'Binaria/proporción → binomial; conteos → Poisson (revisar sobredispersión); ambas con enlace canónico (logit / log).',
          },
          {
            title: 'Especificar el offset (si aplica)',
            description: 'Para modelar tasas en datos de conteo, incluir offset(log(n)) con el denominador apropiado (tiempo, número de sujetos, etc.).',
          },
          {
            title: 'Ajustar con glmer()',
            description: 'glmer(y ~ ... + (1 | grupo), family = binomial()/poisson()) — por defecto usa aproximación de Laplace.',
          },
          {
            title: 'Exponenciar e interpretar',
            description: 'exp(coef) para obtener OR (binomial) o RR (Poisson); recordar que son interpretaciones condicionales.',
          },
          {
            title: 'Revisar sobredispersión',
            description: 'En Poisson, comparar varianza residual observada vs. esperada (DHARMa, Módulo 6); considerar binomial negativa si hay sobredispersión marcada.',
          },
        ],
        dataTables: [
          {
            caption: 'De LMM a GLMM: qué cambia según el tipo de respuesta',
            columns: ['Tipo de respuesta', 'Familia', 'Función de enlace', 'Interpretación de exp(β)', 'Ejemplo'],
            rows: [
              ['Continua', 'gaussian', 'identidad', 'Cambio aditivo en la media', 'log_growth (Módulo 4)'],
              ['Binaria / proporción', 'binomial', 'logit', 'Odds ratio (OR)', 'TOENAIL2 (infección sí/no)'],
              ['Conteo', 'poisson', 'log', 'Rate ratio (RR)', 'Coldfeet (eventos por centro)'],
            ],
          },
        ],
        callouts: [
          {
            type: 'tip',
            title: 'Tip: el offset no es un efecto fijo cualquiera',
            content: 'offset(log(n)) entra en el modelo con coeficiente fijo igual a 1 — no se estima. Su función es trasladar el modelo de "conteo crudo" a "tasa por unidad de exposición".',
          },
          {
            type: 'warning',
            title: 'Atención: condicional ≠ marginal',
            content: 'Un OR de un GLMM ("para un paciente dado") y un OR de un modelo marginal/GEE ("en promedio en la población") pueden diferir en magnitud, especialmente con varianza entre sujetos grande. No los presentes como si fueran intercambiables.',
          },
        ],
        rCells: [
          {
            id: 'toenail-glmm',
            title: 'GLMM binomial con TOENAIL2',
            code: `# Cargamos paquetes y datos
library(lme4)
library(dplyr)

toenail <- read.csv("https://raw.githubusercontent.com/jcsalazaru/datasets/main/toenail2.csv")
toenail <- toenail %>%
  mutate(idnew  = factor(idnew),
         treatn = factor(treatn),
         y      = as.integer(y))

# Intercepto aleatorio por paciente; enlace logit (familia binomial)
mod_bin <- glmer(
  y ~ time * treatn + (1 | idnew),
  data = toenail, family = binomial(link = "logit")
)
summary(mod_bin)

# Odds ratios: exponenciamos los coeficientes de efectos fijos
exp(fixef(mod_bin))`,
          },
          {
            id: 'coldfeet-poisson',
            title: 'GLMM de Poisson con offset para tasas por centro',
            code: `library(lme4)

coldfeet <- read.csv("https://raw.githubusercontent.com/jcsalazaru/datasets/main/coldfeet.csv")
coldfeet <- coldfeet %>%
  mutate(center = factor(center),
         treat  = factor(treat),
         y      = as.integer(y),
         n      = as.integer(n))

# offset(log(n)): modelamos la tasa y/n, no el conteo crudo
mod_count <- glmer(
  y ~ treat + (1 | center) + offset(log(n)),
  data = coldfeet, family = poisson(link = "log")
)
summary(mod_count)

# Rate ratios: exponenciamos los coeficientes
exp(fixef(mod_count))`,
          },
          {
            id: 'glmm-predicciones',
            title: 'Tasas predichas por tratamiento (Coldfeet)',
            code: `library(ggplot2)

# Predecimos en la escala de la respuesta (tasa), fijando n = 1
new_data <- data.frame(treat = levels(coldfeet$treat), n = 1)
new_data$rate_pred <- predict(mod_count, newdata = new_data, re.form = NA, type = "response")

ggplot(new_data, aes(treat, rate_pred)) +
  geom_col(fill = "#2c7a7b") +
  labs(title = "Tasa predicha de eventos por tratamiento",
       x = "Tratamiento", y = "Tasa predicha (eventos por paciente)") +
  theme_minimal()`,
          },
        ],
        sasExamples: [
          {
            title: 'Alternativa en SAS: PROC GLIMMIX',
            code: `/* GLMM binomial: equivalente a glmer(y ~ time*treatn + (1|idnew), family=binomial) */
PROC GLIMMIX DATA=toenail2;
  CLASS idnew treatn;
  MODEL y(EVENT='1') = time treatn time*treatn / SOLUTION DIST=BINARY LINK=LOGIT;
  RANDOM INTERCEPT / SUBJECT=idnew;
RUN;

/* GLMM de Poisson con offset: equivalente a
   glmer(y ~ treat + (1|center) + offset(log(n)), family=poisson) */
PROC GLIMMIX DATA=coldfeet;
  CLASS center treat;
  MODEL y = treat / SOLUTION DIST=POISSON LINK=LOG OFFSET=logn;
  RANDOM INTERCEPT / SUBJECT=center;
RUN;

/* logn debe crearse previamente como logn = log(n); */`,
          },
        ],
        flashcards: [
          {
            front: '¿Qué dos ingredientes añade un GLMM respecto a un LMM?',
            back: 'Una familia de distribución apropiada para la respuesta (binomial, Poisson, etc.) y una función de enlace que conecta el predictor lineal con la media de esa distribución.',
          },
          {
            front: '¿Cómo se interpreta exp(β) en un GLMM binomial con enlace logit?',
            back: 'Como un odds ratio (OR): cuántas veces cambian las probabilidades (odds) de la respuesta por unidad de cambio en la covariable, para un sujeto dado.',
          },
          {
            front: '¿Para qué sirve offset(log(n)) en un GLMM de Poisson?',
            back: 'Para modelar una tasa (eventos por unidad de exposición n) en lugar del conteo crudo, sin estimar un coeficiente adicional para n.',
          },
          {
            front: '¿Por qué los coeficientes de un GLMM se llaman "condicionales"?',
            back: 'Porque se interpretan fijando el efecto aleatorio de un sujeto/centro particular ("para ese sujeto"), a diferencia de los modelos marginales que describen el efecto promedio poblacional.',
          },
        ],
        quiz: [
          {
            question: 'TOENAIL2 registra si la infección sigue presente (1) o no (0) en cada visita. ¿Qué familia y enlace son apropiados?',
            options: ['gaussian / identidad', 'binomial / logit', 'poisson / log', 'binomial / log'],
            correctIndex: 1,
            explanation: 'Una respuesta binaria repetida se modela con familia binomial y enlace logit, lo que permite interpretar los efectos como odds ratios.',
          },
          {
            question: 'En el modelo de Coldfeet, ¿qué representa exp(β_treat)?',
            options: [
              'La diferencia absoluta en el número de eventos',
              'El rate ratio: cuántas veces más frecuente es el evento bajo tratamiento vs. control, por centro',
              'La probabilidad de tener al menos un evento',
              'La varianza del efecto aleatorio de centro',
            ],
            correctIndex: 1,
            explanation: 'Con enlace log y offset, exp(β_treat) es un rate ratio: compara la tasa de eventos entre tratamiento y control, para un centro dado.',
          },
          {
            question: 'Un colega dice que el OR de un GLMM y el OR de un modelo GEE para la misma pregunta "deberían ser idénticos". ¿Qué les responderías?',
            options: [
              'Tiene razón, ambos modelos siempre dan el mismo OR',
              'No necesariamente: el GLMM da un OR condicional (por sujeto) y el GEE un OR marginal (poblacional); pueden diferir, especialmente con varianza entre sujetos grande',
              'El GEE no produce odds ratios',
              'El GLMM nunca produce odds ratios',
            ],
            correctIndex: 1,
            explanation: 'La interpretación condicional (GLMM) y marginal (GEE) responden preguntas distintas y pueden producir magnitudes distintas; la elección depende de la pregunta de interés (Módulo 10).',
          },
        ],
      },
    ],
  },
  {
    slug: 'seleccion-modelos',
    title: 'Módulo 8 · Comparación y selección de modelos',
    description: 'Uso de AIC/BIC y pruebas de razón de verosimilitud para elegir entre especificaciones anidadas.',
    lessons: [
      {
        slug: 'comparacion-modelos',
        title: 'Tabla de criterios y pruebas de razón de verosimilitud',
        objectives: [
          'Diferenciar comparaciones de efectos fijos vs. efectos aleatorios y su requisito de ML.',
          'Calcular y comparar AIC, BIC y logLik para varias especificaciones anidadas.',
          'Aplicar e interpretar una prueba de razón de verosimilitud (LRT) con anova().',
          'Reconocer el problema del "boundary" al probar componentes de varianza.',
          'Comunicar al equipo clínico por qué se elige un modelo y no otro.',
        ],
        datasets: ['SPRUCE1 (crecimiento de abetos Sitka, Control vs Ozone)'],
        content: `
## La pregunta detrás de la selección de modelos

Hasta ahora hemos construido modelos cada vez más ricos: efectos fijos, efectos aleatorios, estructuras de covarianza. La pregunta natural es: **¿vale la pena toda esa complejidad?** Un modelo más complejo siempre se ajusta al menos igual de bien a los datos observados (en términos de verosimilitud), pero puede estar **sobreajustando** — capturando ruido en lugar de señal — y dificulta la interpretación.

AIC, BIC y el LRT son tres formas de responder "¿el ajuste extra justifica la complejidad extra?", cada una con su propia penalización.

## AIC, BIC y logLik

$$
\\text{AIC} = -2\\,\\log L + 2k \\qquad \\text{BIC} = -2\\,\\log L + k \\log(n)
$$

donde $\\log L$ es la log-verosimilitud del modelo, $k$ el número de parámetros estimados y $n$ el tamaño de muestra. Ambos criterios premian un mejor ajuste (mayor $\\log L$) pero penalizan más parámetros; **BIC penaliza más fuerte** cuando $n$ es grande, por lo que tiende a favorecer modelos más simples que AIC. **Menor valor = mejor**, en ambos casos.

## La prueba de razón de verosimilitud (LRT)

Para dos modelos **anidados** (el más simple es un caso particular del más complejo, fijando algunos parámetros en valores específicos, típicamente 0), la LRT compara:

$$
\\Lambda = -2(\\log L_{\\text{simple}} - \\log L_{\\text{complejo}}) \\;\\sim\\; \\chi^2_{df}
$$

donde $df$ es la diferencia en número de parámetros. \`anova(mod_simple, mod_complex)\` calcula automáticamente $\\Lambda$, los $df$ y el valor p asociado.

## Efectos fijos vs. efectos aleatorios: ¡requiere ML!

**Importante:** REML produce estimaciones de varianza insesgadas, pero las verosimilitudes REML de modelos con **distinta parte fija** no son comparables. Por eso, para comparar modelos que difieren en sus **efectos fijos** (p. ej. ¿agregar la interacción tiempo×grupo?), deben reajustarse con \`REML = FALSE\` antes de aplicar AIC/BIC/LRT. Una vez seleccionada la parte fija, el modelo final se reajusta con REML (por defecto) para reportar.

## El problema del "boundary" al probar varianzas aleatorias

Cuando la hipótesis nula es que una **varianza de efecto aleatorio es cero** (p. ej. ¿necesitamos la pendiente aleatoria, o $\\tau_1^2 = 0$ basta?), el valor nulo está en el **borde** del espacio de parámetros (las varianzas no pueden ser negativas). Esto hace que la distribución $\\chi^2$ estándar del LRT sea **conservadora** — el valor p real es aproximadamente la mitad del que reporta \`anova()\`. En la práctica, esto rara vez cambia la decisión cuando el LRT ya es claramente significativo o claramente no significativo, pero vale la pena tenerlo presente en casos límite.

## De la tabla de criterios a la decisión

Una buena práctica es construir una **tabla de candidatos** (modelo, AIC, BIC, logLik, número de parámetros) y razonar en conjunto: si AIC y BIC coinciden en el ganador, la decisión es más robusta. Si discrepan, prioriza el criterio que mejor refleje tu objetivo (BIC si priorizas parsimonia/interpretabilidad; AIC si priorizas predicción).
`,
        processSteps: [
          {
            title: 'Definir candidatos anidados',
            description: 'Listar especificaciones que difieren en un solo aspecto a la vez (una pendiente aleatoria, una interacción, una covariable).',
          },
          {
            title: 'Reajustar con ML',
            description: 'Si los modelos difieren en efectos fijos, reajustar todos con REML = FALSE para que las verosimilitudes sean comparables.',
          },
          {
            title: 'Calcular AIC/BIC/logLik',
            description: 'Construir una tabla comparativa con AIC(), BIC() y logLik() para cada candidato.',
          },
          {
            title: 'Aplicar LRT donde corresponda',
            description: 'anova(mod_simple, mod_complex) para pares anidados; recordar la cautela del "boundary" en varianzas.',
          },
          {
            title: 'Reajustar el ganador con REML',
            description: 'Una vez elegida la especificación final, reajustar con REML (por defecto) para el reporte de efectos fijos y varianzas.',
          },
        ],
        dataTables: [
          {
            caption: 'Criterios de selección: qué penalizan y cuándo usarlos',
            columns: ['Criterio', 'Penalización', 'Tiende a favorecer', 'Requiere modelos anidados'],
            rows: [
              ['AIC', '2 × número de parámetros (k)', 'Modelos algo más complejos (mejor predicción)', 'No'],
              ['BIC', 'log(n) × k (más fuerte si n es grande)', 'Modelos más parsimoniosos', 'No'],
              ['LRT (anova())', 'Distribución χ² con df = diferencia de parámetros', 'Decisión binaria con valor p', 'Sí'],
            ],
          },
        ],
        callouts: [
          {
            type: 'warning',
            title: 'Atención: REML = FALSE para comparar efectos fijos',
            content: 'Si comparas modelos con distinta parte fija usando REML (el valor por defecto), AIC/BIC/LRT no son válidos. Reajusta con REML = FALSE, compara, y solo al final vuelve a REML = TRUE para el modelo elegido.',
          },
          {
            type: 'info',
            title: 'Info: el LRT para varianzas es conservador',
            content: 'Al probar si una varianza de efecto aleatorio es cero, el valor p de anova() es aproximadamente el doble del valor "correcto" (problema de boundary). Si el resultado es claramente significativo o claramente no, esto rara vez cambia la conclusión.',
          },
        ],
        rCells: [
          {
            id: 'spruce-refit-ml',
            title: 'Reajustar candidatos con ML para comparación',
            code: `# Cargamos paquetes y datos (SPRUCE1, igual que en Modulos 4-5)
library(lme4)
library(dplyr)

spruce <- read.csv("https://raw.githubusercontent.com/jcsalazaru/datasets/main/SPRUCE1.csv")
spruce <- spruce %>%
  mutate(ID = factor(ID), Group = factor(Group), time_centered = time1 - mean(time1))

# Tres candidatos anidados, todos con REML = FALSE para poder compararlos
mod_intercepto   <- lmer(log_growth ~ time_centered * Group + (1 | ID), data = spruce, REML = FALSE)
mod_pendiente    <- lmer(log_growth ~ time_centered * Group + (time_centered | ID), data = spruce, REML = FALSE)
mod_sin_interac  <- lmer(log_growth ~ time_centered + Group + (time_centered | ID), data = spruce, REML = FALSE)

# Tabla comparativa de criterios de informacion
data.frame(
  modelo = c("Solo intercepto aleatorio", "+ pendiente aleatoria", "Pendiente aleatoria, sin interaccion"),
  AIC    = c(AIC(mod_intercepto), AIC(mod_pendiente), AIC(mod_sin_interac)),
  BIC    = c(BIC(mod_intercepto), BIC(mod_pendiente), BIC(mod_sin_interac)),
  logLik = c(logLik(mod_intercepto), logLik(mod_pendiente), logLik(mod_sin_interac))
)`,
          },
          {
            id: 'spruce-lrt',
            title: 'Pruebas de razón de verosimilitud (LRT)',
            code: `# 1) Vale la pena la pendiente aleatoria?
anova(mod_intercepto, mod_pendiente)

# 2) Vale la pena la interaccion tiempo x grupo?
anova(mod_sin_interac, mod_pendiente)`,
          },
          {
            id: 'spruce-refit-reml',
            title: 'Reajustar el modelo elegido con REML para reportar',
            code: `# Supongamos que mod_pendiente fue el modelo elegido.
# Lo reajustamos con REML (valor por defecto) para el reporte final.
mod_final <- lmer(
  log_growth ~ time_centered * Group + (time_centered | ID),
  data = spruce  # REML = TRUE por defecto
)
summary(mod_final)
VarCorr(mod_final)`,
          },
        ],
        sasExamples: [
          {
            title: 'Alternativa en SAS: comparar -2LL, AIC y BIC entre PROC MIXED',
            code: `/* Ajustar cada candidato con METHOD=ML y comparar la tabla
   "Fit Statistics" (-2 Log Likelihood, AIC, AICC, BIC) */

PROC MIXED DATA=spruce1 METHOD=ML;
  CLASS id group;
  MODEL log_growth = time_centered group time_centered*group / SOLUTION;
  RANDOM INTERCEPT / SUBJECT=id;
RUN;

PROC MIXED DATA=spruce1 METHOD=ML;
  CLASS id group;
  MODEL log_growth = time_centered group time_centered*group / SOLUTION;
  RANDOM INTERCEPT time_centered / SUBJECT=id TYPE=UN;
RUN;

/* La diferencia de -2 Log Likelihood entre los dos modelos, comparada
   contra una chi-cuadrado con los df de diferencia de parametros,
   reproduce el LRT de anova() en R. Reajustar el modelo final con
   METHOD=REML (valor por defecto) para el reporte. */`,
          },
        ],
        flashcards: [
          {
            front: '¿Qué significa que dos modelos sean "anidados"?',
            back: 'Que el modelo más simple es un caso particular del más complejo, obtenido fijando uno o más de sus parámetros en valores específicos (típicamente cero).',
          },
          {
            front: '¿Por qué hay que usar REML = FALSE para comparar modelos con distinta parte fija?',
            back: 'Porque las verosimilitudes REML no son comparables entre modelos con distintos efectos fijos; ML sí lo permite. El modelo final se reajusta con REML para reportar.',
          },
          {
            front: '¿Qué indica un AIC o BIC más bajo?',
            back: 'Un mejor balance entre ajuste y complejidad: el modelo con menor AIC/BIC es preferido bajo ese criterio.',
          },
          {
            front: '¿Qué problema especial surge al probar si una varianza de efecto aleatorio es cero?',
            back: 'El valor nulo está en el borde del espacio de parámetros (boundary), lo que hace que el valor p del LRT estándar sea conservador (aprox. el doble del valor "correcto").',
          },
        ],
        quiz: [
          {
            question: 'Quieres comparar un modelo con y sin la interacción tiempo×grupo (mismos efectos aleatorios). ¿Qué debes hacer antes de comparar AIC/BIC/LRT?',
            options: [
              'Nada, se pueden comparar directamente con REML',
              'Reajustar ambos modelos con REML = FALSE (ML)',
              'Usar solo el modelo con mayor R²',
              'Comparar solo los valores de BIC, nunca AIC',
            ],
            correctIndex: 1,
            explanation: 'Cuando los modelos difieren en efectos fijos, las verosimilitudes deben calcularse con ML (REML = FALSE) para que la comparación sea válida.',
          },
          {
            question: 'anova(mod_intercepto, mod_pendiente) da un valor p = 0.04 para la pendiente aleatoria. ¿Qué precaución aplica?',
            options: [
              'Ninguna, el resultado es exacto',
              'El valor p podría ser conservador (boundary); el valor "correcto" sería aproximadamente la mitad, lo que en este caso no cambia la conclusión',
              'El resultado es inválido y debe ignorarse',
              'Hay que multiplicar el valor p por el número de observaciones',
            ],
            correctIndex: 1,
            explanation: 'Al probar varianzas de efectos aleatorios, el LRT estándar es conservador por el problema de boundary; con p = 0.04 la conclusión (significativo) probablemente no cambia.',
          },
          {
            question: 'AIC favorece el modelo A y BIC favorece el modelo B (más simple). ¿Qué interpretación es razonable?',
            options: [
              'Uno de los dos criterios está mal calculado',
              'Hay que reportar ambos modelos sin elegir ninguno',
              'La discrepancia refleja el trade-off ajuste/parsimonia: si priorizas interpretabilidad y simplicidad, B; si priorizas capacidad predictiva, A — y conviene justificar la elección',
              'Siempre se debe preferir el modelo con más parámetros',
            ],
            correctIndex: 2,
            explanation: 'AIC y BIC penalizan la complejidad de forma distinta; cuando discrepan, la elección debe justificarse según el objetivo del análisis (predicción vs. parsimonia/interpretación).',
          },
        ],
      },
    ],
  },
  {
    slug: 'casos-integradores',
    title: 'Módulo 9 · Casos integradores: splines, diagnóstico y comunicación',
    description: 'Un caso clínico completo que integra especificación, splines, diagnóstico DHARMa, selección y comunicación de resultados.',
    lessons: [
      {
        slug: 'caso-progesterona',
        title: 'Progesterona: splines, diagnóstico y comunicación clínica',
        objectives: [
          'Reconocer cuándo una relación tiempo-respuesta no lineal requiere splines.',
          'Ajustar un LMM con splines (bs()) y efectos aleatorios.',
          'Aplicar el flujo completo del curso: especificar, ajustar, comparar, diagnosticar.',
          'Generar predicciones marginales con bandas de incertidumbre.',
          'Comunicar resultados clínicos de forma clara, integrando hallazgos estadísticos y fisiológicos.',
        ],
        datasets: ['progesterone (concentraciones hormonales por ciclo menstrual)'],
        content: `
## El caso: una curva que no es una línea recta

A lo largo de este curso hemos construido, pieza por pieza, las herramientas para analizar datos longitudinales: efectos aleatorios (Módulo 4), estructuras de covarianza (Módulo 5), diagnóstico (Módulo 6), familias no gaussianas (Módulo 7) y selección de modelos (Módulo 8). Este módulo integra todo en un **caso clínico completo**.

Los niveles de progesterona durante el ciclo menstrual **no siguen una tendencia lineal**: suben bruscamente tras la ovulación y caen antes de la menstruación. Un modelo \`logp ~ time + (time | id)\` asumiría una relación lineal con el tiempo — claramente inadecuada aquí. Necesitamos una función **flexible pero suave**.

## Splines: curvas suaves dentro de un modelo lineal

Un **spline** representa una función no lineal de \`time\` como una combinación lineal de funciones base $B_1(t), \\dots, B_k(t)$:

$$
f(\\text{time}) = \\sum_{j=1}^{k} \\gamma_j B_j(\\text{time})
$$

Lo notable es que, una vez definidas las funciones base (\`bs(time, degree = 3, knots = ...)\`), el modelo sigue siendo **lineal en los parámetros** $\\gamma_j$ — por lo tanto cabe perfectamente dentro de \`lmer()\`. Los **nodos** (\`knots\`) controlan dónde la curva tiene mayor flexibilidad; para progesterona, ubicarlos cerca de la ovulación (tiempo 0) permite capturar el pico y la caída posterior.

## El flujo integrador

1. **Especificar:** \`logp ~ bs(time, degree=3, knots=c(-6,0,6)) * group + (time | id)\` — spline cúbico interactuando con grupo, efectos aleatorios por mujer.
2. **Comparar (Módulo 8):** ¿el spline mejora el AIC/BIC frente a un término lineal o cuadrático en \`time\`? Reajustar con ML para comparar.
3. **Diagnosticar (Módulo 6):** \`simulateResiduals()\` + \`plot(sim)\` — ¿el spline elimina el patrón curvo que veíamos con el término lineal?
4. **Predecir y comunicar:** generar una curva predicha por grupo con bandas de confianza, e interpretarla en términos fisiológicos (momento e intensidad del pico, diferencias entre grupos).

## De los coeficientes a la curva: por qué predecimos

Los coeficientes individuales de un spline ($\\gamma_1, \\gamma_2, \\dots$) **no tienen interpretación clínica directa** — son artefactos de la base matemática elegida. Lo que sí se comunica es la **curva predicha completa**: "el pico de progesterona ocurre alrededor del día X, con una concentración Y, y el grupo A alcanza valores significativamente más altos que el grupo B en la fase lútea". Las bandas de confianza (a partir de la varianza de predicción o de \`bootMer()\`) comunican la incertidumbre de esa curva.

## Cerrando el círculo

Este caso resume la filosofía del curso: el objetivo no es ajustar "el modelo correcto" en abstracto, sino un modelo que (a) represente razonablemente el fenómeno biológico, (b) pase los chequeos de diagnóstico, (c) sea defendible frente a alternativas razonables (selección de modelos), y (d) cuyos resultados puedan **comunicarse con claridad** a quienes toman decisiones clínicas.
`,
        processSteps: [
          {
            title: '1. Explorar',
            description: 'Graficar las trayectorias individuales de logp vs. time: confirmar la forma no lineal (pico posovulatorio) — Módulo 2.',
          },
          {
            title: '2. Especificar con splines',
            description: 'bs(time, degree=3, knots=...) * group + (time | id): flexibilidad en el tiempo, efectos aleatorios por mujer — Módulo 4.',
          },
          {
            title: '3. Comparar alternativas',
            description: 'AIC/BIC del modelo con spline vs. lineal/cuadrático, todos con ML — Módulo 8.',
          },
          {
            title: '4. Diagnosticar',
            description: 'simulateResiduals() + plot(sim): verificar que el spline corrige el patrón curvo en los residuos — Módulo 6.',
          },
          {
            title: '5. Predecir y comunicar',
            description: 'Curvas predichas por grupo con bandas de incertidumbre, interpretadas en términos fisiológicos y clínicos.',
          },
        ],
        dataTables: [
          {
            caption: 'Mapa del curso: qué módulo resuelve qué pregunta',
            columns: ['Pregunta', 'Módulo', 'Herramienta'],
            rows: [
              ['¿Cómo modelar la heterogeneidad entre sujetos?', 'Módulo 4', 'Efectos aleatorios (intercepto/pendiente)'],
              ['¿Cómo modelar la correlación intra-sujeto residual?', 'Módulo 5', 'Estructuras CS / AR(1) / UN'],
              ['¿El modelo cumple los supuestos?', 'Módulo 6', 'Residuos simulados (DHARMa)'],
              ['¿Qué hacer si la respuesta no es continua?', 'Módulo 7', 'GLMM (binomial, Poisson)'],
              ['¿Qué tan complejo debe ser el modelo?', 'Módulo 8', 'AIC/BIC/LRT'],
              ['¿Cómo modelar relaciones no lineales en el tiempo?', 'Módulo 9', 'Splines (bs())'],
            ],
          },
        ],
        callouts: [
          {
            type: 'tip',
            title: 'Tip: los nodos (knots) son decisiones de diseño',
            content: 'Ubicar los nodos cerca de regiones donde esperas cambios de curvatura (p. ej. el día de la ovulación) suele dar mejores resultados que repartirlos uniformemente. Justifica tu elección con conocimiento del fenómeno, no solo con el ajuste.',
          },
          {
            type: 'success',
            title: 'Listo: has completado el recorrido del curso',
            content: 'Especificar, ajustar, comparar, diagnosticar, predecir y comunicar — este ciclo se repite (a veces varias veces) en cualquier análisis real de modelos mixtos. Vuelve a los módulos anteriores cuando lo necesites: son tu caja de herramientas.',
          },
        ],
        rCells: [
          {
            id: 'progesterone-spline',
            title: 'Ajustar un LMM con spline cúbico en el tiempo',
            code: `# Cargamos paquetes y datos
library(lme4)
library(splines)
library(dplyr)

prog <- read.csv("https://raw.githubusercontent.com/jcsalazaru/datasets/main/progesterone.csv")
prog <- prog %>%
  mutate(logp  = as.numeric(gsub(",", ".", logp)),
         id    = factor(id),
         group = factor(group))

# Spline cubico con nodos cerca de la ovulacion (time = 0)
# interactuando con group; efectos aleatorios por mujer
mod_spline <- lmer(
  logp ~ bs(time, degree = 3, knots = c(-6, 0, 6)) * group + (time | id),
  data = prog
)
summary(mod_spline)`,
          },
          {
            id: 'progesterone-comparar-diagnosticar',
            title: 'Comparar contra un término lineal y diagnosticar con DHARMa',
            code: `library(DHARMa)

# Modelo alternativo: tiempo lineal (sin spline), mismo termino aleatorio
mod_lineal <- lmer(logp ~ time * group + (time | id), data = prog, REML = FALSE)
mod_spline_ml <- lmer(
  logp ~ bs(time, degree = 3, knots = c(-6, 0, 6)) * group + (time | id),
  data = prog, REML = FALSE
)

# Comparacion de criterios (Modulo 8)
data.frame(
  modelo = c("Lineal", "Spline cubico"),
  AIC = c(AIC(mod_lineal), AIC(mod_spline_ml)),
  BIC = c(BIC(mod_lineal), BIC(mod_spline_ml))
)

# Diagnostico de residuos del modelo con spline (Modulo 6)
sim <- simulateResiduals(mod_spline, n = 500)
plot(sim)`,
          },
          {
            id: 'progesterone-prediccion',
            title: 'Curva predicha por grupo con banda de incertidumbre',
            code: `library(ggplot2)

# Rejilla de tiempo para predecir, por grupo
grid <- expand.grid(
  time  = seq(min(prog$time), max(prog$time), length.out = 80),
  group = levels(prog$group)
)

# Prediccion poblacional (sin efectos aleatorios, re.form = NA)
grid$fit <- predict(mod_spline, newdata = grid, re.form = NA)

# Banda aproximada usando el error estandar residual del modelo
# (una aproximacion simple; para bandas mas precisas usar bootMer())
se_resid <- sigma(mod_spline)
grid$lwr <- grid$fit - 1.96 * se_resid
grid$upr <- grid$fit + 1.96 * se_resid

ggplot(grid, aes(time, fit, color = group, fill = group)) +
  geom_ribbon(aes(ymin = lwr, ymax = upr), alpha = 0.15, color = NA) +
  geom_line(linewidth = 1.2) +
  labs(title = "Curva de progesterona predicha por grupo",
       x = "Tiempo (relativo a la ovulacion)", y = "log(progesterona)") +
  theme_minimal()`,
          },
        ],
        sasExamples: [
          {
            title: 'Alternativa en SAS: PROC MIXED con efectos spline (EFFECT)',
            code: `/* SAS 9.4+ permite construir bases de spline directamente
   con la sentencia EFFECT dentro de PROC MIXED */
PROC MIXED DATA=progesterone1 METHOD=ML;
  CLASS id group;
  EFFECT spl = SPLINE(time / KNOTMETHOD=LIST(-6 0 6) DEGREE=3);
  MODEL logp = spl group spl*group / SOLUTION;
  RANDOM INTERCEPT time / SUBJECT=id TYPE=UN;
RUN;

/* Comparar el -2LL/AIC/BIC de este modelo contra un modelo con
   "time" lineal (sin EFFECT SPLINE) para justificar la complejidad
   adicional, igual que con anova()/AIC() en R. */`,
          },
        ],
        flashcards: [
          {
            front: '¿Por qué un spline sigue siendo un "modelo lineal" aunque represente una curva?',
            back: 'Porque es lineal en los parámetros γⱼ: la curva es una combinación lineal de funciones base Bⱼ(time), que se calculan de antemano y se incluyen como predictores comunes.',
          },
          {
            front: '¿Qué controlan los "knots" (nodos) de un spline?',
            back: 'Dónde la curva tiene mayor flexibilidad para cambiar de forma; suelen ubicarse donde se espera un cambio de curvatura relevante para el fenómeno.',
          },
          {
            front: '¿Por qué los coeficientes individuales de un spline no se interpretan uno por uno?',
            back: 'Porque son artefactos de la base matemática elegida; lo interpretable es la curva predicha completa (forma, picos, diferencias entre grupos).',
          },
          {
            front: 'Resume en una frase el flujo integrador de este módulo.',
            back: 'Explorar → especificar (con splines si es necesario) → comparar alternativas (AIC/BIC) → diagnosticar (DHARMa) → predecir y comunicar resultados clínicamente relevantes.',
          },
        ],
        quiz: [
          {
            question: 'Las trayectorias de progesterone muestran un pico marcado seguido de una caída. ¿Por qué un término lineal en time sería insuficiente?',
            options: [
              'Porque lme4 no admite variables continuas',
              'Porque un término lineal solo puede representar una tendencia monótona (siempre sube o siempre baja), no un pico',
              'Porque time debe ser siempre categórico',
              'Porque los efectos aleatorios eliminan la necesidad de modelar el tiempo',
            ],
            correctIndex: 1,
            explanation: 'Un coeficiente lineal en time impone una relación monótona; para representar un pico y una caída se necesita una función no lineal, como un spline.',
          },
          {
            question: '¿Qué evidencia, en conjunto, respaldaría preferir el modelo con spline sobre el lineal?',
            options: [
              'Solo que el spline tenga más parámetros',
              'Menor AIC/BIC del spline y residuos DHARMa sin el patrón curvo que sí aparecía con el modelo lineal',
              'Que el spline sea más difícil de programar',
              'Que el modelo lineal converja más rápido',
            ],
            correctIndex: 1,
            explanation: 'La decisión integra selección de modelos (AIC/BIC, Módulo 8) y diagnóstico (Módulo 6): el spline se justifica si mejora el ajuste/criterios y corrige el patrón en los residuos.',
          },
          {
            question: 'Al comunicar los resultados del modelo con spline a un equipo clínico, ¿qué es lo más apropiado?',
            options: [
              'Presentar la tabla completa de coeficientes γⱼ del spline y pedirles que los interpreten',
              'Mostrar la curva predicha por grupo con bandas de incertidumbre y describir el pico, su momento y las diferencias entre grupos en términos fisiológicos',
              'Solo reportar el AIC del modelo',
              'No comunicar nada hasta tener un modelo "perfecto"',
            ],
            correctIndex: 1,
            explanation: 'Los coeficientes del spline no son interpretables individualmente; la comunicación efectiva se basa en la curva predicha y su significado clínico/fisiológico, junto con la incertidumbre asociada.',
          },
        ],
      },
    ],
  },
  {
    slug: 'modulo-10-gee',
    title: 'Módulo 10 · Modelos marginales y GEE',
    description: 'GEE vs GLMM, estructuras de correlación de trabajo y errores sándwich.',
    lessons: [
      {
        slug: 'gee-vs-glmm',
        title: 'GEE para efectos poblacionales',
        objectives: [
          'Distinguir entre inferencia marginal y condicional.',
          'Identificar cuándo usar GEE frente a GLMM.',
          'Interpretar la matriz de correlación de trabajo.',
          'Obtener errores estándar sándwich.',
          'Comparar el mismo dataset con lme4.'
        ],
        datasets: ['Orthodont (nlme)'],
        content: 'La narrativa pedagógica y quiz están en module-10-gee.md.',
        markdownFile: 'module-10-gee.md',
        rCells: [
          {
            id: 'gee-compare',
            title: 'GEE vs GLMM con Orthodont',
            code: `library(geepack)
library(lme4)
data(Orthodont, package = "nlme")
Orthodont$Subject <- as.factor(Orthodont$Subject)
mod_gee <- geeglm(distance ~ age + Sex, id = Subject, data = Orthodont, family = gaussian, corstr = "exchangeable")
mod_lmm <- lmer(distance ~ age + Sex + (1 + age | Subject), data = Orthodont)
summary(mod_gee)
summary(mod_lmm)`
          },
          {
            id: 'gee-robust',
            title: 'Covarianzas robustas y predicciones',
            code: `library(geepack)
mod_gee <- geeglm(distance ~ age + Sex, id = Subject, data = Orthodont, family = gaussian, corstr = "exchangeable")
print(summary(mod_gee))
predict(mod_gee, newdata = data.frame(age = c(10, 12), Sex = c("Male", "Female")))`
          },
        ],
        sasExamples: [
          {
            title: 'Alternativa en SAS',
            code: `proc gee data=orthodont;
  class Subject Sex;
  model distance = age Sex / dist=normal link=identity;
  repeated subject / type=exch corrw;
run;`
          },
        ],
      },
    ],
  },
  {
    slug: 'modulo-11-varianza',
    title: 'Módulo 11 · Estructuras de varianza avanzadas',
    description: 'Correlaciones complejas, heterocedasticidad y estructuras de trabajo para modelos marginales.',
    lessons: [
      {
        slug: 'varianza-trabajo',
        title: 'Correlaciones y varianzas heterocedásticas',
        objectives: [
          'Comparar corSymm, corAR1, corCompSymm, corExp.',
          'Estimar varianza heterocedástica con varIdent o varPower.',
          'Entender cómo influye la estructura en la eficiencia de GEE.',
          'Mostrar resultados clínicos con gráficas de calor.'
        ],
        datasets: ['Orthodont (nlme)'],
        content: 'Más detalles y flashcards en module-11-varianza.md.',
        markdownFile: 'module-11-varianza.md',
        rCells: [
          {
            id: 'var-structures',
            title: 'Correlaciones alternativas',
            code: `library(nlme)
Orthodont <- Orthodont
mod_ar1 <- lme(distance ~ age + Sex, random = ~ 1 | Subject, correlation = corAR1(form = ~ age | Subject), data = Orthodont)
mod_comp <- update(mod_ar1, correlation = corCompSymm(form = ~ age | Subject))
summary(mod_ar1)
summary(mod_comp)`
          },
          {
            id: 'var-hetero',
            title: 'Varianza heterocedástica',
            code: `mod_var <- lme(distance ~ age + Sex, random = ~ 1 | Subject, weights = varPower(form = ~ age), data = Orthodont)
summary(mod_var)
intervals(mod_var)`
          },
        ],
        sasExamples: [
          {
            title: 'Alternativa en SAS',
            code: `proc mixed data=spruce1 method=ml;
  class id;
  model log_growth = time1 / solution;
  random intercept / subject=id;
  repeated time1 / subject=id type=cs;
run;`
          },
        ],
      },
    ],
  },
  {
    slug: 'modulo-12-intervenciones',
    title: 'Módulo 12 · Modelos para intervenciones y cambios temporales',
    description: 'Series temporales interrumpidas, variables dependientes del tiempo y cambios de pendiente.',
    lessons: [
      {
        slug: 'intervenciones-cambio',
        title: 'Piecewise y pendientes por fase',
        objectives: [
          'Construir variables antes/después de la intervención.',
          'Añadir efectos aleatorios en los cambios.',
          'Visualizar diferencias en las pendientes.',
          'Documentar el impacto clínico del cambio.'
        ],
        datasets: ['Datos simulados de adherencia'],
        content: 'Narrativa y quiz en module-12-intervenciones.md.',
        markdownFile: 'module-12-intervenciones.md',
        rCells: [
          {
            id: 'piecewise-load',
            title: 'Serie interrumpida simulada',
            code: `set.seed(42)
n <- 90
time <- 1:n
intervention <- ifelse(time > 45, 1, 0)
y <- 5 + 0.1 * time + 0.5 * intervention * (time - 45) + rnorm(n, 0, 0.5)
df <- data.frame(time, intervention, y, patient = factor(rep(1:30, each = 3)))
mod_piece <- lmer(y ~ time + intervention + I(intervention * (time - 45)) + (1 + time | patient), data = df)
summary(mod_piece)`
          },
          {
            id: 'piecewise-plot',
            title: 'Gráfica del cambio estructural',
            code: `library(ggplot2)
df$phase <- ifelse(df$time <= 45, "before", "after")
ggplot(df, aes(time, y, color = phase)) + geom_point(alpha = 0.6) + geom_smooth(method = "lm", se = FALSE)`
          },
        ],
        sasExamples: [
          {
            title: 'Alternativa en SAS',
            code: `proc mixed data=longdata;
  class id phase;
  model y = time intervention / solution;
  random intercept time / subject=id;
run;`
          },
        ],
      },
    ],
  },
  {
    slug: 'modulo-13-nonlineal',
    title: 'Módulo 13 · Modelos no paramétricos y robustos',
    description: 'GAMM, transformaciones y bootstrap para trayectorias no lineales.',
    lessons: [
      {
        slug: 'gamm-robustos',
        title: 'GAMM y bootstrap paramétrico',
        objectives: [
          'Ajustar mgcv::gamm para capturar curvas suaves.',
          'Interpretar funciones suavizadas y efectos aleatorios.',
          'Explorar transformaciones y distribuciones t.',
          'Realizar bootstrap para inferencia robusta.'
        ],
        datasets: ['Datos de crecimiento infantil simulados'],
        content: 'El hilo narrativo y las flashcards están en module-13-nonlineal.md.',
        markdownFile: 'module-13-nonlineal.md',
        rCells: [
          {
            id: 'gamm-fit',
            title: 'Ajuste GAMM con mgcv',
            code: `library(mgcv)
set.seed(123)
time <- seq(0, 18, length.out = 120)
child <- factor(rep(1:30, each = 4))
height <- 70 + 6 * sin(time / 2) + rnorm(length(child), 0, 0.5)
df <- data.frame(time = rep(time[1:4], 30), height = height[1:120], child)
mod_gamm <- gamm(height ~ s(time, k = 6), random = list(child = ~ 1), data = df)
plot(mod_gamm$gam)`
          },
          {
            id: 'gamm-bootstrap',
            title: 'Bootstrap paramétrico para coeficientes',
            code: `library(boot)
boot_fun <- function(data, idx) {
  d <- data[idx, ]
  fit <- lm(height ~ poly(time, 3), data = d)
  coef(fit)[2]
}
boot_res <- boot(df, boot_fun, R = 200)
boot.ci(boot_res, type = "bca")`
          },
        ],
        sasExamples: [
          {
            title: 'Alternativa en SAS',
            code: `proc gam data=longdata;
  model y = spline(time) / dist=normal;
run;`
          },
        ],
      },
    ],
  },
  {
    slug: 'modulo-14-recomendaciones',
    title: 'Módulo 14 · Recomendaciones para datos longitudinales y medidas repetidas',
    description: 'Guía experta de recomendaciones metodológicas: exploración, especificación de efectos aleatorios, estructuras de covarianza, selección de modelos, diagnóstico y árbol de decisión.',
    lessons: [
      {
        slug: 'recomendaciones-practicas',
        title: 'Guía experta de recomendaciones metodológicas',
        objectives: [
          'Detectar la estructura longitudinal/de medidas repetidas de un conjunto de datos y explorarla gráficamente.',
          'Especificar y justificar la estructura de efectos aleatorios de un modelo mixto.',
          'Elegir una estructura de covarianza o de correlación de trabajo adecuada al diseño.',
          'Comparar modelos anidados y no anidados con criterios apropiados (LRT, AIC, BIC, cAIC).',
          'Diagnosticar el ajuste con residuos, DHARMa y normalidad de los efectos aleatorios.',
          'Decidir entre LMM, GLMM, GEE, enfoques marginales, GAMM o alternativas no paramétricas según el problema.'
        ],
        datasets: ['sleepstudy (lme4)', 'Orthodont (nlme)', 'dietox (geepack)', 'datos simulados'],
        content: `## 1. Detección y tratamiento de datos longitudinales

Antes de ajustar cualquier modelo, conviene confirmar que los datos tienen
estructura de **medidas repetidas o anidamiento**: varias observaciones por
sujeto, paciente, clúster o unidad experimental, medidas en el tiempo o bajo
condiciones relacionadas. Señales típicas en el conjunto de datos:

- Una columna identificadora de sujeto/cluster (\`id\`, \`subject\`, \`center\`) que
  se repite en varias filas.
- Una variable de tiempo/ocasión (\`visita\`, \`día\`, \`semana\`) anidada dentro
  de cada sujeto.
- Más filas que sujetos únicos: \`nrow(datos) > length(unique(datos$id))\`.

**Exploración recomendada (siempre antes de modelar):**

- *Spaghetti plots*: una línea por sujeto, para ver heterogeneidad de
  trayectorias individuales.
- *Perfiles medios*: la media (± error estándar) por grupo y tiempo, para ver
  la tendencia poblacional.
- *Boxplots por tiempo*: para detectar cambios de varianza (heterocedasticidad)
  a lo largo de las ocasiones.

**Desbalance y datos faltantes:** en estudios longitudinales es habitual que no
todos los sujetos tengan el mismo número de mediciones (pérdidas de
seguimiento, visitas perdidas). Los modelos mixtos (LMM/GLMM) manejan de forma
natural datos no balanceados y faltantes bajo el supuesto **MAR** (*missing at
random*): la probabilidad de faltar puede depender de lo observado, pero no de
lo no observado dado lo observado. Si se sospecha **MNAR** (la falta depende
de valores no observados, p. ej. pacientes que abandonan porque empeoran),
conviene considerar modelos de selección, modelos de mezcla de patrones, o
análisis de sensibilidad. La **imputación múltiple** (paquete \`mice\`) es una
alternativa cuando se requiere un análisis completo posterior (p. ej. GEE, que
sí asume datos faltantes completamente al azar, **MCAR**, para mantener
consistencia bajo el esquema de estimación por ecuaciones).

## 2. Especificación de efectos aleatorios

La estructura de efectos aleatorios traduce la pregunta "¿qué varía entre
sujetos?" en componentes del modelo:

- **Solo intercepto aleatorio** $$Y_{ij} = \\beta_0 + \\beta_1 t_{ij} + b_{0i} + \\epsilon_{ij}$$
  — cada sujeto tiene su propio nivel basal, pero la misma tendencia temporal
  promedio. Adecuado cuando las trayectorias individuales son aproximadamente
  paralelas.
- **Solo pendiente aleatoria** (raro sin intercepto aleatorio) — cada sujeto
  difiere en su tasa de cambio pero comparte el nivel basal; rara vez tiene
  sentido sustantivo por sí sola.
- **Intercepto + pendiente aleatorios** $$Y_{ij} = \\beta_0 + \\beta_1 t_{ij} + b_{0i} + b_{1i} t_{ij} + \\epsilon_{ij}$$
  — cada sujeto tiene su propio nivel basal *y* su propia tendencia temporal.
  Pueden especificarse **correlacionados** (\`(1 + tiempo | sujeto)\`, default en
  \`lme4\`) o **no correlacionados** (\`(1 | sujeto) + (0 + tiempo | sujeto)\`).
- **Anidamiento jerárquico**: por ejemplo pacientes dentro de centros
  (\`(1 | centro/paciente)\` o equivalente \`(1 | centro) + (1 | centro:paciente)\`).
- **Efectos cruzados (no anidados)**: por ejemplo evaluadores y pacientes que
  no están anidados entre sí (\`(1 | paciente) + (1 | evaluador)\`).

**¿Cuándo es necesario un efecto aleatorio adicional?** Tres herramientas
complementarias:

1. **LRT (test de razón de verosimilitudes)** entre modelos anidados ajustados
   por **ML** (no REML, porque REML no permite comparar efectos fijos
   distintos, y para efectos aleatorios el LRT clásico es conservador). Ojo:
   cuando la hipótesis nula pone una varianza en el límite del espacio de
   parámetros (cero), el estadístico LRT no sigue una $\\chi^2$ estándar —
   el p-valor reportado por \`anova()\` es conservador (demasiado grande).
2. **AIC/BIC**: menor es mejor; útiles para comparar estructuras de efectos
   aleatorios no anidadas (p. ej. intercepto+pendiente correlacionados vs.
   anidamiento jerárquico).
3. **Inspección visual**: si los interceptos/pendientes individuales (BLUPs)
   estimados muestran variación sustantiva y patrones interpretables, hay
   evidencia de que el efecto aleatorio aporta.

## 3. Selección de estructuras de covarianza y matrices de trabajo

En \`nlme::gls\`/\`nlme::lme\` se modela directamente la matriz de
correlación/covarianza de los residuos dentro de cada sujeto mediante objetos
\`corStruct\`:

- **\`corCompSymm\`** (simetría compuesta / intercambiable): correlación
  constante entre cualquier par de tiempos. Equivale, en LMM, a un modelo con
  solo intercepto aleatorio.
- **\`corAR1\`**: correlación que decae geométricamente con la distancia entre
  tiempos ($\\rho^{|t_i - t_j|}$); apropiada cuando los tiempos están
  igualmente espaciados y la dependencia se atenúa con el tiempo.
- **\`corExp\`** / **\`corGaus\`**: análogas a AR(1) pero para tiempos
  continuos/desigualmente espaciados, con decaimiento exponencial o gaussiano.
- **\`corSymm\`** (no estructurada): una correlación distinta para cada par de
  tiempos — máxima flexibilidad, pero muchos parámetros (requiere series
  cortas/balanceadas).
- **\`corIdent\`**: independencia (sin correlación intra-sujeto) — rara vez
  realista en datos repetidos, útil como referencia.

**Cómo elegir:** combinar (a) justificación clínica/sustantiva (¿la correlación
debería decaer con el tiempo o ser constante?), (b) gráficos de
autocorrelación de los residuos (\`ACF\`) por sujeto/tiempo, y (c) comparación
por AIC/BIC entre estructuras anidadas o no anidadas, ajustando por **REML**
(la covarianza se compara mejor con REML que con ML).

**Heterocedasticidad** (varianza que cambia con el tiempo, grupo o predictor)
se modela con funciones de varianza: \`varIdent\` (varianza distinta por nivel
de un factor, p. ej. por tiempo), \`varPower\` (varianza proporcional a una
potencia de un predictor) y \`varExp\` (varianza exponencial en un predictor).

**Para GEE** (\`geepack::geeglm\`), en lugar de modelar la covarianza
explícitamente, se especifica una **estructura de correlación de trabajo**
(\`corstr\`): \`"independence"\`, \`"exchangeable"\`, \`"ar1"\` o \`"unstructured"\`.
Gracias a los **errores estándar robustos tipo sándwich**, las estimaciones de
los coeficientes poblacionales (marginales) son consistentes incluso si la
estructura de trabajo está mal especificada — aunque la eficiencia mejora si
se acierta razonablemente.

## 4. Comparación y selección de modelos

Estrategia recomendada, de forma **secuencial**:

1. **Efectos fijos**: empezar con el modelo "saturado" sustantivamente
   razonable (todas las covariables y sus interacciones de interés).
2. **Efectos aleatorios**: con los efectos fijos fijos, comparar estructuras
   de efectos aleatorios anidadas vía LRT (ML) y AIC/BIC, de la más simple a
   la más compleja (intercepto → intercepto+pendiente → anidamiento).
3. **Covarianza/correlación residual**: con la estructura de efectos
   aleatorios elegida, comparar estructuras de covarianza residual (REML) o
   estructuras de correlación de trabajo (GEE).
4. Solo entonces, si interesa, simplificar **efectos fijos** comparando con
   AIC/BIC o tests de Wald (con ML si se comparan efectos fijos por LRT).

**Criterios:**

- **LRT**: válido para modelos anidados ajustados con el mismo método (ML
  para efectos fijos, ML o REML para efectos aleatorios); recordar la
  advertencia de *boundary* del punto 2.
- **AIC / BIC**: comparan modelos anidados o no anidados; BIC penaliza más la
  complejidad y tiende a preferir modelos más simples en muestras grandes.
- **cAIC / mBIC**: versiones que tienen en cuenta los grados de libertad
  "efectivos" de los efectos aleatorios — más apropiadas cuando el interés
  principal es la estructura aleatoria (paquete \`cAIC4\`).
- **Validación cruzada / bootstrap**: especialmente útiles cuando el objetivo
  es predicción (más que inferencia), o cuando AIC/BIC no distinguen
  claramente entre modelos candidatos.

## 5. Diagnóstico de modelos mixtos

- **Residuos estandarizados/studentizados** vs. valores ajustados: buscar
  ausencia de patrones y varianza aproximadamente constante.
- **DHARMa** (residuos simulados): especialmente útil en GLMM, donde los
  residuos "crudos" no son fáciles de interpretar. \`simulateResiduals()\`
  genera residuos cuantil-cuantil comparables a un LMM, permitiendo:
  - \`plot()\`: QQ-plot de residuos simulados + residuos vs. predichos.
  - \`testDispersion()\`: sobre/infra-dispersión.
  - \`testZeroInflation()\`: exceso de ceros respecto a lo esperado por el
    modelo.
- **Outliers e influyentes**: distancia de Cook a nivel de observación y de
  sujeto (paquete \`influence.ME\`), DFBETAS para evaluar el impacto de cada
  sujeto sobre las estimaciones de efectos fijos.
- **Normalidad de los efectos aleatorios**: gráfico Q-Q de los BLUPs
  (\`ranef()\`) y, de forma exploratoria, prueba de Shapiro-Wilk sobre los
  BLUPs — recordando que con pocos sujetos esta prueba tiene poca potencia.

## 6. Árbol de decisión: ¿qué enfoque usar?

Preguntas guía, en orden:

1. **¿Qué tipo de respuesta tengo?** Continua aproximadamente normal → LMM.
   Binaria, conteo, u otra de la familia exponencial → GLMM o GEE. Respuesta
   con relación claramente no lineal con el tiempo/predictores → considerar
   **GAMM** (\`mgcv::gamm\`, con \`s(tiempo)\`).
2. **¿Cuál es el objetivo de la inferencia?** Si interesa el efecto
   **específico del sujeto** (p. ej. "¿cuánto cambia *este* paciente?") →
   modelo de **efectos mixtos** (LMM/GLMM), cuyos coeficientes son
   *condicionales* a los efectos aleatorios. Si interesa el efecto
   **poblacional promedio** (p. ej. "¿cuál es el efecto promedio del
   tratamiento en la población?"), especialmente con respuestas no normales,
   **GEE** ofrece directamente coeficientes *marginales*.
3. **¿Qué tan compleja es la correlación intra-sujeto y qué tan grande es la
   muestra?** Con pocos clústeres o estructuras de correlación complejas, los
   GLMM con cuadratura/Laplace pueden ser inestables; GEE con estructura de
   trabajo simple (intercambiable) suele ser más robusto, a costa de perder la
   interpretación condicional.
4. **¿Se cumplen los supuestos de un modelo paramétrico?** Si no (residuos muy
   no normales, relaciones fuertemente no lineales que no se resuelven con
   transformaciones), considerar **GAMM** o métodos **no paramétricos**
   (p. ej. modelos basados en rangos para medidas repetidas).
5. **¿Exceso de ceros o respuestas acotadas en [0,1]?** Considerar modelos
   **ZIP/ZINB** (conteos con inflación de ceros) o **ZOIP/beta** (proporciones
   con masa en 0 y/o 1).
6. **REML vs. ML**: usar **REML** (default en \`lmer\`/\`lme\`) para la
   estimación final y para comparar estructuras de covarianza/efectos
   aleatorios; usar **ML** si se necesita comparar modelos con distintos
   efectos fijos por LRT, o si se requiere el AIC/BIC para comparar efectos
   fijos.`,
        rCells: [
          {
            id: 'exploracion-longitudinal',
            title: 'Exploración visual: spaghetti plot y perfiles medios',
            code: `library(ggplot2)
library(dplyr)

# Datos longitudinales simulados: 30 sujetos, 5 visitas, 2 grupos
set.seed(2024)
n_suj <- 30
n_tiempo <- 5
dat <- data.frame(
  id = rep(1:n_suj, each = n_tiempo),
  tiempo = rep(0:(n_tiempo - 1), n_suj),
  grupo = rep(rep(c("Control", "Tratamiento"), each = n_suj / 2), each = n_tiempo)
)
b0 <- rep(rnorm(n_suj, 0, 2), each = n_tiempo)
efecto_trt <- ifelse(dat$grupo == "Tratamiento", -0.8, 0)
dat$y <- 10 + b0 + 0.5 * dat$tiempo + efecto_trt * dat$tiempo +
  rnorm(nrow(dat), 0, 1)

# Spaghetti plot: una linea por sujeto
p1 <- ggplot(dat, aes(tiempo, y, group = id, color = grupo)) +
  geom_line(alpha = 0.3) +
  theme_minimal() +
  labs(title = "Trayectorias individuales", x = "Visita", y = "Respuesta")
print(p1)

# Perfil medio por grupo
resumen <- dat %>%
  group_by(grupo, tiempo) %>%
  summarise(media = mean(y), se = sd(y) / sqrt(n()), .groups = "drop")

p2 <- ggplot(resumen, aes(tiempo, media, color = grupo)) +
  geom_line(linewidth = 1) +
  geom_errorbar(aes(ymin = media - se, ymax = media + se), width = 0.1) +
  theme_minimal() +
  labs(title = "Perfil medio por grupo", x = "Visita", y = "Media (+/- EE)")
print(p2)`
          },
          {
            id: 'especificacion-efectos-aleatorios',
            title: 'Comparar estructuras de efectos aleatorios (LRT, AIC, BIC)',
            code: `library(lme4)

# Reutiliza 'dat' de la celda anterior (si no existe, vuelve a simularla)
if (!exists("dat")) {
  set.seed(2024)
  n_suj <- 30; n_tiempo <- 5
  dat <- data.frame(
    id = rep(1:n_suj, each = n_tiempo),
    tiempo = rep(0:(n_tiempo - 1), n_suj),
    grupo = rep(rep(c("Control", "Tratamiento"), each = n_suj / 2), each = n_tiempo)
  )
  b0 <- rep(rnorm(n_suj, 0, 2), each = n_tiempo)
  efecto_trt <- ifelse(dat$grupo == "Tratamiento", -0.8, 0)
  dat$y <- 10 + b0 + 0.5 * dat$tiempo + efecto_trt * dat$tiempo + rnorm(nrow(dat), 0, 1)
}

# Modelo 1: solo intercepto aleatorio
m1 <- lmer(y ~ tiempo * grupo + (1 | id), data = dat, REML = FALSE)

# Modelo 2: intercepto + pendiente, sin correlacion
m2 <- lmer(y ~ tiempo * grupo + (1 | id) + (0 + tiempo | id), data = dat, REML = FALSE)

# Modelo 3: intercepto + pendiente, correlacionados
m3 <- lmer(y ~ tiempo * grupo + (1 + tiempo | id), data = dat, REML = FALSE)

# Comparacion por LRT (modelos anidados: m1 dentro de m2 dentro de m3)
print(anova(m1, m2, m3))

# Tabla resumen AIC/BIC
data.frame(
  modelo = c("Solo intercepto", "Int+pend sin corr", "Int+pend corr"),
  AIC = c(AIC(m1), AIC(m2), AIC(m3)),
  BIC = c(BIC(m1), BIC(m2), BIC(m3))
)`
          },
          {
            id: 'estructuras-covarianza',
            title: 'Estructuras de covarianza con nlme::gls',
            code: `library(nlme)

if (!exists("dat")) {
  set.seed(2024)
  n_suj <- 30; n_tiempo <- 5
  dat <- data.frame(
    id = rep(1:n_suj, each = n_tiempo),
    tiempo = rep(0:(n_tiempo - 1), n_suj),
    grupo = rep(rep(c("Control", "Tratamiento"), each = n_suj / 2), each = n_tiempo)
  )
  b0 <- rep(rnorm(n_suj, 0, 2), each = n_tiempo)
  efecto_trt <- ifelse(dat$grupo == "Tratamiento", -0.8, 0)
  dat$y <- 10 + b0 + 0.5 * dat$tiempo + efecto_trt * dat$tiempo + rnorm(nrow(dat), 0, 1)
}
dat$tiempo_f <- factor(dat$tiempo)

# Independencia (referencia)
g_ind <- gls(y ~ tiempo * grupo, data = dat,
              correlation = corIdent(form = ~ 1 | id), method = "REML")

# Simetria compuesta (intercambiable)
g_cs <- gls(y ~ tiempo * grupo, data = dat,
             correlation = corCompSymm(form = ~ tiempo | id), method = "REML")

# AR(1)
g_ar1 <- gls(y ~ tiempo * grupo, data = dat,
              correlation = corAR1(form = ~ tiempo | id), method = "REML")

# No estructurada (corSymm), requiere tiempos como factor
g_un <- gls(y ~ tiempo * grupo, data = dat,
             correlation = corSymm(form = ~ as.integer(tiempo_f) | id),
             weights = varIdent(form = ~ 1 | tiempo_f), method = "REML")

data.frame(
  estructura = c("Independencia", "Comp. simetrica", "AR(1)", "No estructurada"),
  AIC = c(AIC(g_ind), AIC(g_cs), AIC(g_ar1), AIC(g_un)),
  BIC = c(BIC(g_ind), BIC(g_cs), BIC(g_ar1), BIC(g_un))
)`
          },
          {
            id: 'diagnostico-dharma',
            title: 'Diagnóstico con DHARMa (residuos simulados)',
            code: `library(lme4)
# El paquete DHARMa debe estar cargado en el entorno WebR
library(DHARMa)

if (!exists("dat")) {
  set.seed(2024)
  n_suj <- 30; n_tiempo <- 5
  dat <- data.frame(
    id = rep(1:n_suj, each = n_tiempo),
    tiempo = rep(0:(n_tiempo - 1), n_suj),
    grupo = rep(rep(c("Control", "Tratamiento"), each = n_suj / 2), each = n_tiempo)
  )
  b0 <- rep(rnorm(n_suj, 0, 2), each = n_tiempo)
  efecto_trt <- ifelse(dat$grupo == "Tratamiento", -0.8, 0)
  dat$y <- 10 + b0 + 0.5 * dat$tiempo + efecto_trt * dat$tiempo + rnorm(nrow(dat), 0, 1)
}

m3 <- lmer(y ~ tiempo * grupo + (1 + tiempo | id), data = dat, REML = TRUE)

# Residuos simulados (cuantil-cuantil)
sim_res <- simulateResiduals(m3, n = 250)
plot(sim_res)

# Pruebas formales
print(testDispersion(sim_res))

# Normalidad de los efectos aleatorios (BLUPs)
blups <- ranef(m3)$id[, 1]
qqnorm(blups, main = "Q-Q de interceptos aleatorios (BLUPs)")
qqline(blups)
print(shapiro.test(blups))`
          },
          {
            id: 'arbol-decision-gee-gamm',
            title: 'GLMM vs GEE: interpretación condicional vs marginal',
            code: `library(lme4)
# Los paquetes geepack y mgcv deben estar cargados en el entorno WebR
library(geepack)
library(mgcv)

# Datos binarios agrupados por centro (10 centros, 20 pacientes c/u)
set.seed(99)
n_centros <- 10
n_pac <- 20
centro <- rep(1:n_centros, each = n_pac)
b_centro <- rep(rnorm(n_centros, 0, 1.2), each = n_pac)
trt <- rep(rep(c(0, 1), each = n_pac / 2), n_centros)
lin <- -0.5 + 1.0 * trt + b_centro
p <- plogis(lin)
y <- rbinom(length(p), 1, p)
datb <- data.frame(centro = factor(centro), trt = trt, y = y,
                    id = rep(1:n_pac, n_centros))

# GLMM: efecto condicional (especifico del centro)
m_glmm <- glmer(y ~ trt + (1 | centro), data = datb, family = binomial)

# GEE: efecto marginal (poblacional), correlacion exchangeable por centro
m_gee <- geeglm(y ~ trt, data = datb, id = centro, family = binomial,
                 corstr = "exchangeable")

cat("OR condicional (GLMM):", round(exp(fixef(m_glmm)["trt"]), 2), "\\n")
cat("OR marginal (GEE):     ", round(exp(coef(m_gee)["trt"]), 2), "\\n")

# Ejemplo rapido de GAMM para una tendencia no lineal (ilustrativo)
set.seed(1)
tt <- seq(0, 10, length.out = 100)
yy <- sin(tt) + rnorm(100, 0, 0.2)
gg <- gam(yy ~ s(tt, k = 8))
plot(gg, main = "GAMM: tendencia suavizada")`
          }
        ],
        sasExamples: [
          {
            title: 'Código SAS equivalente — exploración gráfica',
            code: `/* Spaghetti plot y perfil medio */
proc sgplot data=longdata;
  series x=tiempo y=y / group=id lineattrs=(pattern=solid) transparency=0.7;
  by grupo;
run;

proc means data=longdata noprint;
  class grupo tiempo;
  var y;
  output out=resumen mean=media stderr=ee;
run;

proc sgplot data=resumen;
  series x=tiempo y=media / group=grupo;
  scatter x=tiempo y=media / group=grupo yerrorlower=lo yerrorupper=hi;
run;`
          },
          {
            title: 'Código SAS equivalente — comparación de efectos aleatorios',
            code: `/* Modelo con solo intercepto aleatorio */
proc mixed data=longdata method=ml covtest;
  class id grupo;
  model y = tiempo grupo tiempo*grupo / solution;
  random intercept / subject=id;
run;

/* Modelo con intercepto + pendiente aleatorios correlacionados */
proc mixed data=longdata method=ml covtest;
  class id grupo;
  model y = tiempo grupo tiempo*grupo / solution;
  random intercept tiempo / subject=id type=un;
run;

/* PROC MIXED reporta -2 Log Likelihood, AIC y BIC en la tabla
   "Fit Statistics"; la diferencia de -2LL entre modelos anidados
   sigue (de forma conservadora) una mezcla de chi-cuadrado cuando
   la hipotesis nula esta en el borde del espacio parametral. */`
          },
          {
            title: 'Código SAS equivalente — estructuras de covarianza (REPEATED)',
            code: `/* Simetria compuesta */
proc mixed data=longdata method=reml;
  class id tiempo grupo;
  model y = tiempo grupo tiempo*grupo / solution;
  repeated tiempo / subject=id type=cs rcorr;
run;

/* AR(1) */
proc mixed data=longdata method=reml;
  class id tiempo grupo;
  model y = tiempo grupo tiempo*grupo / solution;
  repeated tiempo / subject=id type=ar(1) rcorr;
run;

/* No estructurada */
proc mixed data=longdata method=reml;
  class id tiempo grupo;
  model y = tiempo grupo tiempo*grupo / solution;
  repeated tiempo / subject=id type=un rcorr;
run;

/* Comparar AIC/BIC en "Fit Statistics" de cada ajuste */`
          },
          {
            title: 'Código SAS equivalente — diagnóstico de residuos',
            code: `proc mixed data=longdata method=reml plots=all;
  class id grupo;
  model y = tiempo grupo tiempo*grupo / solution outpred=pred residual;
  random intercept tiempo / subject=id type=un;
  ods output SolutionR=blups;
run;

/* PROC MIXED con plots=all genera graficos de residuos
   estandarizados vs predichos y un QQ-plot de los residuos.
   Para evaluar normalidad de los efectos aleatorios (BLUPs),
   exportar SolutionR y aplicar PROC UNIVARIATE (normal) sobre
   la columna Estimate. */
proc univariate data=blups normal;
  var Estimate;
  qqplot Estimate / normal;
run;`
          },
          {
            title: 'Código SAS equivalente — GLMM y GEE',
            code: `/* GLMM: efecto condicional especifico de centro */
proc glimmix data=datb;
  class centro trt;
  model y(event='1') = trt / dist=binary link=logit solution oddsratio;
  random intercept / subject=centro;
run;

/* GEE: efecto marginal (poblacional), correlacion exchangeable */
proc gee data=datb;
  class centro trt;
  model y(event='1') = trt / dist=binomial link=logit;
  repeated subject=centro / type=exch corrw;
run;

/* Los coeficientes de PROC GLIMMIX se interpretan condicionales al
   centro (random intercept); los de PROC GEE se interpretan como
   efectos marginales (poblacionales), de forma analoga a la
   diferencia entre glmer() y geeglm() en R. */`
          }
        ],
        callouts: [
          {
            type: 'tip',
            title: 'REML vs. ML: regla práctica',
            content: 'Usa REML (el valor por defecto) para la estimación final y para comparar estructuras de covarianza o de efectos aleatorios. Cambia a ML solo cuando necesites comparar modelos con distintos efectos fijos mediante LRT o AIC/BIC.'
          },
          {
            type: 'warning',
            title: 'LRT en el límite del espacio de parámetros',
            content: 'Al comparar un modelo con un efecto aleatorio adicional contra uno sin él, la varianza bajo H0 está en el límite (cero). El p-valor del LRT clásico (anova()) es conservador: si resulta significativo a pesar de esto, la evidencia a favor del efecto aleatorio es aún más fuerte; si no es significativo, considera también el AIC/BIC y la inspección visual antes de descartarlo.'
          },
          {
            type: 'tip',
            title: 'Datos faltantes y MAR',
            content: 'Los modelos mixtos (LMM/GLMM) usan toda la información disponible y son válidos bajo el supuesto MAR sin necesidad de imputar. La imputación múltiple (mice) es más relevante cuando el análisis principal es GEE, que requiere MCAR para mantener su validez, o cuando se desea armonizar varios análisis sobre el mismo conjunto de datos completo.'
          },
          {
            type: 'warning',
            title: 'No elijas la covarianza solo por el AIC',
            content: 'El AIC/BIC ayuda a comparar estructuras de covarianza, pero la elección también debe ser clínicamente plausible (¿tiene sentido que la correlación decaiga con el tiempo en este fenómeno?) y verificarse con gráficos de autocorrelación de los residuos.'
          }
        ],
        processSteps: [
          {
            title: '1. Explorar',
            description: 'Spaghetti plots, perfiles medios y boxplots por tiempo para entender heterogeneidad, tendencia y heterocedasticidad.'
          },
          {
            title: '2. Especificar efectos fijos',
            description: 'Definir el modelo de efectos fijos sustantivamente relevante (covariables, tiempo, interacciones de interés).'
          },
          {
            title: '3. Especificar efectos aleatorios',
            description: 'Comparar intercepto solo, intercepto+pendiente (con/sin correlación) y estructuras anidadas vía LRT (ML), AIC/BIC e inspección visual de BLUPs.'
          },
          {
            title: '4. Elegir covarianza/correlación',
            description: 'Con REML, comparar corCompSymm, corAR1, corSymm, etc. (o estructuras de trabajo en GEE) usando AIC/BIC y gráficos de autocorrelación.'
          },
          {
            title: '5. Diagnosticar',
            description: 'Residuos estandarizados, DHARMa (dispersión, zero-inflation), normalidad de BLUPs, outliers/influyentes.'
          },
          {
            title: '6. Reportar',
            description: 'Comunicar el modelo final, su justificación (LRT/AIC/BIC + diagnóstico) y, si aplica, análisis de sensibilidad ante datos faltantes.'
          }
        ],
        dataTables: [
          {
            caption: 'Árbol de decisión simplificado: enfoque según escenario',
            columns: ['Tipo de respuesta', 'Objetivo de inferencia', 'Enfoque recomendado'],
            rows: [
              ['Continua, aprox. normal', 'Específico del sujeto', 'LMM (lmer / lme)'],
              ['Binaria / conteo', 'Específico del sujeto (condicional)', 'GLMM (glmer)'],
              ['Binaria / conteo', 'Poblacional (marginal)', 'GEE (geeglm)'],
              ['Continua o no normal', 'Tendencia no lineal en el tiempo', 'GAMM (mgcv::gamm)'],
              ['Conteo con exceso de ceros', 'Cualquiera', 'ZIP / ZINB (glmmTMB, GLMMadaptive)'],
              ['Proporción en [0,1] con masa en extremos', 'Cualquiera', 'ZOIP / regresión beta']
            ]
          }
        ],
        quiz: [
          {
            question: '¿Cuándo preferirías GEE sobre GLMM para un desenlace binario repetido?',
            options: [
              'Cuando el interés principal es el efecto promedio poblacional (marginal) y no el efecto específico de cada sujeto.',
              'Cuando siempre se quiere la interpretación condicional al sujeto.',
              'GEE nunca es preferible a GLMM.',
              'Solo cuando hay un único cluster.'
            ],
            correctIndex: 0,
            explanation: 'GEE produce coeficientes marginales (poblacionales), robustos a la mala especificación de la correlación de trabajo, ideales cuando el foco es el efecto promedio en la población.'
          },
          {
            question: 'Al comparar un modelo con intercepto aleatorio frente a otro con intercepto y pendiente aleatorios mediante LRT (anova en lme4), ¿qué se debe tener en cuenta?',
            options: [
              'Que ambos modelos deben ajustarse con ML (no REML) y que el p-valor es conservador por estar la varianza en el borde del espacio de parámetros.',
              'Que el p-valor del LRT es siempre exacto sin importar el método de estimación.',
              'Que REML es obligatorio para comparar efectos aleatorios mediante LRT.',
              'Que el AIC no puede usarse en este caso.'
            ],
            correctIndex: 0,
            explanation: 'Para comparar estructuras anidadas (efectos fijos o aleatorios) con LRT se recomienda ML; además, cuando la nula está en el límite (varianza = 0), el LRT clásico es conservador.'
          },
          {
            question: '¿Qué estructura de covarianza en nlme::gls equivale aproximadamente a un LMM con solo intercepto aleatorio?',
            options: [
              'corCompSymm (simetría compuesta / intercambiable).',
              'corAR1.',
              'corSymm (no estructurada).',
              'corIdent (independencia).'
            ],
            correctIndex: 0,
            explanation: 'La simetría compuesta impone una correlación constante entre cualquier par de medidas dentro del sujeto, lo mismo que produce un intercepto aleatorio compartido.'
          },
          {
            question: 'En DHARMa, ¿qué función usarías para evaluar si un GLMM Poisson presenta sobredispersión?',
            options: [
              'testDispersion() sobre los residuos simulados con simulateResiduals().',
              'shapiro.test() sobre los datos crudos.',
              'anova() entre el modelo y el modelo nulo.',
              'plot(ranef(modelo)) únicamente.'
            ],
            correctIndex: 0,
            explanation: 'testDispersion() aplicado al objeto devuelto por simulateResiduals() es la forma estándar de evaluar sobre/infra-dispersión en DHARMa.'
          }
        ]
      }
    ]
  },
  {
    slug: 'modulo-15-aplicacion-practica',
    title: 'Módulo 15 · Aplicación práctica comparada en R y SAS',
    description: 'Implementación lado a lado en R y SAS de las recomendaciones del Módulo 14, con dos casos clínicos integradores y tablas de equivalencias.',
    lessons: [
      {
        slug: 'casos-comparados-r-sas',
        title: 'Casos integradores: implementación en R y SAS',
        objectives: [
          'Traducir las recomendaciones del Módulo 14 a sintaxis ejecutable en R y SAS, lado a lado.',
          'Resolver dos casos clínicos integradores de principio a fin: exploración, modelado, diagnóstico e interpretación.',
          'Comparar la salida de R y SAS para los mismos modelos e interpretar diferencias de nomenclatura.',
          'Aplicar buenas prácticas de programación reproducible en R (lme4, nlme, ggplot2, DHARMa) y en SAS (ODS, opciones de estimación).'
        ],
        datasets: ['Presión arterial en ensayo clínico (simulado)', 'Infecciones posoperatorias multicéntricas (simulado)'],
        content: `Este módulo retoma las recomendaciones metodológicas del **Módulo 14** y las
aplica de punta a punta sobre dos casos clínicos, mostrando en cada paso el
código en R (ejecutable, celdas WebR) junto con el código SAS equivalente
("Código SAS equivalente"). El objetivo es que, dado un escenario, sepas qué
opciones usar en cada lenguaje y cómo leer la salida correspondiente.

## Caso 1: presión arterial en un ensayo con medidas repetidas

Un ensayo clínico aleatorizado mide la **presión arterial sistólica (PAS)** de
cada paciente en 5 visitas (basal + 4 seguimientos), comparando un nuevo
fármaco contra placebo. La pregunta es si el fármaco reduce la PAS con el
tiempo más que el placebo, y cuál es la estructura de correlación intra-sujeto
más adecuada.

Siguiendo el Módulo 14: (1) explorar con spaghetti plot y perfil medio; (2)
ajustar un LMM con intercepto y pendiente aleatorios (o, alternativamente,
\`gls\` con una estructura de correlación residual tipo AR(1)); (3) comparar
estructuras de covarianza por AIC/BIC; (4) diagnosticar con DHARMa.

## Caso 2: infecciones posoperatorias en un estudio multicéntrico

Un estudio observacional multicéntrico (10 centros) registra si cada paciente
desarrolló o no una **infección posoperatoria** (sí/no) tras dos tipos de
intervención. Interesa tanto el efecto **específico de cada centro**
(¿cuánto cambia el riesgo dentro de un centro dado?) como el efecto
**poblacional promedio** (¿cuál es el efecto medio del tipo de intervención en
la población de centros?).

Siguiendo el Módulo 14: (1) explorar proporciones de infección por centro; (2)
ajustar un **GLMM** (\`glmer\`, familia binomial, intercepto aleatorio por
centro) para el efecto condicional, y un **GEE** (\`geeglm\`, correlación
exchangeable) para el efecto marginal; (3) comparar e interpretar los odds
ratio condicional vs. marginal; (4) diagnosticar con DHARMa.

## Comparación directa de salidas R vs. SAS

Aunque la nomenclatura difiere, los resultados deben ser numéricamente
equivalentes (o muy cercanos, según el algoritmo de estimación). La tabla al
final de esta lección resume las correspondencias más comunes entre la salida
de \`summary()\`/\`anova()\` en R y las tablas "Solution for Fixed Effects" /
"Covariance Parameter Estimates" / "Fit Statistics" de \`PROC MIXED\` /
\`PROC GLIMMIX\`.

## Buenas prácticas de programación

**En R:** mantener un script reproducible con \`set.seed()\` explícito, cargar
paquetes al inicio (\`library(lme4)\`, \`library(nlme)\`, \`library(ggplot2)\`,
\`library(DHARMa)\`), separar exploración / modelado / diagnóstico en secciones
claramente comentadas, y usar \`broom.mixed::tidy()\` o \`summary()\` para extraer
resultados de forma consistente.

**En SAS:** usar \`ods graphics on\` y \`ods output\` para capturar tablas y
gráficos de forma reproducible, documentar las opciones de estimación
(\`method=reml\` vs \`method=ml\`, \`ddfm=\` para grados de libertad), y preferir
\`PROC GLIMMIX\` sobre \`PROC MIXED\` cuando el desenlace no es continuo (PROC
MIXED asume normalidad de la respuesta condicional).`,
        rCells: [
          {
            id: 'pa-exploracion',
            title: 'Caso 1 — Exploración: PAS por visita y grupo',
            code: `library(ggplot2)
library(dplyr)

set.seed(321)
n_pac <- 40
n_vis <- 5
pa <- data.frame(
  id = rep(1:n_pac, each = n_vis),
  visita = rep(0:(n_vis - 1), n_pac),
  grupo = rep(rep(c("Placebo", "Farmaco"), each = n_pac / 2), each = n_vis)
)
b0 <- rep(rnorm(n_pac, 0, 6), each = n_vis)
efecto <- ifelse(pa$grupo == "Farmaco", -2.5, 0)
pa$pas <- 140 + b0 + 1 * pa$visita + efecto * pa$visita +
  rnorm(nrow(pa), 0, 3)

ggplot(pa, aes(visita, pas, group = id, color = grupo)) +
  geom_line(alpha = 0.25) +
  stat_summary(aes(group = grupo), fun = mean, geom = "line", linewidth = 1.4) +
  theme_minimal() +
  labs(title = "PAS por visita: trayectorias individuales y perfil medio",
       x = "Visita", y = "PAS (mmHg)")`
          },
          {
            id: 'pa-modelo-covarianza',
            title: 'Caso 1 — Modelo LMM y comparación de covarianza (AR1 vs CS)',
            code: `library(lme4)
library(nlme)

if (!exists("pa")) {
  set.seed(321)
  n_pac <- 40; n_vis <- 5
  pa <- data.frame(
    id = rep(1:n_pac, each = n_vis),
    visita = rep(0:(n_vis - 1), n_pac),
    grupo = rep(rep(c("Placebo", "Farmaco"), each = n_pac / 2), each = n_vis)
  )
  b0 <- rep(rnorm(n_pac, 0, 6), each = n_vis)
  efecto <- ifelse(pa$grupo == "Farmaco", -2.5, 0)
  pa$pas <- 140 + b0 + 1 * pa$visita + efecto * pa$visita + rnorm(nrow(pa), 0, 3)
}

# LMM con intercepto y pendiente aleatorios (lme4)
m_lmm <- lmer(pas ~ visita * grupo + (1 + visita | id), data = pa, REML = TRUE)
print(summary(m_lmm)$coefficients)

# Alternativa: gls con correlacion AR(1) vs simetria compuesta (nlme)
g_ar1 <- gls(pas ~ visita * grupo, data = pa,
              correlation = corAR1(form = ~ visita | id), method = "REML")
g_cs <- gls(pas ~ visita * grupo, data = pa,
             correlation = corCompSymm(form = ~ visita | id), method = "REML")

data.frame(
  modelo = c("LMM (int+pend aleatorios)", "GLS + AR(1)", "GLS + CS"),
  AIC = c(AIC(m_lmm), AIC(g_ar1), AIC(g_cs)),
  BIC = c(BIC(m_lmm), BIC(g_ar1), BIC(g_cs))
)`
          },
          {
            id: 'pa-diagnostico',
            title: 'Caso 1 — Diagnóstico con DHARMa',
            code: `library(lme4)
# El paquete DHARMa debe estar cargado en el entorno WebR
library(DHARMa)

if (!exists("pa")) {
  set.seed(321)
  n_pac <- 40; n_vis <- 5
  pa <- data.frame(
    id = rep(1:n_pac, each = n_vis),
    visita = rep(0:(n_vis - 1), n_pac),
    grupo = rep(rep(c("Placebo", "Farmaco"), each = n_pac / 2), each = n_vis)
  )
  b0 <- rep(rnorm(n_pac, 0, 6), each = n_vis)
  efecto <- ifelse(pa$grupo == "Farmaco", -2.5, 0)
  pa$pas <- 140 + b0 + 1 * pa$visita + efecto * pa$visita + rnorm(nrow(pa), 0, 3)
}

m_lmm <- lmer(pas ~ visita * grupo + (1 + visita | id), data = pa, REML = TRUE)
sim_pa <- simulateResiduals(m_lmm, n = 250)
plot(sim_pa)
print(testDispersion(sim_pa))`
          },
          {
            id: 'infeccion-exploracion',
            title: 'Caso 2 — Exploración: proporción de infección por centro',
            code: `library(ggplot2)
library(dplyr)

set.seed(654)
n_centros <- 10
n_pac <- 25
inf <- data.frame(
  centro = factor(rep(1:n_centros, each = n_pac)),
  tipo = rep(rep(c("A", "B"), each = n_pac / 2), n_centros)
)
b_centro <- rep(rnorm(n_centros, 0, 1), each = n_pac)
lin <- -1 + 0.9 * (inf$tipo == "B") + b_centro
inf$infeccion <- rbinom(nrow(inf), 1, plogis(lin))

resumen_inf <- inf %>%
  group_by(centro, tipo) %>%
  summarise(prop = mean(infeccion), .groups = "drop")

ggplot(resumen_inf, aes(centro, prop, fill = tipo)) +
  geom_col(position = "dodge") +
  theme_minimal() +
  labs(title = "Proporción de infección por centro y tipo de intervención",
       x = "Centro", y = "Proporción de infección")`
          },
          {
            id: 'infeccion-glmm-gee',
            title: 'Caso 2 — GLMM (condicional) vs GEE (marginal)',
            code: `library(lme4)
# El paquete geepack debe estar cargado en el entorno WebR
library(geepack)

if (!exists("inf")) {
  set.seed(654)
  n_centros <- 10; n_pac <- 25
  inf <- data.frame(
    centro = factor(rep(1:n_centros, each = n_pac)),
    tipo = rep(rep(c("A", "B"), each = n_pac / 2), n_centros)
  )
  b_centro <- rep(rnorm(n_centros, 0, 1), each = n_pac)
  lin <- -1 + 0.9 * (inf$tipo == "B") + b_centro
  inf$infeccion <- rbinom(nrow(inf), 1, plogis(lin))
}

# GLMM: odds ratio condicional al centro
m_glmm <- glmer(infeccion ~ tipo + (1 | centro), data = inf, family = binomial)
or_cond <- exp(fixef(m_glmm)["tipoB"])

# GEE: odds ratio marginal (poblacional)
m_gee <- geeglm(infeccion ~ tipo, data = inf, id = centro,
                 family = binomial, corstr = "exchangeable")
or_marg <- exp(coef(m_gee)["tipoB"])

data.frame(
  enfoque = c("GLMM (condicional al centro)", "GEE (marginal/poblacional)"),
  OR = round(c(or_cond, or_marg), 2)
)`
          },
          {
            id: 'infeccion-diagnostico',
            title: 'Caso 2 — Diagnóstico GLMM con DHARMa',
            code: `library(lme4)
# El paquete DHARMa debe estar cargado en el entorno WebR
library(DHARMa)

if (!exists("inf")) {
  set.seed(654)
  n_centros <- 10; n_pac <- 25
  inf <- data.frame(
    centro = factor(rep(1:n_centros, each = n_pac)),
    tipo = rep(rep(c("A", "B"), each = n_pac / 2), n_centros)
  )
  b_centro <- rep(rnorm(n_centros, 0, 1), each = n_pac)
  lin <- -1 + 0.9 * (inf$tipo == "B") + b_centro
  inf$infeccion <- rbinom(nrow(inf), 1, plogis(lin))
}

m_glmm <- glmer(infeccion ~ tipo + (1 | centro), data = inf, family = binomial)
sim_inf <- simulateResiduals(m_glmm, n = 250)
plot(sim_inf)
print(testDispersion(sim_inf))`
          }
        ],
        sasExamples: [
          {
            title: 'Código SAS equivalente — exploración PAS',
            code: `proc sgplot data=pa;
  series x=visita y=pas / group=id lineattrs=(pattern=solid) transparency=0.75;
run;

proc means data=pa noprint;
  class grupo visita;
  var pas;
  output out=resumen_pa mean=media;
run;

proc sgplot data=resumen_pa;
  series x=visita y=media / group=grupo lineattrs=(thickness=2);
run;`
          },
          {
            title: 'Código SAS equivalente — LMM y comparación de covarianza',
            code: `/* Intercepto + pendiente aleatorios */
proc mixed data=pa method=reml;
  class id grupo;
  model pas = visita grupo visita*grupo / solution ddfm=kr;
  random intercept visita / subject=id type=un;
run;

/* AR(1) sobre los residuos (alternativa a efectos aleatorios) */
proc mixed data=pa method=reml;
  class id grupo;
  model pas = visita grupo visita*grupo / solution;
  repeated visita / subject=id type=ar(1) rcorr;
run;

/* Simetria compuesta */
proc mixed data=pa method=reml;
  class id grupo;
  model pas = visita grupo visita*grupo / solution;
  repeated visita / subject=id type=cs rcorr;
run;

/* Comparar "Fit Statistics" (AIC, BIC) entre los tres ajustes */`
          },
          {
            title: 'Código SAS equivalente — diagnóstico PAS',
            code: `proc mixed data=pa method=reml plots=all;
  class id grupo;
  model pas = visita grupo visita*grupo / solution outpred=pred residual;
  random intercept visita / subject=id type=un;
run;

/* plots=all incluye: residuales estandarizados vs predichos,
   histograma de residuales y Q-Q plot — analogo a plot(simulateResiduals(...))
   en DHARMa, aunque DHARMa usa residuos simulados en lugar de
   "raw"/Pearson. */`
          },
          {
            title: 'Código SAS equivalente — exploración infecciones por centro',
            code: `proc sql;
  create table resumen_inf as
  select centro, tipo, mean(infeccion) as prop
  from inf
  group by centro, tipo;
quit;

proc sgplot data=resumen_inf;
  vbar centro / response=prop group=tipo groupdisplay=cluster;
run;`
          },
          {
            title: 'Código SAS equivalente — GLMM y GEE',
            code: `/* GLMM: odds ratio condicional al centro */
proc glimmix data=inf;
  class centro tipo;
  model infeccion(event='1') = tipo / dist=binary link=logit solution oddsratio;
  random intercept / subject=centro;
run;

/* GEE: odds ratio marginal */
proc gee data=inf;
  class centro tipo;
  model infeccion(event='1') = tipo / dist=binomial link=logit;
  repeated subject=centro / type=exch corrw;
run;

/* La tabla "Odds Ratio Estimates" de PROC GLIMMIX da el OR condicional
   al centro; los "Estimates" exponenciados de PROC GEE (con LSMEANS /
   ESTIMATE adecuados) dan el OR marginal, comparable a geeglm(). */`
          },
          {
            title: 'Código SAS equivalente — diagnóstico GLMM (infecciones)',
            code: `proc glimmix data=inf plots=all;
  class centro tipo;
  model infeccion(event='1') = tipo / dist=binary link=logit;
  random intercept / subject=centro;
  output out=glimmix_out pred=pred resid=resid;
run;

/* PROC GLIMMIX no ofrece un equivalente directo a los residuos
   simulados de DHARMa; plots=all entrega residuos Pearson/estudentizados
   condicionales, utiles para una revision similar (ausencia de patrones,
   varianza aproximadamente constante en la escala del enlace). */`
          }
        ],
        dataTables: [
          {
            caption: 'Equivalencias de salida: R vs. SAS',
            columns: ['Cantidad', 'R (lme4 / nlme / geepack)', 'SAS'],
            rows: [
              ['Estimación de efecto fijo', 'summary(modelo)$coefficients (columna Estimate)', 'Tabla "Solution for Fixed Effects" (columna Estimate)'],
              ['Error estándar', 'columna Std. Error', 'columna Standard Error'],
              ['Varianza de efecto aleatorio', 'VarCorr(modelo)', 'Tabla "Covariance Parameter Estimates"'],
              ['AIC / BIC', 'AIC(modelo) / BIC(modelo)', 'Tabla "Fit Statistics" (AIC, BIC)'],
              ['OR condicional (GLMM)', 'exp(fixef(modelo))', '"Odds Ratio Estimates" (PROC GLIMMIX)'],
              ['OR marginal (GEE)', 'exp(coef(modelo_gee))', 'Estimación exponenciada en PROC GEE'],
              ['Correlación de trabajo (GEE)', 'summary(modelo_gee)$corr', '"Working Correlation Matrix" (PROC GEE)']
            ]
          }
        ],
        flashcards: [
          { front: 'lmer(y ~ x + (1 | id), data, REML = TRUE)', back: 'PROC MIXED — RANDOM INTERCEPT / SUBJECT=id; METHOD=REML' },
          { front: 'glmer(y ~ x + (1 | id), family = binomial)', back: 'PROC GLIMMIX — CLASS id; MODEL y(event="1") = x / DIST=BINARY; RANDOM INTERCEPT / SUBJECT=id' },
          { front: 'geeglm(y ~ x, id = grupo, family = binomial, corstr = "exchangeable")', back: 'PROC GEE — CLASS grupo; MODEL y(event="1") = x / DIST=BINOMIAL; REPEATED SUBJECT=grupo / TYPE=EXCH' },
          { front: 'gls(y ~ x, correlation = corAR1(form = ~ t | id))', back: 'PROC MIXED — MODEL y = x; REPEATED t / SUBJECT=id TYPE=AR(1)' },
          { front: 'gamm(y ~ s(tiempo), random = list(id = ~1))', back: 'PROC GAM / PROC GAMPL — MODEL y = SPLINE(tiempo); RANDOM INTERCEPT / SUBJECT=id (vía PROC GLIMMIX con efectos spline)' },
          { front: 'simulateResiduals(modelo) + plot()', back: 'PROC MIXED/GLIMMIX con PLOTS=ALL (residuos Pearson/estudentizados vs. predichos, QQ-plot)' }
        ],
        quiz: [
          {
            question: 'En el Caso 1 (PAS con medidas repetidas), ¿qué dos enfoques son razonables para capturar la correlación intra-paciente?',
            options: [
              'Un LMM con intercepto y pendiente aleatorios, o un GLS con correlación AR(1)/CS sobre los residuos.',
              'Una regresión lineal simple ignorando el id del paciente.',
              'Un GEE con correlación independiente.',
              'Un GLMM con familia Poisson.'
            ],
            correctIndex: 0,
            explanation: 'Ambos enfoques (efectos aleatorios o correlación residual explícita) son formas válidas y comparables de modelar la dependencia intra-sujeto en una respuesta continua.'
          },
          {
            question: 'En el Caso 2, si el objetivo es "el efecto promedio del tipo de intervención sobre el riesgo de infección en la población de centros", ¿qué OR es el relevante?',
            options: [
              'El OR marginal de la GEE (geeglm / PROC GEE).',
              'El OR condicional del GLMM (glmer / PROC GLIMMIX).',
              'Ambos son siempre numéricamente iguales.',
              'Ninguno; se debe usar un modelo de regresión lineal.'
            ],
            correctIndex: 0,
            explanation: 'El OR marginal de GEE responde directamente a la pregunta poblacional; el OR condicional del GLMM responde "dentro de un centro dado" y suele ser de mayor magnitud (atenuación marginal).'
          },
          {
            question: '¿Qué tabla de SAS corresponde a VarCorr() en R?',
            options: [
              '"Covariance Parameter Estimates" (PROC MIXED/GLIMMIX).',
              '"Solution for Fixed Effects".',
              '"Fit Statistics".',
              '"Type 3 Tests of Fixed Effects".'
            ],
            correctIndex: 0,
            explanation: 'VarCorr() en R extrae las varianzas/covarianzas de los efectos aleatorios y residual, que en SAS aparecen en "Covariance Parameter Estimates".'
          },
          {
            question: 'Para diagnosticar sobredispersión en el GLMM binomial del Caso 2 usando R, ¿qué función es la adecuada?',
            options: [
              'testDispersion(simulateResiduals(modelo)).',
              'shapiro.test(modelo).',
              'AIC(modelo) únicamente.',
              'cor(modelo).'
            ],
            correctIndex: 0,
            explanation: 'testDispersion() sobre los residuos simulados de DHARMa evalúa formalmente la sobre/infra-dispersión del GLMM ajustado.'
          }
        ]
      }
    ]
  },
];
