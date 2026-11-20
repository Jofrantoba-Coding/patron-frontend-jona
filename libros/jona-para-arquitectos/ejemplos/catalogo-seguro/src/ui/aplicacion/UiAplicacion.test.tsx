import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { crearServicioFalso } from '../../cliente/servicioFalso';
import { UiAplicacion } from './index';

describe('UiAplicacion con el servicio falso (punto de sustitución 2)', () => {
  it('sin sesión pide entrar; con sesión muestra el catálogo; al salir, vuelve a pedir entrar', async () => {
    const { container } = render(<UiAplicacion servicio={crearServicioFalso()} />);

    await userEvent.type(await screen.findByRole('textbox', { name: 'Correo' }), 'ana@ejemplo.com');
    await userEvent.type(container.querySelector('input[type="password"]')!, 'cualquiera');
    await userEvent.click(screen.getByRole('button', { name: 'Entrar' }));
    expect(await screen.findByRole('heading', { name: 'Productos' })).toBeTruthy();

    await userEvent.click(screen.getByRole('button', { name: 'Salir' }));
    expect(await screen.findByRole('button', { name: 'Entrar' })).toBeTruthy();
  });
});
