import type { Meta, StoryObj } from '@storybook/react';
import { PanelAtom } from '../../atoms/PanelAtom';
import { SpringLayout } from './SpringLayout';

const meta: Meta<typeof SpringLayout> = {
  title: 'Layouts/SpringLayout',
  component: SpringLayout,
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
type Story = StoryObj<typeof SpringLayout>;

const SpringNode = ({ label }: { label: string }) => (
  <PanelAtom variant="outlined" padding="md" radius="sm">
    <span className="text-sm font-medium text-neutral-700">{label}</span>
  </PanelAtom>
);

export const ResponsiveConstraints: Story = {
  args: {
    placement: 'responsive',
    minHeight: '18rem',
    gap: 'sm',
  },
  render: (args) => (
    <SpringLayout {...args} className="w-full max-w-3xl">
      <PanelAtom data-spring-left="0" data-spring-top="0" data-spring-width="12rem" variant="outlined" padding="md" radius="sm">
        <span className="text-sm font-medium text-neutral-700">Left anchored</span>
      </PanelAtom>
      <PanelAtom data-spring-left="14rem" data-spring-top="4rem" data-spring-width="14rem" variant="outlined" padding="md" radius="sm">
        <span className="text-sm font-medium text-neutral-700">Offset from first</span>
      </PanelAtom>
      <PanelAtom data-spring-right="0" data-spring-bottom="0" data-spring-width="12rem" variant="outlined" padding="md" radius="sm">
        <span className="text-sm font-medium text-neutral-700">Bottom end</span>
      </PanelAtom>
    </SpringLayout>
  ),
};

export const MobileAutoFit: Story = {
  args: {
    autoFitMin: '10rem',
    gap: 'md',
  },
  render: (args) => (
    <SpringLayout {...args} className="w-full max-w-3xl">
      {['Inicio', 'Proceso', 'Revision', 'Cierre'].map((item) => (
        <SpringNode key={item} label={item} />
      ))}
    </SpringLayout>
  ),
};
