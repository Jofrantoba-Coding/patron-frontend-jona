import { J_DASHBOARD_PREVIEW_TEMPLATE } from './JDashboardPreviewView';
import type { DashboardStat, InterJDashboardPreview } from './InterJDashboardPreview';
import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { cn } from '../../core/cn';
/** JDashboardPreview — mockup de dashboard con stats y mini-gráfico de barras. */
@Component({
  selector: 'j-dashboard-preview',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'contents' },
  template: J_DASHBOARD_PREVIEW_TEMPLATE,
})
export class JDashboardPreview {
  readonly title = input.required<string>();
  readonly statusLabel = input<string>();
  readonly stats = input.required<DashboardStat[]>();
  readonly chartLabel = input<string>();
  readonly chart = input<number[]>([48, 74, 58, 88, 66, 52, 80]);
  readonly className = input<string>('');
  protected readonly cn = cn;
}
