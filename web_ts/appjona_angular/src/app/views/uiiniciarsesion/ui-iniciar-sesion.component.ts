// ui-iniciar-sesion.component.ts
// Capa: Template (estructura visual + lógica base)
// Responsabilidad: estado local, JSX/template, handlers que delegan al contrato
// Restricciones: nunca importar servicios externos, navegación ni storage
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { InterUiIniciarSesion } from './inter-ui-iniciar-sesion';

@Component({
  selector: 'app-ui-iniciar-sesion',
  standalone: true,
  imports: [FormsModule],
  // Template en archivo separado — propiedad del Diseñador UI
  templateUrl: './ui-iniciar-sesion.component.html',
})
export class UiIniciarSesionComponent implements InterUiIniciarSesion, OnInit {
  // Estado local de la vista (inputs controlados)
  email = '';
  password = '';

  ngOnInit(): void {
    // Equivalente a useEffect([]) — template
    console.log('UiIniciarSesion mounted (template)');
  }

  // --- Métodos del contrato (stubs — sin servicios externos) ---

  login(email: string, password: string): void {
    window.alert('Template — login clicked');
    console.log(`Template — email: ${email}, password: ${password}`);
  }

  goToCreateAccount(): void {
    console.log('Template — navigating to create account');
  }

  goToRecoverPassword(): void {
    console.log('Template — navigating to recover password');
  }

  isValidData(email: string, password: string): boolean {
    return email !== '' && password !== '';
  }

  // --- Handlers de eventos (delegan al contrato) ---

  handlerLogin(): void {
    if (this.isValidData(this.email, this.password)) {
      this.login(this.email, this.password);
    } else {
      window.alert('Please fill in both fields. (template)');
    }
  }

  handlerGoToCreateAccount(): void {
    this.goToCreateAccount();
  }

  handlerGoToRecoverPassword(): void {
    this.goToRecoverPassword();
  }
}
