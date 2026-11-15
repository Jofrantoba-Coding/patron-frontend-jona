# mock-server

Ejemplo de los capítulos 1 y 3: el servidor mock con escenarios, el punto de sustitución 3. Es un servidor Node que sirve el contrato de API (`../contrato-api/login.openapi.yaml`). Solo usa módulos de Node; `ajv` y `yaml` son dependencias de desarrollo, para validar las respuestas contra el contrato en las pruebas. Las pruebas HTTP de los demás ejemplos lo arrancan como un proceso aparte.

```bash
npm ci
npm start                          # http://127.0.0.1:4010
npm test                           # node:test
```

Variables: `PORT` (por defecto 4010; `0` elige un puerto libre), `HOST` (por defecto `127.0.0.1`) y `MOCK_SCENARIO` (escenario por defecto, `exitoso`). Al arrancar imprime `Servidor mock listo en <url>`.

## Escenarios

Cada petición elige uno con la cabecera `X-Mock-Scenario`. La lista está en `src/datos.mjs` (`ESCENARIOS`), junto con los usuarios de prueba.

| Escenario | Respuesta a una petición válida |
|---|---|
| `exitoso` (por defecto) | Según los datos de prueba, como lo haría el backend real |
| `credencialesInvalidas` | 401 `INVALID_CREDENTIALS` |
| `usuarioBloqueado` | 403 `USER_DISABLED` |
| `errorServidor` | 500 `INTERNAL_ERROR` |

La validación (422) se aplica en todos los escenarios. Un escenario desconocido responde 400 `UNKNOWN_SCENARIO`.

## Rutas de control

No forman parte del contrato de API:

- `POST /__mock/scenario` con `{"escenario": "errorServidor"}` cambia el escenario de las peticiones que no envían la cabecera. Sirve para ver un escenario en la aplicación sin tocar su código.
- `POST /__mock/reset` restaura el escenario con el que arrancó el servidor.

```bash
curl -X POST http://127.0.0.1:4010/auth/login -H "Content-Type: application/json" \
     -H "X-Mock-Scenario: usuarioBloqueado" -d '{"usuario":"ana@ejemplo.com","clave":"secreta123"}'
```

## Qué hay

| Pieza | Archivo |
|---|---|
| Servidor y rutas de control | `src/server.mjs` |
| Usuarios de prueba y escenarios | `src/datos.mjs` |
| Validación de cada respuesta contra los esquemas del contrato | `test/contrato.mjs` |
| Pruebas HTTP | `test/server.test.mjs` |

Los ejemplos `java-swing`, `java-javafx` y `dotnet-wpf` incluyen una configuración de VS Code, «Servidor mock», que arranca este servidor con el escenario por defecto que se elija; `../ejemplos.code-workspace` abre esta carpeta junto a ellos.
