import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';
import { archivosFuente, revisarArquitectura, type Regla } from './reglas.js';

const SRC = fileURLToPath(new URL('../../src', import.meta.url));
const fixture = (nombre: string) => fileURLToPath(new URL(`../fixtures/${nombre}/src`, import.meta.url));

describe('Arquitectura del BFF: hexágono adentro y sin reglas de negocio', () => {
  it('analiza el código de src/ (la prueba no pasa por no encontrar archivos)', () => {
    expect(archivosFuente(SRC)).toEqual([
      'adaptadores/crearCatalogoHttp.ts',
      'adaptadores/crearInventarioHttp.ts',
      'api/InterApiProductos.ts',
      'app/crearBff.ts',
      'http/crearServidorBff.ts',
      'manejadores/crearManejadoresProductos.ts',
      'puertos/ErrorBackend.ts',
      'puertos/InterCatalogo.ts',
      'puertos/InterInventario.ts',
    ]);
  });

  it('src/ cumple las tres reglas', () => {
    expect(revisarArquitectura(SRC)).toEqual([]);
  });
});

/** Cada árbol de test/fixtures viola lo que dice su nombre: [árbol, reglas que lo detectan, archivo]. */
const CASOS: Array<[string, Regla[], string]> = [
  ['manejador-con-transporte', [1], 'manejadores/crearManejadoresProductos.ts'],
  ['servidor-elige-adaptador', [2], 'http/crearServidorBff.ts'],
  // El caso más común viola las dos: el manejador depende del adaptador y además lo elige.
  ['manejador-elige-adaptador', [1, 2], 'manejadores/crearManejadoresProductos.ts'],
  ['unicidad-en-el-bff', [3], 'manejadores/crearManejadoresProductos.ts'],
];

describe('Cada regla detecta lo que dice detectar', () => {
  it.each(CASOS)('%s: las reglas %j señalan %s', (nombre, reglas, archivo) => {
    const violaciones = revisarArquitectura(fixture(nombre));

    expect(violaciones.map((v) => v.regla)).toEqual(reglas);
    expect(violaciones.every((v) => v.archivo === archivo && v.mensaje !== '')).toBe(true);
  });
});
