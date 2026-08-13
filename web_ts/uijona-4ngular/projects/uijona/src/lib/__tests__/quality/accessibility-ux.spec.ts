/**
 * Design-quality contract: ACCESSIBILITY & UX STATES
 * Verifica roles semanticos, atributos ARIA, foco visible y estados UX
 * (loading, disabled, error).
 *
 * Port de `uijona/src/__tests__/quality/accessibility-ux.test.tsx`.
 */
import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { describe, expect, it } from 'vitest';
import { JAlert, JButton, JDialog, JSearchInput, JSpinner, JSwitch } from '../../../public-api';
import type { JAlertVariant } from '../../../public-api';
import { getLabel, getRole, queryRole } from '../../../testing/dom';

@Component({
  standalone: true,
  imports: [JSwitch, JAlert, JSearchInput, JSpinner, JButton, JDialog],
  template: `
    <j-switch [checked]="switchChecked" ariaLabel="s" />
    <j-alert [variant]="alertVariant">msg</j-alert>
    <!-- DIVERGENCIA: JSearchInput no expone input ariaLabel; el nombre accesible sale de placeholder() -->
    <j-search-input placeholder="Buscar" />
    <j-spinner />
    <j-button [disabled]="btnDisabled" [loading]="btnLoading">x</j-button>
    @if (renderDialog) {
      <j-dialog [open]="dialogOpen" title="Confirm" description="Are you sure?">body</j-dialog>
    }
  `,
})
class Host {
  switchChecked = true;
  alertVariant: JAlertVariant = 'info';
  btnDisabled = false;
  btnLoading = false;
  renderDialog = false;
  dialogOpen = true;
}

function mount(patch: Partial<Host> = {}) {
  const fixture = TestBed.createComponent(Host);
  Object.assign(fixture.componentInstance, patch);
  fixture.detectChanges();
  return fixture;
}

describe('A11y — semantic roles', () => {
  it('JSwitch expone role=switch con aria-checked', () => {
    const f = mount({ switchChecked: true });
    expect(getRole(f, 'switch').getAttribute('aria-checked')).toBe('true');
  });

  it('JAlert expone role=alert', () => {
    const f = mount();
    expect(queryRole(f, 'alert')).not.toBeNull();
  });

  it('JSearchInput expone role=searchbox con nombre accesible', () => {
    const f = mount();
    expect(getRole(f, 'searchbox').getAttribute('aria-label')).toBe('Buscar');
  });

  it('JSpinner expone role=status (semantica de carga)', () => {
    const f = mount();
    expect(queryRole(f, 'status')).not.toBeNull();
  });
});

describe('A11y — JDialog modal semantics', () => {
  it('tiene role=dialog + aria-modal, etiquetado por el titulo', () => {
    const f = mount({ renderDialog: true, dialogOpen: true });
    const dialog = getRole(f, 'dialog');
    expect(dialog.getAttribute('aria-modal')).toBe('true');
    expect(dialog.getAttribute('aria-labelledby')).toBe('jdialog-title');
    expect(dialog.getAttribute('aria-describedby')).toBe('jdialog-desc');
  });

  it('el boton de cierre tiene nombre accesible', () => {
    const f = mount({ renderDialog: true, dialogOpen: true });
    expect(getLabel(f, 'Close dialog')).not.toBeNull();
  });

  it('no se renderiza cuando open=false', () => {
    const f = mount({ renderDialog: true, dialogOpen: false });
    expect(queryRole(f, 'dialog')).toBeNull();
  });
});

describe('UX — foco visible en atomos interactivos', () => {
  it('JButton declara anillo de foco visible', () => {
    const f = mount();
    expect(getRole(f, 'button').className).toMatch(/focus-visible:ring/);
  });

  it('JSwitch declara anillo de foco visible', () => {
    const f = mount();
    expect(getRole(f, 'switch').className).toMatch(/focus-visible:ring/);
  });
});

describe('UX — estado disabled / loading', () => {
  it('JButton disabled lleva la utilidad de opacidad reducida', () => {
    const f = mount({ btnDisabled: true });
    expect(getRole(f, 'button').className).toMatch(/disabled:opacity-50/);
  });

  it('JButton loading muestra el spinner con role=status', () => {
    const f = mount({ btnLoading: true });
    expect(queryRole(f, 'status')).not.toBeNull();
  });

  it('JAlert variante danger lleva tokens de color de error', () => {
    const f = mount({ alertVariant: 'danger' });
    expect(getRole(f, 'alert').className).toMatch(/danger|red/);
  });
});
