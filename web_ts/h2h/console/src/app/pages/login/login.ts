import { ChangeDetectionStrategy, Component, type OnInit } from '@angular/core';
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
import { environment } from '../../../environments/environment';
import { LOGIN_ULTIMA_ORG } from './inter-login';
import { LoginViewComponent } from './login-view.component';

/**
 * Acceso a la consola. **BFF: el navegador no autentica ni maneja tokens.**
 *
 * <p>Lo único que ocurre aquí es entregar el navegador al gateway
 * (`/oauth2/authorization/{organizacion}`), que hace el flujo OAuth2 contra el realm del tenant,
 * crea la sesión en cookie y devuelve el control. Por eso no hay campo de contraseña: si lo
 * hubiera, la consola estaría viendo credenciales que no le corresponden.</p>
 *
 * <p>La organización no es un nombre libre: el gateway la usa como `registrationId` y la traduce
 * por el índice de tenants de Vault. Una que no esté aprovisionada no da un error amable —el
 * gateway responde 500 al no poder resolver el `ClientRegistration`—, y de ahí que la Vista valide
 * el formato antes de salir del navegador.</p>
 */
@Component({
  selector: 'app-login',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [JCard, JCardHeader, JCardTitle, JCardDescription, JCardContent, JFormField, JButton, JAlert],
  templateUrl: './login-view.component.html',
})
export class LoginPage extends LoginViewComponent implements OnInit {
  ngOnInit(): void {
    this.recuperarUltima();
  }

  /**
   * Sale del SPA hacia el gateway. No se apaga `cargando`: la pestaña se va a otra URL, y
   * limpiarlo solo provocaría un parpadeo del botón justo antes de la redirección.
   */
  protected override ingresar(): void {
    const org = this.organizacion().trim();
    this.cargando.set(true);
    this.error.set('');
    try {
      localStorage.setItem(LOGIN_ULTIMA_ORG, org);
    } catch {
      // localStorage bloqueado (modo privado): es una comodidad, no un requisito para entrar.
    }
    window.location.href = `${environment.gatewayBaseUrl}/oauth2/authorization/${encodeURIComponent(org)}`;
  }
}
