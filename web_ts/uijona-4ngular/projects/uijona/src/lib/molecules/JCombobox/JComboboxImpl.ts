import { J_COMBOBOX_TEMPLATE } from './JComboboxView';
import type { JComboboxOption, InterJCombobox } from './InterJCombobox';
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
/**
 * JCombobox — select con búsqueda, teclado y panel flotante. Implementa CVA.
 */
@Component({
  selector: 'j-combobox',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'contents',
    '(document:mousedown)': 'onDocMouseDown($event)',
    '(window:resize)': 'reposition()',
    '(window:scroll)': 'reposition()',
  },
  providers: [
    { provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => JCombobox), multi: true },
  ],
  template: J_COMBOBOX_TEMPLATE,
})
export class JCombobox implements ControlValueAccessor {
  readonly options = input.required<JComboboxOption[]>();
  readonly value = model<string>('');
  readonly placeholder = input<string>('Seleccionar...');
  readonly searchPlaceholder = input<string>('Buscar...');
  readonly emptyText = input<string>('Sin resultados');
  readonly disabledInput = input<boolean>(false, { alias: 'disabled' });
  readonly className = input<string>('');

  readonly changed = output<{ value: string; option: JComboboxOption }>();
  readonly searchChange = output<string>();

  protected readonly cn = cn;
  protected readonly open = signal(false);
  protected readonly query = signal('');
  protected readonly activeIndex = signal(0);
  protected readonly listStyle = signal<Record<string, string>>({});
  private readonly host = inject(ElementRef<HTMLElement>);
  private readonly trigger = viewChild<ElementRef<HTMLElement>>('trigger');
  private readonly search = viewChild<ElementRef<HTMLInputElement>>('search');
  private cvaDisabled = signal(false);

  protected readonly disabled = computed(() => this.disabledInput() || this.cvaDisabled());
  protected readonly selected = computed(
    () => this.options().find((o) => o.value === this.value()) ?? null
  );
  protected readonly filtered = computed(() =>
    this.options().filter((o) => o.label.toLowerCase().includes(this.query().toLowerCase()))
  );

  protected readonly triggerClasses = computed(() =>
    cn(
      'flex h-9 w-full items-center justify-between rounded-md border border-neutral-300 bg-neutral-50 px-3 py-1 text-sm transition-colors',
      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500',
      'disabled:cursor-not-allowed disabled:opacity-50',
      this.open() && 'ring-2 ring-primary-500'
    )
  );

  protected optionClasses(opt: JComboboxOption, i: number): string {
    return cn(
      'flex w-full items-center gap-2 px-3 py-1.5 text-left text-sm transition-colors focus-visible:outline-none',
      opt.disabled ? 'cursor-not-allowed opacity-40' : 'cursor-pointer',
      i === this.activeIndex() && 'bg-neutral-100',
      this.selected()?.value === opt.value ? 'font-medium text-primary-600' : 'text-neutral-700',
      !opt.disabled && i !== this.activeIndex() && 'hover:bg-neutral-50'
    );
  }

  protected toggle(): void {
    this.open() ? this.close() : this.openList();
  }
  private openList(): void {
    this.reposition();
    this.open.set(true);
    this.query.set('');
    this.activeIndex.set(0);
    setTimeout(() => this.search()?.nativeElement.focus(), 0);
  }
  protected close(): void {
    this.open.set(false);
    this.query.set('');
  }
  protected select(opt: JComboboxOption): void {
    if (opt.disabled) return;
    this.value.set(opt.value);
    this.onChange(opt.value);
    this.onTouched();
    this.changed.emit({ value: opt.value, option: opt });
    this.close();
    this.trigger()?.nativeElement.focus();
  }
  protected onQuery(event: Event): void {
    this.query.set((event.target as HTMLInputElement).value);
    this.activeIndex.set(0);
    this.searchChange.emit(this.query());
  }
  protected onTriggerKeydown(event: KeyboardEvent): void {
    if (!this.open() && (event.key === 'Enter' || event.key === ' ' || event.key === 'ArrowDown')) {
      event.preventDefault();
      this.openList();
    }
  }
  protected onSearchKeydown(event: KeyboardEvent): void {
    const list = this.filtered();
    if (event.key === 'Escape') {
      this.close();
      this.trigger()?.nativeElement.focus();
    } else if (event.key === 'ArrowDown') {
      event.preventDefault();
      this.activeIndex.update((i) => Math.min(i + 1, list.length - 1));
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      this.activeIndex.update((i) => Math.max(i - 1, 0));
    } else if (event.key === 'Enter' && list[this.activeIndex()]) {
      event.preventDefault();
      this.select(list[this.activeIndex()]);
    }
  }
  protected reposition(): void {
    const el = this.trigger()?.nativeElement;
    if (!el) return;
    const r = el.getBoundingClientRect();
    this.listStyle.set({
      position: 'fixed',
      top: `${r.bottom + 4}px`,
      left: `${r.left}px`,
      width: `${r.width}px`,
      'z-index': '50',
    });
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
