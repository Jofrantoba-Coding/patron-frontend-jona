import type { Meta, StoryObj } from '@storybook/react';
import { JContextChip } from './JContextChip';

const meta: Meta<typeof JContextChip> = {
  title: 'Molecules/JContextChip',
  component: JContextChip,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'JContextChip es texto de solo lectura: une los valores con ` · ` y expone cada par `etiqueta: valor` en su descripción accesible y su tooltip. No es un botón.',
      },
    },
  },
  args: {
    items: [
      { label: 'Empresa', value: 'Comercial Demo SAC' },
      { label: 'PV', value: 'Tienda Central' },
      { label: 'Período', value: '01/01/2026–31/12/2026' },
    ],
  },
};
export default meta;
type Story = StoryObj<typeof JContextChip>;

export const Default: Story = {};
