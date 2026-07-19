import { ChangeDetectionStrategy, Component, inject, type OnInit } from '@angular/core';
import { finalize } from 'rxjs';
import { JBadge, JDataTable, JDialog, JPagination, JSectionHeading } from 'uijona-4ngular';
import { ApiService } from '../../core/api.service';
import type { ProgramacionRow } from '../../core/models';
import { ProgramacionesViewComponent } from './programaciones-view.component';

/** Programación de envíos H2H: planes que agrupan operaciones/lotes, con detalle y acciones. */
@Component({
  selector: 'app-programaciones',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [JSectionHeading, JDataTable, JPagination, JBadge, JDialog],
  templateUrl: './programaciones-view.component.html',
})
export class ProgramacionesPage extends ProgramacionesViewComponent implements OnInit {
  private readonly api = inject(ApiService);

  ngOnInit(): void {
    this.load();
  }

  protected override load(): void {
    this.api
      .programacionesBackend({ page: this.page(), pageSize: this.pageSize(), filters: this.buildBackendFilters() })
      .subscribe((res) => this.setPagedResult(res));
  }

  protected override openDetalle(plan: ProgramacionRow): void {
    this.detalleSeleccionado.set(plan);
    this.detalle.set(null);
    this.detalleLoading.set(plan.id);
    this.api
      .programacionDetalleBackend(plan.id)
      .pipe(
        finalize(() => {
          if (this.detalleLoading() === plan.id) {
            this.detalleLoading.set(null);
          }
        })
      )
      .subscribe((res) => {
        if (this.detalleSeleccionado()?.id === plan.id) {
          this.setDetalle(res);
        }
      });
  }

  protected override guardarNuevo(): void {
    const payload = this.buildCrearPayload();
    if (!payload) return;
    this.crearGuardando.set(true);
    this.api
      .crearProgramacion(payload)
      .pipe(finalize(() => this.crearGuardando.set(false)))
      .subscribe((res) => {
        this.crearOpen.set(false);
        this.resetNuevo();
        this.load();
        this.setDetalle(res);
        const id = (res.programacion['id'] ?? res.programacion['prg_u_id']) as string | undefined;
        if (id) {
          this.detalleLoading.set(null);
          this.detalleSeleccionado.set({
            id,
            codigo: String(res.programacion['codigo'] ?? ''),
            estadoCodigo: String(res.programacion['estadoCodigo'] ?? ''),
            modoEnvio: String(res.programacion['modoEnvio'] ?? ''),
            fechaProceso: String(res.programacion['fechaProceso'] ?? ''),
            totalOperaciones: Number(res.programacion['totalOperaciones'] ?? 0),
            montoTotal: Number(res.programacion['montoTotal'] ?? 0),
          });
        }
      });
  }

  protected override cambiarEstado(estado: string): void {
    const id = this.detalleSeleccionado()?.id;
    if (!id) return;
    this.api.cambiarEstadoProgramacion(id, estado).subscribe((res) => {
      this.setDetalle(res);
      this.load();
    });
  }

  protected override generar(): void {
    const id = this.detalleSeleccionado()?.id;
    if (!id) return;
    this.api.generarProgramacion(id).subscribe((res) => {
      this.setDetalle(res);
      this.load();
    });
  }

  protected override quitarOperacion(idOperacion: string): void {
    const id = this.detalleSeleccionado()?.id;
    if (!id || !idOperacion || idOperacion === '-') return;
    this.api.quitarOperacionesProgramacion(id, [idOperacion]).subscribe((res) => {
      this.setDetalle(res);
      this.load();
    });
  }

  protected override cargarCatalogos(): void {
    this.api.parametrias({ codigoPadre: 'BCP#TIPO_PRODUCTO', soloHijos: true }).subscribe((items) => {
      this.productosOpc.set(
        items.map((p) => ({
          id: p.id,
          codigo: p.codigo,
          abreviatura: p.abreviatura ?? '',
          label: p.descripcion ?? p.abreviatura ?? p.codigo,
        }))
      );
    });
    this.api.parametrias({ codigoPadre: 'GLOBAL#COD_MONEDA_ISO', soloHijos: true }).subscribe((items) => {
      this.monedasOpc.set(
        items.map((p) => ({
          id: p.id,
          codigo: p.codigo,
          abreviatura: p.abreviatura ?? '',
          label: p.abreviatura ? `${p.abreviatura} — ${p.descripcion ?? ''}`.trim() : p.descripcion ?? p.codigo,
        }))
      );
    });
  }

  protected override buscarOperaciones(): void {
    const moneda = this.monedaCodigoSel();
    const grupo = this.grupoProducto(this.productoAbrevSel());
    this.opsCargando.set(true);
    this.loteFiltro.set('');
    this.api
      .operaciones({
        producto: grupo,
        page: 1,
        pageSize: 500,
        filters: { moneda: moneda || undefined, sinPlanillaVigente: true },
      })
      .pipe(finalize(() => this.opsCargando.set(false)))
      .subscribe((res) => this.opsRows.set(res.items));
  }

  private resetNuevo(): void {
    this.nuevoIdProducto.set('');
    this.nuevoIdMoneda.set('');
    this.nuevoFechaProceso.set('');
    this.nuevoModo.set('MANUAL');
    this.nuevoTipoDestino.set('');
    this.nuevoCanal.set('');
    this.opsRows.set([]);
    this.seleccion.set(new Set());
    this.loteFiltro.set('');
    this.crearError.set('');
  }
}
