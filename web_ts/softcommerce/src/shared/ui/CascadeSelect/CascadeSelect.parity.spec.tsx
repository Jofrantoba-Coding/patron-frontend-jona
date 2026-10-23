import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { CascadeSelect } from './CascadeSelect';
import type { CascadeOption } from './InterCascadeSelect';

// S-LOC-10 / R-CRUD-12: the cascade is rebuilt on the dependent engine with the SAME props and behavior as W1.
const LEVELS = [{ name: 'dep', label: 'Departamento' }, { name: 'prov', label: 'Provincia' }, { name: 'dist', label: 'Distrito' }];
const TREE: Record<string, CascadeOption[]> = {
  '': [{ id: '15', name: 'LIMA' }, { id: '08', name: 'CUSCO' }],
  '15': [{ id: '1501', name: 'LIMA' }],
  '08': [{ id: '0801', name: 'CUSCO' }],
  '1501': [{ id: '150101', name: 'ANCON' }],
};
const combo = (label: string) => screen.getByLabelText(label) as HTMLSelectElement;
const names = (label: string) => [...combo(label).options].map((o) => o.text).filter((t) => t !== 'Seleccione');

function Harness({ initial, loadChildren, filter, onChange }: { initial: Record<string, string>; loadChildren: any; filter?: Record<string, string>; onChange?: (name: string, value: string) => void }) {
  const [values, setValues] = useState(initial);
  return (
    <CascadeSelect
      levels={LEVELS}
      values={values}
      loadChildren={loadChildren}
      filter={filter}
      onChange={(name, value) => {
        onChange?.(name, value);
        setValues((v) => ({ ...v, [name]: value }));
      }}
    />
  );
}

describe('CascadeSelect on the dependent engine', () => {
  it('asks each level once on restore, and only with the parent id when no filter is set', async () => {
    const loadChildren = vi.fn(async (parent: string) => TREE[parent] ?? []);
    render(<Harness initial={{ dep: '15', prov: '1501', dist: '150101' }} loadChildren={loadChildren} />);
    await waitFor(() => expect(names('Distrito')).toEqual(['ANCON']));
    expect(loadChildren.mock.calls).toEqual([[''], ['15'], ['1501']]);
  });

  it('forwards an optional static filter with every level request (the zonas filter of W2-11)', async () => {
    const loadChildren = vi.fn(async (parent: string, _filter?: Record<string, string>) => TREE[parent] ?? []);
    render(<Harness initial={{}} loadChildren={loadChildren} filter={{ has: 'zonas' }} />);
    await waitFor(() => expect(names('Departamento')).toEqual(['LIMA', 'CUSCO']));
    await userEvent.selectOptions(combo('Departamento'), '15');
    await waitFor(() => expect(names('Provincia')).toEqual(['LIMA']));
    expect(loadChildren.mock.calls).toEqual([['', { has: 'zonas' }], ['15', { has: 'zonas' }]]);
  });

  it('reports a change value-first, then empties each level below it in order', async () => {
    const onChange = vi.fn();
    render(<Harness initial={{ dep: '15', prov: '1501', dist: '150101' }} loadChildren={async (p: string) => TREE[p] ?? []} onChange={onChange} />);
    await waitFor(() => expect(names('Distrito')).toEqual(['ANCON']));
    await userEvent.selectOptions(combo('Departamento'), '08');
    expect(onChange.mock.calls).toEqual([['dep', '08'], ['prov', ''], ['dist', '']]);
  });

  it('a level below an empty parent stays empty and disabled, without a request', async () => {
    const loadChildren = vi.fn(async (parent: string) => TREE[parent] ?? []);
    render(<Harness initial={{}} loadChildren={loadChildren} />);
    await waitFor(() => expect(names('Departamento')).toHaveLength(2));
    expect([combo('Provincia').disabled, combo('Distrito').disabled, names('Provincia')]).toEqual([true, true, []]);
    expect(loadChildren).toHaveBeenCalledTimes(1);
  });
});
