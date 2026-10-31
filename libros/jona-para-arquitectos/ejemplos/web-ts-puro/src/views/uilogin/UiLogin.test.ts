import { getByLabelText, getByRole, queryByRole, waitFor } from '@testing-library/dom';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';
import type { Navigator } from '../../navigation/Navigator';
import { ApiError } from '../../services/ApiError';
import { createAuthServiceFake } from '../../services/AuthServiceFake';
import type { InterAuthService, LoginResult } from '../../services/InterAuthService';
import { UiLogin } from './UiLogin';
import { UiLoginImpl } from './UiLoginImpl';

const ANA: LoginResult = { token: 't-1', user: { id: 1, usuario: 'ana@ejemplo.com', nombre: 'Ana Torres' } };

afterEach(() => { document.body.innerHTML = ''; });

function mount(ui: UiLogin) {
  document.body.append(ui.element);
  return { root: ui.element, user: userEvent.setup() };
}

async function submitWith(root: HTMLElement, user: ReturnType<typeof userEvent.setup>, email: string, password: string) {
  if (email) await user.type(getByLabelText(root, 'Correo'), email);
  if (password) await user.type(getByLabelText(root, 'Contraseña'), password);
  await user.click(getByRole(root, 'button', { name: 'Ingresar' }));
}

const fakeNavigator = (): Navigator => ({ openHome: vi.fn(), openCreateAccount: vi.fn(), openRecoverPassword: vi.fn() });

function deferredService() {
  const pending: Array<{ resolve: (r: LoginResult) => void; reject: (e: unknown) => void }> = [];
  const login = vi.fn(() => new Promise<LoginResult>((resolve, reject) => { pending.push({ resolve, reject }); }));
  return { service: { login } satisfies InterAuthService, login, pending };
}

describe('UiLogin (Plantilla): comportamiento por defecto, sin integración', () => {
  it('construye el DOM y pide los datos faltantes', async () => {
    const { root, user } = mount(new UiLogin());

    await submitWith(root, user, 'ana@ejemplo.com', '');

    expect(getByRole(root, 'heading', { name: 'Iniciar sesión' })).toBeTruthy();
    expect(getByRole(root, 'status').textContent).toBe('Ingrese su correo y su contraseña.');
  });

  it('con datos completos no llama a ningún sistema', async () => {
    const { root, user } = mount(new UiLogin());

    await submitWith(root, user, 'ana@ejemplo.com', 'secreta123');
    await user.click(getByRole(root, 'button', { name: 'Crear cuenta' }));

    expect(getByRole(root, 'status').textContent).toBe('Crear cuenta (sin integración).');
  });
});

describe('UiLoginImpl (Implementación y entrada)', () => {
  it('inicia sesión y navega al inicio (enlace tardío: el botón de la Plantilla ejecuta este login)', async () => {
    const navigator = fakeNavigator();
    const { root, user } = mount(new UiLoginImpl(createAuthServiceFake(), navigator));

    await submitWith(root, user, 'ana@ejemplo.com', 'secreta123');

    await waitFor(() => expect(navigator.openHome).toHaveBeenCalledTimes(1));
    expect(vi.mocked(navigator.openHome).mock.calls[0][0].user.nombre).toBe('Ana Torres');
  });

  it.each([
    ['credenciales inválidas', createAuthServiceFake(), 'ana@ejemplo.com', 'otra', 'Correo o contraseña incorrectos.'],
    ['usuario bloqueado', createAuthServiceFake(), 'bloqueado@ejemplo.com', 'secreta123', 'Su usuario está bloqueado. Contacte al administrador.'],
    ['error del servidor', createAuthServiceFake({ escenario: 'errorServidor' }), 'ana@ejemplo.com', 'secreta123', 'No se pudo iniciar sesión. Intente de nuevo.'],
  ])('informa %s', async (_case, service, email, password, message) => {
    const navigator = fakeNavigator();
    const { root, user } = mount(new UiLoginImpl(service, navigator));

    await submitWith(root, user, email, password);

    await waitFor(() => expect(getByRole(root, 'status').textContent).toBe(message));
    expect(navigator.openHome).not.toHaveBeenCalled();
  });

  it('evita el doble envío y deshabilita el botón mientras la petición está en curso', async () => {
    const { service, login, pending } = deferredService();
    const navigator = fakeNavigator();
    const ui = new UiLoginImpl(service, navigator);
    const { root, user } = mount(ui);
    await user.type(getByLabelText(root, 'Correo'), 'ana@ejemplo.com');
    await user.type(getByLabelText(root, 'Contraseña'), 'secreta123');

    ui.login('ana@ejemplo.com', 'secreta123');
    ui.login('ana@ejemplo.com', 'secreta123');

    expect(login).toHaveBeenCalledTimes(1);
    expect((getByRole(root, 'button', { name: 'Ingresar' }) as HTMLButtonElement).disabled).toBe(true);
    pending[0].resolve(ANA);
    await waitFor(() => expect(navigator.openHome).toHaveBeenCalledTimes(1));
  });

  it('limpia el error anterior al reintentar', async () => {
    const { service, pending } = deferredService();
    const { root, user } = mount(new UiLoginImpl(service, fakeNavigator()));
    await submitWith(root, user, 'ana@ejemplo.com', 'otra');
    pending[0].reject(new ApiError(401, { code: 'INVALID_CREDENTIALS', message: 'x', details: [], traceId: 't' }));
    await waitFor(() => expect(getByRole(root, 'status').textContent).toBe('Correo o contraseña incorrectos.'));

    await user.click(getByRole(root, 'button', { name: 'Ingresar' }));

    expect(getByRole(root, 'status').textContent).toBe('');
    expect(queryByRole(root, 'status')).not.toBeNull();
  });

  it('delega la navegación secundaria en el Navigator', async () => {
    const navigator = fakeNavigator();
    const { root, user } = mount(new UiLoginImpl(createAuthServiceFake(), navigator));

    await user.click(getByRole(root, 'button', { name: 'Recuperar contraseña' }));

    expect(navigator.openRecoverPassword).toHaveBeenCalledTimes(1);
  });
});
