// Capa: Implementation
// Responsabilidad: conectar el organismo con servicios, router y storage.
// Restricciones: sin JSX ni estilos; depende del contrato InterAuthService, nunca de una implementacion concreta.
import type { FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { persistAuthenticatedSession } from '../../appStorage';
import type { InterAuthService } from '../../services/InterAuthService';
import { authService } from '../../services/authServiceComposer';
import {
  useUiIniciarSesion,
  type UiIniciarSesionTemplateModel,
} from './UiIniciarSesionTemplateModel';

export function useUiIniciarSesionImpl(
  service: InterAuthService = authService,
): UiIniciarSesionTemplateModel {
  const base = useUiIniciarSesion();
  const navigate = useNavigate();

  function login(email: string, password: string): void {
    base.setIsSubmitting(true);
    base.setSubmitError('');

    service.login(email, password)
      .then((session) => {
        persistAuthenticatedSession(session);
        navigate('/homesesion');
      })
      .catch((error: unknown) => {
        const message =
          error instanceof Error ? error.message : 'No fue posible iniciar sesión.';
        console.error('UiIniciarSesionImpl.login failed:', error);
        base.setSubmitError(message);
      })
      .finally(() => {
        base.setIsSubmitting(false);
      });
  }

  function goToCreateAccount(): void {
    window.alert('Aquí se integra el flujo real de creación de cuenta desde el Impl.');
  }

  function goToRecoverPassword(): void {
    window.alert('Aquí se integra el flujo real de recuperación desde el Impl.');
  }

  // En hooks, los handlers del template capturan las funciones base.
  // Por eso, cuando se sobreescribe un método del contrato también se reescriben los handlers dependientes.
  function handlerLogin(event: FormEvent<HTMLFormElement>): void {
    event.preventDefault();
    base.setSubmitError('');

    if (base.isValidData(base.email, base.password)) {
      login(base.email, base.password);
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
    handlerLogin,
    handlerGoToCreateAccount,
    handlerGoToRecoverPassword,
  };
}
