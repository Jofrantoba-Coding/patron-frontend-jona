import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { useState } from 'react';
import { JRadioButton, JRADIOBUTTON_DEFAULTS } from './JRadioButton';
import { JLabel } from '../JLabel';
import { JPanel } from '../JPanel/JPanel';

const meta: Meta<typeof JRadioButton> = {
  title: 'Atoms/JRadioButton',
  component: JRadioButton,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'JRadioButton es el atom de botón de radio de JONA. Para grupos de opciones mutuamente excluyentes, todos los radios del grupo deben compartir el mismo `name`. El callback `onCheckedChange(checked, value, event)` sigue el patrón JONA con los valores primero.',
      },
    },
  },
  args: { onCheckedChange: fn(), onFocus: fn(), onBlur: fn() },
  argTypes: {
    checked: {
      description: 'Estado controlado de selección. Combinar con `onCheckedChange` para modo controlado. El grupo de radios debe gestionarse en el padre.',
      control: 'boolean',
      table: { type: { summary: 'boolean' } },
    },
    hasError: {
      description: 'Estado de error. Cambia el color del borde a rojo. Aplicar al grupo completo, no a un radio individual.',
      control: 'boolean',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: String(JRADIOBUTTON_DEFAULTS.hasError) },
      },
    },
    disabled: {
      description: 'Bloquea toda interacción. El click en el label tampoco funciona.',
      control: 'boolean',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: String(JRADIOBUTTON_DEFAULTS.disabled) },
      },
    },
    label: {
      description: 'Texto de etiqueta integrado. El click en el label activa el radio.',
      control: 'text',
      table: { type: { summary: 'string' } },
    },
    labelPosition: {
      description: 'Posición del label relativa al radio. `right` es el estándar occidental.',
      control: 'select',
      options: ['right', 'left', 'top', 'bottom'],
      table: {
        type: { summary: 'JRadioButtonLabelPosition' },
        defaultValue: { summary: JRADIOBUTTON_DEFAULTS.labelPosition },
      },
    },
    name: {
      description: 'Nombre del grupo de radios. Todos los radios del mismo grupo deben compartir el mismo `name`. El navegador gestiona la exclusividad.',
      control: 'text',
      table: { type: { summary: 'string' } },
    },
    value: {
      description: 'Valor del radio. Recibido en `onCheckedChange` como segundo argumento cuando se selecciona.',
      control: 'text',
      table: { type: { summary: 'string' } },
    },
    onCheckedChange: {
      description: 'Callback al seleccionar. Patrón JONA: primer argumento `checked` (boolean), segundo `value` (string), tercero el evento nativo.',
      table: { type: { summary: '(checked: boolean, value: string, event: ChangeEvent) => void' } },
    },
  },
};
export default meta;
type Story = StoryObj<typeof JRadioButton>;

export const Default: Story = {
  args: { name: 'radio-default', value: 'default' },
  parameters: {
    docs: {
      description: { story: 'Radio sin label en estado no controlado.' },
    },
  },
};

export const Checked: Story = {
  args: { name: 'radio-checked', value: 'checked', checked: true },
  parameters: {
    docs: {
      description: { story: 'Estado seleccionado controlado.' },
    },
  },
};

export const WithLabelRight: Story = {
  args: { name: 'r1', value: 'a', label: 'Opción A', labelPosition: 'right' },
  parameters: {
    docs: {
      description: { story: 'Label a la derecha, posición estándar (default). El click en el label activa el radio.' },
    },
  },
};

export const WithLabelLeft: Story = {
  args: { name: 'r2', value: 'b', label: 'Opción B', labelPosition: 'left' },
  parameters: {
    docs: {
      description: { story: 'Label a la izquierda.' },
    },
  },
};

export const WithLabelTop: Story = {
  args: { name: 'r3', value: 'c', label: 'Arriba', labelPosition: 'top' },
  parameters: {
    docs: {
      description: { story: 'Label sobre el radio. Para layouts de iconos con etiqueta.' },
    },
  },
};

export const WithLabelBottom: Story = {
  args: { name: 'r4', value: 'd', label: 'Abajo', labelPosition: 'bottom' },
  parameters: {
    docs: {
      description: { story: 'Label debajo del radio.' },
    },
  },
};

export const LabelPositions: Story = {
  parameters: {
    docs: {
      description: { story: 'Comparación de las 4 posiciones de label.' },
    },
  },
  render: () => (
    <JPanel layout="grid" columns={2} gap="lg" className="p-4">
      <JPanel gap="xs" alignItems="center">
        <JLabel size="xs" color="muted">right (default)</JLabel>
        <JRadioButton name="pos" value="right" label="Opción A" labelPosition="right" />
      </JPanel>
      <JPanel gap="xs" alignItems="center">
        <JLabel size="xs" color="muted">left</JLabel>
        <JRadioButton name="pos" value="left" label="Opción B" labelPosition="left" />
      </JPanel>
      <JPanel gap="xs" alignItems="center">
        <JLabel size="xs" color="muted">top</JLabel>
        <JRadioButton name="pos" value="top" label="Opción C" labelPosition="top" />
      </JPanel>
      <JPanel gap="xs" alignItems="center">
        <JLabel size="xs" color="muted">bottom</JLabel>
        <JRadioButton name="pos" value="bottom" label="Opción D" labelPosition="bottom" />
      </JPanel>
    </JPanel>
  ),
};

export const WithError: Story = {
  args: { name: 'radio-error', value: 'error', hasError: true, label: 'Campo requerido' },
  parameters: {
    docs: {
      description: { story: 'Estado de error. Aplicar a todos los radios del grupo al mismo tiempo.' },
    },
  },
};

export const Disabled: Story = {
  args: { name: 'radio-disabled', value: 'disabled', disabled: true, label: 'No disponible' },
  parameters: {
    docs: {
      description: { story: 'Estado deshabilitado. El radio no recibe foco ni click.' },
    },
  },
};

export const Interactive: Story = {
  parameters: {
    docs: {
      description: { story: 'Grupo de radios con estado controlado. El padre gestiona cuál está seleccionado usando el `value` del callback.' },
    },
  },
  args: { onCheckedChange: fn() },
  render: (args) => {
    const [selected, setSelected] = useState('');
    const methods = [
      { value: 'card',     label: 'Tarjeta de crédito' },
      { value: 'transfer', label: 'Transferencia bancaria' },
      { value: 'paypal',   label: 'PayPal' },
    ];
    return (
      <JPanel gap="sm">
        <JLabel size="sm" className="font-medium text-neutral-700">Método de pago</JLabel>
        {methods.map((m) => (
          <JRadioButton
            key={m.value}
            name="payment"
            value={m.value}
            label={m.label}
            labelPosition="right"
            checked={selected === m.value}
            onCheckedChange={(checked, value, e) => { args.onCheckedChange?.(checked, value, e); setSelected(m.value); }}
          />
        ))}
        {selected && (
          <JLabel size="xs" color="muted" className="mt-1">
            Elegido: <strong>{methods.find((m) => m.value === selected)?.label}</strong>
          </JLabel>
        )}
      </JPanel>
    );
  },
};
