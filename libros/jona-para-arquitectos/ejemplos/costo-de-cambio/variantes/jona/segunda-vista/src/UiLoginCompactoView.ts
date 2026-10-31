import { Button, Label, TextField } from '../../../../comun/pantalla.js';
import type { InterUiLogin } from './InterUiLogin.js';

export interface LoginCompactoScreen {
  email: TextField;
  password: TextField;
  submit: Button;
  message: Label;
}

/** Vista compacta: sin título y con el error de cada campo dentro del propio control. Mismo contrato de UI. */
export function createUiLoginCompactoView() {
  const screen: LoginCompactoScreen = {
    email: new TextField(),
    password: new TextField(),
    submit: new Button(),
    message: new Label(),
  };
  screen.submit.className = 'boton-primario';
  let model: InterUiLogin | undefined;
  screen.email.onChange((email) => model?.onEmailChange?.(email));
  screen.password.onChange((password) => model?.onPasswordChange?.(password));
  screen.submit.onClick(() => model?.onSubmit?.());

  function render(next: InterUiLogin): void {
    model = next;
    screen.submit.label = next.submitLabel ?? '';
    screen.email.setValue(next.email);
    screen.password.setValue(next.password);
    screen.email.error = next.emailError ?? '';
    screen.password.error = next.passwordError ?? '';
    screen.message.text = next.error ?? '';
    screen.email.enabled = !next.isSubmitting;
    screen.password.enabled = !next.isSubmitting;
    screen.submit.enabled = !next.isSubmitting;
  }

  return { screen, render };
}
