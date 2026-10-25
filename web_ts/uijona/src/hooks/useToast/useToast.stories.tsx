import type { Meta, StoryObj } from '@storybook/react';
import { useEffect, useState } from 'react';
import { ToastProvider, useToast } from './useToast';
import { JToastPosition, JTOAST_POSITION_DEFAULT } from '../../molecules/JToast';
import { JButton } from '../../atoms/JButton/JButton';
import { JTextBox } from '../../atoms/JTextBox/JTextBox';
import { JLabel } from '../../atoms/JLabel';
import { cn } from '../../lib/cn';

const meta: Meta = {
  title: 'Hooks/useToast',
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          '`ToastProvider` + `useToast()`. Posición por defecto `bottom-right` (1.5.1); para apps de captura de datos se recomienda `top-right`, porque abajo el toast tapa la paginación. `danger` se anuncia como `role="alert"`; el resto como `role="status"` educado.',
      },
    },
  },
};
export default meta;

// ── Picker de posición 3×3 ────────────────────────────────────────────────────

const POSITIONS: { key: JToastPosition; label: string }[][] = [
  [
    { key: 'top-left',      label: 'NO' },
    { key: 'top-center',    label: 'N'  },
    { key: 'top-right',     label: 'NE' },
  ],
  [
    { key: 'center-left',   label: 'O' },
    { key: 'center',        label: 'C' },
    { key: 'center-right',  label: 'E' },
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
    <span className="mb-1 text-xs font-semibold uppercase tracking-wide text-neutral-500">Posición</span>
    <div className="grid w-28 grid-cols-3 gap-1">
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

// ── Stories ───────────────────────────────────────────────────────────────────

export const Default: StoryObj = {
  render: () => (
    <ToastProvider>
      <ToastDemo variant="default" message="Operación completada" />
    </ToastProvider>
  ),
};

export const Success: StoryObj = {
  render: () => (
    <ToastProvider>
      <ToastDemo variant="success" title="¡Éxito!" message="Guardado correctamente" />
    </ToastProvider>
  ),
};

export const Warning: StoryObj = {
  render: () => (
    <ToastProvider>
      <ToastDemo variant="warning" title="Advertencia" message="Tu sesión expirará pronto" />
    </ToastProvider>
  ),
};

export const Danger: StoryObj = {
  render: () => (
    <ToastProvider>
      <ToastDemo variant="danger" title="Error" message="No se pudo guardar los cambios" />
    </ToastProvider>
  ),
};

export const Position: StoryObj = {
  parameters: {
    docs: {
      description: {
        story:
          'Elige la posición en la cuadrícula 3×3 (NO/N/NE/O/C/E/SO/S/SE) y dispara toasts. El `ToastProvider` recibe la prop `position` y reposiciona el contenedor.',
      },
    },
  },
  render: () => {
    const [position, setPosition] = useState<JToastPosition>(JTOAST_POSITION_DEFAULT);

    const Triggers = () => {
      const { toast } = useToast();
      return (
        <div className="flex flex-wrap gap-2">
          <JButton variant="outline"     size="sm" onClick={() => toast({ message: 'Notificación por defecto' })}>Default</JButton>
          <JButton size="sm" className="bg-success-600 hover:bg-success-600 text-white"
                                                   onClick={() => toast({ variant: 'success', title: '¡Éxito!',     message: 'Guardado correctamente' })}>Success</JButton>
          <JButton size="sm" className="bg-warning-500 hover:bg-warning-600 text-white"
                                                   onClick={() => toast({ variant: 'warning', title: 'Advertencia', message: 'Revisa tu conexión' })}>Warning</JButton>
          <JButton variant="destructive" size="sm" onClick={() => toast({ variant: 'danger',  title: 'Error',       message: 'No se pudo completar' })}>Danger</JButton>
        </div>
      );
    };

    return (
      <ToastProvider position={position}>
        <div className="flex flex-col gap-6">
          <PositionPicker value={position} onChange={setPosition} />
          <div className="flex flex-col gap-2">
            <JLabel size="sm" color="muted">Posición actual: <strong>{position}</strong></JLabel>
            <Triggers />
          </div>
        </div>
      </ToastProvider>
    );
  },
};

export const Interactive: StoryObj = {
  parameters: {
    docs: {
      source: {
        code: `const { toast } = useToast();

// Dentro de un ToastProvider:
toast({ variant: 'success', title: '¡Éxito!', message: 'Operación completada' });
toast({ variant: 'danger',  title: 'Error',   message: 'No se pudo guardar los cambios' });
toast({ variant: 'warning', title: 'Aviso',   message: 'Tu sesión expirará pronto' });
toast({ message: 'Notificación sin título' });`,
      },
    },
  },
  render: () => (
    <ToastProvider>
      <InteractiveForm />
    </ToastProvider>
  ),
};

// ── Componentes auxiliares ────────────────────────────────────────────────────

function ToastDemo({ variant, title, message }: {
  variant: 'default' | 'success' | 'warning' | 'danger';
  title?: string;
  message: string;
}) {
  const { toast } = useToast();
  return (
    <JButton
      variant={variant === 'danger' ? 'destructive' : variant === 'default' ? 'default' : 'outline'}
      onClick={() => toast({ variant, title, message })}
    >
      {title ?? `Mostrar ${variant}`}
    </JButton>
  );
}

function InteractiveForm() {
  const { toast } = useToast();
  const [email, setEmail]     = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: { preventDefault(): void }) => {
    e.preventDefault();
    if (!email.includes('@')) {
      toast({ variant: 'danger', title: 'Error de validación', message: 'Ingresa un email válido.' });
      return;
    }
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1200));
    setLoading(false);
    toast({ variant: 'success', title: '¡Registrado!', message: `Cuenta creada para ${email}.` });
    setEmail('');
  };

  return (
    <form onSubmit={handleSubmit} className="flex w-72 flex-col gap-3">
      <JTextBox type="email" placeholder="correo@ejemplo.com" value={email} onChange={setEmail} />
      <JButton type="submit" loading={loading} fullWidth>Registrarse</JButton>
    </form>
  );
}

/** Shows a success toast and a persistent error on mount, so the stack is visible without a click. */
function RecommendedDemo() {
  const { toast } = useToast();
  useEffect(() => {
    toast({ variant: 'success', title: 'Registro creado', message: '0002 · CUSCO', duration: 0 });
    toast({ variant: 'danger', title: 'Error', message: 'No se pudo guardar los cambios', duration: 0 });
  }, [toast]);
  return <JTextBox aria-label="Filtro" placeholder="El foco se queda aquí" />;
}

export const RecommendedForForms: StoryObj = {
  name: 'Recomendado para formularios (top-right)',
  parameters: {
    docs: {
      description: {
        story:
          'Para apps de captura de datos se recomienda `position="top-right"`: abajo, el toast tapa la paginación. `label`, `dismissLabel` y `offset` permiten textos en español y otra separación del borde sin cambiar los valores por defecto de 1.5.1. Los toasts `danger` se anuncian como `role="alert"`; `duration: 0` los mantiene hasta cerrarlos; el temporizador se pausa con el puntero encima o con el foco dentro, y mostrar un toast nunca mueve el foco.',
      },
    },
  },
  render: () => (
    <ToastProvider position="top-right" label="Notificaciones" dismissLabel="Cerrar notificación">
      <RecommendedDemo />
    </ToastProvider>
  ),
};
