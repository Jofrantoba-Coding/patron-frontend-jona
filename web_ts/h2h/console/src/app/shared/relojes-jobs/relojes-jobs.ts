// relojes-jobs.ts — JONA Page/Impl de los relojes de los schedulers.
import { ChangeDetectionStrategy, Component, DestroyRef, inject } from '@angular/core';
import { JAlert, JCard, JCardContent, JCardDescription, JCardHeader, JCardTitle } from 'uijona-4ngular';
import { ApiService } from '../../core/api.service';
import { RelojesJobsViewComponent } from './relojes-jobs-view.component';

/** El tic de la cuenta atrás. Un segundo: es lo que se está mostrando. */
const TIC_MS = 1000;

/**
 * Cada cuánto se vuelve a preguntar al backend.
 *
 * <p>La cuenta atrás se descuenta en local, así que no hace falta pedirla cada segundo. Se
 * refresca a los dos minutos para recoger el disparo ya ocurrido —el cron más lento es de cinco
 * minutos— y para que un cambio del secreto tras un reinicio se vea sin recargar la pestaña.</p>
 */
const REFRESCO_MS = 120_000;

/**
 * Espera minima entre recargas disparadas por un reloj vencido.
 *
 * <p>Sin ella, un backend que devolviera un disparo ya pasado haria que el tic pidiera una vez
 * por segundo, para siempre.</p>
 */
const REINTENTO_MS = 5_000;

@Component({
  selector: 'app-relojes-jobs',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [JCard, JCardHeader, JCardTitle, JCardDescription, JCardContent, JAlert],
  templateUrl: './relojes-jobs-view.component.html',
})
export class RelojesJobsComponent extends RelojesJobsViewComponent {
  private readonly api = inject(ApiService);

  /** Momento de la ultima recarga, para no encadenar peticiones al vencer un reloj. */
  private ultimoRefresco = 0;

  constructor() {
    super();
    this.refrescar();

    const tic = setInterval(() => {
      this.ahora.set(Date.now());
      // Si un reloj llego a cero y no supo rodar solo —backend sin `siguiente`/`periodoMs`, o un
      // cron irregular— se vuelve a preguntar en el acto en vez de esperar los dos minutos de la
      // recarga periodica. Con guarda de tiempo para no encadenar peticiones si el backend
      // devuelve algo que sigue vencido.
      if (this.hayVencido() && Date.now() - this.ultimoRefresco > REINTENTO_MS) {
        this.refrescar();
      }
    }, TIC_MS);
    const recarga = setInterval(() => this.refrescar(), REFRESCO_MS);
    // Sin esto los intervalos siguen vivos al salir de la pantalla: uno por visita, cada uno
    // pidiendo al backend cada dos minutos para siempre.
    inject(DestroyRef).onDestroy(() => {
      clearInterval(tic);
      clearInterval(recarga);
    });
  }

  protected override refrescar(): void {
    this.ultimoRefresco = Date.now();
    this.api.relojesJobs().subscribe((datos) => {
      this.datos.set(datos);
      if (datos) {
        // Desfase entre el reloj del servidor y el de este equipo, medido en el momento de la
        // respuesta. Es lo que hace fiable la cuenta atrás en un equipo con la hora mal puesta.
        this.desfaseMs.set(Date.now() - new Date(datos.ahora).getTime());
        this.ahora.set(Date.now());
      }
    });
  }
}
