// @vitest-environment node
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';
import { archivosFuente, caraDeDatos, esDelServidor, revisarArquitectura, type Regla } from './reglas';

const SRC = fileURLToPath(new URL('../../src', import.meta.url));
const fixture = (nombre: string) => fileURLToPath(new URL(`../fixtures/${nombre}/src`, import.meta.url));

describe('Arquitectura: un código, dos modos de entrega', () => {
  it('analiza el código de src/ y distingue el del servidor (la prueba no pasa por no encontrar archivos)', () => {
    const archivos = archivosFuente(SRC);

    expect(archivos.filter(esDelServidor)).toEqual([
      'servidor/InterProductoRepositorio.ts',
      'servidor/adaptadores/crearRepositorioMemoria.ts',
      'servidor/archivos.ts',
      'servidor/componerDocumento.tsx',
      'servidor/crearRaizComposicion.ts',
      'servidor/crearServidorEstatico.ts',
      'servidor/crearServidorSsr.ts',
      'servidor/generarEstatico.ts',
      'servidor/generarSitioEstatico.ts',
      'servidor/previsualizarEstatico.ts',
      'servidor/principal.ts',
      'servidor/resolverPagina.ts',
      'servidor/sitemap.ts',
      'ui/catalogo/UiCatalogoImplServidor.ts',
      'ui/catalogo/indexServidor.ts',
      'ui/metadatosServidor.ts',
      'ui/noencontrado/UiNoEncontradoImplServidor.ts',
      'ui/noencontrado/indexServidor.ts',
      'ui/producto/UiProductoImplServidor.ts',
      'ui/producto/indexServidor.ts',
    ]);
    expect(archivos.filter((a) => /View\.tsx$/.test(a))).toEqual([
      'ui/catalogo/UiCatalogoView.tsx',
      'ui/noencontrado/UiNoEncontradoView.tsx',
      'ui/producto/UiProductoView.tsx',
    ]);
  });

  it('encuentra las caras de datos de los contratos de UI', () => {
    expect(caraDeDatos(SRC).tipos.sort()).toEqual(['DatosPagina', 'DatosUiCatalogo', 'DatosUiNoEncontrado', 'DatosUiProducto']);
  });

  it('src/ cumple las cinco reglas', () => {
    expect(revisarArquitectura(SRC)).toEqual([]);
  });
});

/** Cada árbol de test/fixtures contiene exactamente una violación: [árbol, regla que la detecta, archivo]. */
const CASOS: Array<[string, Regla, string]> = [
  ['cliente-importa-impl-servidor', 1, 'cliente/entradaCliente.tsx'],
  ['datos-con-fecha', 2, 'ui/producto/InterUiProducto.ts'],
  ['vista-con-window', 3, 'ui/catalogo/UiCatalogoView.tsx'],
  ['raiz-singleton', 4, 'servidor/crearRaizComposicion.ts'],
  ['vista-con-titulo', 5, 'ui/producto/UiProductoView.tsx'],
  ['vista-con-jsonld', 5, 'ui/producto/UiProductoView.tsx'],
];

describe('Cada regla detecta lo que dice detectar', () => {
  it('toda regla tiene al menos un árbol con una violación', () => {
    expect(new Set(CASOS.map(([, regla]) => regla))).toEqual(new Set([1, 2, 3, 4, 5]));
  });

  it.each(CASOS)('%s: la regla %i señala %s', (nombre, regla, archivo) => {
    const violaciones = revisarArquitectura(fixture(nombre));

    expect(violaciones).toHaveLength(1);
    expect(violaciones[0]).toMatchObject({ regla, archivo });
    expect(violaciones[0].mensaje).not.toBe('');
  });
});
