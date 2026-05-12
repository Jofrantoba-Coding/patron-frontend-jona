import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { SpinnerAtom } from './SpinnerAtom';
import { ButtonAtom } from '../ButtonAtom/ButtonAtom';
import { PanelAtom } from '../PanelAtom/PanelAtom';
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
          : <TextAtom size="sm" color="muted">Datos listos</TextAtom>}
        <ButtonAtom variant="outline" disabled={loading} onClick={load}>
          {loading ? 'Cargando...' : 'Recargar datos'}
        </ButtonAtom>
      </PanelAtom>
    );
  },
};
