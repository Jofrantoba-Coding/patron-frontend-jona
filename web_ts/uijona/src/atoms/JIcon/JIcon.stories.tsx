import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { useState } from 'react';
import { JIcon, JICON_DEFAULTS } from './JIcon';
import { JPanel } from '../JPanel/JPanel';
import { JLabel } from '../JLabel';

const SearchIcon = () => (
  <span aria-hidden="true" style={{ fontSize: 14, fontWeight: 700, lineHeight: 1 }}>
    S
  </span>
);

const meta: Meta<typeof JIcon> = {
  title: 'Atoms/JIcon',
  component: JIcon,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'JIcon es el atom de botón de icono de JONA. Implementado como `<button>` accesible con `aria-label` obligatorio. Comparte las variantes visuales de JButton pero sin texto visible — ideal para acciones secundarias en toolbars, listas y cards. El `label` es imperativo para accesibilidad: describe la acción, no el ícono.',
      },
    },
  },
  args: { icon: <SearchIcon />, label: 'Buscar', onClick: fn() },
  argTypes: {
    icon: {
      description: 'Elemento visual del botón. Acepta cualquier `ReactNode`: SVG, emoji, componente de icono. No incluir texto visible.',
      table: { type: { summary: 'ReactNode' } },
    },
    label: {
      description: 'Etiqueta accesible obligatoria (`aria-label`). Describe la acción que realiza el botón, no el icono. Ejemplo: "Eliminar elemento", no "X".',
      control: 'text',
      table: { type: { summary: 'string' } },
    },
    variant: {
      description: 'Estilo visual. Comparte las variantes de JButton. `ghost` (default) es invisible hasta el hover — ideal para toolbars. `outline` agrega borde visible. `destructive` en rojo para acciones peligrosas.',
      control: 'select',
      options: ['default', 'outline', 'ghost', 'destructive', 'secondary', 'link'],
      table: {
        type: { summary: 'JButtonVariant' },
        defaultValue: { summary: JICON_DEFAULTS.variant },
      },
    },
    loading: {
      description: 'Muestra un spinner y deshabilita el botón. Usar durante operaciones asíncronas iniciadas por el click.',
      control: 'boolean',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: String(JICON_DEFAULTS.loading) },
      },
    },
    disabled: {
      description: 'Deshabilita toda interacción. El botón no recibe foco ni eventos.',
      control: 'boolean',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: String(JICON_DEFAULTS.disabled) },
      },
    },
    type: {
      description: 'Tipo HTML del botón. `button` (default) no envía formularios. `submit` envía el formulario padre. `reset` resetea los campos.',
      control: 'radio',
      options: ['button', 'submit', 'reset'],
      table: {
        type: { summary: '"button" | "submit" | "reset"' },
        defaultValue: { summary: JICON_DEFAULTS.type },
      },
    },
    onClick: {
      description: 'Handler del evento click. Recibe el `MouseEvent` nativo.',
      table: { type: { summary: 'MouseEventHandler<HTMLButtonElement>' } },
    },
  },
};
export default meta;
type Story = StoryObj<typeof JIcon>;

export const Default: Story = {
  parameters: {
    docs: {
      description: { story: 'JIcon con variante `ghost` (default). Invisible en reposo, visible al hover. Playground interactivo.' },
    },
  },
};

export const Outline: Story = {
  args: { variant: 'outline', label: 'Buscar con borde' },
  parameters: {
    docs: {
      description: { story: 'Variante `outline` con borde visible en reposo. Útil cuando el botón debe tener presencia visual constante.' },
    },
  },
};

export const Destructive: Story = {
  args: { variant: 'destructive', label: 'Eliminar' },
  parameters: {
    docs: {
      description: { story: 'Variante `destructive` en rojo. Reservar para acciones irreversibles como eliminar o borrar.' },
    },
  },
};

export const Loading: Story = {
  args: { loading: true, label: 'Cargando' },
  parameters: {
    docs: {
      description: { story: '`loading=true` reemplaza el icono por un spinner y bloquea la interacción. Usar durante operaciones asíncronas.' },
    },
  },
};

export const Disabled: Story = {
  args: { disabled: true, label: 'No disponible' },
  parameters: {
    docs: {
      description: { story: '`disabled=true` bloquea toda interacción. El botón no recibe foco ni responde a clicks.' },
    },
  },
};

export const AllVariants: Story = {
  parameters: {
    docs: {
      description: { story: 'Las 5 variantes principales en comparación. `ghost` y `outline` son las más utilizadas en toolbars e interfaces densas.' },
    },
  },
  render: () => (
    <JPanel layout="flow" gap="sm" alignItems="center">
      {(['default', 'outline', 'ghost', 'destructive', 'secondary'] as const).map((v) => (
        <JPanel key={v} gap="xs" alignItems="center">
          <JIcon icon={<span aria-hidden="true" style={{ fontSize: 14, fontWeight: 700 }}>S</span>} label={v} variant={v} />
          <JLabel size="xs" color="muted">{v}</JLabel>
        </JPanel>
      ))}
    </JPanel>
  ),
};

export const Interactive: Story = {
  parameters: {
    docs: {
      description: { story: 'Botón de favorito con estado toggle. El icono y la variante cambian según el estado. Patrón habitual en listas y cards.' },
    },
  },
  args: { onClick: fn() },
  render: (args) => {
    const [saved, setSaved] = useState(false);
    const HeartIcon = () => (
      <span aria-hidden="true" style={{ fontSize: 16, lineHeight: 1 }}>{saved ? '♥' : '♡'}</span>
    );
    return (
      <JPanel layout="box" alignItems="center" gap="sm">
        <JIcon
          icon={<HeartIcon />}
          label={saved ? 'Quitar de favoritos' : 'Añadir a favoritos'}
          variant={saved ? 'destructive' : 'outline'}
          onClick={(event) => { args.onClick?.(event); setSaved((s) => !s); }}
        />
        <JLabel size="xs" color="muted">{saved ? 'Guardado en favoritos' : 'Sin guardar'}</JLabel>
      </JPanel>
    );
  },
};
