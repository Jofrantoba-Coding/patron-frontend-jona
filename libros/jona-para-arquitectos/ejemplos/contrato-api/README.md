# contrato-api

Ejemplo de los capítulos 1 y 3: el contrato de API (OpenAPI 3.1), la fuente única que comparten todos los ejemplos.

`login.openapi.yaml` describe `POST /auth/login`: el cuerpo `{usuario, clave}`, la respuesta 200 `{token, user}`, los errores 401, 403, 422 y 500 con el cuerpo `{ code, message, details, traceId }`, y la cabecera `X-Correlation-Id`. También declara los datos de prueba que el servidor mock, los servicios falsos y cualquier backend real deben tener.

No se ejecuta por sí mismo: las pruebas del servidor mock validan cada respuesta contra sus esquemas.

```bash
cd ../mock-server
npm ci
npm test          # incluye la validación de cada respuesta contra login.openapi.yaml (test/contrato.mjs)
```
