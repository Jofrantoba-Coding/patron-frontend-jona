import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { JBadge, JProgress, JSectionHeading } from 'uijona-4ngular';
import type {
  CorridaJob,
  JobPanorama,
  InstanciaSchedulers,
  OrganizacionRef,
  PanoramaSchedulers,
  ResumenJob,
} from './inter-schedulers-seguimiento';

const NUM = new Intl.NumberFormat('es-PE');

/**
 * Vista del seguimiento de schedulers: estado y presentación, sin llamadas al backend.
 *
 * <p>Lo que la pantalla tiene que responder de un vistazo es «¿está corriendo?, ¿cuándo fue la
 * última vez?, ¿hay algo atascado?, ¿por qué este job no hace nada?». Esa última es la que más
 * cuesta, y por eso el interruptor se pinta junto a la última corrida: un job puede estar sano y
 * no hacer nada simplemente porque su organización lo tiene apagado.</p>
 */
@Component({
  selector: 'app-schedulers-seguimiento-view',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [JSectionHeading, JBadge, JProgress],
  templateUrl: './schedulers-seguimiento-view.component.html',
})
export class SchedulersSeguimientoViewComponent {
  protected readonly instancia = signal<InstanciaSchedulers | null>(null);
  protected readonly jobs = signal<JobPanorama[]>([]);
  protected readonly organizaciones = signal<OrganizacionRef[]>([]);
  protected readonly colgadas = signal<CorridaJob[]>([]);
  protected readonly resumen = signal<ResumenJob[]>([]);
  protected readonly alcance = signal<string>('TODAS');
  protected readonly generado = signal<string | null>(null);

  /** Organización mirada. Vacío = todas (solo posible con token de plataforma). */
  protected readonly organizacion = signal<string>('');
  protected readonly diasResumen = signal<number>(7);

  protected readonly cargando = signal<boolean>(false);
  protected readonly error = signal<string | null>(null);
  protected readonly aviso = signal<string | null>(null);

  /** Job cuyo detalle está desplegado. Uno a la vez: la tabla ya es densa. */
  protected readonly jobAbierto = signal<string | null>(null);

  // ── Derivados ──────────────────────────────────────────────────────────

  /**
   * Semáforo global. Rojo si hay algo atascado o si la instancia está apagada —las dos cosas
   * significan «no va a pasar nada», que es lo que hay que ver sin leer nada más—.
   */
  protected readonly salud = computed<'ok' | 'atencion' | 'apagado'>(() => {
    if (!this.instancia()?.habilitado) return 'apagado';
    if (this.colgadas().length > 0) return 'atencion';
    const hayError = this.jobs().some((j) =>
      j.organizaciones.some((o) => o.ultimaCorrida?.estado === 'ERROR')
    );
    return hayError ? 'atencion' : 'ok';
  });

  /** Cuántos (job, organización) están apagados: explica un panorama sin actividad. */
  protected readonly apagados = computed(() =>
    this.jobs().reduce((n, j) => n + j.organizaciones.filter((o) => !o.interruptor).length, 0)
  );

  protected readonly hayColgadas = computed(() => this.colgadas().length > 0);

  /** Ocupación del pool. Una cola que no baja anticipa el atasco antes de que se note en la BD. */
  protected readonly poolTexto = computed(() => {
    const p = this.instancia()?.pool;
    if (!p?.disponible) return 'no disponible';
    return `${p.activos ?? 0} activo(s) · cola ${p.enCola ?? 0} · máx ${p.maxPoolSize ?? '?'}`;
  });

  // ── Presentación ───────────────────────────────────────────────────────

  protected setPanorama(data: PanoramaSchedulers): void {
    this.instancia.set(data.instancia ?? null);
    this.jobs.set(data.jobs ?? []);
    this.organizaciones.set(data.organizaciones ?? []);
    this.colgadas.set(data.colgadas ?? []);
    this.resumen.set(data.resumen ?? []);
    this.alcance.set(data.alcance ?? 'TODAS');
    this.generado.set(data.generado ?? null);
    this.error.set(null);
  }

  protected setError(mensaje: string): void {
    this.error.set(mensaje);
  }

  /**
   * Variante del badge según el estado. `OMITIDO` va en `outline` y no en destructivo: no es un
   * fallo, es «no tocaba» —el interruptor estaba apagado o no había trabajo—, y pintarlo como
   * error haría que la pantalla gritara en su estado más normal.
   */
  protected tono(estado: string | undefined): 'default' | 'secondary' | 'destructive' | 'outline' {
    switch (estado) {
      case 'OK':
        return 'secondary';
      case 'ERROR':
        return 'destructive';
      case 'EN_CURSO':
        return 'default';
      default:
        return 'outline';
    }
  }

  /** Duración legible. Los ciclos SFTP se miden en segundos; los otros dos, en milisegundos. */
  protected duracion(ms: number | null | undefined): string {
    if (ms === null || ms === undefined) return '—';
    if (ms < 1000) return `${NUM.format(ms)} ms`;
    return `${NUM.format(Math.round(ms / 100) / 10)} s`;
  }

  /** Fecha y hora local, corta. La bitácora ya viene en ISO con offset. */
  protected momento(iso: string | null | undefined): string {
    if (!iso) return '—';
    const d = new Date(iso);
    return Number.isNaN(d.getTime())
      ? iso
      : d.toLocaleString('es-PE', { dateStyle: 'short', timeStyle: 'medium' });
  }

  /** Hace cuánto, en palabras. Es lo que de verdad se mira: «¿corrió hace poco?». */
  protected hace(iso: string | null | undefined): string {
    if (!iso) return '—';
    const t = new Date(iso).getTime();
    if (Number.isNaN(t)) return '—';
    const seg = Math.max(0, Math.round((Date.now() - t) / 1000));
    if (seg < 60) return `hace ${seg}s`;
    if (seg < 3600) return `hace ${Math.round(seg / 60)} min`;
    if (seg < 86400) return `hace ${Math.round(seg / 3600)} h`;
    return `hace ${Math.round(seg / 86400)} d`;
  }

  protected numero(n: number | null | undefined): string {
    return n === null || n === undefined ? '—' : NUM.format(n);
  }

  protected cron(job: string): string {
    return this.instancia()?.crones?.[job] ?? '—';
  }

  /** Resumen de un job en la ventana, para la fila de cabecera. */
  protected resumenDe(job: string): ResumenJob[] {
    return this.resumen().filter((r) => r.job === job);
  }

  protected alternarJob(job: string): void {
    this.jobAbierto.set(this.jobAbierto() === job ? null : job);
  }

  protected mensajeError(err: unknown, porDefecto: string): string {
    const e = err as { error?: { message?: string; errors?: { message?: string }[] } };
    return e?.error?.errors?.[0]?.message ?? e?.error?.message ?? porDefecto;
  }

  // ── Ganchos que implementa la Page ─────────────────────────────────────
  protected cargarPanorama(): void {}
  protected refrescar(): void {}
  protected ejecutar(_job: string): void {}
  protected cambiarInterruptor(_job: string, _idOrganizacion: string, _habilitado: boolean): void {}
  protected cambiarOrganizacion(_idOrganizacion: string): void {}

  protected onOrganizacion(ev: Event): void {
    this.organizacion.set((ev.target as HTMLSelectElement).value);
    this.refrescar();
  }

  protected onDias(ev: Event): void {
    const v = Number((ev.target as HTMLSelectElement).value);
    this.diasResumen.set(Number.isFinite(v) && v > 0 ? v : 7);
    this.refrescar();
  }
}
