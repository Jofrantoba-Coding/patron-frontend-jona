import { Directive } from '@angular/core';

/**
 * Marcadores de contenido para los iconos de JTextBox.
 * El consumidor aplica `[jIconLeft]` / `[jIconRight]` al icono proyectado;
 * JTextBox los detecta con `contentChild` para ajustar el padding.
 */
@Directive({ selector: '[jIconLeft]', standalone: true })
export class JIconLeft {}

@Directive({ selector: '[jIconRight]', standalone: true })
export class JIconRight {}
