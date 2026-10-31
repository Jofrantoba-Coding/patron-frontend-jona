# 02 — Verificación de cierres

**Lectura:** 2026-10-30, 23:00 (UTC−05:00). **Resultado:** se confirman los tres cierres documentales examinados. No se reabre ninguno.

Se identificaron como resueltos JONA-R001, JONA-R002 y JONA-R003 en la [nota inicial](01-revision-inicial.md), líneas 33–58. Se volvió a contrastar cada criterio con el capítulo y el código actuales, sin usar el estado anterior como prueba. Las líneas antiguas del capítulo se desplazaron; las referencias de esta nota corresponden a la nueva lectura.

| Hallazgo | Veredicto | Criterio comprobado |
|---|---|---|
| JONA-R001 | Confirmado | Variante b y tabla permiten que la Implementación renderice la Vista |
| JONA-R002 | Confirmado | La prescripción clásica se distingue explícitamente de la desviación heredada |
| JONA-R003 | Confirmado, para el defecto original | La explicación identifica la captura de funciones, no un estado inaccesible |

## JONA-R001 — Dependencia de Implementación hacia Vista

- **Manuscrito:** [capítulo 2](../jona-para-arquitectos/capitulos/02-anatomia.md), líneas 444–470: «La Implementación aplica los valores por defecto y renderiza la vista»; `JButtonImpl` devuelve `<JButtonView ... />` en la línea 466.
- **Código de contraste:** [JLoginImpl.tsx](../../web_ts/uijona/src/organisms/JLogin/JLoginImpl.tsx), línea 4, importa `JLoginView`; líneas 27–34 la renderizan con estado resuelto.
- **Búsqueda de contradicción:** la sección 2.8 niega expresamente la prohibición universal (línea 587), la tabla permite «Sí: renderiza la vista» para mínima b (línea 591) y el resumen conserva reglas por variante (línea 639).
- **Conclusión:** se cumple el criterio original. No se certifican aquí las exportaciones ni la conformidad de todos los componentes de `uijona`.

## JONA-R002 — Prescripción clásica y legado Swing

- **Manuscrito:** [capítulo 2](../jona-para-arquitectos/capitulos/02-anatomia.md), línea 288: «Es una prescripción, no una descripción del código existente»; el mismo párrafo reconoce el acceso directo a controles y datos en `softcommerce-desktop`.
- **Código de contraste:** [UiLoginImpl.java](../../desktop_java/softcommerce-desktop/src/com/develtrex/softcommerce/view/ui/uilogin/UiLoginImpl.java), líneas 65–72: `loadMultiEmpresa` consulta `LogicBdEmpresa` y ejecuta `cboMultiEmpresa.setModel(...)` y `setSelectedIndex(0)`.
- **Búsqueda de contradicción:** la comparación de la línea 284 se limita a instanciar la Impl como entrada; no afirma conformidad completa del legado. La nota histórica de la línea 627 trata nombres anteriores y reconoce que existen antipatrones.
- **Conclusión:** la discrepancia documental está resuelta. El código heredado sigue desviándose de la prescripción; su reparación nunca fue el criterio de este cierre.

## JONA-R003 — Captura de funciones en manejadores

- **Manuscrito:** [capítulo 2](../jona-para-arquitectos/capitulos/02-anatomia.md), línea 581: un manejador base que invoque `onSubmit` ejecutaría «la versión por defecto». El ejemplo lee `base.email` y `base.password` (líneas 554 y 560), y sustituye la propiedad `onSubmit` del modelo devuelto (líneas 570–571).
- **Código de contraste:** [modelo base](../../web_ts/appjona_codex_react_hooks/src/views/uiiniciarsesion/UiIniciarSesionTemplateModel.ts), líneas 52–54 y 84–90: `handlerLogin` llama al `login` declarado en ese ámbito. La [Implementación](../../web_ts/appjona_codex_react_hooks/src/views/uiiniciarsesion/UiIniciarSesionImpl.ts), líneas 48–55 y 67–74, declara el motivo y devuelve tanto `login` como su manejador de reemplazo.
- **Búsqueda de contradicción:** la descripción de estado compartido y las lecturas de `base` son compatibles con el diagnóstico de captura léxica. No reaparece la explicación de que el estado sea inaccesible.
- **Conclusión:** se confirma el cierre del defecto original. Se mantiene la recomendación editorial de limitar «la composición no tiene enlace tardío» a esta composición concreta de hooks y cierres: esta verificación no valida esa frase como propiedad universal de toda composición.

## Trazabilidad y límites

- Capítulo 2 leído: SHA-256 `9B0142C97258E5CCDC7C50C2117D8EF381E2ACCF933EEA2AAFF13B46824464A4`.
- Revisión estática y documental; sin pruebas, compilación ni comprobación de ejecución de los ejemplos.
- No se revisaron JONA-R004/JONA-R005 ni se emitió aprobación general del libro. Los cierres anteriores se conservan como historia en la nota 01.
- El manuscrito está en edición concurrente: un cambio posterior requiere comprobar de nuevo los pasajes afectados, no extrapolar este resultado.
