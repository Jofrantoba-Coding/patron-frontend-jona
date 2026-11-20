// Contrato de servicio de la sesión. No hay token en ninguna firma: lo que el cliente recibe es
// la sesión pública; el identificador viaja en una cookie que este contrato ni nombra.
import type { SesionUsuario } from '../../dominio/SesionUsuario';

export interface InterServicioSesion {
  /** La sesión actual, o nada si no hay. */
  actual(): Promise<SesionUsuario | undefined>;
  /** La sesión nueva, o nada si las credenciales no sirven; rechaza si no se pudo preguntar. */
  entrar(email: string, clave: string): Promise<SesionUsuario | undefined>;
  salir(): Promise<void>;
}
