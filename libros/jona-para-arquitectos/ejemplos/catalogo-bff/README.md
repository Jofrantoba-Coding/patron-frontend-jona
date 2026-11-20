# catalogo-bff

Ejemplo del capítulo 15: un BFF (*backend for frontend*) que sirve exactamente la API REST de productos que espera el adaptador HTTP de `../aplicacion-catalogo`, componiendo dos backends de negocio simulados con contratos propios. La aplicación del capítulo 14 corre contra él sin cambiar una línea. Node, TypeScript y Vitest, sin dependencias de ejecución: solo `node:http`.

```bash
npm ci
npm run build   # tsc: comprueba src, backends y test, y emite dist/ con NodeNext
npm test        # vitest: backends, suites de contrato (falso y HTTP), manejadores, servidor, raíz y arquitectura
npm start       # catalogo en 4021, inventario en 4022 y el BFF en 4020, con datos de ejemplo
```

Con `npm start` en marcha, la aplicación del capítulo 14 usa el BFF:

```bash
cd ../aplicacion-catalogo
VITE_REPOSITORIO=http VITE_API_URL=http://127.0.0.1:4020 npm run dev
```

Y su suite de contrato HTTP (9 pruebas) corre contra el BFF; `CATALOGO_REINICIAR` son las rutas de solo prueba de los backends, que se llaman antes de cada prueba para empezar vacío:

```bash
cd ../aplicacion-catalogo
CATALOGO_API_URL=http://127.0.0.1:4020 \
CATALOGO_REINICIAR=http://127.0.0.1:4021/__pruebas/reiniciar,http://127.0.0.1:4022/__pruebas/reiniciar \
npx vitest run src/entities/producto/api/crearRepositorioHttp.test.ts
```

`node run-all.mjs` hace lo mismo en puertos libres, al final.

| Variable | Dónde | Por defecto | Qué hace |
|---|---|---|---|
| `CATALOGO_URL`, `INVENTARIO_URL` | raíz de composición (`src/app/crearBff.ts`) | `http://127.0.0.1:4021`, `:4022` | Dónde están los backends |
| `BFF_CORS_ORIGEN` | raíz de composición | `*` | Origen del navegador que puede llamar al BFF |
| `BFF_PUERTO`, `CATALOGO_PUERTO`, `INVENTARIO_PUERTO` | `arrancar.ts` | 4020, 4021, 4022 | Puertos de `npm start`; `0` elige uno libre |

## Qué hay

```
backends/                     los dos backends de negocio simulados: no son parte del BFF
├── catalogo/                 SKU, título y precio en céntimos; la regla de unicidad del SKU (422 SKU_DUPLICADO)
└── inventario/               unidades por SKU; errores { codigo, mensaje }
src/                          el BFF, hexagonal por dentro
├── api/                      InterApiProductos.ts: la API que sirve (la del capítulo 14)
├── puertos/                  InterCatalogo.ts, InterInventario.ts (un puerto por backend), ErrorBackend.ts
├── adaptadores/              crearCatalogoHttp.ts, crearInventarioHttp.ts
├── manejadores/              crearManejadoresProductos.ts: agregan, traducen y compensan
├── http/                     crearServidorBff.ts: rutas REST y normalización de errores (404, 409, 502)
└── app/                      crearBff.ts: raíz de composición, elige adaptadores y URLs
test/
├── falsos/                   un falso en memoria por backend (simulan la regla de catalogo porque simulan a catalogo)
├── contratos/                suites de contrato del consumidor: lo que el BFF necesita de cada backend
└── architecture/             tres reglas, cada una con su árbol de violación en test/fixtures/
arrancar.ts                   npm start
```

Los formatos difieren a propósito, para que haya algo que traducir:

| | La SPA (API del BFF) | catalogo | inventario |
|---|---|---|---|
| Identificador | `id` | `codigoArticulo` (`ART-0001`) | — (por SKU) |
| Nombre | `nombre` | `titulo` | — |
| Precio | `precio`, en soles | `precioCentimos`, entero | — |
| Stock | `stock` | — | `unidades` |
| Lista | arreglo | `{ datos, total }` | `{ existencias }` |
| SKU repetido | 409 | 422 `{ falla: { tipo: 'SKU_DUPLICADO' } }` | — |
| No existe | 404 | 404 `{ falla: { tipo: 'ARTICULO_INEXISTENTE' } }` | 404 `{ codigo: 'SIN_EXISTENCIA' }` |
| Backend caído | 502 (la SPA lo mapea a `red`) | — | — |

## Escrituras en dos backends

- **Alta.** Primero catalogo, que decide si el SKU ya existe. Después inventario. Si inventario falla, el BFF compensa eliminando el artículo de catalogo y responde 502; si tampoco puede deshacer, también responde 502 y lo dice en el mensaje.
- **Cambio.** Igual, y la compensación devuelve a catalogo los datos anteriores. Si cambió el SKU, se quita el registro viejo de inventario.
- **Baja.** Primero catalogo: después de ese paso el producto ya no existe para la SPA, y lo único que puede fallar (quitar sus unidades) deja un registro huérfano que nadie lista.

## Producción: mismo origen

En producción, la SPA y el BFF se sirven desde el mismo origen: un proxy inverso lleva `/api/*` al BFF (quitando el prefijo) y la SPA se compila con `VITE_API_URL=/api`. Así no hace falta CORS ni exponer los backends; `BFF_CORS_ORIGEN` solo sirve en desarrollo, con la SPA en el puerto de Vite. Este ejemplo no incluye el proxy.

| Prueba | Qué protege |
|---|---|
| `backends/backends.test.ts` | El formato propio de cada backend: céntimos, títulos, 422 con `falla.tipo`, errores `{ codigo }`, la ruta de reinicio |
| `test/falsos/falsos.test.ts` | Los falsos pasan las suites de contrato del consumidor |
| `src/adaptadores/crearCatalogoHttp.test.ts`, `crearInventarioHttp.test.ts` | Los adaptadores HTTP pasan las mismas suites contra los backends simulados; red caída, tiempo agotado y un 422 que no es conflicto |
| `src/manejadores/crearManejadoresProductos.test.ts` | Agregación en una sola llamada a inventario, traducción de formatos, el conflicto lo decide catalogo, compensación al crear y al cambiar, baja con inventario caído |
| `src/http/crearServidorBff.test.ts` | Rutas REST, normalización de errores (404, 409, 502, 500 sin detalles, 400), CORS, ninguna ruta de solo prueba en el BFF |
| `src/app/crearBff.test.ts` | La raíz con los backends reales, y la compensación de punta a punta con inventario caído |
| `test/architecture/arquitectura.test.ts` | Las tres reglas y sus árboles de violación |

## Las tres reglas (`test/architecture`)

1. **Los manejadores dependen de los puertos.** En `manejadores/` solo se importan `puertos/` y `api/`; ningún adaptador, ni la capa HTTP, ni un paquete.
2. **Solo la raíz elige adaptadores.** Fuera de `app/` (y de `adaptadores/` mismo), nadie importa `adaptadores/`.
3. **Sin reglas de negocio.** La forma detectable de una regla de unicidad es recorrer una colección comparando SKU: una llamada a `some`, `every`, `find`, `findIndex`, `findLast`, `findLastIndex` o `filter` cuya función compara una propiedad `sku` con `===`, `!==`, `==` o `!=`. El árbol `unicidad-en-el-bff` la contiene (`existentes.some((a) => a.sku === datos.sku)`) y falla. Para unir datos de dos backends, el BFF indexa con un `Map`; comparar el SKU anterior con el nuevo de un mismo artículo no es buscar en una colección y no se señala. La regla es una aproximación: atrapa la forma habitual, no toda regla de negocio posible.
