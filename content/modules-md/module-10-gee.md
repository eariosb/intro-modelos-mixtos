# Módulo 10 · Modelos marginales y GEE

Este módulo explora la distinción entre modelos **condicionales** (LMM/GLMM) y **marginales** (GEE). Mientras que los modelos condicionales describen trayectorias sujeto a sujeto y permiten hacer inferencia sobre los efectos aleatorios, los modelos marginales estiman la respuesta promedio poblacional y son robustos a la especificación de la distribución de los aleatorios. En contextos clínicos con gran número de sujetos y múltiples visitas, GEE es ideal para responder “¿Cuál es el efecto promedio del tratamiento a lo largo del tiempo?” sin describir a cada paciente individualmente.

## Flujo pedagógico

1. Empezamos contrastando la interpretación de coeficientes: un coeficiente en GEE describe cómo cambia la media poblacional, mientras que en GLMM describe cómo cambia la media condicional a un sujeto típico (intercepto aleatorio fijo). Esto se ilustra con datos de presión arterial de un ensayo clínico con visitas periódicas.
2. Explicamos la ecuación de estimación, el papel de la matriz de correlación de trabajo y el estimador de varianza “sándwich” robusto.
3. Realizamos una comparación práctica entre GEE y GLMM usando el mismo dataset para debatir eficiencia vs. robustez.

## Quiz rápido

- **Pregunta:** ¿Qué gana un investigador clínico al usar GEE frente a GLMM cuando tiene muchas unidades y le interesa el efecto promedio?
- **Respuesta:** obtiene estimaciones robustas del promedio poblacional sin asumir la estructura completa de los aleatorios.

- **Pregunta:** ¿Qué estructura de correlación de trabajo se recomienda probar primero?
- **Respuesta:** Independencia, como punto de partida para calcular residuos robustos, y luego estructuras más ricas si los datos lo justifican.
