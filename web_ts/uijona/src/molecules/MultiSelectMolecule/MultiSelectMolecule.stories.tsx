import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { useState } from 'react';
import { MultiSelectMolecule } from './MultiSelectMolecule';
import { PanelAtom } from '../../atoms/PanelAtom/PanelAtom';
import { TextAtom } from '../../atoms/TextAtom/TextAtom';

const SKILLS = [
  { value: 'react', label: 'React' },
  { value: 'vue', label: 'Vue' },
  { value: 'angular', label: 'Angular' },
  { value: 'ts', label: 'TypeScript' },
  { value: 'node', label: 'Node.js' },
  { value: 'python', label: 'Python' },
  { value: 'java', label: 'Java' },
  { value: 'go', label: 'Go' },
];

const meta: Meta<typeof MultiSelectMolecule> = {
  title: 'Molecules/MultiSelectMolecule',
  component: MultiSelectMolecule,
  tags: ['autodocs'],
  args: {
    options: SKILLS,
    onChange: fn(),
    placeholder: 'Seleccionar habilidades...',
  },
  decorators: [(Story) => <PanelAtom variant="ghost" padding="none" className="w-72"><Story /></PanelAtom>],
};
export default meta;
type Story = StoryObj<typeof MultiSelectMolecule>;

export const Default: Story = {};

export const WithValue: Story = {
  args: { value: ['react', 'ts'] },
};

export const WithMaxSelected: Story = {
  args: { value: ['react', 'ts'], maxSelected: 3 },
};

export const Disabled: Story = {
  args: { value: ['react', 'ts'], disabled: true },
};

export const Interactive: Story = {
  parameters: {
    docs: {
      source: {
        code: `const options = [
  { value: 'react', label: 'React' },
  { value: 'ts', label: 'TypeScript' },
  { value: 'node', label: 'Node.js' },
];

const [values, setValues] = useState<string[]>([]);

<MultiSelectMolecule
  options={options}
  value={values}
  placeholder="Seleccionar habilidades..."
  maxSelected={4}
  onChange={(v) => setValues(v)}
/>`,
      },
    },
  },
  args: {
    onChange: fn(),
  },
  render: (args) => {
    const [values, setValues] = useState<string[]>([]);
    return (
      <PanelAtom variant="ghost" padding="none" className="flex w-72 flex-col gap-3">
        <MultiSelectMolecule
          options={SKILLS}
          value={values}
          placeholder="Seleccionar habilidades..."
          maxSelected={4}
          onChange={(v, options) => { args.onChange?.(v, options); setValues(v); }}
        />
        <TextAtom size="sm" color="muted">
          {values.length === 0 ? 'Ninguna seleccionada' : `Seleccionadas (${values.length}): ${values.join(', ')}`}
        </TextAtom>
      </PanelAtom>
    );
  },
};
