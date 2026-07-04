import { J_MULTI_SELECT_TEMPLATE } from './JMultiSelectView';
import type { JMultiSelectOption, InterJMultiSelect } from './InterJMultiSelect';
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
 * JMultiSelect — selector múltiple con chips, búsqueda y panel flotante.
 * Implementa CVA (valor `string[]`).
 */
@Component({
  selector: 'j-multi-select',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'contents',
    '(document:mousedown)': 'onDocMouseDown($event)',
    '(window:resize)': 'reposition()',
    '(window:scroll)': 'reposition()',
  },
  providers: [
    { provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => JMultiSelect), multi: true },
  ],
  template: J_MULTI_SELECT_TEMPLATE,
})
export class JMultiSelect implements ControlValueAccessor {
  readonly options = input.required<JMultiSelectOption[]>();
  readonly value = model<string[]>([]);
  readonly placeholder = input<string>('Seleccionar...');
  readonly searchPlaceholder = input<string>('Buscar...');
  readonly emptyText = input<string>('Sin resultados');
  readonly maxSelected = input<number>();
  readonly disabledInput = input<boolean>(false, { alias: 'disabled' });
  readonly className = input<string>('');

  readonly changed = output<{ values: string[]; options: JMultiSelectOption[] }>();

  protected readonly cn = cn;
  protected readonly open = signal(false);
  protected readonly query = signal('');
  protected readonly listStyle = signal<Record<string, string>>({});
  private readonly host = inject(ElementRef<HTMLElement>);
  private readonly trigger = viewChild<ElementRef<HTMLElement>>('trigger');
  private readonly search = viewChild<ElementRef<HTMLInputElement>>('search');
  private cvaDisabled = signal(false);

  protected readonly disabled = computed(() => this.disabledInput() || this.cvaDisabled());
  protected readonly selected = computed(() =>
    this.options().filter((o) => this.value().includes(o.value))
  );
  protected readonly filtered = computed(() =>
    this.options().filter((o) => o.label.toLowerCase().includes(this.query().toLowerCase()))
  );
  protected readonly atMax = computed(() => {
    const max = this.maxSelected();
    return max !== undefined && this.selected().length >= max;
  });

  protected isSelected(value: string): boolean {
    return this.value().includes(value);
  }
  protected isDisabled(opt: JMultiSelectOption): boolean {
    return !!opt.disabled || (this.atMax() && !this.isSelected(opt.value));
  }

  protected readonly triggerClasses = computed(() =>
    cn(
      'flex min-h-9 w-full flex-wrap items-center gap-1 rounded-md border border-neutral-300 bg-neutral-50 px-2 py-1 text-sm transition-colors',
      this.open() && 'ring-2 ring-primary-500',
      this.disabled() ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'
    )
  );
  protected optionClasses(opt: JMultiSelectOption): string {
    return cn(
      'flex w-full items-center gap-2 px-3 py-1.5 text-left text-sm transition-colors',
      this.isDisabled(opt) ? 'cursor-not-allowed opacity-40' : 'cursor-pointer hover:bg-neutral-50',
      this.isSelected(opt.value) && 'font-medium text-primary-600'
    );
  }
  protected checkboxClasses(value: string): string {
    return cn(
      'flex h-4 w-4 shrink-0 items-center justify-center rounded border',
      this.isSelected(value) ? 'border-primary-600 bg-primary-600' : 'border-neutral-300 bg-white'
    );
  }

  protected toggle(): void {
    this.open() ? this.close() : this.openList();
  }
  private openList(): void {
    this.reposition();
    this.open.set(true);
    this.query.set('');
    setTimeout(() => this.search()?.nativeElement.focus(), 0);
  }
  protected close(): void {
    this.open.set(false);
    this.query.set('');
  }
  protected toggleOption(opt: JMultiSelectOption): void {
    if (this.isDisabled(opt)) return;
    const next = this.value().includes(opt.value)
      ? this.value().filter((v) => v !== opt.value)
      : [...this.value(), opt.value];
    this.emit(next);
  }
  protected onRemove(event: MouseEvent, value: string): void {
    event.stopPropagation();
    this.emit(this.value().filter((v) => v !== value));
  }
  private emit(next: string[]): void {
    this.value.set(next);
    this.onChange(next);
    this.onTouched();
    this.changed.emit({ values: next, options: this.options().filter((o) => next.includes(o.value)) });
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

  private onChange: (value: string[]) => void = () => {};
  private onTouched: () => void = () => {};
  writeValue(value: string[] | null): void {
    this.value.set(value ?? []);
  }
  registerOnChange(fn: (value: string[]) => void): void {
    this.onChange = fn;
  }
  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }
  setDisabledState(isDisabled: boolean): void {
    this.cvaDisabled.set(isDisabled);
  }
}
