import type { Meta, StoryObj } from '@storybook/react';
import { JPanel } from '../../atoms/JPanel';
import { JLabel } from '../../atoms/JLabel';
import { JGroupLayout, JGROUP_LAYOUT_DEFAULTS } from './JGroupLayout';

const meta: Meta<typeof JGroupLayout> = {
  title: 'Layouts/JGroupLayout',
  component: JGroupLayout,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'JGroupLayout es el layout de grupos de JONA. Organiza elementos en un CSS Grid con dos modos: `sequential` (los elementos fluyen uno tras otro, como filas de formulario) y `parallel` (los elementos inician en posiciones paralelas de cada columna, como formularios comparativos). Los hijos pueden usar `data-group-span` para ocupar múltiples columnas.',
      },
    },
  },
  argTypes: {
    mode: {
      description: '`sequential` (default) los elementos fluyen en orden como un grid estándar. `parallel` agrupa los elementos por columna en paralelo — útil para formularios de comparación.',
      control: 'select',
      options: ['sequential', 'parallel'],
      table: {
        type: { summary: 'JGroupLayoutMode' },
        defaultValue: { summary: JGROUP_LAYOUT_DEFAULTS.mode },
      },
    },
    gap: {
      description: 'Espacio entre elementos. `none`, `xs` 4px, `sm` 8px, `md` 16px (default), `lg` 24px, `xl` 32px.',
      control: 'select',
      options: ['none', 'xs', 'sm', 'md', 'lg', 'xl'],
      table: {
        type: { summary: 'JPanelGap' },
        defaultValue: { summary: JGROUP_LAYOUT_DEFAULTS.gap },
      },
    },
    placement: {
      description: '`responsive` usa `autoFitMin` para columnas adaptativas (default). `fixed` usa el valor de `columns` de forma estática.',
      control: 'select',
      options: ['responsive', 'fixed'],
      table: {
        type: { summary: '"responsive" | "fixed"' },
        defaultValue: { summary: JGROUP_LAYOUT_DEFAULTS.placement },
      },
    },
    columns: {
      description: 'Número o string CSS de columnas en modo `fixed`. Ejemplo: `3`, `"repeat(2, minmax(0, 1fr))"`. En modo `responsive` se ignora.',
      control: 'text',
      table: { type: { summary: 'number | string' } },
    },
    autoFitMin: {
      description: 'Ancho mínimo de columna en modo `responsive`. Default `12rem`.',
      control: 'text',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: JGROUP_LAYOUT_DEFAULTS.autoFitMin },
      },
    },
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
  name: 'Modo sequential (formulario)',
  parameters: {
    docs: {
      description: { story: '`mode="sequential"` (default): los campos fluyen en orden. Un campo con `data-group-span="2"` ocupa dos columnas — ideal para campos de dirección o descripción en formularios de 3 columnas.' },
    },
  },
  args: {
    columns: 3,
    mode: 'sequential',
    placement: 'responsive',
    gap: 'md',
  },
  render: (args) => (
    <JGroupLayout {...args} className="w-full max-w-4xl">
      <FieldPanel title="Nombre" body="Campo principal" />
      <FieldPanel title="Correo" body="Validación de contacto" />
      <FieldPanel title="Teléfono" body="Dato opcional" />
      <JPanel data-group-span="2" variant="outlined" padding="md" radius="sm" className="min-h-24">
        <JLabel size="sm" className="font-semibold text-neutral-800">Dirección</JLabel>
        <JLabel size="xs" color="muted" className="mt-1">Esta sección ocupa dos columnas desde desktop.</JLabel>
      </JPanel>
      <FieldPanel title="Estado" body="Activo o inactivo" />
    </JGroupLayout>
  ),
};

export const ParallelGroups: Story = {
  name: 'Modo parallel (comparación)',
  parameters: {
    docs: {
      description: { story: '`mode="parallel"` alinea los elementos en columnas paralelas. Útil para comparar flujos o mostrar entradas/salidas de un proceso de forma visual.' },
    },
  },
  args: {
    columns: 'repeat(2, minmax(0, 1fr))',
    mode: 'parallel',
    placement: 'responsive',
    gap: 'sm',
  },
  render: (args) => (
    <JGroupLayout {...args} className="w-full max-w-3xl">
      <FieldPanel title="Entrada" body="Grupo paralelo A" />
      <FieldPanel title="Revisión" body="Grupo paralelo B" />
      <FieldPanel title="Salida" body="Grupo paralelo C" />
      <FieldPanel title="Auditoría" body="Grupo paralelo D" />
    </JGroupLayout>
  ),
};
