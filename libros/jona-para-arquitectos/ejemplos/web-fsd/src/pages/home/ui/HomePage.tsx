import type { LoginResult } from '../../../entities/session';
import { JButton } from '../../../shared/ui/jbutton';

export interface HomePageProps {
  session: LoginResult;
  onLogout: () => void;
}

/** Página de bienvenida: muestra la sesión y permite cerrarla. No conoce la funcionalidad de inicio de sesión. */
export function HomePage({ session, onLogout }: HomePageProps) {
  return (
    <main>
      <h1>Hola, {session.user.nombre}</h1>
      <JButton variant="outline" onClick={() => onLogout()}>Cerrar sesión</JButton>
    </main>
  );
}
