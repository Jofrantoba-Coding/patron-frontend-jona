import { J_DROPDOWN_TEMPLATE } from './JDropdownView';
import type { JDropdownItem, JDropdownGroup, InterJDropdown } from './InterJDropdown';
import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  computed,
  inject,
  input,
  output,
  signal,
} from '@angular/core';
import { cn } from '../../core/cn';
import { JSeparator } from '../../atoms/JSeparator';

const VPAD = 8;

/**
 * JDropdown — menú desplegable anclado a un trigger, con click-outside y Escape.
 */
@Component({
  selector: 'j-dropdown',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [JSeparator],
  host: {
    class: 'contents',
    '(document:keydown.escape)': 'close()',
    '(document:mousedown)': 'onDocMouseDown($event)',
    '(window:resize)': 'reposition()',
    '(window:scroll)': 'reposition()',
  },
  template: J_DROPDOWN_TEMPLATE,
})
export class JDropdown {
  readonly groups = input.required<JDropdownGroup[]>();
  readonly align = input<'start' | 'end'>('start');
  readonly className = input<string>('');

  readonly opened = output<void>();
  readonly closed = output<void>();
  readonly itemSelect = output<string>();
  readonly disabledItemClick = output<string>();

  protected readonly cn = cn;
  protected readonly open = signal(false);
  protected readonly menuStyle = signal<Record<string, string>>({});
  private readonly host = inject(ElementRef<HTMLElement>);

  protected itemClasses(item: JDropdownItem): string {
    return cn(
      'flex w-full cursor-pointer items-center gap-2 px-3 py-1.5 text-left text-sm transition-colors duration-150 focus-visible:bg-neutral-100 focus-visible:outline-none',
      item.disabled && 'cursor-not-allowed opacity-50',
      item.variant === 'destructive' ? 'text-danger-500 hover:bg-red-50' : 'text-neutral-700 hover:bg-neutral-100'
    );
  }

  protected toggle(): void {
    if (this.open()) {
      this.close();
    } else {
      this.reposition();
      this.open.set(true);
      this.opened.emit();
    }
  }

  protected close(): void {
    if (this.open()) {
      this.open.set(false);
      this.closed.emit();
    }
  }

  protected reposition(): void {
    const el = this.host.nativeElement.querySelector('.jdropdown-trigger') as HTMLElement | null;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const vw = window.innerWidth;
    const width = Math.min(Math.max(rect.width, 160), vw - VPAD * 2);
    const desiredLeft = this.align() === 'end' ? rect.right - width : rect.left;
    const left = Math.min(Math.max(desiredLeft, VPAD), vw - width - VPAD);
    this.menuStyle.set({
      position: 'fixed',
      top: `${rect.bottom + 4}px`,
      left: `${left}px`,
      width: `${width}px`,
      'z-index': '50',
    });
  }

  protected onItemClick(item: JDropdownItem): void {
    if (item.disabled) {
      this.disabledItemClick.emit(item.label);
      return;
    }
    item.onClick?.();
    this.itemSelect.emit(item.label);
    this.close();
  }

  protected onDocMouseDown(event: MouseEvent): void {
    if (this.open() && !this.host.nativeElement.contains(event.target as Node)) {
      this.close();
    }
  }
}
