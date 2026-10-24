import { describe, expect, it } from 'vitest';
import { ownedFields } from '../core/entryRules.js';
import { REGISTRY } from './index.js';

/** R-MD-10 (as corrected), R-PRM-7, D14: Series is a store child of the Usuario over the W2 usuario-correlativos rows, with no register tab. */
const series = REGISTRY.bySlug.get('usuarios/series');
const owner = REGISTRY.bySlug.get('usuario-correlativos');
const usuarios = REGISTRY.bySlug.get('usuarios');

describe('usuarios.children.series (R-MD-10)', () => {
  it('is a store child over usuario-correlativos keyed by id_usuario, with no register tab', () => {
    expect(series).toMatchObject({ parent: 'usuarios', childName: 'series', parentKey: 'id_usuario', section: 'usuario-correlativos', seed: null, store: { entry: 'usuario-correlativos', key: 'id_usuario' }, tab: false });
  });

  it('shows the desktop grid: ESTADO, ID CORRELATIVO, PUNTO DE VENTA, TIPO DE DOCUMENTO, SERIE, FECHA INICIO, FECHA FIN', () => {
    expect(series.columns.map((c: any) => [c.key, c.header])).toEqual([
      ['habilitar', 'ESTADO'], ['id_correlativo', 'ID CORRELATIVO'], ['punto_venta', 'PUNTO DE VENTA'], ['tipo_documento', 'TIPO DE DOCUMENTO'], ['serie', 'SERIE'], ['fecha_inicio', 'FECHA INICIO'], ['fecha_fin', 'FECHA FIN'],
    ]);
  });

  it('declares activate and deactivate as immediate actions and the Usuario list toolbar action', () => {
    expect(series.actions.map((a: any) => [a.id, a.kind, a.server, a.placement])).toEqual([['activate', 'immediate', 'activarSerie', 'child'], ['deactivate', 'immediate', 'desactivarSerie', 'child']]);
    expect(usuarios.actions).toEqual([expect.objectContaining({ id: 'autorizar-series', label: 'Autorizar Series', placement: 'list-toolbar', kind: 'deferred', rule: 'autorizarSeries', flag: 'modify' })]);
  });
});

describe('the W2 usuario-correlativos entry (R-PRM-7)', () => {
  it('keeps its fields and habilitar as the estado; the dates are server-owned, not fields', () => {
    expect(owner.fields.map((f: any) => f.name)).toEqual(['id_usuario_correlativo', 'id_usuario', 'id_localidad', 'id_punto_venta', 'id_tipo_doc', 'id_correlativo', 'habilitar']);
    expect(ownedFields(owner)).toEqual(['fecha_inicio', 'fecha_fin']);
  });
});
