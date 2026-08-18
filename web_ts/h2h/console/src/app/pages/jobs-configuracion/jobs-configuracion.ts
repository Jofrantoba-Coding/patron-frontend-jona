import { ChangeDetectionStrategy, Component, inject, type OnInit } from '@angular/core';
import { finalize } from 'rxjs';
import { JBadge, JProgress, JSectionHeading } from 'uijona-4ngular';
import { ApiService } from '../../core/api.service';
import type {
  CantidadProgramable,
  ConfiguracionJobs,
  HorarioSubtipo,
  Reintentos,
} from './inter-jobs-configuracion';
import { JobsConfiguracionViewComponent } from './jobs-configuracion-view.component';

/**
 * Configuración del procesamiento automático de la organización.
 *
 * <p>Complementa a la pantalla de seguimiento: aquella <b>mira</b> lo que los jobs hicieron, esta
 * <b>decide</b> si deben hacerlo. La distinción que hay que tener presente al usarla es que el modo
 * de envío y los interruptores actúan en momentos distintos — el modo se aplica en la ingesta, al
 * sellar cada operación; los interruptores, en cada tick, al despachar—.</p>
 */
@Component({
  selector: 'app-jobs-configuracion',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [JSectionHeading, JBadge, JProgress],
  templateUrl: './jobs-configuracion-view.component.html',
})
export class JobsConfiguracionPage extends JobsConfiguracionViewComponent implements OnInit {
  private readonly api = inject(ApiService);
  /** Recarga diferida: se dispara en `finalize`, cuando `cargando` ya bajó. */
  private pendienteRecarga = false;

  ngOnInit(): void {
    this.cargar();
  }

  protected override cargar(): void {
    if (this.cargando()) return;
    this.recargar();
  }

  /**
   * Lee sin comprobar `cargando`. Existe porque RxJS emite `next` ANTES de `finalize`: recargar
   * dentro de `next` encontraba el flag todavía en alto y la recarga se cancelaba a sí misma —el
   * guardado se aplicaba en la BD pero la pantalla seguía mostrando el valor anterior—.
   */
  private recargar(): void {
    this.cargando.set(true);
    this.api
      .schedulersConfigLeer()
      .pipe(finalize(() => this.cargando.set(false)))
      .subscribe({
        next: (data) => this.setConfig(data as unknown as ConfiguracionJobs),
        error: (err) =>
          this.setError(
            this.mensajeError(err, 'No se pudo leer la configuración. ¿Está levantado api-schedulers?')
          ),
      });
  }

  /**
   * Cambia el modo de envío. Se recarga entera en lugar de tocar el signal en local: el aviso de
   * coherencia depende de cruzar el modo con los interruptores, y actualizar solo la mitad dejaría
   * la pantalla afirmando algo que ya no es cierto.
   */
  protected override guardarModoEnvio(modo: string): void {
    if (this.cargando()) return;
    this.cargando.set(true);
    this.aviso.set(null);
    this.api
      .schedulersConfigGuardar('H2H#BCP#MODO_ENVIO', modo)
      .pipe(finalize(() => { this.cargando.set(false); if (this.pendienteRecarga) { this.pendienteRecarga = false; this.recargar(); } }))
      .subscribe({
        next: () => {
          this.pendienteRecarga = true;
          this.aviso.set(
            modo === this.MODO_AUTOMATICO
              ? 'Procesamiento automático activado. Las operaciones que se ingesten a partir de ahora se despacharán solas.'
              : 'Procesamiento automático desactivado. Lo ya ingestado como AUTOMATICO sigue su curso.'
          );
        },
        error: (err) =>
          this.setError(this.mensajeError(err, 'No se pudo cambiar el modo de envío.')),
      });
  }

  /**
   * Enciende o apaga un job. Se repinta desde el `efectivo` que devuelve el backend, no desde lo
   * pedido: un `forzarApagado` de plataforma vence al encendido de la organización.
   */
  protected override cambiarInterruptor(job: string, habilitado: boolean): void {
    if (this.cargando()) return;
    this.cargando.set(true);
    this.aviso.set(null);
    this.api
      .schedulersInterruptor(job, habilitado)
      .pipe(finalize(() => { this.cargando.set(false); if (this.pendienteRecarga) { this.pendienteRecarga = false; this.recargar(); } }))
      .subscribe({
        next: (data) => {
          this.pendienteRecarga = true;
          const efectivo = (data as { efectivo?: boolean })?.efectivo;
          if (efectivo !== undefined && efectivo !== habilitado) {
            this.aviso.set(
              `Se guardó el valor, pero ${job} queda ${efectivo ? 'ENCENDIDO' : 'APAGADO'}: la plataforma lo está forzando.`
            );
          }
        },
        error: (err) =>
          this.setError(this.mensajeError(err, `No se pudo cambiar el interruptor de ${job}.`)),
      });
  }

  // ── Parámetros de despacho ────────────────────────────────────────────
  //
  // Los tres comparten forma: guardar el nodo, cerrar la edición y recargar. Se recarga en lugar
  // de confiar en lo enviado porque el backend normaliza —y porque el valor efectivo puede seguir
  // viniendo de la plataforma si el propio se dejó incompleto.

  protected override guardarCantidad(valor: CantidadProgramable): void {
    this.persistir('H2H#BCP#CANTIDAD_OPERACIONES_PROGRAMABLE', valor, 'Cantidad por planilla actualizada.');
  }

  protected override guardarReintentos(valor: Reintentos): void {
    this.persistir('H2H#BCP#REINTENTOS', valor, 'Política de reintentos actualizada.');
  }

  protected override guardarDiferido(habilitado: boolean): void {
    this.persistir(
      'H2H#BCP#PROGRAMACION#DIFERIR_FUERA_DE_VENTANA',
      { habilitado },
      habilitado
        ? 'Fuera de ventana, los lotes se agendarán a la próxima apertura.'
        : 'Fuera de ventana no se programará nada: se esperará a que el canal abra.'
    );
  }

  protected override guardarHorario(codigo: string, valor: HorarioSubtipo): void {
    this.persistir(codigo, valor, 'Programación horaria actualizada.');
  }

  /**
   * Guarda un nodo de la lista blanca. Un 422 aquí es una regla del dominio que el backend
   * rechazó —no un fallo de transporte—, así que su mensaje se muestra tal cual: es más preciso
   * que cualquier texto genérico que pudiéramos poner.
   */
  private persistir(codigo: string, valor: unknown, exito: string): void {
    if (this.cargando()) return;
    this.cargando.set(true);
    this.api
      .schedulersConfigGuardar(codigo, valor)
      .pipe(finalize(() => { this.cargando.set(false); if (this.pendienteRecarga) { this.pendienteRecarga = false; this.recargar(); } }))
      .subscribe({
        next: () => {
          this.pendienteRecarga = true;
          this.aviso.set(`${exito} Surte efecto en el próximo tick.`);
          this.cerrarEdicion();
        },
        error: (err) => this.setError(this.mensajeError(err, `No se pudo guardar ${codigo}.`)),
      });
  }
}
