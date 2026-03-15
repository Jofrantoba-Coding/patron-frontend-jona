// header.component.ts — Componente utilitario de cabecera
import { Component } from '@angular/core';

@Component({
  selector: 'app-header',
  standalone: true,
  template: `
    <header>
      <h1>Defensorial Management App</h1>
    </header>
  `,
})
export class HeaderComponent {}
