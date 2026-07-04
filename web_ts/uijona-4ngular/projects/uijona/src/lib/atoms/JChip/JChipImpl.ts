import { J_CHIP_TEMPLATE } from './JChipView';
import { ChangeDetectionStrategy, Component, computed, input, output, signal } from '@angular/core';
import { cn } from '../../core/cn';
import type { JStyle } from '../../core/types';
import { JCHIP_DEFAULTS, JCHIP_VARIANT_CLASSES, type JChipVariant } from './InterJChip';

/**
 * JChip — chip seleccionable y/o removible. Si `selected` no se define, el chip
 * alterna su seleccion internamente al hacer click.
 */
@Component({
  selector: 'j-chip',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'contents' },
  template: J_CHIP_TEMPLATE,
})
export class JChip {
  readonly variant = input<JChipVariant>(JCHIP_DEFAULTS.variant);
  readonly selected = input<boolean | undefined>(undefined);
  readonly removable = input<boolean>(JCHIP_DEFAULTS.removable);
  readonly id = input<string>();
  readonly className = input<string>('');
  readonly style = input<JStyle>(null);

  readonly clicked = output<MouseEvent>();
  readonly removed = output<void>();

  private readonly internalSelected = signal(false);

  protected readonly effectiveSelected = computed(() =>
    this.selected() ?? this.internalSelected()
  );

  protected readonly classes = computed(() =>
    cn(
      'jchip',
      'inline-flex h-7 items-center gap-1 rounded-full border px-2.5 text-xs font-medium cursor-pointer',
      'data-[jchip-selected=true]:ring-2 data-[jchip-selected=true]:ring-primary-500 data-[jchip-selected=true]:ring-offset-1',
      JCHIP_VARIANT_CLASSES[this.variant()],
      this.className()
    )
  );

  protected onClick(event: MouseEvent): void {
    if (this.selected() === undefined) {
      this.internalSelected.update((s) => !s);
    }
    this.clicked.emit(event);
  }

  protected onRemoveClick(event: MouseEvent): void {
    event.stopPropagation();
    this.removed.emit();
  }
}
