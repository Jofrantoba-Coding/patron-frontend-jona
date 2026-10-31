# Migración: de una pantalla heredada a JONA, paso a paso

Ejemplo del capítulo 11 («Migración: de código heredado a JONA y entre tecnologías»).

Una pantalla de login heredada (un solo módulo con estado, validación, `fetch`, pintado y almacenamiento del token) se migra a JONA en pasos pequeños. Tres cosas se demuestran con pruebas:

1. **El comportamiento no cambia.** La misma suite de caracterización pasa en cada paso, sin editarse.
2. **La deuda JONA solo baja.** El verificador real del capítulo 9 la mide en cada paso; nunca sube y llega a cero.
3. **Cambiar la tecnología de la vista toca solo la vista y la entrada.** Una prueba compara el paso 07 con el 08 archivo por archivo.

## Cómo correrlo

Requiere Node 22.

```bash
npm ci
npm test        # compila con tsc y corre node --test sobre dist/
npm run medir   # vuelve a medir los pasos, reescribe progreso.json e imprime la tabla en Markdown
```

## Los pasos

Cada paso es una copia completa y acumulativa del anterior: `pasos/<NN-nombre>/{src,test}`. El orden sigue al del capítulo: primero el borde del sistema (el servicio), al final la vista.

| Paso | Qué cambia | Qué demuestra |
|---|---|---|
| `00-legado` | `uilogin/UiLoginView.ts` hace todo; `App.ts` lo usa. Sin pruebas. | Punto de partida realista: límite de tiempo de 10 s, último correo recordado, token en `localStorage['tkn']`. |
| `01-caracterizacion` | Solo pruebas: la caracterización. `src` idéntico al 00. | Se fija el comportamiento actual, con sus rarezas, antes de mover nada. |
| `02-costura-servicio` | `InterAuthService` + `AuthServiceHttp`. La pantalla recibe el servicio (por defecto, el HTTP: `App` no cambia). | El HTTP y el límite de tiempo salen de la pantalla. |
| `03-servicio-falso` | `AuthServiceFake` + una suite de contrato que corre contra el falso y contra el adaptador HTTP. | Paridad de dos fuentes, en miniatura. |
| `04-implementacion` | `UiLoginImpl`: estado y decisiones, probados con el falso y sin controles. | La lógica se prueba sin pantalla ni red. |
| `05-contrato-ui` | `InterUiLogin` con `UILOGIN_DEFAULTS` (solo datos). | La unidad tiene contrato de UI. |
| `06-vista-pura` | El almacenamiento pasa a la Implementación; `crearUiLoginView()` solo pinta. | La vista no produce efectos. |
| `07-entrada` | `UiLogin` compone Implementación y Vista con el servicio inyectado; `App` importa solo la entrada y elige el adaptador. | **Deuda cero.** |
| `08-cambio-de-vista` | La vista pasa del juego imperativo (`comun/pantalla.ts`) a uno declarativo (`comun/declarativo.ts`, una función pura que produce un árbol y HTML). | Solo cambian `UiLoginView.ts`, `UiLogin.ts` y sus dos pruebas. |

### Rarezas que la caracterización conserva

- Solo el correo se valida en el cliente («Ingrese su correo.», sin petición); la clave vacía va al servidor y vuelve como detalle del 422.
- Con credenciales inválidas se borra la clave; con usuario bloqueado, no.
- El token se guarda en `localStorage['tkn']` (otras pantallas lo leen) y el último correo en `ultimoCorreo`.
- Si el servidor no contesta en 10 s, la pantalla se rinde con su propio mensaje.

## Cómo se verifica

| Prueba | Qué garantiza |
|---|---|
| `caracterizacion/suite.ts` + `pasos/*/test/caracterizacion.test.ts` | Una sola suite, corrida en cada paso desde el 01. Lee la pantalla con un adaptador por tecnología de vista (`caracterizacion/lectores.ts`), fuera de `src`. |
| `test/guardas.test.ts` | Los pasos son los esperados; el 01 no toca producción; el archivo de caracterización es idéntico en todos los pasos; entre 07 y 08 solo cambian la vista, la entrada y sus pruebas. |
| `test/deuda.test.ts` | Cada paso aprueba el trinquete con su `deuda.json`; cada lista es subconjunto de la anterior, salvo los cambios de forma declarados (ver abajo); desde 07 no hay archivo de deuda. |
| `test/progreso.test.ts` | `progreso.json` es igual a la medición de hoy; la deuda total y cada regla nunca suben; es cero desde 07 y no antes. |
| `test/copias.test.ts` | `herramientas/jona-check.ts` y `herramientas/deuda.ts` son idénticos a los de `gobierno/ts/herramientas` (una sola implementación de las reglas, copias vigiladas). |
| `pasos/*/test/*.test.ts` | Las pruebas propias de cada paso: adaptador, contrato, Implementación, contrato de UI, vista y entrada. |

### La deuda cambia de forma, pero no crece

En dos pasos aparecen entradas nuevas en `deuda.json`, siempre reemplazando a otra de la misma regla. Están declaradas, con su motivo, en `CAMBIOS_DE_FORMA` (`test/deuda.test.ts`):

- **02:** la vista deja de usar `fetch` y `setTimeout`, pero importa el adaptador por defecto y el contrato de servicio. Para el verificador, la vista sigue conociendo el servicio (N3) hasta que exista la entrada.
- **04:** con `UiLoginImpl` presente, el verificador señala en ella la falta de contrato (N1) y la nombra como entrada provisional en el mensaje de N4.

## Límites del ejemplo

- Es una sola pantalla, sin dependencias de otras pantallas ni estado global compartido más allá del almacenamiento.
- El legado ya se llamaba `UiLoginView.ts`. Un módulo que no sigue la convención de nombres es invisible para el verificador: en un legado real, el primer paso de gobierno es nombrar la unidad para poder medirla.
- La deuda no baja en los pasos 01 a 04: esos pasos compran seguridad (pruebas, costura, servicio falso), no conformidad.
- La Implementación usa `localStorage` directamente (la norma lo permite); un puerto de almacenamiento con su adaptador sería el paso siguiente.
