# 01 — Revisión inicial

**Fecha de lectura:** 2026-10-30. **Resultado:** las tres discrepancias detectadas en la lectura anterior ya fueron corregidas; quedan dos aclaraciones del capítulo 2 para decisión del autor.

## Alcance y límites

Lectura acotada de [capítulo 1](../jona-para-arquitectos/capitulos/01-que-busca-jona.md) y [capítulo 2](../jona-para-arquitectos/capitulos/02-anatomia.md), con contraste puntual de `JLogin` en `uijona`, el login extendido de `appjona_codex_react_hooks` y el login Swing heredado. El manuscrito cambió entre ambas lecturas: esta nota usa la versión más reciente observada, no las líneas antiguas.

No se modificó el manuscrito ni se ejecutaron ejemplos, pruebas o compilaciones. No se verificaron las fuentes externas del capítulo 1 ni el resto del repositorio. Esta nota no constituye una aprobación integral.

## Decisiones pendientes

### JONA-R004 — Precisar cuándo existe un contrato de servicio

**Prioridad:** media. **Estado:** Decisión pendiente. **Tipo:** tensión interna comprobada; alcance normativo por confirmar.

- **Evidencia:** [capítulo 2](../jona-para-arquitectos/capitulos/02-anatomia.md), líneas 24–29: «Una unidad JONA tiene dos contratos». Sin embargo, líneas 522–524 describen componentes de sistema de diseño sin servicios que inyectar. La tabla de la línea 738 asigna `InterAuthService` a toda forma mínima sin distinguir variantes. El [capítulo 1](../jona-para-arquitectos/capitulos/01-que-busca-jona.md), línea 255, habla más precisamente de declarar las dependencias externas que existan.
- **Impacto:** el lector podría introducir un servicio artificial en un componente puramente visual para satisfacer N1.
- **Recomendación:** si esa es la intención del canon, indicar «contrato de UI y, cuando haya integración externa, contratos de servicio»; ajustar la tabla y el resumen del capítulo 2. Si ambos fueran obligatorios, explicar cómo cumple N1 la variante sin servicios.
- **Comprobación de cierre:** un componente visual sin dependencias externas y una pantalla con autenticación pueden clasificarse sin contradicción usando N1, la variante b y la tabla 2.9.

### JONA-R005 — Delimitar las entradas de demostración de la forma extendida

**Prioridad:** media. **Estado:** Decisión pendiente. **Tipo:** contradicción de alcance comprobada.

- **Evidencia:** [capítulo 2](../jona-para-arquitectos/capitulos/02-anatomia.md), línea 679, recomienda «otra entrada», por ejemplo Storybook, que componga la vista con `useUiLoginBase()`. La tabla de dependencias, línea 728, establece que la entrada nunca depende del modelo base.
- **Impacto:** un ejemplo de demostración recomendado por el libro incumpliría una lectura literal de su propia tabla o de una futura regla automática.
- **Recomendación:** distinguir entrada de producción y composición de demostración/prueba, explicitando la excepción y su ubicación; alternativamente, permitir ambas composiciones en la tabla. Evitar una prohibición universal que invalide el caso explicado.
- **Comprobación de cierre:** la entrada productiva y la historia que conecta vista + modelo base tienen una clasificación explícita y cumplen las reglas de dependencia correspondientes.

## Correcciones verificadas

### JONA-R001 — Dependencia de Implementación hacia Vista

**Prioridad histórica:** alta. **Estado:** Resuelto en la lectura del 2026-10-30.

- **Evidencia:** [JLoginImpl.tsx](../../web_ts/uijona/src/organisms/JLogin/JLoginImpl.tsx), líneas 4 y 27–34, importa y renderiza `JLoginView`. La antigua prohibición universal ya no aparece: [capítulo 2](../jona-para-arquitectos/capitulos/02-anatomia.md), líneas 522–559 y 687–718, distingue variantes y permite esa dependencia en `uijona`.
- **Impacto anterior:** la referencia de la forma mínima contradecía la regla general del capítulo.
- **Recomendación de mantenimiento:** conservar las reglas por variante; no volver a equiparar «sin lógica visual» con «sin componer un componente View».
- **Comprobación de cierre:** realizada mediante lectura de la variante b y su tabla; no implica certificar todos los componentes de la biblioteca.

### JONA-R002 — Regla clásica frente al código Swing heredado

**Prioridad histórica:** media. **Estado:** Resuelto en la lectura del 2026-10-30.

- **Evidencia:** [UiLoginImpl.java](../../desktop_java/softcommerce-desktop/src/com/develtrex/softcommerce/view/ui/uilogin/UiLoginImpl.java), líneas 65–72, manipula `cboMultiEmpresa`. El [capítulo 2](../jona-para-arquitectos/capitulos/02-anatomia.md), líneas 348–350, ahora identifica la prohibición como prescripción y reconoce expresamente la desviación del código heredado.
- **Impacto anterior:** el lector podía confundir una mejora normativa con una descripción fiel de toda implementación histórica.
- **Recomendación de mantenimiento:** conservar esta distinción al desarrollar los antipatrones del capítulo 12, sin tratar el legado como prueba de conformidad.
- **Comprobación de cierre:** realizada contra la advertencia explícita y el acceso directo al control en la implementación histórica.

### JONA-R003 — Motivo para reemplazar manejadores en la composición

**Prioridad histórica:** media. **Estado:** Resuelto en la lectura del 2026-10-30.

- **Evidencia:** [modelo base](../../web_ts/appjona_codex_react_hooks/src/views/uiiniciarsesion/UiIniciarSesionTemplateModel.ts), líneas 84–90: `handlerLogin` invoca su función léxica `login`. La [Implementación](../../web_ts/appjona_codex_react_hooks/src/views/uiiniciarsesion/UiIniciarSesionImpl.ts), líneas 48–55, reemplaza ese manejador. El [capítulo 2](../jona-para-arquitectos/capitulos/02-anatomia.md), línea 683, ya explica la captura de funciones base en lugar de atribuir el problema a un estado inaccesible.
- **Impacto anterior:** se confundía compartir estado con reemplazar referencias léxicas a funciones.
- **Recomendación de mantenimiento:** circunscribir la explicación a esta composición de hooks y cierres; reemplazar una propiedad del objeto devuelto no reescribe el cuerpo de los manejadores ya creados.
- **Comprobación de cierre:** realizada por lectura del modelo, la Implementación y la explicación actual; no se ejecutó una prueba de regresión.

## Próximo paso

Resolver JONA-R004 y JONA-R005 en el texto, volver a comprobar sus criterios de cierre y registrar el resultado aquí. La revisión de ejemplos ejecutables queda para cuando existan sus versiones completas.
