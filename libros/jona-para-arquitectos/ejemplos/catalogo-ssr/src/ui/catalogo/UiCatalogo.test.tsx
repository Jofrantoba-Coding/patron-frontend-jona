// La Implementación del cliente, como en el capítulo 14: por la entrada, con un servicio real
// (la Implementación del servidor sobre el adaptador en memoria) y un espía solo para los errores.
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { crearServicioEnMemoria } from '../../../test/servicioEnMemoria';
import { cargarUiCatalogo } from './indexServidor';
import { UiCatalogo } from './index';

const PRODUCTOS = [
  { id: 'p-1', sku: 'TEC-001', nombre: 'Teclado mecánico', precio: 120, stock: 8 },
  { id: 'p-2', sku: 'MOU-002', nombre: 'Mouse inalámbrico', precio: 45.5, stock: 20 },
];

const filas = () =>
  within(screen.getByRole('table', { name: 'Productos' }))
    .getAllByRole('row')
    .slice(1)
    .map((fila) => within(fila).getAllByRole('cell').slice(0, 4).map((c) => c.textContent));

async function preparar(termino = '') {
  const { servicio, repositorio } = crearServicioEnMemoria(PRODUCTOS);
  const datos = await cargarUiCatalogo(repositorio, { termino });
  const consultar = vi.spyOn(servicio, 'consultar');
  render(<UiCatalogo datos={datos} servicio={servicio} />);
  return { servicio, consultar };
}

describe('UiCatalogo en el cliente', () => {
  it('muestra los datos del servidor sin volver a pedirlos, con el borrador en el término de la petición', async () => {
    const { consultar } = await preparar('tec');

    expect(filas()).toEqual([['TEC-001', 'Teclado mecánico', 'S/ 120.00', '8']]);
    expect((screen.getByRole('searchbox', { name: 'Buscar productos' }) as HTMLInputElement).value).toBe('tec');
    expect(consultar).not.toHaveBeenCalled();
  });

  it('buscar pide al servidor la cara de datos del nuevo término', async () => {
    const { consultar } = await preparar();
    const buscador = screen.getByRole('searchbox', { name: 'Buscar productos' });

    await userEvent.type(buscador, 'mouse{Enter}');

    await vi.waitFor(() => expect(filas()).toEqual([['MOU-002', 'Mouse inalámbrico', 'S/ 45.50', '20']]));
    expect(consultar).toHaveBeenCalledExactlyOnceWith('mouse');
  });

  it('eliminar pide confirmación, borra en el servidor y recarga la lista con el término actual', async () => {
    const { servicio, consultar } = await preparar();
    const eliminar = vi.spyOn(servicio, 'eliminar');

    await userEvent.click(screen.getByRole('button', { name: 'Eliminar Mouse inalámbrico' }));
    expect(screen.getByRole('alertdialog', { name: '¿Eliminar Mouse inalámbrico?' })).toBeDefined();
    await userEvent.click(within(screen.getByRole('alertdialog')).getByRole('button', { name: 'Eliminar' }));

    await vi.waitFor(() => expect(filas()).toEqual([['TEC-001', 'Teclado mecánico', 'S/ 120.00', '8']]));
    expect(eliminar).toHaveBeenCalledWith('p-2');
    expect(consultar).toHaveBeenCalledWith('');
    expect(screen.queryByRole('alertdialog')).toBeNull();
  });

  it('si el producto ya no existía, el diálogo se cierra igual', async () => {
    const { servicio } = await preparar();
    vi.spyOn(servicio, 'eliminar').mockResolvedValue('no-encontrado');

    await userEvent.click(screen.getByRole('button', { name: 'Eliminar Teclado mecánico' }));
    await userEvent.click(within(screen.getByRole('alertdialog')).getByRole('button', { name: 'Eliminar' }));

    await vi.waitFor(() => expect(screen.queryByRole('alertdialog')).toBeNull());
  });

  it('si el borrado falla, el diálogo sigue abierto con el error, y se puede cancelar', async () => {
    const { servicio } = await preparar();
    vi.spyOn(servicio, 'eliminar').mockRejectedValue(new Error('HTTP 502'));

    await userEvent.click(screen.getByRole('button', { name: 'Eliminar Teclado mecánico' }));
    await userEvent.click(within(screen.getByRole('alertdialog')).getByRole('button', { name: 'Eliminar' }));

    expect(await screen.findByText('No se pudo eliminar. Intente de nuevo.')).toBeDefined();
    await userEvent.keyboard('{Escape}');
    expect(screen.queryByRole('alertdialog')).toBeNull();
  });

  it('sin servicio, como se dibuja en el servidor, los eventos no hacen nada ni fallan', async () => {
    const { repositorio } = crearServicioEnMemoria(PRODUCTOS);
    render(<UiCatalogo datos={await cargarUiCatalogo(repositorio, {})} />);

    await userEvent.type(screen.getByRole('searchbox'), 'tec{Enter}');

    expect(filas()).toHaveLength(2);
  });
});
