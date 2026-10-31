import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { useState } from 'react';
import { JDataGrid, JDATAGRID_DEFAULTS, JDataGridColumn, JDataGridSortDirection } from './JDataGrid';
import { JLabel } from '../../atoms/JLabel';

interface Localidad {
  id: string;
  codigo: string;
  nombre: string;
  provincia: string;
}

const PROVINCIAS = ['Lima', 'Cusco', 'Arequipa', 'Piura', 'Puno'];

const ROWS: Localidad[] = Array.from({ length: 25 }, (_, index) => ({
  id: String(index + 1),
  codigo: String(index + 1).padStart(4, '0'),
  nombre: `Localidad ${index + 1}`,
  provincia: PROVINCIAS[index % PROVINCIAS.length],
}));

const COLUMNS: JDataGridColumn<Localidad>[] = [
  { key: 'codigo', header: 'Código', width: '6rem', sortable: true },
  { key: 'nombre', header: 'Nombre', sortable: true },
  { key: 'provincia', header: 'Provincia' },
];

const meta: Meta<typeof JDataGrid<Localidad>> = {
  title: 'Molecules/JDataGrid',
  component: JDataGrid,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'JDataGrid es una grilla `role="grid"` con una sola parada de tabulación: ↑ ↓ Home End PgUp/PgDn (10 filas) mueven la fila enfocada y la selección la sigue; Enter o doble clic abren la fila. La selección es controlada (`selectedKey`, `onSelect`). `focusRow(key)` enfoca una fila desde el host.',
      },
    },
  },
  args: {
    ariaLabel: 'Localidad',
    columns: COLUMNS,
    rows: ROWS.slice(0, 8),
    rowKey: (row: Localidad) => row.id,
    selectedKey: '2',
    onSelect: fn(),
    onOpen: fn(),
    onSortChange: fn(),
  },
  argTypes: {
    loadingLabel: { control: 'text', table: { defaultValue: { summary: JDATAGRID_DEFAULTS.loadingLabel } } },
  },
};
export default meta;
type Story = StoryObj<typeof JDataGrid<Localidad>>;

export const Default: Story = {};

const KeyboardDemo = () => {
  const [selected, setSelected] = useState<string | null>(null);
  const [opened, setOpened] = useState('—');
  const [sort, setSort] = useState<{ key: string; direction: JDataGridSortDirection }>({ key: 'codigo', direction: 'asc' });
  const rows = [...ROWS].sort((a, b) => {
    const order = String(a[sort.key as keyof Localidad]).localeCompare(String(b[sort.key as keyof Localidad]));
    return sort.direction === 'asc' ? order : -order;
  });
  return (
    <div className="flex flex-col gap-3">
      <JDataGrid<Localidad>
        ariaLabel="Localidad"
        columns={COLUMNS}
        rows={rows}
        rowKey={(row) => row.id}
        selectedKey={selected}
        maxHeight="20rem"
        sort={sort}
        onSelect={setSelected}
        onOpen={setOpened}
        onSortChange={(key, direction) => setSort({ key, direction })}
      />
      <JLabel>{`Seleccionada: ${selected ?? '—'}. Abierta: ${opened}.`}</JLabel>
    </div>
  );
};

/** 25 rows: try ↑ ↓ Home End PgUp PgDn and Enter. */
export const Keyboard: Story = {
  render: () => <KeyboardDemo />,
};
