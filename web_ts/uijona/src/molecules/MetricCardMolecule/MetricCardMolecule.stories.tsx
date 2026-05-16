import type { Meta, StoryObj } from '@storybook/react';
import { MetricCardMolecule } from './MetricCardMolecule';

const meta: Meta<typeof MetricCardMolecule> = {
  title: 'Molecules/MetricCardMolecule',
  component: MetricCardMolecule,
  tags: ['autodocs'],
  argTypes: {
    tone: { control: 'radio', options: ['dark', 'light'] },
  },
};

export default meta;
type Story = StoryObj<typeof MetricCardMolecule>;

export const Dark: Story = {
  args: { value: '+50', label: 'proyectos entregados' },
  decorators: [(Story) => <div style={{ background: '#0f172a', padding: '24px', width: '200px' }}><Story /></div>],
};

export const Light: Story = {
  args: { value: '+50', label: 'proyectos entregados', tone: 'light' },
};

export const MetricRow: Story = {
  render: () => (
    <div style={{ background: '#0f172a', padding: '24px', display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
      <MetricCardMolecule value="+50" label="proyectos entregados" />
      <MetricCardMolecule value="18" label="servicios especializados" />
      <MetricCardMolecule value="30 min" label="diagnóstico sin costo" />
    </div>
  ),
};

export const LightRow: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
      <MetricCardMolecule value="+50" label="proyectos entregados" tone="light" />
      <MetricCardMolecule value="18" label="servicios especializados" tone="light" />
      <MetricCardMolecule value="30 min" label="diagnóstico sin costo" tone="light" />
    </div>
  ),
};
