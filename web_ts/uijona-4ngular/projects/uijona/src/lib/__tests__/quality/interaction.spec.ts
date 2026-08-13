/**
 * Design-quality contract: INTERACTION DESIGN
 * Verifica teclado, foco, gestos y bloqueo por estado, y la firma
 * "value-first" de los eventos (patron Observer de JONA).
 *
 * Port de `uijona/src/__tests__/quality/interaction.test.tsx`.
 * Mapeo de nombres React -> Angular (outputs en pasado para no chocar con
 * los eventos nativos del DOM):
 *   onChange -> valueChange (model) | onEnterPress -> enterPress
 *   onClear  -> cleared             | onCheckedChange -> checkedChange / toggled
 *   onClick  -> clicked             | onDismiss -> dismissed | onSearch -> search
 */
import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { describe, expect, it, vi } from 'vitest';
import { JAlert, JButton, JCheckBox, JSearchInput, JSwitch, JTextBox } from '../../../public-api';
import { getLabel, getRole, keyDown, queryLabel, type } from '../../../testing/dom';

@Component({
  standalone: true,
  imports: [JTextBox],
  template: `
    <j-text-box
      [value]="value"
      (valueChange)="onValueChange($event)"
      (enterPress)="onEnterPress($event)"
      (cleared)="onCleared()"
    />
  `,
})
class TextBoxHost {
  value = '';
  onValueChange = vi.fn();
  onEnterPress = vi.fn();
  onCleared = vi.fn();
}

@Component({
  standalone: true,
  imports: [JButton, JSwitch, JCheckBox],
  template: `
    <j-button [disabled]="disabled" [loading]="loading" (clicked)="onClick()">x</j-button>
    <j-switch [disabled]="disabled" [checked]="checked" (toggled)="onToggled($event)" ariaLabel="s" />
    <j-check-box [checked]="boxChecked" (checkedChange)="onCheckedChange($event)" />
  `,
})
class StateHost {
  disabled = false;
  loading = false;
  checked = false;
  boxChecked = false;
  onClick = vi.fn();
  onToggled = vi.fn();
  onCheckedChange = vi.fn();
}

@Component({
  standalone: true,
  imports: [JSearchInput, JAlert],
  template: `
    <j-search-input [value]="term" (search)="onSearch($event)" (cleared)="onClear()" />
    <j-alert [dismissible]="true" (dismissed)="onDismiss()">msg</j-alert>
  `,
})
class SearchHost {
  term = '';
  onSearch = vi.fn();
  onClear = vi.fn();
  onDismiss = vi.fn();
}

function mount<T>(tipo: new () => T, patch: Partial<T> = {}) {
  const fixture = TestBed.createComponent(tipo);
  Object.assign(fixture.componentInstance as object, patch);
  fixture.detectChanges();
  return fixture;
}

describe('Interaction — JTextBox teclado y eventos value-first', () => {
  it('el cambio entrega el valor (equivalente a onChange value-first)', () => {
    const f = mount(TextBoxHost);
    type(getRole(f, 'textbox'), 'hola');
    expect(f.componentInstance.onValueChange).toHaveBeenCalledWith('hola');
  });

  it('Enter dispara enterPress con el valor actual', () => {
    const f = mount(TextBoxHost, { value: 'query' });
    keyDown(getRole(f, 'textbox'), 'Enter');
    expect(f.componentInstance.onEnterPress).toHaveBeenCalledWith(
      expect.objectContaining({ value: 'query' })
    );
  });

  it('Backspace con el valor vacio dispara el gesto de limpiar', () => {
    const f = mount(TextBoxHost, { value: '' });
    keyDown(getRole(f, 'textbox'), 'Backspace');
    expect(f.componentInstance.onCleared).toHaveBeenCalledTimes(1);
  });
});

describe('Interaction — el estado bloquea la interaccion', () => {
  it('JButton disabled no dispara clicked', () => {
    const f = mount(StateHost, { disabled: true });
    getRole(f, 'button').click();
    expect(f.componentInstance.onClick).not.toHaveBeenCalled();
  });

  it('JButton loading deshabilita y no dispara clicked', () => {
    const f = mount(StateHost, { loading: true });
    const btn = getRole(f, 'button') as HTMLButtonElement;
    expect(btn.disabled).toBe(true);
    btn.click();
    expect(f.componentInstance.onClick).not.toHaveBeenCalled();
  });

  it('JSwitch disabled no conmuta', () => {
    const f = mount(StateHost, { disabled: true });
    getRole(f, 'switch').click();
    expect(f.componentInstance.onToggled).not.toHaveBeenCalled();
  });
});

describe('Interaction — los toggles reportan value-first', () => {
  it('JSwitch emite el nuevo estado y aria-checked cambia', () => {
    const f = mount(StateHost);
    const sw = getRole(f, 'switch');
    expect(sw.getAttribute('aria-checked')).toBe('false');
    sw.click();
    f.detectChanges();
    expect(f.componentInstance.onToggled).toHaveBeenCalledWith(
      expect.objectContaining({ checked: true })
    );
    expect(getRole(f, 'switch').getAttribute('aria-checked')).toBe('true');
  });

  it('JCheckBox entrega el booleano primero', () => {
    const f = mount(StateHost);
    getRole(f, 'checkbox').click();
    expect(f.componentInstance.onCheckedChange).toHaveBeenCalledWith(true);
  });
});

describe('Interaction — JSearchInput', () => {
  it('Enter dispara search con el valor', () => {
    const f = mount(SearchHost, { term: 'term' });
    keyDown(getRole(f, 'searchbox'), 'Enter');
    expect(f.componentInstance.onSearch).toHaveBeenCalledWith('term');
  });

  it('el boton de limpiar aparece con valor y dispara cleared', () => {
    const f = mount(SearchHost, { term: 'term' });
    const boton = queryLabel(f, 'Clear search');
    expect(boton, 'el boton de limpiar debe existir cuando hay valor').not.toBeNull();
    boton!.click();
    expect(f.componentInstance.onClear).toHaveBeenCalledTimes(1);
  });
});

describe('Interaction — JAlert descartable', () => {
  it('dispara dismissed al pulsar cerrar', () => {
    const f = mount(SearchHost);
    getLabel(f, 'Cerrar alerta').click();
    expect(f.componentInstance.onDismiss).toHaveBeenCalledTimes(1);
  });
});
