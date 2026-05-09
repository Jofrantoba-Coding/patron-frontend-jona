import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { EmptyStateMolecule } from './EmptyStateMolecule';

const EmptyIcon = () => (
  <span aria-hidden="true" style={{ fontSize: 24, fontWeight: 700, lineHeight: 1 }}>
    0
  </span>
);

const meta: Meta<typeof EmptyStateMolecule> = {
  title: 'Molecules/EmptyStateMolecule',
  component: EmptyStateMolecule,
  tags: ['autodocs'],
  argTypes: {
    title: { control: 'text' },
    description: { control: 'text' },
  },
};
export default meta;
type Story = StoryObj<typeof EmptyStateMolecule>;

export const Default: Story = {
  args: {
    title: 'Sin resultados',
    description: 'Ajusta los filtros o crea un nuevo registro para empezar.',
  },
};

export const WithIcon: Story = {
  args: {
    icon: <EmptyIcon />,
    title: 'No hay datos',
    description: 'La vista esta lista, pero aun no contiene elementos.',
  },
};

export const WithActions: Story = {
  args: {
    icon: <EmptyIcon />,
    title: 'No hay proyectos',
    description: 'Crea el primer proyecto o revisa los filtros aplicados.',
    actions: [
      { label: 'Crear proyecto', onClick: fn(), variant: 'primary' },
      { label: 'Limpiar filtros', onClick: fn(), variant: 'secondary' },
    ],
  },
};
