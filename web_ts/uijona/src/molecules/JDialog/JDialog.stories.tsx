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
          'JDialog es la ventana de diálogo flotante de JONA. Usa `JPanel layout="border"` internamente: la **barra de título** (`top`) contiene el título, descripción opcional y el botón cerrar; el **área central** (`center`) aloja los controles con scroll automático; la **barra de botones** (`bottom`) alinea las acciones a la derecha. Se renderiza en portal, bloquea el scroll del body, cierra con ESC y con clic fuera de la ventana.',
      },
    },
  },
  args: {
    onClose:   fn(),
    onConfirm: fn(),
    onCancel:  fn(),
    onOpened:  fn(),
    onClosed:  fn(),
  },
  argTypes: {
    open: {
      description: 'Controla la visibilidad de la ventana.',
      control: 'boolean',
      table: { type: { summary: 'boolean' } },
    },
    title: {
      description: 'Texto de la barra de título. Se muestra truncado si es largo.',
      control: 'text',
      table: { type: { summary: 'string' } },
    },
    description: {
      description: 'Subtítulo opcional bajo el título en la barra de título.',
      control: 'text',
      table: { type: { summary: 'string' } },
    },
    showCloseButton: {
      description: 'Muestra el botón × en la barra de título.',
      control: 'boolean',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: String(JDIALOG_DEFAULTS.showCloseButton) },
      },
    },
    size: {
      description: 'Ancho máximo de la ventana.',
      control: 'select',
      options: ['sm', 'md', 'lg', 'xl'],
      table: {
        type: { summary: 'JDialogSize' },
        defaultValue: { summary: JDIALOG_DEFAULTS.size },
      },
    },
    children: {
      description: 'Controles del área central. Ocupa el espacio disponible y hace scroll si el contenido desborda.',
      table: { type: { summary: 'ReactNode' } },
    },
    footer: {
      description: 'Botones de la barra inferior. Se alinean a la derecha automáticamente.',
      table: { type: { summary: 'ReactNode' } },
    },
    titleBarClassName: {
      description: 'Clases extra para la barra de título (`area="top"`).',
      control: 'text',
      table: { type: { summary: 'string' } },
    },
    contentClassName: {
      description: 'Clases extra para el área central (`area="center"`).',
      control: 'text',
      table: { type: { summary: 'string' } },
    },
    footerClassName: {
      description: 'Clases extra para la barra de botones (`area="bottom"`).',
      control: 'text',
      table: { type: { summary: 'string' } },
    },
    onClose: {
      description: 'Callback al cerrar: clic en overlay, clic en botón × o tecla ESC.',
      table: { type: { summary: '() => void' } },
    },
    onOpened: {
      description: 'Callback al abrirse por primera vez.',
      table: { type: { summary: '() => void' } },
    },
    onClosed: {
      description: 'Callback tras cerrarse, ejecutado en el siguiente frame.',
      table: { type: { summary: '() => void' } },
    },
  },
};
export default meta;
type Story = StoryObj<typeof JDialog>;

// ── Stories ───────────────────────────────────────────────────────────────────

export const Default: Story = {
  parameters: {
    docs: {
      description: { story: 'Ventana básica sin footer. La barra de título (`top`) tiene el título, la descripción y el botón ×. El área central (`center`) está vacía.' },
    },
  },
  render: (args) => {
    const [open, setOpen] = useState(false);
    return (
      <>
        <JButton onClick={() => setOpen(true)}>Abrir diálogo</JButton>
        <JDialog
          {...args}
          open={open}
          title="Ventana de diálogo"
          description="Barra de título con descripción opcional."
          onClose={() => { args.onClose?.(); setOpen(false); }}
          onOpened={args.onOpened}
          onClosed={args.onClosed}
        />
      </>
    );
  },
};

export const WithFooter: Story = {
  name: 'Con barra de botones',
  parameters: {
    docs: {
      description: { story: 'La barra de botones (`bottom`) aparece solo cuando se provee `footer`. Los botones se alinean a la derecha automáticamente.' },
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
          description="Esta acción no se puede deshacer."
          onClose={() => setOpen(false)}
          footer={
            <>
              <JButton variant="outline" onClick={() => setOpen(false)}>Cancelar</JButton>
              <JButton variant="destructive" onClick={() => setOpen(false)}>Eliminar</JButton>
            </>
          }
        />
      </>
    );
  },
};

export const WithControls: Story = {
  name: 'Con controles en el centro',
  parameters: {
    docs: {
      description: { story: 'El área central acepta cualquier control. Aquí un formulario con campos de texto. La barra de botones contiene las acciones del formulario.' },
    },
  },
  render: () => {
    const [open,  setOpen]  = useState(true);
    const [name,  setName]  = useState('');
    const [email, setEmail] = useState('');
    return (
      <>
        <JButton onClick={() => setOpen(true)}>Abrir formulario</JButton>
        <JDialog
          open={open}
          title="Nuevo usuario"
          description="Completa los datos para crear la cuenta."
          onClose={() => setOpen(false)}
          footer={
            <>
              <JButton variant="outline" onClick={() => setOpen(false)}>Cancelar</JButton>
              <JButton onClick={() => setOpen(false)}>Crear usuario</JButton>
            </>
          }
        >
          <JPanel layout="box" gap="sm">
            <JPanel layout="box" gap="xs">
              <JLabel size="sm">Nombre completo</JLabel>
              <JTextBox value={name} onChange={setName} placeholder="Jonathan Franck" />
            </JPanel>
            <JPanel layout="box" gap="xs">
              <JLabel size="sm">Correo electrónico</JLabel>
              <JTextBox value={email} onChange={setEmail} placeholder="jona@example.com" type="email" />
            </JPanel>
          </JPanel>
        </JDialog>
      </>
    );
  },
};

export const Sizes: Story = {
  parameters: {
    docs: {
      description: { story: 'Los 4 tamaños de ventana: `sm` (384px), `md` (448px), `lg` (512px), `xl` (576px).' },
    },
  },
  render: () => {
    const [openSize, setOpenSize] = useState<string | null>(null);
    return (
      <JPanel layout="flow" gap="sm">
        {(['sm', 'md', 'lg', 'xl'] as const).map((size) => (
          <JButton key={size} variant="outline" size="sm" onClick={() => setOpenSize(size)}>
            size="{size}"
          </JButton>
        ))}
        {(['sm', 'md', 'lg', 'xl'] as const).map((size) => (
          <JDialog
            key={size}
            open={openSize === size}
            size={size}
            title={`Diálogo size="${size}"`}
            description="Ajusta el ancho con la prop size."
            onClose={() => setOpenSize(null)}
            footer={<JButton onClick={() => setOpenSize(null)}>Cerrar</JButton>}
          >
            <JLabel size="sm" color="muted">Contenido del área central.</JLabel>
          </JDialog>
        ))}
      </JPanel>
    );
  },
};

export const WithoutCloseButton: Story = {
  name: 'Sin botón cerrar',
  parameters: {
    docs: {
      description: { story: '`showCloseButton=false` oculta el botón × de la barra de título. El cierre solo es posible mediante los botones del footer o ESC.' },
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
          description="Debes aceptar o rechazar antes de continuar."
          showCloseButton={false}
          onClose={() => setOpen(false)}
          footer={
            <>
              <JButton variant="outline" onClick={() => setOpen(false)}>Rechazar</JButton>
              <JButton onClick={() => setOpen(false)}>Aceptar</JButton>
            </>
          }
        />
      </>
    );
  },
};

export const ScrollableContent: Story = {
  name: 'Contenido con scroll',
  parameters: {
    docs: {
      description: { story: 'Si el contenido del área central supera la altura disponible, hace scroll automáticamente. La barra de título y la barra de botones permanecen fijas.' },
    },
  },
  render: () => {
    const [open, setOpen] = useState(true);
    return (
      <>
        <JButton variant="outline" onClick={() => setOpen(true)}>Abrir diálogo</JButton>
        <JDialog
          open={open}
          title="Términos y condiciones"
          description="Lee el documento completo antes de aceptar."
          onClose={() => setOpen(false)}
          footer={
            <>
              <JButton variant="outline" onClick={() => setOpen(false)}>Rechazar</JButton>
              <JButton onClick={() => setOpen(false)}>Aceptar</JButton>
            </>
          }
        >
          <JPanel layout="box" gap="sm">
            {Array.from({ length: 12 }, (_, i) => (
              <JLabel key={i} size="sm" color="muted">
                {i + 1}. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
              </JLabel>
            ))}
          </JPanel>
        </JDialog>
      </>
    );
  },
};

export const Interactive: Story = {
  parameters: {
    docs: {
      description: { story: 'Edición de perfil con campo controlado. El draft se inicializa con el valor actual al abrir; solo actualiza el nombre al pulsar Guardar.' },
    },
  },
  args: { onClose: fn(), onOpened: fn(), onClosed: fn() },
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
          description="Modifica tu nombre de usuario."
          showCloseButton
          onClose={() => { args.onClose?.(); setOpen(false); }}
          onOpened={args.onOpened}
          onClosed={args.onClosed}
          footer={
            <>
              <JButton variant="outline" onClick={() => { args.onClose?.(); setOpen(false); }}>Cancelar</JButton>
              <JButton onClick={() => { setName(draft); setOpen(false); }}>Guardar</JButton>
            </>
          }
        >
          <JPanel layout="box" gap="xs">
            <JLabel size="sm">Nombre completo</JLabel>
            <JTextBox value={draft} onChange={setDraft} />
          </JPanel>
        </JDialog>
      </JPanel>
    );
  },
};
