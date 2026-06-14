# Caso integrador: progesterona y splines penalizados

Revisamos el dataset `progesterone.csv` de concentraciones hormonales a lo largo del ciclo menstrual. Para capturar las curvaturas suaves usamos bases spline y luego diagnosticamos residuos.

## Flujo integrador

1. Explora la estructura del ciclo: identifica fases y tendencias.
2. Ajusta un LMM con splines (`bs(time, degree = 3, knots = c(-4, 0, 4))`) y efectos aleatorios en tiempo.
3. Visualiza predicciones marginales para los grupos y comparte la incertidumbre con bandas de confianza.
4. Usa DHARMa para validar la distribución de residuos y documenta cualquier desviación.

## Ampliaciones

Comenta extensiones posibles: modelos no lineales mixtos, modelos bayesianos con priors suaves, o análisis de sensibilidad con diferentes estructuras de covarianza.
