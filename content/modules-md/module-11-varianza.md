# Módulo 11 · Estructuras de varianza avanzadas y matrices de trabajo

Las estructuras de correlación y varianza determinan qué tan eficientes son nuestras estimaciones. En `nlme` podemos especificar correlaciones con `corSymm`, `corAR1`, `corCompSymm`, `corExp` y varianzas heterocedásticas con `varIdent` o `varPower`. En GEE, la “estructura de trabajo” sirve para modelar parcialmente la correlación entre visitas y afecta la eficiencia sin sesgar los estimadores.

## Aplicación clínica

Usamos un dataset con biomarcadores repetidos donde la varianza aumenta con el tiempo o difiere entre tratamientos. El objetivo es mostrar cómo comparar AIC/BIC en LMM y cómo usar la matriz de correlación de trabajo en GEE para decidir si vale la pena una estructura más rica.

## Flashcard

**Flashcard:** ¿Qué estructura de varianza usarías si notas que la varianza de la respuesta crece con el tiempo?
**Respuesta:** `varPower` o `varIdent` para capturar heterocedasticidad.
