// nav-paneles.ts — pestañas de los cuatro paneles de control.
// Compartido por el panel general y los tres por entidad: si viviera en cada uno,
// añadir un panel obligaría a acordarse de tocar los cuatro ficheros.
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

/** Los cuatro paneles, en el orden del recorrido real de una operación por el canal. */
export const PANELES = [
  { ruta: '/dashboard', etiqueta: 'General', exacta: true },
  { ruta: '/dashboard/operaciones', etiqueta: 'Operaciones', exacta: false },
  { ruta: '/dashboard/programaciones', etiqueta: 'Programaciones', exacta: false },
  { ruta: '/dashboard/planillas', etiqueta: 'Planillas y respuestas', exacta: false },
];

@Component({
  selector: 'app-nav-paneles',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, RouterLinkActive],
  template: `
    <nav class="mb-6 flex flex-wrap gap-1 border-b border-neutral-200">
      @for (p of paneles; track p.ruta) {
        <a
          [routerLink]="p.ruta"
          routerLinkActive="border-primary-500 text-primary-700"
          [routerLinkActiveOptions]="{ exact: p.exacta }"
          class="-mb-px border-b-2 border-transparent px-3 py-2 text-sm font-medium text-neutral-500 transition-colors hover:text-neutral-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
        >
          {{ p.etiqueta }}
        </a>
      }
    </nav>
  `,
})
export class NavPanelesComponent {
  protected readonly paneles = PANELES;
}
