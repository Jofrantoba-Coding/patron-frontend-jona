// inter-ui-home-session.ts
// Capa: Interface (contrato puro) para la vista de sesión autenticada
// Restricciones: sin lógica, sin estado, sin imports externos
export interface InterUiHomeSession {
  logout: () => void;
}
