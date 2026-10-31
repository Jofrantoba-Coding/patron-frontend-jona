import type { InterAuthService, LoginResult } from '../comun/InterAuthService.js';
import { hasRequiredData, loginErrorMessage, MISSING_DATA_ERROR } from '../comun/mensajes.js';

export interface LoginModelDeps {
  service: InterAuthService;
  onAuthenticated: (result: LoginResult) => void;
}

export interface LoginState {
  email: string;
  password: string;
  message: string;
  busy: boolean;
}

/** Modelo: el estado y la operación de negocio. Avisa a sus observadores cuando cambia. */
export class LoginModel {
  private current: LoginState = { email: '', password: '', message: '', busy: false };
  private readonly observers: Array<() => void> = [];

  constructor(private readonly deps: LoginModelDeps) {}

  get state(): Readonly<LoginState> {
    return this.current;
  }

  subscribe(observer: () => void): void {
    this.observers.push(observer);
  }

  setEmail(email: string): void {
    this.change({ email });
  }

  setPassword(password: string): void {
    this.change({ password });
  }

  async login(): Promise<void> {
    const { email, password, busy } = this.current;
    if (busy) return;                                   // evita el doble envío
    if (!hasRequiredData(email, password)) {
      this.change({ message: MISSING_DATA_ERROR });
      return;
    }
    this.change({ message: '', busy: true });           // limpia el error del intento anterior
    let result: LoginResult | undefined;
    let message = '';
    try {
      result = await this.deps.service.login(email, password);
    } catch (error) {
      message = loginErrorMessage(error);
    }
    this.change({ message, busy: false });
    if (result !== undefined) this.deps.onAuthenticated(result);
  }

  private change(changes: Partial<LoginState>): void {
    this.current = { ...this.current, ...changes };
    for (const observer of this.observers) observer();
  }
}
