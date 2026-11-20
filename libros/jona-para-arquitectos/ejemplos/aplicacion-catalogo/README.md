# aplicacion-catalogo

Ejemplo del capítulo 14: un catálogo de productos con alta, consulta, modificación y baja, organizado con Feature-Sliced Design entre unidades, Clean/Hexagonal en el modelo y JONA dentro de cada unidad. Las vistas se componen con el sistema de diseño del capítulo 13, que llega como paquete (`file:../sistema-diseno-atomico`).

```bash
# antes: npm ci && npm run build en ../sistema-diseno-atomico
npm ci
npm run build   # tsc --noEmit y vite build
npm test        # vitest: dominio, caso de uso, suite de contrato (memoria y HTTP), pantallas, de punta a punta y arquitectura
npm run dev     # con el adaptador en memoria; VITE_REPOSITORIO=http y VITE_API_URL para una API REST
```

## Capas

| Capa | Qué contiene | Unidades JONA |
|---|---|---|
| `app` | Raíz de composición (`crearRepositorio.ts`) y elección de página | Ninguna |
| `pages` | `catalogo`, `producto`: la disposición `JPageLayout` llena | Ninguna: componen entradas |
| `widgets` | `catalogo`: coordina listar y eliminar | `UiCatalogo` |
| `features` | `producto-listar`, `producto-guardar`, `producto-eliminar` | `UiListaProductos`, `UiFormularioProducto`, `UiEliminarProducto` |
| `entities` | `producto`: dominio, puerto y adaptadores | Ninguna |
| `shared` | `api/ErrorRepositorio.ts` | Ninguna |

El sistema de diseño ocupa el lugar de `shared/ui`.

## El hexágono

| Pieza | Archivo |
|---|---|
| Dominio (puro) | `entities/producto/model/Producto.ts` |
| Puerto | `entities/producto/model/InterProductoRepositorio.ts` |
| Caso de uso | `features/producto-guardar/model/guardarProducto.ts` |
| Adaptadores | `entities/producto/api/crearRepositorioMemoria.ts`, `crearRepositorioHttp.ts` |
| Suite de contrato del puerto | `entities/producto/api/contratoRepositorio.ts` (memoria y HTTP) |
| Servidor de la API para las pruebas | `test/servidorProductos.ts` |

La suite de contrato del adaptador HTTP corre contra `test/servidorProductos.ts`, un servidor de la API REST que se arranca en un puerto libre durante la prueba.

Con `CATALOGO_API_URL=<url>`, la misma suite corre contra un servidor externo, por ejemplo el BFF de `../catalogo-bff` (capítulo 15). `CATALOGO_REINICIAR=<url>[,<url>...]` son rutas de solo prueba que se llaman con `POST` antes de cada prueba para empezar vacío:

```bash
CATALOGO_API_URL=http://127.0.0.1:4020 \
CATALOGO_REINICIAR=http://127.0.0.1:4021/__pruebas/reiniciar,http://127.0.0.1:4022/__pruebas/reiniciar \
npx vitest run src/entities/producto/api/crearRepositorioHttp.test.ts
```

## Las siete reglas (`test/architecture`)

Las reglas 1 a 5 son las de `ejemplos/web-fsd` (capítulo 6). Este ejemplo agrega:

6. **Modelo sin framework.** En `model/`, lo que no es contrato ni Implementación (el dominio y los casos de uso) no importa ningún paquete.
7. **El sistema de diseño, desde `ui/` y por su raíz.** Solo los segmentos `ui/` (y `app`, para los tokens) importan `@jona-libro/ds-atomico`, y nunca una ruta interna.
