import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { useState } from 'react';
import { JTooltip, JTOOLTIP_DEFAULTS } from './JTooltip';
import { JButton } from '../../atoms/JButton/JButton';
import { JLabel } from '../../atoms/JLabel';

const meta: Meta<typeof JTooltip> = {
  title: 'Molecules/JTooltip',
  component: JTooltip,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'JTooltip muestra un texto informativo al hacer hover o focus sobre el elemento hijo. Soporta las cuatro posiciones (top/bottom/left/right), delay configurable y teclado Escape para cerrarlo. Accesible vía `role="tooltip"` + `aria-describedby`.',
      },
    },
  },
  args: { onShow: fn(), onHide: fn() },
  argTypes: {
    side: {
      control: 'select',
      options: ['top', 'bottom', 'left', 'right'],
      table: { type: { summary: 'JTooltipSide' }, defaultValue: { summary: JTOOLTIP_DEFAULTS.side } },
    },
    delayMs: {
      control: { type: 'number', min: 0, max: 2000, step: 100 },
      table: { type: { summary: 'number' }, defaultValue: { summary: String(JTOOLTIP_DEFAULTS.delayMs) } },
    },
  },
  decorators: [
    (Story) => (
      <div className="flex items-center justify-center p-16">
        <Story />
      </div>
    ),
  ],
};
export default meta;
type Story = StoryObj<typeof JTooltip>;

export const Top: Story = {
  args: {
    content:  'Tooltip arriba',
    side:     'top',
    children: <JButton variant="outline">Hover aquí</JButton>,
  },
};

export const Bottom: Story = {
  args: {
    content:  'Tooltip abajo',
    side:     'bottom',
    children: <JButton variant="outline">Hover aquí</JButton>,
  },
};

export const Left: Story = {
  args: {
    content:  'Tooltip izquierda',
    side:     'left',
    children: <JButton variant="outline">Hover aquí</JButton>,
  },
};

export const Right: Story = {
  args: {
    content:  'Tooltip derecha',
    side:     'right',
    children: <JButton variant="outline">Hover aquí</JButton>,
  },
};

export const LongContent: Story = {
  args: {
    content:  'Este es un tooltip con contenido más largo que ocupa varias líneas para demostrar el ajuste automático del texto.',
    side:     'bottom',
    children: <JButton variant="outline">Contenido largo</JButton>,
  },
  parameters: {
    docs: { description: { story: 'El tooltip recorta automáticamente el texto en varias líneas con `max-width: 320px`.' } },
  },
};

export const NoDelay: Story = {
  args: {
    content:  'Sin delay',
    side:     'top',
    delayMs:  0,
    children: <JButton variant="outline">Inmediato</JButton>,
  },
  parameters: {
    docs: { description: { story: '`delayMs=0` muestra el tooltip de inmediato.' } },
  },
};

export const Interactive: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Flujo real con botones de acción. El último botón clickeado se registra abajo. Presiona Escape para cerrar cualquier tooltip abierto.',
      },
    },
  },
  render: () => {
    const [lastClicked, setLastClicked] = useState<string | null>(null);
    const actions = [
      { id: 'edit',   label: 'Editar',   tooltip: 'Modificar este registro',        variant: 'outline'     as const },
      { id: 'copy',   label: 'Copiar',   tooltip: 'Duplicar elemento seleccionado', variant: 'secondary'   as const },
      { id: 'delete', label: 'Eliminar', tooltip: 'Borrar permanentemente',         variant: 'destructive' as const },
    ];
    return (
      <div className="flex flex-col items-center gap-6">
        <div className="flex gap-2">
          {actions.map((a) => (
            <JTooltip key={a.id} content={a.tooltip} side="top">
              <JButton variant={a.variant} size="sm" onClick={() => setLastClicked(a.label)}>
                {a.label}
              </JButton>
            </JTooltip>
          ))}
        </div>
        {lastClicked && (
          <JLabel size="sm" color="muted">
            Última acción: <strong>{lastClicked}</strong>
          </JLabel>
        )}
      </div>
    );
  },
};
