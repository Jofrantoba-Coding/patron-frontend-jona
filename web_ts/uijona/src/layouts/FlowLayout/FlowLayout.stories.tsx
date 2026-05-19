import type { Meta, StoryObj } from '@storybook/react';
import { FlowLayout } from './FlowLayout';
import { JPanel } from '../../atoms/JPanel/JPanel';
import { JLabel } from '../../atoms/JLabel';
import { JButton } from '../../atoms/JButton/JButton';
import { JChip } from '../../atoms/JChip/JChip';

const meta: Meta<typeof FlowLayout> = {
  title: 'Layouts/FlowLayout',
  component: FlowLayout,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
  argTypes: {
    gap: {
      control: 'select',
      options: ['none', 'xs', 'sm', 'md', 'lg', 'xl'],
    },
    alignItems: {
      control: 'select',
      options: ['start', 'center', 'end', 'stretch', 'baseline'],
    },
    justifyContent: {
      control: 'select',
      options: ['start', 'center', 'end', 'between', 'around', 'evenly'],
    },
    wrap: {
      control: 'select',
      options: ['nowrap', 'wrap', 'reverse'],
    },
  },
};

export default meta;
type Story = StoryObj<typeof FlowLayout>;

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
  render: (args) => (
    <JPanel variant="outlined" padding="sm" radius="md" className="w-80">
      <FlowLayout {...args} gap="sm">
        {['Uno', 'Dos', 'Tres', 'Cuatro', 'Cinco', 'Seis', 'Siete', 'Ocho'].map((item) => (
          <Box key={item} label={item} />
        ))}
      </FlowLayout>
    </JPanel>
  ),
};

export const NoWrap: Story = {
  name: 'Sin wrap (scroll horizontal)',
  render: (args) => (
    <JPanel variant="outlined" padding="sm" radius="md" className="w-80 overflow-x-auto">
      <FlowLayout {...args} gap="sm" wrap="nowrap">
        {['Uno', 'Dos', 'Tres', 'Cuatro', 'Cinco', 'Seis', 'Siete', 'Ocho'].map((item) => (
          <Box key={item} label={item} />
        ))}
      </FlowLayout>
    </JPanel>
  ),
};

export const ChipsFluyendo: Story = {
  name: 'Chips fluyendo',
  render: () => (
    <JPanel variant="outlined" padding="md" radius="md" className="w-80">
      <FlowLayout gap="xs">
        {[
          'React', 'TypeScript', 'Tailwind', 'Storybook', 'Vite',
          'ESLint', 'Prettier', 'Vitest', 'Node', 'Git',
        ].map((tag) => (
          <JChip key={tag}>{tag}</JChip>
        ))}
      </FlowLayout>
    </JPanel>
  ),
};

export const BotonesFluyendo: Story = {
  name: 'Botones fluyendo',
  render: () => (
    <JPanel variant="outlined" padding="md" radius="md" className="w-96">
      <FlowLayout gap="sm" alignItems="center">
        <JButton size="sm" variant="default">Guardar</JButton>
        <JButton size="sm" variant="outline">Cancelar</JButton>
        <JButton size="sm" variant="outline">Vista previa</JButton>
        <JButton size="sm" variant="ghost">Exportar PDF</JButton>
        <JButton size="sm" variant="ghost">Exportar Excel</JButton>
        <JButton size="sm" variant="destructive">Eliminar</JButton>
      </FlowLayout>
    </JPanel>
  ),
};

export const ItemsDeDistintoTamano: Story = {
  name: 'Items de distinto tamaño',
  render: () => (
    <JPanel variant="outlined" padding="sm" radius="md" className="w-96">
      <FlowLayout gap="sm" alignItems="start">
        <Box label="Corto" />
        <Box label="Más largo" wide />
        <Box label="A" />
        <Box label="Mediano" />
        <Box label="Largo también" wide />
        <Box label="B" />
        <Box label="C" />
        <Box label="Normal" />
      </FlowLayout>
    </JPanel>
  ),
};

export const JustificadoCentro: Story = {
  name: 'Centrado',
  render: (args) => (
    <JPanel variant="outlined" padding="sm" radius="md" className="w-96">
      <FlowLayout {...args} gap="sm" justifyContent="center">
        {['Uno', 'Dos', 'Tres', 'Cuatro', 'Cinco'].map((item) => (
          <Box key={item} label={item} />
        ))}
      </FlowLayout>
    </JPanel>
  ),
};

export const Etiquetas: Story = {
  name: 'Etiquetas de texto',
  render: () => (
    <JPanel variant="outlined" padding="md" radius="md" className="w-80">
      <FlowLayout gap="xs" alignItems="center">
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
      </FlowLayout>
    </JPanel>
  ),
};
