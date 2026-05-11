import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { BadgeAtom } from './BadgeAtom';
import { ButtonAtom } from '../ButtonAtom/ButtonAtom';
import { PanelAtom } from '../PanelAtom/PanelAtom';

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
    <PanelAtom variant="ghost" padding="none" style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
      <BadgeAtom variant="default">Default</BadgeAtom>
      <BadgeAtom variant="secondary">Secondary</BadgeAtom>
      <BadgeAtom variant="destructive">Destructive</BadgeAtom>
      <BadgeAtom variant="outline">Outline</BadgeAtom>
      <BadgeAtom variant="ghost">Ghost</BadgeAtom>
    </PanelAtom>
  ),
};

export const Interactive: Story = {
  render: () => {
    const [count, setCount] = useState(0);
    return (
      <PanelAtom variant="ghost" padding="none" className="flex flex-col gap-4 items-start">
        <PanelAtom variant="ghost" padding="none" className="flex items-center gap-2">
          <span className="text-sm">Notificaciones</span>
          <BadgeAtom variant={count > 5 ? 'destructive' : count > 0 ? 'default' : 'secondary'}>
            {count}
          </BadgeAtom>
        </PanelAtom>
        <PanelAtom variant="ghost" padding="none" className="flex gap-2">
          <ButtonAtom variant="outline" size="sm" onClick={() => setCount((c) => c + 1)}>
            Nueva notificación
          </ButtonAtom>
          <ButtonAtom variant="ghost" size="sm" disabled={count === 0} onClick={() => setCount(0)}>
            Marcar leídas
          </ButtonAtom>
        </PanelAtom>
      </PanelAtom>
    );
  },
};
