import type { InterAuthService, LoginResult } from '../comun/InterAuthService.js';
import { hasRequiredData, loginErrorMessage, MISSING_DATA_ERROR } from '../comun/mensajes.js';

/** Propiedad observable: la vista se enlaza a ella. */
export class Observable<T> {
  private readonly listeners: Array<(value: T) => void> = [];

  constructor(private current: T) {}

  get value(): T {
    return this.current;
  }

  set(value: T): void {
    this.current = value;
    for (const listener of this.listeners) listener(value);
  }

  /** Avisa ahora con el valor actual y después en cada cambio. */
  subscribe(listener: (value: T) => void): void {
    this.listeners.push(listener);
    listener(this.current);
  }
}

export interface LoginViewModelDeps {
  service: InterAuthService;
  onAuthenticated: (result: LoginResult) => void;
}

/** Modelo de vista: propiedades observables y un comando. No sabe que existe una vista. */
export class LoginViewModel {
  readonly email = new Observable('');
  readonly password = new Observable('');
  readonly message = new Observable('');
  readonly busy = new Observable(false);

  constructor(private readonly deps: LoginViewModelDeps) {}

  /** Comando "Ingresar". */
  async submit(): Promise<void> {
    if (this.busy.value) return;                        // evita el doble envío
    const email = this.email.value;
    const password = this.password.value;
    if (!hasRequiredData(email, password)) {
      this.message.set(MISSING_DATA_ERROR);
      return;
    }
    this.message.set('');                               // limpia el error del intento anterior
    this.busy.set(true);
    let result: LoginResult | undefined;
    try {
      result = await this.deps.service.login(email, password);
    } catch (error) {
      this.message.set(loginErrorMessage(error));
    } finally {
      this.busy.set(false);
    }
    if (result !== undefined) this.deps.onAuthenticated(result);
  }
}
