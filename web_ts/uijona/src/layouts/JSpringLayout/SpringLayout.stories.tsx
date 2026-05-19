import type { Meta, StoryObj } from '@storybook/react';
import { JPanel } from '../../atoms/JPanel';
import { JLabel } from '../../atoms/JLabel';
import { JSpringLayout } from './SpringLayout';

const meta: Meta<typeof JSpringLayout> = {
  title: 'Layouts/JSpringLayout',
  component: JSpringLayout,
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
    minHeight: { control: 'text' },
  },
};

export default meta;
type Story = StoryObj<typeof JSpringLayout>;

const SpringNode = ({ label }: { label: string }) => (
  <JPanel variant="outlined" padding="md" radius="sm">
    <JLabel as="span" size="sm" className="font-medium text-neutral-700">{label}</JLabel>
  </JPanel>
);

export const ResponsiveConstraints: Story = {
  args: {
    placement: 'responsive',
    minHeight: '18rem',
    gap: 'sm',
  },
  render: (args) => (
    <JSpringLayout {...args} className="w-full max-w-3xl">
      <JPanel data-spring-left="0" data-spring-top="0" data-spring-width="12rem" variant="outlined" padding="md" radius="sm">
        <JLabel as="span" size="sm" className="font-medium text-neutral-700">Left anchored</JLabel>
      </JPanel>
      <JPanel data-spring-left="14rem" data-spring-top="4rem" data-spring-width="14rem" variant="outlined" padding="md" radius="sm">
        <JLabel as="span" size="sm" className="font-medium text-neutral-700">Offset from first</JLabel>
      </JPanel>
      <JPanel data-spring-right="0" data-spring-bottom="0" data-spring-width="12rem" variant="outlined" padding="md" radius="sm">
        <JLabel as="span" size="sm" className="font-medium text-neutral-700">Bottom end</JLabel>
      </JPanel>
    </JSpringLayout>
  ),
};

export const MobileAutoFit: Story = {
  args: {
    autoFitMin: '10rem',
    gap: 'md',
  },
  render: (args) => (
    <JSpringLayout {...args} className="w-full max-w-3xl">
      {['Inicio', 'Proceso', 'Revision', 'Cierre'].map((item) => (
        <SpringNode key={item} label={item} />
      ))}
    </JSpringLayout>
  ),
};
