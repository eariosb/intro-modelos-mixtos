# Diagnóstico con residuos simulados para cohortes hormonales

El archivo `progesterone.csv` documenta las concentraciones de progesterona en distintas fases del ciclo menstrual. Como es común en biomarcadores, la varianza cambia con el tiempo y las curvas responden de manera no lineal. Antes de confiar en los coeficientes, necesitamos diagnosticar residuos para evitar conclusiones que aumenten la ansiedad clínica.

## ¿Por qué DHARMa?

`DHARMa` genera residuos simulados que permiten revisar homocedasticidad, normalidad y valores atípicos de forma gráfica. Es una herramienta recomendada por epidemiólogos para validar LMMs y GLMMs cuando las fórmulas incluyen estructuras complejas.

## ¿Qué comunicar?

1. Usa gráficos de residuos vs fitted, QQ-plots y tests de uniformidad para justificar la validez del modelo.
2. Identifica outliers y decide si corresponden a datos reales (por ejemplo, pacientes con ciclos atípicos).
3. Si el diagnóstico falla, reflexiona si necesitas transformar variables o añadir splines.
