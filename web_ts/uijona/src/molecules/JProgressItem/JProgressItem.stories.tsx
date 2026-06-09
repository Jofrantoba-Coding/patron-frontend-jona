import type { Meta, StoryObj } from '@storybook/react';
import { JProgressItem, JPROGRESS_ITEM_DEFAULTS } from './JProgressItem';
import { JPanel } from '../../atoms/JPanel/JPanel';
import { JLabel } from '../../atoms/JLabel';

const meta: Meta<typeof JProgressItem> = {
  title: 'Molecules/JProgressItem',
  component: JProgressItem,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'JProgressItem muestra un ítem de beneficio o métrica con etiqueta descriptiva, porcentaje textual y barra de progreso coherentes entre sí. El valor numérico (`value`) determina tanto el texto porcentual como el llenado de la barra, eliminando la desincronía de escribir el porcentaje en el texto. Reemplaza a `JProgressItem`.',
      },
    },
  },
  args: {
    label: 'Reducción del tiempo de resolución de incidentes',
    value: 40,
    style: { width: '400px' },
  },
  argTypes: {
    label: {
      description: 'Texto descriptivo del ítem. No incluir el porcentaje — `showValue` lo muestra automáticamente al lado de la barra.',
      control: 'text',
      table: { type: { summary: 'string' } },
    },
    value: {
      description: 'Valor de progreso. Se usa para calcular el porcentaje mostrado en texto y el ancho de la barra. Rango 0–`max` (default 100).',
      control: { type: 'range', min: 0, max: 100, step: 1 },
      table: { type: { summary: 'number' } },
    },
    max: {
      description: 'Valor máximo del rango. El porcentaje se calcula como `value / max * 100`.',
      control: { type: 'number', min: 1 },
      table: {
        type: { summary: 'number' },
        defaultValue: { summary: String(JPROGRESS_ITEM_DEFAULTS.max) },
      },
    },
    variant: {
      description: 'Color semántico de la barra y el valor textual. `default` azul, `success` verde, `warning` amarillo, `danger` rojo.',
      control: 'select',
      options: ['default', 'success', 'warning', 'danger'],
      table: {
        type: { summary: 'JProgressItemVariant' },
        defaultValue: { summary: JPROGRESS_ITEM_DEFAULTS.variant },
      },
    },
    size: {
      description: 'Tamaño del padding, tipografía y altura de la barra.',
      control: 'radio',
      options: ['sm', 'md', 'lg'],
      table: {
        type: { summary: 'JProgressItemSize' },
        defaultValue: { summary: JPROGRESS_ITEM_DEFAULTS.size },
      },
    },
    showValue: {
      description: 'Muestra el porcentaje calculado junto a la etiqueta. Desactivar solo cuando el contexto visual ya comunica el valor.',
      control: 'boolean',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: String(JPROGRESS_ITEM_DEFAULTS.showValue) },
      },
    },
  },
};
export default meta;
type Story = StoryObj<typeof JProgressItem>;

// ── Stories ───────────────────────────────────────────────────────────────────

export const Default: Story = {
  parameters: {
    docs: {
      description: { story: 'Playground interactivo. Ajusta `value` con el slider para ver la barra y el porcentaje moverse en sincronía.' },
    },
  },
};

export const AllVariants: Story = {
  name: 'Todas las variantes',
  parameters: {
    docs: {
      description: { story: 'Las 4 variantes semánticas. Usar `success` para métricas positivas, `warning` para métricas en riesgo y `danger` para alertas.' },
    },
  },
  render: () => (
    <JPanel layout="box" gap="sm" style={{ width: 440 }}>
      <JProgressItem label="Rendimiento del sistema"          value={85} variant="default" />
      <JProgressItem label="Satisfacción del cliente"         value={72} variant="success" />
      <JProgressItem label="Uso de recursos del servidor"     value={61} variant="warning" />
      <JProgressItem label="Tasa de errores en producción"    value={18} variant="danger"  />
    </JPanel>
  ),
};

export const Sizes: Story = {
  parameters: {
    docs: {
      description: { story: 'Los 3 tamaños disponibles: `sm` compacto para listas densas, `md` estándar, `lg` para secciones destacadas.' },
    },
  },
  render: () => (
    <JPanel layout="box" gap="lg" style={{ width: 440 }}>
      {(['sm', 'md', 'lg'] as const).map((size) => (
        <JPanel layout="box" gap="xs" key={size}>
          <JLabel size="xs" color="muted">{size}</JLabel>
          <JProgressItem
            label="Reducción de incidentes críticos"
            value={40}
            variant="success"
            size={size}
          />
        </JPanel>
      ))}
    </JPanel>
  ),
};

export const BenefitList: Story = {
  name: 'Lista de beneficios',
  parameters: {
    docs: {
      description: { story: 'Caso de uso principal: lista de métricas de beneficio con valores coherentes entre texto y barra. Reemplaza el patrón de viñeta de `JProgressItem`.' },
    },
  },
  render: () => (
    <JPanel layout="box" gap="sm" style={{ width: 460 }}>
      <JProgressItem label="Reducción del tiempo de resolución de incidentes" value={40} variant="success" />
      <JProgressItem label="Aumento de satisfacción del usuario final"        value={65} variant="success" />
      <JProgressItem label="Disminución de errores en producción"             value={55} variant="default" />
      <JProgressItem label="Incremento de velocidad de despliegue"            value={80} variant="default" />
      <JProgressItem label="Deuda técnica pendiente de resolver"              value={30} variant="warning" />
    </JPanel>
  ),
};

export const CustomMax: Story = {
  name: 'Max personalizado',
  parameters: {
    docs: {
      description: { story: 'Con `max` distinto de 100 el porcentaje se recalcula automáticamente. Útil para métricas con escala propia (p.ej. NPS 0–10, puntuación 0–5).' },
    },
  },
  render: () => (
    <JPanel layout="box" gap="sm" style={{ width: 440 }}>
      <JLabel size="xs" color="muted">NPS (0–10) — valor 7.5</JLabel>
      <JProgressItem label="Net Promoter Score" value={7.5} max={10} variant="success" />
      <JLabel size="xs" color="muted">Puntuación CSAT (0–5) — valor 4.2</JLabel>
      <JProgressItem label="Customer Satisfaction Score" value={4.2} max={5} variant="default" />
    </JPanel>
  ),
};

export const WithoutValueLabel: Story = {
  name: 'Sin etiqueta de valor',
  args: { label: 'Cobertura de tests automatizados', value: 78, variant: 'success', showValue: false },
  parameters: {
    docs: {
      description: { story: '`showValue=false` oculta el porcentaje textual. La barra sigue siendo accesible vía `aria-valuenow`.' },
    },
  },
};
