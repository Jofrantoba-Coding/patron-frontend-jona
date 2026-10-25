import type { Meta, StoryObj } from '@storybook/react';
import { useEffect, useState } from 'react';
import { ConfirmProvider, CONFIRM_DEFAULTS, useConfirm } from './useConfirm';
import type { ConfirmOptions } from './useConfirm';
import { JButton } from '../../atoms/JButton/JButton';
import { JLabel } from '../../atoms/JLabel';
import { JDialog } from '../../molecules/JDialog';

const meta: Meta = {
  title: 'Hooks/useConfirm',
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          '`useConfirm()` devuelve `confirm(options)`, una promesa que resuelve `true` (confirmar) o `false` (cancelar, Esc, cerrar o desmontar). Se monta un `ConfirmProvider` en la raíz. Las llamadas seguidas se muestran de una en una, en orden. Sin `renderPane`, mientras el confirm está abierto Esc solo lo responde a él: un `JDialog` debajo sigue abierto. `danger` enfoca el botón de cancelar. Valores por defecto: ' +
          `\`variant: '${CONFIRM_DEFAULTS.variant}'\`, \`confirmLabel: '${CONFIRM_DEFAULTS.confirmLabel}'\`, \`cancelLabel: '${CONFIRM_DEFAULTS.cancelLabel}'\`.`,
      },
    },
  },
  decorators: [(Story) => <ConfirmProvider><Story /></ConfirmProvider>],
};
export default meta;
type Story = StoryObj;

const DELETE: ConfirmOptions = {
  title: 'Eliminar',
  description: 'Se eliminará el registro.',
  details: '0002 · CUSCO',
  variant: 'danger',
  confirmLabel: 'Eliminar',
  cancelLabel: 'No',
};

const Asker = ({ options, label }: { options: ConfirmOptions; label: string }) => {
  const confirm = useConfirm();
  const [answer, setAnswer] = useState<string>('Sin respuesta');
  return (
    <div className="flex flex-col items-center gap-2">
      <JButton onClick={async () => setAnswer((await confirm(options)) ? 'Confirmado' : 'Cancelado')}>{label}</JButton>
      <JLabel size="sm" color="muted">{answer}</JLabel>
    </div>
  );
};

export const Danger: Story = {
  render: () => <Asker options={DELETE} label="Eliminar registro" />,
};

export const Info: Story = {
  render: () => <Asker options={{ title: 'Guardar cambios', description: '¿Guardar los cambios?', confirmLabel: 'Guardar', cancelLabel: 'No' }} label="Guardar" />,
};

/** Opens the confirm over an open dialog on mount: Esc closes the confirm first, then the dialog. */
const OverDialog = () => {
  const confirm = useConfirm();
  const [open, setOpen] = useState(true);
  const [answer, setAnswer] = useState('Sin respuesta');
  useEffect(() => {
    void confirm(DELETE).then((value) => setAnswer(value ? 'Confirmado' : 'Cancelado'));
  }, [confirm]);
  return (
    <>
      <JButton onClick={() => setOpen(true)}>Abrir diálogo</JButton>
      <JDialog open={open} title="Cliente" onClose={() => setOpen(false)}>
        <JLabel size="sm">Respuesta del confirm: {answer}</JLabel>
      </JDialog>
    </>
  );
};

export const OverADialog: Story = {
  name: 'Sobre un diálogo',
  render: () => <OverDialog />,
};
