/**
 * Configuración de desarrollo (ng serve).
 *
 * Autenticación en modo BFF contra el gateway local (:8090). El login es un
 * redirect del navegador a `/oauth2/authorization/{organizacion}`; el gateway
 * mantiene la sesión (cookie) y las llamadas van con `withCredentials`.
 *
 * NOTA CORS/cookie: el gateway dev solo permite origin http://localhost:4200
 * (gateway.cors.allowed-origins) con allowCredentials. Sirve el console con
 * `ng serve` en 4200 (mismo host `localhost` que el gateway → la cookie viaja).
 */
export const environment = {
  production: false,
  gatewayBaseUrl: 'http://localhost:8090',
  apiBaseMantenimiento: 'http://localhost:8090/api/mantenimientos',
  h2hBackendBase: 'http://localhost:8090/api/mantenimientos/h2h/v1',
  mockBaseUrl: 'http://localhost:4010',
};
