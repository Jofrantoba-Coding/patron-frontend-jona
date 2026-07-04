import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { describe, expect, it } from 'vitest';
import { JButton, JCard, JCardContent, JCardHeader, JCardTitle } from 'uijona-4ngular';

@Component({
  standalone: true,
  imports: [JCard, JCardHeader, JCardTitle, JCardContent, JButton],
  template: `
    <j-card>
      <j-card-header><j-card-title>Hola</j-card-title></j-card-header>
      <j-card-content>
        <j-button variant="accent">Aceptar</j-button>
      </j-card-content>
    </j-card>
  `,
})
class Host {}

describe('uijona-4ngular consumido desde la app (sin doble Angular)', () => {
  it('renderiza JCard/JButton sin NG0203', () => {
    const fixture = TestBed.createComponent(Host);
    fixture.detectChanges();
    const el: HTMLElement = fixture.nativeElement;
    expect(el.querySelector('.jbutton')).toBeTruthy();
    expect(el.textContent).toContain('Hola');
    expect(el.textContent).toContain('Aceptar');
  });
});
