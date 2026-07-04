import { J_LOGIN_TEMPLATE } from './JLoginView';
import type { InterJLogin } from './InterJLogin';
import { ChangeDetectionStrategy, Component, input, model, output } from '@angular/core';
import { JButton } from '../../atoms/JButton';
import { JAlert } from '../../molecules/JAlert';
import {
  JCard,
  JCardContent,
  JCardDescription,
  JCardFooter,
  JCardHeader,
  JCardTitle,
} from '../../molecules/JCard';
import { JFormField } from '../../molecules/JFormField';
/** JLogin — formulario de inicio de sesión. */
@Component({
  selector: 'j-login',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [JButton, JAlert, JCard, JCardHeader, JCardTitle, JCardDescription, JCardContent, JCardFooter, JFormField],
  host: { class: 'contents' },
  template: J_LOGIN_TEMPLATE,
})
export class JLogin {
  readonly email = model<string>('');
  readonly password = model<string>('');
  readonly emailError = input<string>('');
  readonly passwordError = input<string>('');
  readonly alertMessage = input<string>('');
  readonly isLoading = input<boolean>(false);

  readonly submitted = output<{ email: string; password: string }>();
  readonly goToCreateAccount = output<void>();
  readonly goToRecoverPassword = output<void>();

  protected onSubmit(event: Event): void {
    event.preventDefault();
    this.submitted.emit({ email: this.email(), password: this.password() });
  }
}
