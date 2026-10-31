// Violación: la página elige el adaptador; solo la raíz de composición (app) puede hacerlo.
import { createAuthServiceHttp, UiLogin } from '../../../features/auth-login';

export const LoginPage = () => <UiLogin service={createAuthServiceHttp({ baseUrl: '' })} />;
