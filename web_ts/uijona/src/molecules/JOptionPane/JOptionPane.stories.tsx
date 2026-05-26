import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { useState } from 'react';
import { JOptionPane, JOPTIONPANE_DEFAULTS } from './JOptionPane';
import { JButton } from '../../atoms/JButton/JButton';
import { JPanel } from '../../atoms/JPanel/JPanel';
import { JLabel } from '../../atoms/JLabel';

const meta: Meta<typeof JOptionPane> = {
  title: 'Molecules/JOptionPane',
  component: JOptionPane,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'JOptionPane es el diálogo de confirmación de JONA, inspirado en `javax.swing.JOptionPane`. Presenta al usuario una pregunta con un ícono semántico (`danger`, `warning`, `info`) y dos acciones: confirmar o cancelar. Se renderiza en portal sobre `document.body`, cierra con ESC o clic en overlay (ambos disparan `onCancel`). Soporta estado de carga mientras se procesa la acción. Reemplaza a `ConfirmDialogMolecule`.',
      },
    },
  },
  args: {
    open:        false,
    title:       '¿Confirmar acción?',
    description: 'Esta acción no se puede deshacer.',
    onConfirm:   fn(),
    onCancel:    fn(),
  },
  argTypes: {
    open: {
      description: 'Controla la visibilidad del panel. `true` lo muestra sobre el contenido.',
      control: 'boolean',
      table: { type: { summary: 'boolean' } },
    },
    title: {
      description: 'Pregunta principal que el usuario debe responder. Asociada vía `aria-labelledby`.',
      control: 'text',
      table: { type: { summary: 'string' } },
    },
    description: {
      description: 'Contexto adicional bajo el título. Asociado vía `aria-describedby`.',
      control: 'text',
      table: { type: { summary: 'string' } },
    },
    variant: {
      description: 'Semántica del diálogo. `danger` para acciones destructivas, `warning` para acciones con consecuencias, `info` para confirmaciones neutras.',
      control: 'select',
      options: ['danger', 'warning', 'info'],
      table: {
        type: { summary: 'JOptionPaneVariant' },
        defaultValue: { summary: JOPTIONPANE_DEFAULTS.variant },
      },
    },
    confirmLabel: {
      description: 'Texto del botón de confirmación.',
      control: 'text',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: JOPTIONPANE_DEFAULTS.confirmLabel },
      },
    },
    cancelLabel: {
      description: 'Texto del botón de cancelación.',
      control: 'text',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: JOPTIONPANE_DEFAULTS.cancelLabel },
      },
    },
    isLoading: {
      description: 'Muestra spinner en el botón de confirmación y deshabilita cancelar mientras se procesa la acción.',
      control: 'boolean',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: String(JOPTIONPANE_DEFAULTS.isLoading) },
      },
    },
    onConfirm: {
      description: 'Callback al pulsar el botón de confirmación.',
      table: { type: { summary: '() => void' } },
    },
    onCancel: {
      description: 'Callback al cancelar: clic en botón Cancelar, clic en overlay o tecla ESC.',
      table: { type: { summary: '() => void' } },
    },
  },
};
export default meta;
type Story = StoryObj<typeof JOptionPane>;

// ── Stories ───────────────────────────────────────────────────────────────────

export const Danger: Story = {
  args: {
    open:        true,
    variant:     'danger',
    title:       'Eliminar registro',
    description: 'Esta acción eliminará el registro permanentemente y no se puede deshacer.',
  },
  parameters: {
    docs: {
      description: { story: '`variant="danger"` con ícono rojo y botón destructivo. Usar para acciones irreversibles como eliminar datos.' },
    },
  },
};

export const Warning: Story = {
  args: {
    open:        true,
    variant:     'warning',
    title:       'Cambios sin guardar',
    description: '¿Deseas continuar sin guardar los cambios realizados?',
  },
  parameters: {
    docs: {
      description: { story: '`variant="warning"` con ícono amarillo y botón default. Usar para acciones que tienen consecuencias pero no son destructivas.' },
    },
  },
};

export const Info: Story = {
  args: {
    open:        true,
    variant:     'info',
    title:       'Publicar contenido',
    description: '¿Estás seguro de que deseas publicar este contenido ahora?',
  },
  parameters: {
    docs: {
      description: { story: '`variant="info"` con ícono azul y botón default. Usar para confirmaciones neutras que no implican riesgo.' },
    },
  },
};

export const Loading: Story = {
  args: {
    open:      true,
    variant:   'danger',
    title:     'Eliminando…',
    isLoading: true,
  },
  parameters: {
    docs: {
      description: { story: '`isLoading=true` muestra spinner en el botón de confirmación y deshabilita cancelar. Activar mientras se procesa la petición al servidor.' },
    },
  },
};

export const CustomLabels: Story = {
  name: 'Labels personalizados',
  args: {
    open:         true,
    variant:      'danger',
    title:        'Dar de baja suscripción',
    description:  'Perderás el acceso a todas las funcionalidades premium al finalizar el período actual.',
    confirmLabel: 'Sí, dar de baja',
    cancelLabel:  'Mantener suscripción',
  },
  parameters: {
    docs: {
      description: { story: '`confirmLabel` y `cancelLabel` permiten adaptar el texto de los botones al contexto específico de la acción.' },
    },
  },
};

export const Interactive: Story = {
  parameters: {
    docs: {
      description: { story: 'Flujo completo: el botón exterior abre el panel, `onConfirm` y `onCancel` cierran y registran el resultado.' },
    },
  },
  args: { onConfirm: fn(), onCancel: fn() },
  render: (args) => {
    const [open,   setOpen]   = useState(false);
    const [result, setResult] = useState<string | null>(null);
    return (
      <JPanel variant="ghost" padding="none" className="flex flex-col items-start gap-4">
        <JButton variant="destructive" onClick={() => setOpen(true)}>
          Eliminar elemento
        </JButton>
        {result && (
          <JLabel size="sm" color="muted">Resultado: <strong>{result}</strong></JLabel>
        )}
        <JOptionPane
          open={open}
          variant="danger"
          title="Eliminar elemento"
          description="¿Estás seguro? Esta acción no se puede deshacer."
          onConfirm={() => { args.onConfirm?.(); setResult('Confirmado'); setOpen(false); }}
          onCancel={() => { args.onCancel?.(); setResult('Cancelado'); setOpen(false); }}
        />
      </JPanel>
    );
  },
};
