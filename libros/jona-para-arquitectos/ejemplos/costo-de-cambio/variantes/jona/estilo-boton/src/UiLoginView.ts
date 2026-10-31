import { Button, Label, TextField } from '../../../../comun/pantalla.js';
import type { InterUiLogin } from './InterUiLogin.js';

export interface LoginScreen {
  title: Label;
  email: TextField;
  emailError: Label;
  password: TextField;
  passwordError: Label;
  submit: Button;
  message: Label;
}

/** Vista: modelo de vista -> controles. No importa servicios ni la Implementación. */
export function createUiLoginView() {
  const screen: LoginScreen = {
    title: new Label(),
    email: new TextField(),
    emailError: new Label(),
    password: new TextField(),
    passwordError: new Label(),
    submit: new Button(),
    message: new Label(),
  };
  screen.submit.className = 'boton-acento';
  let model: InterUiLogin | undefined;
  screen.email.onChange((email) => model?.onEmailChange?.(email));
  screen.password.onChange((password) => model?.onPasswordChange?.(password));
  screen.submit.onClick(() => model?.onSubmit?.());

  function render(next: InterUiLogin): void {
    model = next;
    screen.title.text = next.title ?? '';
    screen.submit.label = next.submitLabel ?? '';
    screen.email.setValue(next.email);
    screen.password.setValue(next.password);
    screen.emailError.text = next.emailError ?? '';
    screen.passwordError.text = next.passwordError ?? '';
    screen.message.text = next.error ?? '';
    screen.email.enabled = !next.isSubmitting;
    screen.password.enabled = !next.isSubmitting;
    screen.submit.enabled = !next.isSubmitting;
  }

  return { screen, render };
}
