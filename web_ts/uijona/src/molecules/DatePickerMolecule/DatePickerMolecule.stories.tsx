import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { useState } from 'react';
import { DatePickerMolecule } from './DatePickerMolecule';

const meta: Meta<typeof DatePickerMolecule> = {
  title: 'Molecules/DatePickerMolecule',
  component: DatePickerMolecule,
  tags: ['autodocs'],
  args: {
    onChange: fn(),
    placeholder: 'Seleccionar fecha',
  },
  decorators: [(Story) => <div className="w-64 pb-72"><Story /></div>],
};
export default meta;
type Story = StoryObj<typeof DatePickerMolecule>;

export const Default: Story = {};

export const WithValue: Story = {
  args: { value: '2026-05-09' },
};

export const Disabled: Story = {
  args: { value: '2026-05-09', disabled: true },
};

export const WithMinMax: Story = {
  args: { min: '2026-05-01', max: '2026-05-31' },
};

export const Interactive: Story = {
  render: () => {
    const [date, setDate] = useState('');
    return (
      <div className="flex w-64 flex-col gap-3 pb-72">
        <DatePickerMolecule
          value={date}
          placeholder="Seleccionar fecha"
          onChange={setDate}
        />
        <p className="text-sm text-neutral-500">
          {date ? `Fecha: ${date}` : 'Sin fecha seleccionada'}
        </p>
      </div>
    );
  },
};
