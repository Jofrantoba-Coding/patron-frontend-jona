import { J_LABEL_TEMPLATE } from './JLabelView';
import { NgTemplateOutlet } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { cn } from '../../core/cn';
import type { JStyle } from '../../core/types';
import {
  JLABEL_COLOR_CLASSES,
  JLABEL_DEFAULTS,
  JLABEL_SIZE_CLASSES,
  JLABEL_VARIANT_CLASSES,
  JLABEL_VARIANT_DEFAULT_AS,
  JLABEL_VARIANT_DEFAULT_SIZE,
  type JLabelAs,
  type JLabelColor,
  type JLabelSize,
  type JLabelVariant,
} from './InterJLabel';

/**
 * JLabel — texto polimorfico: cuerpo, titulo, etiqueta de formulario, enlace,
 * mensaje de error o descripcion. El elemento se infiere del variant o se fuerza
 * con `as`. Contenido por proyeccion o por el input `message` (compat).
 */
@Component({
  selector: 'j-label',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgTemplateOutlet],
  host: { class: 'contents' },
  template: J_LABEL_TEMPLATE,
})
export class JLabel {
  readonly as = input<JLabelAs>();
  readonly variant = input<JLabelVariant>(JLABEL_DEFAULTS.variant);
  readonly size = input<JLabelSize>();
  readonly color = input<JLabelColor>(JLABEL_DEFAULTS.color);
  readonly truncate = input<boolean>(JLABEL_DEFAULTS.truncate);
  readonly htmlFor = input<string>();
  readonly required = input<boolean>(JLABEL_DEFAULTS.required);
  readonly href = input<string>();
  readonly target = input<string>();
  readonly rel = input<string>();
  readonly message = input<string>('');
  readonly disabled = input<boolean>(JLABEL_DEFAULTS.disabled);
  readonly className = input<string>('');
  readonly style = input<JStyle>(null);

  protected readonly resolvedAs = computed<JLabelAs>(
    () => this.as() ?? JLABEL_VARIANT_DEFAULT_AS[this.variant()]
  );

  protected readonly resolvedRel = computed(() =>
    this.target() === '_blank' ? (this.rel() ?? 'noopener noreferrer') : (this.rel() ?? null)
  );

  protected readonly showRequired = computed(
    () => (this.resolvedAs() === 'label' || this.variant() === 'label') && this.required()
  );

  protected readonly classes = computed(() => {
    const variant = this.variant();
    const resolvedSize = this.size() ?? JLABEL_VARIANT_DEFAULT_SIZE[variant];
    const isLink = this.resolvedAs() === 'a';
    const hideWhenEmpty = variant === 'error' || variant === 'description';
    return cn(
      JLABEL_VARIANT_CLASSES[variant],
      resolvedSize && JLABEL_SIZE_CLASSES[resolvedSize],
      this.color() !== 'default' && JLABEL_COLOR_CLASSES[this.color()],
      this.truncate() && 'truncate',
      this.disabled() && 'opacity-50',
      isLink && this.disabled() && 'pointer-events-none',
      hideWhenEmpty && 'empty:hidden',
      this.className()
    );
  });

  protected onLinkClick(event: MouseEvent): void {
    if (this.disabled()) {
      event.preventDefault();
    }
  }
}
