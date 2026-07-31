import { ChangeDetectionStrategy, Component, inject, type OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { finalize } from 'rxjs';
import { JDataTable, JDialog, JPagination, JSectionHeading } from 'uijona-4ngular';
import { ApiService } from '../../core/api.service';
import type { ProductoGrupo } from '../../core/models';
import { OperacionDetalleDialog } from '../../shared/operacion-detalle-dialog';
import { OperacionesViewComponent } from './operaciones-view.component';

@Component({
  selector: 'app-operaciones',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [JSectionHeading, JDataTable, JPagination, JDialog, OperacionDetalleDialog],
  templateUrl: './operaciones-view.component.html',
})
export class OperacionesPage extends OperacionesViewComponent implements OnInit {
  private readonly api = inject(ApiService);
  private readonly route = inject(ActivatedRoute);

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

  ngOnInit(): void {
    this.route.data.subscribe((data) => {
      const producto = (data['producto'] as ProductoGrupo | undefined) ?? null;
      this.setProducto(producto);
      this.load();
    });
  }

  /**
   * Anula la operación y refresca el listado.
   *
   * <p>El mensaje que se muestra prioriza el desenlace CONTABLE (`data.contable.mensaje`): que el
   * estado cambió se ve en la tabla, pero qué pasó con el asiento —contrapartidas de reversa o
   * líneas anuladas— no se ve en ningún sitio y es la mitad de lo que hace esta acción.</p>
   */
  protected override confirmarAnular(): void {
    const id = this.anularId();
    const motivo = this.anularMotivo().trim();
    if (!id || !motivo || this.anulando()) return;
    // El código se captura ANTES de cerrar: el mensaje no debe depender de qué limpia cerrarAnular().
    const codigo = this.anularCodigo();
    this.anulando.set(true);
    this.api
      .anularOperacionBackend(id, motivo)
      .pipe(finalize(() => this.anulando.set(false)))
      .subscribe({
        next: (data) => {
          this.cerrarAnular();
          this.avisoError.set(false);
          this.avisoMensaje.set(this.mensajeAnulacion(data ?? {}, codigo));
          this.load();
        },
        error: (err) => {
          this.cerrarAnular();
          this.avisoError.set(true);
          this.avisoMensaje.set(this.mensajeError(err));
        },
      });
  }

  /** Redacta el resultado: estado + qué pasó con el asiento + si salió de un plan. */
  private mensajeAnulacion(data: Record<string, unknown>, codigo: string): string {
    if (data['yaEstaba'] === true) {
      return 'La operación ya estaba anulada.';
    }
    const partes: string[] = [`Operación ${codigo} anulada.`];
    const contable = data['contable'] as Record<string, unknown> | undefined;
    const mensajeContable = typeof contable?.['mensaje'] === 'string' ? (contable['mensaje'] as string) : '';
    if (mensajeContable) partes.push(mensajeContable);
    const plan = data['plan'] as Record<string, unknown> | undefined;
    if (plan?.['desligada'] === true && typeof plan['mensaje'] === 'string') {
      partes.push(plan['mensaje'] as string);
    }
    return partes.join(' ');
  }

  /** Mensaje del envelope de error (el 422 de regla de negocio trae el detalle en errors[0]). */
  private mensajeError(err: unknown): string {
    const e = err as { error?: { message?: string; errors?: { message?: string }[] } };
    return e?.error?.errors?.[0]?.message ?? e?.error?.message ?? 'No se pudo anular la operación.';
  }

  override load(): void {
    const producto = this.producto();
    const filters = this.buildBackendFilters();
    if (producto) {
      const subtipo = this.subtipo() || undefined;
      this.api
        .operaciones({ producto, subtipo, page: this.page(), pageSize: this.pageSize(), filters })
        .subscribe((res) => this.setPagedResult(res));
    } else {
      this.api.operaciones({ page: this.page(), pageSize: this.pageSize(), filters }).subscribe((res) => this.setPagedResult(res));
    }
  }
}
