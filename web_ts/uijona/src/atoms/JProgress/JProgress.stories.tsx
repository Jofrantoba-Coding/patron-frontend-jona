import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { JProgress, JPROGRESS_DEFAULTS } from './JProgress';
import { JButton } from '../JButton/JButton';
import { JPanel } from '../JPanel/JPanel';
import { JLabel } from '../JLabel';

const meta: Meta<typeof JProgress> = {
  title: 'Atoms/JProgress',
  component: JProgress,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'JProgress es el atom de indicador de progreso de JONA. Soporta dos tipos: `bar` (barra horizontal, ideal para cargas o pasos lineales) y `circle` (circular, ideal para dashboards y métricas). Ambos tipos comparten las mismas variantes semánticas de color y los mismos tamaños. El `value` va de 0 a `max` (default 100). `showLabel` muestra el porcentaje calculado o un `label` personalizado.',
      },
    },
  },
  argTypes: {
    type: {
      description: 'Forma del indicador. `bar` barra horizontal (default), `circle` anillo circular.',
      control: 'radio',
      options: ['bar', 'circle'],
      table: {
        type: { summary: 'JProgressType' },
        defaultValue: { summary: JPROGRESS_DEFAULTS.type },
      },
    },
    value: {
      description: 'Valor actual del progreso. Va de 0 a `max`. Se calcula el porcentaje como `(value / max) * 100`.',
      control: { type: 'range', min: 0, max: 100, step: 5 },
      table: {
        type: { summary: 'number' },
        defaultValue: { summary: String(JPROGRESS_DEFAULTS.value) },
      },
    },
    max: {
      description: 'Valor máximo del progreso. Por defecto 100 para trabajar directamente con porcentajes.',
      control: { type: 'number', min: 1 },
      table: {
        type: { summary: 'number' },
        defaultValue: { summary: String(JPROGRESS_DEFAULTS.max) },
      },
    },
    variant: {
      description: 'Color semántico del indicador. `default` azul (default), `success` verde, `warning` amarillo, `danger` rojo. Cambiar dinámicamente según el valor para retroalimentación visual.',
      control: 'select',
      options: ['default', 'success', 'warning', 'danger'],
      table: {
        type: { summary: 'JProgressVariant' },
        defaultValue: { summary: JPROGRESS_DEFAULTS.variant },
      },
    },
    size: {
      description: 'Tamaño del indicador. `sm` pequeño (barra 4px alto, círculo 48px), `md` mediano (barra 8px, círculo 64px, default), `lg` grande (barra 12px, círculo 80px).',
      control: 'radio',
      options: ['sm', 'md', 'lg'],
      table: {
        type: { summary: 'JProgressSize' },
        defaultValue: { summary: JPROGRESS_DEFAULTS.size },
      },
    },
    showLabel: {
      description: 'Muestra la etiqueta de porcentaje. En `bar` aparece a la derecha de la barra; en `circle` aparece centrado dentro del anillo.',
      control: 'boolean',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: String(JPROGRESS_DEFAULTS.showLabel) },
      },
    },
    label: {
      description: 'Etiqueta personalizada. Si se define, reemplaza el porcentaje calculado automáticamente. Útil para mostrar fracciones ("3/10") o íconos ("✓").',
      control: 'text',
      table: { type: { summary: 'string' } },
    },
    animated: {
      description: 'Activa la animación de la barra (shimmer). Solo aplica a `type="bar"`. Usar mientras el progreso está activo; desactivar cuando se completa.',
      control: 'boolean',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: String(JPROGRESS_DEFAULTS.animated) },
      },
    },
  },
};
export default meta;
type Story = StoryObj<typeof JProgress>;

export const BarDefault: Story = {
  args: { value: 60 },
  parameters: {
    docs: {
      description: { story: 'Barra de progreso en 60%. Playground interactivo para explorar variantes y tamaños.' },
    },
  },
  decorators: [(S) => <JPanel style={{ width: 320 }}><S /></JPanel>],
};

export const BarWithLabel: Story = {
  args: { value: 75, showLabel: true },
  parameters: {
    docs: {
      description: { story: '`showLabel=true` muestra el porcentaje a la derecha de la barra. El valor se calcula automáticamente como `(value / max) * 100`.' },
    },
  },
  decorators: [(S) => <JPanel style={{ width: 320 }}><S /></JPanel>],
};

export const BarSizes: Story = {
  parameters: {
    docs: {
      description: { story: 'Los 3 tamaños de la barra. `sm` para indicadores secundarios, `md` para el uso general, `lg` para indicadores principales.' },
    },
  },
  render: () => (
    <JPanel layout="box" gap="md" style={{ width: 320 }}>
      <JProgress size="sm" value={60} showLabel />
      <JProgress size="md" value={60} showLabel />
      <JProgress size="lg" value={60} showLabel />
    </JPanel>
  ),
};

export const BarVariants: Story = {
  parameters: {
    docs: {
      description: { story: 'Las 4 variantes semánticas. Cambiar dinámicamente según el valor: `danger` cuando queda poco, `warning` en la mitad, `success` al completar.' },
    },
  },
  render: () => (
    <JPanel layout="box" gap="sm" style={{ width: 320 }}>
      <JProgress value={80} variant="default" showLabel />
      <JProgress value={90} variant="success" showLabel />
      <JProgress value={55} variant="warning" showLabel />
      <JProgress value={25} variant="danger"  showLabel />
    </JPanel>
  ),
};

export const BarAnimated: Story = {
  args: { value: 65, animated: true, showLabel: true },
  parameters: {
    docs: {
      description: { story: '`animated=true` agrega un efecto shimmer. Activar mientras el progreso está corriendo; desactivar cuando se pausa o completa.' },
    },
  },
  decorators: [(S) => <JPanel style={{ width: 320 }}><S /></JPanel>],
};

export const CircleDefault: Story = {
  args: { type: 'circle', value: 60, showLabel: true },
  parameters: {
    docs: {
      description: { story: 'Indicador circular con porcentaje centrado. Ideal para dashboards, métricas de usuario o pasos de onboarding.' },
    },
  },
};

export const CircleSizes: Story = {
  parameters: {
    docs: {
      description: { story: 'Los 3 tamaños del círculo: `sm` 48px, `md` 64px (default), `lg` 80px.' },
    },
  },
  render: () => (
    <JPanel layout="flow" gap="lg" alignItems="end">
      <JProgress type="circle" size="sm" value={60} showLabel />
      <JProgress type="circle" size="md" value={60} showLabel />
      <JProgress type="circle" size="lg" value={60} showLabel />
    </JPanel>
  ),
};

export const CircleVariants: Story = {
  parameters: {
    docs: {
      description: { story: 'Las 4 variantes semánticas en el indicador circular.' },
    },
  },
  render: () => (
    <JPanel layout="flow" gap="lg" alignItems="center">
      <JProgress type="circle" value={80} variant="default" showLabel />
      <JProgress type="circle" value={90} variant="success" showLabel />
      <JProgress type="circle" value={55} variant="warning" showLabel />
      <JProgress type="circle" value={25} variant="danger"  showLabel />
    </JPanel>
  ),
};

export const CircleCustomLabel: Story = {
  parameters: {
    docs: {
      description: { story: '`label` personalizado en lugar del porcentaje. Útil para mostrar fracciones ("3/10") o un checkmark al completar.' },
    },
  },
  render: () => (
    <JPanel layout="flow" gap="lg" alignItems="center">
      <JProgress type="circle" size="lg" value={3} max={10} showLabel label="3/10" variant="warning" />
      <JProgress type="circle" size="lg" value={100} showLabel label="✓" variant="success" />
    </JPanel>
  ),
};

export const Interactive: Story = {
  parameters: {
    docs: {
      description: { story: 'Simulación de subida de archivo. La variante cambia dinámicamente según el progreso. Ambos tipos (bar y circle) se sincronizan con el mismo estado.' },
    },
  },
  render: () => {
    const [progress, setProgress] = useState(0);
    const [running, setRunning] = useState(false);
    const start = () => {
      if (running) return;
      setProgress(0);
      setRunning(true);
      const id = setInterval(() => {
        setProgress((p) => {
          if (p >= 100) { clearInterval(id); setRunning(false); return 100; }
          return p + 5;
        });
      }, 150);
    };
    const variant = progress < 40 ? 'default' : progress < 80 ? 'warning' : 'success';
    return (
      <JPanel layout="box" gap="lg" style={{ width: 320 }}>
        <JPanel layout="flow" gap="lg" alignItems="center">
          <JProgress type="circle" size="lg" value={progress} variant={variant} showLabel />
          <JPanel layout="box" gap="sm" className="flex-1">
            <JLabel size="sm" className="font-medium text-neutral-700">Subida de archivo</JLabel>
            <JProgress value={progress} variant={variant} showLabel animated={running} />
          </JPanel>
        </JPanel>
        <JButton variant="outline" disabled={running} loading={running} onClick={start}>
          {running ? 'Subiendo...' : progress === 100 ? 'Subir de nuevo' : 'Iniciar subida'}
        </JButton>
      </JPanel>
    );
  },
};
