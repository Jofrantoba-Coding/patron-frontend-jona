// ui-iniciar-sesion-impl.component.ts
// Capa: Implementation — solo métodos, sin HTML
// Responsabilidad: sobreescribir login, goToCreateAccount, goToRecoverPassword con lógica real
// Restricciones: sin template propio — reutiliza el templateUrl del Template
import { Component, OnInit } from '@angular/core';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { UiIniciarSesionComponent } from './ui-iniciar-sesion.component';

@Component({
  selector: 'app-ui-iniciar-sesion-impl',
  standalone: true,
  imports: [FormsModule],
  // Reutiliza el template del componente base — sin duplicar HTML
  templateUrl: './ui-iniciar-sesion.component.html',
})
export class UiIniciarSesionImplComponent extends UiIniciarSesionComponent implements OnInit {
  private authService = inject(AuthService);
  private router = inject(Router);

  override ngOnInit(): void {
    console.log('UiIniciarSesionImpl mounted (implementation)');
  }

  override login(email: string, password: string): void {
    this.authService.login(email, password)
      .then(response => {
        localStorage.setItem('jona_authenticated', 'true');
        localStorage.setItem('jona_token', response.token);
        localStorage.setItem('jona_user', JSON.stringify(response.user));
        this.router.navigate(['/homesesion']);
      })
      .catch(error => {
        console.error('Login failed:', error);
        window.alert(error.message);
      });
  }

  override goToCreateAccount(): void {
    window.alert('Implementation — go to create account');
  }

  override goToRecoverPassword(): void {
    window.alert('Implementation — go to recover password');
  }
}
