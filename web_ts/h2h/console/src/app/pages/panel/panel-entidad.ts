// panel-entidad.ts — JONA Page/Impl de los paneles por entidad.
// Una sola Page parametrizada por `data.entidad` de la ruta, igual que OperacionesPage
// se parametriza por `producto`: los cuatro paneles hacen lo mismo con otro vocabulario.
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {
  JAlert,
  JCard,
  JCardContent,
  JCardDescription,
  JCardHeader,
  JCardTitle,
  JChart,
  JDatePicker,
  JSectionHeading,
} from 'uijona-4ngular';
import { ApiService } from '../../core/api.service';
import type { EntidadResumen } from '../../core/models';
import { NavPanelesComponent } from '../../shared/nav-paneles/nav-paneles';
import { PanelEntidadViewComponent } from './panel-entidad-view.component';

@Component({
  selector: 'app-panel-entidad',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    NavPanelesComponent,
    JSectionHeading,
    JAlert,
    JCard,
    JCardHeader,
    JCardTitle,
    JCardDescription,
    JCardContent,
    JChart,
    JDatePicker,
  ],
  templateUrl: './panel-entidad-view.component.html',
})
export class PanelEntidadPage extends PanelEntidadViewComponent {
  private readonly api = inject(ApiService);
  private readonly route = inject(ActivatedRoute);

  constructor() {
    super();
    const entidad = (this.route.snapshot.data['entidad'] ?? 'operaciones') as EntidadResumen;
    this.entidad.set(entidad);
    this.recargar();
  }

  protected override recargar(): void {
    const f = this.filtro();
    this.cargando.set(true);
    this.api.resumenPorEstado(this.entidad(), f).subscribe((grupos) => {
      this.grupos.set(grupos);
      this.cargando.set(false);
    });

    // Las respuestas se leen junto a las planillas: una respuesta no se entiende sin el
    // archivo que la provocó, y separarlas en un quinto panel obligaría a saltar entre
    // dos pantallas para responder una sola pregunta.
    if (this.entidad() === 'planillas') {
      this.api.resumenPorEstado('respuestas', f).subscribe((g) => this.gruposRespuesta.set(g));
    }
  }
}
