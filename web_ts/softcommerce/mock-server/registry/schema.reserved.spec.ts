import { describe, expect, it } from 'vitest';
import { parentEntry } from '../core/children.fixture';
import { validateRegistry } from './schema.js';

const child = () => ({ fields: [{ name: 'direccion', kind: 'text', label: 'd', max: 10 }], columns: [{ key: 'direccion', header: 'D' }] });

describe('R-REG-20 reserved child names of the perfil permission routes (R-PRM-5)', () => {
  it.each(['menu', 'permisos'])('rejects a child named %s', (name) => {
    expect(() => validateRegistry([parentEntry('clientes', { children: { [name]: child() } })])).toThrow(new RegExp(`child "${name}": reserved name`));
  });
});
