// UiIniciarSesion.tsx
// Hook plantilla + componente visual de la vista de inicio de sesión
import { useState, useEffect } from 'react';
import { InterUiIniciarSesion } from './InterUiIniciarSesion';
import React from 'react';

// Hook plantilla — provee estado y métodos base
export function useUiIniciarSesion(): InterUiIniciarSesion & {
  email: string;
  password: string;
  setEmail: (v: string) => void;
  setPassword: (v: string) => void;
  handlerLogin: (e: React.FormEvent) => void;
  handlerCrearCuenta: () => void;
  handlerRecuperarClave: () => void;
} {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    // Equivalente a componentDidMount — plantilla
    console.log('useUiIniciarSesion montado (plantilla)');
  }, []);

  function login(email: string, password: string): void {
    window.alert('Click a plantilla iniciar sesión');
    console.log(`Plantilla — email: ${email}, password: ${password}`);
  }

  function irCrearCuenta(): void {
    console.log('Plantilla — navegando a crear cuenta');
  }

  function irRecuperarClave(): void {
    console.log('Plantilla — navegando a recuperar clave');
  }

  function isValidData(email: string, password: string): boolean {
    return email !== '' && password !== '';
  }

  function handlerLogin(e: React.FormEvent): void {
    e.preventDefault();
    if (isValidData(email, password)) {
      login(email, password);
    } else {
      window.alert('Por favor, complete ambos campos. plantilla');
    }
  }

  function handlerCrearCuenta(): void {
    irCrearCuenta();
  }

  function handlerRecuperarClave(): void {
    irRecuperarClave();
  }

  return {
    email,
    password,
    setEmail,
    setPassword,
    login,
    irCrearCuenta,
    irRecuperarClave,
    isValidData,
    handlerLogin,
    handlerCrearCuenta,
    handlerRecuperarClave,
  };
}

// Props que el componente visual acepta — permite inyectar métodos desde afuera
interface UiIniciarSesionProps {
  email: string;
  password: string;
  setEmail: (v: string) => void;
  setPassword: (v: string) => void;
  handlerLogin: (e: React.FormEvent) => void;
  handlerCrearCuenta: () => void;
  handlerRecuperarClave: () => void;
}

// Componente visual plantilla — solo renderiza, no contiene lógica de negocio
export const UiIniciarSesion: React.FC<UiIniciarSesionProps> = ({
  email,
  password,
  setEmail,
  setPassword,
  handlerLogin,
  handlerCrearCuenta,
  handlerRecuperarClave,
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
            onClick={handlerCrearCuenta}
          >
            Crear cuenta
          </button>
          <button
            type="button"
            className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
            onClick={handlerRecuperarClave}
          >
            Recuperar contraseña
          </button>
        </div>
      </form>
    </div>
  );
};
