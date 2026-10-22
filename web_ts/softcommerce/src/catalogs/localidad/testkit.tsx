// Test support for the Localidad specs: the list over the in-browser mock, plus form helpers.
import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { expect } from 'vitest';
import { DENY_ALL, type Permissions } from '../../domain/permissions';
import { createAppServicesMock } from '../../services/mock/AppServicesMock';
import { DialogStackProvider } from '../../views/uishell/DialogStackProvider';
import { UiCrudList } from '../../views/uicrudlist';
import { localidadConfig, type Localidad } from './localidad.config';

export const ALL_ALLOWED: Permissions = { ...DENY_ALL, add: true, modify: true, eliminate: true, clone: true, details: true, refresh: true };

export function renderLocalidad(permissions: Partial<Permissions> = ALL_ALLOWED) {
  const mock = createAppServicesMock('exitoso', { getSession: () => ({ tenantId: 'demo' }), delayMs: 0 });
  const catalog = mock.catalog<Localidad>('localidades');
  render(
    <DialogStackProvider>
      <UiCrudList config={localidadConfig} service={catalog} lookup={mock.lookup} permissions={{ ...DENY_ALL, ...permissions }} />
    </DialogStackProvider>,
  );
  return { catalog, user: userEvent.setup() };
}

/** Picks an option by its text, waiting for the cascade to load it first. */
export async function pick(user: ReturnType<typeof userEvent.setup>, label: string, option: string) {
  const select = await screen.findByLabelText(label);
  await waitFor(() => expect(within(select).getByRole('option', { name: option })).toBeTruthy());
  await user.selectOptions(select, option);
}

export const field = (label: string) => screen.getByLabelText(label) as HTMLInputElement | HTMLSelectElement;
