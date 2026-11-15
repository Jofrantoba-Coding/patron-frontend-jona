# java-javafx

Ejemplo del capítulo 4: la forma clásica de JONA en JavaFX, con la Plantilla y la Implementación por herencia. Maven, JDK 21, OpenJFX 21 y JUnit 5. Las pruebas usan la plataforma *Headless* de Monocle: crean la Plantilla y la Implementación y esperan al `Task` sin mostrar ventanas.

```bash
mvn test
mvn javafx:run                                                 # contra el servidor mock (debe estar en ejecución)
mvn javafx:run -Djavafx.args="https://backend.example.com"     # contra otra URL
mvn javafx:run -Djavafx.args="--fake"                          # con el servicio falso
mvn javafx:run -Djavafx.args="--plantilla"                     # la Plantilla sola, sin integración
```

El servidor mock se arranca con `npm start` en `../mock-server` y escucha en `http://127.0.0.1:4010`. En PowerShell, ponga la opción `-D` completa entre comillas (`"-Djavafx.args=--fake"`), igual que en `java-swing`.

## Qué hay

| Pieza | Archivo |
|---|---|
| Raíz de composición: elige el modo por argumento | `src/main/java/com/example/App.java` |
| Contrato de UI, Plantilla e Implementación (forma clásica) | `src/main/java/com/example/view/ui/uilogin/` |
| Contrato de servicio, modelo de error, adaptador HTTP y servicio falso | `src/main/java/com/example/services/` |

| Prueba | Qué protege |
|---|---|
| `AuthServiceFakeTest.java`, `AuthServiceHttpTest.java` | La suite de contrato (`AuthServiceContract.java`) contra el servicio falso y contra el adaptador HTTP con el servidor mock |
| `AuthServiceHttpRespuestaInvalidaTest.java` | Un 200 con un cuerpo que no cumple el contrato de API es un `AuthException` (`INVALID_RESPONSE`) |
| `UiLoginTest.java` | La Plantilla y la Implementación ejecutadas sobre Monocle: datos faltantes, inicio correcto, errores, doble envío y error que se limpia al reintentar |

`AuthServiceHttpTest` arranca el servidor mock con `node` en un puerto libre; si `node` no está en el `PATH`, esas pruebas se omiten con un mensaje. Con `CONTRATO_API_URL`, corren contra ese servidor y se omite la prueba del escenario `errorServidor`:

```bash
CONTRATO_API_URL=https://backend.example.com mvn test -Dtest=AuthServiceHttpTest
```

## Ejecutar desde VS Code

`.vscode/launch.json` define «JavaFX: servicio falso», «JavaFX: solo la Plantilla», «JavaFX: servidor mock» y «JavaFX: backend real» (pide la URL al iniciar), además de «Servidor mock», que arranca `../mock-server/src/server.mjs` con el escenario que se elija, y «JavaFX + servidor mock», que arranca los dos y los detiene juntos.

Las configuraciones aparecen al abrir esta carpeta o `../ejemplos.code-workspace`, no al abrir la raíz del repositorio. Necesitan la extensión Extension Pack for Java, que reconoce el proyecto Maven `jona-ejemplo-java-javafx`.

`App` extiende `javafx.application.Application` y el proyecto no es modular, así que con JavaFX solo en el *classpath* la JVM se niega a arrancar («JavaFX runtime components are missing»). Por eso cada configuración agrega a `modulePaths` las carpetas de OpenJFX del repositorio local de Maven (`~/.m2/repository/org/openjfx/javafx-{base,graphics,controls}/21.0.6`) y pasa `--add-modules javafx.controls`. Ejecute `mvn test` o `mvn javafx:run` una vez antes, para que Maven descargue esas dependencias. Si cambia `javafx.version` en `pom.xml`, o si Maven usa otro repositorio local, actualice esas rutas.
