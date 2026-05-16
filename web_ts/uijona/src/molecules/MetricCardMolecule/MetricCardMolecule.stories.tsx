import type { Meta, StoryObj } from '@storybook/react';
import { MetricCardMolecule } from './MetricCardMolecule';

const meta: Meta<typeof MetricCardMolecule> = {
  title: 'Molecules/MetricCardMolecule',
  component: MetricCardMolecule,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof MetricCardMolecule>;

export const Default: Story = {
  args: { value: '+50', label: 'proyectos entregados' },
};

export const Fila: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', background: '#0a0f1e', padding: '24px' }}>
      <MetricCardMolecule value="+50" label="proyectos entregados en apps, cloud, datos y plataformas" />
      <MetricCardMolecule value="18" label="servicios especializados que cubren todo el ciclo tecnológico" />
      <MetricCardMolecule value="30 min" label="diagnóstico ejecutivo sin costo para evaluar tu arquitectura" />
    </div>
  ),
};
