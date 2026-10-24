import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { validateRegistry } from '../../../mock-server/registry/schema.js';
import { toCatalogConfig } from '../../catalogs/registry';
import type { CatalogConfig } from '../../catalogs/CatalogConfig';
import type { InterCatalogService } from '../../services/InterCatalogService';
import type { InterLookupService } from '../../services/InterLookupService';
import { ServicesProvider } from '../../services/ServicesContext';
import type { AppServices } from '../../services/serviceComposer';
import { DialogStackProvider } from '../uishell/DialogStackProvider';
import { UiCrudRegister } from './UiCrudRegister';

type Row = Record<string, string>;
const text = (name: string, extra: Record<string, any> = {}) => ({ name, kind: 'text', label: name, max: 20, ...extra });
const entry = (slug: string, over: Record<string, any> = {}): Record<string, any> => ({
  slug, idKey: `id_${slug}`, codeWidth: 0, entity: 'una cita', scope: 'tenant', seed: slug, messages: { style: 'M1' },
  fields: [text('descripcion', { required: true })], columns: [{ key: 'descripcion', header: 'D' }], ...over,
});
const registry = validateRegistry([
  entry('persona', { optionLabel: 'nombre', fields: [text('nombre', { required: true })] }),
  entry('cita', {
    fields: [
      text('motivo'),
      { name: 'id_persona', kind: 'lookup', label: 'Persona', required: true, message: 'Seleccione una Persona', source: { catalog: 'persona' }, search: ['nombre'],
        columns: [{ key: 'nombre', header: 'NOMBRE' }], filters: [{ field: 'nombre', label: 'Nombre', type: 'text' }] },
    ],
  }),
]);
const base = toCatalogConfig(registry.bySlug.get('cita'), registry) as CatalogConfig<Row>;

const PERSONAS: Row[] = [{ id_persona: '1', nombre: 'ANA' }, { id_persona: '2', nombre: 'BEATRIZ' }];
const RECORD: Row = { id_cita: '7', motivo: 'CONTROL', id_persona: '2', persona: 'BEATRIZ' };

function services() {
  const list = vi.fn(async ({ filters }: { filters?: Record<string, string> }) => ({ items: PERSONAS.filter((r) => Object.entries(filters ?? {}).every(([k, v]) => (r[k] ?? '').includes(v))), pagination: { page: 1, pageSize: 10, total: 2 } }));
  return { list, app: { catalog: () => ({ list }), lookup: { options: vi.fn(async () => [{ id: 'S1', name: 'SEDE UNO' }]) } } as unknown as AppServices };
}
async function open(mode: 'INSERT' | 'UPDATE' | 'CLONE' | 'DETAIL' | 'DELETE', config: CatalogConfig<Row> = base) {
  const { app, list } = services();
  const service = { get: vi.fn(async () => RECORD), create: vi.fn(async (v: object) => ({ id_cita: '9', ...v })), update: vi.fn(async (id: string, v: object) => ({ id, ...v })), remove: vi.fn() } as unknown as InterCatalogService<Row>;
  const onClose = vi.fn();
  render(
    <DialogStackProvider>
      <ServicesProvider services={app}>
        <UiCrudRegister config={config} service={service} mode={mode} id={mode === 'INSERT' ? undefined : '7'} lookup={app.lookup as InterLookupService} onDone={vi.fn()} onClose={onClose} />
      </ServicesProvider>
    </DialogStackProvider>,
  );
  await waitFor(() => expect(screen.queryByText('Cargando...')).toBeNull());
  return { user: userEvent.setup(), service, list };
}
const description = () => (screen.getByLabelText('Persona descripción') as HTMLInputElement).value;
const confirmSubmit = async (user: ReturnType<typeof userEvent.setup>) => {
  await user.click(screen.getByRole('button', { name: 'Aceptar' }));
  await user.click(await screen.findByRole('button', { name: 'Confirmar' }));
};

describe('registry adapter for a lookup field (R-REG-13)', () => {
  it('becomes a lookup field with the dialog config and the source facts', () => {
    expect(base.fields.find((f) => f.name === 'id_persona')).toMatchObject({
      kind: 'lookup', source: { catalog: 'persona' }, display: 'persona', idKey: 'id_persona', optionLabel: 'nombre', codeWidth: 0,
      picker: { title: 'Persona', pickLabel: 'Agregar', columns: [{ key: 'nombre', header: 'NOMBRE' }] },
    });
  });
});

describe('UiCrudRegister lookup field (R-CRUD-18, R-CRUD-19)', () => {
  it('S-CRUD-47 the search button picks a row: code and description show, the payload carries the id only', async () => {
    const { user, service } = await open('INSERT');
    await user.click(screen.getByRole('button', { name: 'Buscar' }));
    await user.click(await screen.findByText('BEATRIZ'));
    await user.click(screen.getByRole('button', { name: 'Agregar' }));
    expect((screen.getByLabelText('Persona') as HTMLInputElement).value).toBe('2');
    expect(description()).toBe('BEATRIZ');
    await confirmSubmit(user);
    await waitFor(() => expect(service.create).toHaveBeenCalledWith({ motivo: '', id_persona: '2' }));
  });

  it('S-CRUD-47 cancelling the dialog leaves the field as it was', async () => {
    const { user } = await open('INSERT');
    await user.click(screen.getByRole('button', { name: 'Buscar' }));
    await screen.findByText('ANA');
    await user.keyboard('{Escape}');
    expect((screen.getByLabelText('Persona') as HTMLInputElement).value).toBe('');
  });

  it('S-CRUD-48 a blank required lookup blocks the submit with the configured message', async () => {
    const { user, service } = await open('INSERT');
    await user.click(screen.getByRole('button', { name: 'Aceptar' }));
    expect(await screen.findByText('Seleccione una Persona')).toBeTruthy();
    expect(service.create).not.toHaveBeenCalled();
  });

  it('S-CRUD-48 clearing the lookup clears a select that depends on it', async () => {
    const dependent: CatalogConfig<Row> = {
      ...base, entry: undefined,
      fields: [...base.fields, { kind: 'select', name: 'id_sede', label: 'Sede', source: { catalog: 'sedes' }, dependsOn: [{ field: 'id_persona', filterKey: 'id_persona' }] }],
    };
    const { user } = await open('UPDATE', dependent);
    await waitFor(() => expect((screen.getByLabelText('Sede') as HTMLSelectElement).disabled).toBe(false));
    await user.click(screen.getByRole('button', { name: 'Limpiar' }));
    await waitFor(() => expect((screen.getByLabelText('Sede') as HTMLSelectElement).disabled).toBe(true));
    expect(description()).toBe('');
  });

  it('S-CRUD-49 UPDATE restores the code and the description from the joined display', async () => {
    const { user, service } = await open('UPDATE');
    expect((screen.getByLabelText('Persona') as HTMLInputElement).value).toBe('2');
    expect(description()).toBe('BEATRIZ');
    await user.type(screen.getByLabelText('motivo'), 'X');
    await confirmSubmit(user);
    await waitFor(() => expect(service.update).toHaveBeenCalledWith('7', { motivo: 'CONTROLX', id_persona: '2' }));
  });

  it.each(['DETAIL', 'DELETE'] as const)('S-CRUD-49 %s shows the record without the search and clear buttons', async (mode) => {
    await open(mode);
    expect(description()).toBe('BEATRIZ');
    expect(screen.queryByRole('button', { name: 'Buscar' })).toBeNull();
    expect(screen.queryByRole('button', { name: 'Limpiar' })).toBeNull();
  });

  it('S-CRUD-49 CLONE copies the lookup and its description', async () => {
    const { user, service } = await open('CLONE');
    expect(description()).toBe('BEATRIZ');
    await confirmSubmit(user);
    await waitFor(() => expect(service.create).toHaveBeenCalledWith({ motivo: 'CONTROL', id_persona: '2' }));
  });
});
