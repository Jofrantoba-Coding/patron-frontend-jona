// Capa: Contract
// Responsabilidad: declarar el contrato de autenticacion y sus tipos compartidos.
// Restricciones: solo tipos; ninguna implementacion concreta.
export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: 'architect' | 'integrator';
}

export interface AuthSession {
  token: string;
  user: AuthUser;
  message: string;
}

export type AuthMode = 'real' | 'mock';

export type AuthScenario = 'exitoso' | 'credencialesInvalidas' | 'errorServidor';

export interface AuthErrorFixture {
  status: 401 | 500;
  message: string;
}

export interface InterAuthService {
  login(email: string, password: string): Promise<AuthSession>;
}
