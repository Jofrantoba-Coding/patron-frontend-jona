import { J_CREATE_ACCOUNT_TEMPLATE } from './JCreateAccountView';
import type { InterJCreateAccount } from './InterJCreateAccount';
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
/** JCreateAccount — formulario de registro. */
@Component({
  selector: 'j-create-account',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [JButton, JAlert, JCard, JCardHeader, JCardTitle, JCardDescription, JCardContent, JCardFooter, JFormField],
  host: { class: 'contents' },
  template: J_CREATE_ACCOUNT_TEMPLATE,
})
export class JCreateAccount {
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

  readonly submitted = output<{ name: string; email: string; password: string; confirmPassword: string }>();
  readonly goToLogin = output<void>();

  protected onSubmit(event: Event): void {
    event.preventDefault();
    this.submitted.emit({
      name: this.name(),
      email: this.email(),
      password: this.password(),
      confirmPassword: this.confirmPassword(),
    });
  }
}
