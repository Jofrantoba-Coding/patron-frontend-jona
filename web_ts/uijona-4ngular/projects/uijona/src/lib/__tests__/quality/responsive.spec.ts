/**
 * Design-quality contract: RESPONSIVE DESIGN
 * jsdom no calcula layout ni media queries, asi que verificamos el
 * CONTRATO responsive: presencia/ausencia de utilidades de breakpoint
 * Tailwind (sm:/lg:) segun la variante, y adaptacion por input.
 *
 * Port de `uijona/src/__tests__/quality/responsive.test.tsx`.
 */
import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { describe, expect, it } from 'vitest';
import {
  JCard,
  JCardHeader,
  JDialog,
  JDrawer,
  JFormField,
  JSidebarLayout,
  JTabs,
  JTabsContent,
  JTabsList,
  JTabsTrigger,
} from '../../../public-api';
import type {
  JDialogSize,
  JDrawerSide,
  JDrawerSize,
  JFormFieldOrientation,
  JTabsOrientation,
  SidebarNavGroup,
} from '../../../public-api';
import { getRole, html } from '../../../testing/dom';

@Component({
  standalone: true,
  imports: [JTabs, JTabsList, JTabsTrigger, JTabsContent],
  template: `
    <j-tabs [value]="tab" [orientation]="orientation">
      <j-tabs-list><j-tabs-trigger value="a">A</j-tabs-trigger></j-tabs-list>
      <j-tabs-content value="a"><span>c</span></j-tabs-content>
    </j-tabs>
  `,
})
class TabsHost {
  tab = 'a';
  orientation: JTabsOrientation = 'horizontal';
}

@Component({
  standalone: true,
  imports: [JFormField],
  template: `<j-form-field id="email" label="Email" [orientation]="orientation" />`,
})
class FormFieldHost {
  orientation: JFormFieldOrientation = 'vertical';
}

@Component({
  standalone: true,
  imports: [JCard, JCardHeader],
  template: `<j-card><j-card-header>title</j-card-header></j-card>`,
})
class CardHost {}

@Component({
  standalone: true,
  imports: [JSidebarLayout],
  template: `<j-sidebar-layout [nav]="nav">content</j-sidebar-layout>`,
})
class SidebarHost {
  nav: SidebarNavGroup[] = [{ items: [{ key: 'a', label: 'A' }] }];
}

@Component({
  standalone: true,
  imports: [JDrawer],
  template: `<j-drawer [open]="true" [side]="side" [size]="size">body</j-drawer>`,
})
class DrawerHost {
  side: JDrawerSide = 'right';
  size: JDrawerSize = 'md';
}

@Component({
  standalone: true,
  imports: [JDialog],
  template: `<j-dialog [open]="true" [size]="size" title="t">body</j-dialog>`,
})
class DialogHost {
  size: JDialogSize = 'md';
}

function mount<T>(tipo: new () => T, patch: Partial<T> = {}) {
  const fixture = TestBed.createComponent(tipo);
  Object.assign(fixture.componentInstance as object, patch);
  fixture.detectChanges();
  return fixture;
}

describe('Responsive — la orientacion de JTabs se adapta en sm:', () => {
  it('vertical apila en movil y pasa a fila en sm:', () => {
    const f = mount(TabsHost, { orientation: 'vertical' });
    expect(html(f)).toContain('flex-col');
    expect(html(f)).toContain('sm:flex-row');
  });

  it('horizontal NO cambia a sm:flex-row', () => {
    const f = mount(TabsHost, { orientation: 'horizontal' });
    expect(html(f)).not.toContain('sm:flex-row');
  });
});

describe('Responsive — JFormField horizontal colapsa en movil', () => {
  it('la orientacion horizontal expone sm:flex-row', () => {
    const f = mount(FormFieldHost, { orientation: 'horizontal' });
    expect(html(f)).toContain('sm:flex-row');
  });

  it('la orientacion vertical se mantiene apilada (sin sm:flex-row)', () => {
    const f = mount(FormFieldHost, { orientation: 'vertical' });
    expect(html(f)).not.toContain('sm:flex-row');
  });
});

describe('Responsive — el padding de JCard escala en sm:', () => {
  it('la cabecera usa padding responsive p-4 -> sm:p-6', () => {
    const f = mount(CardHost);
    expect(html(f)).toContain('sm:p-6');
  });
});

describe('Responsive — JSidebarLayout movil/escritorio', () => {
  it('el panel es off-canvas en movil y estatico en lg:', () => {
    const f = mount(SidebarHost);
    expect(html(f)).toContain('lg:static');
    expect(html(f)).toContain('lg:hidden');
  });
});

describe('Responsive — JDrawer nunca excede el viewport', () => {
  it.each(['sm', 'md', 'lg'] as const)('horizontal size=%s acota el ancho a 85vw', (size) => {
    const f = mount(DrawerHost, { side: 'right', size });
    expect(getRole(f, 'dialog').className).toContain('max-w-[85vw]');
  });

  it('vertical (bottom) acota la altura a 85vh', () => {
    const f = mount(DrawerHost, { side: 'bottom', size: 'md' });
    expect(getRole(f, 'dialog').className).toContain('max-h-[85vh]');
  });
});

describe('Responsive — el ancho de JDialog escala con size', () => {
  it.each([
    ['sm', 'max-w-sm'],
    ['md', 'max-w-md'],
    ['lg', 'max-w-lg'],
    ['xl', 'max-w-xl'],
  ] as const)('size=%s aplica %s y no desborda el alto del viewport', (size, cls) => {
    const f = mount(DialogHost, { size });
    const dialog = getRole(f, 'dialog');
    expect(dialog.className).toContain(cls);
    expect(dialog.className).toMatch(/max-h-\[calc\(100dvh/);
  });
});
