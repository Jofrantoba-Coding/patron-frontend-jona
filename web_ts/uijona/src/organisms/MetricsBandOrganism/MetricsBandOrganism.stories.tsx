import type { Meta, StoryObj } from '@storybook/react';
import { MetricsBandOrganism } from './MetricsBandOrganism';

const meta: Meta<typeof MetricsBandOrganism> = {
  title: 'Organisms/MetricsBandOrganism',
  component: MetricsBandOrganism,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof MetricsBandOrganism>;

export const Default: Story = {
  args: {
    metrics: [
      { value: '+120', label: 'proyectos entregados' },
      { value: '98%', label: 'satisfacción del cliente' },
      { value: '40%', label: 'reducción de incidentes' },
      { value: '4x', label: 'velocidad de despliegue' },
    ],
  },
};
