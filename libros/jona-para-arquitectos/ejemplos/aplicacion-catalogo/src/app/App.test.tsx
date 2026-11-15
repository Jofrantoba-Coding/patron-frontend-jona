// De punta a punta: la aplicación completa con el adaptador en memoria. Alta, consulta,
// modificación y baja por la interfaz, como lo haría un usuario.
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { crearRepositorioMemoria } from '../entities/producto';
import { App } from './App';
import { PRODUCTOS_DE_EJEMPLO } from './crearRepositorio';

const skus = async () => {
  await screen.findAllByRole('button', { name: /^Editar / });
  return within(screen.getByRole('table')).getAllByRole('row').slice(1).map((fila) => within(fila).getAllByRole('cell')[0].textContent);
};

async function escribir(etiqueta: string, valor: string) {
  const campo = await screen.findByRole('textbox', { name: etiqueta });
  await userEvent.clear(campo);
  await userEvent.type(campo, valor);
}

describe('App: catálogo de productos', () => {
  it('alta, modificación y baja de un producto', async () => {
    render(<App repositorio={crearRepositorioMemoria(PRODUCTOS_DE_EJEMPLO)} />);
    expect(await skus()).toEqual(['MON-003', 'MOU-002', 'TEC-001']);

    // Alta
    await userEvent.click(screen.getByRole('button', { name: 'Nuevo producto' }));
    expect(screen.getByRole('heading', { level: 1 }).textContent).toBe('Nuevo producto');
    await escribir('SKU', 'aud-004');
    await escribir('Nombre', 'Audífonos');
    await escribir('Precio (S/)', '89.90');
    await escribir('Stock', '12');
    await userEvent.click(screen.getByRole('button', { name: 'Guardar' }));
    expect(await skus()).toEqual(['AUD-004', 'MON-003', 'MOU-002', 'TEC-001']);

    // Modificación
    await userEvent.click(screen.getByRole('button', { name: 'Editar Audífonos' }));
    expect(screen.getByRole('heading', { level: 1 }).textContent).toBe('Editar producto');
    await escribir('Precio (S/)', '79.90');
    await userEvent.click(screen.getByRole('button', { name: 'Guardar' }));
    expect(await screen.findByRole('cell', { name: 'S/ 79.90' })).toBeDefined();

    // Baja
    await userEvent.click(screen.getByRole('button', { name: 'Eliminar Audífonos' }));
    await userEvent.click(within(screen.getByRole('alertdialog')).getByRole('button', { name: 'Eliminar' }));
    expect(await skus()).toEqual(['MON-003', 'MOU-002', 'TEC-001']);
  });

  it('cancelar un alta vuelve al catálogo sin cambios', async () => {
    render(<App repositorio={crearRepositorioMemoria(PRODUCTOS_DE_EJEMPLO)} />);
    await skus();

    await userEvent.click(screen.getByRole('button', { name: 'Nuevo producto' }));
    await escribir('Nombre', 'A medias');
    await userEvent.click(screen.getByRole('button', { name: 'Cancelar' }));

    expect(await skus()).toEqual(['MON-003', 'MOU-002', 'TEC-001']);
  });
});
