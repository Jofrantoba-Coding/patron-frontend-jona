# Costo de cambio: la misma pantalla con y sin JONA

Ejemplo del capítulo 10 («Decisiones y compromisos: cuándo usar JONA y cuándo no»).

La misma pantalla de login está escrita dos veces: **directo** (un módulo, sin patrón) y **jona** (forma mínima, variante a). A las dos se les aplican los mismos cinco pedidos de cambio, y una herramienta mide cuánto costó cada uno. Los números del capítulo salen de `resultados.json`, y una prueba falla si dejan de coincidir con el código.

## Cómo correrlo

Requiere Node 22.

```bash
npm ci
npm test        # compila con tsc y corre node --test sobre dist/
npm run medir   # vuelve a medir, reescribe resultados.json e imprime las tablas en Markdown
```

## Las dos variantes

| Variante | Archivos de v0 | Qué hay |
|---|---|---|
| `directo` | `src/login.ts` | Controles, estado, llamada con `fetch`, traducción de errores y mensajes en una sola función. Escrita como lo haría alguien competente sin patrón: corta y legible, no un hombre de paja. |
| `jona` | `InterUiLogin.ts`, `UiLoginImpl.ts`, `UiLoginView.ts`, `UiLogin.ts`, `InterAuthService.ts`, `AuthServiceHttp.ts`, `AuthServiceFake.ts`, `ApiError.ts` | Contrato de UI con `DEFAULTS`, Implementación (estado y mensajes, única que usa el servicio), Vista (solo pinta), entrada que compone las dos con el servicio inyectado, adaptador HTTP, servicio falso y modelo de error `ApiError`. |

Las dos muestran los mismos textos y se comportan igual. `comun/pantalla.ts` es un juego de controles sin DOM (la «plataforma»): es común y no se mide.

## Los pedidos de cambio

Cada pedido es una **copia completa de v0 con solo ese cambio**, no una acumulación: `variantes/<variante>/<pedido>/`.

| Pedido | Carpeta | Qué pide |
|---|---|---|
| C1 | `estilo-boton` | El botón dice «Entrar» y usa la clase `boton-acento`. |
| C2 | `campo-recordarme` | Casilla «Recordarme» cuyo valor viaja al backend (`recordarme`). |
| C3 | `formato-backend` | El backend cambia el formato de cable: `usuario` pasa a `correo`, el token llega en `accessToken` y el error llega como `{ error: { code, message, fields: [{ name, message }] }, traceId }`. La pantalla no cambia. |
| C4 | `segunda-vista` | Una vista compacta (sin título, error de cada campo dentro del control) con la misma lógica y los mismos mensajes. |
| C5 | `prueba-bloqueado` | Una prueba del usuario bloqueado (403) sin servidor real. |

### Reglas para escribir un cambio

- **Mínimo:** solo lo que el pedido exige, más la prueba que alguien agregaría por ese comportamiento.
- **Natural en cada variante:** en `directo`, la segunda vista es una opción `compacto` en la misma función; en `jona`, una Vista y una entrada nuevas sobre la misma Implementación.
- **Sin hombre de paja:** nada se escribe peor a propósito para que la otra variante gane.
- **Las pruebas de cada instantánea viven en su carpeta `test/`**, así un cambio que solo toca pruebas también se mide.

## Cómo se verifica

| Prueba | Qué garantiza |
|---|---|
| `test/comportamiento.test.ts` | Una suite común corre contra cada (variante, instantánea) con un backend falso a nivel de cable (`test/backendFalso.ts`, sin red): éxito, clave incorrecta, usuario bloqueado, campos vacíos (detalles del 422), error del servidor, sin red, doble envío y limpieza de errores. Además comprueba lo que pide cada cambio y que nada más cambió. |
| `variantes/*/*/test/*.test.ts` | Las pruebas propias de cada instantánea (las que se miden). |
| `test/medir.test.ts` | El contador de líneas y la diferencia por LCS. |
| `test/resultados.test.ts` | `resultados.json` es igual a la medición de hoy. |

## Qué se mide

`herramientas/medir.ts`, para cada variante:

- **Costo base de v0:** archivos y líneas, separando producción (`src/`) y pruebas (`test/`).
- **Por cambio, contra v0:** archivos tocados y nuevos, líneas agregadas y eliminadas (producción y pruebas por separado) y si se tocó el archivo que guarda el estado y decide qué mostrar (`src/login.ts` en directo, `src/UiLoginImpl.ts` en jona).

Una «línea» es una línea de código: no cuentan las líneas en blanco ni las que son solo comentario. La diferencia es una LCS por líneas que ignora los espacios; una línea modificada cuenta como una eliminada y una agregada.

## Límites de la medición

- Es una sola pantalla y pequeña: el costo fijo de JONA pesa más aquí que en una aplicación con muchas pantallas que comparten servicio y contratos.
- Las líneas son un indicador del esfuerzo, no el esfuerzo. No miden el riesgo de tocar la lógica ni lo que cuesta revisar el cambio.
- Algunas decisiones influyen en los números y están a la vista: `AuthServiceFake.ts` cuenta como producción porque vive en `src/`; el adaptador de jona traduce los nombres de campo del backend a los del contrato (`email`, `password`), lo que mantiene a C3 fuera de la Implementación; en C2 el parámetro `remember` es opcional en el contrato.
