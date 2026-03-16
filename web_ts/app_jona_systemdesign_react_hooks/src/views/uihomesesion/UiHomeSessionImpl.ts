// UiHomeSessionImpl.ts — Level 3: Organism / JONA Layer: Implementation
// Integrator's responsibility. Reads storage and handles navigation.
import { useNavigate } from 'react-router-dom';

export function useUiHomeSessionImpl() {
  const navigate = useNavigate();

  const userRaw = localStorage.getItem('jona_user');
  const user = userRaw ? (JSON.parse(userRaw) as { name: string; email: string }) : { name: '', email: '' };

  function logout(): void {
    localStorage.removeItem('jona_authenticated');
    localStorage.removeItem('jona_token');
    localStorage.removeItem('jona_user');
    navigate('/login');
  }

  return {
    name: user.name,
    email: user.email,
    onLogout: logout,
  };
}
