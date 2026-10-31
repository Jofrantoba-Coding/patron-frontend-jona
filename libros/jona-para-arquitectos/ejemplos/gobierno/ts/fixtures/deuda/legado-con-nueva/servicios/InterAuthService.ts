/** Contrato de servicio. */
export interface InterAuthService {
  login: (correo: string) => Promise<string>;
}
