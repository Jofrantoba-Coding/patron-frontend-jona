// UiHomeSessionImpl.ts
// Hook de implementación para la vista de sesión — trabajo del integrador
import { useNavigate } from 'react-router-dom';

export function useUiHomeSessionImpl() {
  const navigate = useNavigate();

  // Lee los datos del usuario guardados tras el login
  const userRaw = localStorage.getItem('jona_user');
  const user = userRaw ? JSON.parse(userRaw) : { nombre: '', email: '' };

  function logout(): void {
    localStorage.removeItem('jona_authenticated');
    localStorage.removeItem('jona_token');
    localStorage.removeItem('jona_user');
    navigate('/login');
  }

  return {
    nombre: user.nombre as string,
    email: user.email as string,
    onLogout: logout,
  };
}
