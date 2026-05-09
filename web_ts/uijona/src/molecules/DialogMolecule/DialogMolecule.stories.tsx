import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { useState } from 'react';
import { DialogMolecule } from './DialogMolecule';
import { ButtonAtom } from '../../atoms/ButtonAtom/ButtonAtom';

const meta: Meta<typeof DialogMolecule> = {
  title: 'Molecules/DialogMolecule',
  component: DialogMolecule,
  tags: ['autodocs'],
  args: { onClose: fn(), onConfirm: fn(), onCancel: fn() },
  argTypes: {
    open:            { control: 'boolean' },
    showCloseButton: { control: 'boolean' },
  },
};
export default meta;
type Story = StoryObj<typeof DialogMolecule>;

export const Open: Story = {
  args: {
    open: true,
    title: 'Confirmar acción',
    description: '¿Estás seguro de que deseas continuar? Esta acción no se puede deshacer.',
    showCloseButton: true,
  },
};

export const WithFooter: Story = {
  render: () => {
    const [open, setOpen] = useState(true);
    return (
      <DialogMolecule
        open={open}
        title="Eliminar cuenta"
        description="Esta acción eliminará tu cuenta permanentemente."
        onClose={() => setOpen(false)}
        footer={
          <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
            <ButtonAtom variant="outline" onClick={() => setOpen(false)}>Cancelar</ButtonAtom>
            <ButtonAtom variant="destructive" onClick={() => setOpen(false)}>Eliminar</ButtonAtom>
          </div>
        }
      />
    );
  },
};

export const Trigger: Story = {
  render: () => {
    const [open, setOpen] = useState(false);
    return (
      <>
        <ButtonAtom onClick={() => setOpen(true)}>Abrir diálogo</ButtonAtom>
        <DialogMolecule
          open={open}
          title="Diálogo de ejemplo"
          description="Este diálogo fue abierto al hacer clic en el botón."
          onClose={() => setOpen(false)}
        />
      </>
    );
  },
};
