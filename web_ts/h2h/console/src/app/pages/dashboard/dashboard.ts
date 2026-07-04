import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import {
  JAlert,
  JBadge,
  JDot,
  JSectionHeading,
  JStatCard,
  type StatCardTone,
} from 'uijona-4ngular';
import { ApiService } from '../../core/api.service';
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
  selector: 'app-dashboard',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [JSectionHeading, JStatCard, JAlert, JBadge, JDot],
  template: `
    <div class="mx-auto flex w-full max-w-7xl flex-col gap-6">
      <j-section-heading
        eyebrow="Operación del día"
        heading="Dashboard H2H"
        [description]="summary() ? 'Flujo del ' + summary()!.fechaOperacion : 'Cargando…'"
      />

      @if (summary(); as s) {
        <!-- KPIs -->
        <div class="grid gap-4 [grid-template-columns:repeat(auto-fit,minmax(min(100%,200px),1fr))]">
          <j-stat-card label="Planillas hoy" [value]="num(s.kpis.planillasHoy)" tone="info" />
          <j-stat-card label="Monto enviado hoy" [value]="pen(s.kpis.montoEnviadoHoy)" tone="success" />
          <j-stat-card label="Operaciones aprobadas" [value]="num(s.kpis.operacionesAprobadas)" tone="success" />
          <j-stat-card label="Operaciones rechazadas" [value]="num(s.kpis.operacionesRechazadas)" tone="danger" />
          <j-stat-card label="Certificados por vencer" [value]="num(s.kpis.certificadosPorVencer)" tone="warning" />
        </div>

        <!-- Pipeline -->
        <div class="rounded-lg border border-neutral-200 bg-white p-5 shadow-sm">
          <p class="mb-4 text-sm font-semibold text-neutral-900">Pipeline del día</p>
          <div class="flex flex-col gap-3 sm:flex-row sm:items-stretch sm:gap-2">
            @for (step of s.pipeline; track step.estado; let last = $last) {
              <div class="flex flex-1 items-center gap-2">
                <div class="min-w-0 flex-1 rounded-md border border-neutral-200 bg-neutral-50 p-3">
                  <div class="flex items-center gap-2">
                    <j-dot [tone]="dotTone(step.statusUi)" [pulse]="step.statusUi === 'active'" />
                    <span class="truncate text-xs font-medium text-neutral-500">{{ step.label }}</span>
                  </div>
                  <p class="mt-1 text-xl font-black tabular-nums text-neutral-900">{{ num(step.cantidad) }}</p>
                </div>
                @if (!last) {
                  <span class="hidden shrink-0 text-neutral-300 sm:inline">→</span>
                }
              </div>
            }
          </div>
        </div>

        <div class="grid gap-6 lg:grid-cols-3">
          <!-- Alertas -->
          <div class="flex flex-col gap-3 lg:col-span-2">
            <p class="text-sm font-semibold text-neutral-900">Alertas que requieren acción</p>
            @for (a of s.alertas; track a.title) {
              <j-alert [variant]="alertVariant(a.severity)" [title]="a.title">{{ a.message }}</j-alert>
            } @empty {
              <p class="text-sm text-neutral-400">Sin alertas.</p>
            }
          </div>

          <!-- Salud servicios -->
          <div class="rounded-lg border border-neutral-200 bg-white p-5 shadow-sm">
            <div class="mb-3 flex items-center justify-between">
              <p class="text-sm font-semibold text-neutral-900">Salud de servicios</p>
              @if (health(); as h) {
                <j-badge [variant]="h.status === 'UP' ? 'secondary' : 'destructive'">{{ h.status }}</j-badge>
              }
            </div>
            <ul class="flex flex-col gap-2.5">
              @for (svc of health()?.services ?? []; track svc.name) {
                <li class="flex items-center justify-between gap-2">
                  <span class="flex min-w-0 items-center gap-2">
                    <j-dot [tone]="svc.status === 'UP' ? 'success' : svc.status === 'DEGRADED' ? 'warning' : 'danger'" />
                    <span class="truncate font-mono text-xs text-neutral-700">{{ svc.name }}</span>
                  </span>
                  <span class="shrink-0 text-xs tabular-nums text-neutral-400">{{ svc.latencyMs }} ms</span>
                </li>
              }
            </ul>
          </div>
        </div>
      }
    </div>
  `,
})
export class DashboardPage {
  private readonly api = inject(ApiService);

  protected readonly summary = signal<DashboardSummary | null>(null);
  protected readonly health = signal<Health | null>(null);

  protected readonly num = (n: number) => NUM.format(n);
  protected readonly pen = (n: number) => PEN.format(n);
  protected dotTone(s: PipelineStatus) {
    return DOT_TONE[s];
  }
  protected alertVariant(sev: string): 'danger' | 'warning' | 'info' {
    return sev === 'ERROR' ? 'danger' : sev === 'WARN' ? 'warning' : 'info';
  }

  constructor() {
    this.api.dashboardSummary().subscribe((s) => this.summary.set(s));
    this.api.health().subscribe((h) => this.health.set(h));
  }
}
