import {
  ChangeDetectionStrategy,
  Component,
  inject,
  type OnInit } from '@angular/core';
import { finalize } from 'rxjs';
import { JBadge,
  JDataTable,
  JDatePicker,
  JDialog,
  JPagination,
  JSectionHeading,
} from 'uijona-4ngular';
import { ApiService } from '../../core/api.service';
import type { ProgramacionRow } from '../../core/models';
import { OperacionDetalleDialog } from '../../shared/operacion-detalle-dialog';
import { ProgramacionesViewComponent } from './programaciones-view.component';

/** Programación de envíos H2H: planes que agrupan operaciones/lotes, con detalle y acciones. */
@Component({
  selector: 'app-programaciones',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [JSectionHeading, JDataTable, JPagination, JBadge, JDialog, JDatePicker, OperacionDetalleDialog],
  templateUrl: './programaciones-view.component.html',
})
export class ProgramacionesPage extends ProgramacionesViewComponent implements OnInit {
  private readonly api = inject(ApiService);

  ngOnInit(): void {
    this.load();
    this.cargarVentana();
  }

  /**
   * Ventana de atención del canal. Se pide una vez al entrar y no al abrir el diálogo: no cambia
   * durante una sesión, y tenerla antes evita que el formulario aparezca sin saber qué días valen.
   *
   * <p>Un fallo aquí no rompe la pantalla —el formulario sigue operativo y el backend vuelve a
   * validar—, solo se queda sin el aviso previo.</p>
   */
  private cargarVentana(producto?: string): void {
    this.api.ventanaCanalProgramacion(producto).subscribe({
      next: (v) => this.setVentana(v),
      error: () => this.setVentana(null),
    });
  }

  /**
   * Recarga la ventana cuando cambia el producto del formulario.
   *
   * <p>La ventana ya no es «la del canal» sino la del producto, así que dejarla fija a la primera
   * carga mostraría el horario de transferencias mientras el backend valida el de pagos masivos.
   * La Vista la invoca al cambiar el selector.</p>
   */
  protected override onProductoParaVentana(abreviatura: string): void {
    this.cargarVentana(abreviatura || undefined);
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
      .subscribe({
        next: (res) => {
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
        },
        // El diálogo se queda ABIERTO con el motivo dentro: cerrarlo obligaría a recapturar todo
        // el formulario para corregir un campo.
        error: (err) => this.crearError.set(this.mensajeError(err, 'No se pudo crear el plan.')),
      });
  }

  protected override cambiarEstado(estado: string): void {
    const id = this.detalleSeleccionado()?.id;
    if (!id) return;
    this.accionError.set('');
    this.api.cambiarEstadoProgramacion(id, estado).subscribe({
      next: (res) => {
        this.setDetalle(res);
        this.load();
      },
      error: (err) =>
        this.accionError.set(this.mensajeError(err, `No se pudo pasar el plan a ${estado}.`)),
    });
  }

  /**
   * Cambia el canal de salida del plan. Es contingencia, no el camino normal.
   *
   * <p>El backend niega el cambio si la planilla del plan ya salio o su caso esta cerrado
   * —cambiarlo entonces haria que el mismo archivo se entregara por dos canales—, asi que su
   * mensaje se muestra tal cual: explica por que no se puede y que hacer en su lugar.</p>
   */
  protected override confirmarModalidad(): void {
    const plan = this.modalidadPlan();
    if (!plan) return;
    const destino = this.modalidadDestino();
    if (this.motivoFechaModalidad()) return;
    this.accionError.set('');
    // La fecha solo se manda si cambia: reenviar la misma reescribiría todas las operaciones del
    // plan para dejarlas igual, y ensuciaría la bitácora con un cambio que no lo es.
    const fecha = this.modalidadFechaCambia() ? this.modalidadFecha() : undefined;
    // La conversion solo viaja si el dialogo llego a ofrecerla: si el plan dejo de ser elegible
    // entre que se abrio y se confirmo, no se manda una conversion que el backend rechazaria.
    const conversion = this.conversionDisponible() ? this.modalidadConversion() : undefined;
    this.api.cambiarModalidadProgramacion(plan.id, destino, fecha, conversion).subscribe({
      next: () => {
        this.cerrarModalidad();
        // Se recarga el detalle solo si es el plan abierto: el cambio tambien mueve el modo de
        // envio a MANUAL cuando va a H2W, y el panel del detalle lo muestra.
        if (this.detalleSeleccionado()?.id === plan.id) {
          this.openDetalle(plan);
        }
        this.load();
      },
      error: (err) =>
        this.accionError.set(
          this.mensajeError(err, `No se pudo cambiar el canal del plan a ${destino}.`)
        ),
    });
  }

  protected override generar(): void {
    const id = this.detalleSeleccionado()?.id;
    if (!id) return;
    this.accionError.set('');
    this.api.generarProgramacion(id).subscribe({
      next: (res) => {
        this.setDetalle(res);
        this.load();
      },
      // Aquí es donde más duele perder el mensaje: el rechazo típico —fuera de la ventana, fecha de
      // proceso pasada, plan sin operaciones— explica exactamente qué corregir.
      error: (err) => this.accionError.set(this.mensajeError(err, 'No se pudo generar la planilla.')),
    });
  }

  protected override abrirOpDetalle(idOperacion: string): void {
    if (!idOperacion || idOperacion === '-') return;
    this.opDetalle.set(null);
    this.opDetalleLoading.set(idOperacion);
    this.api
      .operacionDetalle(idOperacion)
      .pipe(
        finalize(() => {
          if (this.opDetalleLoading() === idOperacion) {
            this.opDetalleLoading.set(null);
          }
        })
      )
      .subscribe((res) => this.setOpDetalle(res));
  }

  protected override quitarOperacion(idOperacion: string): void {
    const id = this.detalleSeleccionado()?.id;
    if (!id || !idOperacion || idOperacion === '-') return;
    this.accionError.set('');
    this.api.quitarOperacionesProgramacion(id, [idOperacion]).subscribe({
      next: (res) => {
        this.setDetalle(res);
        this.load();
      },
      error: (err) =>
        this.accionError.set(this.mensajeError(err, 'No se pudo quitar la operación del plan.')),
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
    this.nuevoFechaProgramado.set('');
    this.nuevoModo.set('MANUAL');
    this.nuevoTipoDestino.set('');
    this.nuevoCanal.set('');
    this.opsRows.set([]);
    this.seleccion.set(new Set());
    this.loteFiltro.set('');
    this.crearError.set('');
  }
}
