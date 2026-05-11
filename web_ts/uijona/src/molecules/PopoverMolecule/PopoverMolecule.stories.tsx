import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { useState } from 'react';
import { PopoverMolecule } from './PopoverMolecule';
import { PanelAtom } from '../../atoms/PanelAtom/PanelAtom';
import { ButtonAtom } from '../../atoms/ButtonAtom/ButtonAtom';

const meta: Meta<typeof PopoverMolecule> = {
  title: 'Molecules/PopoverMolecule',
  component: PopoverMolecule,
  tags: ['autodocs'],
  args: {
    onOpen: fn(),
    onClose: fn(),
    trigger: <ButtonAtom variant="outline" size="sm">Abrir popover</ButtonAtom>,
    children: (
      <PanelAtom variant="ghost" padding="none" className="flex flex-col gap-1 text-sm">
        <p className="font-medium text-neutral-800">Información</p>
        <p className="text-neutral-500">Contenido del popover con detalles adicionales.</p>
      </PanelAtom>
    ),
  },
  argTypes: {
    side:  { control: 'select', options: ['top', 'bottom', 'left', 'right'] },
    align: { control: 'select', options: ['start', 'center', 'end'] },
  },
  decorators: [(Story) => <PanelAtom variant="ghost" padding="none" className="flex h-48 items-center justify-center"><Story /></PanelAtom>],
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
    trigger: <ButtonAtom size="sm">Opciones</ButtonAtom>,
    children: (
      <PanelAtom variant="ghost" padding="none" className="flex flex-col gap-1">
        <ButtonAtom variant="ghost" size="sm" className="justify-start w-full">Editar</ButtonAtom>
        <ButtonAtom variant="ghost" size="sm" className="justify-start w-full">Duplicar</ButtonAtom>
        <ButtonAtom variant="ghost" size="sm" className="justify-start w-full text-red-600 hover:bg-red-50 hover:text-red-600">Eliminar</ButtonAtom>
      </PanelAtom>
    ),
  },
};

export const Interactive: Story = {
  render: () => {
    const [selectedRole, setSelectedRole] = useState<string | null>(null);
    const roles = ['Admin', 'Editor', 'Viewer'];
    return (
      <PanelAtom variant="ghost" padding="none" className="flex h-48 items-start justify-center gap-6 pt-8">
        <PopoverMolecule
          trigger={
            <ButtonAtom variant="outline" size="sm">
              {selectedRole ? `Rol: ${selectedRole}` : 'Filtrar por rol'}
            </ButtonAtom>
          }
          side="bottom"
          align="start"
        >
          <PanelAtom variant="ghost" padding="none" className="flex flex-col gap-1 min-w-[120px]">
            <p className="text-xs font-semibold text-neutral-400 uppercase px-2 pb-1">Roles</p>
            {roles.map((r) => (
              <ButtonAtom
                key={r}
                variant="ghost"
                size="sm"
                onClick={() => setSelectedRole(r === selectedRole ? null : r)}
                className={`justify-start w-full ${selectedRole === r ? 'bg-primary-50 text-primary-700 font-medium hover:bg-primary-50' : ''}`}
              >
                {r}
              </ButtonAtom>
            ))}
          </PanelAtom>
        </PopoverMolecule>
        {selectedRole && (
          <p className="text-sm text-neutral-500 self-center">
            Filtrando por: <strong>{selectedRole}</strong>
          </p>
        )}
      </PanelAtom>
    );
  },
};
