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

interface MockUserRecord extends AuthUser {
  password: string;
}

const MOCK_USERS: MockUserRecord[] = [
  {
    id: 'usr-architect',
    name: 'Jona Architect',
    email: 'architect@jona.dev',
    password: 'codex123',
    role: 'architect',
  },
  {
    id: 'usr-integrator',
    name: 'Jona Integrator',
    email: 'integrator@jona.dev',
    password: 'codex123',
    role: 'integrator',
  },
];

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => {
    window.setTimeout(resolve, ms);
  });
}

export const AuthService = {
  async login(email: string, password: string): Promise<AuthSession> {
    await sleep(500);

    const normalizedEmail = email.trim().toLowerCase();
    const normalizedPassword = password.trim();
    const user = MOCK_USERS.find((entry) => {
      return entry.email === normalizedEmail && entry.password === normalizedPassword;
    });

    if (!user) {
      throw new Error(
        'Credenciales inválidas. Usa architect@jona.dev / codex123 o integrator@jona.dev / codex123.',
      );
    }

    return {
      token: `mock-token-${user.id}-${Date.now()}`,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      message: 'Autenticación exitosa.',
    };
  },
};
