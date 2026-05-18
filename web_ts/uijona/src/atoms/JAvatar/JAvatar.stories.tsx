import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { useState } from 'react';
import { JAvatar } from './JAvatar';
import { JButton } from '../JButton/JButton';
import { JPanel } from '../JPanel/JPanel';
import { JLabel } from '../JLabel';

const meta: Meta<typeof JAvatar> = {
  title: 'Atoms/JAvatar',
  component: JAvatar,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
  args: { onImageError: fn() },
  argTypes: {
    size:  { control: 'select',       options: ['xs', 'sm', 'md', 'lg', 'xl'] },
    shape: { control: 'inline-radio', options: ['circle', 'square'] },
    src:   { control: 'text' },
    alt:   { control: 'text' },
    initials: { control: 'text' },
  },
};
export default meta;
type Story = StoryObj<typeof JAvatar>;

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

export const Fallback: Story = {
  name: 'Fallback on error',
  args: {
    src: 'https://broken.url/image.png',
    initials: 'FB',
    alt: 'Fallback',
    size: 'md',
  },
};

export const AllSizes: Story = {
  render: () => (
    <JPanel variant="ghost" padding="none" className="flex gap-3 items-end">
      {(['xs', 'sm', 'md', 'lg', 'xl'] as const).map((s) => (
        <JPanel key={s} variant="ghost" padding="none" className="flex flex-col items-center gap-1">
          <JAvatar initials={s.toUpperCase()} size={s} />
          <JLabel size="xs" color="muted">{s}</JLabel>
        </JPanel>
      ))}
    </JPanel>
  ),
};

export const Shapes: Story = {
  render: () => (
    <JPanel variant="ghost" padding="none" className="flex gap-4 items-center">
      {(['circle', 'square'] as const).map((sh) => (
        <JPanel key={sh} variant="ghost" padding="none" className="flex flex-col items-center gap-1">
          <JAvatar initials="JO" shape={sh} size="lg" />
          <JLabel size="xs" color="muted">{sh}</JLabel>
        </JPanel>
      ))}
    </JPanel>
  ),
};

export const ImageAllSizes: Story = {
  render: () => (
    <JPanel variant="ghost" padding="none" className="flex gap-3 items-end">
      {(['xs', 'sm', 'md', 'lg', 'xl'] as const).map((s) => (
        <JAvatar
          key={s}
          src={`https://i.pravatar.cc/150?img=${s === 'xs' ? 1 : s === 'sm' ? 2 : s === 'md' ? 3 : s === 'lg' ? 4 : 5}`}
          alt="Usuario"
          size={s}
        />
      ))}
    </JPanel>
  ),
};

export const Interactive: Story = {
  render: (args) => {
    const users = [
      { initials: 'JF', name: 'Jonathan Franck' },
      { initials: 'AG', name: 'Ana García' },
      { initials: 'CP', name: 'Carlos Pérez' },
    ];
    const [active, setActive] = useState(0);
    return (
      <JPanel variant="ghost" padding="none" className="flex flex-col gap-3">
        <JPanel variant="ghost" padding="none" className="flex gap-3">
          {users.map((u, i) => (
            <JButton
              key={i}
              variant="ghost"
              onClick={() => setActive(i)}
              className={`rounded-full p-0.5 border-2 ${active === i ? 'border-primary-500' : 'border-transparent'}`}
            >
              <JAvatar initials={u.initials} size="md" onImageError={args.onImageError} />
            </JButton>
          ))}
        </JPanel>
        <JLabel size="sm" className="text-neutral-600">
          Usuario activo: <strong>{users[active].name}</strong>
        </JLabel>
      </JPanel>
    );
  },
};
