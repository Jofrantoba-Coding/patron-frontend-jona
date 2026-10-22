import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it } from 'vitest';
import { SessionProvider } from '../../session/SessionProvider';
import { createSessionStore, type Session } from '../../session/sessionStore';
import { ShellHeader } from './ShellHeader';

const session: Session = {
  tenantId: 'demo',
  token: 'tok-1',
  user: { id_usuario: 1, usuario: 'admin', nombre: 'Administrador' },
  empresa: { id: 'E1', name: 'Empresa Uno' },
  puntoVenta: { id: 'P1', name: 'Principal', id_empresa: 'E1' },
  periodo: { fechaInicio: '2026-01-05', fechaFin: '2026-12-31' },
  params: { INICIO_ACTIVIDADES: '2020-01-01', IS_FACTURADOR_SUNAT: false, ISBOTICA: false, DESPACHO_AUTOMATICO: false },
};

function renderHeader(value: Session) {
  sessionStorage.clear();
  const store = createSessionStore(sessionStorage);
  store.setSession(value);
  render(
    <SessionProvider store={store}>
      <ShellHeader />
    </SessionProvider>,
  );
  return { store, user: userEvent.setup() };
}

beforeEach(() => sessionStorage.clear());

describe('ShellHeader', () => {
  it('S-SHELL-15 shows user, empresa, punto de venta and the period as dd/MM/yyyy', () => {
    renderHeader(session);

    const header = screen.getByRole('banner');
    expect(header.textContent).toContain('Administrador');
    expect(header.textContent).toContain('Empresa Uno');
    expect(header.textContent).toContain('Principal');
    expect(header.textContent).toContain('05/01/2026 – 31/12/2026');
  });

  it('renders whatever the session holds, not fixed values', () => {
    renderHeader({
      ...session,
      user: { id_usuario: 2, usuario: 'caja', nombre: 'Cajero Dos' },
      empresa: { id: 'E2', name: 'Botica Sur' },
      puntoVenta: { id: 'P9', name: 'Mostrador', id_empresa: 'E2' },
      periodo: { fechaInicio: '2025-03-01', fechaFin: '2025-03-31' },
    });

    const header = screen.getByRole('banner');
    expect(header.textContent).toContain('Cajero Dos');
    expect(header.textContent).toContain('Botica Sur');
    expect(header.textContent).toContain('Mostrador');
    expect(header.textContent).toContain('01/03/2025 – 31/03/2025');
    expect(header.textContent).not.toContain('Administrador');
  });

  it('S-AUTH-17 offers no way to change the period: the only control is logout', () => {
    renderHeader(session);

    expect(screen.getAllByRole('button').map((b) => b.textContent)).toEqual(['Cerrar sesión']);
    expect(screen.queryAllByRole('textbox')).toHaveLength(0);
    expect(screen.queryAllByRole('combobox')).toHaveLength(0);
  });

  it('logout clears the session', async () => {
    const { store, user } = renderHeader(session);

    await user.click(screen.getByRole('button', { name: 'Cerrar sesión' }));

    expect(store.getSnapshot().session).toBeNull();
    expect(sessionStorage.length).toBe(0);
  });
});
