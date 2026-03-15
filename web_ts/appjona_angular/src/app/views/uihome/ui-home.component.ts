// ui-home.component.ts
// Capa: Template — estructura visual de la vista Home
// Responsabilidad: layout con BorderLayout + Header + Footer + formulario de login
// Restricciones: nunca importar servicios externos, navegación ni storage
import { Component, OnInit } from '@angular/core';
import { BorderLayoutComponent } from '../../uilayouts/border-layout.component';
import { HeaderComponent } from '../../uiutils/header.component';
import { FooterComponent } from '../../uiutils/footer.component';
import { UiIniciarSesionComponent } from '../uiiniciarsesion/ui-iniciar-sesion.component';
import { InterUiHome } from './inter-ui-home';

@Component({
  selector: 'app-ui-home',
  standalone: true,
  imports: [BorderLayoutComponent, HeaderComponent, FooterComponent, UiIniciarSesionComponent],
  template: `
    <app-border-layout>
      <app-header slot="north" />
      <app-ui-iniciar-sesion slot="center" />
      <app-footer slot="south" />
    </app-border-layout>
  `,
})
export class UiHomeComponent implements InterUiHome, OnInit {
  ngOnInit(): void {
    this.onMount();
  }

  onMount(): void {
    console.log('UiHome mounted (template)');
  }
}
