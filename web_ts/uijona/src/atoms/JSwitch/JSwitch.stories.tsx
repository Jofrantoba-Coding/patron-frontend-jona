import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { useState } from 'react';
import { JSwitch, JSWITCH_DEFAULTS } from './JSwitch';
import { JPanel } from '../JPanel/JPanel';
import { JLabel } from '../JLabel';

const meta: Meta<typeof JSwitch> = {
  title: 'Atoms/JSwitch',
  component: JSwitch,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'JSwitch es el atom de interruptor binario de JONA. Implementado como `<button role="switch">` para accesibilidad correcta. Ideal para activar/desactivar funcionalidades o preferencias. El callback `onCheckedChange(checked, event)` sigue el patrón JONA con el valor primero.',
      },
    },
  },
  args: { onCheckedChange: fn() },
  argTypes: {
    size: {
      description: 'Tamaño del interruptor. `sm`=pequeño, `md`=mediano (default), `lg`=grande.',
      control: 'radio',
      options: ['sm', 'md', 'lg'],
      table: {
        type: { summary: 'JSwitchSize' },
        defaultValue: { summary: JSWITCH_DEFAULTS.size },
      },
    },
    checked: {
      description: 'Estado controlado. Combinar con `onCheckedChange` para modo controlado. En modo no controlado, el componente gestiona su propio estado.',
      control: 'boolean',
      table: { type: { summary: 'boolean' } },
    },
    disabled: {
      description: 'Bloquea toda interacción. El switch no responde a clicks ni a teclado.',
      control: 'boolean',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: String(JSWITCH_DEFAULTS.disabled) },
      },
    },
    hasError: {
      description: 'Estado de error. Cambia el color del track/aro a rojo. Usar con un `JLabel variant="error"` para el mensaje.',
      control: 'boolean',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: String(JSWITCH_DEFAULTS.hasError) },
      },
    },
    onCheckedChange: {
      description: 'Callback al cambiar estado. Patrón JONA: primer argumento `checked` (boolean), segundo el evento mouse nativo.',
      table: { type: { summary: '(checked: boolean, event: MouseEvent) => void' } },
    },
    'aria-label': {
      description: 'Etiqueta accesible. Usar si el switch no tiene un `<label>` asociado via `id`.',
      control: 'text',
      table: { type: { summary: 'string' } },
    },
  },
};
export default meta;
type Story = StoryObj<typeof JSwitch>;

export const Default: Story = {
  args: { size: 'md' },
  parameters: {
    docs: {
      description: { story: 'Switch en estado desactivado (default). Playground interactivo.' },
    },
  },
};

export const Checked: Story = {
  args: { checked: true },
  parameters: {
    docs: {
      description: { story: 'Estado activado controlado.' },
    },
  },
};

export const Small: Story = {
  args: { size: 'sm' },
  parameters: {
    docs: {
      description: { story: 'Tamaño pequeño para listas densas o sidebars.' },
    },
  },
};

export const Large: Story = {
  args: { size: 'lg', checked: true },
  parameters: {
    docs: {
      description: { story: 'Tamaño grande para configuraciones principales o CTAs.' },
    },
  },
};

export const Disabled: Story = {
  args: { disabled: true },
  parameters: {
    docs: {
      description: { story: 'Estado deshabilitado. El switch no responde a ninguna interacción.' },
    },
  },
};

export const WithError: Story = {
  args: { hasError: true, checked: true },
  parameters: {
    docs: {
      description: { story: 'Estado de error. Usar cuando el switch representa una configuración inválida o en conflicto.' },
    },
  },
};

export const AllSizes: Story = {
  parameters: {
    docs: {
      description: { story: 'Los 3 tamaños en estado activado para comparación visual.' },
    },
  },
  render: () => (
    <JPanel layout="flow" gap="lg" alignItems="center">
      {(['sm', 'md', 'lg'] as const).map((s) => (
        <JPanel key={s} gap="xs" alignItems="center">
          <JSwitch size={s} checked />
          <JLabel size="xs" color="muted">{s}</JLabel>
        </JPanel>
      ))}
    </JPanel>
  ),
};

export const Interactive: Story = {
  parameters: {
    docs: {
      description: { story: 'Switch controlado con etiqueta reactiva. Patrón estándar para preferencias de usuario.' },
    },
  },
  args: { onCheckedChange: fn() },
  render: (args) => {
    const [checked, setChecked] = useState(false);
    return (
      <JPanel layout="box" direction="row" alignItems="center" gap="sm">
        <JSwitch
          checked={checked}
          onCheckedChange={(v, e) => { args.onCheckedChange?.(v, e); setChecked(v); }}
          aria-label="Notificaciones por email"
        />
        <JLabel as="span" size="sm" className="text-neutral-600">
          Notificaciones por email: <strong>{checked ? 'Activadas' : 'Desactivadas'}</strong>
        </JLabel>
      </JPanel>
    );
  },
};
