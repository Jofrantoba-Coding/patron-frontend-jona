import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { JSkeleton } from './JSkeleton';
import { JButton } from '../JButton/JButton';
import { JPanel } from '../JPanel/JPanel';
import { JLabel } from '../JLabel';

const meta: Meta<typeof JSkeleton> = {
  title: 'Atoms/JSkeleton',
  component: JSkeleton,
  tags: ['autodocs'],
  argTypes: {
    circle:  { control: 'boolean' },
    variant: { control: 'radio', options: ['pulse', 'wave', 'none'] },
  },
};
export default meta;
type Story = StoryObj<typeof JSkeleton>;

export const Line: Story = {
  args: { className: 'h-4 w-48' },
};

export const Circle: Story = {
  args: { circle: true, className: 'h-10 w-10' },
};

export const WaveLine: Story = {
  args: { variant: 'wave', className: 'h-4 w-48' },
};

export const AllVariants: Story = {
  render: () => (
    <JPanel variant="ghost" padding="none" className="flex flex-col gap-4" style={{ width: 280 }}>
      {(['pulse', 'wave', 'none'] as const).map((v) => (
        <JPanel key={v} variant="ghost" padding="none" className="flex items-center gap-3">
          <JSkeleton variant={v} circle className="h-8 w-8 shrink-0" />
          <JPanel variant="ghost" padding="none" className="flex flex-col gap-1.5 flex-1">
            <JSkeleton variant={v} className="h-3 w-full" />
            <JSkeleton variant={v} className="h-3 w-3/4" />
          </JPanel>
          <JLabel size="xs" color="muted" className="shrink-0">{v}</JLabel>
        </JPanel>
      ))}
    </JPanel>
  ),
};

export const CardSkeleton: Story = {
  render: () => (
    <JPanel variant="ghost" padding="none" className="flex flex-col gap-2 p-4" style={{ width: 320 }}>
      <JPanel variant="ghost" padding="none" className="flex gap-3 items-center">
        <JSkeleton circle className="h-10 w-10 shrink-0" />
        <JPanel variant="ghost" padding="none" className="flex flex-col gap-1.5 flex-1">
          <JSkeleton className="h-4 w-32" />
          <JSkeleton className="h-3 w-24" />
        </JPanel>
      </JPanel>
      <JSkeleton className="h-4 w-full" />
      <JSkeleton className="h-4 w-4/5" />
      <JSkeleton className="h-4 w-3/5" />
    </JPanel>
  ),
};

export const WaveCard: Story = {
  render: () => (
    <JPanel variant="ghost" padding="none" className="flex flex-col gap-2 p-4" style={{ width: 320 }}>
      <JPanel variant="ghost" padding="none" className="flex gap-3 items-center">
        <JSkeleton variant="wave" circle className="h-10 w-10 shrink-0" />
        <JPanel variant="ghost" padding="none" className="flex flex-col gap-1.5 flex-1">
          <JSkeleton variant="wave" className="h-4 w-32" />
          <JSkeleton variant="wave" className="h-3 w-24" />
        </JPanel>
      </JPanel>
      <JSkeleton variant="wave" className="h-4 w-full" />
      <JSkeleton variant="wave" className="h-4 w-4/5" />
      <JSkeleton variant="wave" className="h-4 w-3/5" />
    </JPanel>
  ),
};

export const Interactive: Story = {
  render: () => {
    const [loaded, setLoaded] = useState(false);
    return (
      <JPanel variant="ghost" padding="none" className="flex flex-col gap-4" style={{ width: 320 }}>
        {loaded ? (
          <JPanel variant="ghost" padding="none" className="flex gap-3 items-center p-4 border border-neutral-200 rounded-lg">
            <JPanel variant="ghost" padding="none" className="h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center font-bold text-primary-700 text-sm shrink-0">
              JF
            </JPanel>
            <JPanel variant="ghost" padding="none">
              <JLabel size="sm" className="font-semibold">Jonathan Franck</JLabel>
              <JLabel size="xs" className="text-neutral-400">jofrantoba@gmail.com</JLabel>
            </JPanel>
          </JPanel>
        ) : (
          <JPanel variant="ghost" padding="none" className="flex gap-3 items-center p-4 border border-neutral-200 rounded-lg">
            <JSkeleton variant="wave" circle className="h-10 w-10 shrink-0" />
            <JPanel variant="ghost" padding="none" className="flex flex-col gap-1.5 flex-1">
              <JSkeleton variant="wave" className="h-4 w-32" />
              <JSkeleton variant="wave" className="h-3 w-48" />
            </JPanel>
          </JPanel>
        )}
        <JButton variant="outline" onClick={() => setLoaded((l) => !l)}>
          {loaded ? 'Mostrar skeleton' : 'Simular carga completa'}
        </JButton>
      </JPanel>
    );
  },
};
