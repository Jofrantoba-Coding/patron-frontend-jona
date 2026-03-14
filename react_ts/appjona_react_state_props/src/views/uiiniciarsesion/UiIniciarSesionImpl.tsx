// UiIniciarSesionImpl.tsx
// Implementation class — extends the template and overrides business logic methods
import { UiIniciarSesion } from './UiIniciarSesion';
import { AuthService } from '../../services/AuthService';

export class UiIniciarSesionImpl extends UiIniciarSesion {

  componentDidMount() {
    // Equivalent to useEffect with [] — runs after mount
    console.log('UiIniciarSesionImpl mounted (implementation)');
  }

  // Override login — calls AuthService (mock)
  login(email: string, password: string): void {
    AuthService.login(email, password)
      .then((response) => {
        console.log('Login successful:', response);
        localStorage.setItem('jona_authenticated', 'true');
        localStorage.setItem('jona_token', response.token);
        localStorage.setItem('jona_user', JSON.stringify(response.user));
        this.props.navigate('/homesesion');
      })
      .catch((error) => {
        console.error('Login failed:', error);
        window.alert(error.message);
      });
  }

  // Override goToCreateAccount
  goToCreateAccount(): void {
    window.alert('Implementation — go to create account');
    console.log('Implementation — navigating to create account');
  }

  // Override goToRecoverPassword
  goToRecoverPassword(): void {
    window.alert('Implementation — go to recover password');
    console.log('Implementation — navigating to recover password');
  }

  isValidData(email: string, password: string): boolean {
    console.log('email:', email);
    console.log('password:', password);
    return true;
  }
}
