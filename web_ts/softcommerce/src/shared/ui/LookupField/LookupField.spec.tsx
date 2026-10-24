import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { padTypedCode } from '../../../domain/crud/lookupCode';
import { DialogStackProvider } from '../../../views/uishell/DialogStackProvider';
import type { LookupQuery } from '../LookupDialog';
import { LookupField } from './LookupField';

type Row = Record<string, string>;
const ACTIVE: Row[] = [{ id_transportista: '0000000042', razon_social: 'ACME SAC' }, { id_transportista: '12345678', razon_social: 'OCHO SRL' }];
const config = { title: 'Transportista', pickLabel: 'Agregar', columns: [{ key: 'razon_social', header: 'RAZON SOCIAL' }], filters: [{ field: 'razon_social', label: 'R. Social', type: 'text' as const }] };

/** The server lists ACTIVE rows only: an inactive `0000000043` is simply not there. */
function fakeList() {
  return vi.fn(async ({ filters, page, pageSize }: LookupQuery) => {
    const hit = ACTIVE.filter((r) => Object.entries(filters).every(([key, needle]) => (r[key] ?? '').includes(needle)));
    return { items: hit.slice((page - 1) * pageSize, page * pageSize), pagination: { page, pageSize, total: hit.length } };
  });
}

function Host({ list, codeWidth = 10, initial = '', readOnly = false, onChange }: { list: ReturnType<typeof fakeList>; codeWidth?: number; initial?: string; readOnly?: boolean; onChange?: (id: string) => void }) {
  const [value, setValue] = useState(initial);
  const [description, setDescription] = useState('');
  return (
    <DialogStackProvider>
      <LookupField
        name="id_transportista" label="Transportista" value={value} description={description} codeWidth={codeWidth} readOnly={readOnly}
        dialog={{ config, idKey: 'id_transportista', list, loadOptions: async () => [] }}
        describe={(row) => row.razon_social}
        onChange={(id, text) => { setValue(id); setDescription(text); onChange?.(id); }}
      />
    </DialogStackProvider>
  );
}
const code = () => screen.getByLabelText('Transportista') as HTMLInputElement;
const typeCode = async (text: string) => {
  const user = userEvent.setup();
  await user.type(code(), text);
  await user.tab();
  return user;
};

describe('padTypedCode (R-LKP-6)', () => {
  it('pads a code shorter than the width unless it has 8 characters', () => {
    expect([padTypedCode('42', 10), padTypedCode('12345678', 10), padTypedCode('1234567', 10), padTypedCode('1234567890', 10), padTypedCode('42', 0), padTypedCode('', 10)]).toEqual(['0000000042', '12345678', '0001234567', '1234567890', '42', '']);
  });
});

describe('LookupField typed code (R-LKP-6)', () => {
  it('S-LKP-10 a code that matches an active record fills the field and its description without opening the dialog', async () => {
    render(<Host list={fakeList()} />);
    await typeCode('42');
    await waitFor(() => expect(code().value).toBe('0000000042'));
    expect((screen.getByLabelText('Transportista descripción') as HTMLInputElement).value).toBe('ACME SAC');
    expect(screen.queryByRole('dialog')).toBeNull();
  });

  it('S-LKP-10 no active match opens the dialog (an unknown code and an inactive one alike)', async () => {
    const list = fakeList();
    render(<Host list={list} />);
    await typeCode('99');
    await screen.findByRole('dialog');
    expect(list).toHaveBeenCalledWith(expect.objectContaining({ filters: { id_transportista: '0000000099' } }));
  });

  it('an 8-character code is kept as typed, and a target without a code width is never padded', async () => {
    const list = fakeList();
    const { unmount } = render(<Host list={list} />);
    await typeCode('12345678');
    await waitFor(() => expect(code().value).toBe('12345678'));
    expect(list).toHaveBeenCalledWith(expect.objectContaining({ filters: { id_transportista: '12345678' } }));
    unmount();
    render(<Host list={list} codeWidth={0} />);
    await typeCode('42');
    await screen.findByRole('dialog');
    expect(list).toHaveBeenCalledWith(expect.objectContaining({ filters: { id_transportista: '42' } }));
  });

  it('S-LKP-11 clearing the code with Backspace clears its description', async () => {
    const onChange = vi.fn();
    render(<Host list={fakeList()} onChange={onChange} />);
    const user = await typeCode('42');
    await waitFor(() => expect(code().value).toBe('0000000042'));
    await user.click(code());
    await user.keyboard('{Backspace>10/}');
    expect(code().value).toBe('');
    expect((screen.getByLabelText('Transportista descripción') as HTMLInputElement).value).toBe('');
    expect(onChange).toHaveBeenLastCalledWith('');
  });
});

describe('LookupField search button and read-only', () => {
  it('the search button opens the dialog; a pick shows the code and the read-only description; cancel leaves the field', async () => {
    const user = userEvent.setup();
    render(<Host list={fakeList()} />);
    await user.click(screen.getByRole('button', { name: 'Buscar' }));
    await user.click(await screen.findByText('OCHO SRL'));
    await user.click(screen.getByRole('button', { name: 'Agregar' }));
    expect(code().value).toBe('12345678');
    const description = screen.getByLabelText('Transportista descripción') as HTMLInputElement;
    expect([description.value, description.readOnly]).toEqual(['OCHO SRL', true]);
    expect(screen.queryByRole('dialog')).toBeNull();
    await user.click(screen.getByRole('button', { name: 'Buscar' }));
    await screen.findByRole('dialog');
    await user.click(screen.getByRole('button', { name: 'Cancelar' }));
    expect(code().value).toBe('12345678');
  });

  it('a read-only field shows its value without the search and clear buttons', () => {
    render(<Host list={fakeList()} initial="12345678" readOnly />);
    expect(code().readOnly).toBe(true);
    expect(screen.queryByRole('button', { name: 'Buscar' })).toBeNull();
    expect(screen.queryByRole('button', { name: 'Limpiar' })).toBeNull();
  });
});
