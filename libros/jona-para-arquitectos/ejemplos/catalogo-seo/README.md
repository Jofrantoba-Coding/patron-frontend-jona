# catalogo-seo

Ejemplo del capítulo 16: SEO desde tres lugares. El **sistema de diseño** del capítulo 13 (`file:../sistema-diseno-atomico`, versión 1.1.0) pone la semántica: `JHeading`, `JLink`, `JImage` y las marcas `<header>` y `<main>` de `JPageLayout`. Un mismo código se entrega de dos maneras: como **sitio estático** prerenderizado al compilar (`dist/estatico`) y desde un **servidor SSR** (`dist/server/principal.js`). Una sola auditoría SEO corre contra los dos modos, y los dos pasan. React 19 y Vite a mano, como en el capítulo 15.

```bash
# antes: npm ci && npm run build en ../sistema-diseno-atomico
npm ci
npm run build             # tsc --noEmit, vite build (dist/client), vite build --ssr (dist/server) y el sitio estático (dist/estatico)
npm test                  # vitest; artefacto, e2e y test/seo/sitio.test.ts necesitan dist/
npm start                 # el servidor SSR en http://127.0.0.1:4050
npm run preview:estatico  # dist/estatico en http://127.0.0.1:4060, con un servidor de archivos sin dependencias
```

| Variable | Por defecto | Qué hace |
|---|---|---|
| `SITIO_URL` | `https://catalogo.example` | La URL pública: base de las canónicas, del JSON-LD, del sitemap y de `robots.txt`. La leen `npm run build` (para el sitio estático) y `npm start`. Debe ser un origen, sin ruta |
| `PORT`, `HOST` | `4050` (SSR), `4060` (estático), `127.0.0.1` | Dónde escucha cada servidor |

Las pruebas que leen `dist/` esperan el sitio compilado con la `SITIO_URL` por defecto. `.example` está reservado para ejemplos y no apunta a ningún sitio real.

## Las rutas

| Ruta | Página | Estado | Se indexa | JSON-LD |
|---|---|---|---|---|
| `/` | El catálogo: un `h2` con un `JLink` por producto | 200 | Sí, canónica `/` | `ItemList` |
| `/productos/<sku>` | La ficha: `h1` con el nombre, `JImage` con `prioridad`, precio, stock y descripción | 200 | Sí, canónica propia | `Product` con `offers` en `PEN` |
| `/buscar?q=` | Los resultados de la búsqueda (formulario GET: funciona sin JavaScript) | 200 | No: `noindex, follow`, sin canónica | — |
| Cualquier otra, o un SKU que no existe | «Página no encontrada» | **404** (SSR) / `404.html` (estático) | No | — |

Más `/sitemap.xml` (solo las rutas que se indexan), `/robots.txt` (con la línea `Sitemap:`) y `/datos/productos.json`, el índice con el que busca el sitio estático.

## Qué hay

```
src/
├── dominio/Producto.ts                 el producto, con descripción e imagen
├── compartido/
│   ├── rutas.ts                        las rutas del sitio, en un solo lugar (enlaces, servidor, generador, sitemap)
│   ├── busqueda.ts                     qué es coincidir: la usan el repositorio y la búsqueda del navegador
│   └── datosIncrustados.ts             los datos para hidratar (copia del capítulo 15)
├── seo/
│   ├── InterMetadatosPagina.ts         contrato de metadatos: título, descripción, canónica, robots, Open Graph, JSON-LD
│   └── renderizarCabeza.ts             el único que dibuja la cabeza
├── ui/
│   ├── catalogo/                       UiCatalogo: el catálogo y la búsqueda (Impl del servidor con metadatosUiCatalogo)
│   ├── producto/                       UiProducto: la ficha (Impl del servidor con metadatosUiProducto)
│   ├── noencontrado/                   UiNoEncontrado: la página 404
│   ├── InterPagina.ts, Pagina.tsx      qué página se dibuja, con qué datos: viaja en el HTML
│   └── metadatosServidor.ts            elige la función de metadatos de cada página
├── cliente/                            entradaCliente.tsx (hydrateRoot), crearServicioBusquedaFetch.ts
└── servidor/
    ├── resolverPagina.ts               URL → página y estado (200 o 404): el núcleo de los dos modos
    ├── componerDocumento.tsx           página → documento completo: cabeza, cuerpo y datos
    ├── sitemap.ts                      rutas indexables, sitemap.xml y robots.txt
    ├── crearServidorSsr.ts             modo 2: el servidor SSR
    ├── generarSitioEstatico.ts         modo 1: el sitio estático
    ├── crearServidorEstatico.ts        el servidor de archivos de la previsualización
    └── principal.ts, generarEstatico.ts, previsualizarEstatico.ts   los tres procesos
test/
├── seo/auditarSeo.ts                   la auditoría: reglas de página y reglas entre páginas
├── seo/auditoria.test.ts               cada regla contra su árbol de violación; el contraejemplo CSR
├── seo/suiteSeo.ts, sitio.test.ts      la misma suite contra el sitio estático y el servidor SSR
└── fixtures/seo/                       páginas válidas, una violación por archivo, y la cáscara CSR
```

## Decisiones

- **Los metadatos son un contrato JONA.** `InterMetadatosPagina` es una unión: una página indexable exige `canonica`, y una `noindex` no puede tenerla. Cada Implementación del servidor los produce como función pura `(datos, sitio) → metadatos`, que se prueba sin DOM; un solo renderizador, `renderizarCabeza`, los convierte en etiquetas. Ninguna vista escribe la cabeza (regla 5).
- **La búsqueda no se indexa.** Cada texto es una URL distinta que repite el contenido de las fichas. `noindex, follow` deja seguir sus enlaces. `robots.txt` no la bloquea: una página bloqueada no se descarga, y su `noindex` no se leería.
- **Un código, dos modos.** El servidor SSR y el generador estático llaman a las mismas dos funciones, `resolverPagina` y `componerDocumento`, con la misma raíz de composición. `test/seo/sitio.test.ts` comprueba que el HTML de cada página indexable y del 404 es idéntico byte a byte. La única diferencia está en la búsqueda: el SSR la resuelve en la petición, y el sitio estático publica `/buscar` sin término, así que el navegador busca después de hidratar con el índice JSON.
- **El estado se decide antes de dibujar.** `resolverPagina` devuelve 404 para un SKU que no existe; no hay un 200 con un mensaje de «no encontrado». El sitio estático publica `404.html`, que el alojamiento sirve con estado 404.
- **El catálogo no atrapa el error del repositorio.** Una página que se indexa no responde 200 con un aviso en lugar del contenido: falla la petición (502) o la compilación.
- **La imagen principal lleva prioridad.** `JImage prioridad` dibuja `loading="eager"` y `fetchpriority="high"`, y React 19 agrega por su cuenta un `<link rel="preload" as="image">` al HTML del servidor. Las demás imágenes cargan en diferido. Todas tienen `width` y `height`: el espacio se reserva antes de que lleguen.
- **El servidor de archivos distingue mayúsculas.** En un disco que no las distingue (Windows, macOS), `/productos/tec-001` encontraría el archivo de `TEC-001` y respondería 200: la misma página en dos URLs. La suite lo encontró.

## Lo que la auditoría comprueba, y lo que no

| Regla | Qué comprueba |
|---|---|
| `titulo` | Exactamente un `<title>`, no vacío |
| `descripcion` | Exactamente una meta description, no vacía |
| `canonica` | Indexable: una sola, absoluta e igual a la URL de la página. `noindex`: ninguna |
| `robots` | Indexable: sin `noindex`. Las que no se indexan: con `noindex` |
| `idioma` | `<html lang>` |
| `h1` | Exactamente un `<h1>`, no vacío |
| `niveles` | Los títulos no saltan niveles hacia abajo (`h1` → `h3`) |
| `enlaces` | Todo `<a>` con `href`, y no `#` ni `javascript:`; ningún otro elemento con `onclick` |
| `imagenes` | Toda `<img>` con `alt`, `width` y `height` |
| `jsonld` | Cada JSON-LD es JSON válido, y está el `@type` esperado |
| `titulos-unicos`, `descripciones-unicas` | Entre las páginas que se indexan |
| `sitemap` | Lista exactamente las páginas que se indexan |
| `robots-txt` | Apunta al sitemap con su URL absoluta |

La auditoría lee el HTML tal como se sirve, sin ejecutar JavaScript, con jsdom. No mide nada que dependa de dibujar la página: Core Web Vitals (LCP, CLS, INP), el diseño, el contraste real o lo que un script agregue después. Eso exige un navegador real. Tampoco valida el JSON-LD contra el vocabulario de schema.org: solo que se lea y que tenga su `@type`.

| Prueba | Qué protege |
|---|---|
| `src/seo/renderizarCabeza.test.ts` | Las etiquetas de la cabeza; un nombre con `</script>` no rompe el JSON-LD; con `JSON.stringify` a secas, sí |
| `src/ui/*/Ui*ImplServidor.test.ts` | Los metadatos como función pura: canónica, `noindex` de la búsqueda, `Product` con `offers` en `PEN`, disponibilidad según el stock |
| `src/ui/hidratacion.test.tsx` | La ficha hidrata sin diferencias y el botón responde; la búsqueda del sitio estático busca después de hidratar |
| `src/servidor/resolverPagina.test.ts` | Cada ruta y su estado; ningún SKU o ruta desconocida responde 200 |
| `src/servidor/servidores.test.ts`, `sitemap.test.ts` | El servidor SSR, el generador y el servidor de archivos, sin compilar; el sitemap y `robots.txt` |
| `test/seo/auditoria.test.ts` | Cada regla contra su árbol de violación; la cáscara CSR falla |
| `test/seo/sitio.test.ts` | La suite SEO contra el sitio estático y contra el servidor SSR; el mismo HTML en los dos |
| `test/artefacto.test.ts` | Los archivos de `dist/estatico`; el bundle del cliente no lleva lo que solo hace el servidor |
| `test/e2e.test.ts` | Los procesos compilados: `npm start`, `npm run preview:estatico` y `SITIO_URL` |
| `test/architecture/arquitectura.test.ts` | Las cuatro reglas del capítulo 15 y la quinta, cada una con su árbol de violación |

## Las cinco reglas (`test/architecture`)

1. **Lo del servidor no llega al navegador.** Como en el capítulo 15: todo `servidor/` y todo módulo que termina en `Servidor`.
2. **La cara de datos es serializable.** Los tipos `Datos*` de los contratos, también `DatosPagina`, que viaja en el HTML.
3. **Las vistas son puras.** Ni `window`, ni `document`, ni la hora.
4. **En el servidor, nada de estado de módulo.** Los tres procesos (`principal.ts`, `generarEstatico.ts`, `previsualizarEstatico.ts`) son la excepción.
5. **Las vistas no escriben la cabeza.** Ningún `*View.tsx` dibuja `<title>`, `<meta>`, `<link>`, `<script>`, `<head>`, `<html>` ni `<base>`. React 19 lleva `<title>` y `<meta>` a la cabeza desde cualquier componente; aquí eso saltaría el contrato de metadatos.
