import { describe, expect, it } from 'vitest';
import { parentEntry } from '../core/children.fixture';
import { validateRegistry } from './schema.js';

const load = (gate: unknown) => () => validateRegistry([parentEntry('clientes', { columns: [{ key: 'nombre', header: 'Nombre' }, { key: 'nombre', header: 'Otro', gate }] })]);

describe('R-REG-17 a company-parameter gate on a list column (R-MST-10)', () => {
  it('keeps the gate of a column and accepts a boolean params key', () => {
    expect(load({ param: 'IS_CLIENTE_CONDICION_PAGO' })).not.toThrow();
    expect(validateRegistry([parentEntry('clientes', { columns: [{ key: 'nombre', header: 'N', gate: { param: 'IS_CLIENTE_SUSTITUTO' } }] })]).bySlug.get('clientes').columns[0].gate).toEqual({ param: 'IS_CLIENTE_SUSTITUTO' });
  });

  it('rejects a gate over a key that is not a params key or not a boolean, naming the column', () => {
    expect(load({ param: 'NOPE' })).toThrow(/entry "clientes" column "nombre": gate.param "NOPE" is not a params key/);
    expect(load({ param: 'PORC_IGV' })).toThrow(/gate.param "PORC_IGV" is a value, not a gate/);
  });
});
