import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import {
  JAlert,
  JBadge,
  JDot,
  JSectionHeading,
  JStatCard,
} from 'uijona-4ngular';
import { ApiService } from '../../core/api.service';
import { DashboardViewComponent } from './dashboard-view.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [JSectionHeading, JStatCard, JAlert, JBadge, JDot],
  templateUrl: './dashboard-view.component.html',
})
export class DashboardPage extends DashboardViewComponent {
  private readonly api = inject(ApiService);

  constructor() {
    super();
    this.api.dashboardSummary().subscribe((s) => this.summary.set(s));
    this.api.health().subscribe((h) => this.health.set(h));
  }
}
