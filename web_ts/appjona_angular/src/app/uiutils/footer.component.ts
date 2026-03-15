// footer.component.ts — Componente utilitario de pie de página
import { Component } from '@angular/core';

@Component({
  selector: 'app-footer',
  standalone: true,
  template: `
    <footer>
      <p>&copy; 2023 Ministry of Justice and Human Rights</p>
    </footer>
  `,
})
export class FooterComponent {}
