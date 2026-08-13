/**
 * Design-quality contract: MARKETING ORGANISMS (Tailwind autocontenido)
 * JMarketingHero / JMarketingCTA sin depender de CSS de marca externo.
 * Verifica render, interaccion de CTAs y contrato responsive.
 *
 * Port de `uijona/src/__tests__/quality/marketing-organisms.test.tsx`.
 */
import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { describe, expect, it, vi } from 'vitest';
import { JMarketingCTA, JMarketingHero, JVisual } from '../../../public-api';
import type { MarketingHeroCTA } from '../../../public-api';
import { el, getRole, getRoleByName, getText, html, queryText } from '../../../testing/dom';

@Component({
  standalone: true,
  imports: [JMarketingHero, JVisual],
  template: `
    <j-marketing-hero
      [eyebrow]="eyebrow"
      [title]="title"
      [subtitle]="subtitle"
      [ctas]="ctas"
      [className]="cls"
    >
      @if (conVisual) {
        <img jVisual alt="v" />
      }
    </j-marketing-hero>
  `,
})
class HeroHost {
  eyebrow?: string;
  title = 't';
  subtitle?: string;
  ctas: MarketingHeroCTA[] = [];
  cls = '';
  conVisual = false;
}

@Component({
  standalone: true,
  imports: [JMarketingCTA],
  template: `
    <j-marketing-cta
      [heading]="heading"
      [primaryLabel]="primaryLabel"
      [secondaryLabel]="secondaryLabel"
      [secondaryHref]="secondaryHref"
      (primaryClick)="onPrimaryClick()"
    />
  `,
})
class CtaHost {
  heading = 'h';
  primaryLabel = 'Ir';
  secondaryLabel?: string;
  secondaryHref?: string;
  onPrimaryClick = vi.fn();
}

function mount<T>(tipo: new () => T, patch: Partial<T> = {}) {
  const fixture = TestBed.createComponent(tipo);
  Object.assign(fixture.componentInstance as object, patch);
  fixture.detectChanges();
  return fixture;
}

describe('JMarketingHero', () => {
  it('rinde eyebrow, titulo y subtitulo', () => {
    const f = mount(HeroHost, { eyebrow: 'Nuevo', title: 'Vende mas', subtitle: 'Con JONA' });
    expect(getRole(f, 'heading').textContent?.trim()).toBe('Vende mas');
    expect(queryText(f, 'Nuevo')).not.toBeNull();
    expect(queryText(f, 'Con JONA')).not.toBeNull();
  });

  it('un CTA con onClick se rinde como boton y dispara', () => {
    const onClick = vi.fn();
    const f = mount(HeroHost, { ctas: [{ label: 'Empezar', onClick }] });
    getRoleByName(f, 'button', 'Empezar').click();
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('un CTA con href se rinde como enlace', () => {
    const f = mount(HeroHost, { ctas: [{ label: 'Docs', href: '/docs' }] });
    expect(getRoleByName(f, 'link', 'Docs').getAttribute('href')).toBe('/docs');
  });

  it('es responsive: acciones apiladas -> fila en sm:, dos columnas en lg con visual', () => {
    const f = mount(HeroHost, { conVisual: true, ctas: [{ label: 'A' }] });
    expect(html(f)).toContain('flex-col');
    expect(html(f)).toContain('sm:flex-row');
    expect(html(f)).toContain('lg:grid-cols-2');
  });

  it('NO fuerza dos columnas cuando no hay visual', () => {
    const f = mount(HeroHost, { conVisual: false });
    expect(html(f)).not.toContain('lg:grid-cols-2');
  });

  it('fusiona el className del consumidor en la seccion raiz', () => {
    const f = mount(HeroHost, { cls: 'sentinel-hero' });
    expect(el(f).querySelector('section.sentinel-hero')).not.toBeNull();
  });
});

describe('JMarketingCTA', () => {
  it('rinde el encabezado y ambas acciones', () => {
    const f = mount(CtaHost, {
      heading: 'Listo?',
      primaryLabel: 'Crear cuenta',
      secondaryLabel: 'Hablar con ventas',
      secondaryHref: '/sales',
    });
    expect(getText(f, 'Listo?')).not.toBeNull();
    expect(getRoleByName(f, 'button', 'Crear cuenta')).not.toBeNull();
    expect(getRoleByName(f, 'link', 'Hablar con ventas').getAttribute('href')).toBe('/sales');
  });

  it('el click primario dispara', () => {
    const f = mount(CtaHost, { primaryLabel: 'Ir' });
    getRoleByName(f, 'button', 'Ir').click();
    expect(f.componentInstance.onPrimaryClick).toHaveBeenCalledTimes(1);
  });

  it('es responsive: acciones apiladas en movil, fila en sm:', () => {
    const f = mount(CtaHost);
    expect(html(f)).toContain('flex-col');
    expect(html(f)).toContain('sm:flex-row');
  });
});
