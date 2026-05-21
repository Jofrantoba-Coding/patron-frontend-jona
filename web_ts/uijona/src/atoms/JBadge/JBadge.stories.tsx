import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { JBadge, JBADGE_DEFAULTS } from './JBadge';
import { JButton } from '../JButton/JButton';
import { JPanel } from '../JPanel/JPanel';
import { JLabel } from '../JLabel';

const meta: Meta<typeof JBadge> = {
  title: 'Atoms/JBadge',
  component: JBadge,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'JBadge es el atom de insignia/etiqueta de estado de JONA. Componente puramente presentacional para mostrar texto corto con fondo coloreado. Ideal para contadores de notificaciones, estados de ítems y categorías.',
      },
    },
  },
  argTypes: {
    variant: {
      description: 'Estilo de color. `default` primario, `secondary` neutro gris, `destructive` rojo para errores o alertas, `outline` solo borde sin fondo, `ghost` fondo muy suave.',
      control: 'select',
      options: ['default', 'secondary', 'destructive', 'outline', 'ghost'],
      table: {
        type: { summary: 'JBadgeVariant' },
        defaultValue: { summary: JBADGE_DEFAULTS.variant },
      },
    },
    children: {
      description: 'Contenido del badge. Texto corto: números, estados (Activo, Pendiente) o iconos.',
      control: 'text',
      table: { type: { summary: 'ReactNode' } },
    },
  },
};
export default meta;
type Story = StoryObj<typeof JBadge>;

export const Default: Story = {
  args: { children: 'Badge' },
  parameters: {
    docs: {
      description: { story: 'Badge por defecto con color primario. Para la acción o estado principal de la pantalla.' },
    },
  },
};

export const Secondary: Story = {
  args: { variant: 'secondary', children: 'Secondary' },
  parameters: {
    docs: {
      description: { story: 'Badge neutro en gris. Para información complementaria o estados sin urgencia.' },
    },
  },
};

export const Destructive: Story = {
  args: { variant: 'destructive', children: 'Error' },
  parameters: {
    docs: {
      description: { story: 'Badge rojo para errores, alertas críticas o contadores de notificaciones urgentes.' },
    },
  },
};

export const Outline: Story = {
  args: { variant: 'outline', children: 'Outline' },
  parameters: {
    docs: {
      description: { story: 'Badge solo con borde, sin fondo. Para etiquetas secundarias o sobre fondos de color.' },
    },
  },
};

export const Ghost: Story = {
  args: { variant: 'ghost', children: 'Ghost' },
  parameters: {
    docs: {
      description: { story: 'Badge con fondo muy suave. Para categorías o tags que no deben destacar.' },
    },
  },
};

export const AllVariants: Story = {
  parameters: {
    docs: {
      description: { story: 'Comparación de las 5 variantes en una fila. Elegir según la jerarquía de información.' },
    },
  },
  render: () => (
    <JPanel layout="flow" gap="sm">
      {(['default', 'secondary', 'destructive', 'outline', 'ghost'] as const).map((v) => (
        <JBadge key={v} variant={v}>{v}</JBadge>
      ))}
    </JPanel>
  ),
};

export const WithIcon: Story = {
  parameters: {
    docs: {
      description: { story: 'Badges con íconos de texto unicode. Para estados con indicador visual: ● activo, ✕ error, ○ borrador.' },
    },
  },
  render: () => (
    <JPanel layout="flow" gap="sm">
      <JBadge variant="default">● Activo</JBadge>
      <JBadge variant="secondary">◎ Pendiente</JBadge>
      <JBadge variant="destructive">✕ Error</JBadge>
      <JBadge variant="outline">○ Borrador</JBadge>
    </JPanel>
  ),
};

export const Interactive: Story = {
  parameters: {
    docs: {
      description: { story: 'Contador de notificaciones que cambia de variante según la cantidad. Patrón común en navbars y sidebars.' },
    },
  },
  render: () => {
    const [count, setCount] = useState(0);
    return (
      <JPanel gap="md" alignItems="start">
        <JPanel layout="box" direction="row" alignItems="center" gap="sm">
          <JLabel as="span" size="sm">Notificaciones</JLabel>
          <JBadge variant={count > 5 ? 'destructive' : count > 0 ? 'default' : 'secondary'}>
            {count}
          </JBadge>
        </JPanel>
        <JPanel layout="flow" gap="sm">
          <JButton variant="outline" size="sm" onClick={() => setCount((c) => c + 1)}>
            Nueva notificación
          </JButton>
          <JButton variant="ghost" size="sm" disabled={count === 0} onClick={() => setCount(0)}>
            Marcar leídas
          </JButton>
        </JPanel>
      </JPanel>
    );
  },
};
