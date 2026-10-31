import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { createAuthServiceFake } from '../features/auth-login';
import { App } from './App';

describe('app (raíz de composición): de la página de inicio de sesión a la de bienvenida', () => {
  it('muestra la bienvenida tras iniciar sesión y vuelve al inicio de sesión al cerrarla', async () => {
    const user = userEvent.setup();
    render(<App service={createAuthServiceFake()} />);

    await user.type(screen.getByLabelText('Correo'), 'ana@ejemplo.com');
    await user.type(screen.getByLabelText('Contraseña'), 'secreta123');
    await user.click(screen.getByRole('button', { name: 'Ingresar' }));

    expect((await screen.findByRole('heading', { name: /Hola/ })).textContent).toBe('Hola, Ana Torres');
    await user.click(screen.getByRole('button', { name: 'Cerrar sesión' }));
    expect(screen.getByRole('heading', { name: 'Iniciar sesión' })).toBeTruthy();
  });
});
