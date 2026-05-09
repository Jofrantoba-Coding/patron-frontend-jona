import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { IconButtonAtom } from './IconButtonAtom';

const SearchIcon = () => (
  <span aria-hidden="true" style={{ fontSize: 14, fontWeight: 700, lineHeight: 1 }}>
    S
  </span>
);

const meta: Meta<typeof IconButtonAtom> = {
  title: 'Atoms/IconButtonAtom',
  component: IconButtonAtom,
  tags: ['autodocs'],
  args: { icon: <SearchIcon />, label: 'Buscar', onClick: fn() },
  argTypes: {
    label: { control: 'text' },
    variant: { control: 'select', options: ['default', 'outline', 'ghost', 'destructive', 'secondary', 'link'] },
    loading: { control: 'boolean' },
    disabled: { control: 'boolean' },
  },
};
export default meta;
type Story = StoryObj<typeof IconButtonAtom>;

export const Default: Story = {};

export const Outline: Story = {
  args: { variant: 'outline', label: 'Buscar con borde' },
};

export const Destructive: Story = {
  args: { variant: 'destructive', label: 'Eliminar' },
};

export const Loading: Story = {
  args: { loading: true, label: 'Cargando' },
};

export const Disabled: Story = {
  args: { disabled: true, label: 'No disponible' },
};
