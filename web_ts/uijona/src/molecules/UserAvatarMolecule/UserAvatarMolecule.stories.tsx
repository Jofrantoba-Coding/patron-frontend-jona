import type { Meta, StoryObj } from '@storybook/react';
import { UserAvatarMolecule } from './UserAvatarMolecule';

const meta: Meta<typeof UserAvatarMolecule> = {
  title: 'Molecules/UserAvatarMolecule',
  component: UserAvatarMolecule,
  tags: ['autodocs'],
  argTypes: {
    size: { control: 'radio', options: ['sm', 'md', 'lg'] },
  },
};
export default meta;
type Story = StoryObj<typeof UserAvatarMolecule>;

export const Default: Story = {
  args: { name: 'Jonathan Franck', email: 'jofrantoba@gmail.com', size: 'md' },
};

export const Small: Story = {
  args: { name: 'Ana García', email: 'ana@email.com', size: 'sm' },
};

export const Large: Story = {
  args: { name: 'Carlos Pérez', email: 'carlos@email.com', size: 'lg' },
};

export const NoEmail: Story = {
  args: { name: 'Usuario Sin Email' },
};
