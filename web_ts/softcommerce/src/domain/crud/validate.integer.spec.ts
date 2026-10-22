import { describe, expect, it } from 'vitest';
import { validateRegistry } from '../../../mock-server/registry/schema.js';
import { toCatalogConfig } from '../../catalogs/registry';
import { validate } from './validate';

const integer = (name: string, label: string, range: { min?: number; max?: number }) => ({
  name, kind: 'number', label, scale: 0, required: true, max: 2, normalize: ['digits', 'padLeft:2'], range,
  messages: { range: `Para {modo}, debes Insertar ${label} Correcto.` },
});
const turno = toCatalogConfig(
  validateRegistry([
    {
      slug: 'turnos', idKey: 'id_turno', codeWidth: 0, entity: 'un Turno', scope: 'tenant', seed: 'turnos', messages: { style: 'M2' },
      fields: [integer('hora', 'Hora', { min: 0, max: 12 }), integer('minuto', 'Minutos', { min: 0, max: 59 })],
      columns: [{ key: 'hora', header: 'H' }],
      validation: ['hora', 'minuto', { range: 'hora' }, { range: 'minuto' }],
    },
  ]).entries[0],
);
const run = (values: Record<string, string>, mode: 'INSERT' | 'UPDATE' = 'INSERT') => validate(turno.fields, values, { entry: turno.entry!, mode });

describe('S-REF-12 turno rows through the shared messages and the declared order', () => {
  it.each([
    ['hora 13', { hora: '13', minuto: '30' }, [{ name: 'hora', message: 'Para agregar, debes Insertar Hora Correcto.' }]],
    ['minuto 60', { hora: '12', minuto: '60' }, [{ name: 'minuto', message: 'Para agregar, debes Insertar Minutos Correcto.' }]],
    ['hora 0 and minuto 0', { hora: '0', minuto: '0' }, []],
    ['the bounds 12 and 59', { hora: '12', minuto: '59' }, []],
    ['a blank hora', { hora: '', minuto: '30' }, [{ name: 'hora', message: 'Para agregar, debes especificar su Hora.' }]],
    ['a blank minuto beats a bad hora', { hora: '13', minuto: '' }, [{ name: 'minuto', message: 'Para agregar, debes especificar su Minutos.' }]],
  ])('%s', (_name, values, expected) => {
    expect(run(values)).toEqual(expected);
  });

  it('words the mode: modificar', () => {
    expect(run({ hora: '13', minuto: '30' }, 'UPDATE')[0].message).toBe('Para modificar, debes Insertar Hora Correcto.');
  });

  it('S-CRUD-25 a number outside its range blocks the submit even without a declared range step', () => {
    const plain = toCatalogConfig(
      validateRegistry([
        {
          slug: 'relojes', idKey: 'id_reloj', codeWidth: 0, entity: 'un Reloj', scope: 'tenant', seed: 'relojes', messages: { style: 'M2' },
          fields: [integer('hora', 'Hora', { min: 0, max: 12 })], columns: [{ key: 'hora', header: 'H' }],
        },
      ]).entries[0],
    );
    expect(validate(plain.fields, { hora: '13' }, { entry: plain.entry!, mode: 'INSERT' }).map((e) => e.name)).toEqual(['hora']);
    expect(validate(plain.fields, { hora: '0' }, { entry: plain.entry!, mode: 'INSERT' })).toEqual([]);
  });
});
