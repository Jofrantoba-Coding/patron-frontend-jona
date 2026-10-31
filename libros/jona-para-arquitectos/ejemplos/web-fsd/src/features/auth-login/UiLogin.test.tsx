import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import type { LoginResult } from '../../entities/session';
// La prueba usa la funcionalidad como la usa el resto de la aplicación: por su API pública.
import { createAuthServiceFake, UiLogin, type InterAuthService } from './index';

const ANA: LoginResult = { token: 't-1', user: { id: 1, usuario: 'ana@ejemplo.com', nombre: 'Ana Torres' } };

/** Un servicio cuya respuesta controla la prueba. */
function deferredService() {
  const pending: Array<(result: LoginResult) => void> = [];
  const login = vi.fn(() => new Promise<LoginResult>((resolve) => { pending.push(resolve); }));
  return { service: { login } satisfies InterAuthService, login, pending };
}

function renderLogin(service: InterAuthService) {
  const onAuthenticated = vi.fn();
  render(<UiLogin service={service} onAuthenticated={onAuthenticated} />);
  return { onAuthenticated, user: userEvent.setup() };
}

async function submitWith(user: ReturnType<typeof userEvent.setup>, email: string, password: string) {
  if (email) await user.type(screen.getByLabelText('Correo'), email);
  if (password) await user.type(screen.getByLabelText('Contraseña'), password);
  await user.click(screen.getByRole('button', { name: 'Ingresar' }));
}

describe('features/auth-login: la entrada con el servicio falso', () => {
  it('aplica los valores por defecto de presentación', () => {
    renderLogin(createAuthServiceFake());

    expect(screen.getByRole('heading', { name: 'Iniciar sesión' })).toBeTruthy();
    expect(screen.getByRole('button', { name: 'Ingresar' })).toBeTruthy();
  });

  it('inicia sesión con credenciales válidas y entrega el resultado a onAuthenticated', async () => {
    const { onAuthenticated, user } = renderLogin(createAuthServiceFake());

    await submitWith(user, 'ana@ejemplo.com', 'secreta123');

    await waitFor(() => expect(onAuthenticated).toHaveBeenCalledTimes(1));
    expect(onAuthenticated.mock.calls[0][0].user.nombre).toBe('Ana Torres');
    expect(screen.queryByRole('alert')).toBeNull();
  });

  it('informa credenciales inválidas', async () => {
    const { onAuthenticated, user } = renderLogin(createAuthServiceFake());

    await submitWith(user, 'ana@ejemplo.com', 'otra');

    expect((await screen.findByRole('alert')).textContent).toBe('Correo o contraseña incorrectos.');
    expect(onAuthenticated).not.toHaveBeenCalled();
  });

  it.each([
    ['un usuario bloqueado', createAuthServiceFake(), 'bloqueado@ejemplo.com', 'Su usuario está bloqueado. Contacte al administrador.'],
    ['un error del servidor', createAuthServiceFake({ escenario: 'errorServidor' }), 'ana@ejemplo.com', 'No se pudo iniciar sesión. Intente de nuevo.'],
  ])('informa %s', async (_case, service, email, message) => {
    const { user } = renderLogin(service);

    await submitWith(user, email, 'secreta123');

    expect((await screen.findByRole('alert')).textContent).toBe(message);
  });

  it('pide los datos faltantes sin llamar al servicio', async () => {
    const { service, login } = deferredService();
    const { user } = renderLogin(service);

    await submitWith(user, 'ana@ejemplo.com', '');

    expect(screen.getByRole('alert').textContent).toBe('Ingrese su correo y su contraseña.');
    expect(login).not.toHaveBeenCalled();
  });

  it('evita el doble envío mientras la petición está en curso', async () => {
    const { service, login, pending } = deferredService();
    const { onAuthenticated, user } = renderLogin(service);
    await user.type(screen.getByLabelText('Correo'), 'ana@ejemplo.com');
    await user.type(screen.getByLabelText('Contraseña'), 'secreta123');
    const form = screen.getByRole('form', { name: 'Iniciar sesión' });

    act(() => {
      // Dos envíos en el mismo ciclo, antes de que React vuelva a dibujar.
      fireEvent.submit(form);
      fireEvent.submit(form);
    });

    expect(login).toHaveBeenCalledTimes(1);
    expect((screen.getByRole('button', { name: 'Ingresar' }) as HTMLButtonElement).disabled).toBe(true);
    await act(async () => pending[0](ANA));
    expect(onAuthenticated).toHaveBeenCalledTimes(1);
  });
});
