import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { SwitchFieldMolecule } from './SwitchFieldMolecule';

const meta: Meta<typeof SwitchFieldMolecule> = {
  title: 'Molecules/SwitchFieldMolecule',
  component: SwitchFieldMolecule,
  tags: ['autodocs'],
  args: { onCheckedChange: fn() },
  argTypes: {
    checked:  { control: 'boolean' },
    disabled: { control: 'boolean' },
  },
};
export default meta;
type Story = StoryObj<typeof SwitchFieldMolecule>;

export const Default: Story = {
  args: { id: 'notifications', label: 'Recibir notificaciones' },
};

export const Checked: Story = {
  args: {
    id: 'dark-mode',
    label: 'Modo oscuro',
    description: 'Cambia el tema de la aplicación',
    checked: true,
  },
};

export const Disabled: Story = {
  args: { id: 'disabled', label: 'Opción bloqueada', disabled: true },
};
