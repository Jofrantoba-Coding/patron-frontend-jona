// API pública del slice (FSD) = exportación pública de la unidad (N4).
// La entrada, el tipo del puerto y las fábricas de adaptadores; nada más.
export { UiLogin, type UiLoginProps } from './ui/UiLogin';
export type { InterAuthService } from './model/InterAuthService';
// Solo app las importa: es la raíz de composición (regla 4 de test/architecture).
export { createAuthServiceHttp, type AuthServiceHttpOptions } from './api/createAuthServiceHttp';
export { createAuthServiceFake, type Escenario } from './api/createAuthServiceFake';
