import { ChangeDetectionStrategy, Component, inject, type OnDestroy, type OnInit } from '@angular/core';
import { finalize } from 'rxjs';
import { JBadge, JProgress, JSectionHeading } from 'uijona-4ngular';
import { ApiService } from '../../core/api.service';
import type { PanoramaSchedulers } from './inter-schedulers-seguimiento';
import { SchedulersSeguimientoViewComponent } from './schedulers-seguimiento-view.component';

/** Cada cuánto se auto-refresca. El tick más corto es de 2 min: refrescar más rápido no aporta. */
const REFRESCO_MS = 30_000;

/**
 * Seguimiento de schedulers: estado de los tres jobs del canal H2H, con disparo manual y
 * encendido/apagado por organización.
 *
 * <p>Todo sale de <b>una</b> llamada al panorama, igual que el explorador SFTP trae los ocho
 * buzones en un ciclo: la pantalla cruza interruptores, última corrida, atascos y resumen, y
 * pedirlos por separado serían cuatro viajes con sus cuatro transacciones para una vista que
 * además se refresca sola.</p>
 */
@Component({
  selector: 'app-schedulers-seguimiento',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [JSectionHeading, JBadge, JProgress],
  templateUrl: './schedulers-seguimiento-view.component.html',
})
export class SchedulersSeguimientoPage
  extends SchedulersSeguimientoViewComponent
  implements OnInit, OnDestroy
{
  private readonly api = inject(ApiService);
  private temporizador: ReturnType<typeof setInterval> | null = null;
  /** Recarga diferida al `finalize`, y SOLO si la acción salió bien: `setPanorama` limpia el
   *  error, así que recargar tras un fallo borraría el mensaje que explica lo que pasó. */
  private pendienteRecarga = false;

  ngOnInit(): void {
    this.cargarPanorama();
    // Auto-refresco: esta pantalla se deja abierta durante una guardia, y un estado congelado es
    // peor que no tenerlo — invita a concluir que nada se movió.
    this.temporizador = setInterval(() => {
      if (!this.cargando()) this.cargarPanorama();
    }, REFRESCO_MS);
  }

  ngOnDestroy(): void {
    if (this.temporizador) clearInterval(this.temporizador);
  }

  protected override cargarPanorama(): void {
    if (this.cargando()) return;
    this.recargarPanorama();
  }

  /**
   * Lee sin comprobar `cargando`. RxJS emite `next` ANTES de `finalize`, así que recargar dentro
   * de `next` encontraba el flag en alto y la recarga se cancelaba sola: la acción se aplicaba en
   * el backend pero la pantalla seguía mostrando el estado anterior.
   */
  private recargarPanorama(): void {
    this.cargando.set(true);
    this.api
      .schedulersPanorama({
        idOrganizacion: this.organizacion() || undefined,
        dias: this.diasResumen(),
      })
      .pipe(finalize(() => this.cargando.set(false)))
      .subscribe({
        next: (data) => this.setPanorama(data as unknown as PanoramaSchedulers),
        error: (err) =>
          this.setError(
            this.mensajeError(err, 'No se pudo leer el estado de los jobs. ¿Está levantado api-schedulers?')
          ),
      });
  }

  protected override refrescar(): void {
    this.cargarPanorama();
  }

  /**
   * Dispara un job ahora. El backend responde 202 en cuanto reparte —no espera a que los tenants
   * terminen—, así que el resultado aparece en el refresco siguiente, no en esta respuesta.
   */
  protected override ejecutar(job: string): void {
    if (this.cargando()) return;
    this.cargando.set(true);
    this.aviso.set(null);
    this.api
      .schedulersEjecutar(job, this.organizacion() || undefined)
      .pipe(finalize(() => this.cargando.set(false)))
      .subscribe({
        next: (data) => {
          const n = (data as { tenantsDespachados?: number })?.tenantsDespachados ?? 0;
          this.aviso.set(
            `${job} despachado a ${n} organizacion(es). El resultado aparecerá en unos segundos.`
          );
          // Se recarga tras un margen: si se pidiera de inmediato, la corrida aún no habría
          // escrito su latido y la pantalla mostraría el estado anterior.
          setTimeout(() => this.recargarPanorama(), 2000);
        },
        error: (err) => this.setError(this.mensajeError(err, `No se pudo ejecutar ${job}.`)),
      });
  }

  /**
   * Enciende o apaga un job para una organización. Surte efecto en el tick siguiente, sin
   * reiniciar nada.
   *
   * <p>El estado que se pinta después es el <b>efectivo</b> que devuelve el backend, no el que se
   * pidió: un <code>forzarApagado</code> de plataforma vence al encendido de la organización, y
   * mostrar lo enviado haría creer que el job va a correr cuando no lo hará.</p>
   */
  protected override cambiarInterruptor(job: string, idOrganizacion: string, habilitado: boolean): void {
    if (this.cargando()) return;
    this.cargando.set(true);
    this.aviso.set(null);
    this.api
      .schedulersInterruptor(job, habilitado, undefined, idOrganizacion)
      .pipe(
        finalize(() => {
          this.cargando.set(false);
          if (this.pendienteRecarga) {
            this.pendienteRecarga = false;
            this.recargarPanorama();
          }
        })
      )
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

  protected override cambiarOrganizacion(idOrganizacion: string): void {
    this.organizacion.set(idOrganizacion);
    this.cargarPanorama();
  }
}
