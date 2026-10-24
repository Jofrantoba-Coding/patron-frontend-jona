import { describe, expect, it } from 'vitest';
import { fieldMessage } from './messages.js';

const entry = { entity: 'un Cliente', messages: { style: 'dialog' } };

describe('fieldMessage: the dialog style (R-MST-11)', () => {
  it.each<[string, any, string]>([
    ['a select says Seleccionar with its article (un by default)', { kind: 'select', name: 'id_ubigeo', label: 'Distrito' }, 'Debes Seleccionar un Distrito.'],
    ['a select with the article una', { kind: 'select', name: 'id_zona', label: 'Zona', article: 'una' }, 'Debes Seleccionar una Zona.'],
    ['a text says Ingresar', { kind: 'text', name: 'direccion', label: 'Direccion' }, 'Debes Ingresar Direccion.'],
  ])('%s', (_name, field, text) => {
    expect(fieldMessage(entry, field, 'REQUIRED', 'INSERT')).toBe(text);
  });

  it('a declared message still wins and the sentence never names the mode or the entity', () => {
    expect(fieldMessage(entry, { kind: 'select', name: 'id_cuenta', label: 'Banco', message: 'Seleccione Banco' }, 'REQUIRED', 'UPDATE')).toBe('Seleccione Banco');
    expect(fieldMessage(entry, { kind: 'text', name: 'direccion', label: 'Direccion' }, 'REQUIRED', 'UPDATE')).not.toMatch(/Cliente|modificar/);
  });
});
