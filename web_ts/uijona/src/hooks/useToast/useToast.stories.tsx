import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { ToastProvider, useToast } from './useToast';
import { JButton } from '../../atoms/JButton/JButton';
import { JTextBox } from '../../atoms/JTextBox/JTextBox';
import { JPanel } from '../../atoms/JPanel/JPanel';

const meta: Meta = {
  title: 'Hooks/useToast',
  tags: ['autodocs'],
  decorators: [(Story) => <ToastProvider><Story /></ToastProvider>],
  parameters: { layout: 'centered' },
};
export default meta;

const ToastDemo = ({ variant, title, message }: {
  variant: 'default' | 'success' | 'warning' | 'danger';
  title?: string;
  message: string;
}) => {
  const { toast } = useToast();
  return (
    <JButton
      variant={variant === 'danger' ? 'destructive' : variant === 'default' ? 'default' : 'outline'}
      onClick={() => toast({ variant, title, message })}
    >
      {title ?? variant}
    </JButton>
  );
};

export const Default: StoryObj = {
  render: () => <ToastDemo variant="default" message="Operación completada" />,
};

export const Success: StoryObj = {
  render: () => <ToastDemo variant="success" title="¡Éxito!" message="Guardado correctamente" />,
};

export const Warning: StoryObj = {
  render: () => <ToastDemo variant="warning" title="Advertencia" message="Tu sesión expirará pronto" />,
};

export const Danger: StoryObj = {
  render: () => <ToastDemo variant="danger" title="Error" message="No se pudo guardar los cambios" />,
};

export const AllToasts: StoryObj = {
  render: () => {
    const { toast } = useToast();
    return (
      <JPanel variant="ghost" padding="none" style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
        <JButton onClick={() => toast({ message: 'Notificación' })}>Default</JButton>
        <JButton variant="outline" onClick={() => toast({ variant: 'success', title: 'Éxito', message: 'Guardado' })}>Success</JButton>
        <JButton variant="outline" onClick={() => toast({ variant: 'warning', title: 'Aviso', message: 'Revisa tu sesión' })}>Warning</JButton>
        <JButton variant="destructive" onClick={() => toast({ variant: 'danger', title: 'Error', message: 'Operación fallida' })}>Danger</JButton>
      </JPanel>
    );
  },
};

const InteractiveForm = () => {
  const { toast } = useToast();
  const [email, setEmail] = useState('');
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
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px', width: '280px' }}>
      <JTextBox
        type="email"
        placeholder="correo@ejemplo.com"
        value={email}
        onChange={setEmail}
      />
      <JButton type="submit" loading={loading} fullWidth>Registrarse</JButton>
    </form>
  );
};

export const Interactive: StoryObj = {
  parameters: {
    docs: {
      source: {
        code: `const { toast } = useToast();

// Inside a ToastProvider:
toast({ variant: 'success', title: '¡Éxito!', message: 'Operación completada' });
toast({ variant: 'danger',  title: 'Error',   message: 'No se pudo guardar los cambios' });
toast({ variant: 'warning', title: 'Aviso',   message: 'Tu sesión expirará pronto' });
toast({ message: 'Notificación sin título' });`,
      },
    },
  },
  render: () => <InteractiveForm />,
};
