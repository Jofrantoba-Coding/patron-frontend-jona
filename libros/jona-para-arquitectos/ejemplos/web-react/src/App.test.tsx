import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { App } from './App';
import { createAuthServiceFake } from './services/AuthServiceFake';

describe('App (raíz de composición)', () => {
  it('muestra la bienvenida tras iniciar sesión y permite cerrar la sesión', async () => {
    const user = userEvent.setup();
    render(<App service={createAuthServiceFake()} />);

    await user.type(screen.getByLabelText('Correo'), 'ana@ejemplo.com');
    await user.type(screen.getByLabelText('Contraseña'), 'secreta123');
    await user.click(screen.getByRole('button', { name: 'Ingresar' }));

    expect((await screen.findByRole('heading', { name: /Hola/ })).textContent).toBe('Hola, Ana Torres');
    await user.click(screen.getByRole('button', { name: 'Cerrar sesión' }));
    expect(screen.getByRole('heading', { name: 'Iniciar sesión' })).toBeTruthy();
  });

  it('permite elegir la forma extendida', async () => {
    const user = userEvent.setup();
    render(<App service={createAuthServiceFake()} />);

    const extended = screen.getByRole('button', { name: 'Forma extendida' });
    expect(extended.dataset.variant).toBe('outline');

    await user.click(extended);

    expect(extended.dataset.variant).toBe('default');
    expect(screen.getByRole('button', { name: 'Forma mínima' }).dataset.variant).toBe('outline');
  });
});
