import { ChangeDetectionStrategy, Component, inject, type OnInit } from '@angular/core';
import { finalize, type Observable } from 'rxjs';
import { JBadge, JDataTable, JDialog, JPagination, JSectionHeading, JTabs, JTabsContent, JTabsList, JTabsTrigger } from 'uijona-4ngular';
import { ApiService } from '../../core/api.service';
import type { PlanillaRow } from '../../core/models';
import { PlanillasViewComponent } from './planillas-view.component';

/** Consulta de planillas H2H: listado paginado, filtros y detalle del archivo con sus etapas. */
@Component({
  selector: 'app-planillas',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [JSectionHeading, JDataTable, JPagination, JBadge, JDialog, JTabs, JTabsList, JTabsTrigger, JTabsContent],
  templateUrl: './planillas-view.component.html',
})
export class PlanillasPage extends PlanillasViewComponent implements OnInit {
  private readonly api = inject(ApiService);

  ngOnInit(): void {
    this.load();
  }

  override load(): void {
    this.api
      .planillasBackend({ page: this.page(), pageSize: this.pageSize(), filters: this.buildBackendFilters() })
      .subscribe((res) => this.setPagedResult(res));
  }

  protected override openDetalle(planilla: PlanillaRow): void {
    this.detalleSeleccionado.set(planilla);
    this.detalle.set(null);
    this.detalleLoading.set(planilla.id);
    this.detalleTab.set('resumen');
    this.validarMensaje.set(null);
    this.validarError.set(false);
    this.validarHallazgos.set([]);
    this.api
      .planillaDetalleBackend(planilla.id)
      .pipe(
        finalize(() => {
          if (this.detalleLoading() === planilla.id) {
            this.detalleLoading.set(null);
          }
        })
      )
      .subscribe((res) => {
        if (this.detalleSeleccionado()?.id === planilla.id) {
          this.setDetalle(res);
        }
      });
  }

  /** Despacha la acción de la etapa (estado destino) al endpoint del flujo correspondiente. */
  protected override onEtapa(etapa: string): void {
    switch (etapa) {
      case 'VALIDADA':
        this.ejecutarEtapa((id) => this.api.planillaValidarBackend(id), 'Planilla validada y archivo generado.');
        break;
      case 'CIFRADA':
        this.ejecutarEtapa((id) => this.api.planillaCifrarBackend(id), 'Planilla cifrada y archivo generado.');
        break;
      // ENVIADA / …: endpoints del flujo aún no implementados.
      default:
        this.validarHallazgos.set([]);
        this.validarError.set(true);
        this.validarMensaje.set(`Etapa "${etapa}": endpoint del flujo pendiente de implementar.`);
        break;
    }
  }

  /** Ejecuta una etapa del flujo: invoca su endpoint, recarga el detalle y refleja el resultado. */
  private ejecutarEtapa(
    accion: (idPlanilla: string) => Observable<Record<string, unknown>>,
    mensajeOk: string
  ): void {
    const planilla = this.detalleSeleccionado();
    if (!planilla || this.validando()) return;
    this.validando.set(true);
    this.validarMensaje.set(null);
    this.validarError.set(false);
    this.validarHallazgos.set([]);
    accion(planilla.id)
      .pipe(finalize(() => this.validando.set(false)))
      .subscribe({
        next: () => {
          this.openDetalle(planilla); // recarga el detalle (nuevo estado + urls)
          this.load();
          this.validarError.set(false);
          this.validarMensaje.set(mensajeOk);
        },
        error: (err) => {
          this.validarError.set(true);
          this.validarMensaje.set(this.mensajeError(err));
          this.validarHallazgos.set(this.hallazgosDe(err));
        },
      });
  }

  /** Descarga el archivo (claro/cifrado) como Blob vía gateway y lo guarda en disco. */
  protected override descargarArchivo(key: string): void {
    const detalle = this.detalle();
    const url = this.urlPlanilla(detalle, key);
    if (!url || this.descargandoArchivo()) return;
    this.descargandoArchivo.set(key);
    const nombre = this.nombreArchivoDescarga(detalle, key);
    this.api
      .descargarArchivoFiles(url)
      .pipe(finalize(() => this.descargandoArchivo.set(null)))
      .subscribe({
        next: (blob) => this.guardarBlob(blob, nombre),
        error: () => {
          this.previewError.set('No se pudo descargar el archivo.');
          this.previewTitulo.set(nombre);
          this.previewContenido.set('');
          this.previewAbierto.set(true);
        },
      });
  }

  /** Abre el modal de vista previa con el contenido (texto) del archivo antes de descargarlo. */
  protected override previewArchivo(key: string): void {
    const detalle = this.detalle();
    const url = this.urlPlanilla(detalle, key);
    if (!url) return;
    const nombre = this.nombreArchivoDescarga(detalle, key);
    this.previewTitulo.set(nombre);
    this.previewContenido.set('');
    this.previewError.set(null);
    this.previewCargando.set(true);
    this.previewAbierto.set(true);
    this.api
      .descargarArchivoFiles(url)
      .pipe(finalize(() => this.previewCargando.set(false)))
      .subscribe({
        next: (blob) => {
          blob
            .text()
            .then((texto) => this.previewContenido.set(texto))
            .catch(() => this.previewError.set('No se pudo leer el contenido del archivo.'));
        },
        error: () => this.previewError.set('No se pudo obtener el archivo para la vista previa.'),
      });
  }

  /** Dispara la descarga del blob creando un object URL temporal. */
  private guardarBlob(blob: Blob, nombre: string): void {
    const objectUrl = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = objectUrl;
    a.download = nombre;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(objectUrl);
  }

  /** Mensaje resumen del envelope de error (message top-level) o un fallback. */
  private mensajeError(err: unknown): string {
    const e = err as { error?: { message?: string; errors?: { message?: string }[] } };
    return e?.error?.message ?? e?.error?.errors?.[0]?.message ?? 'No se pudo validar la planilla.';
  }

  /** Lista de hallazgos (errors[]) del 422 de validación: code = UC-id, field = campo, message. */
  private hallazgosDe(err: unknown): { code?: string; field?: string; message?: string }[] {
    const e = err as { error?: { errors?: { code?: string; field?: string; message?: string }[] } };
    return e?.error?.errors ?? [];
  }
}
