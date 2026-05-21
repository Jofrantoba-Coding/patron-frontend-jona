import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { useState } from 'react';
import { JChip, JCHIP_DEFAULTS } from './JChip';
import { JPanel } from '../JPanel/JPanel';
import { JLabel } from '../JLabel';

const meta: Meta<typeof JChip> = {
  title: 'Atoms/JChip',
  component: JChip,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'JChip es el atom de etiqueta interactiva de JONA. Sirve para filtros, tags y selecciones múltiples. Soporta 5 variantes semánticas de color, estado `selected` con fondo destacado, y modo `removable` con botón de cierre integrado. El `onClick` convierte el chip en elemento seleccionable; `onRemove` activa el botón de cierre.',
      },
    },
  },
  args: { children: 'Activo', onRemove: fn() },
  argTypes: {
    variant: {
      description: 'Color semántico del chip. `default` neutro (default), `primary` azul destacado, `success` verde, `warning` amarillo, `danger` rojo.',
      control: 'select',
      options: ['default', 'primary', 'success', 'warning', 'danger'],
      table: {
        type: { summary: 'JChipVariant' },
        defaultValue: { summary: JCHIP_DEFAULTS.variant },
      },
    },
    selected: {
      description: 'Estado de selección activa. Aplica fondo sólido en lugar de tono suave. Combinar con `onClick` para chips de filtro togglables.',
      control: 'boolean',
      table: { type: { summary: 'boolean' } },
    },
    removable: {
      description: 'Muestra un botón de cierre "×" al final del chip. Al hacer click en él se dispara `onRemove`. Usar para tags que el usuario puede eliminar.',
      control: 'boolean',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: String(JCHIP_DEFAULTS.removable) },
      },
    },
    onRemove: {
      description: 'Callback al hacer click en el botón de cierre. Solo disponible cuando `removable=true`.',
      table: { type: { summary: '() => void' } },
    },
    onClick: {
      description: 'Callback al hacer click en el chip. Convierte el chip en elemento seleccionable. Usar con `selected` para toggle de filtros.',
      table: { type: { summary: 'MouseEventHandler<HTMLSpanElement>' } },
    },
    children: {
      description: 'Contenido del chip. Generalmente texto corto. No incluir iconos de cierre — usar `removable` para eso.',
      control: 'text',
      table: { type: { summary: 'ReactNode' } },
    },
  },
};
export default meta;
type Story = StoryObj<typeof JChip>;

export const Default: Story = {
  parameters: {
    docs: {
      description: { story: 'Chip neutro en estado no seleccionado. Playground interactivo para explorar variantes y estados.' },
    },
  },
};

export const Selected: Story = {
  args: { selected: true },
  parameters: {
    docs: {
      description: { story: '`selected=true` aplica fondo sólido. Usar con `onClick` para chips togglables de filtros o categorías.' },
    },
  },
};

export const Removable: Story = {
  args: { removable: true },
  parameters: {
    docs: {
      description: { story: '`removable=true` añade un botón "×". Al pulsarlo se llama `onRemove` — el padre decide si elimina el chip del listado.' },
    },
  },
};

export const AllVariants: Story = {
  parameters: {
    docs: {
      description: { story: 'Las 5 variantes semánticas. Usar `success`/`warning`/`danger` para estados o prioridades, `primary` para categorías activas.' },
    },
  },
  render: () => (
    <JPanel layout="flow" gap="sm" alignItems="center">
      <JChip>Default</JChip>
      <JChip variant="primary">Primary</JChip>
      <JChip variant="success">Success</JChip>
      <JChip variant="warning">Warning</JChip>
      <JChip variant="danger">Danger</JChip>
      <JChip removable onRemove={fn()}>Removable</JChip>
    </JPanel>
  ),
};

export const FilterChips: Story = {
  parameters: {
    docs: {
      description: { story: 'Grupo de filtros con selección múltiple. El estado `selected` se gestiona en el padre. Patrón estándar para filtros de búsqueda o categorías.' },
    },
  },
  render: () => {
    const options = ['React', 'Vue', 'Angular', 'TypeScript', 'Node.js'];
    const [selected, setSelected] = useState<string[]>([]);
    const toggle = (opt: string) =>
      setSelected((prev) => prev.includes(opt) ? prev.filter((o) => o !== opt) : [...prev, opt]);
    return (
      <JPanel layout="box" gap="sm">
        <JPanel layout="flow" gap="sm">
          {options.map((opt) => (
            <JChip
              key={opt}
              variant="primary"
              selected={selected.includes(opt)}
              onClick={() => toggle(opt)}
            >
              {opt}
            </JChip>
          ))}
        </JPanel>
        <JLabel size="xs" color="muted">
          {selected.length === 0 ? 'Ninguno seleccionado' : `Seleccionados: ${selected.join(', ')}`}
        </JLabel>
      </JPanel>
    );
  },
};

export const RemovableChips: Story = {
  parameters: {
    docs: {
      description: { story: 'Lista de tags eliminables. `onRemove` filtra el array del padre. Patrón para campos de tags en formularios.' },
    },
  },
  render: () => {
    const [chips, setChips] = useState(['React', 'TypeScript', 'Tailwind']);
    return (
      <JPanel layout="flow" gap="sm">
        {chips.map((chip) => (
          <JChip
            key={chip}
            variant="primary"
            removable
            onRemove={() => setChips((prev) => prev.filter((c) => c !== chip))}
          >
            {chip}
          </JChip>
        ))}
        {chips.length === 0 && <JLabel size="sm" color="muted">Sin chips</JLabel>}
      </JPanel>
    );
  },
};

export const Interactive: Story = {
  parameters: {
    docs: {
      description: { story: 'Chip de guardado con estado toggle. Cambia variante e icono según el estado. Patrón para acciones en línea tipo "guardar".' },
    },
  },
  render: () => {
    const [saved, setSaved] = useState(false);
    return (
      <JPanel layout="box" alignItems="start" gap="sm">
        <JChip
          variant={saved ? 'success' : 'default'}
          selected={saved}
          onClick={() => setSaved((s) => !s)}
        >
          {saved ? '✓ Guardado' : 'Guardar'}
        </JChip>
        <JLabel size="xs" color="muted">{saved ? 'Click para deseleccionar' : 'Click para seleccionar'}</JLabel>
      </JPanel>
    );
  },
};
