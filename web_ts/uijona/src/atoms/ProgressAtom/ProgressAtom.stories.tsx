import type { Meta, StoryObj } from '@storybook/react';
import { ProgressAtom } from './ProgressAtom';

const meta: Meta<typeof ProgressAtom> = {
  title: 'Atoms/ProgressAtom',
  component: ProgressAtom,
  tags: ['autodocs'],
  argTypes: {
    variant:   { control: 'select', options: ['default', 'success', 'warning', 'danger'] },
    value:     { control: { type: 'range', min: 0, max: 100, step: 5 } },
    showLabel: { control: 'boolean' },
  },
};
export default meta;
type Story = StoryObj<typeof ProgressAtom>;

export const Default: Story = {
  args: { value: 60 },
  decorators: [(Story) => <div style={{ width: '320px' }}><Story /></div>],
};

export const WithLabel: Story = {
  args: { value: 75, showLabel: true },
  decorators: [(Story) => <div style={{ width: '320px' }}><Story /></div>],
};

export const Success: Story = {
  args: { value: 100, variant: 'success', showLabel: true },
  decorators: [(Story) => <div style={{ width: '320px' }}><Story /></div>],
};

export const Warning: Story = {
  args: { value: 45, variant: 'warning', showLabel: true },
  decorators: [(Story) => <div style={{ width: '320px' }}><Story /></div>],
};

export const Danger: Story = {
  args: { value: 20, variant: 'danger', showLabel: true },
  decorators: [(Story) => <div style={{ width: '320px' }}><Story /></div>],
};

export const AllVariants: Story = {
  render: () => (
    <div style={{ width: '320px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
      <ProgressAtom value={80} variant="default"  showLabel />
      <ProgressAtom value={90} variant="success"  showLabel />
      <ProgressAtom value={55} variant="warning"  showLabel />
      <ProgressAtom value={25} variant="danger"   showLabel />
    </div>
  ),
};
