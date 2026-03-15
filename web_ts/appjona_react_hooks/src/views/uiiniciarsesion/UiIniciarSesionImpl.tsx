// UiIniciarSesionImpl.tsx
// Implementation hook — integrator's responsibility
// Methods only, no UI code
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUiIniciarSesion } from './UiIniciarSesion';
import { AuthService } from '../../services/AuthService';
import React from 'react';

export function useUiIniciarSesionImpl() {
  const base = useUiIniciarSesion();
  const navigate = useNavigate();

  useEffect(() => {
    console.log('useUiIniciarSesionImpl mounted (implementation)');
  }, []);

  // Override login — calls AuthService (mock)
  function login(email: string, password: string): void {
    AuthService.login(email, password)
      .then((response) => {
        console.log('Login successful:', response);
        // Save token and user data to localStorage
        localStorage.setItem('jona_authenticated', 'true');
        localStorage.setItem('jona_token', response.token);
        localStorage.setItem('jona_user', JSON.stringify(response.user));
        // Navigate to session view
        navigate('/homesesion');
      })
      .catch((error) => {
        console.error('Login failed:', error);
        window.alert(error.message);
      });
  }

  // Override goToCreateAccount
  function goToCreateAccount(): void {
    window.alert('Go to create account');
    console.log('Implementation — navigating to create account');
  }

  // Override goToRecoverPassword
  function goToRecoverPassword(): void {
    window.alert('Go to recover password');
    console.log('Implementation — navigating to recover password');
  }

  function isValidData(email: string, password: string): boolean {
    return email !== '' && password !== '';
  }

  function handlerLogin(e: React.FormEvent): void {
    e.preventDefault();
    if (isValidData(base.email, base.password)) {
      login(base.email, base.password);
    } else {
      window.alert('Please fill in both fields.');
    }
  }

  function handlerGoToCreateAccount(): void {
    goToCreateAccount();
  }

  function handlerGoToRecoverPassword(): void {
    goToRecoverPassword();
  }

  return {
    ...base,
    login,
    goToCreateAccount,
    goToRecoverPassword,
    isValidData,
    handlerLogin,
    handlerGoToCreateAccount,
    handlerGoToRecoverPassword,
  };
}
