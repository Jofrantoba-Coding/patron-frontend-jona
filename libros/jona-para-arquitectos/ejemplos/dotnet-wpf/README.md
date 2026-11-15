# dotnet-wpf

Ejemplo del capítulo 4: la forma mínima de JONA sobre MVVM, con WPF. La Implementación es el modelo de vista y la vista solo enlaza el contrato de UI. .NET 10 con tres proyectos en `JonaLogin.slnx`.

```bash
dotnet test JonaLogin.Tests                                   # en cualquier sistema; arranca el servidor mock
dotnet build                                                  # toda la solución (Windows)
dotnet run --project JonaLogin.Wpf                            # contra el servidor mock (debe estar en ejecución)
dotnet run --project JonaLogin.Wpf -- https://backend.example.com   # contra otra URL
dotnet run --project JonaLogin.Wpf -- --fake                  # con el servicio falso
```

El servidor mock se arranca con `npm start` en `../mock-server` y escucha en `http://127.0.0.1:4010`. La aplicación WPF solo compila y se abre en Windows; sus pruebas corren en cualquier sistema, porque no dependen de WPF. A diferencia de los ejemplos en Java, este no tiene un modo de solo Plantilla: la forma mínima no tiene Plantilla.

## Qué hay

| Proyecto | Destino | Qué contiene |
|---|---|---|
| `JonaLogin.Core` | `net10.0` | Contrato de UI, reglas puras e Implementación (`UiLogin/`); contrato de servicio, adaptador HTTP y servicio falso (`Services/`) |
| `JonaLogin.Wpf` | `net10.0-windows` | Raíz de composición (`App.xaml.cs`), entrada (`UiLoginWindow`) y vista (`UiLoginView`) |
| `JonaLogin.Tests` | `net10.0` | Pruebas con xUnit v3 |

| Prueba | Qué protege |
|---|---|
| `AuthServiceContract.cs` | Los casos que toda implementación de `InterAuthService` cumple; son los mismos de `web-react` |
| `AuthServiceHttpTests.cs` | La suite de contrato contra el adaptador HTTP y el servidor mock |
| `AuthServiceHttpRespuestaInvalidaTests.cs` | Un 200 con un cuerpo que no cumple el contrato de API es un `ApiException` (`INVALID_RESPONSE`) |
| `UiLoginImplTests.cs` | La Implementación sin WPF, con el servicio falso |

`AuthServiceHttpTests` arranca el servidor mock con `node` en un puerto libre; si `node` no está en el `PATH`, esas pruebas se omiten con un mensaje. Con `CONTRATO_API_URL`, corren contra ese servidor y se omite la prueba del escenario `errorServidor`:

```bash
CONTRATO_API_URL=https://backend.example.com dotnet test JonaLogin.Tests --filter AuthServiceHttpTests
```

## Ejecutar desde VS Code

`.vscode/launch.json` define «WPF: servicio falso», «WPF: servidor mock» y «WPF: backend real» (pide la URL al iniciar), además de «Servidor mock», que arranca `../mock-server/src/server.mjs` con el escenario que se elija, y «WPF + servidor mock», que arranca los dos y los detiene juntos. Antes de cada inicio, la tarea «compilar WPF» de `.vscode/tasks.json` ejecuta `dotnet build` sobre `JonaLogin.Wpf`, y la configuración abre `JonaLogin.Wpf/bin/Debug/net10.0-windows/JonaLogin.Wpf.dll`.

Las configuraciones aparecen al abrir esta carpeta o `../ejemplos.code-workspace`, no al abrir la raíz del repositorio. Necesitan las extensiones C# y C# Dev Kit; «Servidor mock» usa el depurador de Node que trae VS Code.
