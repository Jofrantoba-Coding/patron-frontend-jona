import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { useState } from 'react';
import { TooltipMolecule } from './TooltipMolecule';
import { ButtonAtom } from '../../atoms/ButtonAtom/ButtonAtom';
import { PanelAtom } from '../../atoms/PanelAtom/PanelAtom';
import { TextAtom } from '../../atoms/TextAtom/TextAtom';

const meta: Meta<typeof TooltipMolecule> = {
  title: 'Molecules/TooltipMolecule',
  component: TooltipMolecule,
  tags: ['autodocs'],
  args: { onShow: fn(), onHide: fn() },
  argTypes: {
    side:    { control: 'select', options: ['top', 'bottom', 'left', 'right'] },
    delayMs: { control: { type: 'number', min: 0, max: 2000, step: 100 } },
  },
  decorators: [(Story) => <PanelAtom variant="ghost" padding="none" style={{ padding: '60px', display: 'flex', justifyContent: 'center' }}><Story /></PanelAtom>],
};
export default meta;
type Story = StoryObj<typeof TooltipMolecule>;

export const Top: Story = {
  args: {
    content: 'Tooltip arriba',
    side: 'top',
    children: <ButtonAtom variant="outline">Hover aquí</ButtonAtom>,
  },
};

export const Bottom: Story = {
  args: {
    content: 'Tooltip abajo',
    side: 'bottom',
    children: <ButtonAtom variant="outline">Hover aquí</ButtonAtom>,
  },
};

export const Left: Story = {
  args: {
    content: 'Tooltip izquierda',
    side: 'left',
    children: <ButtonAtom variant="outline">Hover aquí</ButtonAtom>,
  },
};

export const Right: Story = {
  args: {
    content: 'Tooltip derecha',
    side: 'right',
    children: <ButtonAtom variant="outline">Hover aquí</ButtonAtom>,
  },
};

export const Interactive: Story = {
  render: () => {
    const [lastClicked, setLastClicked] = useState<string | null>(null);
    const actions = [
      { id: 'edit', label: 'Editar', tooltip: 'Modificar este registro', variant: 'outline' as const },
      { id: 'copy', label: 'Copiar', tooltip: 'Duplicar elemento seleccionado', variant: 'secondary' as const },
      { id: 'delete', label: 'Eliminar', tooltip: 'Borrar permanentemente', variant: 'destructive' as const },
    ];
    return (
      <PanelAtom variant="ghost" padding="none" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '24px', padding: '32px' }}>
        <PanelAtom variant="ghost" padding="none" style={{ display: 'flex', gap: '8px' }}>
          {actions.map((a) => (
            <TooltipMolecule key={a.id} content={a.tooltip} side="top">
              <ButtonAtom variant={a.variant} size="sm" onClick={() => setLastClicked(a.label)}>
                {a.label}
              </ButtonAtom>
            </TooltipMolecule>
          ))}
        </PanelAtom>
        {lastClicked && (
          <TextAtom size="sm" color="muted">
            Última acción: <strong>{lastClicked}</strong>
          </TextAtom>
        )}
      </PanelAtom>
    );
  },
};
