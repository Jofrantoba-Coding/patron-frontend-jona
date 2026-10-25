import type { Meta, StoryObj } from '@storybook/react';
import { fn, userEvent, within } from '@storybook/test';
import { useState } from 'react';
import { JToolbar, JTOOLBAR_DEFAULTS, JToolbarItem } from './JToolbar';
import { JLabel } from '../../atoms/JLabel';

const ITEMS: JToolbarItem[] = [
  { id: 'add', label: 'Agregar', tone: 'primary', shortcut: 'Alt+A', group: 'edit' },
  { id: 'edit', label: 'Modificar', disabled: true, disabledReason: 'Seleccione un registro', group: 'edit' },
  { id: 'clone', label: 'Clonar', disabled: true, disabledReason: 'Seleccione un registro', group: 'edit' },
  { id: 'delete', label: 'Eliminar', tone: 'danger', disabled: true, disabledReason: 'Seleccione un registro', group: 'danger' },
  { id: 'search', label: 'Buscar', shortcut: 'Alt+B', overflow: true },
  { id: 'export', label: 'Exportar', overflow: true, disabled: true, disabledReason: 'Sin datos' },
];

const meta: Meta<typeof JToolbar> = {
  title: 'Molecules/JToolbar',
  component: JToolbar,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'JToolbar declara sus acciones como datos. Es una sola parada de tabulación: ← → Home End mueven el foco entre las acciones habilitadas. Una acción deshabilitada es un botón deshabilitado nativo, descrito por su motivo. Las acciones con `overflow` van al menú `Más acciones`, que se cierra con Esc sin cerrar un diálogo de abajo.',
      },
    },
  },
  args: { ariaLabel: 'Acciones', items: ITEMS, onAction: fn() },
  argTypes: {
    overflowLabel: { control: 'text', table: { defaultValue: { summary: JTOOLBAR_DEFAULTS.overflowLabel } } },
  },
};
export default meta;
type Story = StoryObj<typeof JToolbar>;

export const Default: Story = {};

export const WithoutOverflow: Story = {
  args: { items: ITEMS.filter((item) => !item.overflow) },
};

const WithSelection = () => {
  const [selected, setSelected] = useState(false);
  const [last, setLast] = useState('—');
  const items = ITEMS.map((item) =>
    ['edit', 'clone', 'delete'].includes(item.id) ? { ...item, disabled: !selected } : item,
  );
  return (
    <div className="flex flex-col gap-3">
      <JToolbar
        ariaLabel="Acciones"
        items={items}
        onAction={(id) => {
          setLast(id);
          if (id === 'add') setSelected((value) => !value);
        }}
      />
      <JLabel>{`Última acción: ${last}. Agregar alterna la selección.`}</JLabel>
    </div>
  );
};

export const Interactive: Story = {
  render: () => <WithSelection />,
};

/** The overflow menu opened on load, to review its surface in both themes. */
export const OverflowOpen: Story = {
  play: async ({ canvasElement }) => {
    await userEvent.click(within(canvasElement).getByRole('button', { name: 'Más acciones' }));
  },
};
