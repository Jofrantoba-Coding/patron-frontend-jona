export interface DashboardPageContract {
  summary: import('../../core/models').DashboardSummary | null;
  health: import('../../core/models').Health | null;
}
