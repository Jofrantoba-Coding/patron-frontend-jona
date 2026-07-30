/**
 * Contratos de la pantalla de acceso.
 *
 * <p>No es un formulario de credenciales: en modo BFF el navegador **nunca** ve usuario ni
 * contraseña. Lo único que se pide aquí es a qué organización se entra, porque de ella depende el
 * realm de Keycloak contra el que se autentica. El resto lo hace el gateway.</p>
 */

/** Organización elegible, tal como la ofrece el selector. */
export interface OrganizacionLogin {
  /**
   * `registrationId` con el que el gateway resuelve el `ClientRegistration`. Sale de la redirect
   * URI registrada en Keycloak (`/login/oauth2/code/<id>`) y se traduce por el índice de tenants
   * de Vault — no es un nombre libre.
   */
  id: string;
  /** Etiqueta para el operador. Si no hay nombre comercial, se muestra el propio id. */
  etiqueta: string;
}

/**
 * Contrato de la página. La Vista aporta estado y validación local; la Page hace la única acción
 * real: entregar el navegador al gateway.
 */
export interface LoginPageContract {
  /** Inicia el flujo OAuth2 de esa organización contra el gateway. */
  ingresar(): void;
  /** Recuerda la última organización usada, para no teclearla en cada arranque. */
  recordar(id: string): void;
}

/** Clave de la última organización usada. Preferencia local, nunca un dato sensible. */
export const LOGIN_ULTIMA_ORG = 'h2h.console.ultimaOrganizacion';
