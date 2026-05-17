import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { useState } from 'react';
import { DialogMolecule } from './DialogMolecule';
import { JButton } from '../../atoms/JButton/JButton';
import { JTextBox } from '../../atoms/JTextBox/JTextBox';
import { JPanel } from '../../atoms/JPanel/JPanel';
import { JLabel } from '../../atoms/JLabel';

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
          <JPanel variant="ghost" padding="none" style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
            <JButton variant="outline" onClick={() => setOpen(false)}>Cancelar</JButton>
            <JButton variant="destructive" onClick={() => setOpen(false)}>Eliminar</JButton>
          </JPanel>
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
        <JButton onClick={() => setOpen(true)}>Abrir diálogo</JButton>
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

export const Interactive: Story = {
  args: {
    onClose: fn(),
  },
  render: (args) => {
    const [open, setOpen] = useState(false);
    const [name, setName] = useState('Jonathan Franck');
    const [draft, setDraft] = useState('Jonathan Franck');
    return (
      <JPanel variant="ghost" padding="none" className="flex flex-col gap-3 items-start">
        <JLabel size="sm">Nombre actual: <strong>{name}</strong></JLabel>
        <JButton variant="outline" onClick={() => { setDraft(name); setOpen(true); }}>
          Editar nombre
        </JButton>
        <DialogMolecule
          open={open}
          title="Editar perfil"
          description="Modifica tu nombre de usuario y guarda los cambios."
          showCloseButton
          onClose={() => { args.onClose?.(); setOpen(false); }}
          footer={
            <JPanel variant="ghost" padding="none" style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
              <JButton variant="outline" onClick={() => { args.onClose?.(); setOpen(false); }}>Cancelar</JButton>
              <JButton onClick={() => { setName(draft); setOpen(false); }}>Guardar</JButton>
            </JPanel>
          }
        >
          <JTextBox
            value={draft}
            onChange={setDraft}
          />
        </DialogMolecule>
      </JPanel>
    );
  },
};
