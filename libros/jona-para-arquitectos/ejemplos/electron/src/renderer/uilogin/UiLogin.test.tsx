import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { createLoginHandler } from '../../main/loginHandler';
import { createAuthServiceFake } from '../../shared/services/AuthServiceFake';
import { createAuthServiceIpc } from '../services/AuthServiceIpc';
import { UiLogin } from '.';

/** El renderizador con el adaptador IPC real y el manejador del proceso principal, sin Electron. */
const ipcService = () => {
  const handle = createLoginHandler(createAuthServiceFake());
  return createAuthServiceIpc({ login: (email, password) => handle(email, password) });
};

describe('UiLogin en el renderizador, a través del IPC', () => {
  async function submitWith(email: string, password: string) {
    const onAuthenticated = vi.fn();
    const user = userEvent.setup();
    render(<UiLogin service={ipcService()} onAuthenticated={onAuthenticated} />);
    await user.type(screen.getByLabelText('Correo'), email);
    await user.type(screen.getByLabelText('Contraseña'), password);
    await user.click(screen.getByRole('button', { name: 'Ingresar' }));
    return onAuthenticated;
  }

  it('inicia sesión', async () => {
    const onAuthenticated = await submitWith('ana@ejemplo.com', 'secreta123');

    await waitFor(() => expect(onAuthenticated).toHaveBeenCalledTimes(1));
  });

  it('muestra el mensaje según el code del ApiError reconstruido', async () => {
    await submitWith('bloqueado@ejemplo.com', 'secreta123');

    expect((await screen.findByRole('alert')).textContent).toBe('Su usuario está bloqueado. Contacte al administrador.');
  });
});
