// UiIniciarSesion.tsx
// Template hook + visual component for the login view
import { useState, useEffect } from 'react';
import { InterUiIniciarSesion } from './InterUiIniciarSesion';
import React from 'react';

// Template hook — provides state and base methods
export function useUiIniciarSesion(): InterUiIniciarSesion & {
  email: string;
  password: string;
  setEmail: (v: string) => void;
  setPassword: (v: string) => void;
  handlerLogin: (e: React.FormEvent) => void;
  handlerGoToCreateAccount: () => void;
  handlerGoToRecoverPassword: () => void;
} {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    // Equivalent to componentDidMount — template
    console.log('useUiIniciarSesion mounted (template)');
  }, []);

  function login(email: string, password: string): void {
    window.alert('Template — login clicked');
    console.log(`Template — email: ${email}, password: ${password}`);
  }

  function goToCreateAccount(): void {
    console.log('Template — navigating to create account');
  }

  function goToRecoverPassword(): void {
    console.log('Template — navigating to recover password');
  }

  function isValidData(email: string, password: string): boolean {
    return email !== '' && password !== '';
  }

  function handlerLogin(e: React.FormEvent): void {
    e.preventDefault();
    if (isValidData(email, password)) {
      login(email, password);
    } else {
      window.alert('Please fill in both fields. (template)');
    }
  }

  function handlerGoToCreateAccount(): void {
    goToCreateAccount();
  }

  function handlerGoToRecoverPassword(): void {
    goToRecoverPassword();
  }

  return {
    email,
    password,
    setEmail,
    setPassword,
    login,
    goToCreateAccount,
    goToRecoverPassword,
    isValidData,
    handlerLogin,
    handlerGoToCreateAccount,
    handlerGoToRecoverPassword,
  };
}

// Props the visual component accepts — allows injecting methods from outside
interface UiIniciarSesionProps {
  email: string;
  password: string;
  setEmail: (v: string) => void;
  setPassword: (v: string) => void;
  handlerLogin: (e: React.FormEvent) => void;
  handlerGoToCreateAccount: () => void;
  handlerGoToRecoverPassword: () => void;
}

// Visual template component — renders only, contains no business logic
export const UiIniciarSesion: React.FC<UiIniciarSesionProps> = ({
  email,
  password,
  setEmail,
  setPassword,
  handlerLogin,
  handlerGoToCreateAccount,
  handlerGoToRecoverPassword,
}) => {
  return (
    <div className="max-w-sm mx-auto p-4">
      <form className="space-y-2 w-full sm:w-[400px]">
        <div className="grid w-full items-center">
          <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
            Email
          </label>
          <input
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            required
            id="txtEmail"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="grid w-full items-center">
          <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
            Password
          </label>
          <input
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            required
            id="txtPassword"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <div className="w-full">
          <button
            type="submit"
            className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
            onClick={handlerLogin}
          >
            Login
          </button>
        </div>
        <div className="w-full flex gap-2">
          <button
            type="button"
            className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
            onClick={handlerGoToCreateAccount}
          >
            Create account
          </button>
          <button
            type="button"
            className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
            onClick={handlerGoToRecoverPassword}
          >
            Recover password
          </button>
        </div>
      </form>
    </div>
  );
};
