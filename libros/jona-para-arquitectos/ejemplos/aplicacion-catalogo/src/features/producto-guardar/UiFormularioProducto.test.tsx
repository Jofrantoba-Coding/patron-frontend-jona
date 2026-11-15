import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { crearRepositorioMemoria } from '../../entities/producto';
import { ErrorRepositorio } from '../../shared/api';
import { UiFormularioProducto } from './index';

const TECLADO = { id: 'p-1', sku: 'TEC-001', nombre: 'Teclado mecánico', precio: 120, stock: 8 };

async function completar(valores: Record<string, string>) {
  for (const [etiqueta, valor] of Object.entries(valores)) {
    const campo = screen.getByRole('textbox', { name: etiqueta });
    await userEvent.clear(campo);
    if (valor) await userEvent.type(campo, valor);
  }
}

describe('UiFormularioProducto: alta', () => {
  it('un formulario inválido muestra un error por campo y no llama al repositorio', async () => {
    const repositorio = crearRepositorioMemoria();
    const crear = vi.spyOn(repositorio, 'crear');
    render(<UiFormularioProducto repositorio={repositorio} onGuardado={() => {}} onCancelar={() => {}} />);

    await completar({ SKU: 'tec1', Nombre: 'Te', 'Precio (S/)': '0', Stock: 'x' });
    await userEvent.click(screen.getByRole('button', { name: 'Guardar' }));

    expect(screen.getAllByRole('alert').map((a) => a.textContent)).toEqual([
      'Use el formato AAA-000',
      'Entre 3 y 60 caracteres',
      'Debe ser un número mayor que cero',
      'Debe ser un entero mayor o igual a cero',
    ]);
    expect(crear).not.toHaveBeenCalled();
  });

  it('corregir un campo quita su error, y solo el suyo', async () => {
    render(<UiFormularioProducto repositorio={crearRepositorioMemoria()} onGuardado={() => {}} onCancelar={() => {}} />);
    await userEvent.click(screen.getByRole('button', { name: 'Guardar' }));

    await completar({ SKU: 'TEC-001' });

    expect(screen.getByRole('textbox', { name: 'SKU' }).getAttribute('aria-invalid')).toBeNull();
    expect(screen.getByRole('textbox', { name: 'Nombre' }).getAttribute('aria-invalid')).toBe('true');
  });

  it('uno válido se crea normalizado y se avisa con el producto creado', async () => {
    const onGuardado = vi.fn();
    render(<UiFormularioProducto repositorio={crearRepositorioMemoria()} onGuardado={onGuardado} onCancelar={() => {}} />);

    await completar({ SKU: 'tec-001', Nombre: 'Teclado mecánico', 'Precio (S/)': '120,50', Stock: '8' });
    await userEvent.click(screen.getByRole('button', { name: 'Guardar' }));

    await waitFor(() => expect(onGuardado).toHaveBeenCalledWith({ id: 'p-1', sku: 'TEC-001', nombre: 'Teclado mecánico', precio: 120.5, stock: 8 }));
  });

  it('un SKU repetido se informa en su campo', async () => {
    render(<UiFormularioProducto repositorio={crearRepositorioMemoria([TECLADO])} onGuardado={() => {}} onCancelar={() => {}} />);

    await completar({ SKU: 'TEC-001', Nombre: 'Otro teclado', 'Precio (S/)': '99', Stock: '1' });
    await userEvent.click(screen.getByRole('button', { name: 'Guardar' }));

    expect((await screen.findByRole('alert')).textContent).toBe('Ya existe un producto con ese SKU');
    expect(screen.getByRole('textbox', { name: 'SKU' }).getAttribute('aria-invalid')).toBe('true');
  });

  it('sin conexión, el error es general y el formulario conserva lo escrito', async () => {
    const repositorio = crearRepositorioMemoria();
    vi.spyOn(repositorio, 'crear').mockRejectedValue(new ErrorRepositorio('red'));
    render(<UiFormularioProducto repositorio={repositorio} onGuardado={() => {}} onCancelar={() => {}} />);

    await completar({ SKU: 'TEC-001', Nombre: 'Teclado', 'Precio (S/)': '120', Stock: '8' });
    await userEvent.click(screen.getByRole('button', { name: 'Guardar' }));

    expect((await screen.findByRole('alert')).textContent).toBe('No se pudo guardar. Intente de nuevo.');
    expect(screen.getByRole('textbox', { name: 'Nombre' })).toHaveProperty('value', 'Teclado');
  });
});

describe('UiFormularioProducto: modificación', () => {
  it('carga el producto, y guardar lo actualiza', async () => {
    const repositorio = crearRepositorioMemoria([TECLADO]);
    const onGuardado = vi.fn();
    render(<UiFormularioProducto repositorio={repositorio} id="p-1" onGuardado={onGuardado} onCancelar={() => {}} />);

    expect(screen.getByRole('status').textContent).toBe('Cargando producto…');
    expect(await screen.findByRole('textbox', { name: 'Precio (S/)' })).toHaveProperty('value', '120.00');

    await completar({ Stock: '5' });
    await userEvent.click(screen.getByRole('button', { name: 'Guardar' }));

    await waitFor(() => expect(onGuardado).toHaveBeenCalledWith({ ...TECLADO, stock: 5 }));
    expect(await repositorio.obtener('p-1')).toEqual({ ...TECLADO, stock: 5 });
  });

  it('si el producto ya no existe, lo dice', async () => {
    render(<UiFormularioProducto repositorio={crearRepositorioMemoria()} id="p-9" onGuardado={() => {}} onCancelar={() => {}} />);

    expect((await screen.findByRole('alert')).textContent).toBe('El producto ya no existe');
  });
});
