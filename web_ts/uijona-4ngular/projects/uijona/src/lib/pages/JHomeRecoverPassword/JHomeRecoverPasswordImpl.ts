import { J_HOME_RECOVER_PASSWORD_TEMPLATE } from './JHomeRecoverPasswordView';
import type { InterJHomeRecoverPassword } from './InterJHomeRecoverPassword';
import { ChangeDetectionStrategy, Component, input, model, output } from '@angular/core';
import { JBorderLayout, JNorth, JSouth } from '../../layouts';
import { JFooterPage, JHeaderPage, JRecoverPassword } from '../../organisms';
/** JHomeRecoverPassword — página completa de recuperación de contraseña. */
@Component({
  selector: 'j-home-recover-password',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [JBorderLayout, JNorth, JSouth, JHeaderPage, JFooterPage, JRecoverPassword],
  host: { class: 'contents' },
  template: J_HOME_RECOVER_PASSWORD_TEMPLATE,
})
export class JHomeRecoverPassword {
  readonly email = model<string>('');
  readonly emailError = input<string>('');
  readonly alertMessage = input<string>('');
  readonly successMessage = input<string>('');
  readonly isLoading = input<boolean>(false);
  readonly appTitle = input<string>('JONA UI');
  readonly footerText = input<string>('© 2026 JONA UI');

  readonly submitted = output<{ email: string }>();
  readonly goToLogin = output<void>();
}
