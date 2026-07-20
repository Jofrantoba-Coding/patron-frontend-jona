/**
 * Configuración de producción.
 *
 * Autenticación en modo BFF: el navegador NO maneja tokens. El login se inicia
 * redirigiendo al gateway (`/oauth2/authorization/{organizacion}`); el gateway
 * mantiene la sesión (cookie) y hace TokenRelay a los backends. Las llamadas al
 * gateway van con `withCredentials` (cookie). El estado se lee de `GET /session`.
 */
export const environment = {
  production: true,
  /** Base del gateway (OAuth2 Login / BFF). Login, logout, /session y APIs. */
  gatewayBaseUrl: 'https://api.jofrantoba.com',
  /** Ruta de la API de mantenimientos vía gateway. */
  apiBaseMantenimiento: 'https://api.jofrantoba.com/api/mantenimientos',
  /** Namespace H2H dentro de mantenimientos. */
  h2hBackendBase: 'https://api.jofrantoba.com/api/mantenimientos/h2h/v1',
  /** Mock server (solo endpoints sin backend real todavía). */
  mockBaseUrl: 'http://localhost:4010',
};
