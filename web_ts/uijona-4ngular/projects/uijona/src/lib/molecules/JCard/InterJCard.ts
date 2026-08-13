// InterJCard.ts — JONA Contrato
// Familia composicional: la tarjeta se arma con sus partes, al estilo de los
// componentes compuestos. Todas las piezas son contenedores de contenido
// proyectado; su unica configuracion es el `className` del consumidor.
import type { JStyle } from '../../core/types';

/** Contrato comun a todas las piezas de la familia JCard. */
export interface InterJCardParte {
  className?: string;
}

/** Contrato publico de `<j-card>` — la raiz de la familia. */
export interface InterJCard extends InterJCardParte {
  style?: JStyle;
}

/** Contrato publico de `<j-card-header>`. */
export type InterJCardHeader = InterJCardParte;
/** Contrato publico de `<j-card-title>` — rinde un `<h3>`. */
export type InterJCardTitle = InterJCardParte;
/** Contrato publico de `<j-card-description>` — rinde un `<p>`. */
export type InterJCardDescription = InterJCardParte;
/** Contrato publico de `<j-card-content>`. */
export type InterJCardContent = InterJCardParte;
/** Contrato publico de `<j-card-footer>`. */
export type InterJCardFooter = InterJCardParte;

/** Orden de composicion previsto de la familia. */
export const JCARD_PARTES = [
  'j-card',
  'j-card-header',
  'j-card-title',
  'j-card-description',
  'j-card-content',
  'j-card-footer',
] as const;
