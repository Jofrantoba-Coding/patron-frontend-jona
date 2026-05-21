import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { JImagen, JIMAGEN_DEFAULTS } from './JImagen';
import { JPanel } from '../JPanel/JPanel';
import { JLabel } from '../JLabel';

const sampleSrc = 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=900&q=80';

const meta: Meta<typeof JImagen> = {
  title: 'Atoms/JImagen',
  component: JImagen,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'JImagen es el atom de imagen de JONA. Envuelve `<img>` con control declarativo de aspect ratio, fit mode, radio de borde, carga diferida y fallback. Siempre requiere `src` y `alt`. `block=true` elimina el espacio extra debajo de la imagen inline.',
      },
    },
  },
  args: {
    src: sampleSrc,
    alt: 'Oficina moderna con equipo de trabajo',
    fit: 'cover',
    radius: 'lg',
    aspectRatio: 'video',
    block: true,
    onImageError: fn(),
  },
  argTypes: {
    src: {
      description: 'URL de la imagen. Obligatorio.',
      control: 'text',
      table: { type: { summary: 'string' } },
    },
    alt: {
      description: 'Texto alternativo para accesibilidad. Obligatorio. Describir el contenido de la imagen, no su función.',
      control: 'text',
      table: { type: { summary: 'string' } },
    },
    fit: {
      description: 'Modo de ajuste de la imagen al contenedor. `cover` recorta manteniendo proporción (default), `contain` muestra la imagen completa, `fill` estira, `none` tamaño original, `scale-down` el menor entre none y contain.',
      control: 'select',
      options: ['contain', 'cover', 'fill', 'none', 'scale-down'],
      table: {
        type: { summary: 'JImagenFit' },
        defaultValue: { summary: JIMAGEN_DEFAULTS.fit },
      },
    },
    radius: {
      description: 'Radio de borde del contenedor. `none`, `sm`, `md`, `lg`, `xl`, `full` (circular).',
      control: 'select',
      options: ['none', 'sm', 'md', 'lg', 'xl', 'full'],
      table: {
        type: { summary: 'JImagenRadius' },
        defaultValue: { summary: JIMAGEN_DEFAULTS.radius },
      },
    },
    aspectRatio: {
      description: 'Relación de aspecto del contenedor. `auto` hereda el aspecto natural de la imagen, `square` 1:1, `video` 16:9, `wide` 21:9, `portrait` 3:4.',
      control: 'select',
      options: ['auto', 'square', 'video', 'wide', 'portrait'],
      table: {
        type: { summary: 'JImagenAspectRatio' },
        defaultValue: { summary: JIMAGEN_DEFAULTS.aspectRatio },
      },
    },
    block: {
      description: 'Convierte la imagen en elemento de bloque (`display: block`). Elimina el espacio extra de 4px debajo de las imágenes inline.',
      control: 'boolean',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: String(JIMAGEN_DEFAULTS.block) },
      },
    },
    fallbackSrc: {
      description: 'URL de imagen de respaldo. Se carga si `src` falla. Útil para imágenes de usuario o contenido externo no garantizado.',
      control: 'text',
      table: { type: { summary: 'string' } },
    },
    loading: {
      description: 'Estrategia de carga. `lazy` diferida (default, recomendado para imágenes below-the-fold), `eager` inmediata (para imágenes above-the-fold críticas).',
      control: 'select',
      options: ['lazy', 'eager'],
      table: {
        type: { summary: '"lazy" | "eager"' },
        defaultValue: { summary: JIMAGEN_DEFAULTS.loading },
      },
    },
    decoding: {
      description: 'Estrategia de decodificación. `async` asíncrona sin bloquear el render (default), `auto` lo decide el navegador, `sync` síncrona (raramente necesario).',
      control: 'select',
      options: ['async', 'auto', 'sync'],
      table: {
        type: { summary: '"async" | "auto" | "sync"' },
        defaultValue: { summary: JIMAGEN_DEFAULTS.decoding },
      },
    },
    onImageError: {
      description: 'Callback cuando la imagen falla al cargar. Útil para logging o analytics.',
      table: { type: { summary: '(event: SyntheticEvent) => void' } },
    },
  },
};
export default meta;
type Story = StoryObj<typeof JImagen>;

export const Default: Story = {
  parameters: {
    docs: {
      description: { story: 'Playground interactivo. Modificá fit, radius, aspectRatio y block desde los controles.' },
    },
  },
};

export const AspectRatios: Story = {
  parameters: {
    docs: {
      description: { story: 'Comparación de aspect ratios. El contenedor mantiene la proporción independientemente del tamaño de la imagen original.' },
    },
  },
  render: () => (
    <JPanel layout="grid" columns={3} gap="md" className="w-[600px]">
      {(['square', 'video', 'portrait'] as const).map((ar) => (
        <JPanel key={ar} gap="xs">
          <JImagen src={sampleSrc} alt={`Imagen ${ar}`} aspectRatio={ar} radius="md" block />
          <JLabel as="span" size="sm" color="muted">{ar}</JLabel>
        </JPanel>
      ))}
    </JPanel>
  ),
};

export const Radii: Story = {
  parameters: {
    docs: {
      description: { story: 'Los 6 valores de radio de borde disponibles. `full` produce una imagen circular (requiere `aspectRatio="square"`).' },
    },
  },
  render: () => (
    <JPanel layout="flow" gap="md" className="w-[600px]">
      {(['none', 'sm', 'md', 'lg', 'xl', 'full'] as const).map((r) => (
        <JPanel key={r} gap="xs" className="w-28">
          <JImagen src={sampleSrc} alt={`radius ${r}`} radius={r} aspectRatio="square" block />
          <JLabel as="span" size="xs" color="muted">{r}</JLabel>
        </JPanel>
      ))}
    </JPanel>
  ),
};

export const FitModes: Story = {
  parameters: {
    docs: {
      description: { story: 'Los 5 modos de fit. `cover` es el más común para cards e imágenes de fondo. `contain` para logos o documentos.' },
    },
  },
  render: () => (
    <JPanel layout="grid" columns={3} gap="md" className="w-[600px]">
      {(['contain', 'cover', 'fill', 'none', 'scale-down'] as const).map((f) => (
        <JPanel key={f} gap="xs">
          <JImagen src={sampleSrc} alt={`fit ${f}`} fit={f} aspectRatio="square" radius="md" block />
          <JLabel as="span" size="xs" color="muted">{f}</JLabel>
        </JPanel>
      ))}
    </JPanel>
  ),
};

export const Fallback: Story = {
  args: {
    src: '/missing-image.jpg',
    fallbackSrc: sampleSrc,
    alt: 'Imagen con fallback',
    radius: 'md',
    aspectRatio: 'video',
    block: true,
  },
  parameters: {
    docs: {
      description: { story: 'La imagen principal falla (URL rota) y se carga `fallbackSrc` automáticamente. Patrón para imágenes de usuario o contenido externo.' },
    },
  },
};

export const LazyLoading: Story = {
  args: {
    src: sampleSrc,
    alt: 'Carga diferida',
    loading: 'lazy',
    aspectRatio: 'video',
    radius: 'md',
    block: true,
  },
  parameters: {
    docs: {
      description: { story: '`loading="lazy"` (default) difiere la carga hasta que la imagen está cerca del viewport. Usar `loading="eager"` para imágenes above-the-fold que deben cargarse inmediatamente.' },
    },
  },
};
