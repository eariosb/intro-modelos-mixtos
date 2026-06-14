# Comparar AIC, BIC y pruebas de razón de verosimilitud

El objetivo de este módulo no es encontrar el modelo "perfecto", sino recopilar evidencia de que la complejidad adicional aporta valor clínico. AIC y BIC penalizan la cantidad de parámetros y deben interpretarse junto con la plausibilidad biológica.

1. Ajusta el modelo base (intercepto aleatorio) y registra su AIC/BIC.
2. Agrega pendiente aleatoria y prueba si la diferencia de devianza es significativa con `anova()` (LRT).
3. Añade la interacción con grupo y vuelve a comparar.

Un cuadro bien diseñado con AIC, BIC y logLik facilita la conversación con colegas, especialmente cuando los criterios difieren.
