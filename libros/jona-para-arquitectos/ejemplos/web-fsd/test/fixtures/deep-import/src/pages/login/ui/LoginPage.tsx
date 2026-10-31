// Violación: la página entra al slice sin pasar por su index.ts.
import { UiLogin } from '../../../features/auth-login/ui/UiLogin';

export const LoginPage = () => <UiLogin />;
