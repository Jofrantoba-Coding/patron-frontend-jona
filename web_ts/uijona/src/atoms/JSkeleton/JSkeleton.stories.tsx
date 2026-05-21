import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { JSkeleton, JSKELETON_DEFAULTS } from './JSkeleton';
import { JButton } from '../JButton/JButton';
import { JPanel } from '../JPanel/JPanel';
import { JLabel } from '../JLabel';

const meta: Meta<typeof JSkeleton> = {
  title: 'Atoms/JSkeleton',
  component: JSkeleton,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'JSkeleton es el atom de placeholder de carga de JONA. Muestra un rectángulo animado como marcador de posición mientras el contenido real se está cargando. Usar `className` para controlar dimensiones (`h-4 w-48`, `h-10 w-10`). `circle=true` aplica borde circular para avatares. Combinar múltiples instancias para replicar el layout del contenido real y reducir el efecto de salto al cargar.',
      },
    },
  },
  argTypes: {
    circle: {
      description: 'Aplica borde circular (`border-radius: 50%`). Usar para skeletons de avatares o iconos circulares.',
      control: 'boolean',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: String(JSKELETON_DEFAULTS.circle) },
      },
    },
    variant: {
      description: 'Tipo de animación. `pulse` (default) opacidad pulsante, `wave` efecto de onda horizontal, `none` sin animación (útil para testing o reducción de movimiento).',
      control: 'radio',
      options: ['pulse', 'wave', 'none'],
      table: {
        type: { summary: 'JSkeletonVariant' },
        defaultValue: { summary: JSKELETON_DEFAULTS.variant },
      },
    },
  },
};
export default meta;
type Story = StoryObj<typeof JSkeleton>;

export const Line: Story = {
  args: { className: 'h-4 w-48' },
  parameters: {
    docs: {
      description: { story: 'Skeleton de línea de texto. Controlar alto (`h-4`=16px) y ancho (`w-48`=192px) con `className`.' },
    },
  },
};

export const Circle: Story = {
  args: { circle: true, className: 'h-10 w-10' },
  parameters: {
    docs: {
      description: { story: '`circle=true` produce un skeleton circular. Dimensiones iguales en alto y ancho para mantener la proporción.' },
    },
  },
};

export const WaveLine: Story = {
  args: { variant: 'wave', className: 'h-4 w-48' },
  parameters: {
    docs: {
      description: { story: 'Variante `wave` con efecto de onda horizontal. Preferir sobre `pulse` cuando hay varios skeletons en pantalla para evitar el parpadeo sincronizado.' },
    },
  },
};

export const AllVariants: Story = {
  parameters: {
    docs: {
      description: { story: 'Las 3 variantes de animación comparadas. `none` es útil para tests con `prefers-reduced-motion` o para snapshots de Storybook.' },
    },
  },
  render: () => (
    <JPanel layout="box" gap="lg" style={{ width: 280 }}>
      {(['pulse', 'wave', 'none'] as const).map((v) => (
        <JPanel layout="flow" gap="sm" alignItems="center" key={v}>
          <JSkeleton variant={v} circle className="h-8 w-8 shrink-0" />
          <JPanel layout="box" gap="xs" className="flex-1">
            <JSkeleton variant={v} className="h-3 w-full" />
            <JSkeleton variant={v} className="h-3 w-3/4" />
          </JPanel>
          <JLabel size="xs" color="muted" className="shrink-0">{v}</JLabel>
        </JPanel>
      ))}
    </JPanel>
  ),
};

export const CardSkeleton: Story = {
  parameters: {
    docs: {
      description: { story: 'Skeleton completo de una card de usuario. Replica el layout real: avatar circular + dos líneas de texto + tres líneas de contenido.' },
    },
  },
  render: () => (
    <JPanel layout="box" gap="sm" className="p-4" style={{ width: 320 }}>
      <JPanel layout="flow" gap="sm" alignItems="center">
        <JSkeleton circle className="h-10 w-10 shrink-0" />
        <JPanel layout="box" gap="xs" className="flex-1">
          <JSkeleton className="h-4 w-32" />
          <JSkeleton className="h-3 w-24" />
        </JPanel>
      </JPanel>
      <JSkeleton className="h-4 w-full" />
      <JSkeleton className="h-4 w-4/5" />
      <JSkeleton className="h-4 w-3/5" />
    </JPanel>
  ),
};

export const WaveCard: Story = {
  parameters: {
    docs: {
      description: { story: 'Skeleton de card con variante `wave`. Todos los skeletons del mismo grupo deben usar la misma variante para coherencia visual.' },
    },
  },
  render: () => (
    <JPanel layout="box" gap="sm" className="p-4" style={{ width: 320 }}>
      <JPanel layout="flow" gap="sm" alignItems="center">
        <JSkeleton variant="wave" circle className="h-10 w-10 shrink-0" />
        <JPanel layout="box" gap="xs" className="flex-1">
          <JSkeleton variant="wave" className="h-4 w-32" />
          <JSkeleton variant="wave" className="h-3 w-24" />
        </JPanel>
      </JPanel>
      <JSkeleton variant="wave" className="h-4 w-full" />
      <JSkeleton variant="wave" className="h-4 w-4/5" />
      <JSkeleton variant="wave" className="h-4 w-3/5" />
    </JPanel>
  ),
};

export const Interactive: Story = {
  parameters: {
    docs: {
      description: { story: 'Toggle entre skeleton y contenido real. El skeleton debe replicar fielmente el layout del contenido para evitar el salto visual al cargar.' },
    },
  },
  render: () => {
    const [loaded, setLoaded] = useState(false);
    return (
      <JPanel layout="box" gap="md" style={{ width: 320 }}>
        {loaded ? (
          <JPanel layout="flow" gap="sm" alignItems="center" className="p-4 border border-neutral-200 rounded-lg">
            <JPanel layout="box" alignItems="center" justifyContent="center" className="h-10 w-10 rounded-full bg-primary-100 font-bold text-primary-700 text-sm shrink-0">
              JF
            </JPanel>
            <JPanel layout="box">
              <JLabel size="sm" className="font-semibold">Jonathan Franck</JLabel>
              <JLabel size="xs" className="text-neutral-400">jofrantoba@gmail.com</JLabel>
            </JPanel>
          </JPanel>
        ) : (
          <JPanel layout="flow" gap="sm" alignItems="center" className="p-4 border border-neutral-200 rounded-lg">
            <JSkeleton variant="wave" circle className="h-10 w-10 shrink-0" />
            <JPanel layout="box" gap="xs" className="flex-1">
              <JSkeleton variant="wave" className="h-4 w-32" />
              <JSkeleton variant="wave" className="h-3 w-48" />
            </JPanel>
          </JPanel>
        )}
        <JButton variant="outline" onClick={() => setLoaded((l) => !l)}>
          {loaded ? 'Mostrar skeleton' : 'Simular carga completa'}
        </JButton>
      </JPanel>
    );
  },
};
