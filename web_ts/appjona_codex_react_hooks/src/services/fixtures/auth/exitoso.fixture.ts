// Capa: Fixture
// Responsabilidad: respuesta tipada de un login exitoso.
// Restricciones: datos estaticos; sin logica.
import type { AuthSession } from '../../InterAuthService';

export const exitosoFixture: AuthSession = {
  token: 'mock-token-usr-architect',
  user: {
    id: 'usr-architect',
    name: 'Jona Architect',
    email: 'architect@jona.dev',
    role: 'architect',
  },
  message: 'Autenticación exitosa.',
};
