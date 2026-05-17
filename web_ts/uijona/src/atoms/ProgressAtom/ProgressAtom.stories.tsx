import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { ProgressAtom } from './ProgressAtom';
import { JButton } from '../JButton/JButton';
import { JPanel } from '../JPanel/JPanel';

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
  decorators: [(Story) => <JPanel variant="ghost" padding="none" style={{ width: '320px' }}><Story /></JPanel>],
};

export const WithLabel: Story = {
  args: { value: 75, showLabel: true },
  decorators: [(Story) => <JPanel variant="ghost" padding="none" style={{ width: '320px' }}><Story /></JPanel>],
};

export const Success: Story = {
  args: { value: 100, variant: 'success', showLabel: true },
  decorators: [(Story) => <JPanel variant="ghost" padding="none" style={{ width: '320px' }}><Story /></JPanel>],
};

export const Warning: Story = {
  args: { value: 45, variant: 'warning', showLabel: true },
  decorators: [(Story) => <JPanel variant="ghost" padding="none" style={{ width: '320px' }}><Story /></JPanel>],
};

export const Danger: Story = {
  args: { value: 20, variant: 'danger', showLabel: true },
  decorators: [(Story) => <JPanel variant="ghost" padding="none" style={{ width: '320px' }}><Story /></JPanel>],
};

export const AllVariants: Story = {
  render: () => (
    <JPanel variant="ghost" padding="none" style={{ width: '320px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
      <ProgressAtom value={80} variant="link"  showLabel />
      <ProgressAtom value={90} variant="success"  showLabel />
      <ProgressAtom value={55} variant="warning"  showLabel />
      <ProgressAtom value={25} variant="link-danger"   showLabel />
    </JPanel>
  ),
};

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
      <JPanel variant="ghost" padding="none" style={{ width: '320px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <ProgressAtom value={progress} variant={variant} showLabel />
        <JButton variant="outline" disabled={running} loading={running} onClick={start}>
          {running ? 'Subiendo...' : progress === 100 ? 'Subir de nuevo' : 'Iniciar subida'}
        </JButton>
      </JPanel>
    );
  },
};
