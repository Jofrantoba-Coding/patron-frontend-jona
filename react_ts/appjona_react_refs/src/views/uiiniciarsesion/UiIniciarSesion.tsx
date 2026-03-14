// UiIniciarSesion.tsx
// Template class — React class component using createRef (uncontrolled inputs)
import { Component, createRef } from 'react';
import { InterUiIniciarSesion } from './InterUiIniciarSesion';

export class UiIniciarSesion extends Component implements InterUiIniciarSesion {
  private txtEmailRef = createRef<HTMLInputElement>();
  private txtPasswordRef = createRef<HTMLInputElement>();

  handlerLogin = () => {
    const email = this.txtEmailRef.current?.value ?? '';
    const password = this.txtPasswordRef.current?.value ?? '';
    this.login(email, password);
  }

  handlerGoToCreateAccount = () => {
    this.goToCreateAccount();
  }

  handlerGoToRecoverPassword = () => {
    this.goToRecoverPassword();
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

  render() {
    return (
      <div className="max-w-sm mx-auto p-4">
        <form className="space-y-2 w-full sm:w-[400px]">
          <div className="grid w-full items-center">
            <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Email</label>
            <input
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              required
              id="txtEmail"
              type="email"
              ref={this.txtEmailRef}
            />
          </div>
          <div className="grid w-full items-center">
            <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Password</label>
            <input
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              required
              id="txtPassword"
              type="password"
              ref={this.txtPasswordRef}
            />
          </div>
          <div className="w-full">
            <button
              type="submit"
              className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
              onClick={this.handlerLogin}
            >
              Login
            </button>
          </div>
          <div className="w-full flex gap-2">
            <button
              type="button"
              className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
              onClick={this.handlerGoToCreateAccount}
            >
              Create account
            </button>
            <button
              type="button"
              className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
              onClick={this.handlerGoToRecoverPassword}
            >
              Recover password
            </button>
          </div>
        </form>
      </div>
    );
  }
}
