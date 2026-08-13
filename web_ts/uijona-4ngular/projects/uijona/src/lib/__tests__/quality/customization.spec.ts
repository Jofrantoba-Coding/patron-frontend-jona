/**
 * Design-quality contract: CUSTOMIZATION
 * Verifica que los componentes sean personalizables de forma predecible:
 *  - aceptan y renderizan `className` en su nodo raiz
 *  - aceptan `style` inline
 *  - `cn()` (twMerge) permite que la clase del consumidor GANE sobre el default
 *
 * Port de `uijona/src/__tests__/quality/customization.test.tsx`.
 */
import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { describe, expect, it } from 'vitest';
import { JAlert, JBadge, JButton, JCheckBox, JSwitch, JTextBox } from '../../../public-api';
import { el, getRole } from '../../../testing/dom';

const SENTINEL = 'sentinel-custom-xyz';

@Component({
  standalone: true,
  imports: [JButton, JBadge, JTextBox, JSwitch, JCheckBox, JAlert],
  template: `
    <j-button [className]="cls">x</j-button>
    <j-badge [className]="cls">x</j-badge>
    <j-text-box [className]="cls" />
    <j-switch [className]="cls" ariaLabel="s" />
    <j-check-box [className]="cls" />
    <j-alert [className]="cls">x</j-alert>
  `,
})
class PassthroughHost {
  cls = SENTINEL;
}

@Component({
  standalone: true,
  imports: [JButton, JSwitch],
  template: `
    <j-button [style]="btnStyle">x</j-button>
    <j-switch [style]="switchStyle" ariaLabel="s" />
  `,
})
class StyleHost {
  btnStyle: Record<string, string> = { 'margin-top': '13px' };
  switchStyle: Record<string, string> = { opacity: '0.3' };
}

@Component({
  standalone: true,
  imports: [JButton, JSwitch],
  template: `
    <j-button className="bg-red-500">x</j-button>
    <j-switch className="bg-red-500" ariaLabel="s" />
  `,
})
class MergeHost {}

describe('Customization — className llega al DOM', () => {
  const componentes = ['JButton', 'JBadge', 'JTextBox', 'JSwitch', 'JCheckBox', 'JAlert'];

  it('los 6 componentes rinden el className del consumidor', () => {
    const fixture = TestBed.createComponent(PassthroughHost);
    fixture.detectChanges();
    const encontrados = el(fixture).querySelectorAll(`.${SENTINEL}`).length;
    expect(
      encontrados,
      `se esperaban ${componentes.length} nodos con la clase del consumidor (${componentes.join(', ')})`
    ).toBe(componentes.length);
  });
});

describe('Customization — style inline', () => {
  it('JButton aplica el estilo inline', () => {
    const fixture = TestBed.createComponent(StyleHost);
    fixture.detectChanges();
    expect(getRole(fixture, 'button').style.marginTop).toBe('13px');
  });

  it('JSwitch aplica el estilo inline', () => {
    const fixture = TestBed.createComponent(StyleHost);
    fixture.detectChanges();
    expect(getRole(fixture, 'switch').style.opacity).toBe('0.3');
  });
});

describe('Customization — twMerge: la clase del consumidor gana sobre el default', () => {
  it('JButton: el override de bg reemplaza a bg-primary-600', () => {
    const fixture = TestBed.createComponent(MergeHost);
    fixture.detectChanges();
    const btn = getRole(fixture, 'button');
    expect(btn.className).toContain('bg-red-500');
    expect(btn.className).not.toContain('bg-primary-600');
  });

  it('JSwitch: el override de bg reemplaza a bg-neutral-300 (estado off)', () => {
    const fixture = TestBed.createComponent(MergeHost);
    fixture.detectChanges();
    const sw = getRole(fixture, 'switch');
    expect(sw.className).toContain('bg-red-500');
    expect(sw.className).not.toContain('bg-neutral-300');
  });
});
