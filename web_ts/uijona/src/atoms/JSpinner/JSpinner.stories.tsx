import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { JSpinner, JSPINNER_DEFAULTS } from './JSpinner';
import { JButton } from '../JButton/JButton';
import { JPanel } from '../JPanel/JPanel';
import { JLabel } from '../JLabel';

const meta: Meta<typeof JSpinner> = {
  title: 'Atoms/JSpinner',
  component: JSpinner,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'JSpinner es el atom de indicador de carga de JONA. Animación de giro SVG que señala que una operación está en progreso. Se puede usar de forma independiente o se embebe automáticamente en JButton cuando `loading=true`.',
      },
    },
  },
  argTypes: {
    size: {
      description: 'Tamaño del spinner. `sm`=16px, `md`=20px (default), `lg`=24px, `xl`=32px.',
      control: 'radio',
      options: ['sm', 'md', 'lg', 'xl'],
      table: {
        type: { summary: 'JSpinnerSize' },
        defaultValue: { summary: JSPINNER_DEFAULTS.size },
      },
    },
    color: {
      description: 'Color del spinner. `current` hereda el color del texto padre (default), `primary` color primario de la marca, `white` para fondos oscuros, `neutral` gris neutro.',
      control: 'select',
      options: ['current', 'primary', 'white', 'neutral'],
      table: {
        type: { summary: 'JSpinnerColor' },
        defaultValue: { summary: JSPINNER_DEFAULTS.color },
      },
    },
    label: {
      description: 'Texto accesible para lectores de pantalla (`aria-label`). No se muestra visualmente. Por defecto "Loading".',
      control: 'text',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: JSPINNER_DEFAULTS.label },
      },
    },
  },
};
export default meta;
type Story = StoryObj<typeof JSpinner>;

export const Default: Story = {
  args: { size: 'md' },
  parameters: {
    docs: {
      description: { story: 'Spinner por defecto en tamaño medio. `color="current"` hereda el color del texto del contenedor.' },
    },
  },
};

export const AllSizes: Story = {
  parameters: {
    docs: {
      description: { story: 'Los 4 tamaños disponibles. Elegir según el contexto: `sm` inline en texto, `md` en botones, `lg`/`xl` en overlays de carga.' },
    },
  },
  render: () => (
    <JPanel layout="flow" gap="lg" alignItems="center">
      {(['sm', 'md', 'lg', 'xl'] as const).map((s) => (
        <JPanel key={s} gap="xs" alignItems="center">
          <JSpinner size={s} color="primary" />
          <JLabel size="xs" color="muted">{s}</JLabel>
        </JPanel>
      ))}
    </JPanel>
  ),
};

export const AllColors: Story = {
  parameters: {
    docs: {
      description: { story: 'Los 4 colores disponibles. `white` se muestra sobre fondo oscuro para ser visible.' },
    },
  },
  render: () => (
    <JPanel layout="flow" gap="lg" alignItems="center">
      <JPanel gap="xs" alignItems="center">
        <JSpinner color="current" />
        <JLabel size="xs" color="muted">current</JLabel>
      </JPanel>
      <JPanel gap="xs" alignItems="center">
        <JSpinner color="primary" />
        <JLabel size="xs" color="muted">primary</JLabel>
      </JPanel>
      <JPanel gap="xs" alignItems="center" className="bg-neutral-800 rounded p-3">
        <JSpinner color="white" />
        <JLabel size="xs" className="text-white">white</JLabel>
      </JPanel>
      <JPanel gap="xs" alignItems="center">
        <JSpinner color="neutral" />
        <JLabel size="xs" color="muted">neutral</JLabel>
      </JPanel>
    </JPanel>
  ),
};

export const InButton: Story = {
  parameters: {
    docs: {
      description: { story: 'JSpinner se embebe automáticamente en JButton cuando `loading=true`. No necesitás usar JSpinner directamente en este caso.' },
    },
  },
  render: () => (
    <JPanel layout="flow" gap="sm" alignItems="center">
      <JButton variant="default" loading>Guardando</JButton>
      <JButton variant="outline" loading>Cargando</JButton>
    </JPanel>
  ),
};

export const Interactive: Story = {
  parameters: {
    docs: {
      description: { story: 'Spinner independiente para overlays o secciones de carga. Se muestra mientras se espera la respuesta async.' },
    },
  },
  render: () => {
    const [loading, setLoading] = useState(false);
    const load = async () => {
      setLoading(true);
      await new Promise((r) => setTimeout(r, 2000));
      setLoading(false);
    };
    return (
      <JPanel gap="md" alignItems="center">
        {loading
          ? <JSpinner size="lg" color="primary" label="Cargando datos..." />
          : <JLabel size="sm" color="muted">Datos listos</JLabel>}
        <JButton variant="outline" disabled={loading} onClick={load}>
          {loading ? 'Cargando...' : 'Recargar datos'}
        </JButton>
      </JPanel>
    );
  },
};
