import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { ButtonAtom } from './ButtonAtom';

const meta: Meta<typeof ButtonAtom> = {
  title: 'Atoms/ButtonAtom',
  component: ButtonAtom,
  tags: ['autodocs'],
  args: { onClick: fn() },
  argTypes: {
    variant:   { control: 'select', options: ['default', 'outline', 'ghost', 'destructive', 'secondary', 'link'] },
    size:      { control: 'select', options: ['default', 'sm', 'lg', 'icon'] },
    loading:   { control: 'boolean' },
    fullWidth: { control: 'boolean' },
    disabled:  { control: 'boolean' },
  },
};
export default meta;
type Story = StoryObj<typeof ButtonAtom>;

export const Default: Story = {
  args: { children: 'Botón' },
};

export const Outline: Story = {
  args: { variant: 'outline', children: 'Outline' },
};

export const Ghost: Story = {
  args: { variant: 'ghost', children: 'Ghost' },
};

export const Destructive: Story = {
  args: { variant: 'destructive', children: 'Eliminar' },
};

export const Secondary: Story = {
  args: { variant: 'secondary', children: 'Secundario' },
};

export const Small: Story = {
  args: { size: 'sm', children: 'Pequeño' },
};

export const Large: Story = {
  args: { size: 'lg', children: 'Grande' },
};

export const Loading: Story = {
  args: { loading: true, children: 'Cargando...' },
};

export const Disabled: Story = {
  args: { disabled: true, children: 'Deshabilitado' },
};

export const FullWidth: Story = {
  args: { fullWidth: true, children: 'Ancho completo' },
  decorators: [(Story) => <div style={{ width: '320px' }}><Story /></div>],
};

export const AllVariants: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
      <ButtonAtom variant="default">Default</ButtonAtom>
      <ButtonAtom variant="secondary">Secondary</ButtonAtom>
      <ButtonAtom variant="outline">Outline</ButtonAtom>
      <ButtonAtom variant="ghost">Ghost</ButtonAtom>
      <ButtonAtom variant="destructive">Destructive</ButtonAtom>
      <ButtonAtom variant="link">Link</ButtonAtom>
    </div>
  ),
};
