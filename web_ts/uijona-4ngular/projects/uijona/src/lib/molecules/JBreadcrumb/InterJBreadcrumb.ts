// InterJBreadcrumb.ts — JONA Contrato
// Familia composicional: la miga de pan se arma con sus partes. Todas son
// contenedores de contenido proyectado salvo el enlace, que ademas navega.

/** Contrato comun a todas las piezas de la familia JBreadcrumb. */
export interface InterJBreadcrumbParte {
  className?: string;
}

/** Contrato publico de `<j-breadcrumb>` — rinde un `<nav>` con aria-label. */
export type InterJBreadcrumb = InterJBreadcrumbParte;
/** Contrato publico de `<j-breadcrumb-list>` — rinde un `<ol>`. */
export type InterJBreadcrumbList = InterJBreadcrumbParte;
/** Contrato publico de `<j-breadcrumb-item>` — rinde un `<li>`. */
export type InterJBreadcrumbItem = InterJBreadcrumbParte;
/** Contrato publico de `<j-breadcrumb-page>` — el tramo actual, no navegable. */
export type InterJBreadcrumbPage = InterJBreadcrumbParte;
/** Contrato publico de `<j-breadcrumb-separator>`. */
export type InterJBreadcrumbSeparator = InterJBreadcrumbParte;
/** Contrato publico de `<j-breadcrumb-ellipsis>` — tramos colapsados. */
export type InterJBreadcrumbEllipsis = InterJBreadcrumbParte;

/** Contrato publico de `<j-breadcrumb-link>` — el unico tramo navegable. */
export interface InterJBreadcrumbLink extends InterJBreadcrumbParte {
  /** Sin `href` se comporta como boton y solo emite el evento de navegacion. */
  href?: string;
  /** (navigate) — permite enrutar del lado del consumidor sin recarga. */
  onNavigate?: () => void;
}

/** Orden de composicion previsto de la familia. */
export const JBREADCRUMB_PARTES = [
  'j-breadcrumb',
  'j-breadcrumb-list',
  'j-breadcrumb-item',
  'j-breadcrumb-link',
  'j-breadcrumb-page',
  'j-breadcrumb-separator',
  'j-breadcrumb-ellipsis',
] as const;
