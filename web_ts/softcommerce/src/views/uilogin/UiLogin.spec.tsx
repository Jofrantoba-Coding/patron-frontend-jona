import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { describe, expect, it, vi } from 'vitest';
import { ApiError } from '../../services/ApiError';
import type { InterAuthService } from '../../services/InterAuthService';
import { SessionProvider } from '../../session/SessionProvider';
import { createSessionStore } from '../../session/sessionStore';
import { UiLogin } from './UiLogin';

const loginResult = { token: 'tok-9', user: { id_usuario: 1, usuario: 'admin', nombre: 'Administrador' } };

function apiError(status: number, code: string, message: string, traceId = 'trace-1') {
  return new ApiError(status, { code, message, details: [], traceId });
}

function fakeService(overrides: Partial<InterAuthService> = {}): InterAuthService {
  return {
    sessionOptions: vi.fn().mockResolvedValue([{ id: 'demo', name: 'Demo' }, { id: 'botica', name: 'Botica' }]),
    login: vi.fn().mockResolvedValue(loginResult),
    empresas: vi.fn(),
    puntosVenta: vi.fn(),
    params: vi.fn(),
    ...overrides,
  };
}

async function renderLogin(service: InterAuthService) {
  sessionStorage.clear();
  const store = createSessionStore(sessionStorage);
  render(
    <SessionProvider store={store}>
      <MemoryRouter initialEntries={['/login']}>
        <Routes>
          <Route path="/login" element={<UiLogin service={service} />} />
          <Route path="/contexto" element={<p>step 2</p>} />
        </Routes>
      </MemoryRouter>
    </SessionProvider>,
  );
  await screen.findByRole('option', { name: 'Botica' });
  return { store, user: userEvent.setup() };
}

async function fill(user: ReturnType<typeof userEvent.setup>, { tenant = 'demo', usuario = 'admin', clave = 'admin123' } = {}) {
  await user.selectOptions(screen.getByLabelText(/Empresa|Base de datos/i), tenant);
  if (usuario) await user.type(screen.getByLabelText(/Usuario/i), usuario);
  if (clave) await user.type(screen.getByLabelText(/Contraseña/i), clave);
}

const submit = (user: ReturnType<typeof userEvent.setup>) => user.click(screen.getByRole('button', { name: 'Ingresar' }));

describe('UiLogin step 1', () => {
  it('loads the tenants from sessionOptions into the selector', async () => {
    const service = fakeService();
    await renderLogin(service);

    expect(service.sessionOptions).toHaveBeenCalledTimes(1);
    expect(screen.getByRole('option', { name: 'Demo' })).toBeTruthy();
  });

  it('S-AUTH-5 empty user blocks the call and shows the field error', async () => {
    const service = fakeService();
    const { user } = await renderLogin(service);
    await fill(user, { usuario: '' });
    await submit(user);

    expect(service.login).not.toHaveBeenCalled();
    expect(screen.getByText('El usuario es obligatorio.')).toBeTruthy();
    expect(screen.queryByText('La contraseña es obligatoria.')).toBeNull();
  });

  it('shows one error per empty field, including the tenant', async () => {
    const service = fakeService();
    const { user } = await renderLogin(service);
    await submit(user);

    expect(service.login).not.toHaveBeenCalled();
    expect(screen.getByText('Seleccione una empresa.')).toBeTruthy();
    expect(screen.getByText('El usuario es obligatorio.')).toBeTruthy();
    expect(screen.getByText('La contraseña es obligatoria.')).toBeTruthy();
  });

  it('logs in with the selected tenant, keeps the result in memory and continues to step 2', async () => {
    const service = fakeService();
    const { user, store } = await renderLogin(service);
    await fill(user, { tenant: 'botica', usuario: 'cajero', clave: 'cajero123' });
    await submit(user);

    expect(await screen.findByText('step 2')).toBeTruthy();
    expect(service.login).toHaveBeenCalledWith('botica', { usuario: 'cajero', clave: 'cajero123' });
    expect(store.getSnapshot().pending).toEqual({ tenantId: 'botica', result: loginResult });
    expect(store.getSnapshot().session).toBeNull();
  });

  it.each([
    ['S-AUTH-6', 403, 'USER_DISABLED', 'El usuario está deshabilitado.'],
    ['S-AUTH-7', 403, 'NO_DESKTOP_ACCESS', 'El usuario no tiene acceso a escritorio.'],
    ['S-AUTH-8', 401, 'INVALID_CREDENTIALS', 'Usuario o contraseña incorrectos.'],
  ])('%s %s %s shows its own message and creates no session', async (_id, status, code, message) => {
    const service = fakeService({ login: vi.fn().mockRejectedValue(apiError(status, code, 'server text')) });
    const { user, store } = await renderLogin(service);
    await fill(user);
    await submit(user);

    expect(await screen.findByText(message)).toBeTruthy();
    expect(screen.queryByText('step 2')).toBeNull();
    expect(store.getSnapshot()).toEqual({ session: null, pending: null });
  });

  it('S-AUTH-20 Enter in the password field submits once', async () => {
    const service = fakeService();
    const { user } = await renderLogin(service);
    await fill(user, { clave: '' });
    await user.type(screen.getByLabelText(/Contraseña/i), 'admin123{Enter}');

    expect(await screen.findByText('step 2')).toBeTruthy();
    expect(service.login).toHaveBeenCalledTimes(1);
  });

  it('S-AUTH-21 a server error shows its message and traceId', async () => {
    const service = fakeService({ login: vi.fn().mockRejectedValue(apiError(500, 'INTERNAL_ERROR', 'Servidor no disponible', 'trace-500')) });
    const { user } = await renderLogin(service);
    await fill(user);
    await submit(user);

    expect(await screen.findByText('Servidor no disponible')).toBeTruthy();
    expect(screen.getByText(/trace-500/)).toBeTruthy();
  });

  it('shows the server message when the tenants cannot be loaded', async () => {
    const service = fakeService({ sessionOptions: vi.fn().mockRejectedValue(apiError(500, 'INTERNAL_ERROR', 'Sin conexion', 'trace-opt')) });
    sessionStorage.clear();
    render(
      <SessionProvider store={createSessionStore(sessionStorage)}>
        <MemoryRouter><UiLogin service={service} /></MemoryRouter>
      </SessionProvider>,
    );

    expect(await screen.findByText('Sin conexion')).toBeTruthy();
    expect(screen.getByText(/trace-opt/)).toBeTruthy();
  });
});
