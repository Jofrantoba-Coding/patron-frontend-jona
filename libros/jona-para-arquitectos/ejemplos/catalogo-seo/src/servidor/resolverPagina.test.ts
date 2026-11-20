// @vitest-environment node
// El núcleo compartido por los dos modos: la página y el estado de cada URL.
import { describe, expect, it } from 'vitest';
import { crearRepositorioMemoria } from './adaptadores/crearRepositorioMemoria';
import { PRODUCTOS_DE_EJEMPLO } from './crearRaizComposicion';
import { resolverPagina } from './resolverPagina';

const resolver = (ruta: string) => resolverPagina(new URL(ruta, 'https://catalogo.example'), crearRepositorioMemoria(PRODUCTOS_DE_EJEMPLO));

describe('resolverPagina', () => {
  it('/ es el catálogo; /buscar?q= la búsqueda; /productos/<sku> la ficha', async () => {
    const [inicio, busqueda, ficha] = await Promise.all([resolver('/'), resolver('/buscar?q=mouse'), resolver('/productos/TEC-001')]);

    expect([inicio.estado, inicio.pagina.unidad, inicio.pagina.datos]).toMatchObject([200, 'catalogo', { productos: expect.any(Array) }]);
    expect([busqueda.estado, busqueda.pagina]).toMatchObject([200, { unidad: 'catalogo', datos: { termino: 'mouse' } }]);
    expect([ficha.estado, ficha.pagina]).toMatchObject([200, { unidad: 'producto', datos: { sku: 'TEC-001' } }]);
  });

  it('la barra final no cambia la página', async () => {
    expect((await resolver('/productos/TEC-001/')).pagina).toEqual((await resolver('/productos/TEC-001')).pagina);
  });

  it.each([
    '/productos/NO-EXISTE',
    '/productos/tec-001',
    '/productos/',
    '/productos/TEC-001/extra',
    '/productos/%E0%A4%A',
    '/productos',
    '/otra-cosa',
    '/index.html',
  ])('%s: un producto o una ruta que no existe nunca responde 200', async (ruta) => {
    const { estado, pagina } = await resolver(ruta);

    expect(estado).toBe(404);
    expect(pagina.unidad).toBe('no-encontrado');
  });
});
