import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { useState } from 'react';
import { JDialog, JDIALOG_DEFAULTS } from './JDialog';
import { JButton } from '../../atoms/JButton/JButton';
import { JTextBox } from '../../atoms/JTextBox/JTextBox';
import { JPanel } from '../../atoms/JPanel/JPanel';
import { JLabel } from '../../atoms/JLabel';

const meta: Meta<typeof JDialog> = {
  title: 'Molecules/JDialog',
  component: JDialog,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'JDialog es el componente de diálogo modal de JONA. Se renderiza en un portal sobre `document.body`, bloquea el scroll del body mientras está abierto, cierra con ESC y al hacer clic en el overlay. Soporta título, descripción, botón de cierre opcional, contenido libre (`children`) y pie de página (`footer`) para acciones. Reemplaza a `DialogMolecule`.',
      },
    },
  },
  args: { onClose: fn(), onConfirm: fn(), onCancel: fn() },
  argTypes: {
    open: {
      description: 'Controla la visibilidad del diálogo. `true` lo muestra, `false` lo oculta sin desmontar el árbol padre.',
      control: 'boolean',
      table: { type: { summary: 'boolean' } },
    },
    title: {
      description: 'Encabezado del diálogo. Se asocia al `role="dialog"` vía `aria-labelledby`.',
      control: 'text',
      table: { type: { summary: 'string' } },
    },
    description: {
      description: 'Subtexto descriptivo bajo el título. Se asocia vía `aria-describedby`.',
      control: 'text',
      table: { type: { summary: 'string' } },
    },
    showCloseButton: {
      description: 'Muestra el botón × en la esquina superior derecha. Al pulsarlo llama a `onCancel` y luego a `onClose`.',
      control: 'boolean',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: String(JDIALOG_DEFAULTS.showCloseButton) },
      },
    },
    children: {
      description: 'Contenido del cuerpo del diálogo. Acepta cualquier ReactNode.',
      table: { type: { summary: 'ReactNode' } },
    },
    footer: {
      description: 'Pie del diálogo para colocar botones de acción. Se alinea a la derecha en pantallas ≥ sm.',
      table: { type: { summary: 'ReactNode' } },
    },
    onClose: {
      description: 'Callback al cerrar: clic en overlay, clic en botón × o tecla ESC.',
      table: { type: { summary: '() => void' } },
    },
    onOpened: {
      description: 'Callback al abrirse por primera vez (transición `false → true`).',
      table: { type: { summary: '() => void' } },
    },
    onClosed: {
      description: 'Callback tras cerrarse (transición `true → false`), ejecutado en el siguiente frame de animación.',
      table: { type: { summary: '() => void' } },
    },
    onConfirm: {
      description: 'Callback de confirmación. El padre decide cuándo llamarlo desde el `footer`.',
      table: { type: { summary: '() => void' } },
    },
    onCancel: {
      description: 'Callback de cancelación. Se llama al pulsar el botón ×.',
      table: { type: { summary: '() => void' } },
    },
  },
};
export default meta;
type Story = StoryObj<typeof JDialog>;

// ── Stories ───────────────────────────────────────────────────────────────────

export const Open: Story = {
  args: {
    open:            true,
    title:           'Confirmar acción',
    description:     '¿Estás seguro de que deseas continuar? Esta acción no se puede deshacer.',
    showCloseButton: true,
  },
  parameters: {
    docs: {
      description: { story: 'Diálogo simple sin footer. El botón × y el overlay llaman a `onClose`. Pulsa ESC para cerrar.' },
    },
  },
};

export const WithFooter: Story = {
  name: 'Con footer',
  parameters: {
    docs: {
      description: { story: '`footer` con botones Cancelar y Eliminar alineados a la derecha. Ambos cierran el diálogo.' },
    },
  },
  render: () => {
    const [open, setOpen] = useState(true);
    return (
      <>
        <JButton variant="outline" onClick={() => setOpen(true)}>Abrir diálogo</JButton>
        <JDialog
          open={open}
          title="Eliminar cuenta"
          description="Esta acción eliminará tu cuenta permanentemente."
          onClose={() => setOpen(false)}
          footer={
            <JPanel variant="ghost" padding="none" className="flex gap-2 justify-end">
              <JButton variant="outline" onClick={() => setOpen(false)}>Cancelar</JButton>
              <JButton variant="destructive" onClick={() => setOpen(false)}>Eliminar</JButton>
            </JPanel>
          }
        />
      </>
    );
  },
};

export const Trigger: Story = {
  name: 'Abierto por botón',
  parameters: {
    docs: {
      description: { story: 'Patrón más habitual: botón externo controla `open`. El diálogo se oculta sin desmontarse.' },
    },
  },
  render: () => {
    const [open, setOpen] = useState(false);
    return (
      <>
        <JButton onClick={() => setOpen(true)}>Abrir diálogo</JButton>
        <JDialog
          open={open}
          title="Diálogo de ejemplo"
          description="Este diálogo fue abierto al hacer clic en el botón."
          onClose={() => setOpen(false)}
        />
      </>
    );
  },
};

export const WithoutCloseButton: Story = {
  name: 'Sin botón de cierre',
  parameters: {
    docs: {
      description: { story: '`showCloseButton=false` fuerza al usuario a usar los botones del footer. Útil para flujos donde no se debe cancelar fácilmente.' },
    },
  },
  render: () => {
    const [open, setOpen] = useState(true);
    return (
      <>
        <JButton variant="outline" onClick={() => setOpen(true)}>Abrir diálogo</JButton>
        <JDialog
          open={open}
          title="Acción requerida"
          description="Debes tomar una decisión antes de continuar."
          showCloseButton={false}
          onClose={() => setOpen(false)}
          footer={
            <JPanel variant="ghost" padding="none" className="flex gap-2 justify-end">
              <JButton variant="outline" onClick={() => setOpen(false)}>Rechazar</JButton>
              <JButton onClick={() => setOpen(false)}>Aceptar</JButton>
            </JPanel>
          }
        />
      </>
    );
  },
};

export const Interactive: Story = {
  parameters: {
    docs: {
      description: { story: 'Edición de perfil con campo controlado. El diálogo preserva el draft interno; solo actualiza el nombre al guardar.' },
    },
  },
  args: { onClose: fn() },
  render: (args) => {
    const [open,  setOpen]  = useState(false);
    const [name,  setName]  = useState('Jonathan Franck');
    const [draft, setDraft] = useState('Jonathan Franck');
    return (
      <JPanel variant="ghost" padding="none" className="flex flex-col gap-3 items-start">
        <JLabel size="sm">Nombre actual: <strong>{name}</strong></JLabel>
        <JButton variant="outline" onClick={() => { setDraft(name); setOpen(true); }}>
          Editar nombre
        </JButton>
        <JDialog
          open={open}
          title="Editar perfil"
          description="Modifica tu nombre de usuario y guarda los cambios."
          showCloseButton
          onClose={() => { args.onClose?.(); setOpen(false); }}
          footer={
            <JPanel variant="ghost" padding="none" className="flex gap-2 justify-end">
              <JButton variant="outline" onClick={() => { args.onClose?.(); setOpen(false); }}>Cancelar</JButton>
              <JButton onClick={() => { setName(draft); setOpen(false); }}>Guardar</JButton>
            </JPanel>
          }
        >
          <JTextBox value={draft} onChange={setDraft} />
        </JDialog>
      </JPanel>
    );
  },
};
