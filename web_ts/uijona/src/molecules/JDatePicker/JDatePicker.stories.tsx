import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { useState } from 'react';
import { JDatePicker, JDATEPICKER_DEFAULTS } from './JDatePicker';
import { JPanel } from '../../atoms/JPanel/JPanel';
import { JLabel } from '../../atoms/JLabel';

const meta: Meta<typeof JDatePicker> = {
  title: 'Molecules/JDatePicker',
  component: JDatePicker,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'JDatePicker es el selector de fecha y hora de JONA. Combina un campo de texto con máscara configurable y un calendario emergente (portal). Soporta selección de fecha, hora, segundos y timezone. El valor se emite en formato máscara (`mask`) o ISO 8601 (`iso`).',
      },
    },
  },
  args: {
    onChange: fn(),
  },
  argTypes: {
    mask: {
      control: 'text',
      description: 'Tokens: `yyyy`, `MM`, `dd`, `HH`, `mm`, `ss`, `z`, `XXX`.',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: JDATEPICKER_DEFAULTS.mask },
      },
    },
    valueFormat: {
      control: 'inline-radio',
      options: ['mask', 'iso'],
      description: 'Formato del valor emitido en `onChange`.',
      table: {
        type: { summary: 'JDatePickerValueFormat' },
        defaultValue: { summary: JDATEPICKER_DEFAULTS.valueFormat },
      },
    },
    placeholder: {
      control: 'text',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: JDATEPICKER_DEFAULTS.placeholder },
      },
    },
    disabled: {
      control: 'boolean',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: String(JDATEPICKER_DEFAULTS.disabled) },
      },
    },
    showTime: {
      control: 'boolean',
      description: 'Muestra los campos de hora dentro del calendario.',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: String(JDATEPICKER_DEFAULTS.showTime) },
      },
    },
    showSeconds: {
      control: 'boolean',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: String(JDATEPICKER_DEFAULTS.showSeconds) },
      },
    },
    timezone: {
      control: 'text',
      description: 'Timezone por defecto cuando no viene en el valor.',
    },
  },
  decorators: [
    (Story) => (
      <JPanel variant="ghost" padding="none" className="w-80 pb-96">
        <Story />
      </JPanel>
    ),
  ],
};
export default meta;
type Story = StoryObj<typeof JDatePicker>;

// ── Stories ───────────────────────────────────────────────────────────────────

export const Default: Story = {
  parameters: {
    docs: {
      description: { story: 'Selector básico con máscara `yyyy-MM-dd`. Click en el ícono de calendario para abrir el panel.' },
    },
  },
};

export const WithValue: Story = {
  args: { value: '2026-05-09' },
  parameters: {
    docs: {
      description: { story: 'Con valor inicial preseleccionado. El día aparece resaltado en el calendario.' },
    },
  },
};

export const Disabled: Story = {
  args: { value: '2026-05-09', disabled: true },
  parameters: {
    docs: {
      description: { story: '`disabled=true` deshabilita el input y el botón del calendario.' },
    },
  },
};

export const WithMinMax: Story = {
  args: { min: '2026-05-01', max: '2026-05-31' },
  parameters: {
    docs: {
      description: { story: '`min` y `max` restringen la selección. Los días fuera del rango aparecen deshabilitados.' },
    },
  },
};

export const MaskedDate: Story = {
  args: {
    value:       '09/05/2026',
    mask:        'dd/MM/yyyy',
    placeholder: 'dd/mm/aaaa',
  },
  parameters: {
    docs: {
      description: { story: 'Máscara personalizada `dd/MM/yyyy`. La escritura en el input aplica la máscara automáticamente.' },
    },
  },
};

export const WithTime: Story = {
  name: 'Con hora y segundos',
  args: {
    value:       '2026-05-09 14:30:45',
    mask:        'yyyy-MM-dd HH:mm:ss',
    showTime:    true,
    showSeconds: true,
    placeholder: 'yyyy-MM-dd hh:mm:ss',
  },
  parameters: {
    docs: {
      description: { story: '`showTime` y `showSeconds` habilitan los campos de hora dentro del calendario.' },
    },
  },
};

export const WithTimezone: Story = {
  name: 'Con timezone',
  args: {
    value:           '2026-05-09 14:30:45 America/Lima',
    mask:            'yyyy-MM-dd HH:mm:ss z',
    showTime:        true,
    showSeconds:     true,
    timezone:        'America/Lima',
    timezoneOptions: ['America/Lima', 'UTC', 'America/Bogota', 'Europe/Madrid'],
    placeholder:     'yyyy-MM-dd hh:mm:ss timezone',
  },
  parameters: {
    docs: {
      description: { story: 'Selector de timezone con lista de opciones. El token `z` en la máscara acepta nombres de timezone IANA.' },
    },
  },
};

export const Interactive: Story = {
  parameters: {
    docs: {
      description: { story: 'Flujo completo con máscara `dd/MM/yyyy HH:mm:ss z` y timezone. El valor seleccionado se muestra debajo.' },
    },
  },
  render: (args) => {
    const [date, setDate] = useState('');
    return (
      <JPanel variant="ghost" padding="none" className="flex w-80 flex-col gap-3 pb-96">
        <JDatePicker
          value={date}
          mask="dd/MM/yyyy HH:mm:ss z"
          showTime
          showSeconds
          timezone="America/Lima"
          timezoneOptions={['America/Lima', 'UTC', 'America/Bogota']}
          placeholder="dd/mm/aaaa hh:mm:ss timezone"
          onChange={(v) => { args.onChange?.(v); setDate(v); }}
        />
        <JLabel size="sm" color="muted">
          {date ? `Valor: ${date}` : 'Sin fecha seleccionada'}
        </JLabel>
      </JPanel>
    );
  },
};
