import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import {
  JBadge,
  JButton,
  JCard,
  JCardContent,
  JCardHeader,
  JCardTitle,
  JOptionPane,
  JSectionHeading,
  type JBadgeVariant,
} from 'uijona-4ngular';
import { ApiService } from '../../core/api.service';
import type { Certificado } from '../../core/models';

@Component({
  selector: 'app-certificados',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [JSectionHeading, JCard, JCardHeader, JCardTitle, JCardContent, JBadge, JButton, JOptionPane],
  template: `
    <div class="mx-auto flex w-full max-w-7xl flex-col gap-6">
      <j-section-heading eyebrow="Seguridad" heading="Certificados y llaves" description="Vigencia y rotación de llaves PGP del tenant y de BCP." />

      <div class="grid gap-5 [grid-template-columns:repeat(auto-fit,minmax(min(100%,320px),1fr))]">
        @for (c of certs(); track c.certificadoId) {
          <j-card>
            <j-card-header>
              <div class="flex items-start justify-between gap-3">
                <j-card-title>{{ c.alias }}</j-card-title>
                <j-badge [variant]="vencVariant(c)">{{ vencLabel(c) }}</j-badge>
              </div>
              <div class="flex flex-wrap gap-1.5">
                <j-badge variant="secondary">{{ c.scope }}</j-badge>
                <j-badge variant="outline">{{ c.tipo }}</j-badge>
                <j-badge variant="outline">{{ c.algoritmo }} {{ c.longitud }}</j-badge>
              </div>
            </j-card-header>
            <j-card-content>
              <dl class="grid grid-cols-[auto_1fr] gap-x-3 gap-y-1.5 text-sm">
                <dt class="text-neutral-400">Fingerprint</dt>
                <dd class="truncate font-mono text-xs text-neutral-700">{{ c.fingerprint }}</dd>
                <dt class="text-neutral-400">Vence</dt>
                <dd class="tabular-nums text-neutral-700">{{ c.fechaVencimiento }} · {{ c.diasParaVencer }} días</dd>
                <dt class="text-neutral-400">Custodia</dt>
                <dd class="text-neutral-700">{{ c.custodiaPrivada }}</dd>
              </dl>
              @if (c.scope === 'TENANT') {
                <div class="mt-4">
                  <j-button size="sm" variant="outline" (clicked)="askRotar(c)">Rotar llave</j-button>
                </div>
              }
            </j-card-content>
          </j-card>
        }
      </div>
    </div>

    <j-option-pane
      [open]="rotar() !== null"
      variant="warning"
      title="Rotar certificado"
      [description]="rotar() ? 'Se rotará la llave ' + rotar()!.alias + '. Requiere re-cargar la clave pública nueva.' : ''"
      confirmLabel="Rotar"
      cancelLabel="Cancelar"
      [isLoading]="loading()"
      (confirm)="doRotar()"
      (cancel)="rotar.set(null)"
    />
  `,
})
export class CertificadosPage {
  private readonly api = inject(ApiService);
  protected readonly certs = signal<Certificado[]>([]);
  protected readonly rotar = signal<Certificado | null>(null);
  protected readonly loading = signal(false);

  protected vencVariant(c: Certificado): JBadgeVariant {
    if (c.diasParaVencer <= 30) return 'destructive';
    if (c.diasParaVencer <= 60) return 'outline';
    return 'secondary';
  }
  protected vencLabel(c: Certificado): string {
    if (c.diasParaVencer <= 30) return 'Crítico';
    if (c.diasParaVencer <= 60) return 'Por vencer';
    return c.estado;
  }

  protected askRotar(c: Certificado): void {
    this.rotar.set(c);
  }
  protected doRotar(): void {
    const c = this.rotar();
    if (!c) return;
    this.loading.set(true);
    this.api.rotarCertificado(c.certificadoId, c.alias.replace(/\d{4}$/, '2028')).subscribe({
      next: (upd) => {
        this.loading.set(false);
        this.rotar.set(null);
        this.certs.update((list) => list.map((x) => (x.certificadoId === upd.certificadoId ? upd : x)));
      },
      error: () => {
        this.loading.set(false);
        this.rotar.set(null);
      },
    });
  }

  constructor() {
    this.api.certificados().subscribe((res) => this.certs.set(res.items));
  }
}
