import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { SpinnerAtom } from './SpinnerAtom';
import { JButton } from '../JButton/JButton';
import { JPanel } from '../JPanel/JPanel';
import { TextAtom } from '../TextAtom/TextAtom';

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
    <JPanel variant="ghost" padding="none" style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
      <SpinnerAtom size="sm" />
      <SpinnerAtom size="md" />
      <SpinnerAtom size="lg" />
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
      <JPanel variant="ghost" padding="none" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
        {loading
          ? <SpinnerAtom size="lg" />
          : <TextAtom size="sm" color="muted">Datos listos</TextAtom>}
        <JButton variant="outline" disabled={loading} onClick={load}>
          {loading ? 'Cargando...' : 'Recargar datos'}
        </JButton>
      </JPanel>
    );
  },
};
