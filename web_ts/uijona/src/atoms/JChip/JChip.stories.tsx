import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { useState } from 'react';
import { JChip } from './JChip';
import { JPanel } from '../JPanel/JPanel';
import { JLabel } from '../JLabel';

const meta: Meta<typeof JChip> = {
  title: 'Atoms/JChip',
  component: JChip,
  tags: ['autodocs'],
  args: { children: 'Activo', onRemove: fn() },
  argTypes: {
    variant:  { control: 'select', options: ['default', 'primary', 'success', 'warning', 'danger'] },
    selected:  { control: 'boolean' },
    removable: { control: 'boolean' },
  },
};
export default meta;
type Story = StoryObj<typeof JChip>;

export const Default: Story = {};

export const Selected: Story = {
  args: { selected: true },
};

export const Removable: Story = {
  args: { removable: true },
};

export const AllVariants: Story = {
  render: () => (
    <JPanel variant="ghost" padding="none" className="flex flex-wrap gap-2">
      <JChip>Default</JChip>
      <JChip variant="primary">Primary</JChip>
      <JChip variant="success">Success</JChip>
      <JChip variant="warning">Warning</JChip>
      <JChip variant="danger">Danger</JChip>
      <JChip removable onRemove={fn()}>Removable</JChip>
    </JPanel>
  ),
};

export const FilterChips: Story = {
  render: () => {
    const options = ['React', 'Vue', 'Angular', 'TypeScript', 'Node.js'];
    const [selected, setSelected] = useState<string[]>([]);
    const toggle = (opt: string) =>
      setSelected((prev) => prev.includes(opt) ? prev.filter((o) => o !== opt) : [...prev, opt]);
    return (
      <JPanel variant="ghost" padding="none" className="flex flex-col gap-3">
        <JPanel variant="ghost" padding="none" className="flex flex-wrap gap-2">
          {options.map((opt) => (
            <JChip
              key={opt}
              variant="primary"
              selected={selected.includes(opt)}
              onClick={() => toggle(opt)}
            >
              {opt}
            </JChip>
          ))}
        </JPanel>
        <JLabel size="xs" color="muted">
          {selected.length === 0 ? 'Ninguno seleccionado' : `Seleccionados: ${selected.join(', ')}`}
        </JLabel>
      </JPanel>
    );
  },
};

export const RemovableChips: Story = {
  render: () => {
    const [chips, setChips] = useState(['React', 'TypeScript', 'Tailwind']);
    return (
      <JPanel variant="ghost" padding="none" className="flex flex-wrap gap-2">
        {chips.map((chip) => (
          <JChip
            key={chip}
            variant="primary"
            removable
            onRemove={() => setChips((prev) => prev.filter((c) => c !== chip))}
          >
            {chip}
          </JChip>
        ))}
        {chips.length === 0 && <JLabel size="sm" className="text-neutral-400">Sin chips</JLabel>}
      </JPanel>
    );
  },
};

export const Interactive: Story = {
  render: () => {
    const [saved, setSaved] = useState(false);
    return (
      <JPanel variant="ghost" padding="none" className="flex flex-col items-start gap-2">
        <JChip
          variant={saved ? 'success' : 'default'}
          selected={saved}
          onClick={() => setSaved((s) => !s)}
        >
          {saved ? '✓ Guardado' : 'Guardar'}
        </JChip>
        <JLabel size="xs" color="muted">{saved ? 'Click para deseleccionar' : 'Click para seleccionar'}</JLabel>
      </JPanel>
    );
  },
};
