import { ChangeDetectionStrategy, Component, inject, type OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import {
  JBadge,
  JButton,
  JDatePicker,
  JDialog,
  JPagination,
  JProgress,
  JSectionHeading,
  JTable,
  JTableBody,
  JTableCell,
  JTableHead,
  JTableHeader,
  JTableRow,
} from 'uijona-4ngular';
import { ApiService } from '../../core/api.service';
import { LatestRequest } from '../../core/latest-request';
import { ProgressiveLoadDirective } from '../../core/progressive-load.directive';
import type { RespuestaFiltro, RespuestaRow } from '../../core/models';
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
    JDialog,
    JProgress,
    ProgressiveLoadDirective,
  ],
  templateUrl: './respuestas-view.component.html',
})
export class RespuestasPage extends RespuestasViewComponent implements OnDestroy {
  private readonly api = inject(ApiService);
  private readonly router = inject(Router);
  private readonly listRequest = new LatestRequest();
  private readonly detailRequest = new LatestRequest();
  private readonly appendRequest = new LatestRequest();
  private filtrosAplicados: RespuestaFiltro = {};
  private mobileQueryKey = '';

  constructor() {
    super();
    this.cargar();
  }

  protected override verPlanilla(idPlanilla: string): void {
    if (!idPlanilla) return;
    this.router.navigate(['/planillas'], { queryParams: { id: idPlanilla } });
  }

  protected override onPagina(pagina: number): void {
    this.page.set(pagina);
    this.cargar();
  }

  protected override onAplicarFiltros(): void {
    this.filtrosAplicados = this.filtros();
    this.page.set(1);
    this.cargar();
  }

  protected override onResetFiltros(): void {
    this.filtrosAplicados = {};
    this.filtroNombre.set('');
    this.filtroTipo.set('');
    this.filtroIdPlanilla.set('');
    this.filtroFechaDesde.set('');
    this.filtroFechaHasta.set('');
    this.page.set(1);
    this.cargar();
  }

  protected override reintentarCarga(): void {
    this.cargar();
  }

  protected override verRespuesta(respuesta: RespuestaRow): void {
    this.detalleSeleccionado.set(respuesta);
    this.detalleRespuesta.set(null);
    this.detalleError.set(null);
    this.cargarDetalle(respuesta);
  }

  protected override reintentarDetalle(): void {
    const respuesta = this.detalleSeleccionado();
    if (respuesta) this.cargarDetalle(respuesta);
  }

  protected override cerrarDetalle(): void {
    this.detailRequest.cancel();
    super.cerrarDetalle();
  }

  ngOnDestroy(): void {
    this.listRequest.cancel();
    this.detailRequest.cancel();
    this.appendRequest.cancel();
    this.mobileList.cancel();
  }

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
    const filters = { ...this.filtrosAplicados };
    const queryKey = JSON.stringify({ filters, pageSize: this.pageSize() });
    if (queryKey !== this.mobileQueryKey) {
      this.mobileQueryKey = queryKey;
      this.appendRequest.cancel();
      this.mobileList.reset();
    }
    this.cargando.set(true);
    this.errorCarga.set(null);
    this.listRequest.run(
      this.api.respuestasBackend({
        page: this.page(),
        pageSize: this.pageSize(),
        filters,
      }),
      {
        next: (res) => {
          this.rows.set(res.items);
          this.total.set(res.pagination.total);
          if (res.pagination.page === 1) this.mobileList.seed(res);
        },
        error: (error) =>
          this.errorCarga.set(
            this.mensajeError(error, 'No se pudo actualizar la bandeja de respuestas.')
          ),
        settled: () => this.cargando.set(false),
      }
    );
  }

  protected override cargarMas(): void {
    const token = this.mobileList.beginNext();
    if (!token) return;
    this.appendRequest.run(
      this.api.respuestasBackend({
        page: token.page,
        pageSize: this.pageSize(),
        filters: { ...this.filtrosAplicados },
      }),
      {
        next: (res) => this.mobileList.resolve(token, res),
        error: (error) =>
          this.mobileList.reject(
            token,
            this.mensajeError(error, 'No se pudo cargar la siguiente página de respuestas.')
          ),
      }
    );
  }

  private cargarDetalle(respuesta: RespuestaRow): void {
    this.detalleCargando.set(true);
    this.detalleError.set(null);
    this.detailRequest.run(this.api.respuestaDetalleBackend(respuesta.id), {
      next: (detalle) => this.detalleRespuesta.set(detalle),
      error: () => this.detalleError.set('No se pudo obtener el contenido de la respuesta.'),
      settled: () => this.detalleCargando.set(false),
    });
  }

  private mensajeError(error: unknown, fallback: string): string {
    const e = error as { error?: { message?: string; errors?: { message?: string }[] } };
    return e?.error?.message ?? e?.error?.errors?.[0]?.message ?? fallback;
  }
}
