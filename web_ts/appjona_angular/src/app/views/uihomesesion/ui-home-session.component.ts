// ui-home-session.component.ts
// Capa: Template — estructura visual de la vista de sesión
// Responsabilidad: mostrar datos del usuario y botón de logout
// Restricciones: nunca importar servicios externos, navegación ni storage
import { Component, OnInit } from '@angular/core';
import { BorderLayoutComponent } from '../../uilayouts/border-layout.component';
import { HeaderComponent } from '../../uiutils/header.component';
import { FooterComponent } from '../../uiutils/footer.component';
import { InterUiHomeSession } from './inter-ui-home-session';

@Component({
  selector: 'app-ui-home-session',
  standalone: true,
  imports: [BorderLayoutComponent, HeaderComponent, FooterComponent],
  // Template en archivo separado — propiedad del Diseñador UI
  templateUrl: './ui-home-session.component.html',
})
export class UiHomeSessionComponent implements InterUiHomeSession, OnInit {
  // Estado local — datos del usuario (stub: vacíos por defecto)
  name = '';
  email = '';

  ngOnInit(): void {
    console.log('UiHomeSession mounted (template)');
  }

  // Método del contrato (stub)
  logout(): void {
    console.log('Template — logout clicked');
  }

  // Handler que delega al contrato
  handlerLogout(): void {
    this.logout();
  }
}
