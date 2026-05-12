import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { useState } from 'react';
import { ChipAtom } from './ChipAtom';
import { PanelAtom } from '../PanelAtom/PanelAtom';
import { TextAtom } from '../TextAtom/TextAtom';

const meta: Meta<typeof ChipAtom> = {
  title: 'Atoms/ChipAtom',
  component: ChipAtom,
  tags: ['autodocs'],
  args: { children: 'Activo', onRemove: fn() },
  argTypes: {
    variant:  { control: 'select', options: ['default', 'primary', 'success', 'warning', 'danger'] },
    selected: { control: 'boolean' },
    removable: { control: 'boolean' },
  },
};
export default meta;
type Story = StoryObj<typeof ChipAtom>;

// Clicar el chip alterna el estado selected (uncontrolled)
export const Default: Story = {};

export const Selected: Story = {
  args: { selected: true },
};

export const Removable: Story = {
  args: { removable: true },
};

export const AllVariants: Story = {
  render: () => (
    <PanelAtom variant="ghost" padding="none" className="flex flex-wrap gap-2">
      <ChipAtom>Default</ChipAtom>
      <ChipAtom variant="primary">Primary</ChipAtom>
      <ChipAtom variant="success">Success</ChipAtom>
      <ChipAtom variant="warning">Warning</ChipAtom>
      <ChipAtom variant="danger">Danger</ChipAtom>
      <ChipAtom removable onRemove={fn()}>Removable</ChipAtom>
    </PanelAtom>
  ),
};

export const FilterChips: Story = {
  render: () => {
    const options = ['React', 'Vue', 'Angular', 'TypeScript', 'Node.js'];
    const [selected, setSelected] = useState<string[]>([]);
    const toggle = (opt: string) =>
      setSelected((prev) => prev.includes(opt) ? prev.filter((o) => o !== opt) : [...prev, opt]);
    return (
      <PanelAtom variant="ghost" padding="none" className="flex flex-col gap-3">
        <PanelAtom variant="ghost" padding="none" className="flex flex-wrap gap-2">
          {options.map((opt) => (
            <ChipAtom
              key={opt}
              variant="primary"
              selected={selected.includes(opt)}
              onClick={() => toggle(opt)}
            >
              {opt}
            </ChipAtom>
          ))}
        </PanelAtom>
        <TextAtom size="xs" color="muted">
          {selected.length === 0 ? 'Ninguno seleccionado' : `Seleccionados: ${selected.join(', ')}`}
        </TextAtom>
      </PanelAtom>
    );
  },
};

export const RemovableChips: Story = {
  render: () => {
    const [chips, setChips] = useState(['React', 'TypeScript', 'Tailwind']);
    return (
      <PanelAtom variant="ghost" padding="none" className="flex flex-wrap gap-2">
        {chips.map((chip) => (
          <ChipAtom
            key={chip}
            variant="primary"
            removable
            onRemove={() => setChips((prev) => prev.filter((c) => c !== chip))}
          >
            {chip}
          </ChipAtom>
        ))}
        {chips.length === 0 && <TextAtom size="sm" className="text-neutral-400">Sin chips</TextAtom>}
      </PanelAtom>
    );
  },
};
