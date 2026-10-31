// Fixture para estructura.test.ts: NO se compila. Una vista que conoce el servicio (lo que ninguna vista debe hacer).
import type { InterAuthService } from '../../../src/comun/InterAuthService.js';
import { Button, Label, TextField } from '../../../src/comun/pantalla.js';

export class LoginView {
  readonly email = new TextField();
  readonly password = new TextField();
  readonly submit = new Button();
  readonly message = new Label();

  constructor(service: InterAuthService) {
    this.submit.onClick(() => { void service.login(this.email.value, this.password.value); });
  }
}
