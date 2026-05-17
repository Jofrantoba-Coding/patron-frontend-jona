import type { Meta, StoryObj } from '@storybook/react';
import { JPanel } from '../../atoms/JPanel';
import { TextAtom } from '../../atoms/TextAtom/TextAtom';
import { GridBagLayout } from './GridBagLayout';

const meta: Meta<typeof GridBagLayout> = {
  title: 'Layouts/GridBagLayout',
  component: GridBagLayout,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
  argTypes: {
    gap: {
      control: 'select',
      options: ['none', 'xs', 'sm', 'md', 'lg', 'xl'],
    },
    placement: {
      control: 'select',
      options: ['responsive', 'fixed'],
    },
    autoFitMin: { control: 'text' },
    dense: { control: 'boolean' },
  },
};

export default meta;
type Story = StoryObj<typeof GridBagLayout>;

const DemoCell = ({ label }: { label: string }) => (
  <JPanel variant="outlined" padding="md" radius="sm" className="min-h-16">
    <TextAtom as="span" size="sm" className="font-medium text-neutral-700">{label}</TextAtom>
  </JPanel>
);

export const ResponsiveConstraints: Story = {
  args: {
    columns: 4,
    gap: 'sm',
    placement: 'responsive',
  },
  render: (args) => (
    <GridBagLayout {...args} className="w-full max-w-3xl">
      <JPanel data-gridbag-column="1" data-gridbag-row="1" data-gridbag-column-span="2" variant="outlined" padding="md" radius="sm">
        <TextAtom as="span" size="sm" className="font-medium text-neutral-700">Header span 2</TextAtom>
      </JPanel>
      <DemoCell label="Metric A" />
      <DemoCell label="Metric B" />
      <JPanel data-gridbag-column="1" data-gridbag-row="2" data-gridbag-row-span="2" variant="outlined" padding="md" radius="sm" className="min-h-32">
        <TextAtom as="span" size="sm" className="font-medium text-neutral-700">Side span rows</TextAtom>
      </JPanel>
      <JPanel data-gridbag-column="2" data-gridbag-row="2" data-gridbag-column-span="3" variant="outlined" padding="md" radius="sm" className="min-h-32">
        <TextAtom as="span" size="sm" className="font-medium text-neutral-700">Content span 3</TextAtom>
      </JPanel>
    </GridBagLayout>
  ),
};

export const AutoFitFirst: Story = {
  args: {
    autoFitMin: '10rem',
    gap: 'md',
  },
  render: (args) => (
    <GridBagLayout {...args} className="w-full max-w-3xl">
      {['Usuarios', 'Ventas', 'Tickets', 'Riesgos', 'Alertas', 'Tareas'].map((item) => (
        <DemoCell key={item} label={item} />
      ))}
    </GridBagLayout>
  ),
};
