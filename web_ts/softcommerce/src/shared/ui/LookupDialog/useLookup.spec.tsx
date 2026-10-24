import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { ServicesProvider } from '../../../services/ServicesContext';
import type { AppServices } from '../../../services/serviceComposer';
import { DialogStackProvider } from '../../../views/uishell/DialogStackProvider';
import { useLookup, type LookupOpenOptions, type LookupResult } from './useLookup';

type Row = Record<string, string>;
type Lists = Record<string, Row[]>;
const OPTIONS: Record<string, { id: string; name: string }[]> = {
  familias: [{ id: 'F1', name: 'FAMILIA UNO' }, { id: 'F2', name: 'FAMILIA DOS' }],
  subfamilias: [{ id: 'S1', name: 'SUB UNO' }],
  marcas: [{ id: 'M1', name: 'MARCA UNO' }],
};

function fakeServices(lists: Lists) {
  const list = vi.fn(async (slug: string, { filters, page = 1, pageSize = 10 }: { filters?: Record<string, string>; page?: number; pageSize?: number }) => {
    const hit = (lists[slug] ?? []).filter((r) => Object.entries(filters ?? {}).every(([k, v]) => !v || (r[k] ?? '') === v || (r[k] ?? '').includes(v)));
    return { items: hit.slice((page - 1) * pageSize, page * pageSize), pagination: { page, pageSize, total: hit.length } };
  });
  const options = vi.fn(async (slug: string, _filters?: Record<string, string>) => OPTIONS[slug] ?? []);
  const app = { catalog: (slug: string) => ({ list: (query: object) => list(slug, query) }), lookup: { options } } as unknown as AppServices;
  return { app, list, options };
}

/** A host with one button that opens a picker and prints what it resolved to. */
function Host({ picker, options }: { picker: Parameters<ReturnType<typeof useLookup>['open']>[0]; options?: LookupOpenOptions }) {
  const { open, dialog } = useLookup();
  const [result, setResult] = useState<LookupResult | undefined | 'none'>('none');
  return (
    <>
      <button onClick={() => void open(picker, options).then(setResult)}>abrir</button>
      <output>{result === 'none' ? 'pending' : result ? JSON.stringify({ row: result.row, extras: result.extras }) : 'cancelled'}</output>
      {dialog}
    </>
  );
}
async function start(picker: Parameters<ReturnType<typeof useLookup>['open']>[0], lists: Lists, options?: LookupOpenOptions) {
  const services = fakeServices(lists);
  render(<DialogStackProvider><ServicesProvider services={services.app}><Host picker={picker} options={options} /></ServicesProvider></DialogStackProvider>);
  const user = userEvent.setup();
  await user.click(screen.getByRole('button', { name: 'abrir' }));
  return { user, ...services };
}
const ITEMS: Row[] = [
  { id_item: '1', descripcion: 'TUERCA', id_familia: 'F1', id_subfamilia: 'S1', id_marca: 'M1', estado: 'true' },
  { id_item: '2', descripcion: 'TORNILLO', id_familia: 'F1', id_subfamilia: 'S1', id_marca: 'M2', estado: 'true' },
  { id_item: '3', descripcion: 'CLAVO', id_familia: 'F2', id_subfamilia: 'S1', id_marca: 'M1', estado: 'true' },
];
const select = (label: string) => screen.getByLabelText(label) as HTMLSelectElement;

describe('useLookup (R-LKP-1, D4)', () => {
  it('open resolves with the picked row and the extras, and with undefined on cancel', async () => {
    const { user } = await start('buscarItemConversion', { items: ITEMS });
    await user.click(await screen.findByText('CLAVO'));
    await user.click(screen.getByRole('button', { name: 'Agregar' }));
    await waitFor(() => expect(screen.getByRole('status').textContent).toContain('"id_item":"3"'));
    expect(screen.getByRole('status').textContent).toContain('"valor_origen":"1.0"');
    await user.click(screen.getByRole('button', { name: 'abrir' }));
    await user.click(await screen.findByRole('button', { name: 'Cancelar' }));
    await waitFor(() => expect(screen.getByRole('status').textContent).toBe('cancelled'));
  });

  it('S-LKP-4 Familia and Marca combine; SubFamilia is disabled until a Familia is chosen and clears when it changes', async () => {
    const { user, list } = await start('buscarItemConversion', { items: ITEMS });
    await screen.findByText('TUERCA');
    expect(select('SubFamilia').disabled).toBe(true);
    await user.selectOptions(select('Familia'), 'FAMILIA UNO');
    await waitFor(() => expect(select('SubFamilia').disabled).toBe(false));
    await user.selectOptions(select('SubFamilia'), 'SUB UNO');
    await user.selectOptions(select('Marca'), 'MARCA UNO');
    await waitFor(() => expect(screen.queryByText('TORNILLO')).toBeNull());
    expect(screen.getByText('TUERCA')).toBeTruthy();
    expect(list).toHaveBeenLastCalledWith('items', expect.objectContaining({ filters: { estado: 'true', id_familia: 'F1', id_subfamilia: 'S1', id_marca: 'M1' } }));
    await user.selectOptions(select('Familia'), 'FAMILIA DOS');
    await waitFor(() => expect(list).toHaveBeenLastCalledWith('items', expect.objectContaining({ filters: { estado: 'true', id_familia: 'F2', id_marca: 'M1' } })));
    expect(select('SubFamilia').value).toBe('');
  });

  it('S-LKP-9 a host veto keeps the dialog open, shows its message and hands nothing over', async () => {
    const veto = vi.fn((row: Row) => (row.id_cliente === '7' ? 'Cliente ya Esta Agregado' : undefined));
    const { user } = await start('formClienteBuscar', { clientes: [{ id_cliente: '7', descripcion: 'ACME', estado: 'true' }, { id_cliente: '8', descripcion: 'BETA', estado: 'true' }] }, { veto });
    await user.click(await screen.findByText('ACME'));
    await user.click(screen.getByRole('button', { name: 'Agregar' }));
    expect((await screen.findByRole('alert')).textContent).toBe('Cliente ya Esta Agregado');
    expect(screen.getByRole('dialog')).toBeTruthy();
    expect(screen.getByRole('status').textContent).toBe('pending');
    await user.click(screen.getByText('BETA'));
    await user.click(screen.getByRole('button', { name: 'Agregar' }));
    await waitFor(() => expect(screen.getByRole('status').textContent).toContain('"id_cliente":"8"'));
  });

  it('S-LKP-13 the conversion inputs open at 0.0, 0.0 and 1.0 and return to their default when left blank', async () => {
    const { user } = await start('buscarItemConversion', { items: ITEMS });
    await screen.findByText('TUERCA');
    const field = (label: string) => screen.getByLabelText(label) as HTMLInputElement;
    expect([field('VALOR DE CONVERSION').value, field('VALOR DE PAQUETE').value, field('VALOR DE ORIGEN').value]).toEqual(['0.0', '0.0', '1.0']);
    await user.clear(field('VALOR DE ORIGEN'));
    await user.tab();
    expect(field('VALOR DE ORIGEN').value).toBe('1.0');
    await user.clear(field('VALOR DE CONVERSION'));
    await user.tab();
    expect(field('VALOR DE CONVERSION').value).toBe('0.0');
  });

  it('S-LKP-14 a preset filter shows in its input and applies to the first load', async () => {
    const { list } = await start(
      'formBuscarVehiculo',
      { vehiculos: [{ id_vehiculo: '1', placa: 'AAA', transportista_ruc: '20123456789' }, { id_vehiculo: '2', placa: 'BBB', transportista_ruc: '20999999999' }] },
      { preset: { transportista_ruc: '20123456789' } },
    );
    await screen.findByText('AAA');
    expect((screen.getByLabelText('RUC/DNI') as HTMLInputElement).value).toBe('20123456789');
    expect(screen.queryByText('BBB')).toBeNull();
    expect(list).toHaveBeenCalledWith('vehiculos', expect.objectContaining({ filters: { transportista_ruc: '20123456789' } }));
  });
});
