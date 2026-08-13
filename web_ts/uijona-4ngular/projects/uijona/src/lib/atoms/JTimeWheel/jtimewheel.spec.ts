/**
 * JTimeWheel — contrato de accesibilidad e interacción.
 *
 * El gesto de rueda no se puede probar en jsdom (no hay layout ni inercia), así
 * que se prueba lo que sí determina si el control es usable: los roles ARIA y
 * el teclado. Que la rueda "se sienta bien" es cosa del navegador; que se pueda
 * operar sin ratón es cosa nuestra.
 */
import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { describe, expect, it } from 'vitest';
import { JTimeWheel } from '../../../public-api';
import { formatHora, parseHora, valoresDe } from './InterJTimeWheel';
import { getRole, queryAllRole } from '../../../testing/dom';

@Component({
  standalone: true,
  imports: [JTimeWheel],
  template: `
    <j-time-wheel
      [value]="hora"
      [showSeconds]="conSegundos"
      [minuteStep]="pasoMinutos"
      (changed)="ultimo = $event"
    />
  `,
})
class Host {
  hora = '08:30';
  conSegundos = false;
  pasoMinutos = 1;
  ultimo = '';
}

function mount(patch: Partial<Host> = {}) {
  const fixture = TestBed.createComponent(Host);
  Object.assign(fixture.componentInstance, patch);
  fixture.detectChanges();
  return fixture;
}

const pulsar = (el: HTMLElement, key: string) =>
  el.dispatchEvent(new KeyboardEvent('keydown', { key, bubbles: true, cancelable: true }));

describe('JTimeWheel — helpers del contrato', () => {
  it('parseHora tolera valores vacíos, incompletos y fuera de rango', () => {
    expect(parseHora(undefined)).toEqual({ hour: 0, minute: 0, second: 0 });
    expect(parseHora('7')).toEqual({ hour: 7, minute: 0, second: 0 });
    expect(parseHora('99:99:99')).toEqual({ hour: 23, minute: 59, second: 59 });
  });

  it('formatHora rellena a dos dígitos y respeta los segundos', () => {
    expect(formatHora({ hour: 8, minute: 5, second: 3 }, false)).toBe('08:05');
    expect(formatHora({ hour: 8, minute: 5, second: 3 }, true)).toBe('08:05:03');
  });

  it('valoresDe aplica el salto de la columna', () => {
    expect(valoresDe('hour', 1)).toHaveLength(24);
    expect(valoresDe('minute', 15)).toEqual([0, 15, 30, 45]);
  });
});

describe('JTimeWheel — accesibilidad', () => {
  it('cada columna es un spinbutton con su rango y valor', () => {
    const f = mount({ hora: '08:30' });
    const cols = queryAllRole(f, 'spinbutton');
    expect(cols).toHaveLength(2);
    expect(cols[0].getAttribute('aria-label')).toBe('Hora');
    expect(cols[0].getAttribute('aria-valuemax')).toBe('23');
    expect(cols[0].getAttribute('aria-valuenow')).toBe('8');
    expect(cols[1].getAttribute('aria-valuenow')).toBe('30');
  });

  it('con segundos aparece una tercera columna', () => {
    const f = mount({ hora: '08:30:15', conSegundos: true });
    const cols = queryAllRole(f, 'spinbutton');
    expect(cols).toHaveLength(3);
    expect(cols[2].getAttribute('aria-label')).toBe('Segundos');
  });

  it('las columnas son alcanzables con el tabulador', () => {
    const f = mount();
    for (const col of queryAllRole(f, 'spinbutton')) {
      expect(col.getAttribute('tabindex')).toBe('0');
    }
  });
});

describe('JTimeWheel — teclado', () => {
  it('las flechas mueven el valor de la columna enfocada', () => {
    const f = mount({ hora: '08:30' });
    const [horas] = queryAllRole(f, 'spinbutton');

    pulsar(horas, 'ArrowDown');
    expect(f.componentInstance.ultimo).toBe('09:30');

    pulsar(horas, 'ArrowUp');
    expect(f.componentInstance.ultimo).toBe('08:30');
  });

  it('Inicio y Fin llevan a los extremos', () => {
    const f = mount({ hora: '08:30' });
    const [horas, minutos] = queryAllRole(f, 'spinbutton');

    pulsar(horas, 'Home');
    expect(f.componentInstance.ultimo).toBe('00:30');

    pulsar(minutos, 'End');
    expect(f.componentInstance.ultimo).toBe('00:59');
  });

  it('no se sale del rango: en 00 la flecha arriba no baja a -1', () => {
    const f = mount({ hora: '00:00' });
    const [horas] = queryAllRole(f, 'spinbutton');
    pulsar(horas, 'ArrowUp');
    expect(f.componentInstance.ultimo === '' || f.componentInstance.ultimo === '00:00').toBe(true);
  });

  it('el salto de minutos manda: con paso 15 la flecha avanza de 0 a 15', () => {
    const f = mount({ hora: '00:00', pasoMinutos: 15 });
    const [, minutos] = queryAllRole(f, 'spinbutton');
    pulsar(minutos, 'ArrowDown');
    expect(f.componentInstance.ultimo).toBe('00:15');
  });

  it('una tecla no contemplada no cambia el valor', () => {
    const f = mount({ hora: '08:30' });
    const [horas] = queryAllRole(f, 'spinbutton');
    pulsar(horas, 'a');
    expect(f.componentInstance.ultimo).toBe('');
  });
});

describe('JTimeWheel — deshabilitado', () => {
  it('no responde al teclado ni es tabulable', () => {
    @Component({
      standalone: true,
      imports: [JTimeWheel],
      template: `<j-time-wheel value="08:30" [disabled]="true" (changed)="ultimo = $event" />`,
    })
    class HostDeshabilitado {
      ultimo = '';
    }
    const f = TestBed.createComponent(HostDeshabilitado);
    f.detectChanges();
    const col = getRole(f, 'spinbutton');
    expect(col.getAttribute('tabindex')).toBe('-1');
    pulsar(col, 'ArrowDown');
    expect(f.componentInstance.ultimo).toBe('');
  });
});
