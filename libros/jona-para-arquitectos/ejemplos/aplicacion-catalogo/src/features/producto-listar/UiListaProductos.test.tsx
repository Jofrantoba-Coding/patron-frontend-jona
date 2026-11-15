import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { crearRepositorioMemoria } from '../../entities/producto';
import { ErrorRepositorio } from '../../shared/api';
import { UiListaProductos } from './index';

const PRODUCTOS = [
  { id: 'p-1', sku: 'TEC-001', nombre: 'Teclado mecánico', precio: 120, stock: 8 },
  { id: 'p-2', sku: 'MOU-002', nombre: 'Mouse inalámbrico', precio: 45.5, stock: 20 },
];

const filas = () =>
  within(screen.getByRole('table', { name: 'Productos' }))
    .getAllByRole('row')
    .slice(1)
    .map((fila) => within(fila).getAllByRole('cell').slice(0, 4).map((c) => c.textContent));

describe('UiListaProductos', () => {
  it('carga los productos ordenados por SKU, con el precio en soles', async () => {
    render(<UiListaProductos repositorio={crearRepositorioMemoria(PRODUCTOS)} onEditar={() => {}} onEliminar={() => {}} />);

    expect(await screen.findByRole('button', { name: 'Editar Mouse inalámbrico' })).toBeDefined();
    expect(filas()).toEqual([
      ['MOU-002', 'Mouse inalámbrico', 'S/ 45.50', '20'],
      ['TEC-001', 'Teclado mecánico', 'S/ 120.00', '8'],
    ]);
  });

  it('buscar pide al repositorio solo lo que coincide', async () => {
    const repositorio = crearRepositorioMemoria(PRODUCTOS);
    const listar = vi.spyOn(repositorio, 'listar');
    render(<UiListaProductos repositorio={repositorio} onEditar={() => {}} onEliminar={() => {}} />);
    await screen.findByRole('button', { name: 'Editar Mouse inalámbrico' });

    await userEvent.type(screen.getByRole('searchbox', { name: 'Buscar productos' }), 'tec{Enter}');

    await vi.waitFor(() => expect(filas()).toEqual([['TEC-001', 'Teclado mecánico', 'S/ 120.00', '8']]));
    expect(listar.mock.calls.map(([termino]) => termino)).toEqual(['', 'tec']);
  });

  it('sin coincidencias muestra el texto vacío', async () => {
    render(<UiListaProductos repositorio={crearRepositorioMemoria(PRODUCTOS)} onEditar={() => {}} onEliminar={() => {}} />);
    await screen.findByRole('button', { name: 'Editar Mouse inalámbrico' });

    await userEvent.type(screen.getByRole('searchbox'), 'zzz{Enter}');

    expect((await screen.findByText('No hay productos que coincidan')).getAttribute('role')).toBe('status');
  });

  it('las acciones entregan el id para editar y el producto para eliminar', async () => {
    const onEditar = vi.fn();
    const onEliminar = vi.fn();
    render(<UiListaProductos repositorio={crearRepositorioMemoria(PRODUCTOS)} onEditar={onEditar} onEliminar={onEliminar} />);

    await userEvent.click(await screen.findByRole('button', { name: 'Editar Teclado mecánico' }));
    await userEvent.click(screen.getByRole('button', { name: 'Eliminar Mouse inalámbrico' }));

    expect(onEditar).toHaveBeenCalledWith('p-1');
    expect(onEliminar).toHaveBeenCalledWith(PRODUCTOS[1]);
  });

  it('si el repositorio falla, lo dice', async () => {
    const repositorio = crearRepositorioMemoria();
    vi.spyOn(repositorio, 'listar').mockRejectedValue(new ErrorRepositorio('red'));
    render(<UiListaProductos repositorio={repositorio} onEditar={() => {}} onEliminar={() => {}} />);

    expect((await screen.findByRole('alert')).textContent).toBe('No se pudo cargar el catálogo');
  });
});
