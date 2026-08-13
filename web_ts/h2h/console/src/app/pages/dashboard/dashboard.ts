// dashboard.ts — JONA Page/Impl del panel de control.
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Router } from '@angular/router';
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
import { NavPanelesComponent } from '../../shared/nav-paneles/nav-paneles';
import { RelojCanalComponent } from '../../shared/reloj-canal/reloj-canal';
import { DashboardViewComponent } from './dashboard-view.component';

@Component({
  selector: 'app-dashboard',
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
    RelojCanalComponent,
  ],
  templateUrl: './dashboard-view.component.html',
})
export class DashboardPage extends DashboardViewComponent {
  private readonly api = inject(ApiService);
  private readonly router = inject(Router);

  constructor() {
    super();
    // Ya no se consulta el mock (`dashboardSummary`/`health`): todas las fuentes
    // son conteos reales del backend.
    this.recargar();
  }

  protected override recargar(): void {
    const f = this.filtro();
    this.api.pendientesPorEtapa(f).subscribe((p) => this.pendientes.set(p));
    this.api.resumenCanal(f).subscribe((r) => this.resumen.set(r));
    this.api.resumenMontos(f).subscribe((m) => {
      this.montos.set(m);
      // Las opciones se fijan con la primera lectura, que es la no filtrada.
      this.registrarOpciones(m);
    });
  }

  /** Cada tarjeta lleva a su etapa: el panel es un punto de partida, no un informe. */
  protected override irAEtapa(ruta: string): void {
    this.router.navigate(['/', ruta]);
  }
}
