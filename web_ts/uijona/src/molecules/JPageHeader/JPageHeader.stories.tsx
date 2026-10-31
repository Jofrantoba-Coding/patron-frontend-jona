import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { JPageHeader, JPAGEHEADER_DEFAULTS } from './JPageHeader';
import { JButton } from '../../atoms/JButton';
import { JTextBox } from '../../atoms/JTextBox';
import { JToolbar } from '../JToolbar';

const meta: Meta<typeof JPageHeader> = {
  title: 'Molecules/JPageHeader',
  component: JPageHeader,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'JPageHeader muestra el título de la página como encabezado (nivel 1 por defecto) que puede recibir el foco por programa (`tabIndex=-1`, `ref`). El contador va fuera del nombre del encabezado; la ruta es una navegación `Ruta` con la página actual marcada. Tiene ranuras para acciones y búsqueda.',
      },
    },
  },
  args: {
    title: 'Cliente',
    count: 134,
    breadcrumbs: [
      { id: 'maestros', label: 'Maestros' },
      { id: 'generales', label: 'Generales' },
      { id: 'cliente', label: 'Cliente' },
    ],
    onBreadcrumbSelect: fn(),
  },
  argTypes: {
    breadcrumbLabel: { control: 'text', table: { defaultValue: { summary: JPAGEHEADER_DEFAULTS.breadcrumbLabel } } },
    headingLevel: { control: { type: 'number', min: 1, max: 6 }, table: { defaultValue: { summary: '1' } } },
  },
};
export default meta;
type Story = StoryObj<typeof JPageHeader>;

export const Default: Story = {};

export const TitleOnly: Story = {
  args: { count: undefined, breadcrumbs: undefined },
};

/** The list-page composition: header, toolbar and filter. */
export const ListPage: Story = {
  args: {
    actions: <JButton variant="outline" density="auto">Exportar</JButton>,
    search: <JTextBox aria-label="Filtro" placeholder="Filtro" />,
  },
  render: (args) => (
    <div className="flex flex-col gap-3">
      <JPageHeader {...args} />
      <JToolbar
        ariaLabel="Acciones"
        onAction={fn()}
        items={[
          { id: 'add', label: 'Agregar', tone: 'primary', shortcut: 'Alt+A' },
          { id: 'edit', label: 'Modificar', disabled: true, disabledReason: 'Seleccione un registro' },
        ]}
      />
    </div>
  ),
};
