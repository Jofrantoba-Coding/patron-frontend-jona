import type { Meta, StoryObj } from '@storybook/react';
import { JInputGroup, JINPUTGROUP_DEFAULTS, JINPUTGROUP_LOOKUP_COLUMNS } from './JInputGroup';
import { JTextBox } from '../../atoms/JTextBox';
import { JButton } from '../../atoms/JButton';

const SearchIcon = () => (
  <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
    <circle cx="11" cy="11" r="7" />
    <line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
);

const ClearIcon = () => (
  <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
    <line x1="6" y1="6" x2="18" y2="18" />
    <line x1="18" y1="6" x2="6" y2="18" />
  </svg>
);

const meta: Meta<typeof JInputGroup> = {
  title: 'Molecules/JInputGroup',
  component: JInputGroup,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'JInputGroup une controles y complementos en un `role="group"` con nombre. El preset `lookup` muestra código, descripción y acciones en una fila desde 640 px (`' +
          JINPUTGROUP_LOOKUP_COLUMNS +
          '`, alineados abajo) y los apila por debajo. `columns` cambia la plantilla mediante una variable CSS.',
      },
    },
  },
  argTypes: {
    preset: { control: 'inline-radio', options: ['default', 'lookup'], table: { defaultValue: { summary: JINPUTGROUP_DEFAULTS.preset } } },
    columns: { control: 'text' },
  },
};
export default meta;
type Story = StoryObj<typeof JInputGroup>;

export const Default: Story = {
  args: {
    ariaLabel: 'Precio',
    addonStart: <span className="text-sm">S/</span>,
    children: <JTextBox aria-label="Monto" placeholder="0.00" />,
  },
};

export const Lookup: Story = {
  args: {
    ariaLabel: 'Transportista',
    preset: 'lookup',
    children: (
      <>
        <JTextBox aria-label="Código de Transportista" placeholder="Código" />
        <JTextBox aria-label="Descripción de Transportista" placeholder="Descripción" readOnly value="TRANSPORTES DEL SUR SAC" />
      </>
    ),
    addonEnd: (
      <>
        <JButton variant="outline" size="icon" aria-label="Buscar Transportista"><SearchIcon /></JButton>
        <JButton variant="ghost" size="icon" aria-label="Limpiar Transportista"><ClearIcon /></JButton>
      </>
    ),
  },
};

export const LookupInvalid: Story = {
  args: { ...Lookup.args, invalid: true },
};
