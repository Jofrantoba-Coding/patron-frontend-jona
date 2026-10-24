import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { beforeEach, describe, expect, it } from 'vitest';
import { RedirectIfSession } from './RedirectIfSession';
import { RequireSession } from './RequireSession';
import { SessionProvider, useSession } from './SessionProvider';
import { SESSION_STORAGE_KEY, createSessionStore, type Session } from './sessionStore';

const session: Session = {
  tenantId: 'demo',
  token: 'tok-1',
  user: { id_usuario: 1, usuario: 'admin', nombre: 'Administrador' },
  empresa: { id: 'E1', name: 'Empresa Uno' },
  puntoVenta: { id: 'P1', name: 'Principal', id_empresa: 'E1' },
  periodo: { fechaInicio: '2026-01-01', fechaFin: '2026-12-31' },
  params: { INICIO_ACTIVIDADES: '2020-01-01', IS_FACTURADOR_SUNAT: false, ISBOTICA: false, DESPACHO_AUTOMATICO: false },
};

beforeEach(() => sessionStorage.clear());

describe('sessionStore', () => {
  it('persists the session under softcommerce.session.v1 and restores it in a new store', () => {
    createSessionStore(sessionStorage).setSession(session);

    expect(SESSION_STORAGE_KEY).toBe('softcommerce.session.v1');
    expect(JSON.parse(sessionStorage.getItem('softcommerce.session.v1')!)).toEqual(session);
    expect(createSessionStore(sessionStorage).getSnapshot().session).toEqual(session);
  });

  it('keeps the step-1 result in memory only', () => {
    const store = createSessionStore(sessionStorage);
    store.setPending({ tenantId: 'botica', result: { token: 'secret-token', user: session.user } });

    expect(sessionStorage.length).toBe(0);
    expect(store.getContext()).toEqual({ tenantId: 'botica', token: 'secret-token' });
    expect(createSessionStore(sessionStorage).getSnapshot().pending).toBeNull();
  });

  it('exposes the session tenant and token as the request context, preferring it over pending', () => {
    const store = createSessionStore(sessionStorage);
    expect(store.getContext()).toEqual({});
    store.setPending({ tenantId: 'botica', result: { token: 'p', user: session.user } });
    store.setSession(session);

    expect(store.getContext()).toEqual({ tenantId: 'demo', token: 'tok-1' });
    expect(store.getSnapshot().pending).toBeNull();
  });

  it('ignores corrupt stored data', () => {
    sessionStorage.setItem(SESSION_STORAGE_KEY, '{not json');

    expect(createSessionStore(sessionStorage).getSnapshot().session).toBeNull();
  });

  it('clear removes the stored session and any pending login', () => {
    const store = createSessionStore(sessionStorage);
    store.setSession(session);
    store.clear();

    expect(sessionStorage.getItem(SESSION_STORAGE_KEY)).toBeNull();
    expect(store.getSnapshot()).toEqual({ session: null, pending: null });
  });

  it('notifies subscribers on change and stops after unsubscribe', () => {
    const store = createSessionStore(sessionStorage);
    let calls = 0;
    const unsubscribe = store.subscribe(() => calls++);
    store.setSession(session);
    unsubscribe();
    store.clear();

    expect(calls).toBe(1);
  });
});

function Shell() {
  const { session: current, logout } = useSession();
  return (
    <div>
      <p>shell for {current?.user.usuario}</p>
      <button onClick={logout}>Salir</button>
    </div>
  );
}

function renderApp(initial: Session | null) {
  const store = createSessionStore(sessionStorage);
  if (initial) store.setSession(initial);
  render(
    <SessionProvider store={store}>
      <MemoryRouter initialEntries={['/']}>
        <Routes>
          <Route path="/login" element={<p>login step 1</p>} />
          <Route path="/" element={<RequireSession><Shell /></RequireSession>} />
        </Routes>
      </MemoryRouter>
    </SessionProvider>,
  );
  return store;
}

describe('RequireSession and logout', () => {
  it('S-AUTH-19 redirects a visit to the shell without session to login step 1', () => {
    renderApp(null);

    expect(screen.getByText('login step 1')).toBeTruthy();
    expect(screen.queryByText(/shell for/)).toBeNull();
  });

  it('renders the protected content when a session exists', () => {
    renderApp(session);

    expect(screen.getByText('shell for admin')).toBeTruthy();
  });

  it.each([
    ['with a session goes to the shell', session, 'shell for admin'],
    ['without a session shows login step 1', null, 'login step 1'],
  ] as const)('RedirectIfSession: a visit to login %s', (_name, initial, expected) => {
    const store = createSessionStore(sessionStorage);
    if (initial) store.setSession(initial);
    render(
      <SessionProvider store={store}>
        <MemoryRouter initialEntries={['/login']}>
          <Routes>
            <Route path="/login" element={<RedirectIfSession><p>login step 1</p></RedirectIfSession>} />
            <Route path="/" element={<RequireSession><Shell /></RequireSession>} />
          </Routes>
        </MemoryRouter>
      </SessionProvider>,
    );

    expect(screen.getByText(expected)).toBeTruthy();
  });

  it('S-AUTH-18 logout clears the session and shows login step 1', async () => {
    const store = renderApp(session);
    await userEvent.click(screen.getByRole('button', { name: 'Salir' }));

    expect(screen.getByText('login step 1')).toBeTruthy();
    expect(store.getSnapshot().session).toBeNull();
    expect(sessionStorage.getItem(SESSION_STORAGE_KEY)).toBeNull();
  });
});
