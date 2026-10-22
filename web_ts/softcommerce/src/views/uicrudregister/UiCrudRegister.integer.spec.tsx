import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { validateRegistry } from '../../../mock-server/registry/schema.js';
import { toCatalogConfig } from '../../catalogs/registry';
import type { InterCatalogService } from '../../services/InterCatalogService';
import { DialogStackProvider } from '../uishell/DialogStackProvider';
import type { RegisterMode } from './InterUiCrudRegister';
import { UiCrudRegister } from './UiCrudRegister';

const integer = (name: string, label: string, range: { min?: number; max?: number }, msgLabel?: string) => ({
  name, kind: 'number', label, scale: 0, required: true, max: 2, normalize: ['digits', 'padLeft:2'], range, msgLabel,
  messages: { range: `Para {modo}, debes Insertar ${label} Correcto.` },
});
const config = toCatalogConfig(
  validateRegistry([
    {
      slug: 'relojes', idKey: 'id_reloj', codeWidth: 0, entity: 'un Reloj', scope: 'tenant', seed: 'relojes', messages: { style: 'M2' },
      fields: [
        { name: 'id_reloj', kind: 'code', label: 'Código' },
        integer('hora', 'Hora', { min: 0, max: 12 }),
        integer('minuto', 'Minutos', { min: 0, max: 59 }, 'su Minutos'),
        { name: 'dias_pago', kind: 'number', label: 'Dias de Pago', scale: 0, max: 2, normalize: ['digits'] },
      ],
      columns: [{ key: 'hora', header: 'H' }],
      validation: ['hora', 'minuto', { range: 'hora' }, { range: 'minuto' }, 'dias_pago'],
    },
  ]).entries[0],
);

async function open(mode: RegisterMode = 'INSERT') {
  const user = userEvent.setup();
  const service = {
    get: vi.fn(async () => ({ id_reloj: '1', hora: '05', minuto: '30', dias_pago: 7 })),
    create: vi.fn(async (values: object) => ({ id_reloj: '2', ...values })),
    update: vi.fn(async () => ({})),
  };
  render(
    <DialogStackProvider>
      <UiCrudRegister config={config} service={service as unknown as InterCatalogService<Record<string, string>>} mode={mode} id={mode === 'INSERT' ? undefined : '1'} onDone={vi.fn()} onClose={vi.fn()} />
    </DialogStackProvider>,
  );
  await waitFor(() => expect(screen.queryByText('Cargando...')).toBeNull());
  return { user, service };
}
const field = (label: string) => screen.getByLabelText(label) as HTMLInputElement;

describe('integer fields in the register (S-CRUD-25, S-CRUD-35, S-REF-12)', () => {
  it('pads on blur: 5 typed in hora shows 05 once focus leaves, an empty field stays empty', async () => {
    const { user } = await open();
    await user.type(field('Hora'), '5');
    expect(field('Hora').value).toBe('5');
    await user.tab();
    expect(field('Hora').value).toBe('05');
    await user.click(field('Minutos'));
    await user.tab();
    expect(field('Minutos').value).toBe('');
  });

  it('ignores letters and a third digit while typing', async () => {
    const { user } = await open();
    await user.type(field('Hora'), 'a1b2c3');
    expect(field('Hora').value).toBe('12');
  });

  it('a blank hora blocks the submit with the desktop text and focuses it', async () => {
    const { user, service } = await open();
    await user.click(screen.getByRole('button', { name: 'Aceptar' }));
    expect(screen.getByText('Para agregar, debes especificar su Hora.')).toBeTruthy();
    expect(document.activeElement).toBe(field('Hora'));
    expect(service.create).not.toHaveBeenCalled();
  });

  it('hora 13 is out of range: the checked order puts a blank minuto first, then the range text', async () => {
    const { user, service } = await open();
    await user.type(field('Hora'), '13');
    await user.click(screen.getByRole('button', { name: 'Aceptar' }));
    expect(screen.getByText('Para agregar, debes especificar su Minutos.')).toBeTruthy();
    await user.type(field('Minutos'), '30');
    await user.click(screen.getByRole('button', { name: 'Aceptar' }));
    expect(screen.getByText('Para agregar, debes Insertar Hora Correcto.')).toBeTruthy();
    expect(service.create).not.toHaveBeenCalled();
  });

  it('sends the padded identifier-like values as strings and a plain integer as a number', async () => {
    const { user, service } = await open();
    await user.type(field('Hora'), '5');
    await user.type(field('Minutos'), '7');
    await user.type(field('Dias de Pago'), '0');
    await user.click(screen.getByRole('button', { name: 'Aceptar' }));
    await user.click(screen.getByRole('button', { name: 'Confirmar' }));
    await waitFor(() => expect(service.create).toHaveBeenCalledWith({ hora: '05', minuto: '07', dias_pago: 0 }));
  });

  it('UPDATE shows the stored values as they are: 05 stays 05, a stored number reads back as digits', async () => {
    await open('UPDATE');
    expect([field('Hora').value, field('Minutos').value, field('Dias de Pago').value]).toEqual(['05', '30', '7']);
  });

  it('DETAIL makes the numbers read-only', async () => {
    await open('DETAIL');
    expect(field('Hora').readOnly).toBe(true);
  });
});
