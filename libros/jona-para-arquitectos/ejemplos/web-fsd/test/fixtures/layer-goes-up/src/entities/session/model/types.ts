// Violación: una entidad importa una funcionalidad, que está en una capa superior.
import type { UiLogin } from '../../../features/auth-login';

export type LoginEntry = typeof UiLogin;
