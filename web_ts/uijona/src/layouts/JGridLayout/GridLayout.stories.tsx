import type { Meta, StoryObj } from '@storybook/react';
import { JGridLayout, GRID_LAYOUT_DEFAULTS } from './GridLayout';
import { JPanel } from '../../atoms/JPanel/JPanel';
import { JLabel } from '../../atoms/JLabel';

const meta: Meta<typeof JGridLayout> = {
  title: 'Layouts/JGridLayout',
  component: JGridLayout,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'JGridLayout es el layout de cuadrícula de JONA. Implementa CSS Grid para disposición en rejilla. A diferencia de JGridBagLayout, no expone control de span por celda — todos los hijos ocupan una celda. Soporta modo `responsive` (columnas adaptativas con `autoFitMin`) y `fixed` (columnas explícitas con `columns`). Ideal para galería de cards, grillas de métricas y formularios multi-columna.',
      },
    },
  },
  argTypes: {
    gap: {
      description: 'Espacio entre celdas del grid. `none`, `xs` 4px, `sm` 8px, `md` 16px (default), `lg` 24px, `xl` 32px.',
      control: 'select',
      options: ['none', 'xs', 'sm', 'md', 'lg', 'xl'],
      table: {
        type: { summary: 'JPanelGap' },
        defaultValue: { summary: GRID_LAYOUT_DEFAULTS.gap },
      },
    },
    columns: {
      description: 'Número de columnas o string CSS válido. Ejemplo: `3`, `"repeat(4, minmax(0, 1fr))"`. En modo `responsive` se ignora.',
      control: 'text',
      table: { type: { summary: 'number | string' } },
    },
    rows: {
      description: 'Definición de filas. String CSS: `"auto 1fr auto"`. Raramente necesario — el grid calcula las filas automáticamente.',
      control: 'text',
      table: { type: { summary: 'number | string' } },
    },
    autoFitMin: {
      description: 'Ancho mínimo de columna en modo `responsive`. El grid crea el máximo de columnas que quepan con ese ancho mínimo. Default `12rem`.',
      control: 'text',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: GRID_LAYOUT_DEFAULTS.autoFitMin },
      },
    },
    placement: {
      description: '`responsive` usa `autoFitMin` para columnas adaptativas (default). `fixed` usa el valor de `columns` de forma estática.',
      control: 'select',
      options: ['responsive', 'fixed'],
      table: {
        type: { summary: '"responsive" | "fixed"' },
        defaultValue: { summary: GRID_LAYOUT_DEFAULTS.placement },
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof JGridLayout>;

const DemoItem = ({ label }: { label: string }) => (
  <JPanel variant="flat" padding="md" className="text-center text-sm font-medium text-neutral-700">
    {label}
  </JPanel>
);

export const FixedColumns: Story = {
  name: 'Columnas fijas',
  parameters: {
    docs: {
      description: { story: '`columns=3` crea 3 columnas de igual ancho. Los hijos se distribuyen automáticamente en filas.' },
    },
  },
  args: { columns: 3, gap: 'sm', placement: 'responsive' },
  render: (args) => (
    <JGridLayout {...args} className="w-full max-w-xl">
      {['A1', 'A2', 'A3', 'B1', 'B2', 'B3'].map((item) => (
        <DemoItem key={item} label={item} />
      ))}
    </JGridLayout>
  ),
};

export const ResponsiveAutoFit: Story = {
  name: 'Auto-fit responsivo',
  parameters: {
    docs: {
      description: { story: '`autoFitMin="9rem"` crea columnas de mínimo 9rem. En pantalla ancha hay 4-5 columnas; en móvil colapsa a 1-2. Sin necesidad de breakpoints manuales.' },
    },
  },
  args: { autoFitMin: '9rem', gap: 'md' },
  render: (args) => (
    <JGridLayout {...args} className="w-full max-w-2xl">
      {['Usuarios', 'Ventas', 'Tickets', 'Riesgos', 'Alertas', 'Tareas'].map((item) => (
        <DemoItem key={item} label={item} />
      ))}
    </JGridLayout>
  ),
};

export const GaleriaDeCards: Story = {
  name: 'Galería de cards',
  parameters: {
    docs: {
      description: { story: 'Caso de uso típico: galería de cards responsiva con `autoFitMin`. Las cards se reorganizan automáticamente según el ancho disponible.' },
    },
  },
  render: () => (
    <JGridLayout autoFitMin="12rem" gap="md" className="w-full max-w-3xl">
      {['Dashboard', 'Usuarios', 'Reportes', 'Configuración', 'Alertas', 'Integraciones'].map((item) => (
        <JPanel key={item} variant="outlined" padding="md" radius="md" className="min-h-24">
          <JLabel size="sm" className="font-semibold text-neutral-800">{item}</JLabel>
          <JLabel size="xs" color="muted" className="mt-1">Sección de {item.toLowerCase()}</JLabel>
        </JPanel>
      ))}
    </JGridLayout>
  ),
};
