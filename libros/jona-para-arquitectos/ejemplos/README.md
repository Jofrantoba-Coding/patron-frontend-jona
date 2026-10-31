# Apéndice B. Cómo ejecutar los ejemplos

Todos los ejemplos implementan un mismo caso, el **inicio de sesión**, y cada uno compila y tiene sus pruebas. Son independientes del resto del repositorio: ninguno importa código fuera de su carpeta, salvo el contrato de API compartido (`contrato-api/login.openapi.yaml`). Cuando dos ejemplos usan el mismo contrato de servicio (por ejemplo, `java-swing` y `java-javafx`), cada uno tiene su propia copia. Las pruebas HTTP de cada ejemplo arrancan el servidor mock de `mock-server/` como un proceso aparte.

## Requisitos

| Herramienta | Versión verificada | Para qué |
|---|---|---|
| Node.js y npm | Node 22, npm 10 | `mock-server`, `flujo-bdd`, `web-react`, `web-ts-puro`, `web-angular`, `web-vue`, `electron`, `web-fsd`, `patrones-comparados`, `sistema-diseno`, `costo-de-cambio`, `migracion`, `evolucion`, `gobierno/ts`, `contratos-multilenguaje/typescript` y el ejecutor general |
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

El ejecutor instala, compila y prueba cada ejemplo en secuencia. Al final arranca el servidor mock como si fuera el backend real y vuelve a correr las suites de contrato de `web-react`, `web-fsd`, `java-swing`, `java-javafx` y `dotnet-wpf` contra él (variable `CONTRATO_API_URL`). Fuera de Windows omite la compilación de la aplicación WPF, pero sigue probando su Implementación y su adaptador. Imprime un resumen con el resultado y la cantidad de pruebas de cada paso, y termina con código distinto de cero si algo falla.

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
├── costo-de-cambio/           # la misma pantalla directa y con JONA, cinco cambios medidos
├── migracion/                 # una pantalla heredada llevada a JONA en nueve pasos, con deuda medida
├── evolucion/                 # nomenclatura previa frente a la canónica, y observaciones medidas sobre THC-C
├── gobierno/                  # catálogo de reglas JONA verificado en TypeScript, Java (ArchUnit) y C# (ArchUnitNET)
├── java-swing/                # forma clásica, con Swing
├── java-javafx/               # forma clásica, con JavaFX
├── dotnet-wpf/                # forma mínima sobre MVVM, con WPF
├── contratos-multilenguaje/   # el contrato de UI del capítulo 1 en TypeScript, Kotlin y C#
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

`login.openapi.yaml` describe `POST /auth/login`: el cuerpo `{usuario, clave}`, la respuesta 200 `{token, user}`, los errores 401, 403, 422 y 500 con el cuerpo `{ code, message, details, traceId }`, y la cabecera `X-Correlation-Id`. No se ejecuta por sí mismo: las pruebas del servidor mock validan cada respuesta contra sus esquemas.

## mock-server

Servidor Node que sirve el contrato de API. Solo usa módulos de Node; `ajv` y `yaml` son dependencias de desarrollo, para validar las respuestas contra el contrato en las pruebas.

```bash
cd mock-server
npm ci
npm start                          # http://127.0.0.1:4010
npm test                           # node:test
```

Variables: `PORT` (por defecto 4010; `0` elige un puerto libre), `HOST` (por defecto `127.0.0.1`) y `MOCK_SCENARIO` (escenario por defecto, `exitoso`). Al arrancar imprime `Servidor mock listo en <url>`.

**Escenarios.** Cada petición elige uno con la cabecera `X-Mock-Scenario`:

| Escenario | Respuesta a una petición válida |
|---|---|
| `exitoso` (por defecto) | Según los datos de prueba, como lo haría el backend real |
| `credencialesInvalidas` | 401 `INVALID_CREDENTIALS` |
| `usuarioBloqueado` | 403 `USER_DISABLED` |
| `errorServidor` | 500 `INTERNAL_ERROR` |

La validación (422) se aplica en todos los escenarios. Un escenario desconocido responde 400 `UNKNOWN_SCENARIO`.

**Rutas de control** (no forman parte del contrato de API):

- `POST /__mock/scenario` con `{"escenario": "errorServidor"}` cambia el escenario de las peticiones que no envían la cabecera. Sirve para ver un escenario en la aplicación sin tocar su código.
- `POST /__mock/reset` restaura el escenario con el que arrancó el servidor.

```bash
curl -X POST http://127.0.0.1:4010/auth/login -H "Content-Type: application/json" \
     -H "X-Mock-Scenario: usuarioBloqueado" -d '{"usuario":"ana@ejemplo.com","clave":"secreta123"}'
```

## flujo-bdd

El plan de pruebas de la sección 5.3 (`plan/iniciar-sesion.feature`, Gherkin en español) y la verificación de la sección 5.4, sin dependencias: un analizador mínimo de Gherkin (`src/gherkin.mjs`) y pruebas con `node:test` que arrancan el servidor mock de `../mock-server` en un puerto libre.

```bash
cd flujo-bdd
npm test
```

- **Del plan al servidor mock:** para cada escenario, envía `POST /auth/login` con el usuario de prueba válido y la cabecera `X-Mock-Scenario` de su etiqueta `@mock:<escenario>`, y compara el estado y el código con su línea *Entonces*.
- **Del servidor mock al plan:** cada escenario de `mock-server/src/datos.mjs` (`ESCENARIOS`) tiene su caso en el plan, y cada etiqueta del plan existe en el servidor mock.

Los mensajes de las líneas "la interfaz muestra" no se comparan aquí con los de la Implementación: viven en código TypeScript y React de `web-react`, que este ejemplo no puede importar sin compilarlo. Las pruebas de pantalla de `web-react` verifican esos mismos textos.

## web-react

Vite, React, TypeScript, Vitest y Testing Library.

```bash
cd web-react
npm ci
npm run mock      # terminal 1: el servidor mock en http://127.0.0.1:4010
npm run dev       # terminal 2: la aplicación, conectada al servidor mock
npm test          # pruebas (arrancan su propio servidor mock en un puerto libre)
npm run build     # verificación de tipos y compilación
```

`npm run dev` usa el servidor mock por defecto: `.env` define `VITE_API_URL=http://127.0.0.1:4010`. Para conectarse a un backend real solo cambia esa URL (por ejemplo, en un `.env.local`); el resto del código es el mismo. Para ver un error en la pantalla, cambie el escenario del mock con `POST /__mock/scenario`.

Las pruebas incluyen:

- la suite de contrato contra `AuthServiceFake` y contra `AuthServiceHttp` con el servidor mock en ejecución (lo arranca `test/mockServer.globalSetup.ts`);
- las pruebas de la pantalla, que se ejecutan sobre la forma mínima y sobre la extendida: inicio correcto, datos faltantes, credenciales inválidas, usuario bloqueado, error del servidor, doble envío y error que se limpia al reintentar;
- las reglas puras de la Implementación, el modelo base sin integración y `JButton`.

Para correr la suite de contrato contra otro servidor (por ejemplo, el backend real):

```bash
CONTRATO_API_URL=https://backend.example.com npx vitest run src/services/AuthServiceHttp.test.ts
```

## java-swing

Maven, JDK 21 y JUnit 5. Las pruebas corren con `java.awt.headless=true` y nunca muestran ventanas.

```bash
cd java-swing
mvn test
mvn compile exec:java                                   # contra el servidor mock (debe estar en ejecución)
mvn compile exec:java -Dexec.args="https://backend.example.com"   # contra otra URL
mvn compile exec:java -Dexec.args="--fake"              # con el servicio falso
mvn compile exec:java -Dexec.args="--plantilla"         # la Plantilla sola, sin integración
```

`AuthServiceHttpTest` arranca el servidor mock con `node` en un puerto libre y lo detiene al terminar. Si `node` no está en el `PATH`, esas pruebas se omiten con un mensaje. Con `CONTRATO_API_URL`, corren contra ese servidor.

En modo *headless* no se puede crear un `JDialog`, por eso la Plantilla y la Implementación se prueban por sus reglas puras (`UiLogin.hasRequiredData`, `UiLoginImpl.messageFor`) y por su estructura (herencia, constructor y ausencia de servicios en la Plantilla). El flujo con `SwingWorker` se ejecuta al usar la aplicación.

## web-ts-puro

La forma clásica del artículo de 2024: `UiLogin` es una clase que construye el DOM y `UiLoginImpl` la extiende. Vite, TypeScript, Vitest y jsdom.

```bash
cd web-ts-puro
npm ci
npm run mock      # terminal 1: el servidor mock
npm run dev       # terminal 2: la aplicación, conectada al servidor mock (.env)
npm test
npm run build
```

## web-angular

Angular 21. La Plantilla `UiLoginComponent` y la Implementación `UiLoginImplComponent` comparten `ui-login.component.html`; el servicio llega por el token `AUTH_SERVICE`, que `app.config.ts` asocia con el adaptador HTTP y `environment.apiUrl` (el servidor mock).

```bash
cd web-angular
npm ci
npm run mock      # terminal 1: el servidor mock
npm start         # terminal 2: ng serve, en http://localhost:4200
npm test          # ng test: Vitest sobre jsdom, sin navegador
npm run build
```

`ng test` lee `vitest.config.ts`, que arranca el servidor mock para las pruebas HTTP. `angular.json` desactiva la telemetría del CLI, así que `ng` no hace preguntas.

## web-vue

Vue 3 con la forma mínima: el *composable* `useUiLoginImpl`, la vista `UiLoginView.vue` (cuyas *props* son exactamente `InterUiLogin`) y la entrada `UiLogin.vue`. Vite, Vitest y `@vue/test-utils`.

```bash
cd web-vue
npm ci
npm run mock      # terminal 1
npm run dev       # terminal 2
npm test
npm run build     # vue-tsc y vite build
```

## electron

El renderizador usa la forma mínima de React. El proceso principal atiende el canal `auth:login` con `AuthServiceHttp` contra el servidor mock; el *preload* expone el canal como `window.authIpc`; el adaptador `createAuthServiceIpc`, en el renderizador, reconstruye el `ApiError` (capítulo 4 explica por qué no en el *preload*).

```bash
cd electron
npm ci
npm run mock      # terminal 1: el servidor mock
npm start         # terminal 2: compila y abre la aplicación (API_URL=<url> para otro servidor)
npm test          # sin Electron: manejador, preload y adaptador con dobles, y la suite de contrato sobre la cadena
```

## web-fsd

El ejemplo del capítulo 6: el mismo inicio de sesión, organizado con Feature-Sliced Design entre unidades y con JONA dentro de cada unidad. Vite, React, TypeScript, Vitest y Testing Library, con las mismas versiones que `web-react`.

```bash
cd web-fsd
npm ci
npm run mock      # terminal 1: el servidor mock
npm run dev       # terminal 2: la aplicación, conectada al servidor mock
npm test          # comportamiento, suites de contrato y pruebas de arquitectura
npm run build     # verificación de tipos y compilación
```

Sin variables, la aplicación usa el adaptador HTTP contra `http://127.0.0.1:4010`. `VITE_API_URL=<url>` cambia el servidor y `VITE_AUTH_SERVICE=fake` usa el servicio en memoria (por ejemplo, en un `.env.local`).

```
src/
├── app/                      raíz de composición: elige el adaptador (createAuthService.ts) y muestra las páginas
├── pages/login/, pages/home/ páginas: componen entradas de capas inferiores
├── features/auth-login/      una unidad JONA con contrato de servicio
│   ├── model/                InterUiLogin.ts (contrato de UI), InterAuthService.ts (puerto), UiLoginImpl.ts
│   ├── ui/                   UiLoginView.tsx (vista), UiLogin.tsx (entrada)
│   ├── api/                  createAuthServiceHttp.ts, createAuthServiceFake.ts (adaptadores)
│   └── index.ts              API pública = N4: la entrada, el puerto y las fábricas de adaptadores
├── entities/session/         LoginResult y LoginUser
└── shared/
    ├── api/                  ApiError
    └── ui/jbutton/, ui/jtextfield/   átomos del sistema de diseño: forma mínima, variante b
```

`test/architecture/rules.ts` verifica, con la API del compilador de TypeScript, cinco reglas sobre los imports de `src/`: (1) las capas solo importan capas inferiores; (2) dos *slices* de la misma capa no se importan; (3) entre unidades solo se importa el `index.ts`, que no expone vistas ni Implementaciones; (4) dentro de una unidad, `model/` no importa `ui/` ni `api/`, `ui/` y `api/` no se importan entre sí, la vista solo importa contratos `Inter*`, y solo `app` importa un adaptador; (5) los archivos `Inter*.ts` solo contienen tipos y objetos `*_DEFAULTS` con valores literales. Cada regla se prueba además contra un árbol de `test/fixtures/` que contiene una sola violación. Los archivos `*.test.ts(x)` quedan fuera del análisis: una prueba es su propia raíz de composición.


## patrones-comparados

El ejemplo del capítulo 7: la misma pantalla de inicio de sesión implementada cinco veces (MVC, MVP con vista pasiva, MVVM, JONA clásica y JONA mínima), sin framework gráfico. `src/comun/pantalla.ts` define controles mínimos para escribir vistas reales sin navegador. Solo TypeScript y el ejecutor de pruebas de Node.

```bash
cd patrones-comparados
npm ci
npm test          # compila y ejecuta la suite común en los cinco patrones y la prueba estructural
```


## sistema-diseno

El ejemplo del capítulo 8: un sistema de diseño mínimo con dos átomos JONA (`JButton`, `JCheckbox`) y la unidad de modo de tema. React, TypeScript, Vitest, jsdom y axe-core.

```bash
cd sistema-diseno
npm ci
npm run build          # verificación de tipos (incluye la directiva @ts-expect-error de accesibilidad) y compilación
npm test               # contraste, lint de tokens, anatomía, axe-core, modo de tema, componentes y versionado
npm run api:actualizar # paso de publicación: regenera api-publica.json si la versión corresponde
```

## gobierno

El ejemplo del capítulo 9: el catálogo `reglas.json` (JONA-N1 a JONA-N4) implementado tres veces, cada una con una aplicación de muestra que cumple, un caso de violación por regla y una metaprueba que compara la implementación con el catálogo. El verificador de TypeScript también se ejecuta, en modo de solo lectura, sobre `web-react/src` y `web-ts-puro/src`.

```bash
cd gobierno/ts
npm ci
npm test                                      # reglas, casos de violación, catálogo, trinquete y generalidad
npm run check -- src                          # informe en consola; código 1 si hay violaciones
npm run check -- fixtures/deuda/legado-con-nueva --deuda fixtures/deuda/deuda.json

cd ../java
mvn -B test                                   # ArchUnit, FreezingArchRule con el almacén deuda-archunit/
mvn test -Darchunit.freeze.store.default.allowStoreUpdate=true   # solo para actualizar la deuda a propósito

cd ../dotnet
dotnet test                                   # ArchUnitNET; N2 con reflexión
```

La carpeta `java/deuda-archunit/` es el almacén de deuda congelada: se versiona y no se borra al limpiar.

## evolucion

El ejemplo del capítulo 12, en dos partes. `nomenclatura/`: la misma unidad con la nomenclatura previa y con la canónica; el verificador de `gobierno/ts` (copiado y vigilado) lee mal la primera y aprueba la segunda, y las pruebas demuestran que el cambio es solo de nombres. `thc-c/`: una reconstrucción del código del artículo de THC-C, compilada con la API de TypeScript y empaquetada con esbuild, que mide cinco observaciones.

```bash
cd evolucion
npm ci
npm test          # nomenclatura, copias vigiladas, diagnósticos de tipos, empaquetado y asimetría mock/real
```

## migracion

El ejemplo del capítulo 11: una pantalla de inicio de sesión heredada llevada a JONA en nueve pasos (`pasos/00-legado` … `pasos/08-cambio-de-vista`). La misma suite de caracterización pasa en todos los pasos; el verificador de `gobierno/ts` (copiado en `herramientas/` y vigilado por una prueba) mide la deuda de cada paso, que nunca sube y llega a cero. El paso 08 cambia la tecnología de la vista y una guarda exige que solo cambien la vista y la entrada.

```bash
cd migracion
npm ci
npm test          # caracterización, trinquete por paso, progreso, copias vigiladas y guarda del cambio de vista
npm run medir     # vuelve a medir, reescribe progreso.json e imprime la tabla
```

## costo-de-cambio

El ejemplo del capítulo 10: la misma pantalla de inicio de sesión escrita de forma directa (un módulo) y con JONA (forma mínima, variante a), y cinco pedidos de cambio aplicados a cada una desde el mismo punto de partida. Una suite de comportamiento común corre contra cada variante y cada cambio; `herramientas/medir.ts` mide los cambios con un diff por líneas, y una prueba exige que la medición coincida con `resultados.json`. Solo TypeScript y el ejecutor de pruebas de Node.

```bash
cd costo-de-cambio
npm ci
npm test          # compila, corre la suite común en cada instantánea y compara la medición con resultados.json
npm run medir     # vuelve a medir, reescribe resultados.json e imprime las tablas en Markdown
```

## java-javafx

Maven, JDK 21, OpenJFX 21 y JUnit 5. Las pruebas usan la plataforma *Headless* de Monocle: crean la Plantilla y la Implementación y esperan al `Task` sin mostrar ventanas.

```bash
cd java-javafx
mvn test
mvn javafx:run                                  # contra el servidor mock (debe estar en ejecución)
mvn javafx:run -Djavafx.args="--fake"           # con el servicio falso
mvn javafx:run -Djavafx.args="--plantilla"      # la Plantilla sola, sin integración
```

## dotnet-wpf

.NET 10 con tres proyectos: `JonaLogin.Core` (`net10.0`: contratos, Implementación y adaptador), `JonaLogin.Wpf` (`net10.0-windows`: vista y entrada) y `JonaLogin.Tests` (xUnit v3).

```bash
cd dotnet-wpf
dotnet test JonaLogin.Tests                     # en cualquier sistema; arranca el servidor mock
dotnet build                                    # toda la solución (Windows)
dotnet run --project JonaLogin.Wpf              # contra el servidor mock (debe estar en ejecución)
dotnet run --project JonaLogin.Wpf -- --fake    # con el servicio falso
```

## contratos-multilenguaje

El contrato de capacidades del capítulo 1 (`InterUiLogin`), con una implementación mínima (`UiLoginDemo`) y una prueba en cada lenguaje.

```bash
cd contratos-multilenguaje/typescript && npm ci && npm test
cd contratos-multilenguaje/kotlin && mvn test
cd contratos-multilenguaje/csharp && dotnet test
```

La versión en Swift del capítulo 1 es ilustrativa: no hay un proyecto Swift porque no se puede verificar en todas las plataformas donde se ejecutan estos ejemplos.
