/**
 * Design-quality contract: CONTENT ORGANISMS/MOLECULES (Tailwind autocontenido)
 * JDetailCTA, JContactSteps(+JNumberedStep), JFaqItem, JRelatedItem,
 * JSiteFooter, JMetricCard, JSectionHeading — sin CSS de marca externo.
 *
 * Port de `uijona/src/__tests__/quality/content-organisms.test.tsx`.
 */
import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { describe, expect, it } from 'vitest';
import {
  JContactSteps,
  JDetailCTA,
  JFaqItem,
  JMetricCard,
  JRelatedItem,
  JSectionHeading,
  JSiteFooter,
} from '../../../public-api';
import type { ContactStepData, FooterLink } from '../../../public-api';
import { el, getRole, getRoleByName, html, queryRoleByName, queryText } from '../../../testing/dom';

@Component({
  standalone: true,
  imports: [JDetailCTA],
  template: `
    <j-detail-cta
      title="Empieza hoy"
      body="Sin tarjeta"
      primaryHref="/go"
      primaryLabel="Crear"
      [secondaryLabel]="secondaryLabel"
      [secondaryHref]="secondaryHref"
    />
  `,
})
class DetailCtaHost {
  secondaryLabel?: string;
  secondaryHref?: string;
}

@Component({
  standalone: true,
  imports: [JContactSteps],
  template: `<j-contact-steps heading="Como empezar" [steps]="steps" />`,
})
class StepsHost {
  steps: ContactStepData[] = [
    { num: '1', title: 'Registrate', body: 'Crea tu cuenta' },
    { num: '2', title: 'Configura', body: 'Ajusta todo' },
  ];
}

@Component({
  standalone: true,
  imports: [JFaqItem, JRelatedItem, JMetricCard, JSectionHeading, JSiteFooter],
  template: `
    <j-faq-item question="Es gratis?" answer="Si, el plan base." />
    <j-related-item name="Caso X" outcome="+30% ventas" href="/caso-x" />
    <j-metric-card value="99%" label="Uptime" />
    <j-section-heading eyebrow="Sobre" heading="Nuestro metodo" description="Como trabajamos" />
    <j-site-footer copyright="(c) 2026 JONA" [links]="links" />
  `,
})
class ContentHost {
  links: FooterLink[] = [{ label: 'Terminos', href: '/terms' }];
}

function mount<T>(tipo: new () => T, patch: Partial<T> = {}) {
  const fixture = TestBed.createComponent(tipo);
  Object.assign(fixture.componentInstance as object, patch);
  fixture.detectChanges();
  return fixture;
}

describe('JDetailCTA', () => {
  it('rinde titulo, cuerpo y CTA primario', () => {
    const f = mount(DetailCtaHost);
    expect(getRole(f, 'heading').textContent?.trim()).toBe('Empieza hoy');
    expect(getRoleByName(f, 'link', 'Crear').getAttribute('href')).toBe('/go');
  });

  it('el CTA secundario solo con href + label; acciones apiladas y luego fila', () => {
    const soloLabel = mount(DetailCtaHost, { secondaryLabel: 'Demo' });
    expect(queryRoleByName(soloLabel, 'link', 'Demo')).toBeNull();
    expect(html(soloLabel)).toContain('flex-col');
    expect(html(soloLabel)).toContain('sm:flex-row');

    // Equivalente del `rerender` de React: se monta de nuevo con ambos valores.
    const conHref = mount(DetailCtaHost, { secondaryLabel: 'Demo', secondaryHref: '/demo' });
    expect(getRoleByName(conHref, 'link', 'Demo').getAttribute('href')).toBe('/demo');
  });
});

describe('JContactSteps + JNumberedStep', () => {
  it('rinde el encabezado y cada paso', () => {
    const f = mount(StepsHost);
    expect(getRole(f, 'heading').textContent).toContain('Como empezar');
    expect(queryText(f, 'Registrate')).not.toBeNull();
    expect(queryText(f, 'Ajusta todo')).not.toBeNull();
    expect(queryText(f, '2')).not.toBeNull();
  });
});

describe('JFaqItem', () => {
  it('rinde pregunta y respuesta', () => {
    const f = mount(ContentHost);
    expect(queryText(f, 'Es gratis?')).not.toBeNull();
    expect(queryText(f, 'Si, el plan base.')).not.toBeNull();
  });
});

describe('JRelatedItem', () => {
  it('se rinde como tarjeta-enlace con la etiqueta por defecto', () => {
    const f = mount(ContentHost);
    const link = el(f).querySelector<HTMLElement>('j-related-item a[href="/caso-x"]');
    expect(link).not.toBeNull();
    expect(link!.textContent).toContain('Caso X');
    expect(link!.textContent).toContain('Ver más');
  });
});

describe('JSiteFooter', () => {
  it('rinde el copyright y la lista de enlaces; envuelve en pantallas pequenas', () => {
    const f = mount(ContentHost);
    expect(queryText(f, '(c) 2026 JONA')).not.toBeNull();
    expect(getRoleByName(f, 'link', 'Terminos').getAttribute('href')).toBe('/terms');
    expect(el(f).querySelector('footer')?.className).toContain('flex-wrap');
  });
});

describe('JMetricCard & JSectionHeading', () => {
  it('JMetricCard rinde valor y etiqueta', () => {
    const f = mount(ContentHost);
    expect(queryText(f, '99%')).not.toBeNull();
    expect(queryText(f, 'Uptime')).not.toBeNull();
  });

  it('JSectionHeading rinde eyebrow, encabezado y descripcion', () => {
    const f = mount(ContentHost);
    expect(queryText(f, 'Sobre')).not.toBeNull();
    expect(queryText(f, 'Nuestro metodo')).not.toBeNull();
    expect(queryText(f, 'Como trabajamos')).not.toBeNull();
  });
});
