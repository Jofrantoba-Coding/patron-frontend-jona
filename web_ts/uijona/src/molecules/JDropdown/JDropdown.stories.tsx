import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { useState } from 'react';
import { JDropdown, JDROPDOWN_DEFAULTS } from './JDropdown';
import { JButton } from '../../atoms/JButton/JButton';
import { JLabel } from '../../atoms/JLabel';

const groups = [
  {
    label: 'Mi cuenta',
    items: [
      { label: 'Perfil',        onClick: fn() },
      { label: 'Configuración', onClick: fn() },
    ],
  },
  {
    items: [
      { label: 'Cerrar sesión', variant: 'destructive' as const, onClick: fn() },
    ],
  },
];

const meta: Meta<typeof JDropdown> = {
  title: 'Molecules/JDropdown',
  component: JDropdown,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'JDropdown muestra un menú contextual flotante (portal) anclado a un trigger. Soporta grupos, iconos, atajos, variante destructiva, items deshabilitados y alineación start/end.',
      },
    },
  },
  args: { onOpen: fn(), onClose: fn(), onItemSelect: fn() },
  argTypes: {
    align: {
      control: 'select',
      options: ['start', 'end'],
      table: { type: { summary: 'string' }, defaultValue: { summary: JDROPDOWN_DEFAULTS.align } },
    },
  },
};
export default meta;
type Story = StoryObj<typeof JDropdown>;

export const Default: Story = {
  args: {
    trigger: <JButton variant="outline">Mi cuenta ▾</JButton>,
    groups,
  },
};

export const AlignEnd: Story = {
  args: {
    trigger: <JButton>Opciones ▾</JButton>,
    groups,
    align: 'end',
  },
  parameters: {
    docs: { description: { story: '`align="end"` alinea el menú al borde derecho del trigger.' } },
  },
};

export const WithShortcuts: Story = {
  args: {
    trigger: <JButton variant="outline">Archivo ▾</JButton>,
    groups: [
      {
        items: [
          { label: 'Nuevo',    shortcut: '⌘N', onClick: fn() },
          { label: 'Abrir',   shortcut: '⌘O', onClick: fn() },
          { label: 'Guardar', shortcut: '⌘S', onClick: fn() },
        ],
      },
      {
        items: [
          { label: 'Eliminar', variant: 'destructive' as const, shortcut: '⌫', onClick: fn() },
        ],
      },
    ],
  },
  parameters: {
    docs: { description: { story: 'Items con atajos de teclado (`shortcut`) alineados a la derecha.' } },
  },
};

export const WithDisabled: Story = {
  args: {
    trigger: <JButton variant="outline">Acciones ▾</JButton>,
    groups: [
      {
        items: [
          { label: 'Editar',   onClick: fn() },
          { label: 'Archivar', disabled: true, onClick: fn() },
          { label: 'Exportar', onClick: fn() },
        ],
      },
    ],
    onDisabledItemClick: fn(),
  },
  parameters: {
    docs: { description: { story: 'Items con `disabled: true` disparan `onDisabledItemClick` sin ejecutar `onClick` ni cerrar el menú.' } },
  },
};

export const Interactive: Story = {
  parameters: {
    docs: { description: { story: 'Cada acción del menú registra la última opción seleccionada.' } },
  },
  render: () => {
    const [lastAction, setLastAction] = useState<string | null>(null);
    const menuGroups = [
      {
        label: 'Mi cuenta',
        items: [
          { label: 'Perfil',        onClick: () => setLastAction('Ver perfil') },
          { label: 'Configuración', onClick: () => setLastAction('Abrir configuración') },
        ],
      },
      {
        items: [
          { label: 'Cerrar sesión', variant: 'destructive' as const, onClick: () => setLastAction('Cerrar sesión') },
        ],
      },
    ];
    return (
      <div className="flex flex-col items-start gap-4 p-8">
        <JDropdown
          trigger={<JButton variant="outline">Mi cuenta ▾</JButton>}
          groups={menuGroups}
        />
        {lastAction && (
          <JLabel size="sm" color="muted">
            Última acción: <strong>{lastAction}</strong>
          </JLabel>
        )}
      </div>
    );
  },
};
