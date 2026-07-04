import { J_TOAST_TEMPLATE } from './JToastView';
import type { JToastVariant, JToastPosition, InterJToast } from './InterJToast';
import { JTOAST_POSITION_DEFAULT } from './InterJToast';
import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  OnInit,
  computed,
  inject,
  input,
  output,
} from '@angular/core';
import { cn } from '../../core/cn';

const VARIANT_CLASSES: Record<JToastVariant, string> = {
  default: 'bg-neutral-900 text-white',
  success: 'bg-success-600 text-white',
  warning: 'bg-warning-500 text-white',
  danger: 'bg-danger-500 text-white',
};

/**
 * JToast — unidad visual de notificación con auto-cierre por `duration`.
 */
@Component({
  selector: 'j-toast',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'contents' },
  template: J_TOAST_TEMPLATE,
})
export class JToast implements OnInit {
  readonly id = input.required<string>();
  readonly message = input.required<string>();
  readonly title = input<string>();
  readonly variant = input<JToastVariant>('default');
  readonly duration = input<number>(4000);
  readonly className = input<string>('');

  readonly dismiss = output<string>();

  private readonly destroyRef = inject(DestroyRef);

  protected readonly classes = computed(() =>
    cn(
      'flex w-full min-w-0 max-w-sm items-start gap-3 rounded-md px-4 py-3 shadow-lg sm:min-w-[240px]',
      VARIANT_CLASSES[this.variant()],
      this.className()
    )
  );

  ngOnInit(): void {
    const d = this.duration();
    if (d) {
      const timer = setTimeout(() => this.dismiss.emit(this.id()), d);
      this.destroyRef.onDestroy(() => clearTimeout(timer));
    }
  }
}
