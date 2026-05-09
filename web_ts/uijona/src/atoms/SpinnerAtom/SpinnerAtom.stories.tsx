import type { Meta, StoryObj } from '@storybook/react';
import { SpinnerAtom } from './SpinnerAtom';

const meta: Meta<typeof SpinnerAtom> = {
  title: 'Atoms/SpinnerAtom',
  component: SpinnerAtom,
  tags: ['autodocs'],
  argTypes: {
    size: { control: 'radio', options: ['sm', 'md', 'lg'] },
  },
};
export default meta;
type Story = StoryObj<typeof SpinnerAtom>;

export const Default: Story = {
  args: { size: 'md' },
};

export const Small: Story = {
  args: { size: 'sm' },
};

export const Large: Story = {
  args: { size: 'lg' },
};

export const AllSizes: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
      <SpinnerAtom size="sm" />
      <SpinnerAtom size="md" />
      <SpinnerAtom size="lg" />
    </div>
  ),
};
