import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { useState } from 'react';
import { JCheckBox, JCHECKBOX_DEFAULTS } from './JCheckBox';
import { JPanel } from '../JPanel/JPanel';
import { JLabel } from '../JLabel';

const meta: Meta<typeof JCheckBox> = {
  title: 'Atoms/JCheckBox',
  component: JCheckBox,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'JCheckBox es el atom de casilla de verificación de JONA. Soporta estado indeterminado (útil para selección parcial de listas), label integrado en 4 posiciones y 3 tamaños. El evento `onCheckedChange(checked, event)` sigue el patrón JONA con el valor primero.',
      },
    },
  },
  args: { onCheckedChange: fn() },
  argTypes: {
    checked: {
      description: 'Estado controlado de la casilla. Combinar con `onCheckedChange` para modo controlado. Si no se pasa, la casilla gestiona su propio estado (no controlado).',
      control: 'boolean',
      table: { type: { summary: 'boolean' } },
    },
    indeterminate: {
      description: 'Estado intermedio: muestra un guión en lugar de la marca. Útil para selección parcial en tablas o listas agrupadas.',
      control: 'boolean',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: String(JCHECKBOX_DEFAULTS.indeterminate) },
      },
    },
    hasError: {
      description: 'Estado de error. Cambia el color del borde a rojo. Combinar con `JLabel variant="error"` para el mensaje.',
      control: 'boolean',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: String(JCHECKBOX_DEFAULTS.hasError) },
      },
    },
    disabled: {
      description: 'Bloquea toda interacción y aplica estilos deshabilitados.',
      control: 'boolean',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: String(JCHECKBOX_DEFAULTS.disabled) },
      },
    },
    size: {
      description: 'Tamaño de la casilla. `sm`=pequeño, `md`=mediano (default), `lg`=grande.',
      control: 'select',
      options: ['sm', 'md', 'lg'],
      table: {
        type: { summary: 'JCheckBoxSize' },
        defaultValue: { summary: JCHECKBOX_DEFAULTS.size },
      },
    },
    label: {
      description: 'Texto de etiqueta integrado. Alternativa a envolver en un `JLabel` externo.',
      control: 'text',
      table: { type: { summary: 'string' } },
    },
    labelPosition: {
      description: 'Posición del label relativa a la casilla. `right` es el default (patrón occidental estándar).',
      control: 'select',
      options: ['right', 'left', 'top', 'bottom'],
      table: {
        type: { summary: 'JCheckBoxLabelPosition' },
        defaultValue: { summary: JCHECKBOX_DEFAULTS.labelPosition },
      },
    },
    onCheckedChange: {
      description: 'Callback al cambiar estado. Patrón JONA: primer argumento es `checked` (boolean), segundo es el evento nativo.',
      table: { type: { summary: '(checked: boolean, event: ChangeEvent) => void' } },
    },
  },
};
export default meta;
type Story = StoryObj<typeof JCheckBox>;

export const Default: Story = {
  parameters: {
    docs: {
      description: { story: 'Casilla sin label en estado no controlado. El browser gestiona el estado interno.' },
    },
  },
};

export const Checked: Story = {
  args: { checked: true },
  parameters: {
    docs: {
      description: { story: 'Estado checked controlado. Siempre manejar con `onCheckedChange` en modo controlado.' },
    },
  },
};

export const WithLabelRight: Story = {
  args: { label: 'Acepto los términos', labelPosition: 'right' },
  parameters: {
    docs: {
      description: { story: 'Label a la derecha, posición estándar (default). El click en el label activa la casilla.' },
    },
  },
};

export const WithLabelLeft: Story = {
  args: { label: 'Acepto los términos', labelPosition: 'left' },
  parameters: {
    docs: {
      description: { story: 'Label a la izquierda. Útil para alineación derecha en formularios RTL.' },
    },
  },
};

export const WithLabelTop: Story = {
  args: { label: 'Notificaciones', labelPosition: 'top' },
  parameters: {
    docs: {
      description: { story: 'Label arriba de la casilla. Para formularios verticales compactos.' },
    },
  },
};

export const WithLabelBottom: Story = {
  args: { label: 'Notificaciones', labelPosition: 'bottom' },
  parameters: {
    docs: {
      description: { story: 'Label debajo de la casilla. Para iconos-con-etiqueta de tipo toggle.' },
    },
  },
};

export const LabelPositions: Story = {
  parameters: {
    docs: {
      description: { story: 'Comparación de las 4 posiciones de label. El click en el label activa la casilla en todas las posiciones.' },
    },
  },
  render: () => (
    <JPanel layout="grid" columns={2} gap="lg" className="p-4">
      <JPanel gap="xs" alignItems="center">
        <JLabel size="xs" color="muted">right (default)</JLabel>
        <JCheckBox label="Opción A" labelPosition="right" />
      </JPanel>
      <JPanel gap="xs" alignItems="center">
        <JLabel size="xs" color="muted">left</JLabel>
        <JCheckBox label="Opción B" labelPosition="left" />
      </JPanel>
      <JPanel gap="xs" alignItems="center">
        <JLabel size="xs" color="muted">top</JLabel>
        <JCheckBox label="Opción C" labelPosition="top" />
      </JPanel>
      <JPanel gap="xs" alignItems="center">
        <JLabel size="xs" color="muted">bottom</JLabel>
        <JCheckBox label="Opción D" labelPosition="bottom" />
      </JPanel>
    </JPanel>
  ),
};

export const Indeterminate: Story = {
  args: { indeterminate: true },
  parameters: {
    docs: {
      description: { story: 'Estado indeterminado con guión. Patrón para "seleccionar todos" cuando solo algunos ítems están marcados. Al hacer click pasa a `checked=true`.' },
    },
  },
};

export const WithError: Story = {
  args: { hasError: true, label: 'Campo requerido', labelPosition: 'right' },
  parameters: {
    docs: {
      description: { story: 'Estado de error con borde rojo. Siempre mostrar un `JLabel variant="error"` cerca para el mensaje.' },
    },
  },
};

export const Disabled: Story = {
  args: { disabled: true, label: 'No disponible', labelPosition: 'right' },
  parameters: {
    docs: {
      description: { story: 'Estado deshabilitado. El click en el label tampoco funciona.' },
    },
  },
};

export const DisabledChecked: Story = {
  args: { disabled: true, checked: true, label: 'Bloqueado', labelPosition: 'right' },
  parameters: {
    docs: {
      description: { story: 'Deshabilitado y marcado. Para valores que el usuario no puede cambiar pero debe ver confirmados.' },
    },
  },
};

export const Sizes: Story = {
  parameters: {
    docs: {
      description: { story: 'Los 3 tamaños disponibles. `md` es el default para uso general.' },
    },
  },
  render: () => (
    <JPanel layout="flow" gap="xl" alignItems="center">
      {(['sm', 'md', 'lg'] as const).map((s) => (
        <JCheckBox key={s} size={s} label={s} labelPosition="bottom" defaultChecked />
      ))}
    </JPanel>
  ),
};

export const AllStates: Story = {
  parameters: {
    docs: {
      description: { story: 'Todos los estados posibles en una vista. Útil para QA y revisión de diseño.' },
    },
  },
  render: () => (
    <JPanel gap="sm">
      {[
        { label: 'Sin seleccionar',          props: {} },
        { label: 'Seleccionado',             props: { checked: true } },
        { label: 'Indeterminado',            props: { indeterminate: true } },
        { label: 'Con error',                props: { hasError: true } },
        { label: 'Deshabilitado',            props: { disabled: true } },
        { label: 'Deshabilitado + checked',  props: { disabled: true, checked: true } },
      ].map(({ label, props }) => (
        <JCheckBox key={label} label={label} labelPosition="right" {...props} />
      ))}
    </JPanel>
  ),
};

export const Interactive: Story = {
  parameters: {
    docs: {
      description: { story: 'Modo controlado. El padre gestiona el estado con `useState`. El label refleja el estado actual.' },
    },
  },
  render: (args) => {
    const [checked, setChecked] = useState(false);
    return (
      <JCheckBox
        label={checked ? 'Seleccionado' : 'Sin seleccionar'}
        labelPosition="right"
        checked={checked}
        onCheckedChange={(v, e) => { args.onCheckedChange?.(v, e); setChecked(v); }}
      />
    );
  },
};
