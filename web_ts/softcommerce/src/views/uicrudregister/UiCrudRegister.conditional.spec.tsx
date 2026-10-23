import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import type { CatalogConfig } from '../../catalogs/CatalogConfig';
import type { InterCatalogService } from '../../services/InterCatalogService';
import { DialogStackProvider } from '../uishell/DialogStackProvider';
import type { RegisterMode } from './InterUiCrudRegister';
import { UiCrudRegister } from './UiCrudRegister';

type Row = Record<string, string>;
const TIPOS = [{ value: '01', label: 'Factura' }, { value: 'TI', label: 'Ticket' }];
const TICKET = { field: 'tipo', in: ['TI'] };
const config: CatalogConfig<Row> = {
  formId: 'f', title: 'Prueba', catalog: 'prueba', idKey: 'id', columns: [{ key: 'serie', header: 'Serie' }],
  fields: [
    { kind: 'code', name: 'id', label: 'Código' },
    { kind: 'options', name: 'tipo', label: 'Tipo', display: 'select', options: TIPOS, default: '01', clearsOnChange: ['marca'] },
    { kind: 'text', name: 'serie', label: 'Serie', required: true },
    { kind: 'text', name: 'marca', label: 'Marca' },
    { kind: 'text', name: 'nota', label: 'Nota', visibleWhen: TICKET, requiredWhen: TICKET },
    { kind: 'text', name: 'obs', label: 'Obs', required: true, enabledWhen: { field: 'tipo', in: ['01'] } },
  ],
};

async function open(mode: RegisterMode, record: Row = { id: '1', tipo: '01', serie: 'F001', marca: 'ACME', nota: '', obs: 'x' }) {
  const user = userEvent.setup();
  const service = {
    get: vi.fn(async () => record),
    create: vi.fn(async (values: object) => ({ id: '9', ...values })),
    update: vi.fn(async (id: string, values: object) => ({ id, ...values })),
    remove: vi.fn(),
  };
  render(
    <DialogStackProvider>
      <UiCrudRegister config={config} service={service as unknown as InterCatalogService<Row>} mode={mode} id={mode === 'INSERT' ? undefined : '1'} onDone={vi.fn()} onClose={vi.fn()} />
    </DialogStackProvider>,
  );
  await waitFor(() => expect(screen.queryByText('Cargando...')).toBeNull());
  return { user, service };
}
type User = ReturnType<typeof userEvent.setup>;
const tipo = () => screen.getByLabelText('Tipo') as HTMLSelectElement;
const submit = async (user: User) => user.click(screen.getByRole('button', { name: 'Aceptar' }));
const confirm = async (user: User) => user.click(screen.getByRole('button', { name: 'Confirmar' }));

describe('S-CRUD-33 conditional fields (R-CRUD-13)', () => {
  it('a field whose visibleWhen fails is not rendered', async () => {
    await open('INSERT');
    expect(screen.queryByLabelText('Nota')).toBeNull();
  });

  it('showing it (tipo TI) makes it required: a blank value blocks the submit', async () => {
    const { user, service } = await open('INSERT');
    await user.selectOptions(tipo(), 'Ticket');
    await user.type(screen.getByLabelText('Serie'), 'F001');
    await submit(user);
    expect(screen.getByText('Nota es obligatorio.')).toBeTruthy();
    expect(service.create).not.toHaveBeenCalled();
  });

  it('a typed value is sent while it is visible', async () => {
    const { user, service } = await open('INSERT');
    await user.selectOptions(tipo(), 'Ticket');
    await user.type(screen.getByLabelText('Serie'), 'F001');
    await user.type(screen.getByLabelText('Nota'), 'N1');
    await submit(user);
    await confirm(user);
    await waitFor(() => expect(service.create).toHaveBeenCalledWith(expect.objectContaining({ tipo: 'TI', nota: 'N1' })));
  });

  it('changing the tipo away hides the field, clears its error and sends null (R-CRUD-13)', async () => {
    const { user, service } = await open('INSERT');
    await user.selectOptions(tipo(), 'Ticket');
    await user.type(screen.getByLabelText('Serie'), 'F001');
    await submit(user);
    expect(screen.getByText('Nota es obligatorio.')).toBeTruthy();
    await user.selectOptions(tipo(), 'Factura');
    expect(screen.queryByLabelText('Nota')).toBeNull();
    expect(screen.queryByText('Nota es obligatorio.')).toBeNull();
    await user.type(screen.getByLabelText('Obs'), 'o');
    await submit(user);
    await confirm(user);
    await waitFor(() => expect(service.create).toHaveBeenCalledWith(expect.objectContaining({ tipo: '01', nota: null })));
  });

  it('re-showing a field does not restore the value that was cleared', async () => {
    const { user } = await open('INSERT');
    await user.selectOptions(tipo(), 'Ticket');
    await user.type(screen.getByLabelText('Nota'), 'N1');
    await user.selectOptions(tipo(), 'Factura');
    await user.selectOptions(tipo(), 'Ticket');
    expect((screen.getByLabelText('Nota') as HTMLInputElement).value).toBe('');
  });

  it('a hidden required field is not validated (R-CRUD-5)', async () => {
    const { user, service } = await open('INSERT');
    await user.type(screen.getByLabelText('Serie'), 'F001');
    await user.type(screen.getByLabelText('Obs'), 'o');
    await submit(user);
    await confirm(user);
    await waitFor(() => expect(service.create).toHaveBeenCalled());
  });

  it('UPDATE: a record whose hidden field holds an empty string sends null for it', async () => {
    const { user, service } = await open('UPDATE');
    await submit(user);
    await confirm(user);
    await waitFor(() => expect(service.update).toHaveBeenCalledWith('1', expect.objectContaining({ nota: null })));
  });

  it.each(['DETAIL', 'DELETE'] as const)('%s keeps a hidden field hidden', async (mode) => {
    await open(mode);
    expect(screen.queryByLabelText('Nota')).toBeNull();
  });
});

describe('enabledWhen and clearsOnChange (R-CRUD-5, R-CRUD-13)', () => {
  it('a disabled field is shown read-only and is not validated, even when required', async () => {
    const { user, service } = await open('INSERT');
    expect((screen.getByLabelText('Obs') as HTMLInputElement).readOnly).toBe(false);
    await user.selectOptions(tipo(), 'Ticket');
    expect((screen.getByLabelText('Obs') as HTMLInputElement).readOnly).toBe(true);
    await user.type(screen.getByLabelText('Serie'), 'F001');
    await user.type(screen.getByLabelText('Nota'), 'N1');
    await submit(user);
    await confirm(user);
    await waitFor(() => expect(service.create).toHaveBeenCalled());
  });

  it('a required enabled field still blocks', async () => {
    const { user, service } = await open('INSERT');
    await user.type(screen.getByLabelText('Serie'), 'F001');
    await submit(user);
    expect(screen.getByText('Obs es obligatorio.')).toBeTruthy();
    expect(service.create).not.toHaveBeenCalled();
  });

  it('clearsOnChange empties the named fields when the field changes', async () => {
    const { user } = await open('UPDATE');
    expect((screen.getByLabelText('Marca') as HTMLInputElement).value).toBe('ACME');
    await user.selectOptions(tipo(), 'Ticket');
    expect((screen.getByLabelText('Marca') as HTMLInputElement).value).toBe('');
  });
});
