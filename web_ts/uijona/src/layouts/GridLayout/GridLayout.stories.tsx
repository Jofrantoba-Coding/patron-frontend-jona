import type { Meta, StoryObj } from '@storybook/react';
import { GridLayout } from './GridLayout';
import { JPanel } from '../../atoms/JPanel/JPanel';

const meta: Meta<typeof GridLayout> = {
  title: 'Layouts/GridLayout',
  component: GridLayout,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
  argTypes: {
    gap: {
      control: 'select',
      options: ['none', 'xs', 'sm', 'md', 'lg', 'xl'],
    },
    columns: {
      control: 'text',
    },
    rows: {
      control: 'text',
    },
    autoFitMin: {
      control: 'text',
    },
    placement: {
      control: 'select',
      options: ['responsive', 'fixed'],
    },
  },
};

export default meta;
type Story = StoryObj<typeof GridLayout>;

const DemoItem = ({ label }: { label: string }) => (
  <JPanel variant="flat" padding="md" className="text-center text-sm font-medium text-neutral-700">
    {label}
  </JPanel>
);

export const FixedColumns: Story = {
  args: { columns: 3, gap: 'sm', placement: 'responsive' },
  render: (args) => (
    <GridLayout {...args} className="w-full max-w-xl">
      {['A1', 'A2', 'A3', 'B1', 'B2', 'B3'].map((item) => (
        <DemoItem key={item} label={item} />
      ))}
    </GridLayout>
  ),
};

export const ResponsiveAutoFit: Story = {
  args: { autoFitMin: '9rem', gap: 'md' },
  render: (args) => (
    <GridLayout {...args} className="w-full max-w-2xl">
      {['Usuarios', 'Ventas', 'Tickets', 'Riesgos', 'Alertas', 'Tareas'].map((item) => (
        <DemoItem key={item} label={item} />
      ))}
    </GridLayout>
  ),
};
