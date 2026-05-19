import type { Meta, StoryObj } from '@storybook/react';
import { JBoxLayout } from './BoxLayout';
import { JPanel } from '../../atoms/JPanel/JPanel';
import { JLabel } from '../../atoms/JLabel';

const meta: Meta<typeof JBoxLayout> = {
  title: 'Layouts/JBoxLayout',
  component: JBoxLayout,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
  argTypes: {
    direction: {
      control: 'radio',
      options: ['row', 'column'],
    },
    gap: {
      control: 'select',
      options: ['none', 'xs', 'sm', 'md', 'lg', 'xl'],
    },
    alignItems: {
      control: 'select',
      options: ['start', 'center', 'end', 'stretch', 'baseline'],
    },
    justifyContent: {
      control: 'select',
      options: ['start', 'center', 'end', 'between', 'around', 'evenly'],
    },
  },
};

export default meta;
type Story = StoryObj<typeof JBoxLayout>;

const Item = ({ label }: { label: string }) => (
  <JPanel variant="outlined" padding="sm" radius="md" className="text-sm text-neutral-700 text-center">
    {label}
  </JPanel>
);

export const Column: Story = {
  name: 'Column (default)',
  render: (args) => (
    <JBoxLayout {...args} className="w-full max-w-xs">
      <Item label="Primero" />
      <Item label="Segundo" />
      <Item label="Tercero" />
    </JBoxLayout>
  ),
};

export const Row: Story = {
  name: 'Row (sin wrap)',
  render: (args) => (
    <JBoxLayout {...args} direction="row" alignItems="center" className="w-full">
      <Item label="Inicio" />
      <Item label="Centro" />
      <Item label="Fin" />
    </JBoxLayout>
  ),
};

export const RowSpaceBetween: Story = {
  name: 'Row · space between',
  render: () => (
    <JBoxLayout direction="row" justifyContent="between" alignItems="center" className="w-full">
      <JLabel size="sm" className="font-semibold">JONA UI</JLabel>
      <JPanel variant="ghost" padding="none" className="flex gap-2">
        <Item label="Inicio" />
        <Item label="Acerca" />
        <Item label="Contacto" />
      </JPanel>
    </JBoxLayout>
  ),
};

export const ColumnCentrado: Story = {
  name: 'Column centrado',
  render: () => (
    <JBoxLayout direction="column" alignItems="center" justifyContent="center" gap="sm" className="w-full min-h-48">
      <Item label="Título" />
      <Item label="Subtítulo" />
      <Item label="Acción" />
    </JBoxLayout>
  ),
};
