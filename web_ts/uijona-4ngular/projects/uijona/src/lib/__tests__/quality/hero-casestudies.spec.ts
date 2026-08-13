/**
 * Design-quality contract: JHeroDynamic + JCaseStudies
 * Verifica render, rotacion del titular, interaccion de CTAs y contrato responsive.
 *
 * Port de `uijona/src/__tests__/quality/hero-casestudies.test.tsx`.
 */
import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { JCaseStudies, JHeroDynamic, JVisual } from '../../../public-api';
import type { CaseStudyItem, HeroDynamicCTA } from '../../../public-api';
import { el, getRole, getRoleByName, html, queryText } from '../../../testing/dom';

@Component({
  standalone: true,
  imports: [JHeroDynamic, JVisual],
  template: `
    <j-hero-dynamic
      [titlePrefix]="titlePrefix"
      [rotatingWords]="rotatingWords"
      [ctas]="ctas"
      [intervalMs]="intervalMs"
    >
      @if (conVisual) {
        <img jVisual alt="v" />
      }
    </j-hero-dynamic>
  `,
})
class HeroHost {
  titlePrefix = 'Construimos';
  rotatingWords: string[] = ['software a medida', 'arquitectura cloud', 'IA aplicada'];
  ctas: HeroDynamicCTA[] = [];
  intervalMs = 3000;
  conVisual = false;
}

@Component({
  standalone: true,
  imports: [JCaseStudies],
  template: `<j-case-studies heading="Casos" [items]="items" />`,
})
class CasesHost {
  items: CaseStudyItem[] = [
    {
      sector: 'Retail',
      title: 'ERP SUNAT',
      outcome: 'Todo en un sistema',
      metrics: [{ value: '-40%', label: 'cierre contable' }],
      tags: ['ERP', 'Cloud'],
      href: '#',
    },
    { sector: 'Fintech', title: 'API Zero Trust', outcome: 'APIs gobernadas' },
  ];
}

function mount<T>(tipo: new () => T, patch: Partial<T> = {}) {
  const fixture = TestBed.createComponent(tipo);
  Object.assign(fixture.componentInstance as object, patch);
  fixture.detectChanges();
  return fixture;
}

afterEach(() => {
  vi.useRealTimers();
});

describe('JHeroDynamic', () => {
  const palabras = ['software a medida', 'arquitectura cloud', 'IA aplicada'];

  it('rinde el prefijo y la primera palabra rotatoria', () => {
    const f = mount(HeroHost);
    expect(getRole(f, 'heading').textContent).toContain('Construimos');
    expect(queryText(f, 'software a medida')).not.toBeNull();
  });

  it('rota la palabra en el intervalo configurado', () => {
    vi.useFakeTimers();
    const f = mount(HeroHost, { rotatingWords: palabras, intervalMs: 1000 });
    expect(queryText(f, 'software a medida')).not.toBeNull();

    vi.advanceTimersByTime(1000);
    f.detectChanges();
    expect(queryText(f, 'arquitectura cloud')).not.toBeNull();

    vi.advanceTimersByTime(2000);
    f.detectChanges();
    expect(queryText(f, 'software a medida')).not.toBeNull();
  });

  it('no rota con una sola palabra', () => {
    vi.useFakeTimers();
    const f = mount(HeroHost, { rotatingWords: ['tecnologia'], intervalMs: 500 });
    vi.advanceTimersByTime(2000);
    f.detectChanges();
    expect(queryText(f, 'tecnologia')).not.toBeNull();
  });

  it('la palabra rotatoria vive en una region aria-live', () => {
    const f = mount(HeroHost);
    expect(el(f).querySelector('[aria-live="polite"]')).not.toBeNull();
  });

  it('el CTA con onClick dispara y el que tiene href se rinde como enlace', () => {
    const onClick = vi.fn();
    const f = mount(HeroHost, {
      ctas: [
        { label: 'Empezar', onClick },
        { label: 'Docs', href: '/docs', variant: 'outline' },
      ],
    });
    getRoleByName(f, 'button', 'Empezar').click();
    expect(onClick).toHaveBeenCalledTimes(1);
    expect(getRoleByName(f, 'link', 'Docs').getAttribute('href')).toBe('/docs');
  });

  it('es responsive: dos columnas en lg solo con visual', () => {
    const conVisual = mount(HeroHost, { conVisual: true });
    expect(html(conVisual)).toContain('lg:grid-cols-2');

    const sinVisual = mount(HeroHost, { conVisual: false });
    expect(html(sinVisual)).not.toContain('lg:grid-cols-2');
  });
});

describe('JCaseStudies', () => {
  it('rinde el encabezado y el titulo de cada caso', () => {
    const f = mount(CasesHost);
    expect(queryText(f, 'Casos')).not.toBeNull();
    expect(queryText(f, 'ERP SUNAT')).not.toBeNull();
    expect(queryText(f, 'API Zero Trust')).not.toBeNull();
  });

  it('rinde metricas, etiquetas y enlace cuando se proporcionan', () => {
    const f = mount(CasesHost);
    expect(queryText(f, '-40%')).not.toBeNull();
    expect(queryText(f, 'ERP')).not.toBeNull();
    const enlace = el(f).querySelector<HTMLAnchorElement>('a[href="#"]');
    expect(enlace).not.toBeNull();
    expect(enlace!.textContent).toContain('Ver caso');
  });

  it('usa una rejilla responsive auto-fit', () => {
    const f = mount(CasesHost);
    expect(html(f)).toContain('auto-fit');
  });
});
