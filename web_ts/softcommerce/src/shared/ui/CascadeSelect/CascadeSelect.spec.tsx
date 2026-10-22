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
const alerts = () => screen.queryAllByRole('alert');
/** The load-error alert the level's select points to through aria-describedby, if any. */
const loadError = (label: string) => {
  const id = combo(label).getAttribute('aria-describedby');
  return id ? document.getElementById(id) : null;
};
type Deferred = { resolve: (items: CascadeOption[]) => void; reject: (error: Error) => void };
/** Top level resolves at once; every other parent waits on a deferred kept per parent. */
function deferredLoader() {
  const pending: Record<string, Deferred> = {};
  const loadChildren = (parent: string) =>
    parent === '' ? Promise.resolve(TREE['']) : new Promise<CascadeOption[]>((resolve, reject) => (pending[parent] = { resolve, reject }));
  return { pending, loadChildren };
}

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

  it.each<{ label: string; parent: string; initial: Record<string, string>; expected: string[] }>([
    { label: 'Provincia', parent: '15', initial: { dep: '15' }, expected: ['LIMA', 'CANETE'] },
    { label: 'Departamento', parent: '', initial: {}, expected: ['LIMA', 'CUSCO'] },
  ])('shows a retryable load error on $label when its options fail to load', async ({ label, parent, initial, expected }) => {
    let failures = 1;
    const loadChildren = vi.fn(async (p: string) => {
      if (p === parent && failures-- > 0) throw new Error('network');
      return TREE[p] ?? [];
    });
    render(<Harness initial={initial} loadChildren={loadChildren} />);

    await waitFor(() => expect(loadError(label)?.textContent).toContain('No se pudieron cargar las opciones.'));
    expect(loadError(label)?.getAttribute('role')).toBe('alert');
    expect(combo(label).disabled).toBe(true);
    expect(combo('Distrito').disabled).toBe(true);

    await userEvent.click(screen.getByRole('button', { name: 'Reintentar' }));

    await waitFor(() => expect(optionNames(label)).toEqual(expected));
    expect(alerts()).toHaveLength(0);
    expect(combo(label).disabled).toBe(false);
    expect(loadChildren.mock.calls.filter(([p]) => p === parent)).toHaveLength(2);
  });

  it.each([
    { stale: 'rejection', settleOld: (d: Deferred) => d.reject(new Error('network')), settleNew: (d: Deferred) => d.resolve(TREE['08']), options: ['CUSCO'], errors: 0 },
    { stale: 'success', settleOld: (d: Deferred) => d.resolve(TREE['15']), settleNew: (d: Deferred) => d.reject(new Error('network')), options: [], errors: 1 },
  ])('S-LOC-10 ignores a stale $stale that arrives after a newer request', async ({ settleOld, settleNew, options, errors }) => {
    const { pending, loadChildren } = deferredLoader();
    render(<Harness initial={{}} loadChildren={loadChildren} />);
    await waitFor(() => expect(optionNames('Departamento')).toHaveLength(2));

    await userEvent.selectOptions(combo('Departamento'), '15');
    await userEvent.selectOptions(combo('Departamento'), '08');
    await act(async () => settleNew(pending['08']));
    await act(async () => settleOld(pending['15']));

    expect(optionNames('Provincia')).toEqual(options);
    expect(alerts()).toHaveLength(errors);
  });

  it('clears a lower level load error when the level above changes', async () => {
    const { pending, loadChildren } = deferredLoader();
    render(<Harness initial={{}} loadChildren={loadChildren} />);
    await waitFor(() => expect(optionNames('Departamento')).toHaveLength(2));
    await userEvent.selectOptions(combo('Departamento'), '15');
    await act(async () => pending['15'].reject(new Error('network')));
    expect(loadError('Provincia')).not.toBeNull();

    await userEvent.selectOptions(combo('Departamento'), '08');

    expect(alerts()).toHaveLength(0);
    await act(async () => pending['08'].resolve(TREE['08']));
    expect(optionNames('Provincia')).toEqual(['CUSCO']);
  });
});
