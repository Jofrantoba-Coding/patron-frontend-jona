import type { Meta, StoryObj } from '@storybook/react';
import { BoxLayout } from './BoxLayout';
import { JPanel } from '../../atoms/JPanel/JPanel';

const meta: Meta<typeof BoxLayout> = {
  title: 'Layouts/BoxLayout',
  component: BoxLayout,
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
    wrap: {
      control: 'select',
      options: ['nowrap', 'wrap', 'reverse'],
    },
  },
};

export default meta;
type Story = StoryObj<typeof BoxLayout>;

const DemoItem = ({ label }: { label: string }) => (
  <JPanel variant="outlined" padding="sm" className="min-w-24 text-center text-sm text-neutral-700">
    {label}
  </JPanel>
);

export const Row: Story = {
  args: {
    direction: 'row',
    gap: 'md',
    alignItems: 'center',
    justifyContent: 'start',
    wrap: 'wrap',
  },
  render: (args) => (
    <BoxLayout {...args} className="min-h-24 w-full">
      <DemoItem label="Inicio" />
      <DemoItem label="Centro" />
      <DemoItem label="Fin" />
    </BoxLayout>
  ),
};

export const Column: Story = {
  args: { direction: 'column', gap: 'sm' },
  render: (args) => (
    <BoxLayout {...args} className="w-full max-w-xs">
      <DemoItem label="Header" />
      <DemoItem label="Contenido" />
      <DemoItem label="Footer" />
    </BoxLayout>
  ),
};
