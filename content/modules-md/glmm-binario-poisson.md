# GLMM binomial y de Poisson para ensayos clínicos

`TOENAIL2` representa una respuesta binaria (infección) medida por paciente, mientras que `Coldfeet` registra conteos con diferentes tamaños muestrales. Ambos necesitan un marco jerárquico que incorpore efectos aleatorios para sujetos o centros.

## Binomial con interceptos aleatorios

El GLMM binomial ajusta el logit de la probabilidad con un intercepto y efectos fijos por tiempo y tratamiento. Es clave explicar al equipo clínico que la pendiente del logit refleja el cambio en la probabilidad de infección y que el intercepto aleatorio absorbe heterogeneidad no explicada.

## Poisson con offset

Al modelar `Coldfeet`, usamos el offset `log(n)` para convertir los conteos en tasas. Esto permite comparar centros con diferentes tamaños de muestra sin inflar la estimación de efectos fijos.

## Visualizaciones para comunicar

1. Gráficas de probabilidades o tasas predichas por tratamiento.
2. Resúmenes de odds ratios o razones de tasas.
3. Notas sobre convergencia y controles del optimizador (por ejemplo, `bobyqa`).
