// JButtonImpl.ts — JONA Implementacion
// Estado, eventos y composicion de clases. La estructura vive en JButtonView.html
// y las clases en JButtonStyles.ts.
import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';
import { cn } from '../../core/cn';
import type { JStyle } from '../../core/types';
import { JSpinner } from '../JSpinner';
import {
  JBUTTON_DEFAULTS,
  type JButtonIconPosition,
  type JButtonSize,
  type JButtonType,
  type JButtonVariant,
} from './InterJButton';
import {
  JBUTTON_BASE_CLASSES,
  JBUTTON_ICON_POSITION_CLASSES,
  JBUTTON_SIZE_CLASSES,
  JBUTTON_VARIANT_CLASSES,
} from './JButtonStyles';

/**
 * JButton — boton con variantes, tamanos, estado de carga y modo enlace.
 *
 * Contenido proyectado:
 *  - default: texto/label del boton
 *  - `[jIcon]`: icono opcional (se reemplaza por un spinner cuando `loading`)
 *
 * Con `href` se renderiza como `<a>` (link con estilo de boton).
 */
@Component({
  selector: 'j-button',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [JSpinner, NgTemplateOutlet],
  host: { class: 'contents' },
  templateUrl: './JButtonView.html',
  styleUrl: './JButtonView.css',
})
export class JButton {
  readonly variant = input<JButtonVariant>(JBUTTON_DEFAULTS.variant);
  readonly size = input<JButtonSize>(JBUTTON_DEFAULTS.size);
  readonly iconPosition = input<JButtonIconPosition>(JBUTTON_DEFAULTS.iconPosition);
  readonly fullWidth = input<boolean>(JBUTTON_DEFAULTS.fullWidth);
  readonly disabled = input<boolean>(false);
  readonly loading = input<boolean>(JBUTTON_DEFAULTS.loading);
  readonly type = input<JButtonType>(JBUTTON_DEFAULTS.type);
  readonly href = input<string>();
  readonly target = input<string>();
  readonly rel = input<string>();
  /** @deprecated sin efecto; el espaciado solo-icono se resuelve en JButtonView.css */
  readonly iconOnly = input<boolean>(false);
  readonly ariaLabel = input<string>();
  readonly className = input<string>('');
  readonly style = input<JStyle>(null);

  readonly clicked = output<MouseEvent>();
  readonly focused = output<FocusEvent>();
  readonly blurred = output<FocusEvent>();
  readonly keydown = output<KeyboardEvent>();

  protected readonly classes = computed(() => {
    const linkDisabled = this.href() && (this.disabled() || this.loading());
    return cn(
      JBUTTON_BASE_CLASSES,
      JBUTTON_VARIANT_CLASSES[this.variant()],
      JBUTTON_SIZE_CLASSES[this.size()],
      JBUTTON_ICON_POSITION_CLASSES[this.iconPosition()],
      this.fullWidth() && 'w-full',
      linkDisabled && 'pointer-events-none opacity-50',
      this.className()
    );
  });
}
