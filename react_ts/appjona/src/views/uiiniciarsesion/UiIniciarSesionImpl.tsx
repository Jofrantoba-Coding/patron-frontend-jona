//UiIniciarSesionImpl.tsx
import { UiIniciarSesion } from './UiIniciarSesion';

// Clase de implementación que hereda de la clase plantilla UiIniciarSesion
export class UiIniciarSesionImpl extends UiIniciarSesion {
  constructor() {
    super(); 
  }

  // Sobrescribir el método de inicio de sesión
  login(email: string, password: string): void {
    window.alert("Click a iniciar sesión");
    console.log(`Iniciando sesión desde la clase de implementación con email: ${email} y contraseña: ${password}`);
    // Aquí puedes agregar la lógica específica de inicio de sesión, como enviar una solicitud al servidor
  }

  // Sobrescribir otros métodos según sea necesario
  irCrearCuenta(): void {
    window.alert("Click a ir a cuenta");
    console.log('Navegando a la página de cuenta desde la clase de implementación');
    // Agregar la lógica específica para ir a la página de cuenta
  }

  irRecuperarClave(): void {
    window.alert("Click a ir a recuperar clave");
    // Lógica para ir a la página de recuperación de contraseña
    console.log('Navegando a la página de recuperación de contraseña');
  }
}