import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
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
