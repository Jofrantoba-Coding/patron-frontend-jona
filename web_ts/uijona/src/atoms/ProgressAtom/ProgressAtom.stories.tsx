import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { ProgressAtom } from './ProgressAtom';

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
  decorators: [(Story) => <div style={{ width: '320px' }}><Story /></div>],
};

export const WithLabel: Story = {
  args: { value: 75, showLabel: true },
  decorators: [(Story) => <div style={{ width: '320px' }}><Story /></div>],
};

export const Success: Story = {
  args: { value: 100, variant: 'success', showLabel: true },
  decorators: [(Story) => <div style={{ width: '320px' }}><Story /></div>],
};

export const Warning: Story = {
  args: { value: 45, variant: 'warning', showLabel: true },
  decorators: [(Story) => <div style={{ width: '320px' }}><Story /></div>],
};

export const Danger: Story = {
  args: { value: 20, variant: 'danger', showLabel: true },
  decorators: [(Story) => <div style={{ width: '320px' }}><Story /></div>],
};

export const AllVariants: Story = {
  render: () => (
    <div style={{ width: '320px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
      <ProgressAtom value={80} variant="default"  showLabel />
      <ProgressAtom value={90} variant="success"  showLabel />
      <ProgressAtom value={55} variant="warning"  showLabel />
      <ProgressAtom value={25} variant="danger"   showLabel />
    </div>
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
      <div style={{ width: '320px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <ProgressAtom value={progress} variant={variant} showLabel />
        <button
          onClick={start}
          disabled={running}
          style={{ borderRadius: '6px', border: '1px solid #d4d4d4', padding: '6px 12px', fontSize: '14px', cursor: running ? 'not-allowed' : 'pointer' }}
        >
          {running ? 'Subiendo...' : progress === 100 ? 'Subir de nuevo' : 'Iniciar subida'}
        </button>
      </div>
    );
  },
};
