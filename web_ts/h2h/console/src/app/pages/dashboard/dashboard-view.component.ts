import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import {
  JAlert,
  JBadge,
  JDot,
  JSectionHeading,
  JStatCard,
  type StatCardTone,
} from 'uijona-4ngular';
import type { DashboardSummary, Health, PipelineStatus } from '../../core/models';

const PEN = new Intl.NumberFormat('es-PE', { style: 'currency', currency: 'PEN', maximumFractionDigits: 0 });
const NUM = new Intl.NumberFormat('es-PE');

const DOT_TONE: Record<PipelineStatus, 'success' | 'primary' | 'warning' | 'danger' | 'neutral'> = {
  done: 'success',
  active: 'primary',
  warning: 'warning',
  error: 'danger',
  pending: 'neutral',
};

@Component({
  selector: 'app-dashboard-view',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [JSectionHeading, JStatCard, JAlert, JBadge, JDot],
  templateUrl: './dashboard-view.component.html',
})
export class DashboardViewComponent {
  protected readonly summary = signal<DashboardSummary | null>(null);
  protected readonly health = signal<Health | null>(null);

  protected readonly num = (value: number) => NUM.format(value);
  protected readonly pen = (value: number) => PEN.format(value);

  protected dotTone(status: PipelineStatus) {
    return DOT_TONE[status];
  }

  protected alertVariant(severity: string): 'danger' | 'warning' | 'info' {
    return severity === 'ERROR' ? 'danger' : severity === 'WARN' ? 'warning' : 'info';
  }
}
