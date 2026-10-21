// Capa: Fixture
// Responsabilidad: respuesta tipada de una falla del servidor.
// Restricciones: datos estaticos; sin logica.
import type { AuthErrorFixture } from '../../InterAuthService';

export const errorServidorFixture: AuthErrorFixture = {
  status: 500,
  message: 'El servidor no está disponible. Intenta nuevamente en unos minutos.',
};
