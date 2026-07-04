import { J_TABS_TEMPLATE_1, J_TABS_TEMPLATE_2, J_TABS_TEMPLATE_3, J_TABS_TEMPLATE_4 } from './JTabsView';
import type { JTabsVariant, JTabsOrientation } from './InterJTabs';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
  model,
  output,
} from '@angular/core';
import { cn } from '../../core/cn';
/**
 * JTabs — navegación por tabs. Raíz que provee estado a JTabsList / JTabsTrigger /
 * JTabsContent (vía inyección de dependencias).
 */
@Component({
  selector: 'j-tabs',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'contents' },
  template: J_TABS_TEMPLATE_1,
})
export class JTabs {
  readonly value = model.required<string>();
  readonly variant = input<JTabsVariant>('pill');
  readonly orientation = input<JTabsOrientation>('horizontal');
  readonly className = input<string>('');

  readonly changed = output<string>();
  readonly tabFocus = output<string>();
  readonly disabledTabClick = output<string>();

  protected readonly classes = computed(() =>
    cn(
      'min-w-0',
      this.orientation() === 'vertical' ? 'flex flex-col gap-4 sm:flex-row' : 'flex flex-col gap-2',
      this.className()
    )
  );

  select(value: string): void {
    this.value.set(value);
    this.changed.emit(value);
  }
}

@Component({
  selector: 'j-tabs-list',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'contents' },
  template: J_TABS_TEMPLATE_2,
})
export class JTabsList {
  protected readonly tabs = inject(JTabs);
  readonly className = input<string>('');
  protected readonly classes = computed(() =>
    cn(
      'flex max-w-full min-w-0',
      this.tabs.orientation() === 'vertical'
        ? 'flex-row overflow-x-auto sm:flex-col sm:overflow-visible'
        : 'flex-row overflow-x-auto',
      this.tabs.variant() === 'pill'
        ? 'gap-1 rounded-md bg-neutral-100 p-1'
        : 'gap-0 border-b border-neutral-200',
      this.className()
    )
  );
}

@Component({
  selector: 'j-tabs-trigger',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'contents' },
  template: J_TABS_TEMPLATE_3,
})
export class JTabsTrigger {
  protected readonly tabs = inject(JTabs);
  readonly value = input.required<string>();
  readonly disabled = input<boolean>(false);
  readonly className = input<string>('');

  protected readonly isActive = computed(() => this.tabs.value() === this.value());

  protected readonly classes = computed(() => {
    const active = this.isActive();
    return cn(
      'inline-flex max-w-full shrink-0 cursor-pointer items-center justify-center gap-1.5 text-sm font-medium transition-all duration-200',
      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500',
      'disabled:pointer-events-none disabled:opacity-50',
      this.tabs.variant() === 'pill'
        ? cn(
            'rounded px-3 py-1.5',
            active ? 'bg-white text-neutral-900 shadow-sm' : 'text-neutral-500 hover:text-neutral-700'
          )
        : cn(
            '-mb-px rounded-none border-b-2 px-4 py-2',
            active
              ? 'border-primary-600 text-primary-600'
              : 'border-transparent text-neutral-500 hover:border-neutral-300 hover:text-neutral-700'
          ),
      this.className()
    );
  });

  protected onClick(): void {
    if (this.disabled()) this.tabs.disabledTabClick.emit(this.value());
    else this.tabs.select(this.value());
  }
}

@Component({
  selector: 'j-tabs-content',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'contents' },
  template: J_TABS_TEMPLATE_4,
})
export class JTabsContent {
  protected readonly tabs = inject(JTabs);
  readonly value = input.required<string>();
  readonly className = input<string>('');
  protected readonly cn = cn;
}
