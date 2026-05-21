import type { Meta, StoryObj } from '@storybook/react';
import { JPanel } from '../../atoms/JPanel';
import { JLabel } from '../../atoms/JLabel';
import { JGridBagLayout, GRID_BAG_LAYOUT_DEFAULTS } from './GridBagLayout';

const meta: Meta<typeof JGridBagLayout> = {
  title: 'Layouts/JGridBagLayout',
  component: JGridBagLayout,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'JGridBagLayout es el layout de grid con control de celda de JONA. Implementa CSS Grid con posicionamiento explícito vía atributos de datos en los hijos: `data-gridbag-column`, `data-gridbag-row`, `data-gridbag-column-span`, `data-gridbag-row-span`. Soporta modo `responsive` (columnas auto-fit con `autoFitMin`) y `fixed` (columnas explícitas con `columns`). `dense=true` activa el algoritmo de relleno denso para minimizar huecos.',
      },
    },
  },
  argTypes: {
    gap: {
      description: 'Espacio entre celdas. `none`, `xs` 4px, `sm` 8px, `md` 16px (default), `lg` 24px, `xl` 32px.',
      control: 'select',
      options: ['none', 'xs', 'sm', 'md', 'lg', 'xl'],
      table: {
        type: { summary: 'JPanelGap' },
        defaultValue: { summary: GRID_BAG_LAYOUT_DEFAULTS.gap },
      },
    },
    placement: {
      description: '`responsive` usa `autoFitMin` para columnas adaptativas (default). `fixed` usa el número de columnas de `columns` sin adaptación.',
      control: 'select',
      options: ['responsive', 'fixed'],
      table: {
        type: { summary: '"responsive" | "fixed"' },
        defaultValue: { summary: GRID_BAG_LAYOUT_DEFAULTS.placement },
      },
    },
    autoFitMin: {
      description: 'Ancho mínimo de columna en modo `responsive`. El grid crea tantas columnas como quepan con ese mínimo. Default `12rem`.',
      control: 'text',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: GRID_BAG_LAYOUT_DEFAULTS.autoFitMin },
      },
    },
    dense: {
      description: '`true` (default) activa el algoritmo de relleno denso: los hijos sin posición explícita llenan huecos dejados por elementos con span. `false` mantiene el orden del DOM.',
      control: 'boolean',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: String(GRID_BAG_LAYOUT_DEFAULTS.dense) },
      },
    },
    columns: {
      description: 'Número o string CSS de columnas en modo `fixed`. Ejemplo: `4`, `"repeat(3, 1fr)"`. En modo `responsive` se ignora.',
      control: 'text',
      table: { type: { summary: 'number | string' } },
    },
    rows: {
      description: 'Definición de filas en CSS Grid. Ejemplo: `"auto 1fr auto"`. Raramente necesario.',
      control: 'text',
      table: { type: { summary: 'number | string' } },
    },
  },
};

export default meta;
type Story = StoryObj<typeof JGridBagLayout>;

const DemoCell = ({ label }: { label: string }) => (
  <JPanel variant="outlined" padding="md" radius="sm" className="min-h-16">
    <JLabel as="span" size="sm" className="font-medium text-neutral-700">{label}</JLabel>
  </JPanel>
);

export const ResponsiveConstraints: Story = {
  name: 'Grid con spans explícitos',
  parameters: {
    docs: {
      description: { story: 'Celdas con `data-gridbag-column-span` y `data-gridbag-row-span` para ocupar múltiples celdas. El grid de 4 columnas redistribuye el espacio según los spans.' },
    },
  },
  args: {
    columns: 4,
    gap: 'sm',
    placement: 'responsive',
  },
  render: (args) => (
    <JGridBagLayout {...args} className="w-full max-w-3xl">
      <JPanel data-gridbag-column="1" data-gridbag-row="1" data-gridbag-column-span="2" variant="outlined" padding="md" radius="sm">
        <JLabel as="span" size="sm" className="font-medium text-neutral-700">Header span 2</JLabel>
      </JPanel>
      <DemoCell label="Metric A" />
      <DemoCell label="Metric B" />
      <JPanel data-gridbag-column="1" data-gridbag-row="2" data-gridbag-row-span="2" variant="outlined" padding="md" radius="sm" className="min-h-32">
        <JLabel as="span" size="sm" className="font-medium text-neutral-700">Side span rows</JLabel>
      </JPanel>
      <JPanel data-gridbag-column="2" data-gridbag-row="2" data-gridbag-column-span="3" variant="outlined" padding="md" radius="sm" className="min-h-32">
        <JLabel as="span" size="sm" className="font-medium text-neutral-700">Content span 3</JLabel>
      </JPanel>
    </JGridBagLayout>
  ),
};

export const AutoFitFirst: Story = {
  name: 'Auto-fit responsivo',
  parameters: {
    docs: {
      description: { story: '`autoFitMin="10rem"` crea tantas columnas como quepan con 10rem de ancho mínimo. El número de columnas se adapta al ancho del contenedor.' },
    },
  },
  args: {
    autoFitMin: '10rem',
    gap: 'md',
  },
  render: (args) => (
    <JGridBagLayout {...args} className="w-full max-w-3xl">
      {['Usuarios', 'Ventas', 'Tickets', 'Riesgos', 'Alertas', 'Tareas'].map((item) => (
        <DemoCell key={item} label={item} />
      ))}
    </JGridBagLayout>
  ),
};
