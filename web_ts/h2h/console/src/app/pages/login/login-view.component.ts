import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import {
  JAlert,
  JButton,
  JCard,
  JCardContent,
  JCardDescription,
  JCardHeader,
  JCardTitle,
  JFormField,
} from 'uijona-4ngular';
import { LOGIN_ULTIMA_ORG } from './inter-login';

/**
 * Vista del acceso: estado, validación local y presentación. Sin navegación ni llamadas.
 *
 * <p>La validación se hace aquí y no en el gateway por una razón concreta: si el identificador no
 * corresponde a un tenant aprovisionado, el gateway responde <b>500</b> —no un 404 amable— porque
 * falla al resolver el `ClientRegistration` contra Vault. Filtrar lo evidente antes de salir del
 * navegador evita ese camino.</p>
 */
@Component({
  selector: 'app-login-view',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [JCard, JCardHeader, JCardTitle, JCardDescription, JCardContent, JFormField, JButton, JAlert],
  templateUrl: './login-view.component.html',
})
export class LoginViewComponent {
  protected readonly organizacion = signal<string>('');
  protected readonly cargando = signal<boolean>(false);
  protected readonly error = signal<string>('');

  /**
   * El identificador viaja en la URL del gateway, así que se acota a lo que un `registrationId`
   * puede ser: minúsculas, dígitos, guion y guion bajo. Sin esto, un espacio o un acento producen
   * una URL que falla más adelante y con un mensaje que no señala el campo.
   */
  protected readonly valido = computed(() => /^[a-z0-9][a-z0-9_-]*$/.test(this.organizacion().trim()));

  protected readonly puedeIngresar = computed(() => this.valido() && !this.cargando());

  /** Rellena con la última organización usada: en dev se entra decenas de veces al día. */
  protected recuperarUltima(): void {
    try {
      const previa = localStorage.getItem(LOGIN_ULTIMA_ORG);
      if (previa) this.organizacion.set(previa);
    } catch {
      // localStorage puede estar bloqueado (modo privado). No es motivo para no poder entrar.
    }
  }

  protected onOrganizacion(valor: string): void {
    // Se normaliza al vuelo: el realm siempre es minúscula, y corregirlo callado es mejor que
    // rechazar a alguien por teclear "ALMIL".
    this.organizacion.set(valor.trim().toLowerCase());
    if (this.error()) this.error.set('');
  }

  protected setError(mensaje: string): void {
    this.error.set(mensaje);
    this.cargando.set(false);
  }

  /** Gancho que implementa la Page. */
  protected ingresar(): void {}

  protected onSubmit(event: Event): void {
    event.preventDefault();
    if (!this.organizacion().trim()) {
      this.setError('Indique la organización con la que va a entrar.');
      return;
    }
    if (!this.valido()) {
      this.setError('El identificador solo admite minúsculas, números, guion y guion bajo.');
      return;
    }
    this.ingresar();
  }
}
