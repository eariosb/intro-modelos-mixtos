# Trayectorias mixtas en abetos Sitka

El dataset **SPRUCE1** proviene de un experimento con abetos Sitka medidos en cuatro ocasiones y divididos en dos tratamientos (Control vs Ozone). Cada árbol tiene su propia historia: algunos crecen de forma constante, otros aceleran o frenan su crecimiento cuando cambia la intervención.

Al separar **efectos fijos** y **aleatorios** podemos describir el patrón promedio del bosque y entender la dispersión entre sujetos. El intercepto aleatorio asume que cada árbol parte desde un punto distinto y la pendiente aleatoria permite curvas individuales.

## Exploración y visualización

Antes de ajustar cualquier modelo, visualiza los perfiles individuales (spaghetti plot) y compara la tendencia poblacional calculada por la media con las trayectorias observadas. Este paso reduce la ansiedad clínica porque clarifica qué variabilidad es legítima.

## lmer vs lme

Usamos `lme4::lmer()` para unir fórmula fija y aleatoria en una sola expresión y `nlme::lme()` cuando queremos separar las etapas de fórmula/estructura. Comparar resultados enseña cómo se estima la matriz D y qué sucede cuando la covarianza no es diagonal.

## Qué sigue

Celebra los hallazgos: si las pendientes aleatorias mejoran el ajuste, comunícalo con una tabla que contraste el modelo global frente al individual. Apóyate en las celdas R para generar gráficas, y en el bloque SAS para mostrarle al equipo otro lenguaje usado en hospitales.
