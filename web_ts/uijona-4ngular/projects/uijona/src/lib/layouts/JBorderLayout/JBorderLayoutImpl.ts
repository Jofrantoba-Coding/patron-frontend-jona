import { J_BORDER_LAYOUT_TEMPLATE } from './JBorderLayoutView';
import {
  ChangeDetectionStrategy,
  Component,
  Directive,
  computed,
  contentChild,
  input,
} from '@angular/core';
import { cn } from '../../core/cn';
import type { JStyle } from '../../core/types';
import { JPanel } from '../../atoms/JPanel';

/** Marcadores de región para JBorderLayout. */
@Directive({ selector: '[jNorth]', standalone: true })
export class JNorth {}
@Directive({ selector: '[jSouth]', standalone: true })
export class JSouth {}
@Directive({ selector: '[jEast]', standalone: true })
export class JEast {}
@Directive({ selector: '[jWest]', standalone: true })
export class JWest {}

/**
 * JBorderLayout — distribuye regiones north/south/east/west/center como un border
 * layout. Proyecta cada región con `[jNorth]`, `[jSouth]`, `[jEast]`, `[jWest]`;
 * el contenido por defecto es el centro.
 */
@Component({
  selector: 'j-border-layout',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [JPanel],
  host: { class: 'contents' },
  template: J_BORDER_LAYOUT_TEMPLATE,
})
export class JBorderLayout {
  readonly className = input<string>('');
  readonly style = input<JStyle>(null);
  readonly northClassName = input<string>('');
  readonly southClassName = input<string>('');
  readonly eastClassName = input<string>('');
  readonly westClassName = input<string>('');
  readonly centerClassName = input<string>('');

  protected readonly cn = cn;
  private readonly northRef = contentChild(JNorth);
  private readonly southRef = contentChild(JSouth);
  private readonly eastRef = contentChild(JEast);
  private readonly westRef = contentChild(JWest);

  protected readonly hasNorth = computed(() => !!this.northRef());
  protected readonly hasSouth = computed(() => !!this.southRef());
  protected readonly hasEast = computed(() => !!this.eastRef());
  protected readonly hasWest = computed(() => !!this.westRef());
}
