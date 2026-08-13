import { instanteDeBackendAHoraDePared } from '../../core/zona-horaria';
import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import {
  JBadge,
  JButton,
  JDatePicker,
  JPagination,
  JSectionHeading,
  JTable,
  JTableBody,
  JTableCell,
  JTableHead,
  JTableHeader,
  JTableRow,
  type JBadgeVariant,
} from 'uijona-4ngular';
import type { RespuestaRow } from '../../core/models';
import { TIPOS_RESPUESTA, significadoRespuesta, type SignificadoRespuesta } from './inter-respuestas';

const BADGE: Record<string, JBadgeVariant> = {
  RES: 'default',
  VAL: 'destructive',
  RES2: 'secondary',
  PAR: 'outline',
};

@Component({
  selector: 'app-respuestas-view',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    JSectionHeading,
    JTable,
    JTableHeader,
    JTableBody,
    JTableRow,
    JTableHead,
    JTableCell,
    JBadge,
    JButton,
    JDatePicker,
    JPagination,
  ],
  templateUrl: './respuestas-view.component.html',
})
export class RespuestasViewComponent {
  /** Marca de tiempo del backend en hora del canal, la misma que dicen los filtros. */
  protected horaCanal(valor: unknown): string {
    return instanteDeBackendAHoraDePared(valor) || '—';
  }

  protected readonly rows = signal<RespuestaRow[]>([]);
  protected readonly page = signal<number>(1);
  protected readonly pageSize = signal<number>(20);
  protected readonly total = signal<number>(0);
  protected readonly cargando = signal<boolean>(true);

  protected readonly tiposRespuesta = TIPOS_RESPUESTA;

  protected readonly filtroNombre = signal<string>('');
  protected readonly filtroTipo = signal<string>('');
  protected readonly filtroIdPlanilla = signal<string>('');
  protected readonly filtroFechaDesde = signal<string>('');
  protected readonly filtroFechaHasta = signal<string>('');

  protected readonly totalPaginas = computed(() =>
    Math.max(1, Math.ceil(this.total() / this.pageSize()))
  );

  /**
   * Si hay algún filtro puesto, «no hay respuestas» dejaría de ser cierto: lo que no hay son
   * respuestas *que casen*. Decirlo mal hace que alguien concluya que el banco no contestó
   * cuando en realidad está mirando por una rendija.
   */
  protected readonly hayFiltros = computed(
    () =>
      !!this.filtroNombre() ||
      !!this.filtroTipo() ||
      !!this.filtroIdPlanilla() ||
      !!this.filtroFechaDesde() ||
      !!this.filtroFechaHasta()
  );

  private texto(evento: Event): string {
    return (evento.target as HTMLInputElement | HTMLSelectElement).value;
  }

  protected onNombre(evento: Event): void {
    this.filtroNombre.set(this.texto(evento));
  }

  protected onTipo(evento: Event): void {
    this.filtroTipo.set(this.texto(evento));
  }

  protected onIdPlanilla(evento: Event): void {
    this.filtroIdPlanilla.set(this.texto(evento));
  }

  protected onFechaDesde(valor: string): void {
    this.filtroFechaDesde.set(valor);
  }

  protected onFechaHasta(valor: string): void {
    this.filtroFechaHasta.set(valor);
  }

  protected significado(codigo: string): SignificadoRespuesta {
    return significadoRespuesta(codigo);
  }

  protected badgeDe(codigo: string): JBadgeVariant {
    return BADGE[String(codigo ?? '').toUpperCase()] ?? 'secondary';
  }

  /** Hooks que sobrescribe la Page. */
  protected verPlanilla(_idPlanilla: string): void {}
  protected onPagina(_pagina: number): void {}
  protected onAplicarFiltros(): void {}
  protected onResetFiltros(): void {}
}
