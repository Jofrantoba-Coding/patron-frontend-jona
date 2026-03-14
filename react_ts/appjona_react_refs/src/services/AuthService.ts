// AuthService.ts
// Service layer — integrator's responsibility
// Simulates a backend call with mock data

export interface AuthResponse {
  success: boolean;
  token: string;
  user: {
    email: string;
    name: string;
  };
  message: string;
}

// Mock users — simulates the backend database
const MOCK_USERS = [
  { email: 'admin@jona.com', password: '123456', name: 'Administrator' },
  { email: 'user@jona.com',  password: 'abcdef', name: 'Demo User'     },
];

export const AuthService = {
  login: (email: string, password: string): Promise<AuthResponse> => {
    return new Promise((resolve, reject) => {
      // Simulate network latency
      setTimeout(() => {
        const user = MOCK_USERS.find(
          (u) => u.email === email && u.password === password
        );
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
    });
  },
};
