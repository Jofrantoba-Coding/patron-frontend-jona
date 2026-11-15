# java-swing

Ejemplo de los capítulos 1 a 4: la forma clásica de JONA en Java Swing, con la Plantilla y la Implementación por herencia, y los tres puntos de sustitución elegidos por argumento en la raíz de composición. Maven, JDK 21 y JUnit 5. Las pruebas corren con `java.awt.headless=true` y nunca muestran ventanas.

```bash
mvn test
mvn compile exec:java                                             # contra el servidor mock (debe estar en ejecución)
mvn compile exec:java -Dexec.args="https://backend.example.com"   # contra otra URL
mvn compile exec:java -Dexec.args="--fake"                        # con el servicio falso
mvn compile exec:java -Dexec.args="--plantilla"                   # la Plantilla sola, sin integración
```

El servidor mock se arranca con `npm start` en `../mock-server` y escucha en `http://127.0.0.1:4010`. En PowerShell, ponga la opción `-D` completa entre comillas (`"-Dexec.args=--fake"`): PowerShell interpreta a su manera los argumentos que empiezan con guion y contienen un punto, y así llegan a Maven sin cambios.

## Qué hay

| Pieza | Archivo |
|---|---|
| Raíz de composición: elige el modo por argumento | `src/main/java/com/example/App.java` |
| Contrato de UI, Plantilla e Implementación (forma clásica) | `src/main/java/com/example/view/ui/uilogin/` |
| Contrato de servicio, modelo de error, adaptador HTTP y servicio falso | `src/main/java/com/example/services/` |
| Navegación que la Implementación recibe | `src/main/java/com/example/navigation/Navigator.java` |

| Prueba | Qué protege |
|---|---|
| `AuthServiceContract.java` | Los casos que toda implementación de `InterAuthService` cumple; son los mismos de `web-react` |
| `AuthServiceFakeTest.java` | La suite de contrato contra el servicio falso |
| `AuthServiceHttpTest.java` | La suite de contrato contra el adaptador HTTP y el servidor mock |
| `AuthServiceHttpRespuestaInvalidaTest.java` | Un 200 con un cuerpo que no cumple el contrato de API es un `AuthException` (`INVALID_RESPONSE`) |
| `UiLoginTest.java` | Las reglas puras y la estructura de la forma clásica |

`AuthServiceHttpTest` arranca el servidor mock con `node` en un puerto libre y lo detiene al terminar. Si `node` no está en el `PATH`, esas pruebas se omiten con un mensaje. Con `CONTRATO_API_URL`, corren contra ese servidor; la prueba del escenario `errorServidor` se omite, porque solo existe en el servidor mock:

```bash
CONTRATO_API_URL=https://backend.example.com mvn test -Dtest=AuthServiceHttpTest
```

En modo *headless* no se puede crear un `JDialog`, por eso la Plantilla y la Implementación se prueban por sus reglas puras (`UiLogin.hasRequiredData`, `UiLoginImpl.messageFor`) y por su estructura (herencia, constructor y ausencia de servicios en la Plantilla). El flujo con `SwingWorker` se ejecuta al usar la aplicación.

## Ejecutar desde VS Code

`.vscode/launch.json` define una configuración por modo: «Swing: servicio falso», «Swing: solo la Plantilla», «Swing: servidor mock» y «Swing: backend real» (pide la URL al iniciar). «Servidor mock» arranca `../mock-server/src/server.mjs` con el escenario por defecto que se elija de una lista, y «Swing + servidor mock» arranca los dos y los detiene juntos.

Las configuraciones aparecen al abrir esta carpeta o `../ejemplos.code-workspace`, no al abrir la raíz del repositorio. Necesitan la extensión Extension Pack for Java, que reconoce el proyecto Maven `jona-ejemplo-java-swing`.
