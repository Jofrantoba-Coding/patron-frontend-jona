import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { crearRepositorioMemoria } from '../../entities/producto';
import { ErrorRepositorio } from '../../shared/api';
import { UiEliminarProducto } from './index';

const MOUSE = { id: 'p-2', sku: 'MOU-002', nombre: 'Mouse inalámbrico', precio: 45.5, stock: 20 };

describe('UiEliminarProducto', () => {
  it('sin producto, el diálogo está cerrado', () => {
    const { container } = render(<UiEliminarProducto repositorio={crearRepositorioMemoria()} onEliminado={() => {}} onCerrar={() => {}} />);

    expect(container.innerHTML).toBe('');
  });

  it('confirmar elimina el producto y avisa', async () => {
    const repositorio = crearRepositorioMemoria([MOUSE]);
    const onEliminado = vi.fn();
    render(<UiEliminarProducto repositorio={repositorio} producto={MOUSE} onEliminado={onEliminado} onCerrar={() => {}} />);

    expect(screen.getByRole('alertdialog', { name: '¿Eliminar Mouse inalámbrico?' })).toBeDefined();
    await userEvent.click(screen.getByRole('button', { name: 'Eliminar' }));

    await waitFor(() => expect(onEliminado).toHaveBeenCalledOnce());
    expect(await repositorio.listar()).toEqual([]);
  });

  it('si ya no existe, cuenta como eliminado', async () => {
    const onEliminado = vi.fn();
    render(<UiEliminarProducto repositorio={crearRepositorioMemoria()} producto={MOUSE} onEliminado={onEliminado} onCerrar={() => {}} />);

    await userEvent.click(screen.getByRole('button', { name: 'Eliminar' }));

    await waitFor(() => expect(onEliminado).toHaveBeenCalledOnce());
  });

  it('si falla, el diálogo sigue abierto con el error, y se puede cancelar', async () => {
    const repositorio = crearRepositorioMemoria([MOUSE]);
    vi.spyOn(repositorio, 'eliminar').mockRejectedValue(new ErrorRepositorio('red'));
    const onCerrar = vi.fn();
    render(<UiEliminarProducto repositorio={repositorio} producto={MOUSE} onEliminado={() => {}} onCerrar={onCerrar} />);

    await userEvent.click(screen.getByRole('button', { name: 'Eliminar' }));

    expect(await screen.findByText('No se pudo eliminar. Intente de nuevo.')).toBeDefined();
    await userEvent.keyboard('{Escape}');
    expect(onCerrar).toHaveBeenCalledOnce();
  });
});
