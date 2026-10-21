import type { JOptionPaneVariant, InterJOptionPane } from './InterJOptionPane';
import {
  ChangeDetectionStrategy,
  Component,
  type ElementRef,
  computed,
  effect,
  input,
  output,
  viewChild,
} from '@angular/core';
import { cn } from '../../core/cn';
import { JFocusTrap } from '../../core/focus';
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

  private readonly panel = viewChild<ElementRef<HTMLElement>>('panel');
  private readonly trap = new JFocusTrap();

  constructor() {
    effect(() => {
      const panel = this.panel()?.nativeElement;
      if (this.open() && panel) this.trap.activar(panel);
      else if (!this.open()) this.trap.liberar();
    });
  }

  protected onEscape(): void {
    if (this.open()) this.cancel.emit();
  }

  protected onPanelKeydown(event: KeyboardEvent): void {
    const panel = this.panel()?.nativeElement;
    if (panel) this.trap.alPulsarTecla(event, panel);
  }
}
