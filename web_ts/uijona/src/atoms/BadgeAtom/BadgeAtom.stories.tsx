import type { Meta, StoryObj } from '@storybook/react';
import { BadgeAtom } from './BadgeAtom';

const meta: Meta<typeof BadgeAtom> = {
  title: 'Atoms/BadgeAtom',
  component: BadgeAtom,
  tags: ['autodocs'],
  argTypes: {
    variant: { control: 'select', options: ['default', 'secondary', 'destructive', 'outline', 'ghost'] },
  },
};
export default meta;
type Story = StoryObj<typeof BadgeAtom>;

export const Default: Story = {
  args: { children: 'Badge' },
};

export const Secondary: Story = {
  args: { variant: 'secondary', children: 'Secondary' },
};

export const Destructive: Story = {
  args: { variant: 'destructive', children: 'Error' },
};

export const Outline: Story = {
  args: { variant: 'outline', children: 'Outline' },
};

export const AllVariants: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
      <BadgeAtom variant="default">Default</BadgeAtom>
      <BadgeAtom variant="secondary">Secondary</BadgeAtom>
      <BadgeAtom variant="destructive">Destructive</BadgeAtom>
      <BadgeAtom variant="outline">Outline</BadgeAtom>
      <BadgeAtom variant="ghost">Ghost</BadgeAtom>
    </div>
  ),
};
