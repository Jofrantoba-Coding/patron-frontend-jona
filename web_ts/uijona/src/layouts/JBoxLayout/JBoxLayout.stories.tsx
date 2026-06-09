import type { Meta, StoryObj } from '@storybook/react';
import { JBoxLayout, JBOX_LAYOUT_DEFAULTS } from './JBoxLayout';
import { JPanel } from '../../atoms/JPanel/JPanel';
import { JLabel } from '../../atoms/JLabel';

const meta: Meta<typeof JBoxLayout> = {
  title: 'Layouts/JBoxLayout',
  component: JBoxLayout,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'JBoxLayout es el layout de caja flexible de JONA. Envuelve JPanel con `layout="box"` (flex container) para apilar elementos en columna o fila con alineación y espaciado declarativos. Usar cuando se necesita un flex container semántico con nombre explícito. Para composición ad-hoc dentro de otro componente, preferir JPanel directamente.',
      },
    },
  },
  argTypes: {
    direction: {
      description: 'Dirección del eje principal. `column` apila verticalmente (default), `row` alinea horizontalmente.',
      control: 'radio',
      options: ['row', 'column'],
      table: {
        type: { summary: '"row" | "column"' },
        defaultValue: { summary: JBOX_LAYOUT_DEFAULTS.direction },
      },
    },
    gap: {
      description: 'Espacio entre elementos. `none` sin espacio, `xs` 4px, `sm` 8px, `md` 16px (default), `lg` 24px, `xl` 32px.',
      control: 'select',
      options: ['none', 'xs', 'sm', 'md', 'lg', 'xl'],
      table: {
        type: { summary: 'JPanelGap' },
        defaultValue: { summary: JBOX_LAYOUT_DEFAULTS.gap },
      },
    },
    alignItems: {
      description: 'Alineación en el eje transversal. `stretch` estira los hijos al tamaño completo (default), `center` centra, `start` alinea al inicio, `end` al final, `baseline` alinea por la línea de texto.',
      control: 'select',
      options: ['start', 'center', 'end', 'stretch', 'baseline'],
      table: {
        type: { summary: 'JPanelAlign' },
        defaultValue: { summary: JBOX_LAYOUT_DEFAULTS.alignItems },
      },
    },
    justifyContent: {
      description: 'Distribución en el eje principal. `start` (default) agrupa al inicio, `center` centra, `end` agrupa al final, `between` espacia uniformemente entre elementos, `around` con espacio en los extremos, `evenly` espacio igual en todos lados.',
      control: 'select',
      options: ['start', 'center', 'end', 'between', 'around', 'evenly'],
      table: {
        type: { summary: 'JPanelJustify' },
        defaultValue: { summary: JBOX_LAYOUT_DEFAULTS.justifyContent },
      },
    },
    wrap: {
      description: 'Comportamiento al desbordarse. `nowrap` (default) no envuelve, `wrap` envuelve a la siguiente línea, `reverse` envuelve en dirección inversa.',
      control: 'select',
      options: ['nowrap', 'wrap', 'reverse'],
      table: {
        type: { summary: '"nowrap" | "wrap" | "reverse"' },
        defaultValue: { summary: String(JBOX_LAYOUT_DEFAULTS.wrap) },
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof JBoxLayout>;

const Item = ({ label }: { label: string }) => (
  <JPanel variant="outlined" padding="sm" radius="md" className="text-sm text-neutral-700 text-center">
    {label}
  </JPanel>
);

export const Column: Story = {
  name: 'Column (default)',
  parameters: {
    docs: {
      description: { story: 'Dirección `column` (default): elementos apilados verticalmente. Playground interactivo para explorar todas las props.' },
    },
  },
  render: (args) => (
    <JBoxLayout {...args} className="w-full max-w-xs">
      <Item label="Primero" />
      <Item label="Segundo" />
      <Item label="Tercero" />
    </JBoxLayout>
  ),
};

export const Row: Story = {
  name: 'Row (sin wrap)',
  parameters: {
    docs: {
      description: { story: 'Dirección `row`: elementos en fila. `alignItems="center"` alinea verticalmente al centro.' },
    },
  },
  render: (args) => (
    <JBoxLayout {...args} direction="row" alignItems="center" className="w-full">
      <Item label="Inicio" />
      <Item label="Centro" />
      <Item label="Fin" />
    </JBoxLayout>
  ),
};

export const RowSpaceBetween: Story = {
  name: 'Row · space between',
  parameters: {
    docs: {
      description: { story: '`justifyContent="between"` distribuye el espacio entre los grupos. Patrón de navbar: logo a la izquierda, links a la derecha.' },
    },
  },
  render: () => (
    <JBoxLayout direction="row" justifyContent="between" alignItems="center" className="w-full">
      <JLabel size="sm" className="font-semibold">JONA UI</JLabel>
      <JBoxLayout direction="row" gap="sm">
        <Item label="Inicio" />
        <Item label="Acerca" />
        <Item label="Contacto" />
      </JBoxLayout>
    </JBoxLayout>
  ),
};

export const ColumnCentrado: Story = {
  name: 'Column centrado',
  parameters: {
    docs: {
      description: { story: '`alignItems="center"` + `justifyContent="center"` centra el contenido en ambos ejes. Patrón para páginas de error, empty states o hero sections.' },
    },
  },
  render: () => (
    <JBoxLayout direction="column" alignItems="center" justifyContent="center" gap="sm" className="w-full min-h-48">
      <Item label="Título" />
      <Item label="Subtítulo" />
      <Item label="Acción" />
    </JBoxLayout>
  ),
};
