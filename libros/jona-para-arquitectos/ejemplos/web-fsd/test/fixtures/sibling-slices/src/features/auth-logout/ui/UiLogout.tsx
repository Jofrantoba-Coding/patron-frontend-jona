// Violación: dos slices de la misma capa se importan (aunque sea por la API pública).
import { UiLogin } from '../../auth-login';

export const UiLogout = () => <UiLogin />;
