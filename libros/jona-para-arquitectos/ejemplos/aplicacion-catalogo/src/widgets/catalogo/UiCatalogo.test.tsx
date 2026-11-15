import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { crearRepositorioMemoria } from '../../entities/producto';
import { UiCatalogo } from './index';

const PRODUCTOS = [
  { id: 'p-1', sku: 'TEC-001', nombre: 'Teclado mecánico', precio: 120, stock: 8 },
  { id: 'p-2', sku: 'MOU-002', nombre: 'Mouse inalámbrico', precio: 45.5, stock: 20 },
];

describe('UiCatalogo: el widget coordina dos funcionalidades que no se conocen', () => {
  it('eliminar desde la lista abre el diálogo y, al confirmar, la lista se recarga', async () => {
    render(<UiCatalogo repositorio={crearRepositorioMemoria(PRODUCTOS)} onEditar={() => {}} />);

    await userEvent.click(await screen.findByRole('button', { name: 'Eliminar Mouse inalámbrico' }));
    await userEvent.click(within(screen.getByRole('alertdialog', { name: '¿Eliminar Mouse inalámbrico?' })).getByRole('button', { name: 'Eliminar' }));

    await waitFor(() => expect(screen.queryByRole('button', { name: 'Eliminar Mouse inalámbrico' })).toBeNull());
    expect(screen.queryByRole('alertdialog')).toBeNull();
    expect(screen.getByRole('button', { name: 'Eliminar Teclado mecánico' })).toBeDefined();
  });

  it('cancelar cierra el diálogo sin tocar la lista, y el foco vuelve al botón', async () => {
    render(<UiCatalogo repositorio={crearRepositorioMemoria(PRODUCTOS)} onEditar={() => {}} />);
    const boton = await screen.findByRole('button', { name: 'Eliminar Mouse inalámbrico' });

    await userEvent.click(boton);
    await userEvent.click(screen.getByRole('button', { name: 'Cancelar' }));

    expect(screen.queryByRole('alertdialog')).toBeNull();
    expect(document.activeElement).toBe(boton);
  });
});
