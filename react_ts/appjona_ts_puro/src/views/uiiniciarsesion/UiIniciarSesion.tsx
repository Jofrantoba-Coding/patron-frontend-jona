// UiIniciarSesion.tsx
import { InterUiIniciarSesion } from './InterUiIniciarSesion';

// Clase plantilla que implementa la interfaz de inicio de sesión
export class UiIniciarSesion implements InterUiIniciarSesion {
  private emailInput: HTMLInputElement;
  private passwordInput: HTMLInputElement;
  private loginButton: HTMLButtonElement;
  private crearCuentaButton: HTMLButtonElement;
  private recuperarClaveButton: HTMLButtonElement;

  constructor() {
    this.initializeUI();
    this.setupEventListeners();
  }

  private initializeUI(): void {
    // Crear elementos HTML para la interfaz de inicio de sesión
    const form = document.createElement('form');
    const emailLabel = document.createElement('label');
    const passwordLabel = document.createElement('label');
    this.emailInput = document.createElement('input');
    this.passwordInput = document.createElement('input');
    this.loginButton = document.createElement('button');
    this.crearCuentaButton = document.createElement('button');
    this.recuperarClaveButton = document.createElement('button');

    // Configurar atributos y texto para los elementos
    emailLabel.textContent = 'Email:';
    passwordLabel.textContent = 'Contraseña:';
    this.emailInput.type = 'email';
    this.passwordInput.type = 'password';
    this.loginButton.textContent = 'Iniciar sesión';
    this.crearCuentaButton.textContent = 'Crear cuenta';
    this.recuperarClaveButton.textContent = 'Recuperar contraseña';

    // Agregar elementos al formulario
    form.appendChild(emailLabel);
    form.appendChild(this.emailInput);
    form.appendChild(passwordLabel);
    form.appendChild(this.passwordInput);
    form.appendChild(this.loginButton);
    form.appendChild(this.crearCuentaButton);
    form.appendChild(this.recuperarClaveButton);

    // Agregar formulario al cuerpo del documento
    document.body.appendChild(form);
  }

  private setupEventListeners(): void {
    // Agregar escuchadores de eventos para los botones
    this.loginButton.addEventListener('click', () => this.login(this.emailInput.value, this.passwordInput.value));
    this.crearCuentaButton.addEventListener('click', () => this.irCrearCuenta());
    this.recuperarClaveButton.addEventListener('click', () => this.irRecuperarClave());
  }

  login(email: string, password: string): void {
    // Lógica para iniciar sesión
    window.alert("old Click a plantilla iniciar sesión");
    console.log(`old Iniciando sesión con email: ${email} y contraseña: ${password}`);
  }

  irCrearCuenta(): void {
    // Lógica para ir a la página de creación de cuenta
    console.log('Navegando a la página de creación de cuenta');
  }

  irRecuperarClave(): void {
    // Lógica para ir a la página de recuperación de contraseña
    console.log('Navegando a la página de recuperación de contraseña');
  }

  isValidData(email: string, password: string): boolean {
    // Lógica para validar los datos de inicio de sesión
    return email !== '' && password !== '';
  }
}