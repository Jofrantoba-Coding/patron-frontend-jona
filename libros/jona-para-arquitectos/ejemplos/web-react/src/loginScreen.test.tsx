import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { ApiError } from './services/ApiError';
import { createAuthServiceFake } from './services/AuthServiceFake';
import type { InterAuthService, LoginResult } from './services/InterAuthService';
import { UiLogin as UiLoginMinimal } from './uilogin';
import { UiLogin as UiLoginExtended } from './uiloginextendida';

const ANA: LoginResult = { token: 't-1', user: { id: 1, usuario: 'ana@ejemplo.com', nombre: 'Ana Torres' } };

/** Un servicio cuya respuesta controla la prueba. */
function deferredService() {
  const pending: Array<{ resolve: (r: LoginResult) => void; reject: (e: unknown) => void }> = [];
  const login = vi.fn(() => new Promise<LoginResult>((resolve, reject) => { pending.push({ resolve, reject }); }));
  return { service: { login } satisfies InterAuthService, login, pending };
}

const invalidCredentials = () =>
  new ApiError(401, { code: 'INVALID_CREDENTIALS', message: 'x', details: [], traceId: 't' });

// La misma suite recorre las dos formas: la forma es una decisión de implementación,
// el comportamiento observable es el mismo.
describe.each([
  ['forma mínima (variante a)', UiLoginMinimal],
  ['forma extendida', UiLoginExtended],
])('Inicio de sesión, %s', (_form, UiLogin) => {
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

  it('aplica los valores por defecto de presentación', () => {
    renderLogin(createAuthServiceFake());

    expect(screen.getByRole('heading', { name: 'Iniciar sesión' })).toBeTruthy();
    expect(screen.getByRole('button', { name: 'Ingresar' })).toBeTruthy();
  });

  it('inicia sesión con credenciales válidas', async () => {
    const { onAuthenticated, user } = renderLogin(createAuthServiceFake());

    await submitWith(user, 'ana@ejemplo.com', 'secreta123');

    await waitFor(() => expect(onAuthenticated).toHaveBeenCalledTimes(1));
    expect(onAuthenticated.mock.calls[0][0].user.nombre).toBe('Ana Torres');
    expect(screen.queryByRole('alert')).toBeNull();
  });

  it('pide los datos faltantes sin llamar al servicio', async () => {
    const { service, login } = deferredService();
    const { user } = renderLogin(service);

    await submitWith(user, 'ana@ejemplo.com', '');

    expect(screen.getByRole('alert').textContent).toBe('Ingrese su correo y su contraseña.');
    expect(login).not.toHaveBeenCalled();
  });

  it('informa credenciales inválidas', async () => {
    const { onAuthenticated, user } = renderLogin(createAuthServiceFake());

    await submitWith(user, 'ana@ejemplo.com', 'otra');

    expect((await screen.findByRole('alert')).textContent).toBe('Correo o contraseña incorrectos.');
    expect(onAuthenticated).not.toHaveBeenCalled();
  });

  it('informa un usuario bloqueado', async () => {
    const { user } = renderLogin(createAuthServiceFake());

    await submitWith(user, 'bloqueado@ejemplo.com', 'secreta123');

    expect((await screen.findByRole('alert')).textContent).toBe('Su usuario está bloqueado. Contacte al administrador.');
  });

  it('informa un error del servidor', async () => {
    const { user } = renderLogin(createAuthServiceFake({ escenario: 'errorServidor' }));

    await submitWith(user, 'ana@ejemplo.com', 'secreta123');

    expect((await screen.findByRole('alert')).textContent).toBe('No se pudo iniciar sesión. Intente de nuevo.');
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
    await act(async () => pending[0].resolve(ANA));
    expect(onAuthenticated).toHaveBeenCalledTimes(1);
  });

  it('limpia el error anterior al reintentar', async () => {
    const { service, pending } = deferredService();
    const { user } = renderLogin(service);
    await submitWith(user, 'ana@ejemplo.com', 'otra');
    await act(async () => pending[0].reject(invalidCredentials()));
    expect(screen.getByRole('alert').textContent).toBe('Correo o contraseña incorrectos.');

    await user.click(screen.getByRole('button', { name: 'Ingresar' }));

    expect(screen.queryByRole('alert')).toBeNull();
    await act(async () => pending[1].resolve(ANA));
  });
});
