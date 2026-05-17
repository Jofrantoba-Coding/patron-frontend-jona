import type { Meta, StoryObj } from '@storybook/react';
import { JPanel } from '../../atoms/JPanel';
import { TextAtom } from '../../atoms/TextAtom/TextAtom';
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
  <JPanel variant="outlined" padding="md" radius="sm" className="min-h-20">
    <TextAtom size="sm" className="font-semibold text-neutral-800">{title}</TextAtom>
    <TextAtom size="xs" color="muted" className="mt-1">{body}</TextAtom>
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
    <GroupLayout {...args} className="w-full max-w-4xl">
      <FieldPanel title="Nombre" body="Campo principal" />
      <FieldPanel title="Correo" body="Validacion de contacto" />
      <FieldPanel title="Telefono" body="Dato opcional" />
      <JPanel data-group-span="2" variant="outlined" padding="md" radius="sm" className="min-h-24">
        <TextAtom size="sm" className="font-semibold text-neutral-800">Direccion</TextAtom>
        <TextAtom size="xs" color="muted" className="mt-1">Esta seccion puede ocupar dos columnas desde desktop.</TextAtom>
      </JPanel>
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
