import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { describe, expect, it, vi } from 'vitest';
import { ApiError } from '../../services/ApiError';
import type { InterAuthService } from '../../services/InterAuthService';
import { SessionProvider } from '../../session/SessionProvider';
import { createSessionStore } from '../../session/sessionStore';
import { UiContexto } from './UiContexto';

const user1 = { id_usuario: 1, usuario: 'admin', nombre: 'Administrador' };
const empresas = [{ id: '1', name: 'COMERCIAL DEMO' }, { id: '2', name: 'DISTRIBUIDORA DEMO' }];
const puntos = [
  { id: '1', name: 'TIENDA CENTRAL', id_empresa: '1' },
  { id: '2', name: 'TIENDA MIRAFLORES', id_empresa: '1' },
  { id: '3', name: 'ALMACEN SUR', id_empresa: '2' },
];
const params = { INICIO_ACTIVIDADES: '2020-01-01', IS_FACTURADOR_SUNAT: true, ISBOTICA: false, DESPACHO_AUTOMATICO: false };

function fakeService(overrides: Partial<InterAuthService> = {}): InterAuthService {
  return {
    sessionOptions: vi.fn(),
    login: vi.fn(),
    empresas: vi.fn().mockResolvedValue(empresas),
    puntosVenta: vi.fn((idEmpresa?: string) => Promise.resolve(puntos.filter((p) => p.id_empresa === idEmpresa))),
    params: vi.fn().mockResolvedValue(params),
    ...overrides,
  };
}

async function renderContexto(service: InterAuthService, { pending = true } = {}) {
  sessionStorage.clear();
  const store = createSessionStore(sessionStorage);
  if (pending) store.setPending({ tenantId: 'demo', result: { token: 'tok-9', user: user1 } });
  render(
    <SessionProvider store={store}>
      <MemoryRouter initialEntries={['/contexto']}>
        <Routes>
          <Route path="/contexto" element={<UiContexto service={service} />} />
          <Route path="/login" element={<p>login step 1</p>} />
          <Route path="/" element={<p>shell</p>} />
        </Routes>
      </MemoryRouter>
    </SessionProvider>,
  );
  return { store, user: userEvent.setup() };
}

type User = ReturnType<typeof userEvent.setup>;
// The select is there (disabled, "Cargando...") before the empresas arrive: wait for the option itself.
const selectEmpresa = async (user: User, id: string) => {
  await screen.findByRole('option', { name: empresas.find((e) => e.id === id)!.name });
  await user.selectOptions(screen.getByLabelText('Empresa'), id);
};
const selectPunto = async (user: User, id: string) => {
  await screen.findByRole('option', { name: puntos.find((p) => p.id === id)!.name });
  await user.selectOptions(screen.getByLabelText('Punto de venta'), id);
};
const inicioInput = () => screen.getByLabelText('Fecha inicio') as HTMLInputElement;
const finInput = () => screen.getByLabelText('Fecha fin') as HTMLInputElement;
/** Digits as the user types them, day first: the field masks them as dd/MM/yyyy. */
const typeDates = async (user: User, inicio: string, fin: string) => {
  if (inicio) await user.type(inicioInput(), inicio);
  if (fin) await user.type(finInput(), fin);
};
const INVALID_DATE_MESSAGE = 'Ingrese fechas válidas (dd/mm/aaaa).';
const confirm = (user: User) => user.click(screen.getByRole('button', { name: 'Confirmar' }));

async function fillAll(user: User, inicio: string, fin: string) {
  await selectEmpresa(user, '1');
  await selectPunto(user, '1');
  await typeDates(user, inicio, fin);
}

describe('UiContexto step 2', () => {
  it('S-AUTH-9 shows the tenant empresas and the puntos de venta of the chosen empresa', async () => {
    const service = fakeService();
    const { user } = await renderContexto(service);
    await selectEmpresa(user, '1');

    expect(screen.getByRole('option', { name: 'DISTRIBUIDORA DEMO' })).toBeTruthy();
    expect(await screen.findByRole('option', { name: 'TIENDA MIRAFLORES' })).toBeTruthy();
    expect(service.puntosVenta).toHaveBeenCalledWith('1');
    expect(screen.queryByRole('option', { name: 'ALMACEN SUR' })).toBeNull();
  });

  it('S-AUTH-10 changing empresa reloads the puntos de venta and clears the selection', async () => {
    const { user } = await renderContexto(fakeService());
    await selectEmpresa(user, '1');
    await selectPunto(user, '2');
    await selectEmpresa(user, '2');

    expect(await screen.findByRole('option', { name: 'ALMACEN SUR' })).toBeTruthy();
    expect(screen.queryByRole('option', { name: 'TIENDA MIRAFLORES' })).toBeNull();
    expect((screen.getByLabelText('Punto de venta') as HTMLSelectElement).value).toBe('');
  });

  it('requires empresa and punto de venta before calling params', async () => {
    const service = fakeService();
    const { user } = await renderContexto(service);
    await confirm(user);

    expect(screen.getByText('Seleccione una empresa.')).toBeTruthy();
    expect(screen.getByText('Seleccione un punto de venta.')).toBeTruthy();
    expect(service.params).not.toHaveBeenCalled();
  });

  it('each period date has a visible label and the dd/MM/yyyy mask users type into', async () => {
    const { user } = await renderContexto(fakeService());
    await user.type(inicioInput(), '01102026');

    expect(inicioInput().value).toBe('01/10/2026');
    expect(inicioInput().placeholder).toBe('dd/MM/yyyy');
    expect(finInput().placeholder).toBe('dd/MM/yyyy');
    expect(screen.getByText('Fecha inicio').tagName).toBe('SPAN');
    expect(screen.getByText('Fecha fin').tagName).toBe('SPAN');
  });

  it('S-AUTH-11 missing dates are reported at once, with the selections, on the date fields', async () => {
    const service = fakeService();
    const { user } = await renderContexto(service);
    await confirm(user);

    const error = screen.getByText(INVALID_DATE_MESSAGE);
    expect(error.getAttribute('role')).toBe('alert');
    expect(error.id).toBeTruthy();
    for (const field of [inicioInput(), finInput()]) {
      expect(field.getAttribute('aria-invalid')).toBe('true');
      expect(field.getAttribute('aria-describedby')).toBe(error.id);
    }
    expect(screen.getByText('Seleccione una empresa.')).toBeTruthy();
    expect(service.params).not.toHaveBeenCalled();
  });

  it('editing a date clears the period error', async () => {
    const { user } = await renderContexto(fakeService());
    await confirm(user);
    await user.type(inicioInput(), '0');

    expect(screen.queryByText(INVALID_DATE_MESSAGE)).toBeNull();
    expect(inicioInput().getAttribute('aria-invalid')).toBeNull();
  });

  it.each([
    ['S-AUTH-11 impossible date', '31022026', '01032026', INVALID_DATE_MESSAGE],
    ['S-AUTH-11 empty date', '', '01032026', INVALID_DATE_MESSAGE],
    ['S-AUTH-11 incomplete date', '0103', '01032026', INVALID_DATE_MESSAGE],
    ['S-AUTH-12 before start of activity', '31122019', '31122019', 'La fecha de inicio es anterior al inicio de actividades de la empresa.'],
    ['S-AUTH-13 end before start', '01062026', '31052026', 'La fecha fin no puede ser anterior a la fecha de inicio.'],
    ['S-AUTH-14 different accounting year', '01122025', '31012026', 'El período debe estar dentro del mismo año contable.'],
  ])('%s shows its error and creates no session', async (_name, inicio, fin, message) => {
    const { user, store } = await renderContexto(fakeService());
    await fillAll(user, inicio, fin);
    await confirm(user);

    expect(await screen.findByText(message)).toBeTruthy();
    expect(screen.queryByText('shell')).toBeNull();
    expect(store.getSnapshot().session).toBeNull();
  });

  it('S-AUTH-15 accepts inicio equal to INICIO_ACTIVIDADES with fin the same day', async () => {
    const { user, store } = await renderContexto(fakeService());
    await fillAll(user, '01012020', '01012020');
    await confirm(user);

    expect(await screen.findByText('shell')).toBeTruthy();
    expect(store.getSnapshot().session?.periodo).toEqual({ fechaInicio: '2020-01-01', fechaFin: '2020-01-01' });
  });

  it('S-AUTH-16 creates the full session and navigates to the shell', async () => {
    const { user, store } = await renderContexto(fakeService());
    await fillAll(user, '01012026', '31122026');
    await confirm(user);

    expect(await screen.findByText('shell')).toBeTruthy();
    expect(store.getSnapshot()).toEqual({
      pending: null,
      session: {
        tenantId: 'demo',
        token: 'tok-9',
        user: user1,
        empresa: empresas[0],
        puntoVenta: puntos[0],
        periodo: { fechaInicio: '2026-01-01', fechaFin: '2026-12-31' },
        params,
      },
    });
    expect(sessionStorage.getItem('softcommerce.session.v1')).toContain('"tenantId":"demo"');
  });

  it('shows the server message and traceId when params fail, without a session', async () => {
    const failing = new ApiError(500, { code: 'INTERNAL_ERROR', message: 'Parametros no disponibles', details: [], traceId: 'trace-p' });
    const { user, store } = await renderContexto(fakeService({ params: vi.fn().mockRejectedValue(failing) }));
    await fillAll(user, '01012026', '31122026');
    await confirm(user);

    expect(await screen.findByText('Parametros no disponibles')).toBeTruthy();
    expect(screen.getByText(/trace-p/)).toBeTruthy();
    expect(store.getSnapshot().session).toBeNull();
  });

  it('S-AUTH-16 with router transitions on (as main.tsx runs) the confirm lands on the shell, not on login', async () => {
    sessionStorage.clear();
    const store = createSessionStore(sessionStorage);
    store.setPending({ tenantId: 'demo', result: { token: 'tok-9', user: user1 } });
    render(
      <SessionProvider store={store}>
        <MemoryRouter initialEntries={['/contexto']} future={{ v7_startTransition: true }}>
          <Routes>
            <Route path="/contexto" element={<UiContexto service={fakeService()} />} />
            <Route path="/login" element={<p>login step 1</p>} />
            <Route path="/" element={<p>shell</p>} />
          </Routes>
        </MemoryRouter>
      </SessionProvider>,
    );
    const user = userEvent.setup();
    await fillAll(user, '01012026', '31122026');
    await confirm(user);

    expect(await screen.findByText('shell')).toBeTruthy();
    await new Promise((resolve) => setTimeout(resolve, 50));
    expect(screen.queryByText('login step 1')).toBeNull();
    expect(screen.getByText('shell')).toBeTruthy();
  });

  it('a session that already exists sends step 2 to the shell', async () => {
    const service = fakeService();
    sessionStorage.clear();
    const store = createSessionStore(sessionStorage);
    store.setSession({
      tenantId: 'demo', token: 'tok-9', user: user1, empresa: empresas[0], puntoVenta: puntos[0],
      periodo: { fechaInicio: '2026-01-01', fechaFin: '2026-12-31' }, params,
    });
    render(
      <SessionProvider store={store}>
        <MemoryRouter initialEntries={['/contexto']}>
          <Routes>
            <Route path="/contexto" element={<UiContexto service={service} />} />
            <Route path="/login" element={<p>login step 1</p>} />
            <Route path="/" element={<p>shell</p>} />
          </Routes>
        </MemoryRouter>
      </SessionProvider>,
    );

    await waitFor(() => expect(screen.getByText('shell')).toBeTruthy());
    expect(service.empresas).not.toHaveBeenCalled();
  });

  it('A7 returns to login step 1 when the in-memory step-1 result is gone', async () => {
    const service = fakeService();
    await renderContexto(service, { pending: false });

    await waitFor(() => expect(screen.getByText('login step 1')).toBeTruthy());
    expect(service.empresas).not.toHaveBeenCalled();
  });
});
