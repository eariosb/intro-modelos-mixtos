# Elegir estructuras de covarianza desde los datos

Las observaciones cercanas en el tiempo comparten más información que las distantes. Por eso necesitamos pensar en la matriz de covarianza: ¿es constante (CS), decrece con la distancia (AR(1)) o debemos dejarla libre (UN)? Cada hipótesis tiene implicaciones clínicas distintas: un CS implica que la correlación entre dos visitas es la misma sin importar cuán separadas estén, mientras que AR(1) supone un efecto de amortiguación en los intervalos largos.

## Probar con `nlme`

`nlme::lme()` permite extender el modelo LMM con argumentos como `correlation = corCompSymm(...)` o `correlation = corAR1(...)`. Una tabla de comparaciones con `anova()` o `AIC()` ayuda a decidir si la estructura más compleja vale la pena.

## Interpretación para equipos clínicos

1. Explica qué se mejora al pasar de CS a AR(1) o UN (por ejemplo, la capacidad de capturar cambios rápidos en biomarcadores).
2. Usa la matriz de covarianza (`getVarCov()`) y una visualización de calor para mostrarle al equipo cómo cambian las covarianzas.
3. Mantén la comunicación sencilla: estructuras más complejas deben estar respaldadas por una mejora sustancial en el ajuste o en la plausibilidad biológica.
