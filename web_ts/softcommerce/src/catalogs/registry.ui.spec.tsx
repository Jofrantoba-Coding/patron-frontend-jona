import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { REGISTRY } from '../../mock-server/registry/index.js';
import { ENTITIES } from '../../test/catalogs/reference.cases';
import type { InterCatalogService } from '../services/InterCatalogService';
import { DialogStackProvider } from '../views/uishell/DialogStackProvider';
import { UiCrudRegister } from '../views/uicrudregister';
import { toCatalogConfig } from './registry';

async function openInsert(slug: string) {
  const config = toCatalogConfig(REGISTRY.bySlug.get(slug));
  const service = { create: vi.fn() } as unknown as InterCatalogService<Record<string, string>>;
  render(
    <DialogStackProvider>
      <UiCrudRegister config={config} service={service} mode="INSERT" onDone={vi.fn()} onClose={vi.fn()} />
    </DialogStackProvider>,
  );
  await waitFor(() => expect(screen.queryByText('Cargando...')).toBeNull());
  return { config, service };
}
const input = (label: string) => screen.getByLabelText(label) as HTMLInputElement;

// The UI half of the table-driven rules (R-REF-4): the same registry entries, rendered.
describe.each(Object.entries(ENTITIES))('%s register form', (slug, entity) => {
  it('S-REF-2 a blank descripcion sends nothing and shows the desktop message', async () => {
    const { service } = await openInsert(slug);
    await userEvent.setup().click(screen.getByRole('button', { name: 'Aceptar' }));
    expect(screen.getByText(`Para agregar ${entity}, debes especificar su Descripcion.`)).toBeTruthy();
    expect(screen.queryByText('Confirmar')).toBeNull();
    expect(service.create).not.toHaveBeenCalled();
  });

  it('S-REF-3 / S-REF-4 each text field ignores input beyond its max and uppercases only when declared', async () => {
    const { config } = await openInsert(slug);
    for (const field of config.fields) {
      if (field.kind !== 'text') continue;
      fireEvent.change(input(field.label), { target: { value: 'x'.repeat((field.maxLength ?? 0) + 1) } });
      expect(input(field.label).value, `${slug}.${field.name} beyond max`).toBe('');
      fireEvent.change(input(field.label), { target: { value: 'rojo' } });
      expect(input(field.label).value, `${slug}.${field.name} case`).toBe(field.uppercase ? 'ROJO' : 'rojo');
    }
  });
});
