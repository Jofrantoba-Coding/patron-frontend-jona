import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { useState } from 'react';
import { JComboBox, JCOMBOBOX_DEFAULTS } from './JComboBox';
import { JPanel } from '../JPanel/JPanel';
import { JLabel } from '../JLabel';

const options = [
  { value: 'mx', label: 'México' },
  { value: 'co', label: 'Colombia' },
  { value: 'ar', label: 'Argentina' },
  { value: 'pe', label: 'Perú' },
  { value: 'cl', label: 'Chile', disabled: true },
];

const groups = [
  {
    label: 'América del Norte',
    options: [
      { value: 'mx', label: 'México' },
      { value: 'us', label: 'Estados Unidos' },
      { value: 'ca', label: 'Canadá' },
    ],
  },
  {
    label: 'América del Sur',
    options: [
      { value: 'co', label: 'Colombia' },
      { value: 'ar', label: 'Argentina' },
      { value: 'pe', label: 'Perú' },
    ],
  },
];

const meta: Meta<typeof JComboBox> = {
  title: 'Atoms/JComboBox',
  component: JComboBox,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'JComboBox es el atom de lista desplegable (select nativo) de JONA. Soporta opciones planas y agrupadas con `<optgroup>`, opciones deshabilitadas, 2 variantes visuales y 3 tamaños. El evento `onChange(value, event)` sigue el patrón JONA con el valor primero.',
      },
    },
  },
  args: { onChange: fn(), onBlur: fn() },
  argTypes: {
    options: {
      description: 'Array de opciones planas `{ value, label, disabled? }`. Usar `groups` para opciones agrupadas. No usar ambas a la vez.',
      table: { type: { summary: 'JComboBoxOption[]' } },
    },
    groups: {
      description: 'Array de grupos `{ label, options[] }`. Renderiza `<optgroup>`. No usar junto con `options`.',
      table: { type: { summary: 'JComboBoxGroup[]' } },
    },
    placeholder: {
      description: 'Texto de la opción vacía inicial. Si no se define, el select no tiene opción vacía.',
      control: 'text',
      table: { type: { summary: 'string' } },
    },
    value: {
      description: 'Valor controlado. Combinar con `onChange` para modo controlado.',
      control: 'text',
      table: { type: { summary: 'string' } },
    },
    size: {
      description: 'Altura del select. `sm`=pequeño, `md`=mediano (default), `lg`=grande.',
      control: 'select',
      options: ['sm', 'md', 'lg'],
      table: {
        type: { summary: 'JComboBoxSize' },
        defaultValue: { summary: JCOMBOBOX_DEFAULTS.size },
      },
    },
    variant: {
      description: 'Estilo visual. `default` fondo blanco con borde neutral, `filled` fondo neutro claro con borde suave.',
      control: 'select',
      options: ['default', 'filled'],
      table: {
        type: { summary: 'JComboBoxVariant' },
        defaultValue: { summary: JCOMBOBOX_DEFAULTS.variant },
      },
    },
    hasError: {
      description: 'Estado de error. Cambia el color del borde a rojo.',
      control: 'boolean',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: String(JCOMBOBOX_DEFAULTS.hasError) },
      },
    },
    disabled: {
      description: 'Bloquea toda selección y aplica estilos deshabilitados.',
      control: 'boolean',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: String(JCOMBOBOX_DEFAULTS.disabled) },
      },
    },
    onChange: {
      description: 'Callback al cambiar la selección. Patrón JONA: primer argumento es el `value` (string), segundo es el evento nativo.',
      table: { type: { summary: '(value: string, event: ChangeEvent) => void' } },
    },
  },
};
export default meta;
type Story = StoryObj<typeof JComboBox>;

export const Default: Story = {
  args: { options, placeholder: 'Selecciona un país' },
  parameters: {
    docs: {
      description: { story: 'ComboBox básico con opciones planas y placeholder. La opción vacía permite deseleccionar.' },
    },
  },
};

export const WithGroups: Story = {
  args: { groups, placeholder: 'Selecciona un país' },
  parameters: {
    docs: {
      description: { story: 'Opciones organizadas en grupos con `<optgroup>`. Usar cuando las opciones tienen categorías naturales.' },
    },
  },
};

export const WithError: Story = {
  args: { options, hasError: true, placeholder: 'Campo requerido' },
  parameters: {
    docs: {
      description: { story: '`hasError=true` aplica borde rojo. Combinar con `JLabel variant="error"` para el mensaje descriptivo.' },
    },
  },
};

export const Disabled: Story = {
  args: { options, disabled: true, placeholder: 'Deshabilitado' },
  parameters: {
    docs: {
      description: { story: '`disabled=true` bloquea la interacción. El select no abre el dropdown ni recibe foco por teclado.' },
    },
  },
};

export const Variants: Story = {
  parameters: {
    docs: {
      description: { story: 'Las 2 variantes visuales. `default` para uso general, `filled` para formularios sobre fondos blancos sin borde visible.' },
    },
  },
  render: () => (
    <JPanel gap="md" className="w-64">
      {(['default', 'filled'] as const).map((v) => (
        <JPanel key={v} gap="xs">
          <JLabel size="xs" color="muted">{v}</JLabel>
          <JComboBox options={options} variant={v} placeholder={`Variante ${v}`} />
        </JPanel>
      ))}
    </JPanel>
  ),
};

export const Sizes: Story = {
  parameters: {
    docs: {
      description: { story: 'Los 3 tamaños disponibles. `md` es el default. `sm` para filtros dentro de tablas.' },
    },
  },
  render: () => (
    <JPanel gap="md" className="w-64">
      {(['sm', 'md', 'lg'] as const).map((s) => (
        <JPanel key={s} gap="xs">
          <JLabel size="xs" color="muted">{s}</JLabel>
          <JComboBox options={options} size={s} placeholder={`Tamaño ${s}`} />
        </JPanel>
      ))}
    </JPanel>
  ),
};

export const WithDisabledOption: Story = {
  args: { options, placeholder: 'Chile está deshabilitado' },
  parameters: {
    docs: {
      description: { story: 'Opciones individuales con `disabled: true` en el objeto de opción. Útil para opciones no disponibles en el contexto actual.' },
    },
  },
};

export const Interactive: Story = {
  parameters: {
    docs: {
      description: { story: 'Modo controlado. `onChange` recibe el `value` primero (patrón JONA). El padre actualiza el estado y puede reaccionar a la selección.' },
      source: {
        code: `const [country, setCountry] = useState('');

<JComboBox
  options={options}
  placeholder="Selecciona un país"
  onChange={(v) => setCountry(v)}
/>`,
      },
    },
  },
  render: (args) => {
    const [country, setCountry] = useState('');
    return (
      <JPanel gap="sm" className="w-64">
        <JComboBox
          options={options}
          placeholder="Selecciona un país"
          onChange={(v, e) => { args.onChange?.(v, e); setCountry(v); }}
        />
        {country && (
          <JLabel size="sm" className="text-neutral-600">
            País: <strong>{options.find((o) => o.value === country)?.label}</strong>
          </JLabel>
        )}
      </JPanel>
    );
  },
};
