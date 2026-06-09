import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { useState } from 'react';
import { JAlert, JALERT_DEFAULTS } from './JAlert';
import { JButton } from '../../atoms/JButton/JButton';
import { JPanel } from '../../atoms/JPanel/JPanel';
import { JLabel } from '../../atoms/JLabel';

// ── Icons ─────────────────────────────────────────────────────────────────────

const InfoIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} aria-hidden="true">
    <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
  </svg>
);
const CheckIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round" d="M22 11.08V12a10 10 0 11-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>
  </svg>
);
const WarningIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round" d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
  </svg>
);
const DangerIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} aria-hidden="true">
    <circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/>
  </svg>
);

// ── Meta ──────────────────────────────────────────────────────────────────────

const meta: Meta<typeof JAlert> = {
  title: 'Molecules/JAlert',
  component: JAlert,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'JAlert es el componente de alerta de JONA. Comunica mensajes informativos, de estado o de error al usuario. Soporta 5 variantes semánticas de color, título opcional, ícono personalizable y botón de cierre integrado (`dismissible`). El callback `onDismiss` delega al padre la decisión de eliminar la alerta del DOM. Reemplaza a `JAlert` con más variantes y soporte de dismiss.',
      },
    },
  },
  args: {
    children: 'Tu sesión expirará en 10 minutos.',
    style: { width: '400px' },
    onDismiss: fn(),
  },
  argTypes: {
    variant: {
      description: 'Color semántico. `default` neutro, `info` azul informativo, `success` verde confirmación, `warning` amarillo precaución, `danger` rojo error.',
      control: 'select',
      options: ['default', 'info', 'success', 'warning', 'danger'],
      table: {
        type: { summary: 'JAlertVariant' },
        defaultValue: { summary: JALERT_DEFAULTS.variant },
      },
    },
    title: {
      description: 'Encabezado de la alerta en negrita. Opcional: si se omite, solo se muestra el contenido.',
      control: 'text',
      table: { type: { summary: 'string' } },
    },
    icon: {
      description: 'Ícono a la izquierda del contenido. Usar SVG de 16×16px. El layout reserva espacio automáticamente con `pl-11`.',
      table: { type: { summary: 'ReactNode' } },
    },
    dismissible: {
      description: 'Muestra un botón × para cerrar la alerta. El cierre real lo gestiona el padre en `onDismiss` (p.ej. eliminando la alerta del array de estado).',
      control: 'boolean',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: String(JALERT_DEFAULTS.dismissible) },
      },
    },
    onDismiss: {
      description: 'Callback al pulsar el botón de cierre. Solo se invoca cuando `dismissible=true`. El padre decide si elimina o anima la alerta.',
      table: { type: { summary: '() => void' } },
    },
    children: {
      description: 'Contenido de la alerta. Acepta texto o JSX. Los `<p>` dentro reciben `leading-relaxed` automáticamente.',
      table: { type: { summary: 'ReactNode' } },
    },
  },
};
export default meta;
type Story = StoryObj<typeof JAlert>;

// ── Stories ───────────────────────────────────────────────────────────────────

export const Default: Story = {
  args: { title: 'Información' },
  parameters: {
    docs: {
      description: { story: 'Variante `default` neutra. Playground interactivo para explorar todas las props.' },
    },
  },
};

export const Info: Story = {
  args: { variant: 'info', title: 'Novedad', icon: <InfoIcon />, children: 'La versión 2.0 de JONA está disponible. Revisa el changelog para más detalles.' },
  parameters: {
    docs: {
      description: { story: '`variant="info"` en azul. Usar para mensajes informativos no urgentes: novedades, actualizaciones o sugerencias.' },
    },
  },
};

export const Success: Story = {
  args: { variant: 'success', title: 'Guardado', icon: <CheckIcon />, children: 'Los cambios se guardaron correctamente.' },
  parameters: {
    docs: {
      description: { story: '`variant="success"` en verde. Usar para confirmar que una acción se completó exitosamente.' },
    },
  },
};

export const Warning: Story = {
  args: { variant: 'warning', title: 'Atención', icon: <WarningIcon />, children: 'Tu suscripción vence en 3 días. Renueva para no perder el acceso.' },
  parameters: {
    docs: {
      description: { story: '`variant="warning"` en amarillo. Usar para advertir de situaciones que requieren acción pero no son errores.' },
    },
  },
};

export const Danger: Story = {
  args: { variant: 'danger', title: 'Error', icon: <DangerIcon />, children: 'No se pudo procesar el pago. Verifica los datos de tu tarjeta.' },
  parameters: {
    docs: {
      description: { story: '`variant="danger"` en rojo. Usar para errores que impiden al usuario continuar.' },
    },
  },
};

export const WithoutTitle: Story = {
  args: { variant: 'info', children: 'Mensaje informativo sin título. Útil para alertas cortas en línea.' },
  parameters: {
    docs: {
      description: { story: 'Sin `title`. El contenido ocupa el espacio completo. Ideal para mensajes de una sola línea.' },
    },
  },
};

export const Dismissible: Story = {
  args: { variant: 'warning', title: 'Sesión próxima a expirar', icon: <WarningIcon />, dismissible: true, children: 'Tu sesión expirará en 5 minutos. Guarda tu trabajo.' },
  parameters: {
    docs: {
      description: { story: '`dismissible=true` muestra el botón × en la esquina. El padre debe eliminar la alerta del DOM en `onDismiss`.' },
    },
  },
};

export const AllVariants: Story = {
  name: 'Todas las variantes',
  parameters: {
    docs: {
      description: { story: 'Las 5 variantes semánticas con ícono y título. Usar la variante que coincida con la naturaleza del mensaje.' },
    },
  },
  render: () => (
    <JPanel layout="box" gap="sm" style={{ width: 440 }}>
      <JAlert variant="default" title="Default"  icon={<InfoIcon />}>Mensaje neutro informativo.</JAlert>
      <JAlert variant="info"    title="Info"     icon={<InfoIcon />}>Actualización disponible.</JAlert>
      <JAlert variant="success" title="Success"  icon={<CheckIcon />}>Operación completada.</JAlert>
      <JAlert variant="warning" title="Warning"  icon={<WarningIcon />}>Acción requerida pronto.</JAlert>
      <JAlert variant="danger"  title="Danger"   icon={<DangerIcon />}>Error al procesar la solicitud.</JAlert>
    </JPanel>
  ),
};

export const Interactive: Story = {
  parameters: {
    docs: {
      description: { story: 'Lista de alertas descartables. `onDismiss` elimina la alerta del array; el padre controla qué alertas siguen visibles.' },
    },
  },
  args: { onDismiss: fn() },
  render: (args) => {
    const initial = [
      { id: 1, variant: 'info'    as const, title: 'Novedad',   message: 'La versión 2.0 está disponible.',          icon: <InfoIcon />   },
      { id: 2, variant: 'success' as const, title: 'Guardado',  message: 'Los cambios se guardaron correctamente.',   icon: <CheckIcon />  },
      { id: 3, variant: 'warning' as const, title: 'Atención',  message: 'Tu suscripción vence en 3 días.',          icon: <WarningIcon />},
      { id: 4, variant: 'danger'  as const, title: 'Error',     message: 'No se pudo procesar el pago.',             icon: <DangerIcon /> },
    ];
    const [alerts, setAlerts] = useState(initial);
    const dismiss = (id: number) => { args.onDismiss?.(); setAlerts((a) => a.filter((x) => x.id !== id)); };

    return (
      <JPanel layout="box" gap="sm" style={{ width: 440 }}>
        {alerts.map((a) => (
          <JAlert
            key={a.id}
            variant={a.variant}
            title={a.title}
            icon={a.icon}
            dismissible
            onDismiss={() => dismiss(a.id)}
          >
            {a.message}
          </JAlert>
        ))}
        {alerts.length === 0 && (
          <JLabel size="sm" color="muted">Sin alertas activas.</JLabel>
        )}
        <JButton variant="outline" size="sm" onClick={() => setAlerts(initial)}>
          Restaurar alertas
        </JButton>
      </JPanel>
    );
  },
};
