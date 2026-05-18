import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { JProgress } from './JProgress';
import { JButton } from '../JButton/JButton';
import { JPanel } from '../JPanel/JPanel';
import { JLabel } from '../JLabel';

const meta: Meta<typeof JProgress> = {
  title: 'Atoms/JProgress',
  component: JProgress,
  tags: ['autodocs'],
  argTypes: {
    type:      { control: 'radio',  options: ['bar', 'circle'] },
    variant:   { control: 'select', options: ['default', 'success', 'warning', 'danger'] },
    size:      { control: 'radio',  options: ['sm', 'md', 'lg'] },
    value:     { control: { type: 'range', min: 0, max: 100, step: 5 } },
    showLabel: { control: 'boolean' },
    animated:  { control: 'boolean' },
  },
};
export default meta;
type Story = StoryObj<typeof JProgress>;

// ── Bar ──────────────────────────────────────────────────────────────────────

export const BarDefault: Story = {
  args: { value: 60 },
  decorators: [(S) => <JPanel variant="ghost" padding="none" style={{ width: 320 }}><S /></JPanel>],
};

export const BarWithLabel: Story = {
  args: { value: 75, showLabel: true },
  decorators: [(S) => <JPanel variant="ghost" padding="none" style={{ width: 320 }}><S /></JPanel>],
};

export const BarSizes: Story = {
  render: () => (
    <JPanel variant="ghost" padding="none" className="flex flex-col gap-4" style={{ width: 320 }}>
      <JProgress size="sm" value={60} showLabel />
      <JProgress size="md" value={60} showLabel />
      <JProgress size="lg" value={60} showLabel />
    </JPanel>
  ),
};

export const BarVariants: Story = {
  render: () => (
    <JPanel variant="ghost" padding="none" className="flex flex-col gap-3" style={{ width: 320 }}>
      <JProgress value={80} variant="default" showLabel />
      <JProgress value={90} variant="success" showLabel />
      <JProgress value={55} variant="warning" showLabel />
      <JProgress value={25} variant="danger"  showLabel />
    </JPanel>
  ),
};

export const BarAnimated: Story = {
  args: { value: 65, animated: true, showLabel: true },
  decorators: [(S) => <JPanel variant="ghost" padding="none" style={{ width: 320 }}><S /></JPanel>],
};

// ── Circle ───────────────────────────────────────────────────────────────────

export const CircleDefault: Story = {
  args: { type: 'circle', value: 60, showLabel: true },
};

export const CircleSizes: Story = {
  render: () => (
    <JPanel variant="ghost" padding="none" className="flex items-end gap-6">
      <JProgress type="circle" size="sm" value={60} showLabel />
      <JProgress type="circle" size="md" value={60} showLabel />
      <JProgress type="circle" size="lg" value={60} showLabel />
    </JPanel>
  ),
};

export const CircleVariants: Story = {
  render: () => (
    <JPanel variant="ghost" padding="none" className="flex items-center gap-6">
      <JProgress type="circle" value={80} variant="default" showLabel />
      <JProgress type="circle" value={90} variant="success" showLabel />
      <JProgress type="circle" value={55} variant="warning" showLabel />
      <JProgress type="circle" value={25} variant="danger"  showLabel />
    </JPanel>
  ),
};

export const CircleCustomLabel: Story = {
  render: () => (
    <JPanel variant="ghost" padding="none" className="flex items-center gap-6">
      <JProgress type="circle" size="lg" value={3} max={10} showLabel label="3/10" variant="warning" />
      <JProgress type="circle" size="lg" value={100} showLabel label="✓" variant="success" />
    </JPanel>
  ),
};

// ── Interactive ───────────────────────────────────────────────────────────────

export const Interactive: Story = {
  render: () => {
    const [progress, setProgress] = useState(0);
    const [running, setRunning] = useState(false);
    const start = () => {
      if (running) return;
      setProgress(0);
      setRunning(true);
      const id = setInterval(() => {
        setProgress((p) => {
          if (p >= 100) { clearInterval(id); setRunning(false); return 100; }
          return p + 5;
        });
      }, 150);
    };
    const variant = progress < 40 ? 'default' : progress < 80 ? 'warning' : 'success';
    return (
      <JPanel variant="ghost" padding="none" className="flex flex-col gap-6" style={{ width: 320 }}>
        <JPanel variant="ghost" padding="none" className="flex items-center gap-8">
          <JProgress type="circle" size="lg" value={progress} variant={variant} showLabel />
          <JPanel variant="ghost" padding="none" className="flex flex-col gap-2 flex-1">
            <JLabel size="sm" className="font-medium text-neutral-700">Subida de archivo</JLabel>
            <JProgress value={progress} variant={variant} showLabel animated={running} />
          </JPanel>
        </JPanel>
        <JButton variant="outline" disabled={running} loading={running} onClick={start}>
          {running ? 'Subiendo...' : progress === 100 ? 'Subir de nuevo' : 'Iniciar subida'}
        </JButton>
      </JPanel>
    );
  },
};
