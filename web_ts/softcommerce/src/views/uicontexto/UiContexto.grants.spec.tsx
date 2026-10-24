import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { describe, expect, it, vi } from 'vitest';
import type { InterAuthService } from '../../services/InterAuthService';
import type { GrantsSnapshot, InterGrantsService } from '../../services/InterGrantsService';
import { SessionProvider } from '../../session/SessionProvider';
import { createSessionStore } from '../../session/sessionStore';
import { UiContexto } from './UiContexto';

const auth: InterAuthService = {
  sessionOptions: vi.fn(),
  login: vi.fn(),
  empresas: vi.fn().mockResolvedValue([{ id: '1', name: 'COMERCIAL DEMO' }]),
  puntosVenta: vi.fn().mockResolvedValue([{ id: '1', name: 'TIENDA CENTRAL', id_empresa: '1' }]),
  params: vi.fn().mockResolvedValue({ INICIO_ACTIVIDADES: '2020-01-01', IS_FACTURADOR_SUNAT: true, ISBOTICA: false, DESPACHO_AUTOMATICO: false }),
};
const grants: GrantsSnapshot = { menu: [], permissions: {} };

async function confirmWith(service?: InterGrantsService) {
  sessionStorage.clear();
  const store = createSessionStore(sessionStorage);
  store.setPending({ tenantId: 'demo', result: { token: 'tok', user: { id_usuario: 1, usuario: 'admin', nombre: 'A' } } });
  render(
    <SessionProvider store={store}>
      <MemoryRouter initialEntries={['/contexto']}>
        <Routes>
          <Route path="/contexto" element={<UiContexto service={auth} grants={service} />} />
          <Route path="/" element={<p>shell</p>} />
        </Routes>
      </MemoryRouter>
    </SessionProvider>,
  );
  const user = userEvent.setup();
  await user.selectOptions(await screen.findByLabelText('Empresa'), '1');
  await screen.findByRole('option', { name: 'TIENDA CENTRAL' });
  await user.selectOptions(screen.getByLabelText('Punto de venta'), '1');
  await user.type(screen.getByPlaceholderText('Fecha inicio'), '2026-01-01');
  await user.type(screen.getByPlaceholderText('Fecha fin'), '2026-12-31');
  await user.click(screen.getByRole('button', { name: 'Confirmar' }));
  return store;
}

describe('S-AUTH-16 the session holds the grants taken at step 2', () => {
  it('stores the snapshot with the session and then opens the shell', async () => {
    const service = { snapshot: vi.fn().mockResolvedValue(grants) };
    const store = await confirmWith(service);

    await screen.findByText('shell');
    expect(service.snapshot).toHaveBeenCalledTimes(1);
    expect(store.getSnapshot().session?.grants).toEqual(grants);
  });

  it('a failed snapshot blocks the session and shows the failure', async () => {
    const store = await confirmWith({ snapshot: vi.fn().mockRejectedValue(new Error('boom')) });

    await waitFor(() => expect(screen.getByRole('alert')).toBeTruthy());
    expect(store.getSnapshot().session).toBeNull();
  });

  it('without a grants service (the W1 wiring) the session has no snapshot', async () => {
    const store = await confirmWith(undefined);

    await screen.findByText('shell');
    expect(store.getSnapshot().session?.grants).toBeUndefined();
  });
});
