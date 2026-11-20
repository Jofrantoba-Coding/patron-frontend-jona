# Apéndice A. Glosario

Este glosario reúne el vocabulario del libro. El capítulo 2 fija los nombres de las piezas; los demás capítulos agregan los términos de flujo, verificación, decisión, migración, evolución y seguridad. Cada entrada indica el capítulo donde el término se define o se trata con más detalle y, cuando existe, su nombre habitual en inglés.

> [!NOTE]
> Algunas palabras tienen un sentido distinto fuera de JONA: «plantilla» en Atomic Design, «vista» en la nomenclatura previa del patrón, *fixture* en el capítulo 9 y en THC-C. Las entradas marcadas con ⚠ lo aclaran.

---

## El patrón y su núcleo

| Término | Definición | Capítulo | En inglés |
|---|---|---|---|
| **JONA** | *Joint Orchestrated N-layer Architecture*. Patrón para la interfaz de usuario que separa cada unidad en contratos, comportamiento y presentación, con contratos acordados entre los roles y con el backend | [1](01-que-busca-jona.md) | — |
| **Núcleo invariante** | Las cuatro reglas que toda forma de JONA cumple: N1 a N4. Una implementación es JONA si las cumple, con cualquier cantidad de archivos | [2](02-anatomia.md) | — |
| **N1 · Contratos explícitos** | Toda unidad tiene un contrato de UI; si depende del sistema, también un contrato de servicio por cada dependencia | [2](02-anatomia.md) | — |
| **N2 · Contratos sin comportamiento** | Un contrato declara tipos, firmas y, como mucho, valores por defecto declarativos (`DEFAULTS`); no contiene lógica, render ni efectos | [2](02-anatomia.md) | — |
| **N3 · Efectos solo en la integración** | Los efectos externos (servicios, enrutamiento, almacenamiento) viven solo en la Implementación y los adaptadores. La vista, la Plantilla y el modelo base nunca llaman a servicios | [2](02-anatomia.md) | — |
| **N4 · Solo la entrada es pública** | El resto de la aplicación conoce la unidad únicamente por su entrada | [2](02-anatomia.md) | — |
| **Unidad** | Una pantalla o un componente construido con JONA. Es el alcance del patrón: JONA se decide unidad por unidad | [2](02-anatomia.md), [10](10-decisiones-y-compromisos.md) | — |
| **Canon** | El conjunto de reglas, formas y nombres que este libro fija. Evoluciona con formas y reglas nuevas; cambiar el núcleo es crear otro patrón | [12](12-evolucion-y-antipatrones.md) | — |
| **En camino** | Una unidad que tiene solo algunas piezas de JONA. Es una posición legítima si se nombra así y su deuda está enumerada; no es JONA todavía | [10](10-decisiones-y-compromisos.md), [11](11-migracion.md) | — |

## Las piezas de una unidad

| Término | Definición | Capítulo | En inglés |
|---|---|---|---|
| **Contrato de UI** | Tipo que declara lo que la unidad ofrece: sus capacidades o su modelo de vista. Prefijo `Inter` (`InterUiLogin`) | [2](02-anatomia.md), [3](03-contratos.md) | *UI contract* |
| **Estilo de capacidades** | Contrato de UI como un conjunto de métodos (`login`, `isValidData`). Habitual en la forma clásica | [3](03-contratos.md) | — |
| **Estilo de modelo de vista** | Contrato de UI como datos, eventos y `DEFAULTS`. Habitual en las formas por composición | [3](03-contratos.md) | *view model* |
| **`DEFAULTS`** | Constante con los valores de presentación por defecto de un contrato. Solo datos neutros: nunca estado de la pantalla | [3](03-contratos.md) | — |
| **Contrato de servicio** | Tipo que declara lo que la unidad necesita del sistema. Es el puerto del frontend. Nombre `Inter*Service` | [2](02-anatomia.md), [3](03-contratos.md) | *service contract*, *port* |
| **Contrato de API** | Rutas, formatos y errores que frontend y backend acuerdan juntos, escritos como OpenAPI | [3](03-contratos.md) | *API contract* |
| **Adaptador** | Implementa un contrato de servicio y hace la entrada y salida real (`AuthServiceHttp`) | [2](02-anatomia.md), [6](06-atomic-fsd-hexagonal.md) | *adapter* |
| **Servicio falso** | Implementación del contrato de servicio sin red, con los datos de prueba del contrato de API (`AuthServiceFake`) | [3](03-contratos.md) | *fake* |
| **Implementación** (Impl) | Da comportamiento real al contrato de UI: estado, decisiones e integración a través de contratos de servicio. Sufijo `Impl` | [2](02-anatomia.md) | — |
| **Vista** ⚠ | Render puro: recibe datos y funciones y solo dibuja. Sufijo `View`. En la nomenclatura previa, «View» designaba al orquestador | [2](02-anatomia.md), [12](12-evolucion-y-antipatrones.md) | — |
| **Entrada** | Punto de composición de la unidad: lo único que el resto de la aplicación importa o instancia. Es un rol, no un sufijo | [2](02-anatomia.md) | *entry point* |
| **Plantilla** ⚠ | La clase heredable de la forma clásica: implementa el contrato, construye la interfaz y da un comportamiento por defecto sin integración. No es la «plantilla» de Atomic Design | [2](02-anatomia.md), [6](06-atomic-fsd-hexagonal.md) | *template class* |
| **Modelo base** | Estado y comportamiento por defecto, sin integración, que la Implementación compone y reemplaza en parte. Sufijo `Base`; en la nomenclatura previa, `TemplateModel` | [2](02-anatomia.md) | — |
| **Props** | Tipo de datos de la vista, separado del contrato cuando la unidad es grande | [2](02-anatomia.md) | — |
| **Composición de demostración o prueba** | Una historia o una prueba que une piezas internas (por ejemplo, la vista con el modelo base). No es una segunda entrada: nada de la aplicación la importa | [2](02-anatomia.md) | — |
| **Raíz de composición** | El único lugar de la aplicación que elige los adaptadores (por ejemplo, `app/createAuthService.ts`) | [6](06-atomic-fsd-hexagonal.md) | *composition root* |
| **Raíz de composición por petición** | En un servidor, la raíz exporta una fábrica que se arma una vez con el entorno, y lo propio de cada petición (el usuario, la traza) se crea en cada petición. Una instancia de módulo lo compartirían todas | [15](15-bff-y-ssr.md) | *per-request composition root* |
| **Implementación de servidor / de cliente** | Con SSR, la Implementación se parte en dos: la del servidor es una función que carga por el puerto y llena la cara de datos; la del cliente es un *hook* con estado de interacción y eventos, que no vuelve a cargar al montarse | [15](15-bff-y-ssr.md) | — |
| **Cara de datos** (contrato serializable) | La parte del contrato de UI que llena el servidor y viaja en el HTML: solo valores que el transporte conserva (con JSON, ni funciones ni instancias). La cara de eventos solo existe en el cliente | [15](15-bff-y-ssr.md) | — |

## Las formas

| Término | Definición | Capítulo | En inglés |
|---|---|---|---|
| **Forma clásica** | La Implementación hereda de la Plantilla. Natural en tecnologías organizadas en clases y en código heredado. Equivale al *Template Method* | [2](02-anatomia.md), [4](04-herencia-y-composicion.md), [7](07-mvc-mvp-mvvm.md) | *Template Method* |
| **Forma mínima** | La unidad se compone sin herencia, con contrato de modelo de vista, Implementación, vista y entrada | [2](02-anatomia.md) | — |
| **Variante a** | Forma mínima en la que la entrada compone la Implementación y la vista e inyecta el servicio | [2](02-anatomia.md) | — |
| **Variante b** | Forma mínima en la que la Implementación dibuja la vista y la entrada la reexporta con el nombre público de la unidad | [2](02-anatomia.md) | — |
| **Forma extendida** | La forma mínima más un modelo base explícito, para que la interfaz funcione sin integración | [2](02-anatomia.md) | — |
| **Enlace tardío** | En la herencia, una llamada desde la Plantilla ejecuta el método que la Implementación reemplazó. La composición no lo ofrece | [4](04-herencia-y-composicion.md) | *late binding* |

## Contratos, sustitución y flujo

| Término | Definición | Capítulo | En inglés |
|---|---|---|---|
| **Sesión conjunta** | Reunión en la que frontend y backend acuerdan el contrato de API, y diseño e integración el contrato de UI, antes de escribir código | [3](03-contratos.md), [5](05-roles-y-flujo.md) | — |
| **Contrato descubierto** | En una migración, el contrato de API escrito a partir de lo que el backend responde hoy, y revisado después con su equipo | [11](11-migracion.md) | — |
| **Punto de sustitución** | Lugar donde una parte del sistema se reemplaza por otra: ① la Plantilla o el modelo base, ② el servicio inyectado por la entrada, ③ el servidor mock | [1](01-que-busca-jona.md), [2](02-anatomia.md) | — |
| **Servidor mock** | Servidor construido a partir del contrato de API que responde como el backend. Es el modo de desarrollo por defecto | [3](03-contratos.md) | *mock server* |
| **Escenario** | Una respuesta del servidor mock elegida por petición (en los ejemplos, con la cabecera `X-Mock-Scenario`) | [3](03-contratos.md), [5](05-roles-y-flujo.md) | — |
| **Suite de contrato** | Casos de prueba escritos una vez y ejecutados contra cada implementación de un contrato de servicio | [3](03-contratos.md), [9](09-verificacion-y-gobierno.md) | *contract test suite* |
| **Paridad de doble fuente** | La misma suite de contrato pasa contra el servicio falso y contra el servidor mock (y, en el pipeline del backend, contra el backend). El capítulo 16 la aplica a una auditoría SEO, contra el sitio estático y el servidor SSR | [3](03-contratos.md), [16](16-seo.md) | *dual-source parity* |
| **Modelo de error** | Una sola forma de error para la unidad (`ApiError`, con estado, código, detalles y `traceId`), incluida la respuesta inválida (`INVALID_RESPONSE`) | [3](03-contratos.md) | — |
| **Caso hoja** | El caso más específico del plan de pruebas: un resultado distinto, con su escenario | [5](05-roles-y-flujo.md) | *leaf case* |
| **Trazabilidad** | La cadena criterio de aceptación → escenario Gherkin → escenario del mock → respuesta, comprobada en las dos direcciones | [5](05-roles-y-flujo.md) | *traceability* |
| **Contratos guiados por el consumidor** | Técnica en la que el consumidor registra sus expectativas y el proveedor las verifica (Pact). JONA define el contrato antes, entre los dos lados | [9](09-verificacion-y-gobierno.md) | *consumer-driven contracts* |

## Roles

| Término | Definición | Capítulo |
|---|---|---|
| **Diseñador de UI** | Autor de la vista y de la Plantilla; coautor del contrato de UI y del modelo base | [5](05-roles-y-flujo.md) |
| **Integrador** | Autor de la Implementación, los adaptadores, el contrato de servicio y la entrada; coautor de los contratos de UI y de API | [5](05-roles-y-flujo.md) |
| **Backend** | Coautor del contrato de API y autor de su implementación | [5](05-roles-y-flujo.md) |
| **QA** | Autor del plan de pruebas; coautor de los escenarios del servidor mock | [5](05-roles-y-flujo.md) |
| **Arquitecto** | No escribe piezas: aprueba los contratos y la entrada, y es dueño del catálogo de reglas y de la lista de deuda | [5](05-roles-y-flujo.md), [9](09-verificacion-y-gobierno.md) |
| **Sombrero** | Un rol que una misma persona asume por momentos, en un equipo pequeño. Las fronteras entre roles se mantienen | [5](05-roles-y-flujo.md) |

## JONA junto a otras arquitecturas

| Término | Definición | Capítulo | En inglés |
|---|---|---|---|
| **Eje dentro de la unidad / entre unidades** | JONA organiza el interior de una unidad; Atomic Design y FSD organizan las unidades entre sí. Son ejes ortogonales | [6](06-atomic-fsd-hexagonal.md) | — |
| **Slice y segmento** | En FSD, un *slice* es una parte del negocio dentro de una capa, y un segmento, una carpeta técnica dentro del *slice* (`model/`, `ui/`, `api/`) | [6](06-atomic-fsd-hexagonal.md) | *slice*, *segment* |
| **API pública del slice** | El `index.ts` de un *slice* de FSD. En una unidad JONA cumple el papel de N4 | [6](06-atomic-fsd-hexagonal.md) | *public API* |
| **Puerto** | En la arquitectura hexagonal, la interfaz por la que la aplicación habla con el exterior. En JONA, el contrato de servicio; el contrato de UI no es un puerto | [1](01-que-busca-jona.md), [6](06-atomic-fsd-hexagonal.md) | *port* |
| **Vista pasiva** | Variante de MVP en la que la vista solo muestra y reenvía eventos, a través de una interfaz que maneja el presentador | [7](07-mvc-mvp-mvvm.md) | *passive view* |
| **Dominio** | En la arquitectura hexagonal, el centro: los tipos y las reglas del negocio, sin dependencias. En el capítulo 14, un archivo de TypeScript sin imports | [14](14-aplicacion-fsd-hexagonal.md) | *domain* |
| **Borrador** | Lo que el usuario escribe en un formulario, siempre como texto y sin validar. La función de dominio que lo valida es la frontera con el objeto del dominio | [14](14-aplicacion-fsd-hexagonal.md) | *draft* |
| **Caso de uso** | Lógica de aplicación entre la Implementación y el puerto. Se agrega solo cuando tiene responsabilidad propia: combinar reglas del dominio, elegir entre llamadas al puerto o traducir errores | [6](06-atomic-fsd-hexagonal.md), [14](14-aplicacion-fsd-hexagonal.md) | *use case* |
| **Widget** | En FSD, la capa que combina funcionalidades en un bloque de pantalla. En el capítulo 14, una unidad JONA cuya Implementación coordina dos funcionalidades que no se conocen | [14](14-aplicacion-fsd-hexagonal.md) | *widget* |
| **BFF** | *Backend for frontend*: un servidor dedicado a una experiencia de usuario, que sirve el contrato de API de esa interfaz y compone los backends de negocio. Traduce, agrega y compensa; no decide reglas de negocio | [15](15-bff-y-ssr.md) | *backend for frontend* |
| **Compensación** | Deshacer un paso ya hecho cuando el siguiente falla, en una escritura que toca dos servicios. Evita escrituras a medias por fallos técnicos; no es una transacción | [15](15-bff-y-ssr.md) | *compensation* |
| **SSR** | Renderizado en el servidor: el servidor devuelve la página ya dibujada y el navegador la hidrata | [15](15-bff-y-ssr.md) | *server-side rendering* |
| **Hidratación** | Unir React al HTML que dibujó el servidor (`hydrateRoot`), sin volver a dibujarlo. Exige que el árbol produzca en el navegador lo mismo que en el servidor | [15](15-bff-y-ssr.md) | *hydration* |

## Sistemas de diseño

| Término | Definición | Capítulo | En inglés |
|---|---|---|---|
| **Token primitivo** | Un valor de la paleta (`--jona-primary-600`). Las vistas no lo usan directamente | [8](08-sistemas-de-diseno.md) | *primitive token* |
| **Token semántico** | Un rol visual (`--jona-fg`, `--jona-surface`). Las vistas pintan solo con roles; el tema decide el valor | [8](08-sistemas-de-diseno.md) | *semantic token* |
| **Modo de tema** | La elección del usuario (`light`, `dark` o `system`) en `data-theme-mode`, y el valor resuelto en `data-theme` | [8](08-sistemas-de-diseno.md) | *theme mode* |
| **Superficie pública** | Todo lo que un consumidor de la biblioteca puede usar: exportaciones, propiedades de los contratos, nombres de tokens y archivos de estilo publicados | [8](08-sistemas-de-diseno.md) | *public API surface* |
| **Inventario de interfaz** | Captura de las pantallas existentes o previstas para agrupar lo que se repite y decidir qué entra al sistema de diseño | [13](13-construir-sistema-de-diseno.md) | *interface inventory* |
| **Disposición** ⚠ | El nivel de Atomic Design que Frost llama *template*: la estructura de una página, con huecos en lugar de datos. El libro no lo llama «plantilla», que reserva para la forma clásica | [6](06-atomic-fsd-hexagonal.md), [13](13-construir-sistema-de-diseno.md) | *template* (Atomic Design) |
| **Organismo de dominio** | Un organismo cuyo contrato nombra una entidad del negocio, como el formulario de producto. Vive en la aplicación y se compone con piezas del sistema de diseño | [13](13-construir-sistema-de-diseno.md), [14](14-aplicacion-fsd-hexagonal.md) | — |
| **Estado de interacción** | El que solo existe mientras el usuario manipula un componente: un borrador, el foco anterior, los identificadores que asocian etiqueta y error. Puede vivir en la Implementación de un componente del sistema de diseño; el estado de dominio, nunca | [13](13-construir-sistema-de-diseno.md) | *interaction state* |
| **Instantánea de la superficie** | Registro de la superficie pública que una prueba compara en cada versión para clasificar el cambio: mayor, menor o parche | [8](08-sistemas-de-diseno.md) | *API snapshot* |

## Buscadores

| Término | Definición | Capítulo | En inglés |
|---|---|---|---|
| **SEO** | Las decisiones que hacen que un buscador pueda encontrar, leer e indexar bien una página. En una interfaz se toman en tres lugares: el sistema de diseño (la semántica), el contrato de la página (los metadatos) y el modo de entrega (el HTML servido) | [16](16-seo.md) | *search engine optimization* |
| **Prerenderizado** (SSG) | Generar el HTML de cada ruta al compilar y publicarlo como archivos estáticos: un `index.html` por ruta, más `404.html`, el sitemap y robots.txt | [16](16-seo.md) | *static site generation*, *prerendering* |
| **HTML servido** | El HTML que responde el servidor, antes de que se ejecute JavaScript. Es lo que lee un cliente que no ejecuta scripts, y lo que mide la auditoría del capítulo 16 | [16](16-seo.md) | — |
| **Contrato de metadatos** | `InterMetadatosPagina`: título, descripción, URL canónica, `robots`, Open Graph y JSON-LD de una página. Lo produce una función pura por página a partir de sus datos, y lo dibuja un solo renderizador | [16](16-seo.md) | — |
| **URL canónica** | La URL que una página declara como la suya (`<link rel="canonical">`), absoluta. Solo la declaran las páginas que se indexan | [16](16-seo.md) | *canonical URL* |
| **`noindex`** | Regla de la etiqueta meta `robots` que pide no mostrar la página en los resultados. Se lee solo si la página se puede rastrear: bloquearla en robots.txt la anula | [16](16-seo.md) | *noindex* |
| **Soft 404** | Una página que dice que no existe, o que está vacía, pero responde con un estado `2xx`. La respuesta correcta para una página que no existe es un 404 | [16](16-seo.md) | *soft 404* |
| **Sitemap** | Archivo XML con las URL absolutas que un sitio quiere ver en los resultados. Se declara en robots.txt con la línea `Sitemap:` | [16](16-seo.md) | *sitemap* |
| **Datos estructurados** (JSON-LD) | Una descripción de la página con el vocabulario de schema.org (por ejemplo, `Product` con su `Offer`), en un `<script type="application/ld+json">` que hay que escapar como los datos incrustados | [16](16-seo.md) | *structured data*, *JSON-LD* |
| **Core Web Vitals** (LCP) | Tres métricas de la experiencia medidas en navegadores reales: LCP (carga), INP (interactividad) y CLS (estabilidad visual). LCP mide cuándo se dibuja el elemento más grande visible, a menudo la imagen principal | [16](16-seo.md) | *Core Web Vitals*, *Largest Contentful Paint* |

## Seguridad

| Término | Definición | Capítulo | En inglés |
|---|---|---|---|
| **Frontera de confianza** | La línea entre lo que controla quien usa la aplicación (el navegador, el binario de escritorio) y lo que controla el sistema (el servidor). En JONA coincide con el contrato de servicio: del lado del cliente, las piezas no abren puertas; del lado del servidor, deciden | [17](17-desarrollo-seguro.md) | *trust boundary* |
| **Permisos como datos** | Los permisos que el servidor calcula para la sesión y la interfaz recibe en su contrato de UI. Deciden qué se ofrece, nunca qué se permite: el servidor vuelve a comprobar cada acción con la misma tabla | [17](17-desarrollo-seguro.md) | — |
| **Tipo con marca** | Un tipo que agrega a otro una propiedad que solo existe en el sistema de tipos, y que solo produce una función. `UrlSegura` es un `string` que pasó por `aUrlSegura`: un texto sin validar no compila donde el contrato la pide | [17](17-desarrollo-seguro.md) | *branded type* |
| **XSS** | Inyección de código en la página: un dato que el navegador termina interpretando como HTML o script. Anula las demás defensas del cliente, también la de CSRF | [17](17-desarrollo-seguro.md) | *cross-site scripting* |
| **CSRF** | Una página ajena hace que el navegador de la víctima envíe una petición al sitio, y la cookie de sesión viaja sola. Se defiende con una cabecera propia obligatoria y la comprobación del origen; `SameSite` es una capa más | [17](17-desarrollo-seguro.md) | *cross-site request forgery* |
| **Cookie `__Host-` HttpOnly** | La cookie de sesión del BFF. `HttpOnly`: JavaScript no la lee. El prefijo `__Host-` obliga a `Secure`, `Path=/` y a no tener `Domain`. Con `SameSite=Strict`, no viaja desde otro sitio | [17](17-desarrollo-seguro.md) | *host-only cookie* |
| **Fijación de sesión** | Que el atacante logre que la víctima use un identificador de sesión que él ya conoce. Se evita renovando el identificador en cada inicio de sesión | [17](17-desarrollo-seguro.md) | *session fixation* |
| **CSP estricta** | Política de seguridad de contenido que solo deja ejecutar los scripts con el nonce (o el hash) de la respuesta, más los que esos carguen (`'strict-dynamic'`). Es una segunda capa contra XSS, no la primera | [17](17-desarrollo-seguro.md) | *strict Content Security Policy* |
| **Nonce** | Un valor aleatorio, distinto en cada respuesta, que la CSP y los `<script>` del documento comparten. Por eso el documento lo compone un servidor y no un archivo estático | [17](17-desarrollo-seguro.md) | *nonce* |
| **Control positivo** | En una prueba que busca algo que no debe estar, la comprobación de que la misma búsqueda sí lo encuentra donde debe estar. Sin ella, la prueba pasaría también buscando mal | [17](17-desarrollo-seguro.md) | *positive control* |

## Verificación y gobierno

| Término | Definición | Capítulo | En inglés |
|---|---|---|---|
| **Función de aptitud** | Mecanismo que evalúa de forma objetiva una característica de la arquitectura. Las reglas N1 a N4 lo son | [9](09-verificacion-y-gobierno.md) | *fitness function* |
| **Niveles de aplicación** | Nivel 0: el compilador y la visibilidad. Nivel 1: pruebas de arquitectura. Nivel 2: revisión humana guiada por el catálogo | [9](09-verificacion-y-gobierno.md) | — |
| **Catálogo de reglas** | La norma: una lista de reglas con identificadores estables (`JONA-N1` … `JONA-N4`) que cada tecnología implementa | [9](09-verificacion-y-gobierno.md) | — |
| **Metaprueba** | Prueba que compara la implementación de las reglas en una tecnología con el catálogo, y exige un caso de violación por regla | [9](09-verificacion-y-gobierno.md) | — |
| **Caso de violación** ⚠ | Un proyecto diminuto que rompe una regla a propósito, para demostrar que la prueba de arquitectura puede fallar. El capítulo 9 lo llama también *fixture*; no confundir con los *fixtures* de datos de THC-C | [9](09-verificacion-y-gobierno.md) | *fixture* |
| **Trinquete** | Lista de deuda conocida que solo puede achicarse: lo enumerado pasa, lo nuevo falla y lo saldado falla hasta que se quita | [9](09-verificacion-y-gobierno.md) | *ratchet* |
| **Lista de deuda** | Las violaciones conocidas que un trinquete tolera (`deuda.json`; en Java, el almacén de `FreezingArchRule`) | [9](09-verificacion-y-gobierno.md), [11](11-migracion.md) | *baseline* |
| **Entrada saldada** | Una entrada de la lista de deuda que ya no ocurre. Hace fallar la suite hasta que se borra | [9](09-verificacion-y-gobierno.md) | — |
| **Cambio de forma** | En una migración, una entrada de deuda que se reemplaza por otra de la misma regla sin que el total crezca. Se declara con su motivo | [11](11-migracion.md) | — |
| **Registro de decisión de arquitectura** (ADR) | Nota breve con el contexto, la decisión, sus consecuencias y una condición de revisión | [9](09-verificacion-y-gobierno.md), [10](10-decisiones-y-compromisos.md) | *architecture decision record* |

## Decisión y migración

| Término | Definición | Capítulo | En inglés |
|---|---|---|---|
| **Costo de partida** | Lo que una unidad JONA cuesta antes de cualquier cambio: archivos, líneas y piezas | [10](10-decisiones-y-compromisos.md) | — |
| **Localidad** | Que un cambio caiga en la pieza que tiene esa razón para cambiar, sin tocar las demás. Es lo que JONA compra, más que brevedad | [10](10-decisiones-y-compromisos.md) | *locality* |
| **Prueba de caracterización** | Prueba que fija lo que el código hace hoy, no lo que debería hacer. Es la red de seguridad de una migración | [11](11-migracion.md) | *characterization test* |
| **Rareza** | Un comportamiento extraño del código heredado. La caracterización lo fija; corregirlo es un cambio aparte | [11](11-migracion.md) | — |
| **Costura** | Punto donde el comportamiento se puede cambiar sin editar el código que lo usa; en el paso 2 de una migración, el servicio que la pantalla recibe | [11](11-migracion.md) | *seam* |
| **Aplicación estranguladora** | Reemplazar un sistema por partes, dejando que lo nuevo crezca alrededor de lo viejo. En JONA, la parte es la unidad, y la frontera, su entrada | [11](11-migracion.md) | *strangler fig application* |

## Evolución

| Término | Definición | Capítulo | En inglés |
|---|---|---|---|
| **Nomenclatura previa** | Nombres de una etapa anterior del patrón: `*View` para el orquestador, el dibujo sin sufijo y `*TemplateModel` para el modelo base | [2](02-anatomia.md), [12](12-evolucion-y-antipatrones.md) | — |
| **Nomenclatura cruzada** | Cuando el sufijo de un rol designa a otro rol. Hace que las personas y los verificadores lean la estructura al revés | [12](12-evolucion-y-antipatrones.md) | — |
| **Derivado** | Un patrón propio que se declara basado en JONA y se separa de él en algo. Debe decir en qué | [12](12-evolucion-y-antipatrones.md) | — |
| **THC / THC-C** | *Types · Hooks · Components*, y su variante con *Composer*: el primer derivado externo de JONA (Harol Rodriguez, 2026) | [1](01-que-busca-jona.md), [5](05-roles-y-flujo.md), [12](12-evolucion-y-antipatrones.md) | — |
| **Composer** | En THC-C, el punto de intercambio entre la implementación real y el mock, que lee *fixtures* por escenario | [12](12-evolucion-y-antipatrones.md) | — |
| ***Fixture* (en THC-C)** ⚠ | Datos de respuesta para un escenario, una carpeta por caso hoja. Equivale al escenario del servidor mock, dentro de la aplicación | [5](05-roles-y-flujo.md), [12](12-evolucion-y-antipatrones.md) | *fixture* |

