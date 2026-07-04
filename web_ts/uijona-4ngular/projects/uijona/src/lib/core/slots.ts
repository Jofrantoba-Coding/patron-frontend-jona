import { Directive } from '@angular/core';

/**
 * Marca contenido proyectado como "icono" en componentes que ajustan su layout
 * según haya o no icono (JAlert, etc.). Importa la directiva en el consumidor y
 * colócala en el nodo del icono: `<svg jIcon>…</svg>`.
 */
@Directive({ selector: '[jIcon]', standalone: true })
export class JIconSlot {}
