import type { Meta, StoryObj } from '@storybook/react';
import { JMetricCard } from './JMetricCard';

const meta: Meta<typeof JMetricCard> = {
  title: 'Molecules/JMetricCard',
  component: JMetricCard,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof JMetricCard>;

export const Default: Story = {
  args: { value: '+50', label: 'proyectos entregados' },
};

export const Fila: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', background: '#0a0f1e', padding: '24px' }}>
      <JMetricCard value="+50" label="proyectos entregados en apps, cloud, datos y plataformas" />
      <JMetricCard value="18" label="servicios especializados que cubren todo el ciclo tecnológico" />
      <JMetricCard value="30 min" label="diagnóstico ejecutivo sin costo para evaluar tu arquitectura" />
    </div>
  ),
};
