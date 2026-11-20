// @vitest-environment node
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';
import { archivosFuente, caraDeDatos, esDelServidor, revisarArquitectura, type Regla } from './reglas';

const SRC = fileURLToPath(new URL('../../src', import.meta.url));
const fixture = (nombre: string) => fileURLToPath(new URL(`../fixtures/${nombre}/src`, import.meta.url));

describe('Arquitectura del renderizado en el servidor', () => {
  it('analiza el código de src/ y distingue el del servidor (la prueba no pasa por no encontrar archivos)', () => {
    const archivos = archivosFuente(SRC);

    expect(archivos.filter(esDelServidor)).toEqual([
      'servidor/ErrorRepositorio.ts',
      'servidor/InterProductoRepositorio.ts',
      'servidor/adaptadores/crearRepositorioHttp.ts',
      'servidor/adaptadores/crearRepositorioMemoria.ts',
      'servidor/crearRaizComposicion.ts',
      'servidor/crearServidorSsr.ts',
      'servidor/principal.ts',
      'servidor/renderizarPagina.tsx',
      'ui/catalogo/UiCatalogoImplServidor.ts',
      'ui/catalogo/indexServidor.ts',
    ]);
    expect(archivos.filter((a) => !esDelServidor(a))).toEqual([
      'cliente/crearServicioCatalogoFetch.ts',
      'cliente/entradaCliente.tsx',
      'compartido/datosIncrustados.ts',
      'dominio/Producto.ts',
      'ui/catalogo/InterServicioCatalogo.ts',
      'ui/catalogo/InterUiCatalogo.ts',
      'ui/catalogo/UiCatalogo.tsx',
      'ui/catalogo/UiCatalogoImplCliente.ts',
      'ui/catalogo/UiCatalogoView.tsx',
      'ui/catalogo/index.ts',
    ]);
  });

  it('encuentra la cara de datos del contrato de UI', () => {
    expect(caraDeDatos(SRC).tipos).toEqual(['DatosUiCatalogo']);
  });

  it('src/ cumple las cuatro reglas', () => {
    expect(revisarArquitectura(SRC)).toEqual([]);
  });
});

/** Cada árbol de test/fixtures contiene exactamente una violación: [árbol, regla que la detecta, archivo]. */
const CASOS: Array<[string, Regla, string]> = [
  ['cliente-importa-adaptador', 1, 'ui/catalogo/UiCatalogoImplCliente.ts'],
  ['cliente-importa-impl-servidor', 1, 'cliente/entradaCliente.tsx'],
  ['datos-con-funcion', 2, 'ui/catalogo/InterUiCatalogo.ts'],
  ['datos-con-fecha', 2, 'ui/catalogo/InterUiCatalogo.ts'],
  ['vista-con-reloj', 3, 'ui/catalogo/UiCatalogoView.tsx'],
  ['vista-con-window', 3, 'ui/catalogo/UiCatalogoView.tsx'],
  ['raiz-singleton', 4, 'servidor/crearRaizComposicion.ts'],
  ['usuario-en-el-modulo', 4, 'servidor/adaptadores/crearRepositorioHttp.ts'],
];

describe('Cada regla detecta lo que dice detectar', () => {
  it.each(CASOS)('%s: la regla %i señala %s', (nombre, regla, archivo) => {
    const violaciones = revisarArquitectura(fixture(nombre));

    expect(violaciones).toHaveLength(1);
    expect(violaciones[0]).toMatchObject({ regla, archivo });
    expect(violaciones[0].mensaje).not.toBe('');
  });
});
