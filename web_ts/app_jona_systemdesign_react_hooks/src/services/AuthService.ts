// AuthService.ts — Service layer
// Used exclusively by Implementation layers. Never imported by Templates or Atoms.
export interface AuthResponse {
  success: boolean;
  token: string;
  user: { email: string; name: string };
  message: string;
}

const MOCK_USERS = [
  { email: 'admin@jona.com', password: '123456', name: 'Administrator' },
  { email: 'user@jona.com',  password: 'abcdef', name: 'Demo User'     },
];

export const AuthService = {
  login: (email: string, password: string): Promise<AuthResponse> =>
    new Promise((resolve, reject) => {
      setTimeout(() => {
        const user = MOCK_USERS.find((u) => u.email === email && u.password === password);
        if (user) {
          resolve({
            success: true,
            token: `mock-token-${Date.now()}`,
            user: { email: user.email, name: user.name },
            message: 'Login successful',
          });
        } else {
          reject({ success: false, message: 'Invalid credentials' });
        }
      }, 800);
    }),
};
