// ui-home-impl.component.ts
// Capa: Implementation — orquesta el layout con la Implementation de login
import { Component, OnInit } from '@angular/core';
import { BorderLayoutComponent } from '../../uilayouts/border-layout.component';
import { HeaderComponent } from '../../uiutils/header.component';
import { FooterComponent } from '../../uiutils/footer.component';
import { UiIniciarSesionImplComponent } from '../uiiniciarsesion/ui-iniciar-sesion-impl.component';

@Component({
  selector: 'app-ui-home-impl',
  standalone: true,
  imports: [BorderLayoutComponent, HeaderComponent, FooterComponent, UiIniciarSesionImplComponent],
  template: `
    <app-border-layout>
      <app-header slot="north" />
      <app-ui-iniciar-sesion-impl slot="center" />
      <app-footer slot="south" />
    </app-border-layout>
  `,
})
export class UiHomeImplComponent implements OnInit {
  ngOnInit(): void {
    console.log('UiHomeImpl mounted (implementation)');
  }
}
