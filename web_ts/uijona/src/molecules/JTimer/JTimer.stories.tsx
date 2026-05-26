import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { JTimer, JTIMER_DEFAULTS } from './JTimer';
import { JPanel } from '../../atoms/JPanel/JPanel';

const meta: Meta<typeof JTimer> = {
  title: 'Molecules/JTimer',
  component: JTimer,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'JTimer es el componente de temporizador de JONA. Soporta modo `countdown` (cuenta regresiva) y `stopwatch` (cronómetro), control total vía props o estado interno, botones opcionales de inicio/pausa/reinicio, formatter personalizable y 3 variantes de presentación. Reemplaza a `TimerMolecule`.',
      },
    },
  },
  args: {
    label:       'Timer',
    mode:        'countdown',
    durationMs:  300_000,
    tickIntervalMs: 1000,
    controls:    true,
    variant:     'card',
    size:        'md',
    tone:        'neutral',
    onChange:    fn(),
    onTick:      fn(),
    onStart:     fn(),
    onPause:     fn(),
    onResume:    fn(),
    onReset:     fn(),
    onComplete:  fn(),
  },
  argTypes: {
    mode: {
      description: '`countdown` cuenta regresiva desde `durationMs` hasta `minMs`. `stopwatch` cuenta hacia adelante desde 0 (o `defaultValueMs`).',
      control: 'inline-radio',
      options: ['countdown', 'stopwatch'],
      table: {
        type: { summary: 'JTimerMode' },
        defaultValue: { summary: JTIMER_DEFAULTS.mode },
      },
    },
    variant: {
      description: '`card` con borde y fondo blanco. `plain` sin contenedor. `inline` horizontal, ideal para barras de navegación.',
      control: 'inline-radio',
      options: ['plain', 'card', 'inline'],
      table: {
        type: { summary: 'JTimerVariant' },
        defaultValue: { summary: JTIMER_DEFAULTS.variant },
      },
    },
    size: {
      description: 'Tamaño del display de dígitos, etiqueta y botones.',
      control: 'inline-radio',
      options: ['sm', 'md', 'lg'],
      table: {
        type: { summary: 'JTimerSize' },
        defaultValue: { summary: JTIMER_DEFAULTS.size },
      },
    },
    tone: {
      description: 'Color semántico del display de dígitos.',
      control: 'inline-radio',
      options: ['neutral', 'success', 'warning', 'danger', 'info'],
      table: {
        type: { summary: 'JTimerTone' },
        defaultValue: { summary: JTIMER_DEFAULTS.tone },
      },
    },
    durationMs: {
      description: 'Duración inicial en ms para modo `countdown`. También es el valor de reinicio.',
      control: { type: 'number', min: 0, step: 1000 },
      table: {
        type: { summary: 'number' },
        defaultValue: { summary: String(JTIMER_DEFAULTS.durationMs) },
      },
    },
    defaultValueMs: {
      description: 'Valor inicial en modo no controlado. Sobreescribe `durationMs` en countdown y 0 en stopwatch.',
      control: { type: 'number', min: 0, step: 1000 },
      table: { type: { summary: 'number' } },
    },
    valueMs: {
      description: 'Valor controlado en ms. Combinar con `onChange` para modo controlado.',
      control: { type: 'number', min: 0, step: 1000 },
      table: { type: { summary: 'number' } },
    },
    maxMs: {
      description: 'Límite superior en ms para modo `stopwatch`. Al alcanzarlo, dispara `onComplete`.',
      control: { type: 'number', min: 0, step: 1000 },
      table: { type: { summary: 'number' } },
    },
    tickIntervalMs: {
      description: 'Intervalo de tick en ms (mín 16). Bajar a 50–100 para mostrar milisegundos con fluidez.',
      control: { type: 'number', min: 16, step: 100 },
      table: {
        type: { summary: 'number' },
        defaultValue: { summary: String(JTIMER_DEFAULTS.tickIntervalMs) },
      },
    },
    controls: {
      description: 'Muestra los botones de inicio, pausa y reinicio.',
      control: 'boolean',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: String(JTIMER_DEFAULTS.controls) },
      },
    },
    autoStart: {
      description: 'Arranca el timer automáticamente al montar.',
      control: 'boolean',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: String(JTIMER_DEFAULTS.autoStart) },
      },
    },
    loop: {
      description: 'Al completarse, reinicia automáticamente desde el principio.',
      control: 'boolean',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: String(JTIMER_DEFAULTS.loop) },
      },
    },
    resetOnComplete: {
      description: 'Al completarse, vuelve a mostrar el botón Iniciar en lugar de quedar bloqueado.',
      control: 'boolean',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: String(JTIMER_DEFAULTS.resetOnComplete) },
      },
    },
    showHours: {
      description: 'Muestra el segmento de horas incluso cuando es cero.',
      control: 'boolean',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: String(JTIMER_DEFAULTS.showHours) },
      },
    },
    showMilliseconds: {
      description: 'Añade `.ms` al display. Requiere `tickIntervalMs` ≤ 100 para verse fluido.',
      control: 'boolean',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: String(JTIMER_DEFAULTS.showMilliseconds) },
      },
    },
    formatter: {
      description: 'Función que recibe `JTimerFormatContext` y devuelve el nodo a mostrar. Sobreescribe el formato digital por defecto.',
      table: { type: { summary: '(context: JTimerFormatContext) => ReactNode' } },
    },
    onChange: {
      description: 'Se dispara en cada tick y en reinicio/completado. Recibe `(valueMs, status)`.',
      table: { type: { summary: '(valueMs: number, status: JTimerStatus) => void' } },
    },
    onComplete: {
      description: 'Se dispara una vez al alcanzar el límite (o en cada vuelta si `loop=true`).',
      table: { type: { summary: '() => void' } },
    },
  },
  decorators: [(Story) => <JPanel variant="ghost" padding="none" className="w-full max-w-sm"><Story /></JPanel>],
};
export default meta;
type Story = StoryObj<typeof JTimer>;

// ── Stories ───────────────────────────────────────────────────────────────────

export const Countdown: Story = {
  args: {
    label:          'Cuenta regresiva',
    durationMs:     90_000,
    completedLabel: 'Tiempo finalizado',
    tone:           'info',
  },
  parameters: {
    docs: {
      description: { story: 'Modo `countdown` desde 90 s. `completedLabel` aparece cuando llega a cero. `tone="info"` colorea los dígitos en azul.' },
    },
  },
};

export const Stopwatch: Story = {
  args: {
    mode:           'stopwatch',
    label:          'Cronómetro',
    defaultValueMs: 0,
    tickIntervalMs: 250,
    tone:           'success',
  },
  parameters: {
    docs: {
      description: { story: 'Modo `stopwatch` con tick de 250 ms para actualización fluida sin llegar a milisegundos.' },
    },
  },
};

export const WithMilliseconds: Story = {
  name: 'Con milisegundos',
  args: {
    mode:             'stopwatch',
    label:            'Alta precisión',
    tickIntervalMs:   50,
    showMilliseconds: true,
    showHours:        false,
    size:             'lg',
  },
  parameters: {
    docs: {
      description: { story: '`showMilliseconds=true` + `tickIntervalMs=50` para display de alta precisión. `showHours=false` cuando la duración esperada no supera los 59 min.' },
    },
  },
};

export const AutoStartLoop: Story = {
  name: 'AutoStart + Loop',
  args: {
    label:          'Pomodoro corto',
    durationMs:     10_000,
    autoStart:      true,
    loop:           true,
    completedLabel: 'Reiniciando…',
    tone:           'warning',
  },
  parameters: {
    docs: {
      description: { story: '`autoStart=true` arranca al montar. `loop=true` reinicia automáticamente al llegar a cero. Útil para timers de intervalo.' },
    },
  },
};

export const Inline: Story = {
  args: {
    variant:   'inline',
    mode:      'stopwatch',
    label:     undefined,
    size:      'sm',
    showHours: false,
  },
  parameters: {
    docs: {
      description: { story: '`variant="inline"` renderiza dígitos y botones en una sola línea. Ideal para toolbars o encabezados de sección.' },
    },
  },
};

export const CustomFormatter: Story = {
  name: 'Formatter personalizado',
  args: {
    mode:       'countdown',
    durationMs: 125_000,
    label:      'Formato custom',
    formatter:  ({ minutes, seconds }) => `${minutes} min ${seconds} seg`,
  },
  parameters: {
    docs: {
      description: { story: '`formatter` recibe `JTimerFormatContext` y devuelve cualquier ReactNode. Útil para mostrar el tiempo en formato verbal o con estilos propios.' },
    },
  },
};

export const Sizes: Story = {
  parameters: {
    docs: {
      description: { story: 'Los 3 tamaños: `sm` compacto, `md` estándar, `lg` para pantallas de cuenta regresiva prominentes.' },
    },
  },
  render: () => (
    <JPanel layout="box" gap="md" className="w-80">
      {(['sm', 'md', 'lg'] as const).map((size) => (
        <JTimer key={size} label={size} durationMs={90_000} size={size} variant="card" />
      ))}
    </JPanel>
  ),
};
