import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { describe, it } from 'node:test';
import { REGLAS } from '../herramientas/jona-check.js';
import { CASOS } from './casos.js';
import { enProyecto } from './rutas.js';

interface Catalogo {
  reglas: Array<{ id: string; titulo: string; descripcion: string }>;
}

const catalogo: Catalogo = JSON.parse(readFileSync(enProyecto('../reglas.json'), 'utf8'));
const idsCatalogo = catalogo.reglas.map((regla) => regla.id).sort();

describe('Gobierno: un catálogo, una implementación por regla', () => {
  it('cada regla del catálogo está implementada en TypeScript, y no hay reglas fuera del catálogo', () => {
    assert.deepEqual(Object.keys(REGLAS).sort(), idsCatalogo);
  });

  it('cada regla del catálogo tiene al menos un fixture que la hace fallar', () => {
    assert.deepEqual([...new Set(CASOS.map(([, regla]) => regla))].sort(), idsCatalogo);
  });
});
