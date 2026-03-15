// auth.service.ts
// Capa: Servicio externo — solo accesible desde la capa Implementation
// Simula una llamada al backend con datos mock
import { Injectable } from '@angular/core';

export interface AuthResponse {
  success: boolean;
  token: string;
  user: { email: string; name: string };
  message: string;
}

// Mock users — simula la base de datos del backend
const MOCK_USERS = [
  { email: 'admin@jona.com', password: '123456', name: 'Administrator' },
  { email: 'user@jona.com',  password: 'abcdef', name: 'Demo User'     },
];

@Injectable({ providedIn: 'root' })
export class AuthService {
  login(email: string, password: string): Promise<AuthResponse> {
    return new Promise((resolve, reject) => {
      // Simula latencia de red
      setTimeout(() => {
        const user = MOCK_USERS.find(u => u.email === email && u.password === password);
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
  }
}
