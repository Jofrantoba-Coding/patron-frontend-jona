import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import {
  JBadge,
  JButton,
  JDatePicker,
  JPagination,
  JSectionHeading,
  JTable,
  JTableBody,
  JTableCell,
  JTableHead,
  JTableHeader,
  JTableRow,
} from 'uijona-4ngular';
import { ApiService } from '../../core/api.service';
import type { RespuestaFiltro } from '../../core/models';
import { RespuestasViewComponent } from './respuestas-view.component';

@Component({
  selector: 'app-respuestas',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    JSectionHeading,
    JTable,
    JTableHeader,
    JTableBody,
    JTableRow,
    JTableHead,
    JTableCell,
    JBadge,
    JButton,
    JDatePicker,
    JPagination,
  ],
  templateUrl: './respuestas-view.component.html',
})
export class RespuestasPage extends RespuestasViewComponent {
  private readonly api = inject(ApiService);
  private readonly router = inject(Router);

  constructor() {
    super();
    this.cargar();
  }

  /**
   * La decisión sobre una respuesta se toma en la planilla, que es la que
   * conoce el lote completo y expone `/planillas/decidir`. Aquí solo se navega.
   */
  protected override verPlanilla(idPlanilla: string): void {
    if (!idPlanilla) return;
    this.router.navigate(['/planillas'], { queryParams: { id: idPlanilla } });
  }

  protected override onPagina(pagina: number): void {
    this.page.set(pagina);
    this.cargar();
  }

  /**
   * Al cambiar el filtro se vuelve a la página 1. Quedarse en la 7 con un resultado que ahora
   * tiene dos páginas devuelve una tabla vacía que parece «no hay nada» y no lo es.
   */
  protected override onAplicarFiltros(): void {
    this.page.set(1);
    this.cargar();
  }

  protected override onResetFiltros(): void {
    this.filtroNombre.set('');
    this.filtroTipo.set('');
    this.filtroIdPlanilla.set('');
    this.filtroFechaDesde.set('');
    this.filtroFechaHasta.set('');
    this.page.set(1);
    this.cargar();
  }

  /**
   * Solo se mandan los campos con valor. Un filtro vacío no debe viajar: la API los trata como
   * opcionales y añadir la clave en blanco convertiría «todas» en «las que se llaman ''».
   */
  private filtros(): RespuestaFiltro {
    const f: RespuestaFiltro = {};
    if (this.filtroNombre()) f.nombreArchivo = this.filtroNombre();
    if (this.filtroTipo()) f.tipoRespuesta = this.filtroTipo();
    if (this.filtroIdPlanilla()) f.idPlanilla = this.filtroIdPlanilla();
    if (this.filtroFechaDesde()) f.fechaDesde = this.filtroFechaDesde();
    if (this.filtroFechaHasta()) f.fechaHasta = this.filtroFechaHasta();
    return f;
  }

  private cargar(): void {
    this.cargando.set(true);
    this.api
      .respuestasBackend({ page: this.page(), pageSize: this.pageSize(), filters: this.filtros() })
      .subscribe({
        next: (res) => {
          this.rows.set(res.items);
          this.total.set(res.pagination.total);
          this.cargando.set(false);
        },
        error: () => this.cargando.set(false),
      });
  }
}
