import type { JOptionPaneVariant, InterJOptionPane } from './InterJOptionPane';
import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';
import { cn } from '../../core/cn';
import { JButton, type JButtonVariant } from '../../atoms/JButton';
import {
  CONFIRM_VARIANT,
  ICON_BG,
  ICON_COLOR,
  ICON_PATH,
} from './JOptionPaneStyles';

/**
 * JOptionPane — diálogo de confirmación (alertdialog) con variante semántica.
 */
@Component({
  selector: 'j-option-pane',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [JButton],
  host: { class: 'contents', '(document:keydown.escape)': 'onEscape()' },
  templateUrl: './JOptionPaneView.html',
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
