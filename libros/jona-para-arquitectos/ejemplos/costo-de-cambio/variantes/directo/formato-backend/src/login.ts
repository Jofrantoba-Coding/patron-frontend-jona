import { Button, Label, TextField } from '../../../../comun/pantalla.js';

export interface LoginResult {
  token: string;
  user: { id: number; usuario: string; nombre: string };
}

export interface LoginScreen {
  title: Label;
  email: TextField;
  emailError: Label;
  password: TextField;
  passwordError: Label;
  submit: Button;
  message: Label;
}

export interface LoginOptions {
  baseUrl: string;
  onAuthenticated: (result: LoginResult) => void;
}

/** Cuerpo de error del backend: `{ error: { code, message, fields: [{ name, message }] }, traceId }`. */
interface ErrorBody {
  error?: { code?: string; fields?: FieldError[] };
}

interface FieldError {
  name: string;
  message: string;
}

const MESSAGES: Record<string, string> = {
  INVALID_CREDENTIALS: 'Correo o contraseña incorrectos.',
  USER_DISABLED: 'Su usuario está bloqueado. Contacte al administrador.',
  VALIDATION_ERROR: 'Revise los datos marcados.',
};
const GENERIC_ERROR = 'No se pudo iniciar sesión. Intente de nuevo.';
const NETWORK_ERROR = 'No se pudo conectar con el servidor. Revise su conexión.';

/** La pantalla de login completa: controles, estado, llamada HTTP y mensajes en un solo módulo. */
export function createLogin({ baseUrl, onAuthenticated }: LoginOptions): LoginScreen {
  const screen: LoginScreen = {
    title: new Label(),
    email: new TextField(),
    emailError: new Label(),
    password: new TextField(),
    passwordError: new Label(),
    submit: new Button(),
    message: new Label(),
  };
  screen.title.text = 'Iniciar sesión';
  screen.submit.label = 'Ingresar';
  screen.submit.className = 'boton-primario';
  screen.submit.onClick(() => void submit());

  function setBusy(busy: boolean): void {
    screen.email.enabled = !busy;
    screen.password.enabled = !busy;
    screen.submit.enabled = !busy;
  }

  function showErrors(message: string, fields: FieldError[] = []): void {
    const detail = (name: string) => fields.find((f) => f.name === name)?.message ?? '';
    screen.message.text = message;
    screen.emailError.text = detail('correo');
    screen.passwordError.text = detail('clave');
  }

  async function submit(): Promise<void> {
    showErrors('');
    setBusy(true);   // el botón deshabilitado evita el doble envío
    let response: Response;
    try {
      response = await fetch(`${baseUrl}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ correo: screen.email.value, clave: screen.password.value }),
      });
    } catch {
      setBusy(false);
      showErrors(NETWORK_ERROR);
      return;
    }
    const body = await response.json().catch(() => ({}));
    setBusy(false);
    if (response.ok) {
      onAuthenticated({ token: body.accessToken, user: body.user });
    } else {
      const { error } = body as ErrorBody;
      showErrors(MESSAGES[error?.code ?? ''] ?? GENERIC_ERROR, error?.fields);
    }
  }

  return screen;
}
