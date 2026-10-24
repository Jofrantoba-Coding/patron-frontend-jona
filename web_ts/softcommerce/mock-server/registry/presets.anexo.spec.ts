import { describe, expect, it } from 'vitest';
import { parentEntry } from '../core/children.fixture';
import { presets, TIPO_ANEXO } from './presets.js';
import { validateRegistry } from './schema.js';

/**
 * D13 the anexo preset: the activation history child, its two deferred actions, the API-only entry actions the endpoints run (S-MOCK-47..49), the `activacion`
 * rule that owns the master `estado`, the 10-character code and the hidden tipo anexo (R-ANX-1, R-ANX-9).
 */
const anexo = presets.anexo({ entity: 'Banco', tipoAnexo: TIPO_ANEXO.banco });
const master = (over: Record<string, any> = {}) =>
  parentEntry('bancos', {
    fields: [{ name: 'id_bancos', kind: 'code', label: 'Codigo' }, { name: 'nombre', kind: 'text', label: 'Nombre', max: 30 }, { name: 'estado', preset: 'estado' }],
    children: anexo.children, actions: anexo.actions, rules: anexo.rules, constants: anexo.constants, codeWidth: anexo.codeWidth, ...over,
  });
const registry = validateRegistry([master()]);
const child = registry.bySlug.get('bancos/activaciones');

describe('R-ANX-1 the activation child', () => {
  it('is the Activación de Banco tab, with no Quitar, no Agregar and the INICIO row the server creates', () => {
    expect([child.tab, child.removal, child.entry, child.initial]).toEqual(['Activación de Banco', 'none', 'none', { motivo_activacion: 'INICIO' }]);
  });

  it('shows the four columns of the desktop grid, in its order, with dd/MM/yyyy dates', () => {
    expect(child.columns).toEqual([
      { key: 'motivo_activacion', header: 'MOTIVO_ACTIVACION' },
      { key: 'f_inicio', header: 'FECHA_ACTIVACION', type: 'date' },
      { key: 'motivo_desactivacion', header: 'MOTIVO_DESACTIVACION' },
      { key: 'f_fin', header: 'FECHA_DESACTIVACION', type: 'date' },
    ]);
  });

  it('stores the dates and the two motivos (uppercase, 100)', () => {
    const field = (name: string) => child.fields.find((f: any) => f.name === name);
    expect([field('f_inicio').kind, field('f_inicio').default, field('f_fin').kind]).toEqual(['date', 'today', 'date']);
    expect([field('motivo_activacion').max, field('motivo_activacion').normalize, field('motivo_desactivacion').max, field('motivo_desactivacion').normalize]).toEqual([100, ['upper'], 100, ['upper']]);
  });
});

describe('R-ACT-3 the deferred actions of the grid', () => {
  const [activar, desactivar] = child.actions;

  it('are Activar and Desactivar, deferred, named after the rule and carrying the entity of the messages', () => {
    expect([activar, desactivar].map((a: any) => [a.id, a.label, a.kind, a.rule, a.params, a.placement, a.flag])).toEqual([
      ['activar', 'Activar', 'deferred', 'activarAnexo', { entity: 'Banco' }, 'child', 'modify'],
      ['desactivar', 'Desactivar', 'deferred', 'desactivarAnexo', { entity: 'Banco' }, 'child', 'modify'],
    ]);
  });

  it('work in UPDATE only (the guards say the rest, S-ANX-2/4), with the dialogs of FormAnexoActivacion', () => {
    expect([activar.enabledWhen, desactivar.enabledWhen]).toEqual([{ modes: ['UPDATE'] }, { modes: ['UPDATE'] }]);
    expect([activar.dialog.title, activar.dialog.fields.map((f: any) => [f.name, f.label, f.required, f.message])]).toEqual([
      'Activar Banco', [['f_inicio', 'Fecha Inicio', true, undefined], ['motivo_activacion', 'Motivo de Activacion', true, 'Ingrese Motivo']],
    ]);
    expect([desactivar.dialog.title, desactivar.dialog.fields.map((f: any) => [f.name, f.label, f.required, f.message])]).toEqual([
      'Desactivar Banco', [['f_fin', 'Fecha Fin', true, undefined], ['motivo_desactivacion', 'Motivo de Desactivacion', true, 'Ingrese Motivo']],
    ]);
  });
});

describe('S-MOCK-47 the entry actions of the endpoints', () => {
  it('are immediate, API-only (never rendered) and bound to the server actions of the rule', () => {
    expect(registry.bySlug.get('bancos').actions.map((a: any) => [a.id, a.kind, a.server, a.placement])).toEqual([
      ['activar', 'immediate', 'activarAnexo', 'api'],
      ['desactivar', 'immediate', 'desactivarAnexo', 'api'],
    ]);
  });
});

describe('R-ACT-5 / R-ANX-9 the master side', () => {
  it('names the activacion rule with its entity and child, which owns estado', () => {
    expect(anexo.rules).toEqual([{ name: 'activacion', params: { entity: 'Banco', child: 'activaciones' } }]);
  });

  it('pads the code to 10 and keeps the tipo anexo as a hidden constant; Banco is "3" (PanelTFBanco lists listAnexo("3"))', () => {
    expect([anexo.codeWidth, anexo.constants, TIPO_ANEXO.banco]).toEqual([10, { id_tipo_anexo: '3' }, '3']);
  });

  it('the word of the messages comes from the entity', () => {
    const other = presets.anexo({ entity: 'Trabajador', tipoAnexo: '9' });
    expect([other.children.activaciones.tab, other.rules[0].params.entity, other.constants]).toEqual(['Activación de Trabajador', 'Trabajador', { id_tipo_anexo: '9' }]);
  });
});

describe('the schema keys the preset needs (R-REG-14, R-REG-15, R-REG-20)', () => {
  const load = (over: Record<string, any>) => () => validateRegistry([master(over)]);
  const withChild = (def: Record<string, any>) => load({ children: { activaciones: { ...anexo.children.activaciones, ...def } } });

  it('rejects an unknown child entry mode, and accepts none', () => {
    expect(withChild({ entry: 'nope' })).toThrow(/unknown entry "nope"/);
    expect(withChild({ entry: 'none' })).not.toThrow();
  });

  it('rejects an action placement for the wrong owner, and action params that are not an object', () => {
    expect(load({ actions: [{ id: 'x', label: 'X', kind: 'immediate', server: 's', placement: 'child' }] })).toThrow(/placement "child" is not for an entry/);
    expect(withChild({ actions: [{ ...anexo.children.activaciones.actions[0], params: 'Banco' }] })).toThrow(/action "activar": params must be an object/);
  });
});
