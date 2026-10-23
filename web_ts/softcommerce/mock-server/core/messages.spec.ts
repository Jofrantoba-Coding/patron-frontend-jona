import { describe, expect, it } from 'vitest';
import { validateRegistry } from '../registry/schema.js';
import { createRecord, updateRecord } from './catalog.js';
import { fieldMessage } from './messages.js';
import { createStore } from './store.js';
import { tinySeed } from './test-helpers.js';

const entry = (style: string, entity = 'un Aduana') => ({ entity, messages: { style } });
const desc = { name: 'descripcion', label: 'Descripcion', max: 10 };

describe('fieldMessage: required texts (R-REF-3)', () => {
  it.each<[string, any, any, any, string]>([
    ['M1 INSERT', entry('M1'), desc, 'INSERT', 'Para agregar un Aduana, debes especificar su Descripcion.'],
    ['M1 UPDATE (S-REF-2)', entry('M1'), desc, 'UPDATE', 'Para modificar un Aduana, debes especificar su Descripcion.'],
    ['M1 CLONE', entry('M1'), desc, 'CLONE', 'Para clonar un Aduana, debes especificar su Descripcion.'],
    ['M1 DELETE', entry('M1'), desc, 'DELETE', 'Para eliminar un Aduana, debes especificar su Descripcion.'],
    ['M2 has no entity', entry('M2'), { name: 'hora', label: 'Hora' }, 'INSERT', 'Para agregar, debes especificar su Hora.'],
    ['msgLabel replaces "su {label}"', entry('M1', 'una Condición de Pago'), { name: 'd', label: 'Dias de Pago', msgLabel: 'sus Dias de Pago' }, 'INSERT', 'Para agregar una Condición de Pago, debes especificar sus Dias de Pago.'],
    ['MS defaults to "un"', entry('MS', 'una Zona'), { name: 'dep', label: 'Departamento' }, 'INSERT', 'Para agregar una Zona, debes Seleccionar un Departamento.'],
    ['MS with article "una"', entry('MS', 'una Zona'), { name: 'prov', label: 'Provincia', article: 'una' }, 'INSERT', 'Para agregar una Zona, debes Seleccionar una Provincia.'],
    ['label style takes the msgLabel as written', entry('label', 'una Asignación'), { name: 'u', label: 'Usuario', msgLabel: 'el Usuario' }, 'UPDATE', 'Para modificar una Asignación, debes especificar el Usuario.'],
    ['label style falls back to the label', entry('label', 'una Asignación'), { name: 'u', label: 'serie' }, 'INSERT', 'Para agregar una Asignación, debes especificar serie.'],
    ['a literal message wins', entry('M1'), { ...desc, message: 'Ingrese Descripcion' }, 'INSERT', 'Ingrese Descripcion'],
    ['w1 keeps the W1 text', entry('w1'), desc, 'INSERT', 'descripcion is required'],
  ])('%s', (_name, e, f, mode, expected) => {
    expect(fieldMessage(e, f, 'REQUIRED', mode)).toBe(expected);
  });
});

describe('fieldMessage: other rules', () => {
  const turno = { name: 'hora', label: 'Hora', messages: { range: 'Para {modo}, debes Insertar Hora Correcto.', date: 'La fecha ({modo}) no es válida.' } };

  it.each<[string, any, any, any, string, any?]>([
    ['range literal fills {modo}', entry('M2'), turno, 'RANGE', 'Para agregar, debes Insertar Hora Correcto.'],
    ['date literal', entry('M1'), turno, 'DATE', 'La fecha (agregar) no es válida.'],
    ['range without literal reads as the required text', entry('M1'), { name: 'distancia', label: 'Distancia' }, 'RANGE', 'Para agregar un Aduana, debes especificar su Distancia.'],
    ['minLen without literal reads as the required text (UPDATE)', entry('M1', 'una Empresa'), { name: 'ruc', label: 'RUC' }, 'MIN_LENGTH', 'Para modificar una Empresa, debes especificar su RUC.', 'UPDATE'],
    ['minLen literal', entry('M1'), { name: 'n', label: 'N', messages: { minLen: 'El número no es válido.' } }, 'MIN_LENGTH', 'El número no es válido.'],
    ['w1 ignores the literals', entry('w1'), turno, 'RANGE', 'hora is out of range'],
    ['max length', entry('M1'), desc, 'MAX_LENGTH', 'descripcion must be at most 10 characters'],
    ['option outside its list', entry('M1'), { name: 'tipo', kind: 'options', options: [{ value: 'E' }, { value: 'S' }] }, 'INVALID', 'tipo must be one of: E, S'],
    ['integer', entry('M1'), { name: 'n', kind: 'number', scale: 0 }, 'INVALID', 'n must be an integer'],
    ['decimal', entry('M1'), { name: 'n', kind: 'number', scale: 2 }, 'INVALID', 'n must be a number'],
    ['boolean', entry('M1'), { name: 'b', kind: 'boolean' }, 'INVALID', 'b must be a boolean'],
  ])('%s', (_name, e, f, code, expected, mode = 'INSERT') => {
    expect(fieldMessage(e, f, code, mode)).toBe(expected);
  });
});

describe('S-REF-2 the server uses the shared messages', () => {
  const aduanas = {
    slug: 'aduanas', idKey: 'id_aduanas', codeWidth: 0, entity: 'un Aduana', scope: 'tenant', seed: 'aduanas', messages: { style: 'M1' },
    fields: [{ name: 'descripcion', kind: 'text', label: 'Descripcion', required: true, max: 10 }], columns: [{ key: 'descripcion', header: 'D' }],
  };
  const store = () => createStore({ ...tinySeed(), aduanas: { a: [{ id_aduanas: '1', descripcion: 'X', activo: true }] } }, validateRegistry([aduanas]));
  const messageOf = (run: () => unknown) => {
    try { run(); } catch (e) { return (e as any).details[0].message; }
    throw new Error('expected function to throw');
  };

  it('agregar on create, modificar on update', () => {
    const s = store();
    expect(messageOf(() => createRecord(s, 'a', 'aduanas', { descripcion: ' ' }))).toBe('Para agregar un Aduana, debes especificar su Descripcion.');
    expect(messageOf(() => updateRecord(s, 'a', 'aduanas', '1', { descripcion: ' ' }))).toBe('Para modificar un Aduana, debes especificar su Descripcion.');
  });
});
