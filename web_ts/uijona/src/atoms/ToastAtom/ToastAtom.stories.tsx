import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { ToastAtom } from './ToastAtom';

const meta: Meta<typeof ToastAtom> = {
  title: 'Atoms/ToastAtom',
  component: ToastAtom,
  tags: ['autodocs'],
  args: { onDismiss: fn() },
  argTypes: {
    variant: { control: 'select', options: ['default', 'success', 'warning', 'danger'] },
  },
};
export default meta;
type Story = StoryObj<typeof ToastAtom>;

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
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', width: '360px' }}>
      <ToastAtom id="1" message="Notificación por defecto" variant="default" />
      <ToastAtom id="2" title="Éxito" message="Guardado correctamente" variant="success" />
      <ToastAtom id="3" title="Advertencia" message="Revisa tu conexión" variant="warning" />
      <ToastAtom id="4" title="Error" message="No se pudo completar" variant="danger" />
    </div>
  ),
};
