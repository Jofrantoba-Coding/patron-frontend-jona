// @vitest-environment node
// El caso de uso se prueba con el adaptador en memoria: sin React, sin DOM y sin red.
import { describe, expect, it, vi } from 'vitest';
import { crearRepositorioMemoria, type BorradorProducto } from '../../../entities/producto';
import { ErrorRepositorio } from '../../../shared/api';
import { guardarProducto } from './guardarProducto';

const BORRADOR: BorradorProducto = { sku: 'tec-001', nombre: 'Teclado', precio: '120', stock: '8' };

describe('guardarProducto', () => {
  it('sin id crea; con id actualiza', async () => {
    const repositorio = crearRepositorioMemoria();

    const creado = await guardarProducto(repositorio, BORRADOR);
    expect(creado).toEqual({ ok: true, producto: { id: 'p-1', sku: 'TEC-001', nombre: 'Teclado', precio: 120, stock: 8 } });

    const actualizado = await guardarProducto(repositorio, { ...BORRADOR, stock: '3' }, 'p-1');
    expect(actualizado).toMatchObject({ ok: true, producto: { id: 'p-1', stock: 3 } });
  });

  it('un borrador inválido no llega al repositorio', async () => {
    const repositorio = crearRepositorioMemoria();
    const crear = vi.spyOn(repositorio, 'crear');

    expect(await guardarProducto(repositorio, { ...BORRADOR, precio: '0' })).toEqual({
      ok: false,
      errores: { precio: 'Debe ser un número mayor que cero' },
    });
    expect(crear).not.toHaveBeenCalled();
  });

  it('el conflicto del repositorio se convierte en un error del campo SKU', async () => {
    const repositorio = crearRepositorioMemoria();
    await guardarProducto(repositorio, BORRADOR);

    expect(await guardarProducto(repositorio, { ...BORRADOR, nombre: 'Otro teclado' })).toEqual({
      ok: false,
      errores: { sku: 'Ya existe un producto con ese SKU' },
    });
  });

  it('cualquier otro error del repositorio sigue su camino: lo decide la pantalla', async () => {
    const repositorio = crearRepositorioMemoria();
    vi.spyOn(repositorio, 'crear').mockRejectedValue(new ErrorRepositorio('red'));

    await expect(guardarProducto(repositorio, BORRADOR)).rejects.toMatchObject({ tipo: 'red' });
  });
});
