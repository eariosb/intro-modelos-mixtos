# Módulo 12 · Modelos para intervenciones y cambios en el tiempo

El cambio en políticas de salud, la implementación de una guía clínica o la introducción de un protocolo nuevo se analiza mejor con modelos que permiten distintas pendientes antes y después de la intervención. Este módulo explica cómo construir variables dependientes del tiempo y modelos piecewise dentro de un marco de medidas repetidas.

## Caso clínico

Un programa de adherencia a la medicación fue implementado en el mes 6. Los datos registran adherencia mensual durante 12 meses. Construimos variables que separan las pendientes antes y después del plazo, y añadimos un efecto aleatorio que permite a cada paciente responder con su propia aceleración.

## Quiz de comprensión

- **Pregunta:** ¿Por qué modelar dos pendientes en lugar de una sola cuando hay una intervención?
- **Respuesta:** Porque la pendiente puede cambiar después de la intervención; una sola pendiente ocultaría ese cambio.

- **Pregunta:** ¿Qué representa un efecto aleatorio en el cambio de pendiente?
- **Respuesta:** Captura cuán diferente es la respuesta de cada paciente en la magnitud del cambio.
