import { ChangeDetectionStrategy, Component, inject, type OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { finalize } from 'rxjs';
import { JDataTable, JDatePicker, JDialog, JPagination, JSectionHeading } from 'uijona-4ngular';
import { ApiService } from '../../core/api.service';
import type { ProductoGrupo } from '../../core/models';
import { SessionService } from '../../core/session.service';
import { OperacionDetalleDialog } from '../../shared/operacion-detalle-dialog';
import { CATALOGO_ESTADO_OPERACION, OperacionesViewComponent } from './operaciones-view.component';

@Component({
  selector: 'app-operaciones',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [JSectionHeading, JDataTable, JPagination, JDialog, JDatePicker, OperacionDetalleDialog],
  templateUrl: './operaciones-view.component.html',
})
export class OperacionesPage extends OperacionesViewComponent implements OnInit {
  private readonly api = inject(ApiService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly session = inject(SessionService);

  constructor() {
    super();
    this.can = (permiso: string) => this.session.can(permiso);
  }

  /**
   * Cambiar de producto navega en vez de mutar el estado local: la ruta es la
   * fuente de verdad del filtro, así el enlace se puede compartir y el botón de
   * atrás deshace el cambio.
   */
  protected override onPestanaProducto(ruta: string): void {
    this.router.navigate(['/', ...ruta.split('/')]);
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

  ngOnInit(): void {
    this.cargarEstados();
    this.route.data.subscribe((data) => {
      const producto = (data['producto'] as ProductoGrupo | undefined) ?? null;
      this.setProducto(producto);
      this.load();
    });
  }

  /**
   * Trae los estados del catálogo `GLOBAL#ESTADO_OPERACION`.
   *
   * <p>Es GLOBAL a propósito: el estado interno de la operación no debe atarse al catálogo de
   * ningún banco. En la misma tabla convive `BCP#ESTADO_OPERACION_BANCO#*`, que es lo que el BCP
   * informa en los `-RES`/`-RES2`; son dos ejes distintos y este filtro solo mira el primero.</p>
   *
   * <p>Se pide una vez al entrar, no al abrir el desplegable: no cambia durante una sesión.</p>
   *
   * <p><b>El código sale de `codigo`, no de `valor` ni de `abreviatura`.</b> El backend filtra
   * componiendo `GLOBAL#ESTADO_OPERACION#<lo que se mande>` y comparándolo contra `para_v_codigo`
   * (ver `codigoGlobal` en `DaoOperacion`), así que el tercer segmento del código es la única
   * fuente que no puede desalinearse. Hoy los tres campos coinciden; si alguien pusiera una
   * etiqueta legible en `valor`, filtrar por él devolvería cero filas sin ningún error.</p>
   *
   * <p>Si la llamada falla no se toca nada: el filtro se queda con la lista de arranque. Vaciarlo
   * sería reponer el fallo que tenía —un desplegable sin las opciones que hacen falta—.</p>
   */
  private cargarEstados(): void {
    this.api
      .parametrias({ codigoPadre: CATALOGO_ESTADO_OPERACION, soloHijos: true })
      .subscribe({
        next: (items) =>
          this.setEstados(
            [...items]
              .sort((a, b) => (a.orden ?? 0) - (b.orden ?? 0))
              .map((p) => String(p.codigo ?? '').split('#')[2] ?? '')
              .filter((codigo) => codigo.length > 0)
          ),
        error: () => undefined,
      });
  }

  /**
   * Anula la operación y refresca el listado.
   *
   * <p>El mensaje que se muestra prioriza el desenlace CONTABLE (`data.contable.mensaje`): que el
   * estado cambió se ve en la tabla, pero qué pasó con el asiento —contrapartidas de reversa o
   * líneas anuladas— no se ve en ningún sitio y es la mitad de lo que hace esta acción.</p>
   */
  /**
   * Compara la operación abierta con el pago que Calimaco dice tener. **No cambia nada.**
   *
   * <p>Se puede pulsar cuantas veces se quiera. Un error se muestra como comparación fallida y no
   * como aviso global: lo que falló es este paso, no la pantalla.</p>
   */
  protected override compararCalimaco(): void {
    const id = this.idOperacionAbierta();
    if (!id || this.comparando()) return;
    this.comparando.set(true);
    this.api.calimacoComparar(id).subscribe({
      next: (c) => {
        this.comparando.set(false);
        this.comparacion.set(c);
      },
      error: (err) => {
        this.comparando.set(false);
        this.comparacion.set({
          coincide: false,
          puedeInformar: false,
          motivos: [this.mensajeCalimaco(err, 'No se pudo comparar con Calimaco.')],
          campos: [],
        });
      },
    });
  }

  /**
   * Manda el cambio de estado a Calimaco y, si lo confirma, la operación queda en PAGO_INFORMADO.
   *
   * <p>Irreversible. Se exige tener una comparación que cuadre <b>en esta pantalla</b>, y el backend
   * vuelve a comparar por su cuenta: entre mirar la tabla y pulsar pueden pasar minutos.</p>
   *
   * <p>Al terminar se recarga el listado: la operación cambió de estado y dejarla pintada en el
   * anterior invita a volver a pulsar.</p>
   */
  protected override informarCalimaco(): void {
    const id = this.idOperacionAbierta();
    if (!id || this.informando() || !this.comparacion()?.puedeInformar) return;
    this.informando.set(true);
    this.api.calimacoInformar(id).subscribe({
      next: (c) => {
        this.informando.set(false);
        this.comparacion.set(c);
        if (c.informado) {
          this.load();
        }
      },
      error: (err) => {
        this.informando.set(false);
        const previa = this.comparacion();
        this.comparacion.set({
          ...(previa ?? { coincide: false, campos: [] }),
          puedeInformar: false,
          motivos: [this.mensajeCalimaco(err, 'No se pudo informar el pago a Calimaco.')],
        } as typeof previa & { puedeInformar: boolean });
      },
    });
  }

  /** El id de la operación abierta en el detalle, o `null`. */
  private idOperacionAbierta(): string | null {
    const registro = this.opDetalle()?.operacion ?? null;
    if (!registro) return null;
    const id = this.pv(registro, 'id');
    return id === '-' ? null : id;
  }

  /**
   * El mensaje del backend cuando lo hay.
   *
   * <p>Los 422 de este proceso están escritos para leerse —«la integración no está configurada»— y
   * sustituirlos por un texto genérico obligaría a abrir el log del servidor.</p>
   */
  private mensajeCalimaco(err: unknown, porDefecto: string): string {
    const e = err as { error?: { message?: string; errors?: { message?: string }[] } } | null;
    return e?.error?.errors?.[0]?.message ?? e?.error?.message ?? porDefecto;
  }

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

  /**
   * Convierte el lote marcado. El error se muestra <b>dentro del diálogo</b> y no se cierra:
   * el 422 enumera qué operaciones estorban, y cerrar la lista al mismo tiempo obligaría a
   * reconstruir la selección a ciegas para poder corregirla.
   */
  protected override confirmarConvertir(): void {
    const ids = this.seleccionadasParaConvertir().map((op) => String(op.id));
    if (ids.length === 0 || this.convirtiendo()) return;
    const fecha = this.convertirFechaProceso().trim() || undefined;
    this.convirtiendo.set(true);
    this.avisoMensaje.set(null);
    this.api
      .convertirOperacionesAPagoMasivoProveedores(ids, fecha)
      .pipe(finalize(() => this.convirtiendo.set(false)))
      .subscribe({
        next: (data) => {
          this.cerrarConvertir();
          // Se sale del modo y se limpia la selección: las originales quedaron anuladas, así que
          // mantenerlas marcadas invitaría a reintentar sobre operaciones que ya no existen.
          this.toggleModoConversion();
          this.avisoError.set(false);
          this.avisoMensaje.set(this.mensajeConversion(data ?? {}));
          this.load();
        },
        error: (err) => {
          this.avisoError.set(true);
          this.avisoMensaje.set(this.mensajeError(err));
        },
      });
  }

  /** Resultado de la conversión: cuántas y con qué códigos quedaron las nuevas. */
  private mensajeConversion(data: Record<string, unknown>): string {
    const convertidas = Number(data['convertidas'] ?? 0);
    const detalle = Array.isArray(data['detalle']) ? (data['detalle'] as Record<string, unknown>[]) : [];
    const codigos = detalle
      .map((fila) => String(fila['codigoOperacion'] ?? ''))
      .filter((codigo) => codigo.length > 0);
    const partes = [
      `${convertidas} transferencia(s) convertida(s) a pago masivo de proveedores; las originales quedaron anuladas y su asiento revertido.`,
    ];
    if (codigos.length > 0) {
      partes.push(`Operaciones nuevas: ${codigos.join(', ')}.`);
    }
    return partes.join(' ');
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
