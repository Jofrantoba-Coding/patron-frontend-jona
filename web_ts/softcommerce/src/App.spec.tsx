import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it } from 'vitest';
import { App } from './App';
import { createAppServicesMock } from './services/mock/AppServicesMock';
import { createSessionStore } from './session/sessionStore';

/** Real session store + the mock auth service, wired the way main.tsx wires them. */
function renderApp(path: string) {
  sessionStorage.clear();
  const store = createSessionStore(sessionStorage);
  const services = createAppServicesMock('exitoso', { getSession: store.getContext, delayMs: 0 });
  render(
    <MemoryRouter initialEntries={[path]}>
      <App services={services} store={store} />
    </MemoryRouter>,
  );
  return { store, user: userEvent.setup() };
}

type User = ReturnType<typeof userEvent.setup>;

async function login(user: User, usuario: string, clave: string) {
  await screen.findByRole('option', { name: 'Comercial Demo SAC' });
  await user.selectOptions(screen.getByLabelText('Base de datos'), 'demo');
  await user.type(screen.getByLabelText('Usuario'), usuario);
  await user.type(screen.getByLabelText('Contraseña'), clave);
  await user.click(screen.getByRole('button', { name: 'Ingresar' }));
}

describe('App routing', () => {
  it('redirects the protected route to login step 1 when there is no session', async () => {
    renderApp('/');

    expect(await screen.findByLabelText('Usuario')).toBeTruthy();
    expect(screen.queryByRole('banner')).toBeNull();
  });

  async function reachShell(user: User) {
    await login(user, 'admin', 'admin123');
    await user.selectOptions(await screen.findByLabelText('Empresa'), '1');
    await screen.findByRole('option', { name: 'TIENDA CENTRAL' });
    await user.selectOptions(screen.getByLabelText('Punto de venta'), '1');
    await user.type(screen.getByPlaceholderText('Fecha inicio'), '20260101');
    await user.type(screen.getByPlaceholderText('Fecha fin'), '20261231');
    await user.click(screen.getByRole('button', { name: 'Confirmar' }));
  }

  it('runs login, context selection and lands on the shell with its header and the menu', async () => {
    const { user, store } = renderApp('/login');
    await reachShell(user);

    const header = await screen.findByRole('banner');
    expect(header.textContent).toContain('Administrador');
    expect(header.textContent).toContain('01/01/2026 – 31/12/2026');
    expect(await screen.findByRole('button', { name: 'Maestros' })).toBeTruthy();
    expect(store.getSnapshot().session?.tenantId).toBe('demo');
  });

  it('S-AUTH-18 logout clears the session and returns to login step 1', async () => {
    const { user, store } = renderApp('/login');
    await reachShell(user);

    await user.click(await screen.findByRole('button', { name: 'Cerrar sesión' }));

    expect(await screen.findByLabelText('Usuario')).toBeTruthy();
    expect(store.getSnapshot().session).toBeNull();
  });

  it('keeps a disabled account on step 1 with its own message', async () => {
    const { user, store } = renderApp('/login');
    await login(user, 'bloqueado', 'bloq123');

    expect(await screen.findByText('El usuario está deshabilitado.')).toBeTruthy();
    expect(store.getSnapshot().session).toBeNull();
  });
});
