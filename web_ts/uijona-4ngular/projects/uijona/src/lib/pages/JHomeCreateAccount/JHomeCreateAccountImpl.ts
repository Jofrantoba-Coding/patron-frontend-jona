import { J_HOME_CREATE_ACCOUNT_TEMPLATE } from './JHomeCreateAccountView';
import type { InterJHomeCreateAccount } from './InterJHomeCreateAccount';
import { ChangeDetectionStrategy, Component, input, model, output } from '@angular/core';
import { JBorderLayout, JNorth, JSouth } from '../../layouts';
import { JCreateAccount, JFooterPage, JHeaderPage } from '../../organisms';
/** JHomeCreateAccount — página completa de registro. */
@Component({
  selector: 'j-home-create-account',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [JBorderLayout, JNorth, JSouth, JHeaderPage, JFooterPage, JCreateAccount],
  host: { class: 'contents' },
  template: J_HOME_CREATE_ACCOUNT_TEMPLATE,
})
export class JHomeCreateAccount {
  readonly name = model<string>('');
  readonly email = model<string>('');
  readonly password = model<string>('');
  readonly confirmPassword = model<string>('');
  readonly nameError = input<string>('');
  readonly emailError = input<string>('');
  readonly passwordError = input<string>('');
  readonly confirmPasswordError = input<string>('');
  readonly alertMessage = input<string>('');
  readonly isLoading = input<boolean>(false);
  readonly appTitle = input<string>('JONA UI');
  readonly footerText = input<string>('© 2026 JONA UI');

  readonly submitted = output<{ name: string; email: string; password: string; confirmPassword: string }>();
  readonly goToLogin = output<void>();
}
