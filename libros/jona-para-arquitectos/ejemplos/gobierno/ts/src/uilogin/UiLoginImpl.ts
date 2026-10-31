import type { InterAuthService, Sesion } from '../servicios/InterAuthService.js';
import type { InterUiLogin } from './InterUiLogin.js';

/** Implementación: estado y efectos. Recibe el servicio tipado por su contrato (N1). */
export class UiLoginImpl {
  private estado: InterUiLogin = { correo: '', clave: '' };

  constructor(
    private readonly servicio: InterAuthService,
    private readonly alAutenticar: (sesion: Sesion) => void,
    private readonly alCambiar: (modelo: InterUiLogin) => void,
  ) {}

  modelo(): InterUiLogin {
    return {
      ...this.estado,
      onCorreoChange: (correo) => this.cambiar({ correo }),
      onClaveChange: (clave) => this.cambiar({ clave }),
      onEnviar: () => { void this.enviar(); },
    };
  }

  private cambiar(parcial: Partial<InterUiLogin>): void {
    this.estado = { ...this.estado, ...parcial };
    this.alCambiar(this.modelo());
  }

  private async enviar(): Promise<void> {
    if (this.estado.correo === '' || this.estado.clave === '') {
      this.cambiar({ error: 'Ingrese su correo y su contraseña.' });
      return;
    }
    this.cambiar({ error: undefined, enviando: true });
    try {
      this.alAutenticar(await this.servicio.login(this.estado.correo, this.estado.clave));
    } catch (e) {
      this.cambiar({ error: e instanceof Error ? e.message : 'No se pudo iniciar sesión.' });
    } finally {
      this.cambiar({ enviando: false });
    }
  }
}
