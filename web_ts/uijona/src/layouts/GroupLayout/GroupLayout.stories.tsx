import type { Meta, StoryObj } from '@storybook/react';
import { PanelAtom } from '../../atoms/PanelAtom';
import { GroupLayout } from './GroupLayout';

const meta: Meta<typeof GroupLayout> = {
  title: 'Layouts/GroupLayout',
  component: GroupLayout,
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
type Story = StoryObj<typeof GroupLayout>;

const FieldPanel = ({ title, body }: { title: string; body: string }) => (
  <PanelAtom variant="outlined" padding="md" radius="sm" className="min-h-20">
    <p className="text-sm font-semibold text-neutral-800">{title}</p>
    <p className="mt-1 text-xs text-neutral-500">{body}</p>
  </PanelAtom>
);

export const SequentialGroups: Story = {
  args: {
    columns: 3,
    mode: 'sequential',
    placement: 'responsive',
    gap: 'md',
  },
  render: (args) => (
    <GroupLayout {...args} className="w-full max-w-4xl">
      <FieldPanel title="Nombre" body="Campo principal" />
      <FieldPanel title="Correo" body="Validacion de contacto" />
      <FieldPanel title="Telefono" body="Dato opcional" />
      <PanelAtom data-group-span="2" variant="outlined" padding="md" radius="sm" className="min-h-24">
        <p className="text-sm font-semibold text-neutral-800">Direccion</p>
        <p className="mt-1 text-xs text-neutral-500">Esta seccion puede ocupar dos columnas desde desktop.</p>
      </PanelAtom>
      <FieldPanel title="Estado" body="Activo o inactivo" />
    </GroupLayout>
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
    <GroupLayout {...args} className="w-full max-w-3xl">
      <FieldPanel title="Entrada" body="Grupo paralelo A" />
      <FieldPanel title="Revision" body="Grupo paralelo B" />
      <FieldPanel title="Salida" body="Grupo paralelo C" />
      <FieldPanel title="Auditoria" body="Grupo paralelo D" />
    </GroupLayout>
  ),
};
