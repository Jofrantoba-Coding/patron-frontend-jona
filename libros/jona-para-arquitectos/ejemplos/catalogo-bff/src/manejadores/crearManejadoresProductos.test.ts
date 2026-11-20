// Los manejadores con los falsos: componen un producto de dos backends, traducen los formatos,
// compensan una escritura a medias y no deciden ninguna regla de negocio.
import { describe, expect, it, vi } from 'vitest';
import { crearCatalogoFalso } from '../../test/falsos/crearCatalogoFalso.js';
import { crearInventarioFalso } from '../../test/falsos/crearInventarioFalso.js';
import { ErrorBackend } from '../puertos/ErrorBackend.js';
import type { Articulo } from '../puertos/InterCatalogo.js';
import { crearManejadoresProductos } from './crearManejadoresProductos.js';

const TECLADO_ARTICULO: Articulo = { codigoArticulo: 'ART-0001', sku: 'TEC-001', titulo: 'Teclado mecánico', precioCentimos: 12000 };
const MOUSE_ARTICULO: Articulo = { codigoArticulo: 'ART-0002', sku: 'MOU-002', titulo: 'Mouse inalámbrico', precioCentimos: 4550 };
const TECLADO = { sku: 'TEC-001', nombre: 'Teclado mecánico', precio: 120, stock: 8 };

function preparar(articulos: Articulo[] = [TECLADO_ARTICULO, MOUSE_ARTICULO], existencias = [{ sku: 'TEC-001', unidades: 8 }, { sku: 'MOU-002', unidades: 20 }]) {
  const catalogo = crearCatalogoFalso(articulos);
  const inventario = crearInventarioFalso(existencias);
  return { catalogo, inventario, api: crearManejadoresProductos({ catalogo, inventario }) };
}

const tipoDeError = (promesa: Promise<unknown>) => promesa.then(() => 'sin error', (e: unknown) => (e instanceof ErrorBackend ? e.tipo : String(e)));

describe('manejadores de productos: lectura', () => {
  it('listar compone cada producto con catalogo e inventario, y traduce céntimos a soles y título a nombre', async () => {
    const { api } = preparar();

    expect(await api.listar()).toEqual([
      { id: 'ART-0002', sku: 'MOU-002', nombre: 'Mouse inalámbrico', precio: 45.5, stock: 20 },
      { id: 'ART-0001', sku: 'TEC-001', nombre: 'Teclado mecánico', precio: 120, stock: 8 },
    ]);
  });

  it('listar pide las existencias en una sola llamada, no una por producto', async () => {
    const { api, inventario } = preparar();
    const consultar = vi.spyOn(inventario, 'consultar');

    await api.listar();

    expect(consultar.mock.calls).toEqual([[['MOU-002', 'TEC-001']]]);
  });

  it('el término de búsqueda lo resuelve catalogo; un artículo sin registro de inventario tiene stock 0', async () => {
    const { api, catalogo } = preparar([TECLADO_ARTICULO], []);
    const buscar = vi.spyOn(catalogo, 'buscar');

    expect(await api.listar('tecl')).toEqual([{ id: 'ART-0001', sku: 'TEC-001', nombre: 'Teclado mecánico', precio: 120, stock: 0 }]);
    expect(buscar).toHaveBeenCalledWith('tecl');
  });

  it('obtener devuelve undefined si catalogo no tiene el artículo', async () => {
    const { api } = preparar();

    expect(await api.obtener('ART-0001')).toEqual({ id: 'ART-0001', ...TECLADO });
    expect(await api.obtener('no-existe')).toBeUndefined();
  });
});

describe('manejadores de productos: escrituras en dos backends', () => {
  it('crear registra primero en catalogo y después en inventario, con el formato de cada uno', async () => {
    const { api, catalogo, inventario } = preparar([], []);

    const producto = await api.crear({ sku: 'AUD-004', nombre: 'Audífonos', precio: 89.9, stock: 12 });

    expect(producto).toEqual({ id: expect.any(String), sku: 'AUD-004', nombre: 'Audífonos', precio: 89.9, stock: 12 });
    expect(await catalogo.obtener(producto.id)).toEqual({ codigoArticulo: producto.id, sku: 'AUD-004', titulo: 'Audífonos', precioCentimos: 8990 });
    expect(await inventario.consultar(['AUD-004'])).toEqual([{ sku: 'AUD-004', unidades: 12 }]);
  });

  it('el conflicto de SKU lo decide catalogo; el BFF lo deja pasar y no toca inventario', async () => {
    const { api, inventario } = preparar();
    const fijar = vi.spyOn(inventario, 'fijar');

    expect(await tipoDeError(api.crear({ ...TECLADO, nombre: 'Otro teclado' }))).toBe('conflicto');
    expect(fijar).not.toHaveBeenCalled();
  });

  it('compensación: si inventario falla al crear, se elimina el artículo de catalogo y el error es no-disponible', async () => {
    const { api, catalogo, inventario } = preparar([], []);
    vi.spyOn(inventario, 'fijar').mockRejectedValue(new ErrorBackend('no-disponible', 'inventario no responde'));
    const eliminar = vi.spyOn(catalogo, 'eliminar');

    const error = await api.crear({ sku: 'AUD-004', nombre: 'Audífonos', precio: 89.9, stock: 12 }).catch((e: unknown) => e);

    expect(error).toMatchObject({ tipo: 'no-disponible', message: 'inventario no registró el stock; el alta se deshizo' });
    expect(eliminar).toHaveBeenCalledOnce();
    expect(await catalogo.buscar('')).toEqual([]);
  });

  it('si la compensación también falla, el error sigue siendo no-disponible y lo dice', async () => {
    const { api, catalogo, inventario } = preparar([], []);
    vi.spyOn(inventario, 'fijar').mockRejectedValue(new ErrorBackend('no-disponible'));
    vi.spyOn(catalogo, 'eliminar').mockRejectedValue(new ErrorBackend('no-disponible'));

    const error = await api.crear({ sku: 'AUD-004', nombre: 'Audífonos', precio: 89.9, stock: 12 }).catch((e: unknown) => e);

    expect(error).toMatchObject({ tipo: 'no-disponible', message: expect.stringContaining('no se pudo deshacer') });
  });

  it('actualizar cambia los dos backends; si cambia el SKU, el registro viejo de inventario se quita', async () => {
    const { api, inventario } = preparar();

    const actualizado = await api.actualizar('ART-0001', { ...TECLADO, sku: 'TEC-009', stock: 3 });

    expect(actualizado).toEqual({ id: 'ART-0001', ...TECLADO, sku: 'TEC-009', stock: 3 });
    expect(await inventario.consultar(['TEC-001', 'TEC-009'])).toEqual([{ sku: 'TEC-009', unidades: 3 }]);
  });

  it('compensación al actualizar: si inventario falla, catalogo vuelve a los datos anteriores', async () => {
    const { api, catalogo, inventario } = preparar();
    vi.spyOn(inventario, 'fijar').mockRejectedValue(new ErrorBackend('no-disponible'));

    expect(await tipoDeError(api.actualizar('ART-0001', { ...TECLADO, precio: 99.9 }))).toBe('no-disponible');
    expect(await catalogo.obtener('ART-0001')).toEqual(TECLADO_ARTICULO);
  });

  it('actualizar o eliminar un id que no existe es no-encontrado', async () => {
    const { api } = preparar();

    expect(await tipoDeError(api.actualizar('no-existe', TECLADO))).toBe('no-encontrado');
    expect(await tipoDeError(api.eliminar('no-existe'))).toBe('no-encontrado');
  });

  it('eliminar quita de catalogo y de inventario; si inventario falla después, el producto igual ya no se ve', async () => {
    const { api, inventario } = preparar();
    vi.spyOn(inventario, 'eliminar').mockRejectedValueOnce(new ErrorBackend('no-disponible'));

    await api.eliminar('ART-0001');

    expect((await api.listar()).map((p) => p.sku)).toEqual(['MOU-002']);
  });
});
