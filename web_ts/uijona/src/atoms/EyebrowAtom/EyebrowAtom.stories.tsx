import type { Meta, StoryObj } from '@storybook/react';
import { EyebrowAtom } from './EyebrowAtom';

const meta: Meta<typeof EyebrowAtom> = {
  title: 'Atoms/EyebrowAtom',
  component: EyebrowAtom,
  tags: ['autodocs'],
  argTypes: {
    variant: { control: 'radio', options: ['primary', 'white', 'muted'] },
  },
};

export default meta;
type Story = StoryObj<typeof EyebrowAtom>;

export const Primary: Story = {
  args: { children: 'Nuestros servicios' },
};

export const White: Story = {
  args: { variant: 'white', children: 'Sobre nosotros' },
  decorators: [(Story) => <div style={{ background: '#0f172a', padding: '16px' }}><Story /></div>],
};

export const Muted: Story = {
  args: { variant: 'muted', children: 'Categoría' },
};

export const WithHeading: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
      <EyebrowAtom>Nuestros servicios</EyebrowAtom>
      <h2 style={{ fontSize: '2rem', fontWeight: 700, margin: 0 }}>
        Soluciones a medida para tu negocio
      </h2>
      <p style={{ color: '#64748b', margin: 0 }}>
        Diseñamos, construimos y acompañamos cada etapa de tu transformación digital.
      </p>
    </div>
  ),
};
