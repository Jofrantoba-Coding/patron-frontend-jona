import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { useState } from 'react';
import { DatePickerMolecule } from './DatePickerMolecule';
import { PanelAtom } from '../../atoms/PanelAtom/PanelAtom';
import { TextAtom } from '../../atoms/TextAtom/TextAtom';

const meta: Meta<typeof DatePickerMolecule> = {
  title: 'Molecules/DatePickerMolecule',
  component: DatePickerMolecule,
  tags: ['autodocs'],
  args: {
    onChange: fn(),
    placeholder: 'Seleccionar fecha',
    mask: 'yyyy-MM-dd',
  },
  argTypes: {
    mask: {
      control: 'text',
      description: 'Tokens soportados: yyyy, MM, dd, HH, mm, ss, z, XXX.',
    },
    valueFormat: {
      control: 'inline-radio',
      options: ['mask', 'iso'],
    },
    showTime: { control: 'boolean' },
    showSeconds: { control: 'boolean' },
    timezone: { control: 'text' },
  },
  decorators: [(Story) => <PanelAtom variant="ghost" padding="none" className="w-80 pb-96"><Story /></PanelAtom>],
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

export const MaskedDate: Story = {
  args: {
    value: '09/05/2026',
    mask: 'dd/MM/yyyy',
    placeholder: 'dd/mm/aaaa',
  },
};

export const DateTimeWithSeconds: Story = {
  args: {
    value: '2026-05-09 14:30:45',
    mask: 'yyyy-MM-dd HH:mm:ss',
    showTime: true,
    showSeconds: true,
    placeholder: 'yyyy-MM-dd hh:mm:ss',
  },
};

export const DateTimeWithTimezone: Story = {
  args: {
    value: '2026-05-09 14:30:45 America/Lima',
    mask: 'yyyy-MM-dd HH:mm:ss z',
    showTime: true,
    showSeconds: true,
    timezone: 'America/Lima',
    timezoneOptions: ['America/Lima', 'UTC', 'America/Bogota', 'Europe/Madrid'],
    placeholder: 'yyyy-MM-dd hh:mm:ss timezone',
  },
};

export const Interactive: Story = {
  args: {
    onChange: fn(),
  },
  render: (args) => {
    const [date, setDate] = useState('');
    return (
      <PanelAtom variant="ghost" padding="none" className="flex w-80 flex-col gap-3 pb-96">
        <DatePickerMolecule
          value={date}
          mask="dd/MM/yyyy HH:mm:ss z"
          showTime
          showSeconds
          timezone="America/Lima"
          timezoneOptions={['America/Lima', 'UTC', 'America/Bogota']}
          placeholder="dd/mm/aaaa hh:mm:ss timezone"
          onChange={(v) => { args.onChange?.(v); setDate(v); }}
        />
        <TextAtom size="sm" color="muted">
          {date ? `Valor: ${date}` : 'Sin fecha seleccionada'}
        </TextAtom>
      </PanelAtom>
    );
  },
};
