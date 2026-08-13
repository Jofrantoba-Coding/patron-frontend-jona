/**
 * Design-quality contract: DETAIL / CONTACT / METRICS ORGANISMS
 * Tailwind autocontenido (sin CSS de marca externo).
 * Verifica render, enlaces/acciones y contrato responsive.
 *
 * Port de `uijona/src/__tests__/quality/detail-contact-organisms.test.tsx`.
 */
import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { describe, expect, it } from 'vitest';
import { JContactMethods, JDetailHero, JMetricsBand, JVisual } from '../../../public-api';
import type { ContactMethodData, MetricItem } from '../../../public-api';
import { el, getRole, getRoleByName, html, queryRoleByName, queryText } from '../../../testing/dom';

@Component({
  standalone: true,
  imports: [JMetricsBand],
  template: `<j-metrics-band [metrics]="metrics" [className]="cls" />`,
})
class MetricsHost {
  metrics: MetricItem[] = [
    { value: '+120', label: 'Clientes' },
    { value: '99.9%', label: 'Uptime' },
  ];
  cls = '';
}

@Component({
  standalone: true,
  imports: [JContactMethods],
  template: `<j-contact-methods [methods]="methods" />`,
})
class ContactHost {
  methods: ContactMethodData[] = [
    {
      icon: 'E',
      label: 'Email',
      description: 'Escribenos',
      href: 'mailto:a@b.com',
      actionLabel: 'Enviar',
      isPrimary: true,
    },
    { icon: 'T', label: 'Telefono', description: 'Llamanos', href: 'tel:+51999' },
  ];
}

@Component({
  standalone: true,
  imports: [JDetailHero, JVisual],
  template: `
    <j-detail-hero
      backHref="/back"
      backLabel="Volver"
      title="Proyecto X"
      outcome="Resultado medible"
      primaryHref="/start"
      primaryLabel="Empezar"
      [secondaryLabel]="secondaryLabel"
      [secondaryHref]="secondaryHref"
    >
      @if (conVisual) {
        <img jVisual alt="v" />
      }
    </j-detail-hero>
  `,
})
class DetailHeroHost {
  secondaryLabel?: string;
  secondaryHref?: string;
  conVisual = false;
}

function mount<T>(tipo: new () => T, patch: Partial<T> = {}) {
  const fixture = TestBed.createComponent(tipo);
  Object.assign(fixture.componentInstance as object, patch);
  fixture.detectChanges();
  return fixture;
}

describe('JMetricsBand', () => {
  it('rinde el valor y la etiqueta de cada metrica', () => {
    const f = mount(MetricsHost);
    expect(queryText(f, '+120')).not.toBeNull();
    expect(queryText(f, 'Uptime')).not.toBeNull();
  });

  it('usa una rejilla responsive auto-fit (sin numero fijo de columnas)', () => {
    const f = mount(MetricsHost);
    expect(html(f)).toContain('auto-fit');
  });

  // DIVERGENCIA: React expone un input `id` que se aplica a la seccion raiz;
  // el port Angular no lo tiene (solo se puede poner el id en el host <j-metrics-band>).
  it('fusiona el className en la seccion raiz', () => {
    const f = mount(MetricsHost, { cls: 'sentinel-mb' });
    expect(el(f).querySelector('section.sentinel-mb')).not.toBeNull();
  });
});

describe('JContactMethods', () => {
  it('rinde cada metodo con su etiqueta y descripcion', () => {
    const f = mount(ContactHost);
    expect(queryText(f, 'Email')).not.toBeNull();
    expect(queryText(f, 'Llamanos')).not.toBeNull();
  });

  it('rinde el boton de accion como enlace con href', () => {
    const f = mount(ContactHost);
    expect(getRoleByName(f, 'link', 'Enviar').getAttribute('href')).toBe('mailto:a@b.com');
  });

  it('usa una rejilla responsive auto-fit', () => {
    const f = mount(ContactHost);
    expect(html(f)).toContain('auto-fit');
  });
});

describe('JDetailHero', () => {
  it('rinde el enlace de vuelta, titulo, resultado y CTA primario', () => {
    const f = mount(DetailHeroHost);
    expect(getRoleByName(f, 'link', 'Volver').getAttribute('href')).toBe('/back');
    expect(getRole(f, 'heading').textContent?.trim()).toBe('Proyecto X');
    expect(queryText(f, 'Resultado medible')).not.toBeNull();
    expect(getRoleByName(f, 'link', 'Empezar').getAttribute('href')).toBe('/start');
  });

  it('rinde el CTA secundario solo cuando hay href y label', () => {
    const soloLabel = mount(DetailHeroHost, { secondaryLabel: 'Demo' });
    expect(queryRoleByName(soloLabel, 'link', 'Demo')).toBeNull();

    // Equivalente del `rerender` de React: se monta de nuevo con ambos valores.
    const conHref = mount(DetailHeroHost, { secondaryLabel: 'Demo', secondaryHref: '/demo' });
    expect(getRoleByName(conHref, 'link', 'Demo').getAttribute('href')).toBe('/demo');
  });

  it('es responsive: apila por defecto, dos columnas en md: solo con visual', () => {
    const conVisual = mount(DetailHeroHost, { conVisual: true });
    expect(html(conVisual)).toContain('md:grid-cols-[1fr_auto]');

    const sinVisual = mount(DetailHeroHost, { conVisual: false });
    expect(html(sinVisual)).not.toContain('md:grid-cols-[1fr_auto]');
  });

  it('las acciones se apilan en movil y pasan a fila en sm:', () => {
    const f = mount(DetailHeroHost);
    expect(html(f)).toContain('flex-col');
    expect(html(f)).toContain('sm:flex-row');
  });
});
