import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { ALL_ALLOWED } from '../../catalogs/localidad/testkit';
import { DENY_ALL } from '../../domain/permissions';
import { ServicesProvider } from '../../services/ServicesContext';
import { createAppServicesMock } from '../../services/mock/AppServicesMock';
import { DialogStackProvider } from '../uishell/DialogStackProvider';
import { UiLocalidad } from './UiLocalidad';

const renderForm = (permissions = ALL_ALLOWED) =>
  render(
    <ServicesProvider services={createAppServicesMock('exitoso', { getSession: () => ({ tenantId: 'demo' }), delayMs: 0 })}>
      <DialogStackProvider>
        <UiLocalidad permissions={permissions} />
      </DialogStackProvider>
    </ServicesProvider>,
  );

describe('UiLocalidad', () => {
  it('lists the localidades of the composed catalog service', async () => {
    renderForm();

    expect(await screen.findByText('SUCURSAL CUSCO')).toBeTruthy();
    expect(screen.getByRole('button', { name: 'Agregar' }).hasAttribute('disabled')).toBe(false);
  });

  it('passes the form permissions to the toolbar', async () => {
    renderForm(DENY_ALL);

    await screen.findByText('SUCURSAL CUSCO');
    expect(screen.getByRole('button', { name: 'Agregar' }).hasAttribute('disabled')).toBe(true);
  });
});
