/**
 * Clases de tokens.css. Las Vistas pintan y disponen solo con estas constantes:
 * nunca con colores literales, tokens escritos a mano ni clases en cadenas sueltas.
 * Una misma clase sirve a los dos temas: cambia el token, no la clase.
 */
// Color: roles semánticos.
export const SURFACE = 'ds-surface';
export const SURFACE_RAISED = 'ds-surface-raised';
export const FG = 'ds-fg';
export const FG_MUTED = 'ds-fg-muted';
export const DANGER = 'ds-danger';
export const LINE_STRONG = 'ds-line-strong';
export const FOCUS_RING = 'ds-focus-ring';
/** Fondo primario con su texto: el par on-primary / primary viaja junto. */
export const PRIMARY = 'ds-primary';
export const BACKDROP = 'ds-backdrop';
// Disposición: la escala de espaciado.
export const STACK = 'ds-stack';
export const INLINE = 'ds-inline';
export const PAD = 'ds-pad';
export const TABLE = 'ds-table';
// Tipografía: tamaños de título, independientes del nivel (JHeading).
export const HEADING_XL = 'ds-heading-xl';
export const HEADING_LG = 'ds-heading-lg';
export const HEADING_MD = 'ds-heading-md';
export const HEADING_SM = 'ds-heading-sm';
// Contenido: el enlace se distingue por el subrayado, no solo por el color.
export const LINK = 'ds-link';
/** La imagen nunca desborda su contenedor y conserva la proporción de su width y height. */
export const IMAGE = 'ds-image';

/** Une clases y descarta las vacías: `clases(FG, activo && PRIMARY)`. */
export const clases = (...lista: Array<string | false | undefined>) => lista.filter(Boolean).join(' ');
