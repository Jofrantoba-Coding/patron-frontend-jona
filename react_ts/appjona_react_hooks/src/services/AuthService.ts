// AuthService.ts
// Capa de servicio — el integrador trabaja aquí
// Simula una llamada al backend con datos mock

export interface AuthResponse {
  success: boolean;
  token: string;
  user: {
    email: string;
    nombre: string;
  };
  message: string;
}

// Usuarios mock — simula la base de datos del backend
const MOCK_USERS = [
  { email: 'admin@jona.com', password: '123456', nombre: 'Administrador' },
  { email: 'user@jona.com',  password: 'abcdef', nombre: 'Usuario Demo'  },
];

export const AuthService = {
  login: (email: string, password: string): Promise<AuthResponse> => {
    return new Promise((resolve, reject) => {
      // Simula latencia de red
      setTimeout(() => {
        const user = MOCK_USERS.find(
          (u) => u.email === email && u.password === password
        );

        if (user) {
          resolve({
            success: true,
            token: `mock-token-${Date.now()}`,
            user: { email: user.email, nombre: user.nombre },
            message: 'Login exitoso',
          });
        } else {
          reject({ success: false, message: 'Credenciales incorrectas' });
        }
      }, 800);
    });
  },
};
