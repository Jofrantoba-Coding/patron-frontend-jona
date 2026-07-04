import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TestBed } from '@angular/core/testing';
import { describe, expect, it } from 'vitest';
import {
  JAvatar,
  JBadge,
  JButton,
  JCheckBox,
  JComboBox,
  JIconLeft,
  JLabel,
  JPanel,
  JProgress,
  JSwitch,
  JTextBox,
} from '../../public-api';

@Component({
  standalone: true,
  imports: [
    JButton,
    JBadge,
    JLabel,
    JPanel,
    JProgress,
    JAvatar,
    JCheckBox,
    JSwitch,
    JComboBox,
    JTextBox,
    JIconLeft,
    FormsModule,
  ],
  template: `
    <j-button variant="accent" (clicked)="clicks = clicks + 1">
      <svg jIcon viewBox="0 0 24 24"><path d="M0 0h24v24H0z" /></svg>
      Guardar
    </j-button>
    <j-button href="https://example.com" target="_blank">Link</j-button>
    <j-badge variant="destructive">3</j-badge>
    <j-label variant="heading" as="h2">Título</j-label>
    <j-label variant="error">Requerido</j-label>
    <j-progress [value]="40" type="circle" [showLabel]="true" />
    <j-avatar initials="JD" size="lg" />
    <j-panel layout="flow" gap="md"><span>a</span><span>b</span></j-panel>
    <j-check-box label="Acepto" [(ngModel)]="accepted" />
    <j-switch [(ngModel)]="on" />
    <j-combo-box [options]="opts" [(value)]="pais" />
    <j-text-box [(value)]="email"><svg jIconLeft viewBox="0 0 24 24"></svg></j-text-box>
  `,
})
class HostComponent {
  clicks = 0;
  accepted = false;
  on = true;
  pais = 'pe';
  email = '';
  opts = [
    { value: 'pe', label: 'Perú' },
    { value: 'cl', label: 'Chile' },
  ];
}

describe('uijona-4ngular atoms smoke', () => {
  it('renders the full atom set without runtime errors', async () => {
    const fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();
    await fixture.whenStable(); // ngModel aplica su valor inicial de forma asíncrona
    fixture.detectChanges();
    const el: HTMLElement = fixture.nativeElement;

    // JButton renders a <button> and, in href mode, an <a>
    expect(el.querySelector('button.jbutton')).toBeTruthy();
    expect(el.querySelector('a.jbutton')?.getAttribute('rel')).toBe('noopener noreferrer');

    // JBadge
    expect(el.querySelector('.jbadge')?.textContent?.trim()).toBe('3');

    // JLabel polimórfico: heading -> h2, error -> role=alert
    expect(el.querySelector('h2[data-jlabel-variant="heading"]')).toBeTruthy();
    expect(el.querySelector('[data-jlabel-variant="error"]')?.getAttribute('role')).toBe('alert');

    // JProgress circle
    expect(el.querySelector('[data-jprogress-type="circle"] svg')).toBeTruthy();

    // JAvatar initials fallback
    expect(el.querySelector('.javatar')?.textContent?.trim()).toBe('JD');

    // JPanel motor de layout
    expect(el.querySelector('.jpanel[data-jpanel-layout="flow"]')).toBeTruthy();

    // JCheckBox con label
    expect(el.querySelector('input[type="checkbox"].jcheckbox')).toBeTruthy();

    // JSwitch role=switch, checked via ngModel
    const sw = el.querySelector('button[role="switch"]');
    expect(sw?.getAttribute('aria-checked')).toBe('true');

    // JComboBox opciones
    expect(el.querySelectorAll('select.jcombobox option').length).toBe(2);

    // JTextBox con icono izquierdo detectado
    expect(
      el.querySelector('.jtextbox-root[data-jtextbox-has-icon-left="true"]')
    ).toBeTruthy();
  });

  it('JButton click emits through the output', () => {
    const fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();
    const host = fixture.componentInstance;
    const button = fixture.nativeElement.querySelector('button.jbutton') as HTMLButtonElement;
    button.click();
    expect(host.clicks).toBe(1);
  });
});
