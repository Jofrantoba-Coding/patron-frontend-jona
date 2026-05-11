import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { SpinnerAtom } from './SpinnerAtom';
import { PanelAtom } from '../PanelAtom/PanelAtom';

const meta: Meta<typeof SpinnerAtom> = {
  title: 'Atoms/SpinnerAtom',
  component: SpinnerAtom,
  tags: ['autodocs'],
  argTypes: {
    size: { control: 'radio', options: ['sm', 'md', 'lg'] },
  },
};
export default meta;
type Story = StoryObj<typeof SpinnerAtom>;

export const Default: Story = {
  args: { size: 'md' },
};

export const Small: Story = {
  args: { size: 'sm' },
};

export const Large: Story = {
  args: { size: 'lg' },
};

export const AllSizes: Story = {
  render: () => (
    <PanelAtom variant="ghost" padding="none" style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
      <SpinnerAtom size="sm" />
      <SpinnerAtom size="md" />
      <SpinnerAtom size="lg" />
    </PanelAtom>
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
      <PanelAtom variant="ghost" padding="none" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
        {loading
          ? <SpinnerAtom size="lg" />
          : <p style={{ fontSize: '14px', color: '#737373' }}>Datos listos</p>}
        <button
          onClick={load}
          disabled={loading}
          style={{ borderRadius: '6px', border: '1px solid #d4d4d4', padding: '6px 12px', fontSize: '14px', cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.6 : 1 }}
        >
          {loading ? 'Cargando...' : 'Recargar datos'}
        </button>
      </PanelAtom>
    );
  },
};
