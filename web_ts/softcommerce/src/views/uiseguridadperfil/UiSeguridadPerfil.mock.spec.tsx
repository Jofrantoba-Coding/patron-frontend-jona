import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { DENY_ALL } from '../../domain/permissions';
import { ServicesProvider } from '../../services/ServicesContext';
import type { AppServices } from '../../services/serviceComposer';
import { createAppServicesMock } from '../../services/mock/AppServicesMock';
import { DialogStackProvider } from '../uishell/DialogStackProvider';
import { UiSeguridadPerfil } from './UiSeguridadPerfil';
import { perfilRows } from './testServices';

describe('Seguridad - Perfil over the in-browser mock (dual-source parity)', () => {
  it('edits and stores a perfil menu through the same routes the HTTP mock serves', async () => {
    const mock = createAppServicesMock('exitoso', { getSession: () => ({ tenantId: 'demo' }), delayMs: 0 });
    const user = userEvent.setup();
    render(
      <ServicesProvider services={mock as unknown as AppServices}>
        <DialogStackProvider>
          <UiSeguridadPerfil permissions={{ ...DENY_ALL }} />
        </DialogStackProvider>
      </ServicesProvider>,
    );
    await screen.findByText('ADMINISTRADOR');

    await user.click(perfilRows()[0]);
    await user.click(screen.getByRole('button', { name: 'Perfil' }));
    await user.click(await screen.findByRole('checkbox', { name: 'Aduana' }));
    await user.click(screen.getByRole('button', { name: 'Guardar' }));

    expect(await screen.findByText('Permisos actualizados correctamente')).toBeTruthy();
    expect((await mock.perfilGrants.menu('1')).filter((node) => !node.visible).map((node) => node.nombre)).toEqual(['miAduana']);
  });
});
