import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import React, { useState } from 'react';
import { DataTableMolecule } from './DataTableMolecule';
import type { DataTableColumn, InterDataTableMolecule } from './InterDataTableMolecule';

// Non-generic wrapper for Storybook type inference
const DataTableStory = (props: InterDataTableMolecule<Record<string, unknown>>) => (
  <DataTableMolecule {...props} />
);

const USERS: Record<string, unknown>[] = [
  { id: 1, name: 'Ana García', email: 'ana@example.com', role: 'Admin', status: 'active' },
  { id: 2, name: 'Carlos López', email: 'carlos@example.com', role: 'Editor', status: 'active' },
  { id: 3, name: 'María Torres', email: 'maria@example.com', role: 'Viewer', status: 'inactive' },
  { id: 4, name: 'Pedro Sánchez', email: 'pedro@example.com', role: 'Editor', status: 'active' },
  { id: 5, name: 'Lucía Ramírez', email: 'lucia@example.com', role: 'Viewer', status: 'inactive' },
];

const COLUMNS: DataTableColumn<Record<string, unknown>>[] = [
  { key: 'id', header: 'ID', sortable: true, width: '60px', align: 'center' },
  { key: 'name', header: 'Nombre', sortable: true },
  { key: 'email', header: 'Email', sortable: true },
  { key: 'role', header: 'Rol', sortable: true },
  {
    key: 'status',
    header: 'Estado',
    align: 'center',
    render: (value) => (
      <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
        value === 'active' ? 'bg-green-100 text-green-700' : 'bg-neutral-100 text-neutral-500'
      }`}>
        {value === 'active' ? 'Activo' : 'Inactivo'}
      </span>
    ),
  },
];

const meta: Meta<typeof DataTableStory> = {
  title: 'Molecules/DataTableMolecule',
  component: DataTableStory,
  tags: ['autodocs'],
  args: {
    columns: COLUMNS,
    data: USERS,
    rowKey: (row) => String(row.id),
    onSortChange: fn(),
    onFilterChange: fn(),
    onRowClick: fn(),
  },
};
export default meta;
type Story = StoryObj<typeof DataTableStory>;

export const Default: Story = {};

export const WithFilter: Story = {
  args: { showFilter: true, filterPlaceholder: 'Buscar usuarios...' },
};

export const Loading: Story = {
  args: { loading: true },
};

export const Empty: Story = {
  args: {
    data: [],
    emptyTitle: 'No hay usuarios',
    emptyDescription: 'Aún no se han registrado usuarios en el sistema.',
  },
};

export const StickyHeader: Story = {
  args: {
    showFilter: true,
    stickyHeader: true,
    className: 'max-h-64',
    data: [...USERS, ...USERS.map((u) => ({ ...u, id: (u.id as number) + 10 }))],
  },
};

export const ClickableRows: Story = {
  args: { onRowClick: fn() },
};

export const Interactive: Story = {
  args: {
    onFilterChange: fn(),
    onRowClick: fn(),
  },
  render: (args) => {
    const [filter, setFilter] = useState('');
    const [selected, setSelected] = useState<string | null>(null);
    const filtered = USERS.filter((u) =>
      Object.values(u).some((v) => String(v).toLowerCase().includes(filter.toLowerCase()))
    );
    return (
      <div className="flex flex-col gap-3">
        <DataTableMolecule
          columns={COLUMNS}
          data={filtered}
          rowKey={(row) => String(row.id)}
          showFilter
          filterPlaceholder="Buscar por nombre, email o rol..."
          onFilterChange={(v) => { args.onFilterChange?.(v); setFilter(v); }}
          onRowClick={(row, index) => { args.onRowClick?.(row, index); setSelected(String(row.name)); }}
        />
        {selected && (
          <p className="text-sm text-neutral-500">
            Fila seleccionada: <strong>{selected}</strong>
          </p>
        )}
      </div>
    );
  },
};
