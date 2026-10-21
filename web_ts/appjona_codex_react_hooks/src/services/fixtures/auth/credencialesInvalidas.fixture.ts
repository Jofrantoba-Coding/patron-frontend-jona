// Capa: Fixture
// Responsabilidad: respuesta tipada de credenciales invalidas.
// Restricciones: datos estaticos; sin logica.
import type { AuthErrorFixture } from '../../InterAuthService';

export const credencialesInvalidasFixture: AuthErrorFixture = {
  status: 401,
  message: 'Credenciales inválidas. Verifica tu email y contraseña.',
};
