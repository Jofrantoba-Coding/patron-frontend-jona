# Apéndice A. Glosario

Este glosario reúne el vocabulario del libro. El capítulo 2 fija los nombres de las piezas; los demás capítulos agregan los términos de flujo, verificación, decisión, migración y evolución. Cada entrada indica el capítulo donde el término se define o se trata con más detalle y, cuando existe, su nombre habitual en inglés.

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
| **Paridad de doble fuente** | La misma suite de contrato pasa contra el servicio falso y contra el servidor mock (y, en el pipeline del backend, contra el backend) | [3](03-contratos.md) | *dual-source parity* |
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

## Sistemas de diseño

| Término | Definición | Capítulo | En inglés |
|---|---|---|---|
| **Token primitivo** | Un valor de la paleta (`--jona-primary-600`). Las vistas no lo usan directamente | [8](08-sistemas-de-diseno.md) | *primitive token* |
| **Token semántico** | Un rol visual (`--jona-fg`, `--jona-surface`). Las vistas pintan solo con roles; el tema decide el valor | [8](08-sistemas-de-diseno.md) | *semantic token* |
| **Modo de tema** | La elección del usuario (`light`, `dark` o `system`) en `data-theme-mode`, y el valor resuelto en `data-theme` | [8](08-sistemas-de-diseno.md) | *theme mode* |
| **Superficie pública** | Todo lo que un consumidor de la biblioteca puede usar: exportaciones, propiedades de los contratos, nombres de tokens y archivos de estilo publicados | [8](08-sistemas-de-diseno.md) | *public API surface* |
| **Instantánea de la superficie** | Registro de la superficie pública que una prueba compara en cada versión para clasificar el cambio: mayor, menor o parche | [8](08-sistemas-de-diseno.md) | *API snapshot* |

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

