import { J_OPTION_PANE_TEMPLATE } from './JOptionPaneView';
import type { JOptionPaneVariant, InterJOptionPane } from './InterJOptionPane';
import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';
import { cn } from '../../core/cn';
import { JButton, type JButtonVariant } from '../../atoms/JButton';

const ICON_BG: Record<JOptionPaneVariant, string> = {
  danger: 'bg-danger-50',
  warning: 'bg-yellow-50',
  info: 'bg-primary-50',
};

const ICON_COLOR: Record<JOptionPaneVariant, string> = {
  danger: 'text-danger-500',
  warning: 'text-yellow-500',
  info: 'text-primary-500',
};

const CONFIRM_VARIANT: Record<JOptionPaneVariant, JButtonVariant> = {
  danger: 'destructive',
  warning: 'default',
  info: 'default',
};

const ICON_PATH: Record<JOptionPaneVariant, string> = {
  danger: 'M12 9v4m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z',
  warning: 'M12 8v4m0 4h.01M21 12A9 9 0 113 12a9 9 0 0118 0z',
  info: 'M13 16h-1v-4h-1m1-4h.01M21 12A9 9 0 113 12a9 9 0 0118 0z',
};

/**
 * JOptionPane — diálogo de confirmación (alertdialog) con variante semántica.
 */
@Component({
  selector: 'j-option-pane',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [JButton],
  host: { class: 'contents', '(document:keydown.escape)': 'onEscape()' },
  template: J_OPTION_PANE_TEMPLATE,
})
export class JOptionPane {
  readonly open = input.required<boolean>();
  readonly title = input.required<string>();
  readonly description = input<string>();
  readonly variant = input<JOptionPaneVariant>('danger');
  readonly confirmLabel = input<string>('Confirmar');
  readonly cancelLabel = input<string>('Cancelar');
  readonly isLoading = input<boolean>(false);

  readonly confirm = output<void>();
  readonly cancel = output<void>();

  protected readonly cn = cn;
  protected readonly iconBg = computed(() => ICON_BG[this.variant()]);
  protected readonly iconColor = computed(() => ICON_COLOR[this.variant()]);
  protected readonly iconPath = computed(() => ICON_PATH[this.variant()]);
  protected readonly confirmVariant = computed(() => CONFIRM_VARIANT[this.variant()]);

  protected onEscape(): void {
    if (this.open()) this.cancel.emit();
  }
}
