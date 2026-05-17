import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { useState } from 'react';
import { PopoverMolecule } from './PopoverMolecule';
import { JPanel } from '../../atoms/JPanel/JPanel';
import { JButton } from '../../atoms/JButton/JButton';
import { JLabel } from '../../atoms/JLabel';

const meta: Meta<typeof PopoverMolecule> = {
  title: 'Molecules/PopoverMolecule',
  component: PopoverMolecule,
  tags: ['autodocs'],
  args: {
    onOpen: fn(),
    onClose: fn(),
    trigger: <JButton variant="outline" size="sm">Abrir popover</JButton>,
    children: (
      <JPanel variant="ghost" padding="none" className="flex flex-col gap-1 text-sm">
        <JLabel className="font-medium text-neutral-800">Información</JLabel>
        <JLabel className="text-neutral-500">Contenido del popover con detalles adicionales.</JLabel>
      </JPanel>
    ),
  },
  argTypes: {
    side:  { control: 'select', options: ['top', 'bottom', 'left', 'right'] },
    align: { control: 'select', options: ['start', 'center', 'end'] },
  },
  decorators: [(Story) => <JPanel variant="ghost" padding="none" className="flex h-48 items-center justify-center"><Story /></JPanel>],
};
export default meta;
type Story = StoryObj<typeof PopoverMolecule>;

export const Default: Story = {
  args: { side: 'bottom', align: 'start' },
};

export const TopCenter: Story = {
  args: { side: 'top', align: 'center' },
};

export const RightStart: Story = {
  args: { side: 'right', align: 'start' },
};

export const LeftEnd: Story = {
  args: { side: 'left', align: 'end' },
};

export const WithActions: Story = {
  args: {
    trigger: <JButton size="sm">Opciones</JButton>,
    children: (
      <JPanel variant="ghost" padding="none" className="flex flex-col gap-1">
        <JButton variant="ghost" size="sm" className="justify-start w-full">Editar</JButton>
        <JButton variant="ghost" size="sm" className="justify-start w-full">Duplicar</JButton>
        <JButton variant="ghost" size="sm" className="justify-start w-full text-red-600 hover:bg-red-50 hover:text-red-600">Eliminar</JButton>
      </JPanel>
    ),
  },
};

export const Interactive: Story = {
  render: () => {
    const [selectedRole, setSelectedRole] = useState<string | null>(null);
    const roles = ['Admin', 'Editor', 'Viewer'];
    return (
      <JPanel variant="ghost" padding="none" className="flex h-48 items-start justify-center gap-6 pt-8">
        <PopoverMolecule
          trigger={
            <JButton variant="outline" size="sm">
              {selectedRole ? `Rol: ${selectedRole}` : 'Filtrar por rol'}
            </JButton>
          }
          side="bottom"
          align="start"
        >
          <JPanel variant="ghost" padding="none" className="flex flex-col gap-1 min-w-[120px]">
            <JLabel size="xs" className="font-semibold text-neutral-400 uppercase px-2 pb-1">Roles</JLabel>
            {roles.map((r) => (
              <JButton
                key={r}
                variant="ghost"
                size="sm"
                onClick={() => setSelectedRole(r === selectedRole ? null : r)}
                className={`justify-start w-full ${selectedRole === r ? 'bg-primary-50 text-primary-700 font-medium hover:bg-primary-50' : ''}`}
              >
                {r}
              </JButton>
            ))}
          </JPanel>
        </PopoverMolecule>
        {selectedRole && (
          <JLabel size="sm" color="muted" className="self-center">
            Filtrando por: <strong>{selectedRole}</strong>
          </JLabel>
        )}
      </JPanel>
    );
  },
};
