import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { validateRegistry } from '../../../../mock-server/registry/schema.js';
import { toCatalogConfig } from '../../../catalogs/registry';
import type { CatalogConfig } from '../../../catalogs/CatalogConfig';
import type { InterCatalogService } from '../../../services/InterCatalogService';
import type { AppServices } from '../../../services/serviceComposer';
import { ServicesProvider } from '../../../services/ServicesContext';
import { DialogStackProvider } from '../../../views/uishell/DialogStackProvider';
import { UiCrudRegister } from '../../../views/uicrudregister/UiCrudRegister';

type Row = Record<string, string>;
const text = (name: string, extra: Record<string, any> = {}) => ({ name, kind: 'text', label: name, max: 40, ...extra });
const entry = (slug: string, over: Record<string, any> = {}): Record<string, any> => ({
  slug, idKey: `id_${slug}`, codeWidth: 3, entity: 'un item', scope: 'tenant', seed: slug, messages: { style: 'M1' },
  fields: [text('descripcion', { required: true })], columns: [{ key: 'descripcion', header: 'D' }], ...over,
});
/** The Vendedor shape of R-MST-9: a trabajador lookup that fills five fields (the lookup itself is the sixth, `Codigo Trab.`). */
const registry = validateRegistry([
  entry('trab', { optionLabel: 'nombre', fields: [text('nombre'), text('dni'), text('direccion'), text('telefono'), text('celular')] }),
  entry('vend', {
    fields: [
      {
        name: 'id_trab', kind: 'lookup', label: 'Codigo Trab.', source: { catalog: 'trab' }, search: ['nombre'], columns: [{ key: 'nombre', header: 'NOMBRE' }], readOnlyOn: ['UPDATE'],
        filters: [{ field: 'nombre', label: 'Nombres', type: 'text' }],
        fill: { nombres: 'nombre', direccion: 'direccion', numero: 'dni', telefono: 'telefono', celular: 'celular' }, fillReadOnly: ['nombres', 'direccion', 'numero'],
      },
      text('nombres', { label: 'Nombres' }), text('direccion', { label: 'Dirección' }), text('numero', { label: 'Numero' }), text('telefono', { label: 'Telefono Fijo' }), text('celular', { label: 'Telefono Movil' }),
    ],
  }),
]);
const config = toCatalogConfig(registry.bySlug.get('vend'), registry) as CatalogConfig<Row>;
const TRABAJADORES: Row[] = [
  { id_trab: '001', nombre: 'ANA PEREZ', dni: '40123456', direccion: 'AV LIMA 1', telefono: '4561234', celular: '999111222' },
  { id_trab: '002', nombre: 'LUIS RAMOS', dni: '40765432', direccion: 'JR CUSCO 2', telefono: '', celular: '' },
];
const RECORD: Row = { id_vend: '5', id_trab: '002', trab: 'LUIS RAMOS', nombres: 'LUIS RAMOS', direccion: 'JR CUSCO 2', numero: '40765432', telefono: '', celular: '' };

async function open(mode: 'INSERT' | 'UPDATE') {
  const list = vi.fn(async ({ filters }: { filters?: Row }) => ({ items: TRABAJADORES.filter((r) => Object.entries(filters ?? {}).every(([k, v]) => (r[k] ?? '').includes(v))), pagination: { page: 1, pageSize: 10, total: 2 } }));
  const app = { catalog: () => ({ list }), lookup: { options: vi.fn(async () => []) } } as unknown as AppServices;
  const service = { get: vi.fn(async () => RECORD), create: vi.fn(async (v: object) => ({ id_vend: '9', ...v })), update: vi.fn() } as unknown as InterCatalogService<Row>;
  render(
    <DialogStackProvider>
      <ServicesProvider services={app}>
        <UiCrudRegister config={config} service={service} mode={mode} id={mode === 'INSERT' ? undefined : '5'} lookup={app.lookup as never} onDone={vi.fn()} onClose={vi.fn()} />
      </ServicesProvider>
    </DialogStackProvider>,
  );
  await waitFor(() => expect(screen.queryByText('Cargando...')).toBeNull());
  return { user: userEvent.setup(), service };
}
const box = (label: string) => screen.getByLabelText(label) as HTMLInputElement;
const pick = async (user: ReturnType<typeof userEvent.setup>, name: string) => {
  await user.click(screen.getByRole('button', { name: 'Buscar' }));
  await user.click(await screen.findByText(name));
  await user.click(screen.getByRole('button', { name: 'Agregar' }));
};

describe('lookup fill (R-REG-13, S-MST-18)', () => {
  it('the adapter carries the fill and the read-only targets', () => {
    expect(config.fields[0]).toMatchObject({
      kind: 'lookup', fill: { nombres: 'nombre', direccion: 'direccion', numero: 'dni', telefono: 'telefono', celular: 'celular' }, fillReadOnly: ['nombres', 'direccion', 'numero'], readOnlyOn: ['UPDATE'],
    });
  });

  it('picking a row fills the code and the five declared fields, and the payload carries them', async () => {
    const { user, service } = await open('INSERT');
    await pick(user, 'ANA PEREZ');
    expect([box('Codigo Trab.').value, box('Nombres').value, box('Dirección').value, box('Numero').value, box('Telefono Fijo').value, box('Telefono Movil').value])
      .toEqual(['001', 'ANA PEREZ', 'AV LIMA 1', '40123456', '4561234', '999111222']);
    await user.click(screen.getByRole('button', { name: 'Aceptar' }));
    await user.click(await screen.findByRole('button', { name: 'Confirmar' }));
    await waitFor(() => expect(service.create).toHaveBeenCalledWith({ id_trab: '001', nombres: 'ANA PEREZ', direccion: 'AV LIMA 1', numero: '40123456', telefono: '4561234', celular: '999111222' }));
  });

  it('a typed code that resolves fills the same fields', async () => {
    const { user } = await open('INSERT');
    await user.type(box('Codigo Trab.'), '002');
    await user.tab();
    await waitFor(() => expect(box('Nombres').value).toBe('LUIS RAMOS'));
    expect(box('Numero').value).toBe('40765432');
  });

  it('only the fillReadOnly fields are read-only: Nombres, Dirección and Numero; the phones stay editable', async () => {
    const { user } = await open('INSERT');
    await pick(user, 'ANA PEREZ');
    expect(['Nombres', 'Dirección', 'Numero', 'Telefono Fijo', 'Telefono Movil'].map((label) => box(label).readOnly)).toEqual([true, true, true, false, false]);
    await user.type(box('Nombres'), 'ZZ');
    expect(box('Nombres').value).toBe('ANA PEREZ');
    await user.type(box('Telefono Fijo'), '1');
    expect(box('Telefono Fijo').value).toBe('45612341');
  });

  it('clearing the lookup empties what it filled', async () => {
    const { user } = await open('INSERT');
    await pick(user, 'ANA PEREZ');
    await user.click(screen.getByRole('button', { name: 'Limpiar' }));
    expect(['Codigo Trab.', 'Nombres', 'Dirección', 'Numero', 'Telefono Fijo', 'Telefono Movil'].map((label) => box(label).value)).toEqual(['', '', '', '', '', '']);
  });

  it('UPDATE restores the record with the picker disabled and the filled fields read-only', async () => {
    await open('UPDATE');
    expect(box('Nombres').value).toBe('LUIS RAMOS');
    expect(box('Codigo Trab.').readOnly).toBe(true);
    expect(screen.queryByRole('button', { name: 'Buscar' })).toBeNull();
    expect(screen.queryByRole('button', { name: 'Limpiar' })).toBeNull();
    expect([box('Nombres').readOnly, box('Dirección').readOnly, box('Numero').readOnly]).toEqual([true, true, true]);
  });
});
