import { J_DATE_PICKER_TEMPLATE } from './JDatePickerView';
import type { InterJDatePicker } from './InterJDatePicker';
import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  computed,
  forwardRef,
  inject,
  input,
  model,
  output,
  signal,
  viewChild,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { cn } from '../../core/cn';

const DAYS = ['Do', 'Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sa'];

const MONTHS = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre',
];

const pad = (n: number) => String(n).padStart(2, '0');

interface Parts {
  year: number;
  month: number;
  day: number;
  hour: number;
  minute: number;
  second: number;
}

function parseValue(value: string | undefined): Parts | null {
  if (!value) return null;
  const m = /^(\d{4})-(\d{2})-(\d{2})(?:[T ](\d{2}):(\d{2})(?::(\d{2}))?)?/.exec(value.trim());
  if (!m) return null;
  const p: Parts = {
    year: +m[1], month: +m[2], day: +m[3],
    hour: +(m[4] ?? 0), minute: +(m[5] ?? 0), second: +(m[6] ?? 0),
  };
  if (p.month < 1 || p.month > 12 || p.day < 1 || p.day > 31) return null;
  return p;
}

function partsToDate(p: Parts | null): Date | null {
  return p ? new Date(p.year, p.month - 1, p.day) : null;
}

function isSameDay(a: Date, b: Date): boolean {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}

/**
 * JDatePicker — selector de fecha con calendario, min/max y hora opcional.
 * Valor ISO. Implementa CVA.
 *
 * Nota: la máquina de máscaras arbitrarias y el listado de timezones del original
 * React se simplifican a formato ISO + hora opcional.
 */
@Component({
  selector: 'j-date-picker',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'contents',
    '(document:keydown.escape)': 'close()',
    '(document:mousedown)': 'onDocMouseDown($event)',
    '(window:resize)': 'reposition()',
    '(window:scroll)': 'reposition()',
  },
  providers: [
    { provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => JDatePicker), multi: true },
  ],
  template: J_DATE_PICKER_TEMPLATE,
})
export class JDatePicker implements ControlValueAccessor {
  readonly value = model<string>('');
  readonly min = input<string>();
  readonly max = input<string>();
  readonly placeholder = input<string>('Seleccionar fecha');
  readonly disabledInput = input<boolean>(false, { alias: 'disabled' });
  readonly showTime = input<boolean>(false);
  readonly showSeconds = input<boolean>(false);
  readonly className = input<string>('');

  readonly changed = output<string>();

  protected readonly cn = cn;
  protected readonly pad = pad;
  protected readonly days = DAYS;
  protected readonly timeInputClass =
    'h-8 w-full rounded-md border border-neutral-300 bg-white px-2 text-sm text-neutral-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500';

  protected readonly open = signal(false);
  protected readonly panelStyle = signal<Record<string, string>>({});
  private readonly today = (() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  })();
  protected readonly viewYear = signal(this.today.getFullYear());
  protected readonly viewMonth = signal(this.today.getMonth());

  private readonly host = inject(ElementRef<HTMLElement>);
  private readonly trigger = viewChild<ElementRef<HTMLElement>>('trigger');
  private cvaDisabled = signal(false);

  protected readonly disabled = computed(() => this.disabledInput() || this.cvaDisabled());
  private readonly selectedParts = computed(() => parseValue(this.value()));
  protected readonly selectedDate = computed(() => partsToDate(this.selectedParts()));
  protected readonly timeParts = computed(
    () => this.selectedParts() ?? { year: 0, month: 1, day: 1, hour: 0, minute: 0, second: 0 }
  );
  private readonly minDate = computed(() => partsToDate(parseValue(this.min())));
  private readonly maxDate = computed(() => partsToDate(parseValue(this.max())));

  protected readonly monthName = computed(() => MONTHS[this.viewMonth()]);
  protected readonly cells = computed(() => {
    const year = this.viewYear();
    const month = this.viewMonth();
    const first = new Date(year, month, 1);
    const last = new Date(year, month + 1, 0);
    const arr: (Date | null)[] = Array(first.getDay()).fill(null);
    for (let d = 1; d <= last.getDate(); d++) arr.push(new Date(year, month, d));
    while (arr.length % 7 !== 0) arr.push(null);
    return arr;
  });
  protected readonly canPrev = computed(() => {
    const min = this.minDate();
    return !min || new Date(this.viewYear(), this.viewMonth(), 0) >= min;
  });
  protected readonly canNext = computed(() => {
    const max = this.maxDate();
    return !max || new Date(this.viewYear(), this.viewMonth() + 1, 1) <= max;
  });

  protected readonly triggerClasses = computed(() =>
    cn(
      'flex h-9 w-full flex-row items-center rounded-md border border-neutral-300 bg-neutral-50 text-sm transition-colors',
      'focus-within:ring-2 focus-within:ring-primary-500',
      this.disabled() && 'cursor-not-allowed opacity-50',
      this.open() && 'ring-2 ring-primary-500'
    )
  );

  protected isSelected(date: Date): boolean {
    const s = this.selectedDate();
    return s ? isSameDay(date, s) : false;
  }
  protected isDisabled(date: Date): boolean {
    const min = this.minDate();
    const max = this.maxDate();
    return !!((min && date < min) || (max && date > max));
  }
  protected dayClasses(date: Date): string {
    const selected = this.isSelected(date);
    const isToday = isSameDay(date, this.today);
    return cn(
      'mx-auto flex h-8 w-8 items-center justify-center rounded-full text-sm transition-colors',
      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500',
      this.isDisabled(date) ? 'cursor-not-allowed opacity-30' : 'cursor-pointer hover:bg-neutral-100',
      selected && 'bg-primary-600 font-semibold text-white hover:bg-primary-700',
      isToday && !selected && 'border border-primary-400 font-medium text-primary-600'
    );
  }

  protected toggle(): void {
    if (this.open()) {
      this.close();
    } else {
      const base = this.selectedDate() ?? this.today;
      this.viewYear.set(base.getFullYear());
      this.viewMonth.set(base.getMonth());
      this.reposition();
      this.open.set(true);
    }
  }
  protected close(): void {
    this.open.set(false);
  }
  protected prevMonth(): void {
    if (this.viewMonth() === 0) {
      this.viewMonth.set(11);
      this.viewYear.update((y) => y - 1);
    } else {
      this.viewMonth.update((m) => m - 1);
    }
  }
  protected nextMonth(): void {
    if (this.viewMonth() === 11) {
      this.viewMonth.set(0);
      this.viewYear.update((y) => y + 1);
    } else {
      this.viewMonth.update((m) => m + 1);
    }
  }
  protected selectDay(date: Date): void {
    if (this.isDisabled(date)) return;
    const t = this.timeParts();
    this.emit({ year: date.getFullYear(), month: date.getMonth() + 1, day: date.getDate(), hour: t.hour, minute: t.minute, second: t.second });
    this.close();
  }
  protected onTime(part: 'hour' | 'minute' | 'second', event: Event): void {
    const raw = Number((event.target as HTMLInputElement).value);
    const max = part === 'hour' ? 23 : 59;
    const val = Number.isNaN(raw) ? 0 : Math.min(max, Math.max(0, raw));
    const base = this.selectedParts() ?? this.dateToParts(this.selectedDate() ?? this.today);
    this.emit({ ...base, [part]: val });
  }
  protected onInput(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.value.set(value);
    this.onChange(value);
    this.changed.emit(value);
  }

  private dateToParts(d: Date): Parts {
    return { year: d.getFullYear(), month: d.getMonth() + 1, day: d.getDate(), hour: 0, minute: 0, second: 0 };
  }
  private emit(p: Parts): void {
    let out = `${pad(p.year).padStart(4, '0')}-${pad(p.month)}-${pad(p.day)}`;
    if (this.showTime() || this.showSeconds()) {
      out += `T${pad(p.hour)}:${pad(p.minute)}`;
      if (this.showSeconds()) out += `:${pad(p.second)}`;
    }
    this.value.set(out);
    this.onChange(out);
    this.changed.emit(out);
  }

  protected reposition(): void {
    const el = this.trigger()?.nativeElement;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const left = Math.min(r.left, window.innerWidth - 320 - 8);
    this.panelStyle.set({ position: 'fixed', top: `${r.bottom + 4}px`, left: `${Math.max(8, left)}px`, 'z-index': '50' });
  }
  protected onDocMouseDown(event: MouseEvent): void {
    if (this.open() && !this.host.nativeElement.contains(event.target as Node)) this.close();
  }

  private onChange: (value: string) => void = () => {};
  private onTouched: () => void = () => {};
  writeValue(value: string | null): void {
    this.value.set(value ?? '');
  }
  registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }
  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }
  setDisabledState(isDisabled: boolean): void {
    this.cvaDisabled.set(isDisabled);
  }
}
