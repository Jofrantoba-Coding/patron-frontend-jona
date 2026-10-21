// Capa: Composer
// Responsabilidad: decidir que implementacion de InterAuthService recibe la app.
// Restricciones: estado siempre declarado y valido; un valor desconocido falla en el arranque.
import type { AuthMode, AuthScenario, InterAuthService } from './InterAuthService';
import { createAuthServiceHttp } from './AuthServiceHttp';

const AUTH_MODES: readonly AuthMode[] = ['real', 'mock'];
const AUTH_SCENARIOS: readonly AuthScenario[] = [
  'exitoso',
  'credencialesInvalidas',
  'errorServidor',
];

export interface AuthComposerConfig {
  mode?: string;
  scenario?: string;
  apiUrl?: string;
}

function isAuthMode(value: string): value is AuthMode {
  return (AUTH_MODES as readonly string[]).includes(value);
}

function isAuthScenario(value: string): value is AuthScenario {
  return (AUTH_SCENARIOS as readonly string[]).includes(value);
}

export function composeAuthService(config: AuthComposerConfig): InterAuthService {
  // Valor vacio equivale a no declarado: aplica el default.
  const mode = config.mode || 'mock';
  const scenario = config.scenario || 'exitoso';

  if (!isAuthMode(mode)) {
    throw new Error(
      `VITE_AUTH_MODE invalido: "${mode}". Valores permitidos: ${AUTH_MODES.join(', ')}.`,
    );
  }

  // El escenario se valida siempre, aunque solo lo consuma el mock.
  if (!isAuthScenario(scenario)) {
    throw new Error(
      `VITE_AUTH_SCENARIO invalido: "${scenario}". Valores permitidos: ${AUTH_SCENARIOS.join(', ')}.`,
    );
  }

  if (mode === 'real') {
    if (!config.apiUrl) {
      throw new Error('VITE_AUTH_API_URL es obligatorio cuando VITE_AUTH_MODE=real.');
    }
    return createAuthServiceHttp(config.apiUrl);
  }

  // El mock se carga bajo demanda: en modo real sus fixtures nunca se descargan.
  return {
    login: (email, password) =>
      import('./AuthServiceMock').then(({ createAuthServiceMock }) =>
        createAuthServiceMock(scenario).login(email, password),
      ),
  };
}

export const authService: InterAuthService = composeAuthService({
  mode: import.meta.env.VITE_AUTH_MODE,
  scenario: import.meta.env.VITE_AUTH_SCENARIO,
  apiUrl: import.meta.env.VITE_AUTH_API_URL,
});
