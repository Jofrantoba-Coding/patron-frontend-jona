// UiIniciarSesionImpl.tsx
// Hook de implementación que sobreescribe los métodos del hook plantilla
// No contiene código de interfaz gráfica
import { useEffect } from 'react';
import { useUiIniciarSesion } from './UiIniciarSesion';

export function useUiIniciarSesionImpl() {
  const base = useUiIniciarSesion();

  useEffect(() => {
    // Equivalente a componentDidMount — implementación
    console.log('useUiIniciarSesionImpl montado (implementación)');
  }, []);

  // Sobreescribir login
  function login(email: string, password: string): void {
    window.alert('New Click a iniciar sesión');
    console.log(`New Implementación — email: ${email}, password: ${password}`);
    // Aquí iría la llamada al servidor
  }

  // Sobreescribir irCrearCuenta
  function irCrearCuenta(): void {
    window.alert('Click a ir a cuenta');
    console.log('Implementación — navegando a crear cuenta');
  }

  // Sobreescribir irRecuperarClave
  function irRecuperarClave(): void {
    window.alert('Click a ir a recuperar clave');
    console.log('Implementación — navegando a recuperar clave');
  }

  function isValidData(email: string, password: string): boolean {
    console.log('email:', email);
    console.log('password:', password);
    return true;
  }

  function handlerLogin(e: React.FormEvent): void {
    e.preventDefault();
    if (isValidData(base.email, base.password)) {
      login(base.email, base.password);
    } else {
      window.alert('Por favor, complete ambos campos. implementación');
    }
  }

  function handlerCrearCuenta(): void {
    irCrearCuenta();
  }

  function handlerRecuperarClave(): void {
    irRecuperarClave();
  }

  // Retorna el estado de la plantilla + métodos sobreescritos
  return {
    ...base,
    login,
    irCrearCuenta,
    irRecuperarClave,
    isValidData,
    handlerLogin,
    handlerCrearCuenta,
    handlerRecuperarClave,
  };
}
