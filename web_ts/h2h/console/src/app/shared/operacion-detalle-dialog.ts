import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { JDialog } from 'uijona-4ngular';
import type { ComparacionCalimaco } from '../pages/calimaco/inter-conciliacion';
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

      <!--
        Conciliación con Calimaco. Dos pasos con una persona en medio: comparar es de solo lectura y
        se puede repetir; informar marca el pago en el sistema del casino y no se deshace. El
        barrido automático nunca hace lo segundo — por eso este panel existe.
      -->
      @if (calimacoVisible) {
        <section class="rounded-md border border-neutral-200 p-3">
          <div class="mb-2 flex flex-wrap items-baseline justify-between gap-2">
            <h4 class="text-sm font-semibold text-neutral-700">Conciliación con Calimaco</h4>
            @if (comparacion?.modo) {
              <span class="rounded px-1.5 py-0.5 text-xs font-medium"
                    [class]="comparacion?.envioPermitido
                      ? 'bg-red-100 text-red-800' : 'bg-neutral-100 text-neutral-600'">
                modo {{ comparacion?.modo }}
              </span>
            }
          </div>

          @if (calimacoBloqueo) {
            <!-- El motivo se muestra en vez de esconder el botón: "no veo el botón" no explica nada. -->
            <p class="text-xs text-amber-700">
              <span class="font-semibold">No se puede informar:</span> {{ calimacoBloqueo }}
            </p>
          } @else {
            <p class="text-xs text-neutral-600">
              Antes de marcar el pago en Calimaco se compara campo a campo. Un identificador que
              coincide no basta: es justo lo que coincidiría si los dos sistemas se hubieran
              desincronizado. Después de mandarlo se <strong>relee</strong> el pago: la operación solo
              avanza si Calimaco confirma el estado nuevo, no porque haya aceptado la petición.
            </p>

            @if (comparacion; as c) {
              <div class="mt-3 overflow-x-auto">
                <table class="w-full min-w-[34rem] text-xs">
                  <thead>
                    <tr class="border-b border-neutral-200 text-left text-neutral-500">
                      <th class="py-1 pr-2 font-medium">Campo</th>
                      <th class="py-1 pr-2 font-medium">Aquí</th>
                      <th class="py-1 pr-2 font-medium">En Calimaco</th>
                      <th class="py-1 font-medium">&nbsp;</th>
                    </tr>
                  </thead>
                  <tbody>
                    @for (f of c.campos; track f.campo) {
                      <tr class="border-b border-neutral-100 align-top">
                        <td class="py-1 pr-2 text-neutral-600">
                          {{ f.campo }}
                          @if (f.critico) {
                            <span class="ml-1 text-red-500" title="Si no cuadra, no se puede informar">*</span>
                          }
                        </td>
                        <td class="py-1 pr-2 font-mono break-all">{{ f.nuestro ?? '—' }}</td>
                        <td class="py-1 pr-2 font-mono break-all">{{ f.suyo ?? '—' }}</td>
                        <td class="py-1 whitespace-nowrap"
                            [class]="f.coincide ? 'text-emerald-700'
                              : (f.critico ? 'text-red-700' : 'text-amber-700')">
                          {{ f.coincide ? 'coincide' : (f.critico ? 'NO coincide' : 'difiere') }}
                        </td>
                      </tr>
                    }
                  </tbody>
                </table>
              </div>
              <p class="mt-1.5 text-xs text-neutral-400">
                <span class="text-red-500">*</span> campos críticos: si uno no cuadra, no se informa.
                Los demás se muestran para que los juzgue una persona — banco y titular se escriben a
                mano en los dos sistemas.
              </p>

              @for (m of c.motivos; track m) {
                <p class="mt-1 text-xs text-red-700">{{ m }}</p>
              }

              @if (c.informado && c.sinEnviar) {
                <!-- Calimaco ya lo tenia hecho: se puso al dia esta fila y NO se reenvio nada. -->
                <p class="mt-2 rounded border border-emerald-300 bg-emerald-50 px-2 py-1.5 text-xs text-emerald-800">
                  Calimaco ya tenía el pago en {{ c.estadoDestinoCalimaco ?? 'el estado destino' }},
                  así que <strong>no se envió nada</strong>: solo se puso al día esta operación, que
                  quedó en PAGO_INFORMADO.
                </p>
              } @else if (c.informado) {
                <p class="mt-2 rounded border border-emerald-300 bg-emerald-50 px-2 py-1.5 text-xs text-emerald-800">
                  Enviado y <strong>verificado</strong>: al releer el pago, Calimaco lo tiene en
                  {{ c.estadoCalimacoDespues ?? c.estadoDestinoCalimaco }}. La operación quedó en
                  PAGO_INFORMADO.
                </p>
              } @else if (c.simulada) {
                <p class="mt-2 rounded border border-neutral-300 bg-neutral-50 px-2 py-1.5 text-xs text-neutral-700">
                  En modo {{ c.modo }} no salió ninguna petición de escritura, así que la operación
                  <strong>no</strong> avanzó. Se comprobaron credenciales, permisos y datos.
                </p>
              } @else if (c.aplicada && !c.verificado) {
                <!--
                  El caso que la verificación existe para atrapar: aceptó la petición pero al releer
                  el estado no cambió. NO se reintenta el envío — repetir una llamada irreversible
                  por no haber sabido leer el resultado es peor que dejarlo a revisión.
                -->
                <p class="mt-2 rounded border border-red-300 bg-red-50 px-2 py-1.5 text-xs text-red-800">
                  Calimaco aceptó la petición pero al releer el pago <strong>no</strong> confirma
                  {{ c.estadoDestinoCalimaco }}
                  @if (c.estadoCalimacoDespues) { (sigue en {{ c.estadoCalimacoDespues }}) }.
                  La operación no avanzó y no se reintenta el envío: revíselo y vuelva a comparar.
                </p>
              }
            }

            <div class="mt-3 flex flex-wrap items-center gap-2">
              <button
                type="button"
                class="rounded-md border border-neutral-300 px-3 py-1.5 text-sm font-medium text-neutral-700 transition hover:bg-neutral-50 disabled:cursor-not-allowed disabled:opacity-50"
                [disabled]="comparando || informando"
                (click)="comparar.emit()"
              >{{ comparacion ? 'Volver a comparar' : 'Comparar con Calimaco' }}</button>

              <!--
                Solo se habilita con una comparación en mano Y que cuadre. Nunca se ofrece "informar
                sin comparar": ese atajo es exactamente el error que este panel existe para evitar.

                El texto dice CUÁL de las dos cosas va a pasar. No es cosmético: una manda una
                petición irreversible al sistema del casino y la otra solo actualiza nuestra fila, y
                el botón no debería parecer lo mismo en los dos casos.
              -->
              <button
                type="button"
                class="rounded-md px-3 py-1.5 text-sm font-medium text-white transition disabled:cursor-not-allowed disabled:opacity-50"
                [class]="comparacion?.yaAplicado
                  ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-red-600 hover:bg-red-700'"
                [disabled]="!comparacion?.puedeInformar || comparando || informando
                  || comparacion?.informado"
                (click)="informar.emit()"
              >{{ informando
                    ? (comparacion?.yaAplicado ? 'Poniendo al día…' : 'Informando…')
                    : (comparacion?.yaAplicado
                        ? 'Poner al día (sin enviar nada)'
                        : 'Informar pago a Calimaco') }}</button>

              @if (comparacion && !comparacion.envioPermitido) {
                <span class="text-xs text-neutral-500">
                  En modo {{ comparacion.modo }} el botón recorre todo el flujo pero no envía el
                  cambio de estado.
                </span>
              }
            </div>
          }
        </section>
      }

      <!--
        Acciones. Solo aparece si el contenedor las habilita (anularVisible), de modo que las
        pantallas que usan este diálogo como consulta siguen siendo de solo lectura.
      -->
      @if (anularVisible) {
        <section class="rounded-md border border-neutral-200 bg-neutral-50 p-3">
          @if (anularBloqueo) {
            <!--
              El motivo del bloqueo se muestra en vez de esconder el botón: que la acción no esté
              disponible es información, y "no veo el botón" no explica por qué.
            -->
            <p class="text-xs text-amber-700"><span class="font-semibold">No se puede anular:</span> {{ anularBloqueo }}</p>
          } @else {
            <div class="flex flex-wrap items-center justify-between gap-2">
              <p class="text-xs text-neutral-600">
                Anular deshace también el asiento contable de la operación. Es terminal: no se
                desanula.
              </p>
              <button
                type="button"
                class="rounded-md bg-red-600 px-3 py-1.5 text-sm font-medium text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
                [disabled]="anulando"
                (click)="anular.emit()"
              >Anular operación</button>
            </div>
          }
        </section>
      }
    </div>
  }
</j-dialog>
  `,
})
export class OperacionDetalleDialog {
  @Input() detalle: OperacionDetalle | null = null;
  @Input() loading: string | null = null;
  /** Muestra el bloque de acciones con el botón de anular. Apagado por defecto: este diálogo se
   *  usa también como consulta desde programaciones, y ahí no debe ofrecer mutaciones. */
  @Input() anularVisible = false;
  /** Por qué NO se puede anular. Con valor, sustituye al botón por la explicación. */
  @Input() anularBloqueo: string | null = null;
  @Input() anulando = false;
  @Output() closed = new EventEmitter<void>();
  @Output() anular = new EventEmitter<void>();

  /**
   * Conciliación con Calimaco. Como con anular, solo aparece si el contenedor lo habilita: las
   * pantallas que usan este diálogo como consulta siguen siendo de solo lectura.
   */
  @Input() calimacoVisible = false;

  /** Por qué no se puede informar, o `null`. Se muestra en vez de esconder el botón. */
  @Input() calimacoBloqueo: string | null = null;
  @Input() comparacion: ComparacionCalimaco | null = null;
  @Input() comparando = false;
  @Input() informando = false;

  /** Comparar es de solo lectura y se puede repetir. */
  @Output() comparar = new EventEmitter<void>();

  /** Informar es irreversible: marca el pago en el sistema del casino. */
  @Output() informar = new EventEmitter<void>();

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
