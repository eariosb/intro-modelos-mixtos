import type { Module } from './types';
import { extraModules } from './modules-extra';

/**
 * Course content for "Introducción a los Modelos Mixtos".
 * Modules 1-3 are fully developed (MVP). Modules 4-9 are placeholders
 * ("próximamente") that outline the planned roadmap and will be
 * populated in later iterations.
 */
export const modules: Module[] = [
  // ---------------------------------------------------------------------
  // MÓDULO 1
  // ---------------------------------------------------------------------
  {
    slug: 'introduccion',
    title: 'Módulo 1 · Introducción a los Modelos Mixtos',
    description:
      'Motivación, datos longitudinales y la diferencia entre efectos fijos y aleatorios.',
    lessons: [
      {
        slug: 'que-son-los-modelos-mixtos',
        title: '¿Qué son los modelos mixtos y cuándo usarlos?',
        objectives: [
          'Reconocer datos longitudinales y de medidas repetidas.',
          'Distinguir entre efectos fijos y efectos aleatorios.',
          'Entender por qué el modelo de regresión lineal clásico falla con datos correlacionados.',
          'Escribir la notación matricial general de un modelo lineal mixto.',
          'Identificar ejemplos aplicados (crecimiento, salud, agronomía).',
        ],
        datasets: ['sleepstudy (lme4)'],
        content: `
## Motivación

Muchas preguntas de investigación requieren observar **el mismo sujeto, parcela o unidad varias veces** a lo largo del tiempo (datos longitudinales) o agrupar observaciones dentro de unidades superiores (datos jerárquicos / anidados: estudiantes dentro de colegios, árboles dentro de bloques, pacientes dentro de hospitales).

En estos diseños, las observaciones **no son independientes**: dos mediciones del mismo sujeto suelen parecerse más entre sí que dos mediciones de sujetos distintos. El modelo de regresión lineal clásico

$$
y_i = \\mathbf{x}_i^\\top \\boldsymbol{\\beta} + \\varepsilon_i, \\qquad \\varepsilon_i \\overset{iid}{\\sim} N(0,\\sigma^2)
$$

asume independencia entre los $\\varepsilon_i$. Si la ignoramos, los errores estándar quedan mal calculados y las pruebas de hipótesis pierden validez.

## La idea central: efectos fijos y efectos aleatorios

Un **modelo mixto** combina dos tipos de efectos:

- **Efectos fijos** ($\\boldsymbol{\\beta}$): describen la relación promedio de la población — lo que normalmente nos interesa estimar e interpretar (p. ej. el efecto de un tratamiento).
- **Efectos aleatorios** ($\\mathbf{b}_i$): capturan la **desviación específica de cada unidad** (sujeto, grupo, parcela) respecto al promedio poblacional. No se interpretan individualmente, sino a través de su varianza.

La forma general de un modelo lineal mixto para el sujeto $i$ con $n_i$ observaciones es:

$$
\\mathbf{y}_i = \\mathbf{X}_i \\boldsymbol{\\beta} + \\mathbf{Z}_i \\mathbf{b}_i + \\boldsymbol{\\varepsilon}_i,
\\qquad \\mathbf{b}_i \\sim N(\\mathbf{0}, \\mathbf{D}), \\qquad \\boldsymbol{\\varepsilon}_i \\sim N(\\mathbf{0}, \\mathbf{R}_i)
$$

donde $\\mathbf{X}_i$ y $\\mathbf{Z}_i$ son las matrices de diseño de efectos fijos y aleatorios, $\\mathbf{D}$ es la matriz de covarianzas entre efectos aleatorios y $\\mathbf{R}_i$ la covarianza intra-sujeto (a menudo $\\sigma^2 \\mathbf{I}$).

> **Idea clave:** los efectos aleatorios "absorben" la correlación intra-sujeto, dejando que los efectos fijos describan la tendencia poblacional de forma correcta.

## Un primer vistazo con datos reales

El dataset \`sleepstudy\` (incluido en el paquete \`lme4\`) registra el **tiempo de reacción** de 18 sujetos sometidos a privación de sueño durante 10 días. Cada sujeto se midió varias veces — el escenario clásico de medidas repetidas.

Ejecuta la celda siguiente para explorar la estructura de los datos y ver cómo cada sujeto tiene su propia trayectoria (intercepto y pendiente propios).
`,
        rCells: [
          {
            id: 'sleepstudy-explore',
            title: 'Explorar el dataset sleepstudy',
            code: `# El dataset sleepstudy viene incluido en lme4
library(lme4)
library(ggplot2)

data(sleepstudy)
str(sleepstudy)
head(sleepstudy, 10)

# Cada Subject tiene 10 mediciones de Reaction a lo largo de Days
table(sleepstudy$Subject)`,
          },
          {
            id: 'sleepstudy-spaghetti',
            title: 'Gráfico de perfiles individuales (spaghetti plot)',
            code: `library(ggplot2)

# Cada línea es un sujeto: observa cómo varían intercepto y pendiente
ggplot(sleepstudy, aes(x = Days, y = Reaction, group = Subject, color = Subject)) +
  geom_line(alpha = 0.6) +
  geom_point(size = 1) +
  labs(
    title = "Tiempo de reaccion por sujeto a lo largo de 10 dias",
    x = "Dias de privacion de sueno",
    y = "Tiempo de reaccion (ms)"
  ) +
  theme_minimal() +
  theme(legend.position = "none")`,
          },
        ],
        sasExamples: [
          {
            title: 'Lectura y exploración de datos longitudinales',
            code: `/* Lectura de datos longitudinales tipo "panel" */
DATA sleepstudy;
  INFILE 'sleepstudy.csv' DELIMITER=',' FIRSTOBS=2;
  INPUT Reaction Days Subject;
RUN;

/* Vista preliminar: una fila por sujeto-dia */
PROC PRINT DATA=sleepstudy(OBS=10);
RUN;

/* Conteo de mediciones por sujeto: confirma el diseño balanceado */
PROC FREQ DATA=sleepstudy;
  TABLES Subject;
RUN;`,
          },
        ],
      },
    ],
  },

  // ---------------------------------------------------------------------
  // MÓDULO 2
  // ---------------------------------------------------------------------
  {
    slug: 'exploracion-datos',
    title: 'Módulo 2 · Análisis Exploratorio de Datos Longitudinales',
    description:
      'Gráficos de perfiles, perfiles promedio y detección de patrones de anidamiento con ggplot2.',
    lessons: [
      {
        slug: 'graficos-de-perfiles',
        title: 'Visualización de datos longitudinales con ggplot2',
        objectives: [
          'Construir gráficos de perfiles individuales ("spaghetti plots").',
          'Construir gráficos de perfiles promedio por grupo.',
          'Combinar perfiles individuales y promedios en un mismo gráfico.',
          'Detectar visualmente heterogeneidad entre sujetos (justificación de efectos aleatorios).',
          'Comparar grupos experimentales mediante boxplots y densidades.',
        ],
        datasets: ['SPRUCE1 (abetos de Sitka, clases 3 y 5)'],
        content: `
## Por qué empezar por la exploración gráfica

Antes de ajustar cualquier modelo, **es indispensable visualizar la estructura longitudinal de los datos**. Los gráficos de perfiles permiten responder preguntas clave:

- ¿Las trayectorias individuales son aproximadamente paralelas (sugiere solo intercepto aleatorio) o divergen (sugiere pendiente aleatoria)?
- ¿Existen grupos con comportamientos claramente distintos?
- ¿Hay valores atípicos o sujetos con trayectorias anómalas?

## Datos: crecimiento de abetos de Sitka (SPRUCE1)

Usaremos el dataset \`SPRUCE1\`, que registra el **logaritmo del crecimiento** (\`log_growth\`) de árboles de Sitka medidos repetidamente en el tiempo (\`time1\`), bajo dos condiciones experimentales (\`Group\`: *Control* vs *Ozone*). Cada árbol tiene un identificador \`ID\`.

Esta es la misma estructura de las Clases 3 y 5 del curso: un diseño de **medidas repetidas con dos grupos**, ideal para introducir gráficos de perfiles antes de modelar.

## Tipos de gráficos a construir

1. **Perfiles individuales** (spaghetti plot): una línea por árbol, coloreada por grupo.
2. **Perfiles promedio**: la media de \`log_growth\` por grupo en cada tiempo, que resume la tendencia poblacional.
3. **Perfiles individuales + promedio superpuestos**: permite juzgar cuánta variabilidad hay alrededor de la tendencia media.
4. **Boxplot/densidad globales** (ignorando el tiempo): útil como resumen, pero **insuficiente** por sí solo porque oculta la correlación intra-sujeto.

Modifica el código de las celdas — por ejemplo cambia \`geom_line\` por \`geom_smooth\`, o filtra solo el grupo \`"Ozone"\` — y vuelve a ejecutar para explorar.
`,
        rCells: [
          {
            id: 'spruce-load',
            title: 'Cargar y explorar SPRUCE1',
            code: `library(ggplot2)

# Dataset de crecimiento de abetos de Sitka (Control vs Ozone)
data <- read.csv("https://raw.githubusercontent.com/jcsalazaru/datasets/main/SPRUCE1.csv")

str(data)
head(data)
table(data$Group)`,
          },
          {
            id: 'spruce-spaghetti',
            title: 'Perfiles individuales por grupo',
            code: `library(ggplot2)

ggplot(data, aes(x = time1, y = log_growth, group = ID)) +
  geom_line(aes(color = Group), alpha = 0.6) +
  geom_point(size = 1.5, aes(color = Group)) +
  scale_colour_brewer(palette = "Set1") +
  labs(title = "Perfiles individuales de crecimiento (log)",
       x = "Tiempo", y = "log(crecimiento)") +
  theme_minimal()`,
          },
          {
            id: 'spruce-mean-profiles',
            title: 'Perfiles promedio por grupo',
            code: `library(ggplot2)

ggplot(data, aes(x = time1, y = log_growth)) +
  stat_summary(aes(group = Group, color = Group),
               geom = "line", fun = mean, linewidth = 1.4) +
  stat_summary(aes(group = Group, color = Group),
               geom = "point", fun = mean, size = 3) +
  scale_colour_brewer(palette = "Set1") +
  labs(title = "Perfil promedio por grupo (tendencia poblacional)",
       x = "Tiempo", y = "log(crecimiento) promedio") +
  theme_minimal()`,
          },
          {
            id: 'spruce-boxplot',
            title: 'Resumen global: boxplot por grupo',
            code: `library(ggplot2)

means1 <- round(c(by(data$log_growth, data$Group, mean)), 3)

ggplot(data, aes(x = Group, y = log_growth, fill = Group)) +
  geom_boxplot(alpha = 0.6) +
  stat_summary(fun = mean, geom = "point", shape = 23, size = 3, fill = "white") +
  labs(title = "Distribucion global de log(crecimiento) por grupo",
       subtitle = "Util como resumen, pero ignora la estructura temporal",
       x = NULL, y = "log(crecimiento)") +
  theme_minimal()`,
          },
        ],
        sasExamples: [
          {
            title: 'Gráficos de perfiles con PROC SGPLOT',
            code: `/* Perfiles individuales coloreados por grupo */
PROC SGPLOT DATA=spruce1;
  SERIES x=time1 y=log_growth / group=id GROUPLC=group LINEATTRS=(THICKNESS=1);
  XAXIS LABEL="Tiempo";
  YAXIS LABEL="log(crecimiento)";
RUN;

/* Perfil promedio por grupo */
PROC SGPLOT DATA=spruce1;
  VLINE time1 / RESPONSE=log_growth GROUP=group STAT=MEAN
                 MARKERS LINEATTRS=(THICKNESS=2);
  XAXIS LABEL="Tiempo";
  YAXIS LABEL="log(crecimiento) promedio";
RUN;

/* Boxplot global por grupo */
PROC SGPLOT DATA=spruce1;
  VBOX log_growth / CATEGORY=group;
RUN;`,
          },
        ],
      },
    ],
  },

  // ---------------------------------------------------------------------
  // MÓDULO 3
  // ---------------------------------------------------------------------
  {
    slug: 'lmm',
    title: 'Módulo 3 · Modelo Lineal Mixto (LMM)',
    description:
      'Especificación del LMM con lme4 y nlme, e interpretación de la salida del modelo.',
    lessons: [
      {
        slug: 'especificacion-lmm-lme4-nlme',
        title: 'Especificación de un LMM con lme4 y nlme',
        objectives: [
          'Escribir la fórmula de un LMM con intercepto y pendiente aleatorios.',
          'Ajustar un LMM con lmer() (paquete lme4) y lme() (paquete nlme).',
          'Interpretar los componentes de varianza y los efectos fijos.',
          'Comparar la salida de lme4 y nlme para el mismo modelo.',
          'Extraer valores ajustados y residuales para diagnóstico posterior.',
        ],
        datasets: ['sleepstudy (lme4)'],
        content: `
## De la exploración al modelo

En el Módulo 1 vimos que cada sujeto del dataset \`sleepstudy\` parece tener su **propio intercepto y su propia pendiente** respecto a \`Days\`. Un modelo lineal mixto formaliza esta idea permitiendo que tanto el intercepto como la pendiente varíen aleatoriamente entre sujetos:

$$
\\text{Reaction}_{ij} = (\\beta_0 + b_{0i}) + (\\beta_1 + b_{1i}) \\, \\text{Days}_{ij} + \\varepsilon_{ij}
$$

$$
\\begin{pmatrix} b_{0i} \\\\ b_{1i} \\end{pmatrix} \\sim N\\left(\\begin{pmatrix}0\\\\0\\end{pmatrix}, \\mathbf{D}\\right),
\\qquad \\varepsilon_{ij} \\sim N(0, \\sigma^2)
$$

- $\\beta_0, \\beta_1$: **efectos fijos** — intercepto y pendiente promedio de la población.
- $b_{0i}, b_{1i}$: **efectos aleatorios** del sujeto $i$ — cuánto se desvía ese sujeto del promedio.
- $\\mathbf{D}$: matriz de covarianzas $2\\times 2$ entre intercepto y pendiente aleatorios.

## Notación en R

En \`lme4\`, la fórmula \`Reaction ~ Days + (Days | Subject)\` especifica exactamente este modelo: a la derecha de \`|\` va la variable de agrupación (\`Subject\`), y a la izquierda los términos que tienen efecto aleatorio (intercepto implícito + \`Days\`).

\`nlme::lme()\` usa una sintaxis equivalente pero separa la fórmula fija (\`fixed=\`) de la aleatoria (\`random=\`).

## Interpretando la salida

Al imprimir el resumen del modelo verás tres bloques:

1. **Random effects**: varianzas y covarianza de $b_{0i}, b_{1i}$, más la varianza residual $\\sigma^2$. La razón entre la varianza del intercepto aleatorio y la varianza total es el **coeficiente de correlación intraclase (ICC)**.
2. **Fixed effects**: estimaciones $\\hat\\beta_0, \\hat\\beta_1$ con sus errores estándar — interpretadas igual que en una regresión clásica.
3. **Correlation of Fixed Effects**: correlación entre los estimadores de los efectos fijos (no confundir con la correlación de los efectos aleatorios).
`,
        rCells: [
          {
            id: 'lmm-lme4',
            title: 'Ajuste con lme4::lmer()',
            code: `library(lme4)
data(sleepstudy)

# Intercepto y pendiente aleatorios por sujeto
mod_lme4 <- lmer(Reaction ~ Days + (Days | Subject), data = sleepstudy)

summary(mod_lme4)`,
          },
          {
            id: 'lmm-nlme',
            title: 'El mismo modelo con nlme::lme()',
            code: `library(nlme)
data(sleepstudy)

mod_nlme <- lme(
  fixed  = Reaction ~ Days,
  random = ~ Days | Subject,
  data   = sleepstudy
)

summary(mod_nlme)`,
          },
          {
            id: 'lmm-fitted',
            title: 'Valores ajustados por sujeto (lme4)',
            code: `library(lme4)
library(ggplot2)
data(sleepstudy)

mod <- lmer(Reaction ~ Days + (Days | Subject), data = sleepstudy)
sleepstudy$fitted <- fitted(mod)

# Compara la recta ajustada de cada sujeto con sus datos observados
ggplot(sleepstudy, aes(x = Days, y = Reaction)) +
  geom_point(alpha = 0.4) +
  geom_line(aes(y = fitted), color = "#2c7a7b", linewidth = 1) +
  facet_wrap(~ Subject, ncol = 6) +
  theme_minimal(base_size = 9) +
  labs(title = "Rectas ajustadas (LMM) por sujeto",
       y = "Tiempo de reaccion (ms)", x = "Dias")`,
          },
        ],
        sasExamples: [
          {
            title: 'Ajuste de un LMM con PROC MIXED',
            code: `/* Modelo con intercepto y pendiente aleatorios por sujeto */
PROC MIXED DATA=sleepstudy METHOD=REML COVTEST;
  CLASS Subject;
  MODEL Reaction = Days / SOLUTION DDFM=KENWARDROGER;
  RANDOM INTERCEPT Days / SUBJECT=Subject TYPE=UN G GCORR;
RUN;

/* TYPE=UN deja la matriz D de covarianzas sin restricciones
   (equivalente a (Days | Subject) en lme4).
   SOLUTION imprime los coeficientes de efectos fijos. */`,
          },
        ],
      },
    ],
  },

  // ---------------------------------------------------------------------
  // MÓDULOS 4-15 (definidos en modules-extra.ts)
  // ---------------------------------------------------------------------
  ...extraModules,
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
