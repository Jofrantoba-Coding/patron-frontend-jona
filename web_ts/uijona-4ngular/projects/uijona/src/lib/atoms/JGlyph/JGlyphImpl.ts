import { J_GLYPH_TEMPLATE } from './JGlyphView';
import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { cn } from '../../core/cn';
import type { JStyle } from '../../core/types';
import {
  JGLYPH_DEFAULTS,
  JGLYPH_SIZE_CLASSES,
  JGLYPH_TONE_CLASSES,
  type JGlyphSize,
  type JGlyphTone,
} from './InterJGlyph';

/**
 * JGlyph — envoltura SVG para iconos. Las formas (<path>, <circle>, ...) se
 * proyectan como contenido. Usa `svg:`-prefijo en los hijos si los declaras
 * inline en un template Angular.
 */
@Component({
  selector: 'j-glyph',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'contents' },
  template: J_GLYPH_TEMPLATE,
})
export class JGlyph {
  readonly size = input<JGlyphSize | number>(JGLYPH_DEFAULTS.size);
  readonly tone = input<JGlyphTone>(JGLYPH_DEFAULTS.tone);
  readonly viewBox = input<string>(JGLYPH_DEFAULTS.viewBox);
  readonly strokeWidth = input<number>(JGLYPH_DEFAULTS.strokeWidth);
  readonly filled = input<boolean>(JGLYPH_DEFAULTS.filled);
  readonly ariaLabel = input<string>();
  readonly className = input<string>('');
  readonly style = input<JStyle>(null);

  protected readonly numericSize = computed(() => {
    const s = this.size();
    return typeof s === 'number' ? s : null;
  });

  protected readonly classes = computed(() => {
    const s = this.size();
    const isNumeric = typeof s === 'number';
    return cn(
      'jglyph inline-block shrink-0',
      !isNumeric && JGLYPH_SIZE_CLASSES[s as JGlyphSize],
      JGLYPH_TONE_CLASSES[this.tone()],
      this.className()
    );
  });
}
