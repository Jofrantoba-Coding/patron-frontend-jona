import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { describe, expect, it, vi } from 'vitest';
import { ApiError } from '../../services/ApiError';
import type { InterAuthService } from '../../services/InterAuthService';
import { SessionProvider } from '../../session/SessionProvider';
import { createSessionStore } from '../../session/sessionStore';
import { UiLogin } from './UiLogin';

/** S-AUTH-24: the login never keeps the password: the field is empty after a submit and no session object or storage entry holds it. */
const loginResult = { token: 'tok-9', user: { id_usuario: 5, usuario: 'nuevo', nombre: 'JUAN PEREZ LOPEZ' } };
const service = (login: InterAuthService['login']): InterAuthService => ({
  sessionOptions: vi.fn().mockResolvedValue([{ id: 'demo', name: 'Demo' }]), login, empresas: vi.fn(), puntosVenta: vi.fn(), params: vi.fn(),
});

async function submitWith(login: InterAuthService['login']) {
  sessionStorage.clear();
  const store = createSessionStore(sessionStorage);
  render(
    <SessionProvider store={store}>
      <MemoryRouter initialEntries={['/login']}>
        <Routes>
          <Route path="/login" element={<UiLogin service={service(login)} />} />
          <Route path="/contexto" element={<p>step 2</p>} />
        </Routes>
      </MemoryRouter>
    </SessionProvider>,
  );
  await screen.findByRole('option', { name: 'Demo' });
  const user = userEvent.setup();
  await user.selectOptions(screen.getByLabelText(/Empresa|Base de datos/i), 'demo');
  await user.type(screen.getByLabelText(/Usuario/i), 'nuevo');
  await user.type(screen.getByLabelText(/Contraseña/i), 'secreto1');
  await user.click(screen.getByRole('button', { name: 'Ingresar' }));
  return store;
}

describe('S-AUTH-24 the login never keeps the password', () => {
  it('after a rejected submit the password field is empty and the user name stays', async () => {
    await submitWith(vi.fn().mockRejectedValue(new ApiError(401, { code: 'INVALID_CREDENTIALS', message: 'x', details: [], traceId: 't' })));
    expect(await screen.findByText('Usuario o contraseña incorrectos.')).toBeTruthy();
    expect([(screen.getByLabelText(/Contraseña/i) as HTMLInputElement).value, (screen.getByLabelText(/Usuario/i) as HTMLInputElement).value]).toEqual(['', 'nuevo']);
  });

  it('after a successful submit the session object and every storage entry are free of the password', async () => {
    const store = await submitWith(vi.fn().mockResolvedValue(loginResult));
    expect(await screen.findByText('step 2')).toBeTruthy();
    const everything = JSON.stringify([store.getSnapshot(), { ...sessionStorage }, { ...localStorage }]);
    expect(everything).not.toMatch(/secreto1|clave/);
  });
});
