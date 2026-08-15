import { ChangeDetectionStrategy, Component, inject, type OnInit } from '@angular/core';
import { finalize, type Observable } from 'rxjs';
import { JBadge, JDataTable, JDatePicker, JDialog, JPagination, JProgress, JSectionHeading, JTabs, JTabsContent, JTabsList, JTabsTrigger } from 'uijona-4ngular';
import { ApiService } from '../../core/api.service';
import type { PlanillaRow } from '../../core/models';
import { PlanillasViewComponent } from './planillas-view.component';

/** Consulta de planillas H2H: listado paginado, filtros y detalle del archivo con sus etapas. */
@Component({
  selector: 'app-planillas',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [JSectionHeading, JDataTable, JPagination, JBadge, JDialog, JDatePicker, JProgress, JTabs, JTabsList, JTabsTrigger, JTabsContent],
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
      case 'PENDIENTE_ENVIO':
        // H2W: la etapa no es una llamada que "avanza" sino una descarga. El estado lo mueve el
        // propio endpoint al entregar el archivo.
        //
        // En CLARO: el cifrado se sacó del flujo H2W. Protege el tramo SFTP —donde el archivo
        // viaja solo hasta el buzón del banco—, no éste, en el que lo baja una persona ya
        // autenticada y lo sube por HTTPS al portal. Pedir 'cifrado' aquí además fallaba en cuanto
        // se dejó de cifrar: sin `urlCifrado` el backend responde «ejecute antes la etapa de
        // cifrado», que es un callejón sin salida porque esa etapa ya no se ofrece.
        this.descargarParaPortal('claro');
        break;
      case 'ENVIADA':
        // El mismo destino, dos caminos distintos: por SFTP lo manda el backend; por portal lo
        // sube una persona y aquí solo se registra su constancia. Ofrecer el envío por SFTP en
        // una planilla H2W daría un error del backend (guarda contra el doble pago).
        if (this.esH2w()) {
          this.abrirConfirmarSubida();
        } else {
          this.ejecutarEtapa((id) => this.api.planillaEnviarBackend(id), 'Planilla enviada por SFTP a BCP.');
        }
        break;
      case 'RESPUESTA_RECIBIDA':
        this.ejecutarEtapa(
          (id) => this.api.planillaRecibirRespuestasBackend(id),
          'Respuestas del banco recogidas del buzón OUT y registradas.'
        );
        break;
      case 'PROCESADA':
        if (this.esH2w()) {
          // En este canal no hay archivo de respuesta que conciliar: el resultado lo declara
          // quien lo vio en el portal.
          this.abrirCerrarPortal();
          break;
        }
        // Fase 8. El estado destino NO lo decide esta pantalla: el backend concilia el veredicto
        // del banco y cierra en PROCESADA, PROCESADA_PARCIAL o RECHAZADA — o no cierra si quedan
        // operaciones en estado no final. Por eso el mensaje se arma con la respuesta.
        this.ejecutarEtapa((id) => this.api.planillaDecidirBackend(id), (data) => this.mensajeDecision(data));
        break;
      default:
        this.validarHallazgos.set([]);
        this.validarError.set(true);
        this.validarMensaje.set(`Etapa "${etapa}": endpoint del flujo pendiente de implementar.`);
        break;
    }
  }

  // ── H2W · las tres etapas del portal web ───────────────────────────────

  /**
   * Descarga el archivo y lo entrega al navegador para que el operador lo suba al portal.
   *
   * <p>El backend responde base64 dentro del envelope JSON (no un octet-stream), así que aquí
   * se reconstruye el binario y se dispara la descarga. Se hace con un Blob y no con un
   * `data:` URI porque un TXT de miles de operaciones supera el límite de longitud de URL de
   * varios navegadores y la descarga fallaría en silencio justo con los lotes grandes.</p>
   */
  protected override descargarParaPortal(tipo: 'claro' | 'cifrado'): void {
    const planilla = this.detalleSeleccionado();
    if (!planilla || this.validando()) return;
    this.validando.set(true);
    this.validarError.set(false);
    this.validarHallazgos.set([]);
    this.api
      .planillaDescargarPortal(planilla.id, tipo)
      .pipe(finalize(() => this.validando.set(false)))
      .subscribe({
        next: (data) => {
          const nombre = String(data['nombreArchivo'] ?? planilla.nombreArchivo);
          this.guardarBlob(
            this.blobDeBase64(String(data['contenidoBase64'] ?? '')),
            tipo === 'cifrado' ? `${nombre}.gpg` : nombre
          );
          // Mismo refresco que las demas etapas: el endpoint dejo la planilla en
          // PENDIENTE_ENVIO y el stepper tiene que reflejarlo.
          this.openDetalle(planilla);
          this.load();
          this.validarMensaje.set(
            `Archivo ${tipo} descargado. Subalo al portal del banco y luego confirme la subida.`
          );
        },
        error: (err) => {
          this.validarError.set(true);
          this.validarMensaje.set(this.mensajeError(err));
          this.validarHallazgos.set(this.hallazgosDe(err));
        },
      });
  }

  /**
   * base64 → Blob. Se construye un Blob y no un `data:` URI porque el TXT de un lote grande
   * supera el limite de longitud de URL de varios navegadores, y la descarga fallaria en
   * silencio justo con las planillas que mas importan.
   */
  private blobDeBase64(base64: string): Blob {
    const binario = atob(base64);
    const bytes = new Uint8Array(binario.length);
    for (let i = 0; i < binario.length; i++) {
      bytes[i] = binario.charCodeAt(i);
    }
    return new Blob([bytes], { type: 'application/octet-stream' });
  }

  /** Registra la constancia del portal: la planilla pasa a ENVIADA. */
  protected override confirmarSubida(): void {
    const planilla = this.detalleSeleccionado();
    const constancia = this.constanciaPortal().trim();
    if (!planilla || !constancia || this.validando()) return;
    this.cerrarConfirmarSubida();
    this.ejecutarEtapa(
      (id) => this.api.planillaConfirmarSubidaPortal(id, constancia),
      (data) =>
        data['yaEstaba'] === true
          ? 'La planilla ya estaba marcada como enviada.'
          : 'Subida confirmada: la planilla queda enviada al banco.'
    );
  }

  /**
   * Cierra la planilla con lo que el operador vio en el portal.
   *
   * <p>Si el cierre es por detalle se mandan TODAS las operaciones, no solo las rechazadas: el
   * backend exige el veredicto completo porque una que falte quedaría en el aire y la planilla
   * no podría cerrarse.</p>
   */
  protected override confirmarCierrePortal(): void {
    const planilla = this.detalleSeleccionado();
    if (!planilla || this.validando()) return;
    const veredicto = this.cierrePorDetalle()
      ? {
          detalles: this.registrosDelDetalle().map((r) => ({
            secuencial: r.secuencial,
            resultado: this.cierreDetalles()[r.secuencial] ?? 'PROCESADA',
          })),
        }
      : { resultado: this.cierreResultado() };
    this.cerrarCierrePortal();
    this.ejecutarEtapa(
      (id) => this.api.planillaCerrarPortal(id, veredicto),
      (data) => this.mensajeDecision(data)
    );
  }

  /**
   * Anula la planilla abierta en el detalle: no se enviará y sus operaciones vuelven a quedar
   * disponibles para programarse en un envío nuevo.
   *
   * <p>Se apoya en el mismo {@code ejecutarEtapa} que las etapas del pipeline —recarga el detalle,
   * refresca el listado y refleja el mensaje— porque el efecto en pantalla es idéntico. Lo único
   * propio es cerrar el diálogo antes de lanzar, para que el operador vea el progreso sobre el
   * stepper y no sobre un modal que quedaría bloqueado.</p>
   */
  protected override confirmarAnular(): void {
    const motivo = this.anularMotivo().trim();
    if (!motivo || this.validando()) return;
    this.cerrarAnular();
    this.ejecutarEtapa(
      (id) => this.api.planillaAnularBackend(id, motivo),
      (data) => this.mensajeAnulacion(data)
    );
  }

  /**
   * Redacta el resultado de la anulación. Lo que el operador necesita confirmar no es que el
   * estado cambió —eso lo ve en el stepper— sino cuántas operaciones quedaron libres: es la
   * razón por la que anula.
   */
  private mensajeAnulacion(data: Record<string, unknown>): string {
    const backend = typeof data['mensaje'] === 'string' ? (data['mensaje'] as string) : '';
    if (data['yaEstaba'] === true) {
      return backend || 'La planilla ya estaba anulada.';
    }
    const liberadas = Number(data['operacionesLiberadas'] ?? 0);
    return backend || `Planilla anulada. ${liberadas} operación(es) liberada(s) para reprogramar.`;
  }

  /**
   * Redacta el resultado de la fase 8 a partir de lo que devolvió el backend. Distingue los tres
   * desenlaces que el operador necesita diferenciar: cerrada con éxito, cerrada con rechazos
   * (operaciones liberadas para reprogramar) y NO cerrada por quedar estados no finales.
   */
  private mensajeDecision(data: Record<string, unknown>): string {
    const backend = typeof data['mensaje'] === 'string' ? (data['mensaje'] as string) : '';
    if (data['yaEstaba'] === true) {
      return backend || 'La planilla ya había sido decidida.';
    }
    const num = (k: string): number => Number(data[k] ?? 0);
    // cerrada === false ⇒ la conciliación se guardó pero faltan veredictos finales del banco.
    if (data['decision'] === 'CONCILIACION' && data['cerrada'] === false) {
      return backend || `Conciliación guardada; la planilla sigue abierta: ${num('pendientes')} operación(es) sin estado final.`;
    }
    const partes: string[] = [];
    if (num('operacionesConfirmadas') > 0) partes.push(`${num('operacionesConfirmadas')} confirmada(s)`);
    if (num('operacionesLiberadas') > 0) partes.push(`${num('operacionesLiberadas')} liberada(s) para reprogramar`);
    const detalle = partes.length ? ` (${partes.join(', ')})` : '';
    return `${backend || 'Decisión aplicada.'}${detalle}`;
  }

  /** Ejecuta una etapa del flujo: invoca su endpoint, recarga el detalle y refleja el resultado. */
  private ejecutarEtapa(
    accion: (idPlanilla: string) => Observable<Record<string, unknown>>,
    mensajeOk: string | ((data: Record<string, unknown>) => string)
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
        next: (data) => {
          this.openDetalle(planilla); // recarga el detalle (nuevo estado + urls)
          this.load();
          this.validarError.set(false);
          this.validarMensaje.set(typeof mensajeOk === 'function' ? mensajeOk(data ?? {}) : mensajeOk);
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

  /**
   * Vista previa del archivo de respuesta del banco (`-VAL`/`-RES`/`-RES2`/`PAR`). El texto ya
   * viene DESCIFRADO desde el backend (se abrió con la privada de la organización al registrarlo),
   * así que aquí solo se muestra.
   */
  protected override previewRespuesta(respuesta: Record<string, unknown>): void {
    const id = this.pv(respuesta, 'id');
    if (id === '-') return;
    const nombre = this.nombreRespuesta(respuesta);
    this.previewTitulo.set(nombre);
    this.previewContenido.set('');
    this.previewError.set(null);
    this.previewCargando.set(true);
    this.previewAbierto.set(true);
    this.api
      .respuestaDetalleBackend(id)
      .pipe(finalize(() => this.previewCargando.set(false)))
      .subscribe({
        next: (res) => {
          const texto = this.contenidoDe(res);
          if (texto) this.previewContenido.set(texto);
          else this.previewError.set('La respuesta no tiene contenido almacenado.');
        },
        error: () => this.previewError.set('No se pudo obtener el contenido de la respuesta.'),
      });
  }

  /** Descarga el contenido de la respuesta como archivo de texto, con su nombre original. */
  protected override descargarRespuesta(respuesta: Record<string, unknown>): void {
    const id = this.pv(respuesta, 'id');
    if (id === '-' || this.descargandoRespuesta()) return;
    const nombre = this.nombreRespuesta(respuesta);
    this.descargandoRespuesta.set(id);
    this.api
      .respuestaDetalleBackend(id)
      .pipe(finalize(() => this.descargandoRespuesta.set(null)))
      .subscribe({
        next: (res) => {
          const texto = this.contenidoDe(res);
          if (!texto) {
            this.previewTitulo.set(nombre);
            this.previewContenido.set('');
            this.previewError.set('La respuesta no tiene contenido almacenado.');
            this.previewAbierto.set(true);
            return;
          }
          this.guardarBlob(new Blob([texto], { type: 'text/plain;charset=utf-8' }), nombre);
        },
        error: () => {
          this.previewTitulo.set(nombre);
          this.previewContenido.set('');
          this.previewError.set('No se pudo descargar la respuesta.');
          this.previewAbierto.set(true);
        },
      });
  }

  /**
   * Descarga el archivo materializado de la respuesta desde files-s1: el `.gpg` tal como lo dejó
   * el banco (`urlCifrado`) o el TXT descifrado (`urlClaro`). Va por el gateway, igual que los
   * archivos de la planilla.
   */
  protected override descargarArchivoRespuesta(respuesta: Record<string, unknown>, key: string): void {
    const url = this.urlRespuesta(respuesta, key);
    const id = this.pv(respuesta, 'id');
    if (!url || this.descargandoRespuesta()) return;
    const base = this.nombreRespuesta(respuesta);
    const nombre = key === 'urlCifrado' ? `${base}.gpg` : base;
    this.descargandoRespuesta.set(`${id}:${key}`);
    this.api
      .descargarArchivoFiles(url)
      .pipe(finalize(() => this.descargandoRespuesta.set(null)))
      .subscribe({
        next: (blob) => this.guardarBlob(blob, nombre),
        error: () => {
          this.previewTitulo.set(nombre);
          this.previewContenido.set('');
          this.previewError.set('No se pudo descargar el archivo de la respuesta.');
          this.previewAbierto.set(true);
        },
      });
  }

  /** Contenido de la respuesta: TXT o, si el producto llega en XML, el XML. */
  private contenidoDe(respuesta: Record<string, unknown>): string {
    const txt = this.pv(respuesta, 'contenidoTxt');
    if (txt !== '-') return txt;
    const xml = this.pv(respuesta, 'contenidoXml');
    return xml !== '-' ? xml : '';
  }

  private nombreRespuesta(respuesta: Record<string, unknown>): string {
    const nombre = this.pv(respuesta, 'nombreArchivo');
    return nombre !== '-' ? nombre : 'respuesta.txt';
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
