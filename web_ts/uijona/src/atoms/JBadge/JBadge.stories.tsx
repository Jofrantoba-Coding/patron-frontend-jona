import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { JBadge } from './JBadge';
import { JButton } from '../JButton/JButton';
import { JPanel } from '../JPanel/JPanel';
import { JLabel } from '../JLabel';

const meta: Meta<typeof JBadge> = {
  title: 'Atoms/JBadge',
  component: JBadge,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
  argTypes: {
    variant: { control: 'select', options: ['default', 'secondary', 'destructive', 'outline', 'ghost'] },
  },
};
export default meta;
type Story = StoryObj<typeof JBadge>;

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

export const Ghost: Story = {
  args: { variant: 'ghost', children: 'Ghost' },
};

export const AllVariants: Story = {
  render: () => (
    <JPanel variant="ghost" padding="none" className="flex gap-2 flex-wrap">
      {(['default', 'secondary', 'destructive', 'outline', 'ghost'] as const).map((v) => (
        <JBadge key={v} variant={v}>{v}</JBadge>
      ))}
    </JPanel>
  ),
};

export const WithIcon: Story = {
  render: () => (
    <JPanel variant="ghost" padding="none" className="flex gap-2 flex-wrap">
      <JBadge variant="default">● Activo</JBadge>
      <JBadge variant="secondary">◎ Pendiente</JBadge>
      <JBadge variant="destructive">✕ Error</JBadge>
      <JBadge variant="outline">○ Borrador</JBadge>
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
          <JBadge variant={count > 5 ? 'destructive' : count > 0 ? 'default' : 'secondary'}>
            {count}
          </JBadge>
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
