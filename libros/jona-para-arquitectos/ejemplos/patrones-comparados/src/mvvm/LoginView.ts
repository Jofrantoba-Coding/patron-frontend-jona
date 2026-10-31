import { Button, Label, TextField, type LoginScreen } from '../comun/pantalla.js';
import type { LoginViewModel, Observable } from './LoginViewModel.js';

/** Vista: enlaza cada control con una propiedad del modelo de vista. */
export class LoginView implements LoginScreen {
  readonly title = new Label();
  readonly email = new TextField();
  readonly password = new TextField();
  readonly submit = new Button();
  readonly message = new Label();

  constructor(viewModel: LoginViewModel) {
    this.title.text = 'Iniciar sesión';
    this.submit.label = 'Ingresar';
    bindText(this.email, viewModel.email);
    bindText(this.password, viewModel.password);
    viewModel.message.subscribe((message) => { this.message.text = message; });
    viewModel.busy.subscribe((busy) => {
      this.email.enabled = !busy;
      this.password.enabled = !busy;
      this.submit.enabled = !busy;
    });
    this.submit.onClick(() => { void viewModel.submit(); });
  }
}

/** Enlace en los dos sentidos: propiedad -> campo y campo -> propiedad. */
function bindText(field: TextField, property: Observable<string>): void {
  property.subscribe((value) => field.setValue(value));
  field.onChange((value) => property.set(value));
}
