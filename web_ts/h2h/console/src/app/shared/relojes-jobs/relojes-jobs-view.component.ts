// relojes-jobs-view.component.ts — JONA View de los relojes de los schedulers.
// Derivación pura sobre lo que devuelve el backend; la Page los trae y marca el tic.
import { ChangeDetectionStrategy, Component, computed, input, signal } from '@angular/core';
import { JAlert, JCard, JCardContent, JCardDescription, JCardHeader, JCardTitle } from 'uijona-4ngular';
import type { RelojJob, RelojesJobs } from '../../core/models';

/** Un reloj ya listo para pintar. */
export interface RelojPintado {
  clave: string;
  nombre: string;
  descripcion: string;
  cron: string;
  /** `mm:ss` de lo que falta, o el motivo por el que no hay cuenta atrás. */
  restante: string;
  /** Hora de pared del próximo disparo, en la zona del canal. */
  proxima: string;
  /** `activo` cuenta; `apagado` no se va a disparar; `roto` es un cron mal escrito. */
  estado: 'activo' | 'apagado' | 'roto';
  motivo?: string;
}

@Component({
  selector: 'app-relojes-jobs-view',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [JCard, JCardHeader, JCardTitle, JCardDescription, JCardContent, JAlert],
  templateUrl: './relojes-jobs-view.component.html',
})
export class RelojesJobsViewComponent {
  /**
   * Densidad compacta para la barra lateral, igual que el reloj del canal.
   *
   * <p>En el sidebar los tres relojes son una linea cada uno: ahi la pregunta es "cuanto falta",
   * no "que hace cada job". El detalle —descripcion y cron— vive en el panel de control.</p>
   */
  readonly compacta = input<boolean>(false);

  protected readonly datos = signal<RelojesJobs | null>(null);

  /**
   * Instante del navegador, refrescado cada segundo por la Page.
   *
   * <p>La cuenta atrás se descuenta en local: pedir al backend cada segundo sería una petición
   * por segundo por cada pestaña abierta para un dato que se puede calcular aquí.</p>
   */
  protected readonly ahora = signal<number>(Date.now());

  /**
   * Desfase entre el reloj del servidor y el del equipo, medido al recibir los datos.
   *
   * <p>Es lo que hace que la cuenta atrás sea fiable: si el equipo del operador va tres minutos
   * adelantado y se descontara con su hora, el reloj marcaría cero tres minutos antes de que el
   * job se dispare. Con el desfase aplicado, el número dice la verdad aunque el equipo no.</p>
   */
  protected readonly desfaseMs = signal<number>(0);

  protected readonly zona = computed(() => this.datos()?.zona ?? 'America/Lima');
  protected readonly environment = computed(() => this.datos()?.environment ?? '');

  /** Ningún job correrá: el interruptor global de la instancia está apagado. */
  protected readonly todosApagados = computed(() => this.datos() !== null && !this.datos()!.habilitado);

  protected readonly relojes = computed<RelojPintado[]>(() =>
    (this.datos()?.relojes ?? []).map((r) => this.pintar(r))
  );

  private pintar(r: RelojJob): RelojPintado {
    const base = {
      clave: r.clave,
      nombre: r.nombre,
      descripcion: r.descripcion,
      cron: r.cron,
    };
    if (r.error) {
      // Un cron mal escrito significa que ese job NO se ejecuta. Mostrar 00:00 lo haría pasar
      // por inminente, que es exactamente lo contrario.
      return { ...base, restante: '—', proxima: '—', estado: 'roto', motivo: r.error };
    }
    if (r.proxima === null || r.faltaMs === null) {
      return { ...base, restante: '—', proxima: '—', estado: 'roto', motivo: r.nota ?? 'Sin próxima ejecución.' };
    }
    const objetivo = this.objetivo(r);
    return {
      ...base,
      restante: this.formatear(objetivo - this.ahoraServidor()),
      proxima: this.horaDePared(new Date(objetivo).toISOString()),
      estado: r.habilitado ? 'activo' : 'apagado',
      motivo: r.habilitado ? undefined : 'Los jobs están apagados en esta instancia.',
    };
  }

  /** Instante actual segun el reloj del SERVIDOR (el del equipo corregido con su desfase). */
  private ahoraServidor(): number {
    return this.ahora() - this.desfaseMs();
  }

  /**
   * Hacia qué disparo se cuenta ahora mismo.
   *
   * <p>Cuando la cuenta llega a cero el reloj <b>se reinicia solo</b>, igual que hace el
   * scheduler: pasa a contar hacia el disparo siguiente sin esperar a la recarga del backend.
   * Sin esto, con un cron de un minuto el reloj se quedaría clavado en 00:00 los dos minutos
   * que tarda en refrescar, que es justo cuando el operador está mirándolo.</p>
   *
   * <p>Si la pestaña estuvo dormida y han pasado varios ciclos, sigue rodando de periodo en
   * periodo hasta alcanzar el futuro. Ese salto es una aproximación —vale para un cron regular,
   * no para uno irregular—, y por eso la recarga periódica del backend sigue siendo la fuente de
   * verdad: corrige la estimación en cuanto llega.</p>
   */
  private objetivo(r: RelojJob): number {
    const ahora = this.ahoraServidor();
    let objetivo = new Date(r.proxima!).getTime();
    if (ahora < objetivo) {
      return objetivo;
    }
    if (r.siguiente) {
      objetivo = new Date(r.siguiente).getTime();
      if (ahora < objetivo) {
        return objetivo;
      }
    }
    const periodo = Number(r.periodoMs ?? 0);
    if (periodo <= 0) {
      // Sin periodo no hay forma de estimar: se deja en el ultimo conocido y la recarga lo
      // corregira. Es preferible a inventar un salto arbitrario.
      return objetivo;
    }
    // Se salta de golpe a la ocurrencia que toca, sin iterar ciclo a ciclo: una pestaña abierta
    // toda la noche con un cron de un minuto daria cientos de vueltas al bucle.
    const ciclosPasados = Math.floor((ahora - objetivo) / periodo) + 1;
    return objetivo + ciclosPasados * periodo;
  }

  /**
   * `mm:ss`, o `h mm` si falta más de una hora.
   *
   * <p>Nunca baja de cero: entre que el job se dispara y el siguiente refresco llega, el cálculo
   * daría negativo y se vería un `-00:03` que parece un error de la pantalla.</p>
   */
  private formatear(ms: number): string {
    const total = Math.max(0, Math.floor(ms / 1000));
    const horas = Math.floor(total / 3600);
    const minutos = Math.floor((total % 3600) / 60);
    const segundos = total % 60;
    const dos = (n: number) => String(n).padStart(2, '0');
    return horas > 0 ? `${horas}h ${dos(minutos)}m` : `${dos(minutos)}:${dos(segundos)}`;
  }

  /** El próximo disparo en la zona del CANAL, no en la del navegador. */
  private horaDePared(iso: string): string {
    return new Intl.DateTimeFormat('es-PE', {
      timeZone: this.zona(),
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    }).format(new Date(iso));
  }

  /**
   * ¿Algún reloj llegó a cero y no pudo rodar solo?
   *
   * <p>Ocurre cuando el backend no manda `siguiente`/`periodoMs` —una versión anterior del
   * servicio, o un cron irregular—. En ese caso el reloj se quedaría clavado en 00:00 hasta la
   * recarga periódica, que tarda dos minutos. La Page usa esta señal para volver a preguntar en
   * cuanto ocurre, de modo que el peor caso sea un segundo parado y no dos minutos.</p>
   */
  protected readonly hayVencido = computed<boolean>(() => {
    const ahora = this.ahoraServidor();
    return (this.datos()?.relojes ?? []).some(
      (r) => !r.error && r.proxima !== null && this.objetivo(r) <= ahora
    );
  });

  /** La Page la sobrescribe: es quien tiene el servicio. */
  protected refrescar(): void {}
}
