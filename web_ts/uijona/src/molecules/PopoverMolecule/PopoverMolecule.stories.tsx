import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { useState } from 'react';
import { PopoverMolecule } from './PopoverMolecule';
import { PanelAtom } from '../../atoms/PanelAtom/PanelAtom';

const meta: Meta<typeof PopoverMolecule> = {
  title: 'Molecules/PopoverMolecule',
  component: PopoverMolecule,
  tags: ['autodocs'],
  args: {
    onOpen: fn(),
    onClose: fn(),
    trigger: <button className="rounded-md border border-neutral-300 px-3 py-1.5 text-sm">Abrir popover</button>,
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
    trigger: (
      <button className="rounded-md bg-primary-600 px-3 py-1.5 text-sm text-white">
        Opciones
      </button>
    ),
    children: (
      <PanelAtom variant="ghost" padding="none" className="flex flex-col gap-1">
        <button className="rounded px-3 py-1.5 text-left text-sm hover:bg-neutral-100">Editar</button>
        <button className="rounded px-3 py-1.5 text-left text-sm hover:bg-neutral-100">Duplicar</button>
        <button className="rounded px-3 py-1.5 text-left text-sm text-red-600 hover:bg-red-50">Eliminar</button>
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
            <button className="rounded-md border border-neutral-300 px-3 py-1.5 text-sm">
              {selectedRole ? `Rol: ${selectedRole}` : 'Filtrar por rol'}
            </button>
          }
          side="bottom"
          align="start"
        >
          <PanelAtom variant="ghost" padding="none" className="flex flex-col gap-1 min-w-[120px]">
            <p className="text-xs font-semibold text-neutral-400 uppercase px-2 pb-1">Roles</p>
            {roles.map((r) => (
              <button
                key={r}
                onClick={() => setSelectedRole(r === selectedRole ? null : r)}
                className={`rounded px-3 py-1.5 text-left text-sm ${selectedRole === r ? 'bg-primary-50 text-primary-700 font-medium' : 'hover:bg-neutral-100'}`}
              >
                {r}
              </button>
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
