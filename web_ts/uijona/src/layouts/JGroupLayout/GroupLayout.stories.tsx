import type { Meta, StoryObj } from '@storybook/react';
import { JPanel } from '../../atoms/JPanel';
import { JLabel } from '../../atoms/JLabel';
import { JGroupLayout } from './GroupLayout';

const meta: Meta<typeof JGroupLayout> = {
  title: 'Layouts/JGroupLayout',
  component: JGroupLayout,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
  argTypes: {
    mode: {
      control: 'select',
      options: ['sequential', 'parallel'],
    },
    gap: {
      control: 'select',
      options: ['none', 'xs', 'sm', 'md', 'lg', 'xl'],
    },
    placement: {
      control: 'select',
      options: ['responsive', 'fixed'],
    },
    columns: { control: 'text' },
    autoFitMin: { control: 'text' },
  },
};

export default meta;
type Story = StoryObj<typeof JGroupLayout>;

const FieldPanel = ({ title, body }: { title: string; body: string }) => (
  <JPanel variant="outlined" padding="md" radius="sm" className="min-h-20">
    <JLabel size="sm" className="font-semibold text-neutral-800">{title}</JLabel>
    <JLabel size="xs" color="muted" className="mt-1">{body}</JLabel>
  </JPanel>
);

export const SequentialGroups: Story = {
  args: {
    columns: 3,
    mode: 'sequential',
    placement: 'responsive',
    gap: 'md',
  },
  render: (args) => (
    <JGroupLayout {...args} className="w-full max-w-4xl">
      <FieldPanel title="Nombre" body="Campo principal" />
      <FieldPanel title="Correo" body="Validacion de contacto" />
      <FieldPanel title="Telefono" body="Dato opcional" />
      <JPanel data-group-span="2" variant="outlined" padding="md" radius="sm" className="min-h-24">
        <JLabel size="sm" className="font-semibold text-neutral-800">Direccion</JLabel>
        <JLabel size="xs" color="muted" className="mt-1">Esta seccion puede ocupar dos columnas desde desktop.</JLabel>
      </JPanel>
      <FieldPanel title="Estado" body="Activo o inactivo" />
    </JGroupLayout>
  ),
};

export const ParallelGroups: Story = {
  args: {
    columns: 'repeat(2, minmax(0, 1fr))',
    mode: 'parallel',
    placement: 'responsive',
    gap: 'sm',
  },
  render: (args) => (
    <JGroupLayout {...args} className="w-full max-w-3xl">
      <FieldPanel title="Entrada" body="Grupo paralelo A" />
      <FieldPanel title="Revision" body="Grupo paralelo B" />
      <FieldPanel title="Salida" body="Grupo paralelo C" />
      <FieldPanel title="Auditoria" body="Grupo paralelo D" />
    </JGroupLayout>
  ),
};
