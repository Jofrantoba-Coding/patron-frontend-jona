# Apéndice B. Cómo ejecutar los ejemplos

Todos los ejemplos implementan un mismo caso, el **inicio de sesión**, y cada uno compila y tiene sus pruebas. Son independientes del resto del repositorio: ninguno importa código fuera de su carpeta, salvo el contrato de API compartido (`contrato-api/login.openapi.yaml`). Cuando dos ejemplos usan el mismo contrato de servicio (por ejemplo, `java-swing` y `java-javafx`), cada uno tiene su propia copia. Las pruebas HTTP de cada ejemplo arrancan el servidor mock de `mock-server/` como un proceso aparte.

Cada ejemplo tiene su propio `README.md` con sus comandos y sus detalles de ejecución; este apéndice reúne lo común y remite a ellos. `java-swing`, `java-javafx` y `dotnet-wpf` incluyen además configuraciones de VS Code para ejecutar cada modo de la aplicación junto con el servidor mock: aparecen al abrir la carpeta del ejemplo o `ejemplos.code-workspace`, que reúne esas tres carpetas y `mock-server`.

## Requisitos

| Herramienta | Versión verificada | Para qué |
|---|---|---|
| Node.js y npm | Node 22, npm 10 | `mock-server`, `flujo-bdd`, `web-react`, `web-ts-puro`, `web-angular`, `web-vue`, `electron`, `web-fsd`, `patrones-comparados`, `sistema-diseno`, `sistema-diseno-atomico`, `aplicacion-catalogo`, `catalogo-bff`, `catalogo-ssr`, `costo-de-cambio`, `migracion`, `evolucion`, `gobierno/ts`, `contratos-multilenguaje/typescript` y el ejecutor general |
| JDK | 21 | `java-swing`, `java-javafx`, `gobierno/java` y `contratos-multilenguaje/kotlin` |
| Maven | 3.9, ejecutándose sobre el JDK 21 | Compila Java, JavaFX y Kotlin (Kotlin no necesita `kotlinc`: lo compila `kotlin-maven-plugin`; JavaFX llega desde Maven Central) |
| .NET SDK | 10 | `contratos-multilenguaje/csharp`, `dotnet-wpf` y `gobierno/dotnet` |
| Windows | 10 u 11 | Solo para compilar y abrir la aplicación WPF (`dotnet-wpf/JonaLogin.Wpf`). Sus pruebas corren en cualquier sistema |

- `mvn -v` debe mostrar `Java version: 21`. Si el `java` del `PATH` es otro, configure `JAVA_HOME` con el JDK 21: Maven usa ese JDK y los proyectos fijan `maven.compiler.release=21`.
- La primera ejecución descarga dependencias de npm, Maven Central y nuget.org, así que necesita conexión. El proyecto C# incluye su propio `NuGet.config`, de modo que no depende de la configuración de NuGet de la máquina.
- Angular CLI y Electron no se instalan aparte: son dependencias de desarrollo de sus ejemplos. `npm ci` en `electron/` descarga el binario de Electron (unos 100 MB) la primera vez y lo guarda en la caché del usuario.
- Ningún ejemplo necesita un navegador instalado: las pruebas web corren sobre jsdom, incluidas las de Angular (`ng test` con Vitest).
- Swift, Gradle y Dart no son necesarios: no hay ejemplos ejecutables en esos lenguajes.

## Todo con un solo comando

```bash
cd libros/jona-para-arquitectos/ejemplos
npm run all            # o: node run-all.mjs
npm run all:limpio     # lo mismo, borrando antes node_modules, dist, target, bin y obj
```

El ejecutor instala, compila y prueba cada ejemplo en secuencia. Al final arranca el servidor mock como si fuera el backend real y vuelve a correr las suites de contrato de `web-react`, `web-fsd`, `java-swing`, `java-javafx` y `dotnet-wpf` contra él (variable `CONTRATO_API_URL`). Después arranca los dos backends simulados y el BFF de `catalogo-bff` en puertos libres, y corre la suite de contrato HTTP de `aplicacion-catalogo` contra el BFF (variables `CATALOGO_API_URL` y `CATALOGO_REINICIAR`): es la prueba del capítulo 15 de que la aplicación funciona contra el BFF sin cambios. Fuera de Windows omite la compilación de la aplicación WPF, pero sigue probando su Implementación y su adaptador. Imprime un resumen con el resultado y la cantidad de pruebas de cada paso, y termina con código distinto de cero si algo falla.

## Estructura

```
ejemplos/
├── contrato-api/              # contrato de API (OpenAPI 3.1): la fuente única
├── mock-server/               # servidor mock en Node, sin dependencias de ejecución
├── flujo-bdd/                 # plan de pruebas en Gherkin y su trazabilidad con el servidor mock
├── web-react/                 # formas mínima (a y b) y extendida, con React
├── web-ts-puro/               # forma clásica del artículo de 2024: clases TypeScript sobre el DOM
├── web-angular/               # forma clásica, con Angular 21 y un token de inyección
├── web-vue/                   # forma mínima, con un composable de Vue 3
├── electron/                  # React en el renderizador y un contrato de IPC
├── web-fsd/                   # JONA dentro de la unidad y FSD entre unidades, con pruebas de arquitectura
├── patrones-comparados/       # el mismo inicio de sesión en MVC, MVP, MVVM, JONA clásica y JONA mínima
├── sistema-diseno/            # sistema de diseño mínimo: tokens, temas, contraste, axe-core y versionado
├── sistema-diseno-atomico/    # sistema de diseño por niveles de Atomic Design, cada componente una unidad JONA
├── aplicacion-catalogo/       # catálogo de productos con FSD, Clean/Hexagonal y JONA, sobre el sistema de diseño anterior
├── catalogo-bff/              # BFF hexagonal delante de dos backends simulados; sirve la API del catálogo anterior
├── catalogo-ssr/              # la lista del catálogo renderizada en el servidor a mano, con la Implementación partida en dos
├── costo-de-cambio/           # la misma pantalla directa y con JONA, cinco cambios medidos
├── migracion/                 # una pantalla heredada llevada a JONA en nueve pasos, con deuda medida
├── evolucion/                 # nomenclatura previa frente a la canónica, y observaciones medidas sobre THC-C
├── gobierno/                  # catálogo de reglas JONA verificado en TypeScript, Java (ArchUnit) y C# (ArchUnitNET)
├── java-swing/                # forma clásica, con Swing
├── java-javafx/               # forma clásica, con JavaFX
├── dotnet-wpf/                # forma mínima sobre MVVM, con WPF
├── contratos-multilenguaje/   # el contrato de UI del capítulo 1 en TypeScript, Kotlin y C#
├── ejemplos.code-workspace    # espacio de trabajo de VS Code: java-swing, java-javafx, dotnet-wpf y mock-server
├── run-all.mjs                # ejecutor general
└── package.json               # npm run all
```

| Concepto del libro | Dónde está |
|---|---|
| Contrato de API (capítulos 1 y 3) | `contrato-api/login.openapi.yaml` |
| Servidor mock con escenarios (punto de sustitución 3) | `mock-server/src/server.mjs` |
| Contrato de servicio (puerto) y modelo de error | `web-react/src/services/InterAuthService.ts`, `ApiError.ts`; `java-swing/.../services/InterAuthService.java`, `AuthException.java` |
| Adaptador HTTP | `web-react/src/services/AuthServiceHttp.ts`; `java-swing/.../services/AuthServiceHttp.java` |
| Servicio falso (punto de sustitución 2) | `web-react/src/services/AuthServiceFake.ts`; `java-swing/.../services/AuthServiceFake.java` |
| Suite de contrato de doble fuente | `web-react/src/services/authServiceContract.ts`; `java-swing/src/test/.../AuthServiceContract.java` |
| Forma clásica | `java-swing/src/main/java/com/example/view/ui/uilogin/` |
| Forma mínima, variante a | `web-react/src/uilogin/` |
| Forma mínima, variante b | `web-react/src/jbutton/` |
| Forma extendida (punto de sustitución 1 con el modelo base) | `web-react/src/uiloginextendida/` |
| Capítulo 4: TypeScript sin framework, Angular, Vue | `web-ts-puro/`, `web-angular/`, `web-vue/` |
| Capítulo 4: JavaFX, WPF, Electron | `java-javafx/`, `dotnet-wpf/`, `electron/` |
| Capítulo 5: plan de pruebas y trazabilidad | `flujo-bdd/` |
| Capítulo 6: JONA con Atomic Design, FSD y Clean/Hexagonal; reglas de arquitectura | `web-fsd/`, `web-fsd/test/architecture/rules.ts` |
| Capítulo 7: MVC, MVP, MVVM y JONA con la misma suite; matriz de dependencias | `patrones-comparados/`, `patrones-comparados/test/estructura.test.ts` |
| Capítulo 8: tokens en dos capas, contraste WCAG, accesibilidad en el contrato y versionado de la API pública | `sistema-diseno/`, `sistema-diseno/scripts/version.mjs` |
| Capítulo 9: catálogo de reglas, casos de violación, metaprueba y trinquete | `gobierno/reglas.json`, `gobierno/ts/herramientas/`, `gobierno/java/`, `gobierno/dotnet/` |
| Capítulo 11: migración paso a paso con caracterización, trinquete y cambio de tecnología de vista | `migracion/`, `migracion/progreso.json` |
| Capítulo 12: nomenclatura previa y canónica; observaciones sobre THC-C con el compilador y el empaquetador | `evolucion/nomenclatura/`, `evolucion/thc-c/` |
| Capítulo 10: costo de partida y costo de cada cambio, directo frente a JONA | `costo-de-cambio/`, `costo-de-cambio/resultados.json` |
| Capítulo 13: niveles de Atomic Design como unidades JONA; reglas entre niveles; el paquete probado como lo carga un consumidor | `sistema-diseno-atomico/`, `sistema-diseno-atomico/test/niveles/reglas.ts` |
| Capítulo 14: dominio puro, puerto con dos adaptadores y suite de contrato, caso de uso, widget que coordina funcionalidades, siete reglas de arquitectura | `aplicacion-catalogo/`, `aplicacion-catalogo/test/architecture/rules.ts` |
| Capítulo 15: BFF con un puerto por backend, traducción, agregación y compensación; la suite de la SPA contra el BFF | `catalogo-bff/`, `catalogo-bff/src/manejadores/crearManejadoresProductos.ts`, `catalogo-bff/test/architecture/reglas.ts` |
| Capítulo 15: SSR con la Implementación partida en dos, cara de datos serializable, incrustación segura, raíz por petición y bundle del cliente sin código del servidor | `catalogo-ssr/`, `catalogo-ssr/src/ui/catalogo/`, `catalogo-ssr/test/architecture/reglas.ts`, `catalogo-ssr/test/artefacto.test.ts` |
| Contrato del capítulo 1 en varios lenguajes | `contratos-multilenguaje/` |

## Datos de prueba

El contrato de API los declara; el servidor mock, los servicios falsos y cualquier backend real deben tenerlos.

| Usuario | Clave | Resultado |
|---|---|---|
| `ana@ejemplo.com` | `secreta123` | 200 con token y usuario (`Ana Torres`) |
| `bloqueado@ejemplo.com` | `secreta123` | 403 `USER_DISABLED` |
| cualquier otra combinación | | 401 `INVALID_CREDENTIALS` |
| usuario o clave vacíos | | 422 `VALIDATION_ERROR`, con un detalle por campo |

---

## contrato-api

`login.openapi.yaml` describe `POST /auth/login` (capítulos 1 y 3): el cuerpo, la respuesta 200, los errores 401, 403, 422 y 500, y la cabecera `X-Correlation-Id`. No se ejecuta por sí mismo: las pruebas del servidor mock validan cada respuesta contra sus esquemas.

Instrucciones: [contrato-api/README.md](contrato-api/README.md).

## mock-server

Servidor Node que sirve el contrato de API, con escenarios por petición y rutas de control (capítulos 1 y 3, punto de sustitución 3). Solo usa módulos de Node en ejecución.

Instrucciones: [mock-server/README.md](mock-server/README.md).

## flujo-bdd

El plan de pruebas de la sección 5.3 en Gherkin y la verificación de la sección 5.4: la trazabilidad, en las dos direcciones, entre el plan y los escenarios del servidor mock. Solo Node, sin dependencias.

Instrucciones: [flujo-bdd/README.md](flujo-bdd/README.md).

## web-react

El ejemplo de referencia de los capítulos 1 a 4: las formas mínima (variantes a y b) y extendida con React, el adaptador HTTP, el servicio falso y la suite de contrato de doble fuente. Vite, React, TypeScript, Vitest y Testing Library.

Instrucciones: [web-react/README.md](web-react/README.md).

## java-swing

La forma clásica en Java Swing, con los tres puntos de sustitución elegidos por argumento (capítulos 1 a 4). Maven, JDK 21 y JUnit 5; incluye configuraciones de VS Code.

Instrucciones: [java-swing/README.md](java-swing/README.md).

## web-ts-puro

La forma clásica del artículo de 2024, en TypeScript sin framework: `UiLogin` es una clase que construye el DOM y `UiLoginImpl` la extiende (capítulo 4). Vite, TypeScript, Vitest y jsdom.

Instrucciones: [web-ts-puro/README.md](web-ts-puro/README.md).

## web-angular

La forma clásica con Angular 21: la Plantilla y la Implementación comparten el HTML, y el servicio llega por el token `AUTH_SERVICE` (capítulo 4). Las pruebas usan Vitest sobre jsdom, sin navegador.

Instrucciones: [web-angular/README.md](web-angular/README.md).

## web-vue

La forma mínima con Vue 3: un *composable* como Implementación, una vista cuyas *props* son exactamente `InterUiLogin` y una entrada (capítulo 4). Vite, Vitest y `@vue/test-utils`.

Instrucciones: [web-vue/README.md](web-vue/README.md).

## electron

La forma mínima de React en el renderizador y un contrato de IPC entre el proceso principal, el *preload* y el adaptador del renderizador (capítulo 4). Las pruebas corren sin Electron.

Instrucciones: [electron/README.md](electron/README.md).

## web-fsd

El ejemplo del capítulo 6: el mismo inicio de sesión, organizado con Feature-Sliced Design entre unidades y con JONA dentro de cada unidad, con cinco reglas de arquitectura verificadas. Vite, React, TypeScript, Vitest y Testing Library.

Instrucciones: [web-fsd/README.md](web-fsd/README.md).

## patrones-comparados

El ejemplo del capítulo 7: la misma pantalla de inicio de sesión implementada cinco veces (MVC, MVP con vista pasiva, MVVM, JONA clásica y JONA mínima), sin framework gráfico. Solo TypeScript y el ejecutor de pruebas de Node.

Instrucciones: [patrones-comparados/README.md](patrones-comparados/README.md).

## sistema-diseno

El ejemplo del capítulo 8: un sistema de diseño mínimo con dos átomos JONA (`JButton`, `JCheckbox`) y la unidad de modo de tema. React, TypeScript, Vitest, jsdom y axe-core.

Instrucciones: [sistema-diseno/README.md](sistema-diseno/README.md).

## sistema-diseno-atomico

El ejemplo del capítulo 13: un sistema de diseño construido nivel por nivel con Atomic Design, con átomos, moléculas, organismos y una disposición, todos con la anatomía de la forma mínima, variante b. React, TypeScript, Vitest, jsdom y axe-core.

Instrucciones: [sistema-diseno-atomico/README.md](sistema-diseno-atomico/README.md).

## aplicacion-catalogo

El ejemplo del capítulo 14: alta, consulta, modificación y baja de productos con FSD entre unidades, un dominio puro y un puerto con dos adaptadores, y unidades JONA que dibujan con el sistema de diseño del capítulo 13, instalado como paquete (`file:../sistema-diseno-atomico`). Hay que compilar antes ese sistema de diseño.

Instrucciones: [aplicacion-catalogo/README.md](aplicacion-catalogo/README.md).

## catalogo-bff

El primer ejemplo del capítulo 15: un BFF hexagonal que sirve la API REST de `aplicacion-catalogo` componiendo dos backends de negocio simulados, catalogo e inventario, con contratos propios. Traduce formatos, agrega y compensa una escritura a medias; la regla de unicidad del SKU queda en catalogo. Node, TypeScript y Vitest, sin dependencias de ejecución.

Instrucciones: [catalogo-bff/README.md](catalogo-bff/README.md).

## catalogo-ssr

El segundo ejemplo del capítulo 15: la lista de productos con búsqueda y baja renderizada en el servidor a mano, con React 19 (`renderToString` y `hydrateRoot`), Vite y un servidor `node:http`, y las vistas del sistema de diseño del capítulo 13 (`file:../sistema-diseno-atomico`). Hay que compilar antes ese sistema de diseño, y `npm run build` antes de `npm test`.

Instrucciones: [catalogo-ssr/README.md](catalogo-ssr/README.md).

## gobierno

El ejemplo del capítulo 9: el catálogo `reglas.json` (JONA-N1 a JONA-N4) implementado en TypeScript, Java (ArchUnit) y C# (ArchUnitNET), cada uno con casos de violación, una metaprueba contra el catálogo y un trinquete de deuda.

Instrucciones: [gobierno/README.md](gobierno/README.md).

## evolucion

El ejemplo del capítulo 12, en dos partes: `nomenclatura/`, la misma unidad con la nomenclatura previa y con la canónica, y `thc-c/`, una reconstrucción del código del artículo de THC-C que mide cinco observaciones. Solo TypeScript y el ejecutor de pruebas de Node.

Instrucciones: [evolucion/README.md](evolucion/README.md).

## migracion

El ejemplo del capítulo 11: una pantalla de inicio de sesión heredada llevada a JONA en nueve pasos, con la misma suite de caracterización en todos y la deuda medida en cada uno. Solo TypeScript y el ejecutor de pruebas de Node.

Instrucciones: [migracion/README.md](migracion/README.md).

## costo-de-cambio

El ejemplo del capítulo 10: la misma pantalla de inicio de sesión escrita de forma directa y con JONA, y cinco pedidos de cambio aplicados a cada una y medidos. Solo TypeScript y el ejecutor de pruebas de Node.

Instrucciones: [costo-de-cambio/README.md](costo-de-cambio/README.md).

## java-javafx

La forma clásica en JavaFX (capítulo 4). Maven, JDK 21, OpenJFX 21 y JUnit 5; las pruebas corren sobre la plataforma *Headless* de Monocle, sin ventanas. Incluye configuraciones de VS Code.

Instrucciones: [java-javafx/README.md](java-javafx/README.md).

## dotnet-wpf

La forma mínima sobre MVVM, con WPF (capítulo 4). .NET 10 con tres proyectos: `JonaLogin.Core` (`net10.0`), `JonaLogin.Wpf` (`net10.0-windows`) y `JonaLogin.Tests` (xUnit v3). Incluye configuraciones de VS Code.

Instrucciones: [dotnet-wpf/README.md](dotnet-wpf/README.md).

## contratos-multilenguaje

El contrato de capacidades del capítulo 1 (`InterUiLogin`), con una implementación mínima (`UiLoginDemo`) y una prueba en TypeScript, Kotlin y C#.

Instrucciones: [contratos-multilenguaje/README.md](contratos-multilenguaje/README.md).
