// JTimeWheelImpl.ts — JONA Implementacion
import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  afterRenderEffect,
  computed,
  effect,
  forwardRef,
  inject,
  input,
  model,
  output,
  signal,
  viewChildren,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { cn } from '../../core/cn';
import {
  JTIMEWHEEL_ALTO_FILA,
  JTIMEWHEEL_DEFAULTS,
  JTIMEWHEEL_ETIQUETAS,
  JTIMEWHEEL_MAXIMOS,
  formatHora,
  pad2,
  parseHora,
  valoresDe,
  type JTimeWheelParte,
} from './InterJTimeWheel';
import {
  JTIMEWHEEL_BANDA_CLASSES,
  JTIMEWHEEL_COLUMNA_CLASSES,
  JTIMEWHEEL_DESHABILITADO_CLASSES,
  JTIMEWHEEL_ITEM_ACTIVO,
  JTIMEWHEEL_ITEM_BASE,
  JTIMEWHEEL_ITEM_CERCA,
  JTIMEWHEEL_ITEM_LEJOS,
  JTIMEWHEEL_RAIZ_CLASSES,
  JTIMEWHEEL_SEPARADOR_CLASSES,
} from './JTimeWheelStyles';

/** Tiempo sin scroll tras el cual se da por elegido el valor centrado. */
const ASENTAMIENTO_MS = 110;

/**
 * JTimeWheel — selector de hora en ruedas, al estilo de los selectores del movil.
 *
 * El ajuste al centro lo hace el navegador con `scroll-snap`, no JavaScript: se
 * conserva la inercia nativa del gesto y no hay que reimplementar la fisica del
 * arrastre. Al detenerse el scroll se lee que fila quedo centrada.
 *
 * Implementa `ControlValueAccessor`: funciona con `[(ngModel)]`, `formControl`
 * y `[(value)]`.
 */
@Component({
  selector: 'j-time-wheel',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'contents' },
  providers: [
    { provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => JTimeWheel), multi: true },
  ],
  templateUrl: './JTimeWheelView.html',
  styleUrl: './JTimeWheelView.css',
})
export class JTimeWheel implements ControlValueAccessor {
  readonly value = model<string>('00:00');
  readonly showSeconds = input<boolean>(JTIMEWHEEL_DEFAULTS.showSeconds);
  readonly minuteStep = input<number>(JTIMEWHEEL_DEFAULTS.minuteStep);
  readonly secondStep = input<number>(JTIMEWHEEL_DEFAULTS.secondStep);
  readonly visibleRows = input<number>(JTIMEWHEEL_DEFAULTS.visibleRows);
  readonly disabledInput = input<boolean>(JTIMEWHEEL_DEFAULTS.disabled, { alias: 'disabled' });
  readonly className = input<string>('');

  readonly changed = output<string>();

  protected readonly pad2 = pad2;
  protected readonly altoFila = JTIMEWHEEL_ALTO_FILA;
  protected readonly bandaClasses = JTIMEWHEEL_BANDA_CLASSES;
  protected readonly columnaClasses = JTIMEWHEEL_COLUMNA_CLASSES;
  protected readonly separadorClasses = JTIMEWHEEL_SEPARADOR_CLASSES;

  private readonly columnasRef = viewChildren<ElementRef<HTMLElement>>('columna');
  private readonly cvaDisabled = signal(false);
  /** Evita que el scroll que provocamos nosotros se lea como gesto del usuario. */
  private ajustando = false;
  private temporizador: ReturnType<typeof setTimeout> | null = null;

  protected readonly disabled = computed(() => this.disabledInput() || this.cvaDisabled());
  protected readonly partes = computed(() => parseHora(this.value()));

  /** Filas visibles, siempre impar para que exista una fila central. */
  private readonly filas = computed(() => {
    const n = Math.max(3, Math.floor(this.visibleRows()));
    return n % 2 === 0 ? n + 1 : n;
  });

  protected readonly altoTotal = computed(() => this.filas() * JTIMEWHEEL_ALTO_FILA);
  /** Relleno para que el primer y el ultimo valor puedan quedar centrados. */
  protected readonly offsetCentro = computed(
    () => ((this.filas() - 1) / 2) * JTIMEWHEEL_ALTO_FILA
  );

  protected readonly columnas = computed(() => {
    const p = this.partes();
    const cols: {
      parte: JTimeWheelParte;
      etiqueta: string;
      valores: number[];
      actual: number;
      max: number;
    }[] = [
      { parte: 'hour', etiqueta: JTIMEWHEEL_ETIQUETAS.hour, valores: valoresDe('hour', 1), actual: p.hour, max: JTIMEWHEEL_MAXIMOS.hour },
      { parte: 'minute', etiqueta: JTIMEWHEEL_ETIQUETAS.minute, valores: valoresDe('minute', this.minuteStep()), actual: p.minute, max: JTIMEWHEEL_MAXIMOS.minute },
    ];
    if (this.showSeconds()) {
      cols.push({ parte: 'second', etiqueta: JTIMEWHEEL_ETIQUETAS.second, valores: valoresDe('second', this.secondStep()), actual: p.second, max: JTIMEWHEEL_MAXIMOS.second });
    }
    return cols;
  });

  protected readonly raizClasses = computed(() =>
    cn(JTIMEWHEEL_RAIZ_CLASSES, this.disabled() && JTIMEWHEEL_DESHABILITADO_CLASSES, this.className())
  );

  constructor() {
    // Cada vez que cambia el valor (venga de fuera o de un gesto) se recolocan
    // las columnas. Va en afterRender porque necesita medir el DOM ya pintado.
    afterRenderEffect(() => {
      this.partes();
      this.columnas();
      this.centrarColumnas(false);
    });

    effect(() => {
      // Reaccionar al cambio de pasos: los indices se mueven aunque el valor no.
      this.minuteStep();
      this.secondStep();
      this.showSeconds();
    });

    inject(DestroyRef).onDestroy(() => {
      if (this.temporizador) clearTimeout(this.temporizador);
    });
  }

  protected itemClasses(actual: number, valor: number): string {
    const distancia = Math.abs(this.indiceDe(valor) - this.indiceDe(actual));
    return cn(
      JTIMEWHEEL_ITEM_BASE,
      valor === actual
        ? JTIMEWHEEL_ITEM_ACTIVO
        : distancia <= 1
          ? JTIMEWHEEL_ITEM_CERCA
          : JTIMEWHEEL_ITEM_LEJOS
    );
  }

  /** Clic directo sobre un valor: mas rapido que arrastrar cuando se ve el numero. */
  protected seleccionar(parte: JTimeWheelParte, valor: number): void {
    if (this.disabled()) return;
    this.emitir({ ...this.partes(), [parte]: valor });
  }

  protected onScroll(parte: JTimeWheelParte, event: Event): void {
    if (this.disabled() || this.ajustando) return;
    const el = event.target as HTMLElement;
    if (this.temporizador) clearTimeout(this.temporizador);
    // Se espera a que el scroll se detenga: emitir en cada pixel dispararia
    // decenas de cambios de valor durante un solo gesto.
    this.temporizador = setTimeout(() => {
      const valores = this.valoresDeParte(parte);
      const indice = Math.round(el.scrollTop / JTIMEWHEEL_ALTO_FILA);
      const valor = valores[Math.min(valores.length - 1, Math.max(0, indice))];
      if (valor !== undefined && valor !== this.partes()[parte]) {
        this.emitir({ ...this.partes(), [parte]: valor });
      }
    }, ASENTAMIENTO_MS);
  }

  /**
   * Teclado. Sin esto la rueda sería inoperable sin ratón ni pantalla táctil, y
   * este control fija la hora a la que sale dinero.
   */
  protected onKeydown(parte: JTimeWheelParte, event: KeyboardEvent): void {
    if (this.disabled()) return;
    const valores = this.valoresDeParte(parte);
    const indice = valores.indexOf(this.partes()[parte]);
    const actual = indice >= 0 ? indice : 0;
    let destino: number | null = null;

    switch (event.key) {
      case 'ArrowUp':
        destino = actual - 1;
        break;
      case 'ArrowDown':
        destino = actual + 1;
        break;
      case 'PageUp':
        destino = actual - 5;
        break;
      case 'PageDown':
        destino = actual + 5;
        break;
      case 'Home':
        destino = 0;
        break;
      case 'End':
        destino = valores.length - 1;
        break;
      default:
        return;
    }

    event.preventDefault();
    const acotado = Math.min(valores.length - 1, Math.max(0, destino));
    this.emitir({ ...this.partes(), [parte]: valores[acotado] });
  }

  private valoresDeParte(parte: JTimeWheelParte): number[] {
    if (parte === 'hour') return valoresDe('hour', 1);
    return valoresDe(parte, parte === 'minute' ? this.minuteStep() : this.secondStep());
  }

  private indiceDe(valor: number): number {
    return valor;
  }

  private centrarColumnas(suave: boolean): void {
    const cols = this.columnasRef();
    if (cols.length === 0) return;
    this.ajustando = true;
    const definiciones = this.columnas();
    cols.forEach((ref, i) => {
      const def = definiciones[i];
      if (!def) return;
      const indice = def.valores.indexOf(def.actual);
      const destino = Math.max(0, indice) * JTIMEWHEEL_ALTO_FILA;
      const el = ref.nativeElement;
      if (Math.abs(el.scrollTop - destino) > 1) {
        el.scrollTo({ top: destino, behavior: suave ? 'smooth' : 'auto' });
      }
    });
    // El flag se libera un tick después para no leer como gesto el ajuste propio.
    setTimeout(() => (this.ajustando = false), ASENTAMIENTO_MS + 40);
  }

  private emitir(partes: Record<JTimeWheelParte, number>): void {
    const salida = formatHora(partes, this.showSeconds());
    this.value.set(salida);
    this.onChange(salida);
    this.onTouched();
    this.changed.emit(salida);
  }

  // ── ControlValueAccessor ──────────────────────────────────────────────
  private onChange: (valor: string) => void = () => {};
  private onTouched: () => void = () => {};

  writeValue(valor: string | null): void {
    this.value.set(valor ?? '00:00');
  }
  registerOnChange(fn: (valor: string) => void): void {
    this.onChange = fn;
  }
  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }
  setDisabledState(deshabilitado: boolean): void {
    this.cvaDisabled.set(deshabilitado);
  }
}
