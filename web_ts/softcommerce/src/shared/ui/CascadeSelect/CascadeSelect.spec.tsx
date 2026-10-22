import { act, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { CascadeSelect } from './CascadeSelect';
import type { CascadeOption } from './InterCascadeSelect';

const LEVELS = [
  { name: 'dep', label: 'Departamento' },
  { name: 'prov', label: 'Provincia' },
  { name: 'dist', label: 'Distrito' },
];
const TREE: Record<string, CascadeOption[]> = {
  '': [{ id: '15', name: 'LIMA' }, { id: '08', name: 'CUSCO' }],
  '15': [{ id: '1501', name: 'LIMA' }, { id: '1505', name: 'CANETE' }],
  '08': [{ id: '0801', name: 'CUSCO' }],
  '1501': [{ id: '150101', name: 'LIMA' }, { id: '150102', name: 'ANCON' }],
  '1505': [{ id: '150501', name: 'ASIA' }],
  '0801': [{ id: '080101', name: 'CUSCO CENTRO' }],
};
const LIMA_ANCON = { dep: '15', prov: '1501', dist: '150102' };

const lookup = (loadChildren: (parent: string) => Promise<CascadeOption[]> = async (p) => TREE[p] ?? []) => loadChildren;

function Harness({ initial, loadChildren }: { initial: Record<string, string>; loadChildren: (parent: string) => Promise<CascadeOption[]> }) {
  const [values, setValues] = useState(initial);
  return <CascadeSelect levels={LEVELS} values={values} loadChildren={loadChildren} onChange={(name, value) => setValues((v) => ({ ...v, [name]: value }))} />;
}

const combo = (label: string) => screen.getByLabelText(label) as HTMLSelectElement;
const optionNames = (label: string) => Array.from(combo(label).options).map((o) => o.text).filter((t) => t !== 'Seleccione');

describe('CascadeSelect', () => {
  it('S-LOC-6 starts with the lower levels disabled and empty, and a departamento enables and loads provincias only', async () => {
    const loadChildren = vi.fn(lookup());
    render(<Harness initial={{}} loadChildren={loadChildren} />);
    await waitFor(() => expect(optionNames('Departamento')).toEqual(['LIMA', 'CUSCO']));
    expect(combo('Provincia').disabled).toBe(true);
    expect(combo('Distrito').disabled).toBe(true);
    expect(loadChildren).toHaveBeenCalledTimes(1);

    await userEvent.selectOptions(combo('Departamento'), '15');

    await waitFor(() => expect(optionNames('Provincia')).toEqual(['LIMA', 'CANETE']));
    expect(combo('Provincia').disabled).toBe(false);
    expect(combo('Distrito').disabled).toBe(true);
    expect(loadChildren.mock.calls.map(([parent]) => parent)).toEqual(['', '15']);
  });

  it('restores a full selection with every option list loaded', async () => {
    render(<Harness initial={LIMA_ANCON} loadChildren={lookup()} />);

    await waitFor(() => expect(optionNames('Distrito')).toEqual(['LIMA', 'ANCON']));
    expect([combo('Departamento').value, combo('Provincia').value, combo('Distrito').value]).toEqual(['15', '1501', '150102']);
  });

  it('S-LOC-7 clears provincia and distrito when the departamento changes, and reloads for the new one', async () => {
    render(<Harness initial={LIMA_ANCON} loadChildren={lookup()} />);
    await waitFor(() => expect(optionNames('Distrito')).toHaveLength(2));

    await userEvent.selectOptions(combo('Departamento'), '08');

    await waitFor(() => expect(optionNames('Provincia')).toEqual(['CUSCO']));
    expect([combo('Provincia').value, combo('Distrito').value]).toEqual(['', '']);
    expect(combo('Distrito').disabled).toBe(true);
  });

  it('S-LOC-8 clears only distrito when the provincia changes', async () => {
    render(<Harness initial={LIMA_ANCON} loadChildren={lookup()} />);
    await waitFor(() => expect(optionNames('Distrito')).toHaveLength(2));

    await userEvent.selectOptions(combo('Provincia'), '1505');

    await waitFor(() => expect(optionNames('Distrito')).toEqual(['ASIA']));
    expect([combo('Departamento').value, combo('Provincia').value, combo('Distrito').value]).toEqual(['15', '1505', '']);
  });

  it('S-LOC-9 keeps the levels above when the distrito changes', async () => {
    render(<Harness initial={LIMA_ANCON} loadChildren={lookup()} />);
    await waitFor(() => expect(optionNames('Distrito')).toHaveLength(2));

    await userEvent.selectOptions(combo('Distrito'), '150101');

    expect([combo('Departamento').value, combo('Provincia').value, combo('Distrito').value]).toEqual(['15', '1501', '150101']);
  });

  it('S-LOC-10 ignores a stale response that arrives after a newer request', async () => {
    const pending: Record<string, (items: CascadeOption[]) => void> = {};
    const loadChildren = (parent: string) => (parent === '' ? Promise.resolve(TREE['']) : new Promise<CascadeOption[]>((resolve) => (pending[parent] = resolve)));
    render(<Harness initial={{}} loadChildren={loadChildren} />);
    await waitFor(() => expect(optionNames('Departamento')).toHaveLength(2));

    await userEvent.selectOptions(combo('Departamento'), '15');
    await userEvent.selectOptions(combo('Departamento'), '08');
    await act(async () => pending['08'](TREE['08']));
    await act(async () => pending['15'](TREE['15']));

    expect(optionNames('Provincia')).toEqual(['CUSCO']);
  });
});
