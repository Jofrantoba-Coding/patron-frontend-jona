// UiHomeSessionImpl.ts
// Implementation hook for the session view — integrator's responsibility
import { useNavigate } from 'react-router-dom';

export function useUiHomeSessionImpl() {
  const navigate = useNavigate();

  // Read user data saved after login
  const userRaw = localStorage.getItem('jona_user');
  const user = userRaw ? JSON.parse(userRaw) : { name: '', email: '' };

  function logout(): void {
    localStorage.removeItem('jona_authenticated');
    localStorage.removeItem('jona_token');
    localStorage.removeItem('jona_user');
    navigate('/login');
  }

  return {
    name: (user.nombre ?? user.name) as string,
    email: user.email as string,
    onLogout: logout,
  };
}
