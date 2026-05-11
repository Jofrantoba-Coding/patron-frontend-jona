import type { Meta, StoryObj } from '@storybook/react';
import { FlowLayout } from './FlowLayout';
import { PanelAtom } from '../../atoms/PanelAtom/PanelAtom';

const meta: Meta<typeof FlowLayout> = {
  title: 'Layouts/FlowLayout',
  component: FlowLayout,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
  argTypes: {
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
type Story = StoryObj<typeof FlowLayout>;

const DemoItem = ({ label }: { label: string }) => (
  <PanelAtom variant="flat" padding="sm" className="min-w-20 text-center text-sm font-medium text-neutral-700">
    {label}
  </PanelAtom>
);

export const WrappedItems: Story = {
  render: (args) => (
    <FlowLayout {...args} className="w-full max-w-sm">
      {['Uno', 'Dos', 'Tres', 'Cuatro', 'Cinco', 'Seis'].map((item) => (
        <DemoItem key={item} label={item} />
      ))}
    </FlowLayout>
  ),
};

export const Centered: Story = {
  args: { alignItems: 'center', justifyContent: 'center', gap: 'sm' },
  render: (args) => (
    <FlowLayout {...args} className="w-full max-w-md">
      {['Accion', 'Filtro', 'Exportar'].map((item) => (
        <DemoItem key={item} label={item} />
      ))}
    </FlowLayout>
  ),
};
