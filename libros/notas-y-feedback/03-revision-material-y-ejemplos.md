# 03 — Revisión del material nuevo y sus ejemplos

**Fecha:** 2026-10-31. **Resultado:** las comprobaciones iniciales informaron 229 pruebas aprobadas. Durante la revisión se corrigieron tres de los cuatro puntos detectados; queda una inconsistencia residual sobre asincronía. Las pruebas aprobadas no equivalen a cobertura completa del contrato ni a aprobación integral del libro.

## Qué atender primero

| ID | Prioridad | Estado al cierre de esta lectura |
|---|---|---|
| JONA-R006 | Media | Corregido; diagnóstico de React aprobado y correcciones de Java/.NET contrastadas por lectura |
| JONA-R007 | Media | Corregido; aserción real del contrato comprobada mediante diagnóstico |
| JONA-R008 | Media | Abierto, parcialmente corregido: falta alinear tabla y resumen |
| JONA-R009 | Media | Resuelto por corrección documental y relectura |

Las prioridades de R006, R007 y R009 son históricas. No se presenta como pendiente un defecto que el autor corrigió durante la revisión.

## Hallazgos y comprobaciones de cierre

### JONA-R006 — Normalizar también las respuestas exitosas inválidas

- **Evidencia inicial:** el [capítulo 3](../jona-para-arquitectos/capitulos/03-contratos.md), líneas 158–160 y 209, promete un resultado de dominio o un error tipado. Antes de la corrección, el adaptador TypeScript convertía un fallo al leer JSON en `undefined` y lo devolvía como `LoginResult`; Java y .NET podían propagar errores de deserialización ajenos al contrato.
- **Impacto anterior:** un HTTP 200 vacío podía dejar React sin sesión ni mensaje; Angular podía continuar hacia la navegación porque solo esperaba que la promesa se resolviera. No era una objeción al uso de conversiones de tipos en general, sino a estos resultados contrarios al contrato declarado.
- **Corrección actual:** [adaptador React](../jona-para-arquitectos/ejemplos/web-react/src/services/AuthServiceHttp.ts), líneas 29–49, valida `LoginResult` y produce `ApiError` con `INVALID_RESPONSE`. Las cuatro copias web coinciden; [Electron](../jona-para-arquitectos/ejemplos/electron/src/shared/services/AuthServiceHttp.ts), líneas 30–38, usa el validador extraído. [Swing](../jona-para-arquitectos/ejemplos/java-swing/src/main/java/com/example/services/AuthServiceHttp.java), líneas 60–72, incorpora `toLoginResult` y normaliza `JSONException`; JavaFX tiene la misma versión. [.NET](../jona-para-arquitectos/ejemplos/dotnet-wpf/JonaLogin.Core/Services/AuthServiceHttp.cs), líneas 12–17 y 71–79, exige parámetros y nulabilidad, y normaliza el resultado inválido.
- **Comprobación realizada:** diagnóstico sobre el adaptador React real: cuerpos vacíos, no JSON, `null`, `{}`, token ausente/nulo/numérico/vacío y usuario ausente/nulo o con tipo de identificador incorrecto rechazan con `ApiError(200, INVALID_RESPONSE)`; el caso válido resuelve. No se atribuye esta ejecución a Java, .NET, Electron ni a las pantallas.
- **Recomendación de mantenimiento / cierre:** conservar pruebas negativas de transporte y verificar que no se autentique ni navegue tras esos errores. La corrección de los casos diagnosticados queda comprobada; no se certifica validación exhaustiva de todo OpenAPI ni una nueva ejecución integral multiplataforma.

### JONA-R007 — Exigir que el token exista y sea una cadena no vacía

- **Evidencia inicial:** la suite compartida usaba `expect(result.token).not.toBe('')`, que no rechaza `undefined`, `null` ni números. El [esquema de respuesta](../jona-para-arquitectos/ejemplos/contrato-api/login.openapi.yaml), líneas 114–123, exige token de tipo cadena y longitud mínima 1.
- **Impacto anterior:** un backend con el usuario esperado pero sin token podía superar el caso de éxito de esa suite. Este hueco de cobertura era distinto de la normalización del adaptador.
- **Corrección actual:** [authServiceContract.ts](../jona-para-arquitectos/ejemplos/web-react/src/services/authServiceContract.ts), líneas 24–29, comprueba `toBeTypeOf('string')` y longitud mayor que cero. Las cinco copias TypeScript coinciden.
- **Comprobación de cierre:** el diagnóstico ejecutó el callback real de la suite con el `expect` de Vitest instalado: token ausente, nulo, numérico y vacío fallan; el válido pasa. No se modificó una copia artificial de la aserción.
- **Recomendación de mantenimiento:** conservar ambas comprobaciones o sustituirlas por una validación equivalente del esquema; no reducirlas nuevamente a desigualdad con cadena vacía.

### JONA-R008 — Alinear la regla de asincronía con los contratos Java

- **Estado:** abierto, parcialmente corregido. **Prioridad:** media.
- **Evidencia actual:** el [capítulo 3](../jona-para-arquitectos/capitulos/03-contratos.md), línea 159, ya distingue promesas/tareas de contratos síncronos ejecutados en trabajadores. Sin embargo, la tabla de la línea 30 sigue diciendo «Operaciones asíncronas» y el resumen de la línea 364 afirma sin excepción que el contrato «es asíncrono».
- **Contraste:** [InterAuthService.java](../jona-para-arquitectos/ejemplos/java-swing/src/main/java/com/example/services/InterAuthService.java), línea 6, devuelve `LoginResult` síncrono. [Swing](../jona-para-arquitectos/ejemplos/java-swing/src/main/java/com/example/view/ui/uilogin/UiLoginImpl.java), líneas 28–30, y [JavaFX](../jona-para-arquitectos/ejemplos/java-javafx/src/main/java/com/example/view/ui/uilogin/UiLoginImpl.java), líneas 26–35, lo ejecutan correctamente fuera del hilo de UI. No se denuncia un bloqueo de interfaz.
- **Impacto:** quien lea solo la tabla o el resumen puede considerar inválidos los mismos ejemplos que la sección detallada permite.
- **Recomendación:** usar en ambos lugares la regla ya adoptada: integración sin bloquear la interfaz, con firma asíncrona o trabajador según plataforma.
- **Comprobación de cierre:** tabla, desarrollo y resumen clasifican consistentemente el puerto Java síncrono y los puertos TypeScript/.NET; no es necesario cambiar Java para satisfacer la redacción antigua.

### JONA-R009 — Delimitar la trazabilidad automática del ejemplo BDD

- **Evidencia inicial:** el resumen del capítulo 5 incluía el mensaje de UI dentro de la cadena verificada automáticamente. [El parser](../jona-para-arquitectos/ejemplos/flujo-bdd/src/gherkin.mjs), líneas 49–55, extrae `message`, pero [la prueba de trazabilidad](../jona-para-arquitectos/ejemplos/flujo-bdd/test/trazabilidad.test.mjs), líneas 24–36, solo contrasta estado, token y código del mock.
- **Impacto anterior:** cambiar el texto esperado en el plan no hacía fallar las pruebas de pantalla, aunque la redacción sugería ese vínculo.
- **Corrección y cierre:** el [capítulo 5](../jona-para-arquitectos/capitulos/05-roles-y-flujo.md), líneas 163, 168 y 209, limita la comprobación automática a caso–escenario–respuesta y declara expresamente que las pruebas de pantalla no están enlazadas al plan. La relectura confirma el cierre documental.
- **Recomendación de mantenimiento:** conservar esta limitación mientras no exista un enlace ejecutable. No se exige implementar esa ampliación para cerrar el defecto de redacción.

## Seguimiento de las notas anteriores

- **JONA-R004: decisión pendiente.** [Capítulo 2](../jona-para-arquitectos/capitulos/02-anatomia.md), líneas 20–25, 613 y 634: formulación universal de dos contratos; línea 446: componentes visuales sin servicios. Falta explicitar cuándo corresponde el contrato de servicio.
- **JONA-R005: parcialmente atendido.** La antigua prohibición universal de entrada → modelo base **ya no está**. Las líneas 575–577 permiten la composición de demostración, pero la tabla 589–597 aún no clasifica explícitamente entrada productiva frente a demostración/prueba. Se conserva el criterio de cierre original sin afirmar que persiste la prohibición eliminada.
- Se preservan sin reescritura los historiales de [01](01-revision-inicial.md) y [02](02-verificacion-cierres.md).

## Evidencia de ejecución, separada de la lectura

Cada comando se ejecutó una vez por el verificador. Directorios relativos a `ejemplos/`:

| Directorio | Comandos | Resultado informado |
|---|---|---|
| `mock-server` | `npm test` | 17 pruebas aprobadas |
| `web-react` | `npm run build`; `npm test` | Build completo; 42 aprobadas |
| `web-ts-puro` | `npm run build`; `npm test` | Build completo; 24 aprobadas |
| `web-angular` | `npm run build`; `npm test` | Build completo; 24 aprobadas |
| `web-vue` | `npm run build`; `npm test` | Build completo; 25 aprobadas |
| `electron` | `npm run build`; `npm test` | Build completo; 20 aprobadas |
| `java-swing` | `mvn -B test` | BUILD SUCCESS; 17 aprobadas |
| `java-javafx` | `mvn -B test` | BUILD SUCCESS; 21 aprobadas |
| `contratos-multilenguaje/kotlin` | `mvn -B test` | BUILD SUCCESS; 2 aprobadas |
| `dotnet-wpf` | `dotnet build`; `dotnet test JonaLogin.Tests` | Build succeeded; 21 aprobadas |
| `contratos-multilenguaje/typescript` | `npm test` | 2 aprobadas |
| `contratos-multilenguaje/csharp` | `dotnet test` | 2 aprobadas |
| `flujo-bdd` | `npm test` | 12 aprobadas; salida 0 explícita |

**Instantánea inicial:** 18 comprobaciones, 217 pruebas aprobadas, sin fallos ni omitidas según los resúmenes de los ejecutores; 103,69 s y ningún timeout. Los códigos individuales de salida quedaron no disponibles por un problema del handle de PowerShell: no se afirma que fueran todos 0. Los 239 hashes de fuente comparados no cambiaron y no quedaron descendientes registrados vivos.

**BDD adicional:** 12 aprobadas, 0 fallos/omitidas/canceladas; duración Node 157,3346 ms y tiempo total 0,602 s; cinco hashes sin cambios. Total de esta verificación: **19 comprobaciones y 229 pruebas aprobadas**. El listener HTTP de BDD fue local, efímero y cerrado al terminar.

**Diagnóstico posterior a las correcciones:** 18/18 comprobaciones dirigidas aprobadas, salida 0, 1,12 s, sobre el adaptador React real y la aserción compartida real; hashes del adaptador, `ApiError` y suite estables. Es evidencia adicional para R006/R007, no una repetición de las 19 comprobaciones ni una suite integral posterior a las correcciones.

Registros locales de las 18 comprobaciones: `C:\Users\Usuario\AppData\Local\Temp\jona-review-dbc9d0c97c6042f7a6352e19b6fdacca` (`results.json`, `final.json`, salidas por comando). Diagnóstico dirigido: `%TEMP%\jona-adapter-diagnostic-99beb27368514e20811b9e3c3717c91d`. Son evidencias temporales de esta sesión, no artefactos versionados del libro.

## Alcance, concurrencia y límites

- Corte de contenido: capítulos 3–5 y ejemplos originales de Login, contratos multilenguaje, contrato API, mock y `flujo-bdd`; contraste puntual con capítulo 2 para R004/R005. Los capítulos 6–10 y los nuevos ejemplos `gobierno` y `costo-de-cambio` quedan fuera y requieren otra nota.
- Se contrastaron adaptadores, manejo de errores, validación, límites mínima/clásica/extendida, IPC y pruebas representativas. No fue una auditoría exhaustiva de cada archivo o escenario. Mobile/Unity se trataron como ilustraciones, no como implementaciones faltantes.
- CodeGraph precedió a las lecturas dirigidas de fuentes y documentos. Los 182 hashes del conjunto de lectura permanecieron iguales durante la primera inspección; posteriormente hubo cambios concurrentes. Se releyó una vez la evidencia afectada y se registra aquí su estado nuevo, sin atribuir a esas modificaciones las 229 pruebas de la instantánea anterior.
- Se usaron dependencias ya instaladas y cachés existentes. No se ejecutaron instalaciones, `npm ci`, el agregador completo, su modo limpio ni las repeticiones contra backend externo: **no se comprobó instalación desde cero**.
- WPF: build y pruebas de Core, no ejecución de la vista nativa. Swing y Electron: sin GUI real. JavaFX: controles y `Task` en entorno headless. Las pruebas con dobles no sustituyen pruebas de los runtimes nativos.
- Esta revisión no modificó manuscrito ni ejemplos. Las correcciones observadas fueron concurrentes del autor; solo se escribieron estas notas. No constituye aprobación global ni prueba de conformidad completa con OpenAPI.
