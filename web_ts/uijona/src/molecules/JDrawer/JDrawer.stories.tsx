import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { useState } from 'react';
import { JDrawer } from './JDrawer';
import { JPanel } from '../../atoms/JPanel/JPanel';
import { JButton } from '../../atoms/JButton/JButton';
import { JLabel } from '../../atoms/JLabel';

const meta: Meta<typeof JDrawer> = {
  title: 'Molecules/JDrawer',
  component: JDrawer,
  tags: ['autodocs'],
  args: {
    open: false,
    onClose: fn(),
    title: 'Panel lateral',
    description: 'Contenido del drawer.',
    children: <JLabel size="sm" className="text-neutral-600">Contenido del panel deslizante.</JLabel>,
  },
  argTypes: {
    side:            { control: 'select', options: ['left', 'right', 'top', 'bottom'] },
    size:            { control: 'select', options: ['sm', 'md', 'lg', 'full'] },
    open:            { control: 'boolean' },
    showCloseButton: { control: 'boolean' },
  },
};
export default meta;
type Story = StoryObj<typeof JDrawer>;

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
      <JPanel variant="ghost" padding="none" className="flex justify-end gap-2">
        <JButton variant="outline" size="sm">Cancelar</JButton>
        <JButton size="sm">Guardar</JButton>
      </JPanel>
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
      <JPanel variant="ghost" padding="none">
        <JButton onClick={() => setOpen(true)}>
          Abrir JDrawer
        </JButton>
        <JDrawer
          open={open}
          onClose={() => { args.onClose?.(); setOpen(false); }}
          title="Editar perfil"
          description="Actualiza los datos de tu cuenta."
        >
          <JLabel size="sm" className="text-neutral-600">Aquí irían los campos del formulario.</JLabel>
        </JDrawer>
      </JPanel>
    );
  },
};
