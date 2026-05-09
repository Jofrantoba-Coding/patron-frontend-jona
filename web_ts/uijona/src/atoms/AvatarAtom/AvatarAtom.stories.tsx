import type { Meta, StoryObj } from '@storybook/react';
import { AvatarAtom } from './AvatarAtom';

const meta: Meta<typeof AvatarAtom> = {
  title: 'Atoms/AvatarAtom',
  component: AvatarAtom,
  tags: ['autodocs'],
  argTypes: {
    size:  { control: 'select', options: ['xs', 'sm', 'md', 'lg', 'xl'] },
    shape: { control: 'radio', options: ['circle', 'square'] },
  },
};
export default meta;
type Story = StoryObj<typeof AvatarAtom>;

export const WithInitials: Story = {
  args: { initials: 'JO', size: 'md' },
};

export const WithImage: Story = {
  args: {
    src: 'https://i.pravatar.cc/150?img=3',
    alt: 'Usuario',
    size: 'md',
  },
};

export const Square: Story = {
  args: { initials: 'JO', shape: 'square', size: 'md' },
};

export const AllSizes: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
      <AvatarAtom initials="XS" size="xs" />
      <AvatarAtom initials="SM" size="sm" />
      <AvatarAtom initials="MD" size="md" />
      <AvatarAtom initials="LG" size="lg" />
      <AvatarAtom initials="XL" size="xl" />
    </div>
  ),
};
