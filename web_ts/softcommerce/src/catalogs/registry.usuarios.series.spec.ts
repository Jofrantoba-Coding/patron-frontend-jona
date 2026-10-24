import { describe, expect, it } from 'vitest';
import { REGISTRY } from '../../mock-server/registry/index.js';
import { toCatalogConfig } from './registry';

/** R-MD-10 / R-PRM-6: Series is a child resource with no register tab, and Autorizar Series is a list-toolbar action. */
describe('toCatalogConfig(usuarios)', () => {
  const config = toCatalogConfig(REGISTRY.bySlug.get('usuarios'));

  it('has no register tab for the series child, so the Usuario keeps the plain register', () => {
    expect(config.children).toBeUndefined();
  });

  it('offers the series as a resource with the desktop columns and the immediate actions', () => {
    expect(config.resources?.map((r) => r.name)).toEqual(['series']);
    expect(config.resources?.[0].config.columns.map((c) => c.header)).toEqual(['ESTADO', 'ID CORRELATIVO', 'PUNTO DE VENTA', 'TIPO DE DOCUMENTO', 'SERIE', 'FECHA INICIO', 'FECHA FIN']);
    expect(config.resources?.[0].actions?.map((a) => [a.id, a.kind, a.flag])).toEqual([['activate', 'immediate', 'modify'], ['deactivate', 'immediate', 'modify']]);
  });

  it('declares Autorizar Series as a list-toolbar action', () => {
    expect(config.rowActions?.map((a) => [a.id, a.label, a.placement, a.rule])).toEqual([['autorizar-series', 'Autorizar Series', 'list-toolbar', 'autorizarSeries']]);
  });
});
