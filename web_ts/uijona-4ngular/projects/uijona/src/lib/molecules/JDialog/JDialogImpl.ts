import type { JDialogSize, InterJDialog } from './InterJDialog';
import { DOCUMENT } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  type ElementRef,
  computed,
  effect,
  inject,
  input,
  output,
  viewChild,
} from '@angular/core';
import { cn } from '../../core/cn';
import { JFocusTrap } from '../../core/focus';
import {
  SIZE_CLASS,
} from './JDialogStyles';

/**
 * JDialog — modal con backdrop, cierre por Escape/overlay y bloqueo de scroll.
 * Slots: default = contenido, `[jTitleIcon]` = icono de título, `[jFooter]` = pie.
 */
@Component({
  selector: 'j-dialog',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'contents', '(document:keydown.escape)': 'onEscape()' },
  templateUrl: './JDialogView.html',
  styleUrl: './JDialogView.css',
})
export class JDialog {
  readonly open = input.required<boolean>();
  readonly title = input<string>();
  readonly description = input<string>();
  readonly showCloseButton = input<boolean>(true);
  readonly size = input<JDialogSize>('md');
  readonly className = input<string>('');
  readonly titleBarClassName = input<string>('');
  readonly contentClassName = input<string>('');
  readonly footerClassName = input<string>('');

  readonly closed = output<void>();
  readonly cancel = output<void>();
  readonly confirm = output<void>();

  protected readonly cn = cn;
  private readonly document = inject(DOCUMENT);
  private readonly panel = viewChild<ElementRef<HTMLElement>>('panel');
  private readonly trap = new JFocusTrap();

  protected readonly panelClasses = computed(() =>
    cn(
      'relative z-10 w-full rounded-lg bg-white shadow-xl focus:outline-none overflow-hidden',
      'max-h-[calc(100dvh-1rem)] sm:max-h-[calc(100dvh-2rem)] flex flex-col',
      SIZE_CLASS[this.size()],
      this.className()
    )
  );

  constructor() {
    effect(() => {
      const body = this.document.body;
      if (this.open()) body.style.overflow = 'hidden';
      else body.style.overflow = '';
    });

    // El panel solo existe mientras open() es true, asi que se lee el viewChild
    // dentro del efecto: al abrir ya esta renderizado, y al cerrar es undefined.
    effect(() => {
      const panel = this.panel()?.nativeElement;
      if (this.open() && panel) this.trap.activar(panel);
      else if (!this.open()) this.trap.liberar();
    });
  }

  protected onEscape(): void {
    if (this.open()) this.requestClose('escape');
  }

  protected onPanelKeydown(event: KeyboardEvent): void {
    const panel = this.panel()?.nativeElement;
    if (panel) this.trap.alPulsarTecla(event, panel);
  }

  protected requestClose(reason: 'cancel' | 'escape'): void {
    if (reason === 'cancel') this.cancel.emit();
    this.closed.emit();
  }
}
