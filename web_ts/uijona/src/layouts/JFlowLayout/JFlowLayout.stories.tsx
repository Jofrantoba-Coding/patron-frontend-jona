import type { Meta, StoryObj } from '@storybook/react';
import { JFlowLayout, JFLOW_LAYOUT_DEFAULTS } from './JFlowLayout';
import { JPanel } from '../../atoms/JPanel/JPanel';
import { JLabel } from '../../atoms/JLabel';
import { JButton } from '../../atoms/JButton/JButton';
import { JChip } from '../../atoms/JChip/JChip';

const meta: Meta<typeof JFlowLayout> = {
  title: 'Layouts/JFlowLayout',
  component: JFlowLayout,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'JFlowLayout es el layout de flujo de JONA. Organiza elementos en una fila que se envuelve automáticamente (`flex-wrap: wrap`) al desbordarse el contenedor. Ideal para chips, tags, botones de acción y cualquier colección de elementos de tamaño variable. Equivale a JPanel con `layout="flow"` pero con nombre semántico explícito.',
      },
    },
  },
  argTypes: {
    gap: {
      description: 'Espacio entre elementos. `none`, `xs` 4px, `sm` 8px, `md` 16px (default), `lg` 24px, `xl` 32px.',
      control: 'select',
      options: ['none', 'xs', 'sm', 'md', 'lg', 'xl'],
      table: {
        type: { summary: 'JPanelGap' },
        defaultValue: { summary: JFLOW_LAYOUT_DEFAULTS.gap },
      },
    },
    alignItems: {
      description: 'Alineación vertical de los elementos dentro de cada fila. `stretch` (default) estira al alto de la fila, `center` centra verticalmente, `start` alinea arriba, `end` abajo, `baseline` por línea de texto.',
      control: 'select',
      options: ['start', 'center', 'end', 'stretch', 'baseline'],
      table: {
        type: { summary: 'JPanelAlign' },
        defaultValue: { summary: JFLOW_LAYOUT_DEFAULTS.alignItems },
      },
    },
    justifyContent: {
      description: 'Distribución horizontal de los elementos dentro de cada fila. `start` agrupa a la izquierda (default), `center` centra, `end` agrupa a la derecha, `between` espacia entre elementos.',
      control: 'select',
      options: ['start', 'center', 'end', 'between', 'around', 'evenly'],
      table: {
        type: { summary: 'JPanelJustify' },
        defaultValue: { summary: JFLOW_LAYOUT_DEFAULTS.justifyContent },
      },
    },
    wrap: {
      description: 'Comportamiento al desbordarse. `wrap` (default) envuelve a la siguiente fila, `nowrap` no envuelve (scroll horizontal), `reverse` envuelve en dirección inversa.',
      control: 'select',
      options: ['nowrap', 'wrap', 'reverse'],
      table: {
        type: { summary: '"nowrap" | "wrap" | "reverse"' },
        defaultValue: { summary: String(JFLOW_LAYOUT_DEFAULTS.wrap) },
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof JFlowLayout>;

const Box = ({ label, wide }: { label: string; wide?: boolean }) => (
  <JPanel
    variant="flat"
    padding="sm"
    radius="md"
    className={`text-center text-sm font-medium text-neutral-700 ${wide ? 'w-36' : 'w-24'}`}
  >
    {label}
  </JPanel>
);

export const WrapAlDesbordarse: Story = {
  name: 'Wrap al desbordarse',
  parameters: {
    docs: {
      description: { story: '`wrap="wrap"` (default) envuelve los elementos cuando no caben en una fila. Reducir la ventana para ver el comportamiento.' },
    },
  },
  render: (args) => (
    <JPanel variant="outlined" padding="sm" radius="md" className="w-80">
      <JFlowLayout {...args} gap="sm">
        {['Uno', 'Dos', 'Tres', 'Cuatro', 'Cinco', 'Seis', 'Siete', 'Ocho'].map((item) => (
          <Box key={item} label={item} />
        ))}
      </JFlowLayout>
    </JPanel>
  ),
};

export const NoWrap: Story = {
  name: 'Sin wrap (scroll horizontal)',
  parameters: {
    docs: {
      description: { story: '`wrap="nowrap"` mantiene todos los elementos en una sola fila. El contenedor padre debe tener `overflow-x-auto` para que el usuario pueda desplazarse.' },
    },
  },
  render: (args) => (
    <JPanel variant="outlined" padding="sm" radius="md" className="w-80 overflow-x-auto">
      <JFlowLayout {...args} gap="sm" wrap="nowrap">
        {['Uno', 'Dos', 'Tres', 'Cuatro', 'Cinco', 'Seis', 'Siete', 'Ocho'].map((item) => (
          <Box key={item} label={item} />
        ))}
      </JFlowLayout>
    </JPanel>
  ),
};

export const ChipsFluyendo: Story = {
  name: 'Chips fluyendo',
  parameters: {
    docs: {
      description: { story: 'Caso de uso principal de JFlowLayout: chips/tags que se envuelven automáticamente. `gap="xs"` da espaciado compacto.' },
    },
  },
  render: () => (
    <JPanel variant="outlined" padding="md" radius="md" className="w-80">
      <JFlowLayout gap="xs">
        {[
          'React', 'TypeScript', 'Tailwind', 'Storybook', 'Vite',
          'ESLint', 'Prettier', 'Vitest', 'Node', 'Git',
        ].map((tag) => (
          <JChip key={tag}>{tag}</JChip>
        ))}
      </JFlowLayout>
    </JPanel>
  ),
};

export const BotonesFluyendo: Story = {
  name: 'Botones fluyendo',
  parameters: {
    docs: {
      description: { story: 'Grupo de acciones que se reorganizan al reducir el ancho. Preferir este patrón a un toolbar rígido para toolbars responsivos.' },
    },
  },
  render: () => (
    <JPanel variant="outlined" padding="md" radius="md" className="w-96">
      <JFlowLayout gap="sm" alignItems="center">
        <JButton size="sm" variant="default">Guardar</JButton>
        <JButton size="sm" variant="outline">Cancelar</JButton>
        <JButton size="sm" variant="outline">Vista previa</JButton>
        <JButton size="sm" variant="ghost">Exportar PDF</JButton>
        <JButton size="sm" variant="ghost">Exportar Excel</JButton>
        <JButton size="sm" variant="destructive">Eliminar</JButton>
      </JFlowLayout>
    </JPanel>
  ),
};

export const ItemsDeDistintoTamano: Story = {
  name: 'Items de distinto tamaño',
  parameters: {
    docs: {
      description: { story: 'El wrap se adapta al tamaño real de cada elemento. Elementos más anchos ocupan más espacio en la fila y desplazan los siguientes.' },
    },
  },
  render: () => (
    <JPanel variant="outlined" padding="sm" radius="md" className="w-96">
      <JFlowLayout gap="sm" alignItems="start">
        <Box label="Corto" />
        <Box label="Más largo" wide />
        <Box label="A" />
        <Box label="Mediano" />
        <Box label="Largo también" wide />
        <Box label="B" />
        <Box label="C" />
        <Box label="Normal" />
      </JFlowLayout>
    </JPanel>
  ),
};

export const JustificadoCentro: Story = {
  name: 'Centrado',
  parameters: {
    docs: {
      description: { story: '`justifyContent="center"` centra los elementos dentro de cada fila. Útil para galerías de chips o banners de categorías.' },
    },
  },
  render: (args) => (
    <JPanel variant="outlined" padding="sm" radius="md" className="w-96">
      <JFlowLayout {...args} gap="sm" justifyContent="center">
        {['Uno', 'Dos', 'Tres', 'Cuatro', 'Cinco'].map((item) => (
          <Box key={item} label={item} />
        ))}
      </JFlowLayout>
    </JPanel>
  ),
};

export const Etiquetas: Story = {
  name: 'Etiquetas de texto',
  parameters: {
    docs: {
      description: { story: 'Etiquetas de departamentos con borde redondeado. Ejemplo de combinación de JFlowLayout con JPanel `radius="full"` para pills.' },
    },
  },
  render: () => (
    <JPanel variant="outlined" padding="md" radius="md" className="w-80">
      <JFlowLayout gap="xs" alignItems="center">
        {[
          'Diseño', 'Desarrollo', 'Marketing', 'Ventas',
          'Soporte', 'Operaciones', 'Recursos Humanos', 'Finanzas',
        ].map((label) => (
          <JPanel
            key={label}
            variant="outlined"
            padding="sm"
            radius="full"
            className="text-xs font-medium text-neutral-600"
          >
            <JLabel size="xs">{label}</JLabel>
          </JPanel>
        ))}
      </JFlowLayout>
    </JPanel>
  ),
};
