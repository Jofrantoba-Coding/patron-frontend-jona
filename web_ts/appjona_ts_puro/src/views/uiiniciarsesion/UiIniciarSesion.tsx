// UiIniciarSesion.tsx
// Template class — implements the login interface using vanilla DOM
import { InterUiIniciarSesion } from './InterUiIniciarSesion';

export class UiIniciarSesion implements InterUiIniciarSesion {
  private emailInput!: HTMLInputElement;
  private passwordInput!: HTMLInputElement;
  private loginButton!: HTMLButtonElement;
  private createAccountButton!: HTMLButtonElement;
  private recoverPasswordButton!: HTMLButtonElement;

  constructor() {
    this.initializeUI();
    this.setupEventListeners();
  }

  private initializeUI(): void {
    // Create HTML elements for the login form
    const form = document.createElement('form');
    const emailLabel = document.createElement('label');
    const passwordLabel = document.createElement('label');
    this.emailInput = document.createElement('input');
    this.passwordInput = document.createElement('input');
    this.loginButton = document.createElement('button');
    this.createAccountButton = document.createElement('button');
    this.recoverPasswordButton = document.createElement('button');

    // Set attributes and text for the elements
    emailLabel.textContent = 'Email:';
    passwordLabel.textContent = 'Password:';
    this.emailInput.type = 'email';
    this.passwordInput.type = 'password';
    this.loginButton.textContent = 'Login';
    this.createAccountButton.textContent = 'Create account';
    this.recoverPasswordButton.textContent = 'Recover password';

    // Append elements to the form
    form.appendChild(emailLabel);
    form.appendChild(this.emailInput);
    form.appendChild(passwordLabel);
    form.appendChild(this.passwordInput);
    form.appendChild(this.loginButton);
    form.appendChild(this.createAccountButton);
    form.appendChild(this.recoverPasswordButton);

    // Append form to the document body
    document.body.appendChild(form);
  }

  private setupEventListeners(): void {
    // Attach event listeners to the buttons
    this.loginButton.addEventListener('click', () => this.login(this.emailInput.value, this.passwordInput.value));
    this.createAccountButton.addEventListener('click', () => this.goToCreateAccount());
    this.recoverPasswordButton.addEventListener('click', () => this.goToRecoverPassword());
  }

  login(email: string, password: string): void {
    // Template login logic
    window.alert('Template — login clicked');
    console.log(`Template — email: ${email}, password: ${password}`);
  }

  goToCreateAccount(): void {
    // Template navigation logic
    console.log('Template — navigating to create account');
  }

  goToRecoverPassword(): void {
    // Template navigation logic
    console.log('Template — navigating to recover password');
  }

  isValidData(email: string, password: string): boolean {
    // Template validation logic
    return email !== '' && password !== '';
  }
}
