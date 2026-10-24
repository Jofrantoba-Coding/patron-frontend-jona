import { describe, expect, it } from 'vitest';
import { parentEntry } from '../core/children.fixture';
import { PERMISSION_FLAGS } from '../../src/domain/permissions';
import { PERMISSION_FLAG_NAMES } from './flags.js';
import { validateRegistry } from './schema.js';

const text = (name: string) => ({ name, kind: 'text', label: name, max: 10 });
const child = (over: Record<string, any> = {}) => ({ tab: 'Activacion', removal: 'none', fields: [text('motivo')], columns: [{ key: 'motivo', header: 'Motivo' }], ...over });
const deferred = (over: Record<string, any> = {}) => ({ id: 'activar', label: 'Activar', kind: 'deferred', rule: 'demo', ...over });
const immediate = (over: Record<string, any> = {}) => ({ id: 'cerrar', label: 'Cerrar', kind: 'immediate', server: 'demo', ...over });
const onChild = (actions: unknown, over: Record<string, any> = {}) => () => validateRegistry([parentEntry('clientes', { children: { activaciones: child({ actions, ...over }) } })]);
const onEntry = (actions: unknown) => () => validateRegistry([parentEntry('clientes', { actions })]);

describe('R-ACT-2 the permission flags the registry knows', () => {
  it('are the 13 flags of the domain', () => {
    expect([...PERMISSION_FLAG_NAMES]).toEqual([...PERMISSION_FLAGS]);
  });
});

describe('S-REG-26 action flag validation (R-REG-15, R-REG-20)', () => {
  it('rejects a flag that is not one of the 13', () => {
    expect(onChild([deferred({ flag: 'foo' })])).toThrow(/entry "clientes\/activaciones" action "activar": flag "foo" is not a permission flag/);
    expect(onEntry([immediate({ flag: 'foo', placement: 'register' })])).toThrow(/entry "clientes" action "cerrar": flag "foo" is not a permission flag/);
  });

  it('accepts modify, and defaults the flag to modify', () => {
    const registry = validateRegistry([parentEntry('clientes', { children: { activaciones: child({ actions: [deferred({ flag: 'modify' }), deferred({ id: 'otra', label: 'Otra' })] }) } })]);
    expect(registry.bySlug.get('clientes/activaciones').actions.map((a: any) => [a.id, a.flag])).toEqual([['activar', 'modify'], ['otra', 'modify']]);
  });
});

describe('R-REG-15 action declaration at load', () => {
  it('gives an entry action the register placement and a child action the child placement unless they say otherwise', () => {
    const registry = validateRegistry([
      parentEntry('clientes', { actions: [immediate({ server: 'x' }), immediate({ id: 'lista', placement: 'list-toolbar' })], children: { activaciones: child({ actions: [deferred()] }) } }),
    ]);
    expect(registry.bySlug.get('clientes').actions.map((a: any) => [a.id, a.placement])).toEqual([['cerrar', 'register'], ['lista', 'list-toolbar']]);
    expect(registry.bySlug.get('clientes/activaciones').actions[0]).toEqual({ id: 'activar', label: 'Activar', placement: 'child', flag: 'modify', kind: 'deferred', rule: 'demo' });
  });

  it('keeps the declared enabledWhen, confirm and server', () => {
    const when = { modes: ['UPDATE'], selection: true, row: { field: 'motivo', in: ['A'] }, noRow: { field: 'estado', in: ['A'] } };
    const registry = validateRegistry([parentEntry('clientes', { children: { activaciones: child({ actions: [immediate({ enabledWhen: when, confirm: 'Seguro?' })] }) } })]);
    expect(registry.bySlug.get('clientes/activaciones').actions[0]).toMatchObject({ enabledWhen: when, confirm: 'Seguro?', server: 'demo', kind: 'immediate' });
  });

  it('rejects an immediate action that names no server action, and a deferred one that names no rule', () => {
    expect(onChild([immediate({ server: undefined })])).toThrow(/action "cerrar": an immediate action needs a server action/);
    expect(onChild([deferred({ rule: undefined })])).toThrow(/action "activar": a deferred action needs a rule/);
    expect(onChild([deferred({ server: 'x' })])).toThrow(/action "activar": a deferred action has no server action/);
    expect(onChild([immediate({ rule: 'x' })])).toThrow(/action "cerrar": an immediate action has no client rule/);
  });

  it('rejects an enabledWhen that names an unknown field or mode', () => {
    expect(onChild([deferred({ enabledWhen: { row: { field: 'nope', in: ['A'] } } })])).toThrow(/action "activar": enabledWhen names unknown field "nope"/);
    expect(onChild([deferred({ enabledWhen: { noRow: { field: 'nope', in: ['A'] } } })])).toThrow(/enabledWhen names unknown field "nope"/);
    expect(onChild([deferred({ enabledWhen: { modes: ['NOPE'] } })])).toThrow(/enabledWhen names unknown mode "NOPE"/);
    expect(onChild([deferred({ enabledWhen: { other: true } })])).toThrow(/enabledWhen names unknown key "other"/);
    expect(onEntry([immediate({ enabledWhen: { row: { field: 'nope', in: ['A'] } } })])).toThrow(/entry "clientes" action "cerrar": enabledWhen names unknown field "nope"/);
  });

  it('knows the estado and the fields of the child, and the fields of the entry', () => {
    expect(onChild([deferred({ enabledWhen: { row: { field: 'estado', in: ['A'] }, noRow: { field: 'motivo', in: ['X'] } } })])).not.toThrow();
    expect(onEntry([immediate({ enabledWhen: { row: { field: 'nombre', in: ['A'] } } })])).not.toThrow();
  });

  it('rejects noRow on an entry action, a bad kind, an unknown placement and a placement of the wrong owner', () => {
    expect(onEntry([immediate({ enabledWhen: { noRow: { field: 'nombre', in: ['A'] } } })])).toThrow(/enabledWhen.noRow needs a child action/);
    expect(onChild([deferred({ kind: 'later' })])).toThrow(/action "activar": unknown kind "later"/);
    expect(onChild([deferred({ placement: 'footer' })])).toThrow(/action "activar": unknown placement "footer"/);
    expect(onChild([deferred({ placement: 'register' })])).toThrow(/action "activar": placement "register" is not for a child/);
    expect(onEntry([immediate({ placement: 'child' })])).toThrow(/action "cerrar": placement "child" is not for an entry/);
  });

  it('rejects a duplicate id, the reserved id actions, a blank label and a non-list', () => {
    expect(onChild([deferred(), deferred()])).toThrow(/action "activar": duplicate action id/);
    expect(onChild([deferred({ id: 'actions' })])).toThrow(/action "actions": reserved name/);
    expect(onChild([deferred({ label: ' ' })])).toThrow(/action "activar": needs a label/);
    expect(onChild({ activar: deferred() })).toThrow(/actions must be a list/);
  });

  it('resolves a dialog through the field checks of any entry', () => {
    const date = { name: 'fecha_inicio', kind: 'date', label: 'Fecha Inicio', default: 'today', required: true };
    const registry = validateRegistry([parentEntry('clientes', { children: { activaciones: child({ actions: [deferred({ dialog: { title: 'Activar', fields: [date, text('motivo')] } })] }) } })]);
    const dialog = registry.bySlug.get('clientes/activaciones').actions[0].dialog;
    expect(dialog.title).toBe('Activar');
    expect(dialog.fields.map((f: any) => f.name)).toEqual(['fecha_inicio', 'motivo']);
    expect(onChild([deferred({ dialog: { title: 'Activar', fields: [{ name: 'x', kind: 'weird', label: 'X' }] } })])).toThrow(/unknown kind "weird"/);
    expect(onChild([deferred({ dialog: { title: 'Activar', fields: [] } })])).toThrow(/action "activar": dialog needs fields/);
  });

  it('validates the actions of a store child too', () => {
    const owner = { slug: 'series', idKey: 'id_series', codeWidth: 3, entity: 'una serie', scope: 'tenant', seed: 'series', messages: { style: 'M1' }, fields: [{ name: 'id_series', kind: 'code', label: 'C' }, text('id_clientes')], columns: [{ key: 'id_series', header: 'C' }] };
    const load = (actions: unknown) => () => validateRegistry([owner, parentEntry('clientes', { children: { series: { tab: 'Series', removal: 'delete', store: { entry: 'series', key: 'id_clientes' }, actions } } })]);
    expect(load([immediate({ flag: 'foo' })])).toThrow(/entry "clientes" child "series" action "cerrar": flag "foo" is not a permission flag/);
    const registry = validateRegistry([owner, parentEntry('clientes', { children: { series: { tab: 'Series', removal: 'delete', store: { entry: 'series', key: 'id_clientes' }, actions: [immediate()] } } })]);
    expect(registry.bySlug.get('clientes/series').actions.map((a: any) => a.id)).toEqual(['cerrar']);
  });
});
