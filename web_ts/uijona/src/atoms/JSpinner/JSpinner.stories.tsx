import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { JSpinner } from './JSpinner';
import { JButton } from '../JButton/JButton';
import { JPanel } from '../JPanel/JPanel';
import { JLabel } from '../JLabel';

const meta: Meta<typeof JSpinner> = {
  title: 'Atoms/JSpinner',
  component: JSpinner,
  tags: ['autodocs'],
  argTypes: {
    size:  { control: 'radio',  options: ['sm', 'md', 'lg', 'xl'] },
    color: { control: 'select', options: ['current', 'primary', 'white', 'neutral'] },
    label: { control: 'text' },
  },
};
export default meta;
type Story = StoryObj<typeof JSpinner>;

export const Default: Story = {
  args: { size: 'md' },
};

export const AllSizes: Story = {
  render: () => (
    <JPanel variant="ghost" padding="none" className="flex items-center gap-6">
      {(['sm', 'md', 'lg', 'xl'] as const).map((s) => (
        <JPanel key={s} variant="ghost" padding="none" className="flex flex-col items-center gap-2">
          <JSpinner size={s} color="primary" />
          <JLabel size="xs" color="muted">{s}</JLabel>
        </JPanel>
      ))}
    </JPanel>
  ),
};

export const AllColors: Story = {
  render: () => (
    <JPanel variant="ghost" padding="none" className="flex items-center gap-6">
      <JPanel variant="ghost" padding="none" className="flex flex-col items-center gap-2">
        <JSpinner color="current" />
        <JLabel size="xs" color="muted">current</JLabel>
      </JPanel>
      <JPanel variant="ghost" padding="none" className="flex flex-col items-center gap-2">
        <JSpinner color="primary" />
        <JLabel size="xs" color="muted">primary</JLabel>
      </JPanel>
      <JPanel variant="ghost" padding="none" className="flex flex-col items-center gap-2 bg-neutral-800 rounded p-3">
        <JSpinner color="white" />
        <JLabel size="xs" className="text-white">white</JLabel>
      </JPanel>
      <JPanel variant="ghost" padding="none" className="flex flex-col items-center gap-2">
        <JSpinner color="neutral" />
        <JLabel size="xs" color="muted">neutral</JLabel>
      </JPanel>
    </JPanel>
  ),
};

export const InButton: Story = {
  render: () => (
    <JPanel variant="ghost" padding="none" className="flex items-center gap-3">
      <JButton variant="default" loading>Guardando</JButton>
      <JButton variant="outline" loading>Cargando</JButton>
    </JPanel>
  ),
};

export const Interactive: Story = {
  render: () => {
    const [loading, setLoading] = useState(false);
    const load = async () => {
      setLoading(true);
      await new Promise((r) => setTimeout(r, 2000));
      setLoading(false);
    };
    return (
      <JPanel variant="ghost" padding="none" className="flex flex-col items-center gap-4">
        {loading
          ? <JSpinner size="lg" color="primary" />
          : <JLabel size="sm" color="muted">Datos listos</JLabel>}
        <JButton variant="outline" disabled={loading} onClick={load}>
          {loading ? 'Cargando...' : 'Recargar datos'}
        </JButton>
      </JPanel>
    );
  },
};
