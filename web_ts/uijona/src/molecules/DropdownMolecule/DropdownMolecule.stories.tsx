import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { useState } from 'react';
import { DropdownMolecule } from './DropdownMolecule';
import { ButtonAtom } from '../../atoms/ButtonAtom/ButtonAtom';

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

const meta: Meta<typeof DropdownMolecule> = {
  title: 'Molecules/DropdownMolecule',
  component: DropdownMolecule,
  tags: ['autodocs'],
  args: { onOpen: fn(), onClose: fn(), onItemSelect: fn() },
  argTypes: {
    align: { control: 'select', options: ['start', 'end'] },
  },
};
export default meta;
type Story = StoryObj<typeof DropdownMolecule>;

export const Default: Story = {
  args: {
    trigger: <ButtonAtom variant="outline">Mi cuenta ▾</ButtonAtom>,
    groups,
  },
};

export const AlignEnd: Story = {
  args: {
    trigger: <ButtonAtom>Opciones ▾</ButtonAtom>,
    groups,
    align: 'end',
  },
};

export const Interactive: Story = {
  render: () => {
    const [lastAction, setLastAction] = useState<string | null>(null);
    const menuGroups = [
      {
        label: 'Mi cuenta',
        items: [
          { label: 'Perfil', onClick: () => setLastAction('Ver perfil') },
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
      <div className="flex flex-col gap-4 items-start p-8">
        <DropdownMolecule
          trigger={<ButtonAtom variant="outline">Mi cuenta ▾</ButtonAtom>}
          groups={menuGroups}
        />
        {lastAction && (
          <p className="text-sm text-neutral-500">
            Última acción: <strong>{lastAction}</strong>
          </p>
        )}
      </div>
    );
  },
};
