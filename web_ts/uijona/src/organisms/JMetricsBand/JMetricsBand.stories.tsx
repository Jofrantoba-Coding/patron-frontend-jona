import type { Meta, StoryObj } from '@storybook/react';
import { JMetricsBand } from './JMetricsBand';

const meta: Meta<typeof JMetricsBand> = {
  title: 'Organisms/JMetricsBand',
  component: JMetricsBand,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof JMetricsBand>;

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
