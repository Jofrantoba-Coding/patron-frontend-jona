/**
 * Helpers de consulta del DOM para las suites de calidad de diseno.
 *
 * Equivalente minimo de `screen` / `getByRole` de @testing-library, implementado
 * sobre el fixture de TestBed para no anadir dependencias a la libreria.
 *
 * Los overlays (JDialog, JDrawer, JPopover...) se renderizan con `position: fixed`
 * dentro del propio componente, asi que viven en el arbol del fixture. Aun asi las
 * consultas caen a `document.body` como respaldo por si algun componente porta a
 * un contenedor propio en el futuro.
 */
import type { ComponentFixture } from '@angular/core/testing';

export type Fx = ComponentFixture<unknown>;
type Scope = Fx | HTMLElement;

/** Selectores por rol ARIA, incluyendo los roles implicitos del HTML nativo. */
const ROLE_SELECTORS: Record<string, string> = {
  button: 'button, [role="button"]',
  link: 'a[href], [role="link"]',
  textbox:
    '[role="textbox"], textarea, input:not([type]), input[type="text"], input[type="email"], input[type="password"], input[type="tel"], input[type="url"]',
  searchbox: '[role="searchbox"], input[type="search"]',
  switch: '[role="switch"]',
  checkbox: '[role="checkbox"], input[type="checkbox"]',
  radio: '[role="radio"], input[type="radio"]',
  status: '[role="status"], output',
  alert: '[role="alert"]',
  dialog: '[role="dialog"], dialog',
  heading: '[role="heading"], h1, h2, h3, h4, h5, h6',
  list: '[role="list"], ul, ol',
  listitem: '[role="listitem"], li',
  img: '[role="img"], img',
  table: '[role="table"], table',
  tab: '[role="tab"]',
  tabpanel: '[role="tabpanel"]',
  tablist: '[role="tablist"]',
  combobox: '[role="combobox"]',
  option: '[role="option"]',
  progressbar: '[role="progressbar"], progress',
  separator: '[role="separator"], hr',
  navigation: '[role="navigation"], nav',
  banner: '[role="banner"], header',
  contentinfo: '[role="contentinfo"], footer',
};

function scopeEl(scope: Scope): HTMLElement {
  return scope instanceof HTMLElement ? scope : (scope.nativeElement as HTMLElement);
}

function selectorFor(role: string): string {
  return ROLE_SELECTORS[role] ?? `[role="${role}"]`;
}

/** Elemento raiz del fixture. */
export function el(scope: Scope): HTMLElement {
  return scopeEl(scope);
}

/** HTML interno renderizado — para asertar el contrato de clases responsive. */
export function html(scope: Scope): string {
  return scopeEl(scope).innerHTML;
}

/** Nombre accesible aproximado: aria-label, si no el texto visible. */
export function accessibleName(node: HTMLElement): string {
  return (node.getAttribute('aria-label') ?? node.textContent ?? '').trim();
}

export function queryAllRole(scope: Scope, role: string): HTMLElement[] {
  const root = scopeEl(scope);
  const found = Array.from(root.querySelectorAll<HTMLElement>(selectorFor(role)));
  if (found.length > 0) return found;
  return Array.from(document.body.querySelectorAll<HTMLElement>(selectorFor(role)));
}

export function queryRole(scope: Scope, role: string): HTMLElement | null {
  return queryAllRole(scope, role)[0] ?? null;
}

export function getRole(scope: Scope, role: string): HTMLElement {
  const node = queryRole(scope, role);
  if (!node) throw new Error(`No se encontro ningun elemento con rol "${role}"`);
  return node;
}

export function queryRoleByName(scope: Scope, role: string, name: string): HTMLElement | null {
  return queryAllRole(scope, role).find((n) => accessibleName(n) === name) ?? null;
}

export function getRoleByName(scope: Scope, role: string, name: string): HTMLElement {
  const node = queryRoleByName(scope, role, name);
  if (!node) {
    const nombres = queryAllRole(scope, role).map((n) => `"${accessibleName(n)}"`);
    throw new Error(
      `No se encontro rol "${role}" con nombre "${name}". Disponibles: ${nombres.join(', ') || '(ninguno)'}`
    );
  }
  return node;
}

/** Elemento cuyo texto coincide exactamente (el mas profundo si anidan). */
export function queryText(scope: Scope, text: string): HTMLElement | null {
  const root = scopeEl(scope);
  const matches = Array.from(root.querySelectorAll<HTMLElement>('*')).filter(
    (n) => (n.textContent ?? '').trim() === text
  );
  return matches.length > 0 ? matches[matches.length - 1] : null;
}

export function getText(scope: Scope, text: string): HTMLElement {
  const node = queryText(scope, text);
  if (!node) throw new Error(`No se encontro ningun elemento con el texto "${text}"`);
  return node;
}

/** Equivalente de getByLabelText para el caso `aria-label`. */
export function queryLabel(scope: Scope, label: string): HTMLElement | null {
  const root = scopeEl(scope);
  return (
    root.querySelector<HTMLElement>(`[aria-label="${label}"]`) ??
    document.body.querySelector<HTMLElement>(`[aria-label="${label}"]`)
  );
}

export function getLabel(scope: Scope, label: string): HTMLElement {
  const node = queryLabel(scope, label);
  if (!node) throw new Error(`No se encontro ningun elemento con aria-label "${label}"`);
  return node;
}

/** Dispara un evento de teclado nativo (equivalente de fireEvent.keyDown). */
export function keyDown(node: HTMLElement, key: string): void {
  node.dispatchEvent(new KeyboardEvent('keydown', { key, bubbles: true, cancelable: true }));
}

/** Escribe un valor en un input/textarea y notifica el evento `input`. */
export function type(node: HTMLElement, value: string): void {
  const input = node as HTMLInputElement | HTMLTextAreaElement;
  input.value = value;
  input.dispatchEvent(new Event('input', { bubbles: true }));
}
