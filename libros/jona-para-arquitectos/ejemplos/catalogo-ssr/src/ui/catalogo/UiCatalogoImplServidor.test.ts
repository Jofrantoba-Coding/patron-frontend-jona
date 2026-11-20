// @vitest-environment node
// La Implementación del servidor sin DOM: el adaptador en memoria y una función. Nada de React.
import { describe, expect, it, vi } from 'vitest';
import { crearRepositorioMemoria } from '../../servidor/adaptadores/crearRepositorioMemoria';
import { ErrorRepositorio } from '../../servidor/ErrorRepositorio';
import { cargarUiCatalogo, eliminarProducto } from './UiCatalogoImplServidor';

const PRODUCTOS = [
  { id: 'p-1', sku: 'TEC-001', nombre: 'Teclado mecánico', precio: 120, stock: 8 },
  { id: 'p-2', sku: 'MOU-002', nombre: 'Mouse inalámbrico', precio: 45.5, stock: 20 },
];

describe('cargarUiCatalogo: (repositorio, petición) → cara de datos', () => {
  it('carga por el puerto y llena el contrato de UI, con el precio ya formateado', async () => {
    const datos = await cargarUiCatalogo(crearRepositorioMemoria(PRODUCTOS), {});

    expect(datos).toEqual({
      termino: '',
      productos: [
        { id: 'p-2', sku: 'MOU-002', nombre: 'Mouse inalámbrico', precio: 'S/ 45.50', stock: 20 },
        { id: 'p-1', sku: 'TEC-001', nombre: 'Teclado mecánico', precio: 'S/ 120.00', stock: 8 },
      ],
    });
  });

  it('el término de la petición filtra, recortado', async () => {
    const datos = await cargarUiCatalogo(crearRepositorioMemoria(PRODUCTOS), { termino: '  tec ' });

    expect([datos.termino, datos.productos.map((p) => p.sku)]).toEqual(['tec', ['TEC-001']]);
  });

  it('lo que produce sobrevive a JSON intacto: es lo que viaja en el HTML', async () => {
    const datos = await cargarUiCatalogo(crearRepositorioMemoria(PRODUCTOS), { termino: 'o' });

    expect(JSON.parse(JSON.stringify(datos))).toStrictEqual(datos);
  });

  it('si el repositorio falla, la página sale igual, con un aviso', async () => {
    const repositorio = crearRepositorioMemoria(PRODUCTOS);
    vi.spyOn(repositorio, 'listar').mockRejectedValue(new ErrorRepositorio('red'));

    expect(await cargarUiCatalogo(repositorio, { termino: 'x' })).toEqual({ termino: 'x', productos: [], aviso: 'No se pudo cargar el catálogo' });
  });
});

describe('eliminarProducto: la mutación del lado del servidor', () => {
  it('elimina, y un id que ya no existe es no-encontrado, no un error', async () => {
    const repositorio = crearRepositorioMemoria(PRODUCTOS);

    expect(await eliminarProducto(repositorio, 'p-1')).toBe('eliminado');
    expect(await eliminarProducto(repositorio, 'p-1')).toBe('no-encontrado');
    expect((await repositorio.listar()).map((p) => p.id)).toEqual(['p-2']);
  });

  it('cualquier otro error del repositorio se propaga', async () => {
    const repositorio = crearRepositorioMemoria(PRODUCTOS);
    vi.spyOn(repositorio, 'eliminar').mockRejectedValue(new ErrorRepositorio('red'));

    await expect(eliminarProducto(repositorio, 'p-1')).rejects.toMatchObject({ tipo: 'red' });
  });
});
