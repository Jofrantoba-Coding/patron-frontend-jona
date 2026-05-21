import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import React, { useState } from 'react';
import {
  JButton,
  JBUTTON_DEFAULTS,
  JBUTTON_VARIANTS,
  JBUTTON_SIZES,
  JBUTTON_ICON_POSITIONS,
  type JButtonVariant,
  type JButtonSize,
  type JButtonIconPosition,
} from './JButton';
import { JPanel } from '../JPanel/JPanel';

const meta: Meta<typeof JButton> = {
  title: 'Atoms/JButton',
  component: JButton,
  tags: ['autodocs'],
  args: { onClick: fn() },
  parameters: {
    docs: {
      description: {
        component:
          'JButton es el atom botón de JONA. Soporta icono en 4 posiciones (left, right, top, bottom) con el texto siempre centrado. No tiene layout propio — usa JPanel para componer grupos de botones.',
      },
    },
  },
  argTypes: {
    variant: {
      description: 'Estilo visual del botón. `default` filled primario, `outline` borde sin relleno, `ghost` sin borde ni relleno, `destructive` rojo para acciones peligrosas, `secondary` neutro, `link` texto subrayado.',
      control: 'select',
      options: Object.keys(JBUTTON_VARIANTS) as JButtonVariant[],
      table: {
        type: { summary: 'JButtonVariant' },
        defaultValue: { summary: JBUTTON_DEFAULTS.variant },
      },
    },
    size: {
      description: 'Tamaño del botón. Determina la altura mínima y el padding horizontal. `icon` produce un botón cuadrado sin texto.',
      control: 'select',
      options: (Object.keys(JBUTTON_SIZES) as JButtonSize[]).filter((s) => s !== 'default'),
      table: {
        type: { summary: 'JButtonSize' },
        defaultValue: { summary: JBUTTON_DEFAULTS.size },
      },
    },
    iconPosition: {
      description: 'Posición del icono relativa al texto. `left`/`right` usa flex-row, `top`/`bottom` usa flex-column. El texto siempre queda centrado respecto al par icono+texto.',
      control: 'radio',
      options: Object.keys(JBUTTON_ICON_POSITIONS) as JButtonIconPosition[],
      table: {
        type: { summary: 'JButtonIconPosition' },
        defaultValue: { summary: JBUTTON_DEFAULTS.iconPosition },
      },
    },
    loading: {
      description: 'Muestra un spinner y deshabilita el botón durante una operación async. Reemplaza el icono si hay uno.',
      control: 'boolean',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: String(JBUTTON_DEFAULTS.loading) },
      },
    },
    fullWidth: {
      description: 'Estira el botón al 100% del ancho del contenedor padre. Útil en formularios móviles o CTAs.',
      control: 'boolean',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: String(JBUTTON_DEFAULTS.fullWidth) },
      },
    },
    disabled: {
      description: 'Bloquea toda interacción y aplica estilos de deshabilitado. Diferente a `loading`: el usuario ve que no puede interactuar.',
      control: 'boolean',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    icon: {
      description: 'Nodo React a renderizar como icono. Posicionado según `iconPosition`. SVGs inline o componentes icon recomendados.',
      table: { type: { summary: 'ReactNode' } },
    },
    type: {
      description: 'Tipo HTML del botón. `button` por defecto. Usar `submit` dentro de formularios.',
      control: false,
      table: {
        type: { summary: '"button" | "submit" | "reset"' },
        defaultValue: { summary: JBUTTON_DEFAULTS.type },
      },
    },
    onClick: {
      description: 'Callback al hacer click. Recibe el MouseEvent nativo.',
      table: { type: { summary: '(event: MouseEvent) => void' } },
    },
  },
};

export default meta;
type Story = StoryObj<typeof JButton>;

const StarIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
  </svg>
);

const PlusIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
    <path d="M12 5v14M5 12h14" />
  </svg>
);

const ArrowIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
    <path d="M5 12h14M12 5l7 7-7 7" />
  </svg>
);

const DownloadIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3" />
  </svg>
);

export const Default: Story = {
  args: {
    children: 'Botón',
    variant: 'default',
    size: 'md',
    iconPosition: 'left',
    loading: false,
    fullWidth: false,
    disabled: false,
  },
  parameters: {
    docs: {
      description: {
        story: 'Playground interactivo. Modificá cualquier prop desde los controles. El icono de estrella se renderiza en la posición seleccionada.',
      },
    },
  },
  render: (args) => <JButton {...args} icon={<StarIcon />} />,
};

export const Variants: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Las 6 variantes de JButton. Elegir según la jerarquía de la acción: `default` para la acción principal, `outline`/`ghost` para secundarias, `destructive` para acciones irreversibles, `link` para navegación inline.',
      },
    },
  },
  render: () => (
    <JPanel layout="flow" gap="sm">
      <JButton variant="default">Default</JButton>
      <JButton variant="secondary">Secondary</JButton>
      <JButton variant="outline">Outline</JButton>
      <JButton variant="ghost">Ghost</JButton>
      <JButton variant="destructive">Destructive</JButton>
      <JButton variant="link">Link</JButton>
    </JPanel>
  ),
};

export const Sizes: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Cinco tamaños disponibles. `md` es el default (36px). `xs`/`sm` para tablas o espacios comprimidos. `lg`/`xl` para acciones destacadas y CTAs hero.',
      },
    },
  },
  render: () => (
    <JPanel layout="flow" gap="sm" style={{ alignItems: 'center' }}>
      <JButton size="xs">Extra small</JButton>
      <JButton size="sm">Small</JButton>
      <JButton size="md">Medium</JButton>
      <JButton size="lg">Large</JButton>
      <JButton size="xl">Extra large</JButton>
    </JPanel>
  ),
};

export const IconPositions: Story = {
  parameters: {
    docs: {
      description: {
        story: 'El icono puede ir en left (default), right, top o bottom. `left`/`right` mantienen el layout horizontal; `top`/`bottom` cambian a columna. El texto siempre queda centrado respecto al par icono+texto.',
      },
      source: {
        code: `<JButton icon={<StarIcon />} iconPosition="left">Left</JButton>
<JButton icon={<StarIcon />} iconPosition="right">Right</JButton>
<JButton icon={<StarIcon />} iconPosition="top">Top</JButton>
<JButton icon={<StarIcon />} iconPosition="bottom">Bottom</JButton>`,
      },
    },
  },
  render: () => (
    <JPanel layout="flow" gap="md" style={{ alignItems: 'center' }}>
      <JButton icon={<StarIcon />} iconPosition="left">Left</JButton>
      <JButton icon={<StarIcon />} iconPosition="right">Right</JButton>
      <JButton icon={<StarIcon />} iconPosition="top" variant="outline">Top</JButton>
      <JButton icon={<StarIcon />} iconPosition="bottom" variant="outline">Bottom</JButton>
    </JPanel>
  ),
};

export const IconOnly: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Botones cuadrados con solo icono usando `size="icon"`. Siempre incluir `aria-label` para accesibilidad — es lo único que describe la acción al lector de pantalla.',
      },
    },
  },
  render: () => (
    <JPanel layout="flow" gap="sm" style={{ alignItems: 'center' }}>
      <JButton size="icon" variant="default" aria-label="Agregar"><PlusIcon /></JButton>
      <JButton size="icon" variant="outline" aria-label="Descargar"><DownloadIcon /></JButton>
      <JButton size="icon" variant="ghost" aria-label="Ir"><ArrowIcon /></JButton>
    </JPanel>
  ),
};

export const WithIcons: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Botones con icono en distintas variantes y tamaños. El icono hereda el color del botón automáticamente.',
      },
    },
  },
  render: () => (
    <JPanel layout="flow" gap="sm" style={{ alignItems: 'center' }}>
      <JButton icon={<PlusIcon />} variant="default">Nuevo</JButton>
      <JButton icon={<DownloadIcon />} variant="outline">Exportar</JButton>
      <JButton icon={<ArrowIcon />} iconPosition="right" variant="secondary">Continuar</JButton>
      <JButton icon={<StarIcon />} iconPosition="top" variant="ghost" size="lg">Favorito</JButton>
    </JPanel>
  ),
};

export const States: Story = {
  parameters: {
    docs: {
      description: {
        story: '`loading=true` reemplaza el icono con un spinner y deshabilita el botón durante la operación. `disabled=true` lo bloquea permanentemente. Ambos son visualmente distintos para comunicar intención diferente.',
      },
    },
  },
  render: () => (
    <JPanel layout="flow" gap="sm" style={{ alignItems: 'center' }}>
      <JButton>Normal</JButton>
      <JButton loading>Cargando...</JButton>
      <JButton icon={<StarIcon />} loading>Con icono cargando</JButton>
      <JButton disabled>Deshabilitado</JButton>
    </JPanel>
  ),
};

export const FullWidth: Story = {
  parameters: {
    docs: {
      description: {
        story: '`fullWidth` estira el botón al 100% del contenedor padre. Patrón común en formularios de login, registro o checkout en mobile.',
      },
    },
  },
  render: () => (
    <JPanel gap="sm" className="max-w-sm">
      <JButton fullWidth icon={<PlusIcon />}>Crear cuenta</JButton>
      <JButton fullWidth variant="outline">Ya tengo cuenta</JButton>
    </JPanel>
  ),
};

export const Interactive: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Flujo async real: el botón entra en `loading` durante la operación y muestra el resultado. Patrón recomendado para submit de formularios, exports y acciones con latencia.',
      },
      source: {
        code: `const [loading, setLoading] = useState(false);
const [done, setDone] = useState(false);

<JButton
  icon={<DownloadIcon />}
  loading={loading}
  fullWidth
  onClick={async () => {
    setLoading(true);
    await fetch('/api/export');
    setLoading(false);
    setDone(true);
  }}
>
  {done ? 'Exportado' : 'Exportar datos'}
</JButton>`,
      },
    },
  },
  args: { onClick: fn() },
  render: (args) => {
    const [loading, setLoading] = useState(false);
    const [done, setDone] = useState(false);

    const handleClick = async (e: React.MouseEvent<HTMLButtonElement>) => {
      args.onClick?.(e);
      setLoading(true);
      await new Promise((r) => setTimeout(r, 1500));
      setLoading(false);
      setDone(true);
    };

    return (
      <JPanel gap="sm" className="max-w-xs">
        <JButton icon={<DownloadIcon />} loading={loading} fullWidth onClick={handleClick}>
          {done ? 'Exportado correctamente' : 'Exportar datos'}
        </JButton>
        {done && (
          <JButton
            variant="outline"
            size="sm"
            fullWidth
            onClick={(e) => { args.onClick?.(e); setDone(false); }}
          >
            Restablecer
          </JButton>
        )}
      </JPanel>
    );
  },
};
