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
      control: 'select',
      options: Object.keys(JBUTTON_VARIANTS) as JButtonVariant[],
      table: { defaultValue: { summary: JBUTTON_DEFAULTS.variant } },
    },
    size: {
      control: 'select',
      options: (Object.keys(JBUTTON_SIZES) as JButtonSize[]).filter((s) => s !== 'default'),
      table: { defaultValue: { summary: JBUTTON_DEFAULTS.size } },
    },
    iconPosition: {
      control: 'radio',
      options: Object.keys(JBUTTON_ICON_POSITIONS) as JButtonIconPosition[],
      table: { defaultValue: { summary: JBUTTON_DEFAULTS.iconPosition } },
    },
    loading:   { control: 'boolean' },
    fullWidth: { control: 'boolean' },
    disabled:  { control: 'boolean' },
  },
};

export default meta;
type Story = StoryObj<typeof JButton>;

// Icono de demostración (SVG inline, sin dependencia externa)
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
        story: 'Playground interactivo. Modificá cualquier prop desde los controles. Agregá un icono desde iconPosition para ver el posicionamiento.',
      },
    },
  },
  render: (args) => <JButton {...args} icon={<StarIcon />} />,
};

export const Variants: Story = {
  parameters: {
    docs: {
      description: { story: 'Las 6 variantes de JButton. El texto siempre va centrado.' },
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
      description: { story: 'Todos los tamaños disponibles. md es el default.' },
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
        story: 'El icono puede ir en left (default), right, top o bottom. El texto siempre queda centrado respecto al par icono+texto.',
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
      description: { story: 'Botones cuadrados con solo icono. Usar size="icon" y aria-label para accesibilidad.' },
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
      description: { story: 'Botones con icono en distintas variantes y tamaños combinados.' },
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
      description: { story: 'Loading reemplaza el icono con un spinner. Disabled bloquea toda interacción.' },
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
      description: { story: 'fullWidth estira el botón al 100% del contenedor padre. Útil en formularios o mobile.' },
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
      description: { story: 'Flujo async real: el botón entra en loading durante la operación y confirma el resultado.' },
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
