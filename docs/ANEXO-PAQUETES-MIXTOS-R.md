# Anexo: paquetes de R para modelos mixtos

Guía de selección y referencia para ampliar el curso. La selección prioriza
paquetes mantenidos, métodos documentados y herramientas que resuelven
preguntas estadísticas diferentes. No existe un paquete que sea el mejor para
todos los diseños, respuestas y estructuras de covarianza.

## Cómo elegir antes de instalar

1. Define el estimando: efecto específico de una unidad (condicional) o efecto
   promedio poblacional (marginal).
2. Clasifica la respuesta: continua, binaria, conteo, ordinal, tiempo hasta
   evento o multivariada.
3. Separa las fuentes de dependencia: efectos aleatorios `G`, correlación
   residual `R`, agrupamiento, parentesco o medidas repetidas.
4. Comprueba si necesitas heterocedasticidad, correlación residual, exceso de
   ceros, matrices de parentesco o inferencia bayesiana.
5. Antes del ajuste, revisa versión, documentación y restricciones del paquete.
   Las sintaxis de covarianza —en particular en `sommer`— pueden cambiar entre
   versiones.

El modelo lineal mixto se puede expresar como

$$
y = X\beta + Zb + \varepsilon,\qquad
b\sim N(0,G),\qquad
\varepsilon\sim N(0,R),\qquad
\operatorname{Var}(y)=ZGZ^\top+R.
$$

`G` describe covariación entre efectos aleatorios; `R` describe la varianza y
correlación residual. Una pendiente aleatoria modifica `G`; una AR(1) residual
modifica `R`. No son intercambiables, aunque ambos pueden inducir correlación
entre observaciones de una misma unidad.

## Vista general de paquetes

### Modelos lineales y generalizados

| Paquete | Cuándo considerarlo | Alcance y cautelas | Documentación |
|---|---|---|---|
| [`lme4`](https://cran.r-project.org/package=lme4) | Punto de partida para LMM y GLMM con efectos aleatorios anidados o cruzados. | `lmer()` y `glmer()` son eficientes y ampliamente usados. No ofrece una interfaz general para estructuras residuales AR(1) o heterocedásticas. | [Referencia](https://cran.r-project.org/web/packages/lme4/lme4.pdf), [vignettes](https://cran.r-project.org/web/packages/lme4/vignettes/) |
| [`nlme`](https://cran.r-project.org/package=nlme) | Medidas repetidas cuando se necesita modelar `R`, heterocedasticidad o correlación residual explícita. | `lme()` y `gls()` ofrecen `corStruct` (`corAR1`, `corCompSymm`, `corSymm`) y `varStruct` (`varIdent`, `varPower`). Los efectos aleatorios cruzados complejos son menos cómodos que en `lme4`. | [Referencia](https://cran.r-project.org/web/packages/nlme/nlme.pdf) |
| [`glmmTMB`](https://cran.r-project.org/package=glmmTMB) | GLMM con sobredispersión, inflación de ceros, distribuciones flexibles o varios predictores de la distribución. | Sintaxis cercana a `lme4`; confirmar soporte y parametrización para la familia elegida. | [Referencia](https://cran.r-project.org/web/packages/glmmTMB/glmmTMB.pdf), [vignettes](https://cran.r-project.org/web/packages/glmmTMB/vignettes/) |
| [`GLMMadaptive`](https://cran.r-project.org/package=GLMMadaptive) | GLMM, especialmente datos agrupados y modelos con cuadratura adaptativa. | La cuadratura adaptativa puede ser precisa, pero el costo crece con la dimensión de los efectos aleatorios. No hay un ganador universal en sesgo o convergencia: comparar según el diseño y la estimación buscada. | [Referencia](https://cran.r-project.org/web/packages/GLMMadaptive/GLMMadaptive.pdf) |
| [`MASS`](https://cran.r-project.org/package=MASS) | Exploración de `glmmPQL()` para GLMM mediante cuasi-verosimilitud penalizada. | No es máxima verosimilitud completa; no usar AIC/LRT como si lo fuera ni tratar inferencia aproximada como sustituto general de un GLMM likelihood-based. | [Referencia](https://cran.r-project.org/web/packages/MASS/MASS.pdf) |
| [`mbest`](https://cran.r-project.org/package=mbest) | Evaluación de modelos mixtos anidados de gran tamaño con estimadores de momentos. | Método, supuestos, mantenimiento y compatibilidad deben verificarse en la versión instalada antes de adoptarlo en producción. | [CRAN](https://cran.r-project.org/package=mbest) |

### Estructuras de covarianza, parentesco y genética

| Paquete | Cuándo considerarlo | Alcance y cautelas | Documentación |
|---|---|---|---|
| [`sommer`](https://cran.r-project.org/package=sommer) | Matrices `G` flexibles, parentesco/pedigree/genómica, múltiples efectos aleatorios y genética cuantitativa. | Incluye funciones como `mmer()` y estructuras `vsm()`/`ism()`/`usm()` en las versiones recientes. La sintaxis depende de la versión; leer la vignette correspondiente. | [Manual CRAN](https://cran.r-project.org/web/packages/sommer/sommer.pdf), [repositorio y vignettes](https://github.com/covaruber/sommer) |
| [`LMMstar`](https://cran.r-project.org/package=LMMstar) | Medidas repetidas con estructuras residuales explícitas y procedimientos de inferencia del paquete. | Verificar qué estructuras y métodos admite la versión concreta y cómo parametriza datos faltantes y grados de libertad. | [CRAN](https://cran.r-project.org/package=LMMstar) |
| [`lme4breeding`](https://cran.r-project.org/package=lme4breeding) | Modelos de mejoramiento con matrices de relación y flujo de trabajo cercano a `lme4`. | Revisar compatibilidad de matrices, escalamiento, identificadores y versiones de `lme4`. | [CRAN](https://cran.r-project.org/package=lme4breeding) |
| [`pedigreemm`](https://cran.r-project.org/package=pedigreemm) | Análisis que incorporan parentesco de pedigrí mediante la infraestructura histórica del paquete. | Interfaz y mantenimiento menos actuales que alternativas recientes; considerar compatibilidad y reproducibilidad antes de iniciar un proyecto nuevo. | [CRAN](https://cran.r-project.org/package=pedigreemm) |
| [`ASReml-R`](https://asreml.kb.vsni.co.uk/) | Diseños y estructuras de covarianza avanzadas en mejoramiento, agronomía y experimentos complejos. | Software comercial con licencia; documentar versión, licencia, método y opciones utilizadas. | [Knowledge Base oficial](https://asreml.kb.vsni.co.uk/) |
| [`gremlin`](https://cran.r-project.org/package=gremlin) | Modelos animales/genéticos con estructuras de parentesco y casos donde se emplean inversas generalizadas. | No es una solución automática para cualquier matriz singular: revisar identificabilidad y condiciones del modelo. | [CRAN](https://cran.r-project.org/package=gremlin) |

### Enfoques bayesianos

| Paquete | Cuándo considerarlo | Alcance y cautelas | Documentación |
|---|---|---|---|
| [`brms`](https://cran.r-project.org/package=brms) | Modelos multinivel, no lineales, multivariados y familias flexibles con inferencia bayesiana. | Sintaxis de fórmulas accesible; requiere compilación y cómputo MCMC. Revisar convergencia, tamaño efectivo, prior predictive checks y sensibilidad a priors. | [Manual](https://cran.r-project.org/web/packages/brms/brms.pdf), [vignettes](https://cran.r-project.org/web/packages/brms/vignettes/) |
| [`rstanarm`](https://cran.r-project.org/package=rstanarm) | Transición a modelos bayesianos con interfaces familiares (`stan_lmer`, `stan_glmer`). | Los priors forman parte del modelo; revisar su efecto y diagnósticos MCMC, no solo la similitud sintáctica con `lme4`. | [Manual](https://cran.r-project.org/web/packages/rstanarm/rstanarm.pdf) |
| [`MCMCglmm`](https://cran.r-project.org/package=MCMCglmm) | Covarianzas multivariadas, estructuras genéticas, filogenéticas o de parentesco con MCMC. | Exige especificar priors y diagnosticar cadenas, mezcla, convergencia y sensibilidad. | [CRAN](https://cran.r-project.org/package=MCMCglmm) |
| [`blme`](https://cran.r-project.org/package=blme) | Regularización mediante priors en modelos de la familia `lme4`. | Puede estabilizar estimaciones; no reemplaza el diagnóstico de identificabilidad ni justifica una estructura aleatoria sobredimensionada. | [CRAN](https://cran.r-project.org/package=blme) |

### Inferencia, selección, visualización y casos especiales

| Paquete | Utilidad | Cautela | Documentación |
|---|---|---|---|
| [`lmerTest`](https://cran.r-project.org/package=lmerTest) | Pruebas y grados de libertad aproximados para modelos `lmer`. | Los valores p dependen de aproximaciones como Satterthwaite o Kenward–Roger; reportar cuál se usó. | [CRAN](https://cran.r-project.org/package=lmerTest) |
| [`broom.mixed`](https://cran.r-project.org/package=broom.mixed) | Convertir salidas de modelos mixtos en tablas para reportes y gráficos. | Revisar qué componentes exporta el método `tidy()` del modelo concreto. | [CRAN](https://cran.r-project.org/package=broom.mixed) |
| [`cAIC4`](https://cran.r-project.org/package=cAIC4) | Criterio AIC condicional para comparar estructuras de efectos aleatorios en casos admitidos. | Confirmar que los modelos son comparables y que el método soporta la clase del ajuste. | [CRAN](https://cran.r-project.org/package=cAIC4) |
| [`buildmer`](https://cran.r-project.org/package=buildmer) | Automatizar ajustes o selección de términos bajo un criterio explícito. | La selección automatizada puede sesgar inferencia y producir modelos inestables; no sustituye la justificación científica ni validación. | [CRAN](https://cran.r-project.org/package=buildmer) |
| [`gamm4`](https://cran.r-project.org/package=gamm4) | Modelos aditivos generalizados con efectos aleatorios, combinando `mgcv` y `lme4`. | Revisar la familia y las limitaciones de correlación/covarianza de cada motor. | [CRAN](https://cran.r-project.org/package=gamm4) |
| [`dhglm`](https://cran.r-project.org/package=dhglm) | Modelos doblemente jerárquicos para modelar media y dispersión. | Es un modelo especializado; verificar supuestos y parametrización de la varianza. | [CRAN](https://cran.r-project.org/package=dhglm) |
| [`tramME`](https://cran.r-project.org/package=tramME) | Modelos mixtos de transformación para respuestas ordinales, censuradas o de supervivencia, según la familia. | Interpretación distinta a la de un LMM/GLMM estándar; apoyarse en la documentación y escala del modelo. | [CRAN](https://cran.r-project.org/package=tramME) |

La lista oficial de tareas es un punto de partida amplio, no una recomendación
de instalar todos los paquetes: [CRAN Task View: Mixed Models](https://CRAN.R-project.org/view=MixedModels).

## Ruta práctica de selección

| Pregunta del análisis | Punto de partida |
|---|---|
| LMM con agrupamientos cruzados/anidados; GLMM usual | `lme4` |
| Medidas repetidas con AR(1), simetría compuesta o varianza por grupo | `nlme` |
| GLMM con sobredispersión, ceros extra o familia flexible | `glmmTMB` |
| Matriz de parentesco/genómica o covarianza aleatoria construida a medida | `sommer`; en contexto comercial, evaluar `ASReml-R` |
| Inferencia bayesiana flexible | `brms`, `rstanarm` o `MCMCglmm`, según el tipo de covarianza |
| GEE / estimando poblacional marginal | `geepack` (no es un GLMM; define otro estimando) |
| Curvas no lineales suaves con efectos aleatorios | `gamm4` o `mgcv`, según la estructura requerida |

## Criterios estadísticos que evitan errores comunes

- **No confundir `G` y `R`.** El intercepto aleatorio produce correlación
  marginal; AR(1) residual describe una dependencia que queda después de
  condicionar en los efectos aleatorios.
- **No elegir por una tabla de benchmarks aislada.** Precisión, sesgo,
  convergencia y velocidad dependen de tamaño muestral, número de grupos,
  dimensión aleatoria, distribución y parametrización. No hay un paquete
  universalmente más preciso.
- **ML/REML:** para comparar efectos fijos distintos, usar ML. Si se comparan
  estructuras de covarianza manteniendo exactamente la misma parte fija, seguir
  el procedimiento recomendado por el motor; para comparaciones de verosimilitud
  entre implementaciones o especificaciones, ML ofrece una base común. Reajustar
  el modelo final con REML cuando corresponda.
- **Pruebas de componentes de varianza:** la hipótesis nula de varianza cero
  está en la frontera del espacio paramétrico. La distribución usual
  $\chi^2_1$ para LRT puede no ser válida; usar inferencia recomendada para el
  caso, como bootstrap paramétrico, y describir el método.
- **Convergencia:** un warning no se resuelve a ciegas aumentando iteraciones.
  Centrar/escalar predictores, revisar escalas y diseño, inspeccionar matriz de
  covarianza y considerar simplificar una estructura no identificable.
- **Selección automática:** AIC/BIC son herramientas de comparación, no
  sustitutos del diseño, los objetivos ni el diagnóstico de residuos.
- **Reproducibilidad:** registrar `sessionInfo()`, versiones de R y paquetes,
  código, semilla, criterios de optimización y opciones de estimación.

### Instalación y registro de entorno

```r
install.packages(c("lme4", "nlme", "glmmTMB", "sommer"))

sessionInfo()
packageVersion("sommer")
```

La instalación de ASReml-R se realiza conforme a su licencia y distribución
oficial, no mediante `install.packages()` desde CRAN.

## Bibliografía metodológica sugerida

- Pinheiro, J. C. y Bates, D. M. (2000). *Mixed-Effects Models in S and S-PLUS*.
- Fitzmaurice, G. M., Laird, N. M. y Ware, J. H. (2011). *Applied Longitudinal Analysis*.
- McCulloch, C. E., Searle, S. R. y Neuhaus, J. M. (2008). *Generalized, Linear, and Mixed Models*.
- Bolker, B. M. et al. (2009). Generalized linear mixed models: a practical guide for ecology and evolution. *Trends in Ecology & Evolution*.
- Documentación y vignettes oficiales enlazadas arriba. Verificar siempre la versión vigente al preparar un análisis reproducible.
