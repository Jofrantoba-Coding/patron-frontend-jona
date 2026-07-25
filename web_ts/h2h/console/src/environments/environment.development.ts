/**
 * Configuración de desarrollo (ng serve).
 *
 * Autenticación en modo BFF contra el gateway remoto (api.jofrantoba.com). El login es un
 * redirect del navegador a `/oauth2/authorization/{organizacion}`; el gateway mantiene la
 * sesión (cookie SESSION) y las llamadas van con `withCredentials`.
 *
 * NOTA CORS/cookie (BFF same-site): la cookie SESSION es del gateway (api.jofrantoba.com) y
 * SameSite=Lax, por lo que SOLO viaja si el SPA es SAME-SITE con el gateway. Sirve el console
 * en un subdominio de jofrantoba.com (p. ej. https://console.jofrantoba.com → túnel a
 * `ng serve` en 4200); así console.jofrantoba.com ↔ api.jofrantoba.com = mismo site jofrantoba.com
 * y la cookie viaja. (Alternativa dev: gateway local en :8090 y gatewayBaseUrl http://localhost:8090,
 * mismo host localhost que el 4200.) El gateway debe permitir ese origin en gateway.cors.allowed-origins.
 */
export const environment = {
  production: false,
  /*gatewayBaseUrl: 'https://api.jofrantoba.com',
  apiBaseMantenimiento: 'https://api.jofrantoba.com/api/mantenimientos',
  h2hBackendBase: 'https://api.jofrantoba.com/api/mantenimientos/h2h/v1',*/
  gatewayBaseUrl: 'http://localhost:8090',
  apiBaseMantenimiento: 'http://localhost:8090/api/mantenimientos',
  h2hBackendBase: 'http://localhost:8090/api/mantenimientos/h2h/v1',
  mockBaseUrl: 'http://localhost:4010',
};
