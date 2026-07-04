import { J_HOME_LOGIN_TEMPLATE } from './JHomeLoginView';
import type { InterJHomeLogin } from './InterJHomeLogin';
import { ChangeDetectionStrategy, Component, input, model, output } from '@angular/core';
import { JBorderLayout, JNorth, JSouth } from '../../layouts';
import { JFooterPage, JHeaderPage, JLogin } from '../../organisms';
/** JHomeLogin — página completa de inicio de sesión. */
@Component({
  selector: 'j-home-login',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [JBorderLayout, JNorth, JSouth, JHeaderPage, JFooterPage, JLogin],
  host: { class: 'contents' },
  template: J_HOME_LOGIN_TEMPLATE,
})
export class JHomeLogin {
  readonly email = model<string>('');
  readonly password = model<string>('');
  readonly emailError = input<string>('');
  readonly passwordError = input<string>('');
  readonly alertMessage = input<string>('');
  readonly isLoading = input<boolean>(false);
  readonly appTitle = input<string>('JONA UI');
  readonly footerText = input<string>('© 2026 JONA UI');

  readonly submitted = output<{ email: string; password: string }>();
  readonly goToCreateAccount = output<void>();
  readonly goToRecoverPassword = output<void>();
}
