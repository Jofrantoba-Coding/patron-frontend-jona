# catalogo-ssr

Ejemplo del capítulo 15: la lista de productos con búsqueda y baja confirmada, renderizada en el servidor a mano. React 19 con `renderToString` y `hydrateRoot`, Vite para compilar el cliente y el servidor, y un servidor `node:http`. Las vistas se componen con el sistema de diseño del capítulo 13 (`file:../sistema-diseno-atomico`).

```bash
# antes: npm ci && npm run build en ../sistema-diseno-atomico
npm ci
npm run build   # tsc --noEmit, vite build (dist/client) y vite build --ssr (dist/server)
npm test        # vitest; artefacto.test.ts y e2e.test.ts necesitan dist/
npm start       # node dist/server/principal.js en http://127.0.0.1:4040, con el repositorio en memoria
```

Contra la API de productos, por ejemplo el BFF de `../catalogo-bff` (`npm start` allí):

```bash
REPOSITORIO=http API_URL=http://127.0.0.1:4020 npm start
```

| Variable | Por defecto | Qué hace |
|---|---|---|
| `REPOSITORIO` | `memoria` | `http` usa la API REST de `API_URL`; cualquier otro valor, el adaptador en memoria con datos de ejemplo |
| `API_URL` | `http://127.0.0.1:4020` | La API de productos (la del capítulo 14) |
| `PORT`, `HOST` | `4040`, `127.0.0.1` | Dónde escucha el servidor |

Son variables del servidor, no `VITE_*`: Vite no las compila en el cliente, y el navegador nunca ve la URL de la API. El navegador habla solo con el servidor SSR, por sus rutas JSON (`GET /api/catalogo?q=`, `DELETE /api/productos/:id`): para esta pantalla, el servidor hace de BFF. Las cabeceras `X-Usuario` y `X-Traza` de cada petición se reenvían a la API.

## Qué hay

```
src/
├── dominio/Producto.ts            el producto (copia del capítulo 14): lo usan los dos lados
├── compartido/datosIncrustados.ts cómo viajan los datos en el HTML: el servidor escribe, el cliente lee
├── ui/catalogo/                   la unidad JONA, con la Implementación partida en dos
│   ├── InterUiCatalogo.ts         contrato de UI: cara de datos (serializable) y cara de eventos (solo cliente)
│   ├── InterServicioCatalogo.ts   contrato de servicio del cliente: las rutas JSON del servidor
│   ├── UiCatalogoImplServidor.ts  Implementación del servidor: (repositorio, petición) → datos
│   ├── UiCatalogoImplCliente.ts   Implementación del cliente: un hook con estado de interacción
│   ├── UiCatalogoView.tsx         vista pura
│   ├── UiCatalogo.tsx             entrada: el mismo árbol en los dos lados
│   ├── index.ts                   API pública para el cliente
│   └── indexServidor.ts           API pública para el servidor (la Implementación del servidor)
├── cliente/                       entradaCliente.tsx (hydrateRoot), crearServicioCatalogoFetch.ts
└── servidor/                      puerto, adaptadores, raíz de composición por petición, página, servidor HTTP
    └── principal.ts               el punto de entrada del proceso (dist/server/principal.js)
index.html                         la plantilla, con <!--ssr-html--> y <!--ssr-datos-->
```

## Decisiones

- **`renderToString`, no `renderToPipeableStream`.** Los datos se cargan antes de dibujar (la Implementación del servidor es una función que se espera) y no hay límites de Suspense que valga la pena enviar antes. Con todo el HTML en mano, el código de estado se decide antes del primer byte. El streaming conviene cuando parte de la página puede salir antes que sus datos.
- **El sistema de diseño queda dentro de `dist/server`.** Llega enlazado con `file:`, y `vite build --ssr` no externaliza los paquetes enlazados: lo empaqueta, y sus imports de `react` quedan como imports externos que Node resuelve con la copia de este ejemplo. React y `react-dom` sí quedan fuera del bundle.
- **La plantilla se rellena con funciones de reemplazo.** Con un texto como reemplazo, un `$&` en el nombre de un producto se interpretaría como patrón de `String.replace`.

| Prueba | Qué protege |
|---|---|
| `src/ui/catalogo/UiCatalogoImplServidor.test.ts` | La Implementación del servidor sin DOM: llena la cara de datos, que sobrevive a `JSON.parse(JSON.stringify(x))`; aviso si el repositorio falla; la baja |
| `src/ui/catalogo/UiCatalogo.test.tsx` | La Implementación del cliente por la entrada: no vuelve a cargar al montarse, busca y elimina por el servicio, errores; sin servicio no hace nada |
| `src/ui/catalogo/UiCatalogoView.test.tsx` | Punto de sustitución 1: la vista con los DEFAULTS y datos literales |
| `src/ui/catalogo/hidratacion.test.tsx` | `renderToString` y `hydrateRoot` del mismo árbol: cero errores recuperables y cero avisos; un componente que lee el reloj, o datos distintos, sí fallan |
| `src/servidor/renderizarPagina.test.tsx` | Un nombre con `</script>`, `<!--` y `$&` no rompe la página; con `JSON.stringify` a secas, sí |
| `src/servidor/crearRaizComposicion.test.ts` | Puntos 2 y 3: `memoria` por defecto, `http` con `API_URL`; un repositorio por petición, con su usuario, también en concurrencia |
| `src/servidor/crearServidorSsr.test.ts` | La página, las rutas JSON, los estáticos sin salir de su carpeta, dos usuarios concurrentes |
| `src/servidor/adaptadores/adaptadores.test.ts` | Los dos adaptadores pasan la suite de contrato del capítulo 14; el HTTP reenvía las cabeceras |
| `src/cliente/crearServicioCatalogoFetch.test.ts` | El adaptador del cliente contra el servidor SSR |
| `test/artefacto.test.ts` | `dist/client` no contiene la marca del adaptador HTTP (`jona-catalogo-ssr/adaptador-http`) ni `API_URL`; `dist/server` sí |
| `test/e2e.test.ts` | El servidor compilado en un puerto libre: la página con los productos, una baja, el bundle; y con `REPOSITORIO=http` |
| `test/architecture/arquitectura.test.ts` | Las cuatro reglas, cada una con sus árboles de violación en `test/fixtures/` |

## Las cuatro reglas (`test/architecture`)

1. **Lo del servidor no llega al navegador.** Es código del servidor todo lo de `servidor/` y todo módulo cuyo nombre termina en `Servidor`. El resto (`cliente/`, `ui/`, `compartido/`, `dominio/`) no lo importa, ni importa `node:*` ni `react-dom/server`.
2. **La cara de datos es serializable.** En los contratos `Inter*.ts`, los tipos `Datos*` solo tienen, con el verificador de tipos y recorriendo los tipos que usan, textos, números, booleanos, `null`, arreglos y objetos de lo mismo. Ni funciones, ni métodos, ni instancias de clases o de la biblioteca estándar (`Date`, `Map`, `Set`).
3. **Las vistas son puras.** Un `*View.tsx` no usa `window`, `document`, `globalThis`, `navigator`, `location`, `localStorage`, `sessionStorage`, `performance` ni `crypto`, no llama a `Date.now` ni a `Math.random`, y no crea fechas.
4. **En el servidor, nada de estado de módulo.** Un módulo del servidor lo comparten todas las peticiones del proceso. A nivel de módulo solo hay imports, tipos, funciones, clases y `const` con valores literales (también funciones flecha, y expresiones regulares sin `g` ni `y`). Un `let`, o un `const` que llama a una fábrica, es un singleton: la raíz de composición exporta una fábrica, no una instancia. `servidor/principal.ts`, el punto de entrada del proceso, es la excepción.
