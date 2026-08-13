// reloj-canal-view.component.ts — JONA View del reloj del canal.
// Todo el cálculo es derivación pura de `ventana` + `ahora`. No inyecta servicios:
// la Page (reloj-canal.ts) aporta los datos y el tick.
import { ChangeDetectionStrategy, Component, computed, input, signal } from '@angular/core';
import {
  JAlert,
  JBadge,
  JCard,
  JCardContent,
  JCardDescription,
  JCardHeader,
  JCardTitle,
  JDot,
} from 'uijona-4ngular';
import type { DiaVentana, SubtipoVentana, VentanaSemanal } from '../../core/models';
import {
  MINUTOS_AVISO,
  MINUTOS_CRITICOS,
  etiquetaSubtipo,
  subtiposVigentes,
  type LecturaCanal,
  type UrgenciaCanal,
} from './inter-reloj-canal';

/** `HH:mm:ss` → minutos desde medianoche. */
const aMinutos = (hora: string | undefined): number | null => {
  if (!hora) return null;
  const [h, m] = hora.split(':');
  const total = Number(h) * 60 + Number(m);
  return Number.isFinite(total) ? total : null;
};

/** 138 → "2 h 18 min"; 38 → "38 min". */
const humanizar = (minutos: number): string => {
  if (minutos < 60) return `${minutos} min`;
  const h = Math.floor(minutos / 60);
  const m = minutos % 60;
  return m === 0 ? `${h} h` : `${h} h ${m} min`;
};

@Component({
  selector: 'app-reloj-canal-view',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    JCard,
    JCardHeader,
    JCardTitle,
    JCardDescription,
    JCardContent,
    JBadge,
    JDot,
    JAlert,
  ],
  templateUrl: './reloj-canal-view.component.html',
})
export class RelojCanalViewComponent {
  /** Densidad compacta para la cabecera del sidebar. */
  readonly compacta = input<boolean>(false);

  protected readonly ventana = signal<VentanaSemanal | null>(null);
  /** Reloj inyectado por la Page: mantener el "ahora" fuera hace la vista testeable. */
  protected readonly ahora = signal<Date>(new Date());

  protected readonly zona = computed(() => this.ventana()?.zonaHoraria ?? '');

  /** ISO 1..7 con domingo = 7, como `DayOfWeek.getValue()` del backend. */
  private readonly diaSemanaHoy = computed(() => {
    const dow = this.ahora().getDay();
    return dow === 0 ? 7 : dow;
  });

  private readonly minutosAhora = computed(() => {
    const d = this.ahora();
    return d.getHours() * 60 + d.getMinutes();
  });

  protected readonly subtiposHoy = computed(() =>
    subtiposVigentes(this.ventana(), this.diaSemanaHoy())
  );

  /**
   * El corte que manda ahora: el primero de hoy que todavía no ha pasado.
   *
   * Deliberadamente NO se usa el consolidado `dias`: el backend lo calcula con el
   * cierre más tardío, así que con una interbancaria abierta a las 12:15 y unas
   * intrabancarias a las 20:15, el consolidado diría 20:15 y el operador creería
   * que le quedan ocho horas para algo que cierra en veinte minutos.
   */
  private readonly corteVigente = computed<{ subtipo: SubtipoVentana; cierre: number } | null>(
    () => {
      const ahora = this.minutosAhora();
      const dia = this.diaSemanaHoy();
      for (const s of this.subtiposHoy()) {
        const cierre = aMinutos(s.dias.find((d) => d.diaSemana === dia)?.hasta);
        if (cierre !== null && cierre > ahora) return { subtipo: s, cierre };
      }
      return null;
    }
  );

  protected readonly lectura = computed<LecturaCanal>(() => {
    const v = this.ventana();
    if (!v) return { urgencia: 'sinDato', titular: 'Ventana…', detalle: 'Consultando el canal', minutosRestantes: null };
    if (!v.resuelta)
      return {
        urgencia: 'sinDato',
        titular: 'Sin horario',
        detalle: 'Configuración del canal no resuelta',
        minutosRestantes: null,
      };

    const vigente = this.corteVigente();
    if (!vigente) {
      const proximo = v.dias.find((d, i) => i > 0 && d.opera);
      return {
        urgencia: 'cerrado',
        titular: 'Canal cerrado',
        detalle: proximo ? `Reabre ${proximo.nombre} ${this.hhmm(proximo.desde)}` : 'Sin próxima apertura',
        minutosRestantes: null,
      };
    }

    const restantes = vigente.cierre - this.minutosAhora();
    const urgencia: UrgenciaCanal =
      restantes <= MINUTOS_CRITICOS ? 'critico' : restantes <= MINUTOS_AVISO ? 'porCerrar' : 'abierto';
    const dia = this.diaSemanaHoy();
    const cierre = vigente.subtipo.dias.find((d) => d.diaSemana === dia)?.hasta;

    return {
      urgencia,
      titular: `Quedan ${humanizar(restantes)}`,
      detalle: `${etiquetaSubtipo(vigente.subtipo.subtipo)} · cierra ${this.hhmm(cierre)}`,
      minutosRestantes: restantes,
    };
  });

  protected readonly tono = computed(() => {
    switch (this.lectura().urgencia) {
      case 'critico':
        return 'danger' as const;
      case 'porCerrar':
        return 'warning' as const;
      case 'abierto':
        return 'success' as const;
      default:
        return 'neutral' as const;
    }
  });

  protected readonly claseCaja = computed(() => {
    switch (this.lectura().urgencia) {
      case 'critico':
        return 'border-danger-200 bg-danger-50';
      case 'porCerrar':
        return 'border-warning-200 bg-warning-50';
      case 'abierto':
        return 'border-success-200 bg-success-50';
      default:
        return 'border-neutral-200 bg-neutral-50';
    }
  });

  protected readonly claseTitular = computed(() => {
    switch (this.lectura().urgencia) {
      case 'critico':
        return 'text-danger-700';
      case 'porCerrar':
        return 'text-warning-700';
      case 'abierto':
        return 'text-success-700';
      default:
        return 'text-neutral-700';
    }
  });

  protected nombre(subtipo: string): string {
    return etiquetaSubtipo(subtipo);
  }

  /** `20:15:00` → `20:15`. Los segundos son ruido en una hora de corte. */
  protected hhmm(hora: string | undefined): string {
    return hora ? hora.slice(0, 5) : '—';
  }

  protected horaCierre(s: SubtipoVentana): string {
    const dia = this.diaSemanaHoy();
    return this.hhmm(s.dias.find((d: DiaVentana) => d.diaSemana === dia)?.hasta);
  }

  protected restanteDe(s: SubtipoVentana): string {
    const dia = this.diaSemanaHoy();
    const cierre = aMinutos(s.dias.find((d) => d.diaSemana === dia)?.hasta);
    if (cierre === null) return '—';
    const restantes = cierre - this.minutosAhora();
    return restantes <= 0 ? 'Cerrado' : `en ${humanizar(restantes)}`;
  }
}
