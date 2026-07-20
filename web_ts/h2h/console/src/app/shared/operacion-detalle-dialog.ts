import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { JDialog } from 'uijona-4ngular';
import type { OperacionDetalle, OperacionDetalleRegistro } from '../core/models';

const NUM = new Intl.NumberFormat('es-PE', { minimumFractionDigits: 2 });
const FDT = new Intl.DateTimeFormat('es-PE', { dateStyle: 'short', timeStyle: 'medium', hour12: false });
const FD = new Intl.DateTimeFormat('es-PE', { dateStyle: 'short' });

type Registro = OperacionDetalleRegistro;

/**
 * Diálogo reutilizable con el detalle de una operación (snapshot): operación, beneficiario,
 * cuenta destino, ítems y contabilidad. Renderiza los campos de forma genérica (case-insensitive)
 * para no depender de los alias exactos que devuelva el backend.
 */
@Component({
  selector: 'app-operacion-detalle-dialog',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [JDialog],
  template: `
<j-dialog
  [open]="loading !== null || detalle !== null"
  size="2xl"
  title="Detalle de la operación"
  description="Snapshot de la operación, beneficiario, cuenta destino, ítems y contabilidad."
  contentClassName="p-0"
  (closed)="cerrar()"
  (cancel)="cerrar()"
>
  @if (loading !== null && detalle === null) {
    <div class="flex min-h-48 items-center justify-center text-sm text-neutral-500">Cargando detalle...</div>
  }

  @if (detalle; as d) {
    <div class="flex min-h-[50vh] flex-col gap-4 bg-white p-4">
      <section class="rounded-md border border-neutral-200 bg-white">
        <div class="border-b border-neutral-200 px-3 py-2"><h3 class="text-sm font-semibold text-neutral-800">Operación</h3></div>
        <div class="grid gap-2 p-3 [grid-template-columns:repeat(auto-fit,minmax(min(100%,200px),1fr))]">
          @for (c of entradas(d.operacion); track c.label) {
            <div class="min-w-0 rounded-md bg-neutral-50 p-2">
              <p class="text-[11px] font-medium uppercase text-neutral-500">{{ c.label }}</p>
              <p class="mt-1 break-words text-sm text-neutral-900">{{ c.value }}</p>
            </div>
          }
        </div>
      </section>

      <div class="grid gap-4 md:grid-cols-2">
        <section class="rounded-md border border-neutral-200 bg-white">
          <div class="border-b border-neutral-200 px-3 py-2"><h3 class="text-sm font-semibold text-neutral-800">Beneficiario</h3></div>
          <div class="grid gap-2 p-3">
            @for (c of entradas(d.beneficiario); track c.label) {
              <div class="min-w-0"><span class="text-[11px] font-medium uppercase text-neutral-500">{{ c.label }}: </span><span class="break-words text-sm text-neutral-900">{{ c.value }}</span></div>
            } @empty {
              <p class="text-sm text-neutral-400">Sin beneficiario.</p>
            }
          </div>
        </section>
        <section class="rounded-md border border-neutral-200 bg-white">
          <div class="border-b border-neutral-200 px-3 py-2"><h3 class="text-sm font-semibold text-neutral-800">Cuenta destino</h3></div>
          <div class="grid gap-2 p-3">
            @for (c of entradas(d.beneficiarioCuenta); track c.label) {
              <div class="min-w-0"><span class="text-[11px] font-medium uppercase text-neutral-500">{{ c.label }}: </span><span class="break-words text-sm text-neutral-900">{{ c.value }}</span></div>
            } @empty {
              <p class="text-sm text-neutral-400">Sin cuenta.</p>
            }
          </div>
        </section>
      </div>

      <section class="rounded-md border border-neutral-200 bg-white">
        <div class="border-b border-neutral-200 px-3 py-2"><h3 class="text-sm font-semibold text-neutral-800">Ítems ({{ itemsOp(d).length }})</h3></div>
        <div class="divide-y divide-neutral-100">
          @for (it of itemsOp(d); track $index) {
            <div class="flex flex-wrap gap-x-4 gap-y-1 px-3 py-2 text-sm">
              @for (c of entradas(it); track c.label) {
                <span><span class="text-[11px] uppercase text-neutral-400">{{ c.label }}:</span> <span class="text-neutral-800">{{ c.value }}</span></span>
              }
            </div>
          } @empty {
            <p class="px-3 py-3 text-sm text-neutral-400">Sin ítems.</p>
          }
        </div>
      </section>

      <section class="rounded-md border border-neutral-200 bg-white">
        <div class="border-b border-neutral-200 px-3 py-2"><h3 class="text-sm font-semibold text-neutral-800">Contabilidad ({{ contablesOp(d).length }})</h3></div>
        <div class="divide-y divide-neutral-100">
          @for (ct of contablesOp(d); track $index) {
            <div class="flex flex-wrap gap-x-4 gap-y-1 px-3 py-2 text-sm">
              @for (c of entradas(ct); track c.label) {
                <span><span class="text-[11px] uppercase text-neutral-400">{{ c.label }}:</span> <span class="text-neutral-800">{{ c.value }}</span></span>
              }
            </div>
          } @empty {
            <p class="px-3 py-3 text-sm text-neutral-400">Sin asientos contables.</p>
          }
        </div>
      </section>
    </div>
  }
</j-dialog>
  `,
})
export class OperacionDetalleDialog {
  @Input() detalle: OperacionDetalle | null = null;
  @Input() loading: string | null = null;
  @Output() closed = new EventEmitter<void>();

  protected cerrar(): void {
    this.closed.emit();
  }

  protected itemsOp(d: OperacionDetalle | null): Registro[] {
    return d?.operacionItems ?? [];
  }
  protected contablesOp(d: OperacionDetalle | null): Registro[] {
    return d?.operacionContables ?? [];
  }

  /** Pares label/valor de los campos escalares de un registro, formateando fechas y montos. */
  protected entradas(record: Registro | null | undefined): { label: string; value: string }[] {
    if (!record) return [];
    const out: { label: string; value: string }[] = [];
    for (const [k, v] of Object.entries(record)) {
      if (v === null || v === undefined || v === '' || typeof v === 'object') continue;
      out.push({ label: this.humaniza(k), value: this.formatoCampo(k, v) });
    }
    return out;
  }
  private humaniza(key: string): string {
    return key
      .replace(/([a-z0-9])([A-Z])/g, '$1 $2')
      .replace(/_/g, ' ')
      .replace(/^\w/, (c) => c.toUpperCase());
  }
  private formatoCampo(key: string, value: unknown): string {
    const k = key.toLowerCase();
    if (typeof value === 'boolean') return value ? 'Sí' : 'No';
    if (k.includes('fecha') || k.includes('marcatiempo')) {
      const s = String(value);
      return s.length <= 10 ? this.fd(value) : this.fdt(value);
    }
    if (k.includes('monto') || k.includes('importe')) return NUM.format(Number(value));
    return String(value);
  }
  private fdt(value: unknown): string {
    const d = new Date(String(value));
    return Number.isNaN(d.getTime()) ? String(value) : FDT.format(d);
  }
  private fd(value: unknown): string {
    const s = String(value);
    const d = new Date(s.length <= 10 ? `${s}T00:00:00` : s);
    return Number.isNaN(d.getTime()) ? s : FD.format(d);
  }
}
