import { J_LANGUAGE_SWITCHER_TEMPLATE } from './JLanguageSwitcherView';
import type { JLanguageOption, InterJLanguageSwitcher } from './InterJLanguageSwitcher';
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
import { JGlyph } from '../../atoms/JGlyph';
/**
 * JLanguageSwitcher — selector de idioma desplegable con cierre por click-outside
 * y Escape.
 */
@Component({
  selector: 'j-language-switcher',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [JGlyph],
  host: {
    class: 'contents',
    '(document:mousedown)': 'onDocClick($event)',
    '(document:keydown.escape)': 'close()',
  },
  template: J_LANGUAGE_SWITCHER_TEMPLATE,
})
export class JLanguageSwitcher {
  readonly languages = input.required<JLanguageOption[]>();
  readonly value = input.required<string>();
  readonly ariaLabel = input<string>('Cambiar idioma');
  readonly className = input<string>('');

  readonly changed = output<string>();

  protected readonly cn = cn;
  protected readonly open = signal(false);
  private readonly host = inject(ElementRef<HTMLElement>);

  protected readonly current = computed(
    () => this.languages().find((l) => l.code === this.value()) ?? this.languages()[0]
  );

  protected readonly triggerClasses = computed(() =>
    cn(
      'inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-sm font-medium uppercase transition-colors',
      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-1',
      this.open()
        ? 'border-primary-300 bg-primary-50/60 text-neutral-900'
        : 'border-neutral-200 bg-white text-neutral-700 hover:bg-neutral-50'
    )
  );

  protected optionClasses(code: string): string {
    const active = code === this.value();
    return cn(
      'flex w-full items-center justify-between gap-3 rounded-lg px-3 py-2 text-left text-sm font-medium transition-colors',
      active ? 'bg-primary-50 text-primary-700' : 'text-neutral-700 hover:bg-neutral-100'
    );
  }

  protected toggle(): void {
    this.open.update((v) => !v);
  }
  protected close(): void {
    this.open.set(false);
  }
  protected select(code: string): void {
    this.changed.emit(code);
    this.close();
  }
  protected onDocClick(event: MouseEvent): void {
    if (this.open() && !this.host.nativeElement.contains(event.target as Node)) {
      this.close();
    }
  }
}
