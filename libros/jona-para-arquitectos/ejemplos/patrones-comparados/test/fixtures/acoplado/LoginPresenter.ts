// Fixture para estructura.test.ts: NO se compila. Un presentador atado a la vista concreta en lugar de a su interfaz.
import { LoginView } from './LoginView.js';

export class LoginPresenter {
  constructor(private readonly view: LoginView) {}

  clear(): void {
    this.view.message.text = '';
  }
}
