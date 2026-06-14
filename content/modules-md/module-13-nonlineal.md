# Módulo 13 · Más allá de la normalidad: GAMM y alternativas robustas

Los modelos aditivos mixtos (`mgcv::gamm`) permiten capturar curvas suaves sin imponer una forma paramétrica. En contextos pediátricos o de biomarcadores, las trayectorias no son lineales, y GAMM combina la flexibilidad de GAM con los efectos aleatorios de los LMM.

## Flujo del módulo

1. Construye una base spline suave para tiempo y añade efectos aleatorios en el intercepto y la pendiente.
2. Usa `mgcv::gamm()` para ajustar y visualiza tanto la curva marginal como los perfiles individuales.
3. Discute transformaciones y distribuciones t para abordar la falta de normalidad, y sugiere bootstrap paramétrico para inferencia robusta.

## Flashcard

**Flashcard:** ¿Qué ventaja tiene usar GAMM sobre un LMM tradicional?
**Respuesta:** Captura la no linealidad sin tener que especificar manualmente polinomios o knots.
