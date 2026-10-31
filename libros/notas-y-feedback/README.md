# Notas y feedback del libro JONA

Este espacio reúne observaciones técnicas y editoriales sobre [JONA para arquitectos](../jona-para-arquitectos/README.md). Se mantiene separado del manuscrito para que el autor pueda evaluar y aplicar cada recomendación sin cambios concurrentes sobre sus capítulos.

## Criterios de revisión

- Contrastar las afirmaciones con el código y con las reglas que el propio libro declara.
- Distinguir el canon propuesto, las variantes permitidas y las desviaciones históricas; el código existente no es automáticamente correcto.
- Revisar claridad, consistencia de términos, límites de los ejemplos y consecuencias para quien adopte el patrón.
- No presentar una lectura parcial como auditoría completa, aprobación técnica o prueba de que los ejemplos compilan.

## Índice

| Nota | Alcance |
|---|---|
| [01 — Revisión inicial](01-revision-inicial.md) | Capítulos 1 y 2; contraste puntual con React y Swing |
| [02 — Verificación de cierres](02-verificacion-cierres.md) | Relectura de la evidencia de JONA-R001, R002 y R003 |
| [03 — Material nuevo y ejemplos](03-revision-material-y-ejemplos.md) | Capítulos 3–5, ejemplos originales, resultados de ejecución y correcciones concurrentes |

## Seguimiento

Cada observación conserva su identificador `JONA-Rnnn`, evidencia, impacto, recomendación y comprobación de cierre. Las líneas corresponden a la lectura fechada; el símbolo o fragmento permite localizar la evidencia si el texto se desplaza.

| Estado | Significado |
|---|---|
| Abierto | Discrepancia comprobada pendiente de corrección |
| Decisión pendiente | El autor debe precisar una regla o su alcance; la nota no elige el canon por él |
| Resuelto | Se volvió a leer la fuente y se verificó la corrección indicada |

**Prioridad:** alta si puede inducir una implementación incorrecta; media si genera una ambigüedad conceptual; baja si es editorial. La prioridad de un hallazgo resuelto es histórica, no trabajo pendiente.

Para cerrar una observación, registrar la evidencia actual y su fecha. No cerrar por una promesa de cambio ni reabrir un punto ya corregido por conservar notas antiguas.
