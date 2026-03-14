// UiIniciarSesionImpl.tsx
// Hook de implementación — trabajo del integrador
// Solo métodos, sin código de interfaz gráfica
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUiIniciarSesion } from './UiIniciarSesion';
import { AuthService } from '../../services/AuthService';
import React from 'react';

export function useUiIniciarSesionImpl() {
  const base = useUiIniciarSesion();
  const navigate = useNavigate();

  useEffect(() => {
    console.log('useUiIniciarSesionImpl montado (implementación)');
  }, []);

  // Sobreescribir login — llama al AuthService (mock)
  function login(email: string, password: string): void {
    AuthService.login(email, password)
      .then((response) => {
        console.log('Login exitoso:', response);
        // Guarda el token y datos del usuario en localStorage
        localStorage.setItem('jona_authenticated', 'true');
        localStorage.setItem('jona_token', response.token);
        localStorage.setItem('jona_user', JSON.stringify(response.user));
        // Navega a la vista de sesión
        navigate('/homesesion');
      })
      .catch((error) => {
        console.error('Login fallido:', error);
        window.alert(error.message);
      });
  }

  function irCrearCuenta(): void {
    window.alert('Click a ir a cuenta');
    console.log('Implementación — navegando a crear cuenta');
  }

  function irRecuperarClave(): void {
    window.alert('Click a ir a recuperar clave');
    console.log('Implementación — navegando a recuperar clave');
  }

  function isValidData(email: string, password: string): boolean {
    return email !== '' && password !== '';
  }

  function handlerLogin(e: React.FormEvent): void {
    e.preventDefault();
    if (isValidData(base.email, base.password)) {
      login(base.email, base.password);
    } else {
      window.alert('Por favor, complete ambos campos.');
    }
  }

  function handlerCrearCuenta(): void {
    irCrearCuenta();
  }

  function handlerRecuperarClave(): void {
    irRecuperarClave();
  }

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
