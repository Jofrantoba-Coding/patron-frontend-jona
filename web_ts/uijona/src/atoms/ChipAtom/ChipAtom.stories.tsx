import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { ChipAtom } from './ChipAtom';

const meta: Meta<typeof ChipAtom> = {
  title: 'Atoms/ChipAtom',
  component: ChipAtom,
  tags: ['autodocs'],
  args: { children: 'Activo', onRemove: fn() },
  argTypes: {
    variant: { control: 'select', options: ['default', 'primary', 'success', 'warning', 'danger'] },
    selected: { control: 'boolean' },
    removable: { control: 'boolean' },
  },
};
export default meta;
type Story = StoryObj<typeof ChipAtom>;

export const Default: Story = {};

export const Selected: Story = {
  args: { selected: true },
};

export const Removable: Story = {
  args: { removable: true },
};

export const AllVariants: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
      <ChipAtom>Default</ChipAtom>
      <ChipAtom variant="primary">Primary</ChipAtom>
      <ChipAtom variant="success">Success</ChipAtom>
      <ChipAtom variant="warning">Warning</ChipAtom>
      <ChipAtom variant="danger">Danger</ChipAtom>
      <ChipAtom removable onRemove={fn()}>Removable</ChipAtom>
    </div>
  ),
};
