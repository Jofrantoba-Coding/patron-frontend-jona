import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { useState } from 'react';
import { JToast, JTOAST_DEFAULTS } from './JToast';
import { JPanel } from '../../atoms/JPanel/JPanel';
import { JButton } from '../../atoms/JButton/JButton';
import { JLabel } from '../../atoms/JLabel';

const meta: Meta<typeof JToast> = {
  title: 'Molecules/JToast',
  component: JToast,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'JToast es la notificación emergente de JONA. Muestra un mensaje con variante de color, título opcional y botón de cierre. El auto-dismiss se controla con `duration`. Para gestionar múltiples toasts usa `useToast`.',
      },
    },
  },
  args: {
    onDismiss: fn(),
    duration: 0,
  },
  argTypes: {
    variant:  {
      control: 'select',
      options: ['default', 'success', 'warning', 'danger'],
      table: {
        type: { summary: 'JToastVariant' },
        defaultValue: { summary: JTOAST_DEFAULTS.variant },
      },
    },
    duration: {
      control: 'number',
      description: 'Milisegundos hasta auto-dismiss. 0 = sin auto-dismiss.',
      table: {
        type: { summary: 'number' },
        defaultValue: { summary: String(JTOAST_DEFAULTS.duration) },
      },
    },
  },
};
export default meta;
type Story = StoryObj<typeof JToast>;

export const Default: Story = {
  args: { id: '1', message: 'Operación completada', variant: 'default' },
};

export const Success: Story = {
  args: { id: '2', title: '¡Éxito!', message: 'Tu cuenta fue creada correctamente', variant: 'success' },
};

export const Warning: Story = {
  args: { id: '3', title: 'Advertencia', message: 'Tu sesión expirará en 5 minutos', variant: 'warning' },
};

export const Danger: Story = {
  args: { id: '4', title: 'Error', message: 'No se pudo guardar los cambios', variant: 'danger' },
};

export const AllVariants: Story = {
  parameters: {
    docs: {
      description: { story: 'Las cuatro variantes de JToast.' },
    },
  },
  render: () => (
    <div className="flex w-80 flex-col gap-2">
      <JToast id="1" message="Notificación por defecto" variant="default" duration={0} />
      <JToast id="2" title="Éxito"       message="Guardado correctamente" variant="success" duration={0} />
      <JToast id="3" title="Advertencia" message="Revisa tu conexión"     variant="warning" duration={0} />
      <JToast id="4" title="Error"       message="No se pudo completar"   variant="danger"  duration={0} />
    </div>
  ),
};

export const Interactive: Story = {
  parameters: {
    docs: {
      description: { story: 'Simula la gestión de visibilidad. Cada toast se auto-descarta en 3 s o con el botón ×.' },
    },
  },
  render: (args) => {
    const [toasts, setToasts] = useState<{ id: string; variant: 'default' | 'success' | 'warning' | 'danger'; message: string }[]>([]);
    let counter = 0;

    const add = (variant: 'default' | 'success' | 'warning' | 'danger', message: string) => {
      const id = String(++counter);
      setToasts((prev) => [...prev, { id, variant, message }]);
    };

    const dismiss = (id: string) => {
      args.onDismiss?.(id);
      setToasts((prev) => prev.filter((t) => t.id !== id));
    };

    return (
      <JPanel variant="ghost" padding="none" className="flex flex-col gap-4">
        <div className="flex flex-wrap gap-2">
          <JButton variant="outline"     size="sm" onClick={() => add('default', 'Notificación por defecto')}>Default</JButton>
          <JButton size="sm" className="bg-success-600 hover:bg-success-700 text-white" onClick={() => add('success', 'Acción completada con éxito')}>Success</JButton>
          <JButton size="sm" className="bg-warning-500 hover:bg-warning-600 text-white" onClick={() => add('warning', 'Revisa esta advertencia')}>Warning</JButton>
          <JButton variant="destructive" size="sm" onClick={() => add('danger',  'Ocurrió un error')}>Danger</JButton>
        </div>
        <div className="flex w-80 flex-col gap-2">
          {toasts.map((t) => (
            <JToast key={t.id} id={t.id} message={t.message} variant={t.variant} duration={3000} onDismiss={dismiss} />
          ))}
          {toasts.length === 0 && (
            <JLabel size="sm" className="text-neutral-400">Sin notificaciones. Haz clic en un botón.</JLabel>
          )}
        </div>
      </JPanel>
    );
  },
};
