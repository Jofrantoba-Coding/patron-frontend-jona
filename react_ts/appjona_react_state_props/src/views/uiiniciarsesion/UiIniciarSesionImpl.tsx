//UiIniciarSesionImpl.tsx
import { UiIniciarSesion } from './UiIniciarSesion';
import { UiIniciarSesionProps } from './UiIniciarSesionProps';

// Clase de implementación que hereda de la clase plantilla UiIniciarSesion
export class UiIniciarSesionImpl extends UiIniciarSesion {

  constructor(props: UiIniciarSesionProps) {
    super(props);
  }

  componentDidMount() {
    // Código que necesita ejecutarse después de que el componente se monte.
    console.log('UiIniciarSesionImpl se ha montado');
  }

  // Sobrescribir el método de inicio de sesión
  login(email: string, password: string): void {
    window.alert("New Click a iniciar sesión");
    console.log(`New Iniciando sesión desde la clase de implementación con email: ${email} y contraseña: ${password}`);
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

  isValidData(email: string, password: string): boolean {
    console.log('email:', email)
    console.log('password:', password)
    return true
  }
  
  render(): JSX.Element {
    return (
      <UiIniciarSesion
        login={this.login}
        irCrearCuenta={this.irCrearCuenta}
        irRecuperarClave={this.irRecuperarClave}
      />
    );
  }
}