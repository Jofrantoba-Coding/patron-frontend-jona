// ui-home-view.component.ts
// Capa: View Orchestrator — punto de entrada de la vista Home
// Responsabilidad: instanciar la Implementation e inyectarla en el template visual
// Registrado en el router en la ruta /login
// Restricciones: sin lógica de negocio ni estado propio
import { Component } from '@angular/core';
import { UiHomeImplComponent } from './ui-home-impl.component';

@Component({
  selector: 'app-ui-home-view',
  standalone: true,
  imports: [UiHomeImplComponent],
  template: `<app-ui-home-impl />`,
})
export class UiHomeViewComponent {}
