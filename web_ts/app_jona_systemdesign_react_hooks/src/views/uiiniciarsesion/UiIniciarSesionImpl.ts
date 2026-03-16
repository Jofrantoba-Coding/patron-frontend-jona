// UiIniciarSesionImpl.ts — Level 3: Organism / JONA Layer: Implementation
// Integrator's responsibility. Methods only — no UI code.
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useUiIniciarSesion } from './UiIniciarSesion';
import { AuthService } from '../../services/AuthService';

export function useUiIniciarSesionImpl() {
  const base = useUiIniciarSesion();
  const navigate = useNavigate();

  function login(email: string, password: string): void {
    base.setIsLoading(true);
    AuthService.login(email, password)
      .then((res) => {
        localStorage.setItem('jona_authenticated', 'true');
        localStorage.setItem('jona_token', res.token);
        localStorage.setItem('jona_user', JSON.stringify(res.user));
        navigate('/homesesion');
      })
      .catch((err: { message: string }) => {
        base.setAlertMessage(err.message ?? 'Login failed');
      })
      .finally(() => {
        base.setIsLoading(false);
      });
  }

  function goToCreateAccount(): void {
    window.alert('Navigate to create account');
  }

  function goToRecoverPassword(): void {
    window.alert('Navigate to recover password');
  }

  function handlerLogin(e: React.FormEvent): void {
    e.preventDefault();
    if (base.isValidData(base.email, base.password)) {
      login(base.email, base.password);
    }
  }

  return {
    ...base,
    login,
    goToCreateAccount,
    goToRecoverPassword,
    handlerLogin,
    handlerGoToCreateAccount: goToCreateAccount,
    handlerGoToRecoverPassword: goToRecoverPassword,
  };
}
