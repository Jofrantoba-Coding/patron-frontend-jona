import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { useState } from 'react';
import { DrawerMolecule } from './DrawerMolecule';
import { PanelAtom } from '../../atoms/PanelAtom/PanelAtom';
import { ButtonAtom } from '../../atoms/ButtonAtom/ButtonAtom';

const meta: Meta<typeof DrawerMolecule> = {
  title: 'Molecules/DrawerMolecule',
  component: DrawerMolecule,
  tags: ['autodocs'],
  args: {
    open: false,
    onClose: fn(),
    title: 'Panel lateral',
    description: 'Contenido del drawer.',
    children: <p className="text-sm text-neutral-600">Contenido del panel deslizante.</p>,
  },
  argTypes: {
    side:            { control: 'select', options: ['left', 'right', 'top', 'bottom'] },
    size:            { control: 'select', options: ['sm', 'md', 'lg', 'full'] },
    open:            { control: 'boolean' },
    showCloseButton: { control: 'boolean' },
  },
};
export default meta;
type Story = StoryObj<typeof DrawerMolecule>;

export const Default: Story = {
  args: { open: true, side: 'right' },
};

export const FromLeft: Story = {
  args: { open: true, side: 'left' },
};

export const FromTop: Story = {
  args: { open: true, side: 'top' },
};

export const FromBottom: Story = {
  args: { open: true, side: 'bottom' },
};

export const Small: Story = {
  args: { open: true, size: 'sm' },
};

export const Large: Story = {
  args: { open: true, size: 'lg' },
};

export const WithFooter: Story = {
  args: {
    open: true,
    footer: (
      <PanelAtom variant="ghost" padding="none" className="flex justify-end gap-2">
        <ButtonAtom variant="outline" size="sm">Cancelar</ButtonAtom>
        <ButtonAtom size="sm">Guardar</ButtonAtom>
      </PanelAtom>
    ),
  },
};

export const Interactive: Story = {
  args: {
    onClose: fn(),
  },
  render: (args) => {
    const [open, setOpen] = useState(false);
    return (
      <PanelAtom variant="ghost" padding="none">
        <ButtonAtom onClick={() => setOpen(true)}>
          Abrir Drawer
        </ButtonAtom>
        <DrawerMolecule
          open={open}
          onClose={() => { args.onClose?.(); setOpen(false); }}
          title="Editar perfil"
          description="Actualiza los datos de tu cuenta."
        >
          <p className="text-sm text-neutral-600">Aquí irían los campos del formulario.</p>
        </DrawerMolecule>
      </PanelAtom>
    );
  },
};
