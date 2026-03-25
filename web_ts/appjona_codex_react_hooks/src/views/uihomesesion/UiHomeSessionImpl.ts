// Capa: Implementation
// Responsabilidad: hidratar estado desde storage y resolver navegación real.
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  clearAuthenticatedSession,
  readAuthenticatedUser,
} from '../../appStorage';
import {
  useUiHomeSession,
  type UiHomeSessionTemplateModel,
} from './UiHomeSessionTemplateModel';

export function useUiHomeSessionImpl(): UiHomeSessionTemplateModel {
  const base = useUiHomeSession();
  const navigate = useNavigate();

  useEffect(() => {
    const user = readAuthenticatedUser();

    if (user) {
      base.setName(user.name);
      base.setEmail(user.email);
      return;
    }

    base.setName('Sesión no encontrada');
    base.setEmail('Reinicia el flujo desde /login');
  }, [base.setEmail, base.setName]);

  function logout(): void {
    clearAuthenticatedSession();
    navigate('/login');
  }

  function goToPublicHome(): void {
    navigate('/login');
  }

  return {
    ...base,
    logout,
    goToPublicHome,
    handlerLogout: logout,
    handlerGoToPublicHome: goToPublicHome,
  };
}
