import { J_ICON_TEMPLATE } from './JIconView';
import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import type { JStyle } from '../../core/types';
import { JButton } from '../JButton';
import { JICON_DEFAULTS, type JButtonVariant } from './InterJIcon';

/**
 * JIcon — boton solo-icono. Reutiliza JButton con `size="icon"`. El icono se
 * proyecta como contenido (se reemplaza por un spinner cuando `loading`).
 */
@Component({
  selector: 'j-icon',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [JButton],
  host: { class: 'contents' },
  template: J_ICON_TEMPLATE,
})
export class JIcon {
  readonly label = input.required<string>();
  readonly variant = input<JButtonVariant>(JICON_DEFAULTS.variant);
  readonly loading = input<boolean>(JICON_DEFAULTS.loading);
  readonly disabled = input<boolean>(JICON_DEFAULTS.disabled);
  readonly id = input<string>();
  readonly name = input<string>();
  readonly type = input<'button' | 'submit' | 'reset'>(JICON_DEFAULTS.type);
  readonly className = input<string>('');
  readonly style = input<JStyle>(null);

  readonly clicked = output<MouseEvent>();
  readonly focused = output<FocusEvent>();
  readonly blurred = output<FocusEvent>();
}
