import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { BadgeAtom } from './BadgeAtom';
import { JButton } from '../JButton/JButton';
import { JPanel } from '../JPanel/JPanel';
import { JLabel } from '../JLabel';

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
    <JPanel variant="ghost" padding="none" style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
      <BadgeAtom variant="link">Default</BadgeAtom>
      <BadgeAtom variant="secondary">Secondary</BadgeAtom>
      <BadgeAtom variant="destructive">Destructive</BadgeAtom>
      <BadgeAtom variant="outline">Outline</BadgeAtom>
      <BadgeAtom variant="ghost">Ghost</BadgeAtom>
    </JPanel>
  ),
};

export const Interactive: Story = {
  render: () => {
    const [count, setCount] = useState(0);
    return (
      <JPanel variant="ghost" padding="none" className="flex flex-col gap-4 items-start">
        <JPanel variant="ghost" padding="none" className="flex items-center gap-2">
          <JLabel as="span" size="sm">Notificaciones</JLabel>
          <BadgeAtom variant={count > 5 ? 'destructive' : count > 0 ? 'default' : 'secondary'}>
            {count}
          </BadgeAtom>
        </JPanel>
        <JPanel variant="ghost" padding="none" className="flex gap-2">
          <JButton variant="outline" size="sm" onClick={() => setCount((c) => c + 1)}>
            Nueva notificación
          </JButton>
          <JButton variant="ghost" size="sm" disabled={count === 0} onClick={() => setCount(0)}>
            Marcar leídas
          </JButton>
        </JPanel>
      </JPanel>
    );
  },
};
