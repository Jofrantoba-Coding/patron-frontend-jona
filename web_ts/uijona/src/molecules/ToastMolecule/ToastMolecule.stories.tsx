import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { useState } from 'react';
import { ToastMolecule } from './ToastMolecule';
import { PanelAtom } from '../../atoms/PanelAtom/PanelAtom';
import { ButtonAtom } from '../../atoms/ButtonAtom/ButtonAtom';
import { TextAtom } from '../../atoms/TextAtom/TextAtom';

const meta: Meta<typeof ToastMolecule> = {
  title: 'Molecules/ToastMolecule',
  component: ToastMolecule,
  tags: ['autodocs'],
  args: {
    onDismiss: fn(),
    // duration=0 en stories estáticas: evita que el timer dispare onDismiss en background
    duration: 0,
  },
  argTypes: {
    variant:  { control: 'select', options: ['default', 'success', 'warning', 'danger'] },
    duration: { control: 'number' },
  },
};
export default meta;
type Story = StoryObj<typeof ToastMolecule>;

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
  render: () => (
    <PanelAtom variant="ghost" padding="none" className="flex flex-col gap-2 w-80">
      <ToastMolecule id="1" message="Notificación por defecto" variant="default" duration={0} />
      <ToastMolecule id="2" title="Éxito" message="Guardado correctamente" variant="success" duration={0} />
      <ToastMolecule id="3" title="Advertencia" message="Revisa tu conexión" variant="warning" duration={0} />
      <ToastMolecule id="4" title="Error" message="No se pudo completar" variant="danger" duration={0} />
    </PanelAtom>
  ),
};

// Historia interactiva: simula la gestión de visibilidad que haría useToast
export const Interactive: Story = {
  parameters: {
    docs: {
      source: {
        code: `// ToastMolecule es presentacional — gestiona su propia visibilidad vía useToast
<ToastMolecule
  id="toast-1"
  variant="success"
  title="¡Éxito!"
  message="Acción completada correctamente"
  duration={3000}
  onDismiss={(id) => removeToast(id)}
/>`,
      },
    },
  },
  args: {
    onDismiss: fn(),
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
      <PanelAtom variant="ghost" padding="none" className="flex flex-col gap-4">
        <PanelAtom variant="ghost" padding="none" className="flex flex-wrap gap-2">
          <ButtonAtom variant="outline" size="sm" onClick={() => add('default', 'Notificación por defecto')}>Default</ButtonAtom>
          <ButtonAtom size="sm" className="bg-success-600 hover:bg-success-700 text-white" onClick={() => add('success', 'Acción completada con éxito')}>Success</ButtonAtom>
          <ButtonAtom size="sm" className="bg-warning-500 hover:bg-warning-600 text-white" onClick={() => add('warning', 'Revisa esta advertencia')}>Warning</ButtonAtom>
          <ButtonAtom variant="destructive" size="sm" onClick={() => add('danger', 'Ocurrió un error')}>Danger</ButtonAtom>
        </PanelAtom>
        <PanelAtom variant="ghost" padding="none" className="flex flex-col gap-2 w-80">
          {toasts.map((t) => (
            <ToastMolecule key={t.id} id={t.id} message={t.message} variant={t.variant}
              duration={3000} onDismiss={dismiss} />
          ))}
          {toasts.length === 0 && (
            <TextAtom size="sm" className="text-neutral-400">Sin notificaciones. Haz clic en un botón.</TextAtom>
          )}
        </PanelAtom>
      </PanelAtom>
    );
  },
};
