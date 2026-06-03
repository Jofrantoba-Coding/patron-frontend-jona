import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { useState } from 'react';
import { JToast, JToastVariant, JToastPosition, JTOAST_DEFAULTS, JTOAST_POSITION_DEFAULT } from './JToast';
import { ToastProvider, useToast } from '../../hooks/useToast';
import { JButton } from '../../atoms/JButton/JButton';
import { JLabel } from '../../atoms/JLabel';
import { cn } from '../../lib/cn';

const meta: Meta<typeof JToast> = {
  title: 'Molecules/JToast',
  component: JToast,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'JToast es la notificación emergente de JONA. Se dispara desde un botón y aparece en la posición configurada. Combina dirección vertical (N/S/centro) con horizontal (E/O/centro). Para gestión global usa `useToast` con `ToastProvider`.',
      },
    },
  },
  args: { onDismiss: fn(), duration: 0 },
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'success', 'warning', 'danger'],
      table: { type: { summary: 'JToastVariant' }, defaultValue: { summary: JTOAST_DEFAULTS.variant } },
    },
    duration: {
      control: 'number',
      description: 'Milisegundos hasta auto-dismiss. 0 = sin auto-dismiss.',
      table: { type: { summary: 'number' }, defaultValue: { summary: String(JTOAST_DEFAULTS.duration) } },
    },
  },
};
export default meta;
type Story = StoryObj<typeof JToast>;

// ── Picker de posición 3×3 ────────────────────────────────────────────────────

const POSITIONS: { key: JToastPosition; label: string }[][] = [
  [
    { key: 'top-left',    label: 'NO' },
    { key: 'top-center',  label: 'N'  },
    { key: 'top-right',   label: 'NE' },
  ],
  [
    { key: 'center-left', label: 'O'  },
    { key: 'center',      label: 'C'  },
    { key: 'center-right',label: 'E'  },
  ],
  [
    { key: 'bottom-left',   label: 'SO' },
    { key: 'bottom-center', label: 'S'  },
    { key: 'bottom-right',  label: 'SE' },
  ],
];

interface PositionPickerProps {
  value: JToastPosition;
  onChange: (p: JToastPosition) => void;
}

const PositionPicker = ({ value, onChange }: PositionPickerProps) => (
  <div className="flex flex-col gap-1">
    <span className="mb-1 text-xs font-semibold text-neutral-500 uppercase tracking-wide">Posición</span>
    <div className="grid grid-cols-3 gap-1 w-28">
      {POSITIONS.flat().map(({ key, label }) => (
        <button
          key={key}
          type="button"
          onClick={() => onChange(key)}
          className={cn(
            'h-8 w-8 rounded text-xs font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500',
            value === key
              ? 'bg-primary-600 text-white'
              : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200',
          )}
        >
          {label}
        </button>
      ))}
    </div>
  </div>
);

// ── Helper interno que consume el contexto ────────────────────────────────────

const ToastTriggers = () => {
  const { toast } = useToast();

  const fire = (variant: JToastVariant, title: string, message: string) =>
    toast({ variant, title, message, duration: 3000 });

  return (
    <div className="flex flex-wrap gap-2">
      <JButton variant="outline"     size="sm" onClick={() => fire('default', '',           'Operación completada')}>Default</JButton>
      <JButton size="sm" className="bg-success-600 hover:bg-success-700 text-white"
                                               onClick={() => fire('success', '¡Éxito!',     'Guardado correctamente')}>Success</JButton>
      <JButton size="sm" className="bg-warning-500 hover:bg-warning-600 text-white"
                                               onClick={() => fire('warning', 'Advertencia', 'Revisa tu conexión')}>Warning</JButton>
      <JButton variant="destructive" size="sm" onClick={() => fire('danger',  'Error',       'No se pudo completar')}>Danger</JButton>
    </div>
  );
};

// ── Stories ───────────────────────────────────────────────────────────────────

export const Default: Story = {
  parameters: { docs: { description: { story: 'Toast por defecto. Haz clic en el botón para mostrarlo.' } } },
  render: (args) => {
    const [visible, setVisible] = useState(false);
    return (
      <div className="flex flex-col gap-4">
        <JButton onClick={() => setVisible(true)}>Mostrar notificación</JButton>
        {visible && (
          <JToast
            {...args}
            id="demo-default"
            message="Operación completada"
            variant="default"
            duration={3000}
            onDismiss={() => { args.onDismiss?.('demo-default'); setVisible(false); }}
          />
        )}
      </div>
    );
  },
};

export const Success: Story = {
  parameters: { docs: { description: { story: 'Variante de éxito.' } } },
  render: (args) => {
    const [visible, setVisible] = useState(false);
    return (
      <div className="flex flex-col gap-4">
        <JButton onClick={() => setVisible(true)}>Mostrar éxito</JButton>
        {visible && (
          <JToast
            {...args}
            id="demo-success"
            title="¡Éxito!"
            message="Tu cuenta fue creada correctamente"
            variant="success"
            duration={3000}
            onDismiss={() => { args.onDismiss?.('demo-success'); setVisible(false); }}
          />
        )}
      </div>
    );
  },
};

export const Warning: Story = {
  parameters: { docs: { description: { story: 'Variante de advertencia.' } } },
  render: (args) => {
    const [visible, setVisible] = useState(false);
    return (
      <div className="flex flex-col gap-4">
        <JButton onClick={() => setVisible(true)}>Mostrar advertencia</JButton>
        {visible && (
          <JToast
            {...args}
            id="demo-warning"
            title="Advertencia"
            message="Tu sesión expirará en 5 minutos"
            variant="warning"
            duration={3000}
            onDismiss={() => { args.onDismiss?.('demo-warning'); setVisible(false); }}
          />
        )}
      </div>
    );
  },
};

export const Danger: Story = {
  parameters: { docs: { description: { story: 'Variante de error.' } } },
  render: (args) => {
    const [visible, setVisible] = useState(false);
    return (
      <div className="flex flex-col gap-4">
        <JButton onClick={() => setVisible(true)}>Mostrar error</JButton>
        {visible && (
          <JToast
            {...args}
            id="demo-danger"
            title="Error"
            message="No se pudo guardar los cambios"
            variant="danger"
            duration={3000}
            onDismiss={() => { args.onDismiss?.('demo-danger'); setVisible(false); }}
          />
        )}
      </div>
    );
  },
};

export const Position: Story = {
  name: 'Posición (brújula)',
  parameters: {
    docs: {
      description: {
        story:
          'Selecciona la posición en la cuadrícula 3×3 (NO, N, NE, O, C, E, SO, S, SE) y dispara toasts con los botones de variante. Los toasts aparecen en la esquina elegida.',
      },
    },
  },
  render: () => {
    const [position, setPosition] = useState<JToastPosition>(JTOAST_POSITION_DEFAULT);

    return (
      <ToastProvider position={position}>
        <div className="flex flex-col gap-6">
          <PositionPicker value={position} onChange={setPosition} />
          <div className="flex flex-col gap-2">
            <JLabel size="sm" color="muted">Posición actual: <strong>{position}</strong></JLabel>
            <ToastTriggers />
          </div>
        </div>
      </ToastProvider>
    );
  },
};
