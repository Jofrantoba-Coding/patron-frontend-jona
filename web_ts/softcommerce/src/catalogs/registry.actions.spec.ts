import { describe, expect, it } from 'vitest';
import { parentEntry } from '../../mock-server/core/children.fixture';
import { validateRegistry } from '../../mock-server/registry/schema.js';
import { toCatalogConfig } from './registry';

const date = { name: 'fecha_inicio', kind: 'date', label: 'Fecha Inicio', default: 'today', required: true };
const registry = validateRegistry([
  parentEntry('clientes', {
    actions: [{ id: 'cerrar', label: 'Cerrar', kind: 'immediate', server: 'cerrar', flag: 'close' }],
    children: {
      activaciones: {
        tab: 'Activacion', removal: 'none', fields: [{ name: 'motivo', kind: 'text', label: 'motivo', max: 30 }], columns: [{ key: 'motivo', header: 'Motivo' }],
        actions: [
          { id: 'activar', label: 'Activar', kind: 'deferred', rule: 'activar', confirm: 'Seguro?', dialog: { title: 'Activar', fields: [date] }, enabledWhen: { modes: ['UPDATE'], noRow: { field: 'estado', in: ['A'] } } },
        ],
      },
    },
  }),
]);
const config = toCatalogConfig(registry.bySlug.get('clientes'), registry);

describe('S-ACT-1 the config carries the declared actions (R-ACT-1, R-REG-15)', () => {
  it('a child config lists its actions with the flag defaulted to modify, the dialog fields as form fields', () => {
    const [activar] = config.children![0].actions!;
    expect(activar).toMatchObject({ id: 'activar', label: 'Activar', placement: 'child', flag: 'modify', kind: 'deferred', rule: 'activar', confirm: 'Seguro?' });
    expect(activar.enabledWhen).toEqual({ modes: ['UPDATE'], noRow: { field: 'estado', in: ['A'] } });
    expect(activar.dialog!.title).toBe('Activar');
    expect(activar.dialog!.fields).toEqual([expect.objectContaining({ kind: 'date', name: 'fecha_inicio', label: 'Fecha Inicio', required: true, default: 'today' })]);
  });

  it('an entry config lists its own actions, and the nested child config none', () => {
    expect(config.rowActions).toEqual([expect.objectContaining({ id: 'cerrar', placement: 'register', flag: 'close', kind: 'immediate', server: 'cerrar' })]);
    expect(config.children![0].config.rowActions).toBeUndefined();
  });

  it('a child or entry with no actions has none on the config', () => {
    const plain = toCatalogConfig(validateRegistry([parentEntry('cuentas')]).bySlug.get('cuentas'), validateRegistry([parentEntry('cuentas')]));
    expect(plain.rowActions).toBeUndefined();
    expect(plain.children![0].actions).toBeUndefined();
  });
});
