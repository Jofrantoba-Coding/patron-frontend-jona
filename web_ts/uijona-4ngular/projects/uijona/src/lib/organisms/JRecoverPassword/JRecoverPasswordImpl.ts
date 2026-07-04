import { J_RECOVER_PASSWORD_TEMPLATE } from './JRecoverPasswordView';
import type { InterJRecoverPassword } from './InterJRecoverPassword';
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
/** JRecoverPassword — formulario de recuperación de contraseña. */
@Component({
  selector: 'j-recover-password',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [JButton, JAlert, JCard, JCardHeader, JCardTitle, JCardDescription, JCardContent, JCardFooter, JFormField],
  host: { class: 'contents' },
  template: J_RECOVER_PASSWORD_TEMPLATE,
})
export class JRecoverPassword {
  readonly email = model<string>('');
  readonly emailError = input<string>('');
  readonly alertMessage = input<string>('');
  readonly successMessage = input<string>('');
  readonly isLoading = input<boolean>(false);

  readonly submitted = output<{ email: string }>();
  readonly goToLogin = output<void>();

  protected onSubmit(event: Event): void {
    event.preventDefault();
    this.submitted.emit({ email: this.email() });
  }
}
