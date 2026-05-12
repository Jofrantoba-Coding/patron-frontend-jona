import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { useState } from 'react';
import { ConfirmDialogMolecule } from './ConfirmDialogMolecule';
import { ButtonAtom } from '../../atoms/ButtonAtom/ButtonAtom';
import { PanelAtom } from '../../atoms/PanelAtom/PanelAtom';
import { TextAtom } from '../../atoms/TextAtom/TextAtom';

const meta: Meta<typeof ConfirmDialogMolecule> = {
  title: 'Molecules/ConfirmDialogMolecule',
  component: ConfirmDialogMolecule,
  tags: ['autodocs'],
  args: {
    open: false,
    title: '¿Confirmar acción?',
    description: 'Esta acción no se puede deshacer.',
    onConfirm: fn(),
    onCancel: fn(),
  },
  argTypes: {
    variant:   { control: 'select', options: ['danger', 'warning', 'info'] },
    open:      { control: 'boolean' },
    isLoading: { control: 'boolean' },
  },
};
export default meta;
type Story = StoryObj<typeof ConfirmDialogMolecule>;

export const Danger: Story = {
  args: { open: true, variant: 'danger', title: 'Eliminar registro', description: 'Esta acción eliminará el registro permanentemente.' },
};

export const Warning: Story = {
  args: { open: true, variant: 'warning', title: 'Cambios sin guardar', description: '¿Deseas continuar sin guardar los cambios realizados?' },
};

export const Info: Story = {
  args: { open: true, variant: 'info', title: 'Publicar contenido', description: '¿Estás seguro de que deseas publicar este contenido ahora?' },
};

export const Loading: Story = {
  args: { open: true, variant: 'danger', title: 'Eliminando...', isLoading: true },
};

export const Interactive: Story = {
  args: {
    onConfirm: fn(),
    onCancel: fn(),
  },
  render: (args) => {
    const [open, setOpen] = useState(false);
    const [result, setResult] = useState<string | null>(null);
    return (
      <PanelAtom variant="ghost" padding="none" className="flex flex-col items-start gap-4">
        <ButtonAtom variant="destructive" onClick={() => setOpen(true)}>
          Eliminar elemento
        </ButtonAtom>
        {result && <TextAtom size="sm" className="text-neutral-600">Resultado: {result}</TextAtom>}
        <ConfirmDialogMolecule
          open={open}
          variant="danger"
          title="Eliminar elemento"
          description="¿Estás seguro? Esta acción no se puede deshacer."
          onConfirm={() => { args.onConfirm?.(); setResult('Confirmado'); setOpen(false); }}
          onCancel={() => { args.onCancel?.(); setResult('Cancelado'); setOpen(false); }}
        />
      </PanelAtom>
    );
  },
};
