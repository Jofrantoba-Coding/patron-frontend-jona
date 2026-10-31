import type { LoginResult } from '../../../entities/session';
import { UiLogin, type InterAuthService } from '../../../features/auth-login';

export interface LoginPageProps {
  service: InterAuthService;
  onAuthenticated: (result: LoginResult) => void;
}

/** Página: compone la entrada de la funcionalidad; el servicio le llega desde app. */
export function LoginPage({ service, onAuthenticated }: LoginPageProps) {
  return (
    <main>
      <UiLogin service={service} onAuthenticated={onAuthenticated} />
    </main>
  );
}
