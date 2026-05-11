import type { Meta, StoryObj } from '@storybook/react';
import { BoxLayout } from './BoxLayout';
import { PanelAtom } from '../../atoms/PanelAtom/PanelAtom';

const meta: Meta<typeof BoxLayout> = {
  title: 'Layouts/BoxLayout',
  component: BoxLayout,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
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
  <PanelAtom variant="outlined" padding="sm" className="min-w-24 text-center text-sm text-neutral-700">
    {label}
  </PanelAtom>
);

export const Row: Story = {
  render: (args) => (
    <BoxLayout {...args}>
      <DemoItem label="Inicio" />
      <DemoItem label="Centro" />
      <DemoItem label="Fin" />
    </BoxLayout>
  ),
};

export const Column: Story = {
  args: { direction: 'column', gap: 'sm' },
  render: (args) => (
    <BoxLayout {...args} className="w-72">
      <DemoItem label="Header" />
      <DemoItem label="Contenido" />
      <DemoItem label="Footer" />
    </BoxLayout>
  ),
};
