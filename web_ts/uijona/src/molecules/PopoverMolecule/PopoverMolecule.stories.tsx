import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { PopoverMolecule } from './PopoverMolecule';

const meta: Meta<typeof PopoverMolecule> = {
  title: 'Molecules/PopoverMolecule',
  component: PopoverMolecule,
  tags: ['autodocs'],
  args: {
    onOpen: fn(),
    onClose: fn(),
    trigger: <button className="rounded-md border border-neutral-300 px-3 py-1.5 text-sm">Abrir popover</button>,
    children: (
      <div className="flex flex-col gap-1 text-sm">
        <p className="font-medium text-neutral-800">Información</p>
        <p className="text-neutral-500">Contenido del popover con detalles adicionales.</p>
      </div>
    ),
  },
  decorators: [(Story) => <div className="flex h-48 items-center justify-center"><Story /></div>],
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
      <div className="flex flex-col gap-1">
        <button className="rounded px-3 py-1.5 text-left text-sm hover:bg-neutral-100">Editar</button>
        <button className="rounded px-3 py-1.5 text-left text-sm hover:bg-neutral-100">Duplicar</button>
        <button className="rounded px-3 py-1.5 text-left text-sm text-red-600 hover:bg-red-50">Eliminar</button>
      </div>
    ),
  },
};
