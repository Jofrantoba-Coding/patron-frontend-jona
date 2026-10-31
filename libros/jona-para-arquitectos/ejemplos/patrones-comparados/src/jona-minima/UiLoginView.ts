import { Button, Label, TextField, type LoginScreen } from '../comun/pantalla.js';
import type { InterUiLogin } from './InterUiLogin.js';

/** Vista: modelo de vista -> controles. No importa servicios ni la Implementación. */
export function createUiLoginView() {
  const screen: LoginScreen = {
    title: new Label(),
    email: new TextField(),
    password: new TextField(),
    submit: new Button(),
    message: new Label(),
  };
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
    screen.message.text = next.error ?? '';
    screen.email.enabled = !next.isSubmitting;
    screen.password.enabled = !next.isSubmitting;
    screen.submit.enabled = !next.isSubmitting;
  }

  return { screen, render };
}
