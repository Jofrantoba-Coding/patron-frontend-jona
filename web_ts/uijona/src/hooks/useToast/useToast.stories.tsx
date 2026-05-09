import type { Meta, StoryObj } from '@storybook/react';
import { ToastProvider, useToast } from './useToast';
import { ButtonAtom } from '../../atoms/ButtonAtom/ButtonAtom';

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
    <ButtonAtom
      variant={variant === 'danger' ? 'destructive' : variant === 'default' ? 'default' : 'outline'}
      onClick={() => toast({ variant, title, message })}
    >
      {title ?? variant}
    </ButtonAtom>
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
      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
        <ButtonAtom onClick={() => toast({ message: 'Notificación' })}>Default</ButtonAtom>
        <ButtonAtom variant="outline" onClick={() => toast({ variant: 'success', title: 'Éxito', message: 'Guardado' })}>Success</ButtonAtom>
        <ButtonAtom variant="outline" onClick={() => toast({ variant: 'warning', title: 'Aviso', message: 'Revisa tu sesión' })}>Warning</ButtonAtom>
        <ButtonAtom variant="destructive" onClick={() => toast({ variant: 'danger', title: 'Error', message: 'Operación fallida' })}>Danger</ButtonAtom>
      </div>
    );
  },
};
