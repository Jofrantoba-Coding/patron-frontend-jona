import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { TooltipMolecule } from './TooltipMolecule';
import { ButtonAtom } from '../../atoms/ButtonAtom/ButtonAtom';

const meta: Meta<typeof TooltipMolecule> = {
  title: 'Molecules/TooltipMolecule',
  component: TooltipMolecule,
  tags: ['autodocs'],
  args: { onShow: fn(), onHide: fn() },
  argTypes: {
    side:    { control: 'select', options: ['top', 'bottom', 'left', 'right'] },
    delayMs: { control: { type: 'number', min: 0, max: 2000, step: 100 } },
  },
  decorators: [(Story) => <div style={{ padding: '60px', display: 'flex', justifyContent: 'center' }}><Story /></div>],
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
