import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { JDialog } from 'uijona-4ngular';
import type {
  ComparacionCalimaco,
  EstadoCalimaco,
  SesionCalimaco,
} from '../pages/calimaco/inter-conciliacion';
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
        Informe del pago a Calimaco, en CUATRO pasos con una persona en medio.

          1  sesión    la cuenta de servicio entra y PUEDE hacer la transición   solo lectura
          2  datos     se lee el pago y se compara campo a campo                 solo lectura
          3  envío     se manda el cambio de estado                              IRREVERSIBLE
          4  estado    se relee y se confirma que de verdad cambió               solo lectura

        Cada paso se habilita cuando el anterior pasa. Eso es lo que impide llegar al 3 sin haber
        mirado el 1 y el 2 — el error que este panel existe para evitar. El barrido automático nunca
        hace el 3.
      -->
      @if (calimacoVisible) {
        <section class="rounded-md border border-neutral-200 p-3">
          <div class="mb-2 flex flex-wrap items-baseline justify-between gap-2">
            <h4 class="text-sm font-semibold text-neutral-700">Informar el pago a Calimaco</h4>
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
            <!-- La tira: dónde estamos y qué falta. El color codifica el resultado, no el orden. -->
            <ol class="mb-3 flex flex-wrap gap-1.5 text-xs">
              @for (p of pasos(); track p.n) {
                <li class="flex items-center gap-1.5 rounded border px-2 py-1"
                    [class]="p.estado === 'ok' ? 'border-emerald-300 bg-emerald-50 text-emerald-800'
                      : p.estado === 'falla' ? 'border-red-300 bg-red-50 text-red-800'
                      : p.estado === 'curso' ? 'border-blue-300 bg-blue-50 text-blue-800'
                      : 'border-neutral-200 bg-neutral-50 text-neutral-500'">
                  <span class="font-mono font-semibold">{{ p.n }}</span>
                  <span>{{ p.titulo }}</span>
                  @if (p.estado === 'ok') { <span aria-hidden="true">✓</span> }
                  @if (p.estado === 'falla') { <span aria-hidden="true">✕</span> }
                </li>
              }
            </ol>

            <p class="text-xs text-neutral-600">
              Antes de marcar el pago en Calimaco se compara campo a campo. Un identificador que
              coincide no basta: es justo lo que coincidiría si los dos sistemas se hubieran
              desincronizado. Después de mandarlo se <strong>relee</strong> el pago: la operación solo
              avanza si Calimaco confirma el estado nuevo, no porque haya aceptado la petición.
            </p>

            <!-- ── Paso 1: la credencial ─────────────────────────────────────────── -->
            <div class="mt-3 rounded border border-neutral-200 bg-neutral-50 p-2.5">
              <div class="flex flex-wrap items-center justify-between gap-2">
                <p class="text-xs font-semibold text-neutral-700">
                  1 · Cuenta de servicio
                </p>
                <button
                  type="button"
                  class="rounded-md border border-neutral-300 bg-white px-2.5 py-1 text-xs font-medium text-neutral-700 transition hover:bg-neutral-50 disabled:cursor-not-allowed disabled:opacity-50"
                  [disabled]="verificandoSesion || comparando || informando || verificandoEstado"
                  (click)="verificarSesion.emit()"
                >{{ verificandoSesion ? 'Comprobando…' : (sesion ? 'Volver a comprobar' : 'Comprobar sesión') }}</button>
              </div>

              @if (sesion; as ss) {
                <dl class="mt-2 grid grid-cols-[9rem_1fr] gap-x-3 gap-y-1 text-xs">
                  <dt class="text-neutral-500">Usuario</dt>
                  <dd class="font-mono text-neutral-700">{{ ss.usuario ?? '—' }}
                    @if (ss.company) { <span class="text-neutral-400">· {{ ss.company }}</span> }
                  </dd>
                  <dt class="text-neutral-500">Sesión</dt>
                  <dd [class]="ss.sesionActiva ? 'text-emerald-700' : 'text-red-700'">
                    {{ ss.sesionActiva ? 'activa' : 'sin sesión' }}
                  </dd>
                  <dt class="text-neutral-500">Transición</dt>
                  <dd [class]="ss.transicionPermitida ? 'text-emerald-700' : 'text-red-700'">
                    {{ ss.estadoOrigenCalimaco }} → {{ ss.estadoDestinoCalimaco }}
                    {{ ss.transicionPermitida ? ' · concedida' : ' · NO concedida' }}
                  </dd>
                  @if (ss.estadosPermitidos?.length) {
                    <dt class="text-neutral-500">Permitidos</dt>
                    <dd class="font-mono text-neutral-600">{{ ss.estadosPermitidos?.join(', ') }}</dd>
                  }
                </dl>
                @for (m of ss.motivos; track m) {
                  <p class="mt-1 text-xs text-amber-700">{{ m }}</p>
                }
              } @else {
                <p class="mt-1 text-xs text-neutral-500">
                  Un login que funciona no basta: la cuenta puede entrar y no tener concedido el paso
                  al estado destino. Si falta ese permiso, comprobarlo aquí lo dice antes — no en
                  medio del envío.
                </p>
              }
            </div>

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
                [disabled]="comparando || informando || verificandoSesion || verificandoEstado"
                (click)="comparar.emit()"
              >{{ comparando ? 'Comparando…'
                    : (comparacion ? '2 · Volver a comparar' : '2 · Comparar con Calimaco') }}</button>

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
                [disabled]="!puedeEnviarYa() || comparando || informando || verificandoSesion
                  || verificandoEstado || comparacion?.informado"
                (click)="informar.emit()"
              >{{ informando
                    ? (comparacion?.yaAplicado ? 'Poniendo al día…' : 'Informando…')
                    : (comparacion?.yaAplicado
                        ? '3 · Poner al día (sin enviar nada)'
                        : '3 · Informar pago a Calimaco') }}</button>

              <!--
                Paso 4. Se puede pulsar sin haber informado —para ver el estado tal cual está— y
                sobre todo DESPUÉS, que es cuando responde la pregunta que importa: ¿cambió de
                verdad? Nunca queda deshabilitado por el resultado del 3: si el 3 falló a medias,
                este es el único que dice en qué quedó.
              -->
              <button
                type="button"
                class="rounded-md border border-neutral-300 px-3 py-1.5 text-sm font-medium text-neutral-700 transition hover:bg-neutral-50 disabled:cursor-not-allowed disabled:opacity-50"
                [disabled]="comparando || informando || verificandoSesion || verificandoEstado"
                (click)="verificarEstado.emit()"
              >{{ verificandoEstado ? 'Verificando…' : '4 · Verificar el estado' }}</button>

              @if (comparacion && !comparacion.envioPermitido) {
                <span class="text-xs text-neutral-500">
                  En modo {{ comparacion.modo }} el botón recorre todo el flujo pero no envía el
                  cambio de estado.
                </span>
              }
              @if (!puedeEnviarYa() && comparacion?.puedeInformar) {
                <!-- La comparación cuadra pero falta el paso 1: se dice cuál, no «no disponible». -->
                <span class="text-xs text-amber-700">
                  Comprueba primero la sesión (paso 1): sin la transición concedida, el envío se
                  rechazaría a mitad.
                </span>
              }
            </div>

            <!--
              Donde quedo registrado. Importa decirlo: el informe manual deja la misma trazabilidad
              que el del scheduler —tanda, detalle, modo sellado y comparacion congelada— y sin esta
              linea el operador no tendria forma de saber que existe ni como encontrarla.
            -->
            @if (comparacion?.codigoProgramacionInforme; as cod) {
              <p class="mt-2 text-xs text-neutral-500">
                Registrado en la tanda de informe <span class="font-mono text-neutral-700">{{ cod }}</span>.
                Se puede abrir en <em>Informes de pago</em>, con la comparación congelada y el modo con
                el que se ejecutó.
              </p>
            }

            <!-- ── Paso 4: el resultado de la relectura ──────────────────────────── -->
            @if (estado; as e) {
              <div class="mt-3 rounded border p-2.5 text-xs"
                   [class]="e.coherente ? 'border-emerald-300 bg-emerald-50'
                     : 'border-amber-300 bg-amber-50'">
                <p class="font-semibold"
                   [class]="e.coherente ? 'text-emerald-800' : 'text-amber-800'">
                  4 · {{ e.coherente
                          ? 'Los dos sistemas coinciden'
                          : 'Los dos sistemas todavía no coinciden' }}
                </p>
                <dl class="mt-1.5 grid grid-cols-[9rem_1fr] gap-x-3 gap-y-1">
                  <dt class="text-neutral-500">En Calimaco</dt>
                  <dd class="font-mono text-neutral-800">
                    {{ e.estadoCalimaco ?? 'desconocido' }}
                    <span class="text-neutral-400">(destino {{ e.estadoDestinoCalimaco }})</span>
                  </dd>
                  <dt class="text-neutral-500">Aquí</dt>
                  <dd class="font-mono text-neutral-800">{{ e.estadoOperacion ?? '—' }}</dd>
                </dl>
                @for (m of e.motivos; track m) {
                  <p class="mt-1 text-amber-800">{{ m }}</p>
                }
              </div>
            }
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

  /** Paso 1: estado de la credencial de la cuenta de servicio. */
  @Input() sesion: SesionCalimaco | null = null;
  @Input() verificandoSesion = false;

  /** Paso 4: cómo quedó el pago al releerlo. */
  @Input() estado: EstadoCalimaco | null = null;
  @Input() verificandoEstado = false;

  /** Paso 1. Solo lectura y repetible. */
  @Output() verificarSesion = new EventEmitter<void>();

  /** Paso 2. Solo lectura y repetible. */
  @Output() comparar = new EventEmitter<void>();

  /** Paso 3. Irreversible: marca el pago en el sistema del casino. */
  @Output() informar = new EventEmitter<void>();

  /** Paso 4. Solo lectura y repetible. */
  @Output() verificarEstado = new EventEmitter<void>();

  /**
   * ¿Se puede pulsar el paso 3?
   *
   * <p>Tres condiciones, y ninguna sobra: la comparación cuadra, **y** la sesión se comprobó, **y**
   * la transición está concedida. Exigir el paso 1 no es burocracia — sin él el envío se rechazaría
   * a mitad por un permiso que se podía haber consultado antes, y ese rechazo llega después de
   * haber pulsado lo irreversible.</p>
   *
   * <p>En OFFLINE se deja pasar: ahí no sale ninguna petición, así que la credencial no se puede
   * comprobar y exigirlo dejaría el flujo sin poder recorrerse ni en seco.</p>
   */
  protected puedeEnviarYa(): boolean {
    if (!this.comparacion?.puedeInformar) return false;
    // Poner al día una operación que Calimaco ya tiene aplicada no manda nada: no necesita permiso
    // de transición.
    if (this.comparacion?.yaAplicado) return true;
    if (String(this.comparacion?.modo ?? '').toUpperCase() === 'OFFLINE') return true;
    return this.sesion?.sesionActiva === true && this.sesion?.transicionPermitida === true;
  }

  /** La tira de arriba. El estado de cada paso sale de lo que ya se sabe, no de un contador. */
  protected pasos(): Array<{ n: number; titulo: string; estado: 'vacio' | 'curso' | 'ok' | 'falla' }> {
    const c = this.comparacion;
    const s = this.sesion;
    const e = this.estado;
    return [
      {
        n: 1, titulo: 'Sesión',
        estado: this.verificandoSesion ? 'curso'
          : !s ? 'vacio'
          : s.sesionActiva && s.transicionPermitida ? 'ok' : 'falla',
      },
      {
        n: 2, titulo: 'Datos',
        estado: this.comparando ? 'curso'
          : !c ? 'vacio'
          : c.puedeInformar ? 'ok' : 'falla',
      },
      {
        n: 3, titulo: 'Envío',
        // `simulada` no es ni ok ni falla: no se intentó de verdad. Se deja en curso-visual como
        // «pasó por aquí sin efecto», que es la verdad.
        estado: this.informando ? 'curso'
          : c?.informado ? 'ok'
          : c?.simulada ? 'curso'
          : c?.aplicada && !c?.verificado ? 'falla'
          : 'vacio',
      },
      {
        n: 4, titulo: 'Verificado',
        estado: this.verificandoEstado ? 'curso'
          : !e ? 'vacio'
          : e.coherente ? 'ok' : 'falla',
      },
    ];
  }

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
