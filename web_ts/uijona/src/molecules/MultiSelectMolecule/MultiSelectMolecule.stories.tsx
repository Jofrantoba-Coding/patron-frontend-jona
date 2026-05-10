import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { useState } from 'react';
import { MultiSelectMolecule } from './MultiSelectMolecule';

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
  decorators: [(Story) => <div className="w-72"><Story /></div>],
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
  render: () => {
    const [values, setValues] = useState<string[]>([]);
    return (
      <div className="flex w-72 flex-col gap-3">
        <MultiSelectMolecule
          options={SKILLS}
          value={values}
          placeholder="Seleccionar habilidades..."
          maxSelected={4}
          onChange={(v) => setValues(v)}
        />
        <p className="text-sm text-neutral-500">
          {values.length === 0 ? 'Ninguna seleccionada' : `Seleccionadas (${values.length}): ${values.join(', ')}`}
        </p>
      </div>
    );
  },
};
