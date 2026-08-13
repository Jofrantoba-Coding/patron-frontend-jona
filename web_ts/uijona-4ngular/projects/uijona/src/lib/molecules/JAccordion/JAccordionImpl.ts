import type { JAccordionSize, JAccordionVariant, JAccordionItem, InterJAccordion } from './InterJAccordion';
import { ChangeDetectionStrategy, Component, computed, input, output, signal } from '@angular/core';
import { cn } from '../../core/cn';
import type { JStyle } from '../../core/types';
import {
  CONTAINER_VARIANT,
  CONTENT_SIZE,
  ITEM_VARIANT,
  TRIGGER_SIZE,
} from './JAccordionStyles';

function toArray(value: string | string[] | undefined): string[] {
  if (!value) return [];
  return Array.isArray(value) ? value : [value];
}

/**
 * JAccordion — secciones expandibles (single o multiple) con animación suave.
 */
@Component({
  selector: 'j-accordion',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'contents' },
  templateUrl: './JAccordionView.html',
})
export class JAccordion {
  readonly items = input.required<JAccordionItem[]>();
  readonly value = input<string | string[]>();
  readonly multiple = input<boolean>(false);
  readonly variant = input<JAccordionVariant>('default');
  readonly size = input<JAccordionSize>('md');
  readonly className = input<string>('');
  readonly style = input<JStyle>(null);

  readonly valueChange = output<string | string[]>();

  protected readonly cn = cn;
  private readonly internal = signal<string[]>([]);

  private readonly openValues = computed(() =>
    this.value() !== undefined ? toArray(this.value()) : this.internal()
  );

  protected isOpen(v: string): boolean {
    return this.openValues().includes(v);
  }

  protected toggle(item: JAccordionItem): void {
    if (item.disabled) return;
    const open = this.openValues();
    const isOpen = open.includes(item.value);
    const next = this.multiple()
      ? isOpen
        ? open.filter((v) => v !== item.value)
        : [...open, item.value]
      : isOpen
        ? []
        : [item.value];
    if (this.value() === undefined) this.internal.set(next);
    this.valueChange.emit(this.multiple() ? next : (next[0] ?? ''));
  }

  protected readonly containerClasses = computed(() =>
    cn(CONTAINER_VARIANT[this.variant()], this.className())
  );
  protected readonly itemClass = computed(() => ITEM_VARIANT[this.variant()]);
  protected readonly triggerClass = computed(() =>
    cn(
      'flex w-full items-center justify-between gap-3 text-left font-medium text-neutral-900',
      'transition-colors hover:bg-neutral-50',
      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-primary-500',
      'disabled:cursor-not-allowed disabled:opacity-50',
      TRIGGER_SIZE[this.size()]
    )
  );
  protected readonly contentClass = computed(() =>
    cn('text-neutral-600', CONTENT_SIZE[this.size()])
  );
}
