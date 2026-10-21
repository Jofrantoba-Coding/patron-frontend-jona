/**
 * Design-quality contract: FOCUS MANAGEMENT IN OVERLAYS
 *
 * `accessibility-ux.spec.ts` verifica los ATRIBUTOS de un modal (role, aria-modal,
 * nombre accesible). Esta suite verifica su COMPORTAMIENTO, que es lo que decide si
 * un usuario de teclado puede usarlo:
 *
 *  1. Al abrir, el foco entra en la superposicion. Si no, queda en el disparador,
 *     detras del backdrop, y el usuario teclea a ciegas.
 *  2. Al cerrar, el foco vuelve a quien lo tenia. Si no, cae al inicio del documento.
 *  3. Tab cicla dentro de la superposicion. `aria-modal` le dice al lector de pantalla
 *     que lo demas es inerte, pero NO detiene el Tab del navegador.
 *  4. Una superposicion cerrada que sigue en el DOM no debe exponer role=dialog.
 */
import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { describe, expect, it } from 'vitest';
import { JDialog, JDrawer, JOptionPane } from '../../../public-api';

type Kind = 'dialog' | 'optionPane' | 'drawer';

@Component({
  standalone: true,
  imports: [JDialog, JOptionPane, JDrawer],
  template: `
    <button type="button" id="disparador">Abrir</button>

    @if (kind() === 'dialog') {
      <j-dialog [open]="open()" title="Confirmar" description="Seguro?">
        <button type="button" id="primero">uno</button>
        <button type="button" id="ultimo">dos</button>
      </j-dialog>
    }
    @if (kind() === 'optionPane') {
      <j-option-pane [open]="open()" title="Confirmar" description="Seguro?" />
    }
    @if (kind() === 'drawer') {
      <j-drawer [open]="open()" title="Panel" description="Seguro?">
        <button type="button" id="primero">uno</button>
        <button type="button" id="ultimo">dos</button>
      </j-drawer>
    }
  `,
})
class Host {
  readonly kind = signal<Kind>('dialog');
  readonly open = signal(false);
}

function mount(kind: Kind) {
  const fixture = TestBed.createComponent(Host);
  fixture.componentInstance.kind.set(kind);
  fixture.detectChanges();
  return fixture;
}

type Fixture = ReturnType<typeof mount>;

/** Enfoca el disparador y abre la superposicion, como haria un usuario real. */
function abrirDesdeDisparador(f: Fixture): HTMLElement {
  const host = f.nativeElement as HTMLElement;
  const disparador = host.querySelector<HTMLElement>('#disparador')!;
  disparador.focus();
  f.componentInstance.open.set(true);
  f.detectChanges();
  return disparador;
}

function overlay(f: Fixture): HTMLElement {
  const host = f.nativeElement as HTMLElement;
  return host.querySelector<HTMLElement>('[role="dialog"], [role="alertdialog"]')!;
}

function enfocables(panel: HTMLElement): HTMLElement[] {
  return Array.from(
    panel.querySelectorAll<HTMLElement>(
      'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
    )
  );
}

function tab(panel: HTMLElement, shift = false): void {
  panel.dispatchEvent(
    new KeyboardEvent('keydown', { key: 'Tab', shiftKey: shift, bubbles: true, cancelable: true })
  );
}

const SUPERPOSICIONES: Kind[] = ['dialog', 'optionPane', 'drawer'];

describe('A11y — el foco entra al abrir', () => {
  for (const kind of SUPERPOSICIONES) {
    it(`${kind}: al abrir, el foco queda dentro de la superposicion`, () => {
      const f = mount(kind);
      abrirDesdeDisparador(f);

      const panel = overlay(f);
      expect(panel).not.toBeNull();
      expect(panel.contains(f.nativeElement.ownerDocument.activeElement)).toBe(true);
    });
  }
});

describe('A11y — el foco vuelve al cerrar', () => {
  for (const kind of SUPERPOSICIONES) {
    it(`${kind}: al cerrar, el foco vuelve al disparador`, () => {
      const f = mount(kind);
      const disparador = abrirDesdeDisparador(f);

      f.componentInstance.open.set(false);
      f.detectChanges();

      expect(f.nativeElement.ownerDocument.activeElement).toBe(disparador);
    });
  }
});

describe('A11y — Tab queda atrapado dentro de la superposicion', () => {
  it('dialog: Tab desde el ultimo enfocable vuelve al primero', () => {
    const f = mount('dialog');
    abrirDesdeDisparador(f);
    const panel = overlay(f);

    const items = enfocables(panel);
    expect(items.length).toBeGreaterThan(1);

    const ultimo = items[items.length - 1];
    ultimo.focus();
    tab(panel);

    expect(f.nativeElement.ownerDocument.activeElement).toBe(items[0]);
  });

  it('dialog: Shift+Tab desde el primero va al ultimo', () => {
    const f = mount('dialog');
    abrirDesdeDisparador(f);
    const panel = overlay(f);

    const items = enfocables(panel);
    const primero = items[0];
    primero.focus();
    tab(panel, true);

    expect(f.nativeElement.ownerDocument.activeElement).toBe(items[items.length - 1]);
  });

  it('drawer: Tab desde el ultimo enfocable vuelve al primero', () => {
    const f = mount('drawer');
    abrirDesdeDisparador(f);
    const panel = overlay(f);

    const items = enfocables(panel);
    expect(items.length).toBeGreaterThan(1);

    items[items.length - 1].focus();
    tab(panel);

    expect(f.nativeElement.ownerDocument.activeElement).toBe(items[0]);
  });
});

describe('A11y — una superposicion cerrada no es alcanzable', () => {
  it('drawer: cerrado no expone role=dialog (sigue en el DOM por la transicion)', () => {
    const f = mount('drawer');
    const host = f.nativeElement as HTMLElement;

    expect(host.querySelector('[role="dialog"]')).toBeNull();
  });
});
