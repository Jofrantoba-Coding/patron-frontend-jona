// ui-home-session-view.component.ts
// Capa: View Orchestrator — punto de entrada de la vista de sesión (/homesesion)
import { Component } from '@angular/core';
import { UiHomeSessionImplComponent } from './ui-home-session-impl.component';

@Component({
  selector: 'app-ui-home-session-view',
  standalone: true,
  imports: [UiHomeSessionImplComponent],
  template: `<app-ui-home-session-impl />`,
})
export class UiHomeSessionViewComponent {}
