import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { bloqueActual, bloqueCatalogo, enlacesDelCapitulo12, fichas } from '../catalogo.mjs';

describe('Catálogo de antipatrones del capítulo 12', () => {
  it('el catálogo por capítulo coincide con las fichas de los capítulos (npm run generar lo actualiza)', () => {
    assert.equal(bloqueActual(), bloqueCatalogo());
  });

  it('cada enlace del capítulo 12 a una ficha apunta a una ficha que existe', () => {
    const existentes = new Set(fichas().map((f) => `${f.archivo}#${f.ancla}`));
    const rotos = enlacesDelCapitulo12().filter((e) => !existentes.has(`${e.archivo}#${e.ancla}`));
    assert.deepEqual(rotos, []);
  });

  it('ninguna ancla de ficha se repite', () => {
    const anclas = fichas().map((f) => f.ancla);
    assert.deepEqual(anclas.filter((a, i) => anclas.indexOf(a) !== i), []);
  });

  it('cada ficha pertenece al capítulo que dice su ancla', () => {
    const malUbicadas = fichas().filter((f) => Number(f.archivo.slice(0, 2)) !== f.capitulo);
    assert.deepEqual(malUbicadas.map((f) => f.ancla), []);
  });
});
