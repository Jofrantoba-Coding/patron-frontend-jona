import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { useState } from 'react';
import { JRating, JRATING_DEFAULTS } from './JRating';
import { JPanel } from '../../atoms/JPanel/JPanel';
import { JLabel } from '../../atoms/JLabel';

const meta: Meta<typeof JRating> = {
  title: 'Molecules/JRating',
  component: JRating,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'JRating es el componente de calificación por estrellas de JONA. Soporta modo controlado y no controlado, hover preview, toggle (clic en estrella activa → reinicia a 0), tamaño configurable y modo solo lectura.',
      },
    },
  },
  args: {
    onChange: fn(),
    onHover:  fn(),
  },
  argTypes: {
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      table: { type: { summary: 'string' }, defaultValue: { summary: JRATING_DEFAULTS.size } },
    },
    max: {
      control: { type: 'number', min: 1, max: 10 },
      table: { type: { summary: 'number' }, defaultValue: { summary: String(JRATING_DEFAULTS.max) } },
    },
    value: {
      control: { type: 'number', min: 0, max: 10 },
    },
    readOnly: {
      control: 'boolean',
      table: { type: { summary: 'boolean' }, defaultValue: { summary: String(JRATING_DEFAULTS.readOnly) } },
    },
  },
};
export default meta;
type Story = StoryObj<typeof JRating>;

// Uncontrolled: el usuario puede clicar para cambiar; clic en estrella activa → 0
export const Default: Story = {
  parameters: {
    docs: {
      description: { story: 'Sin `value` → no controlado. Clic en estrella seleccionada reinicia a 0.' },
    },
  },
};

export const ReadOnly: Story = {
  args: { value: 4, readOnly: true },
  parameters: {
    docs: {
      description: { story: '`readOnly=true` deshabilita la interacción.' },
    },
  },
};

export const Empty: Story = {
  args: { value: 0 },
  parameters: {
    docs: {
      description: { story: 'Sin calificación inicial.' },
    },
  },
};

export const Small: Story = {
  args: { size: 'sm' },
  parameters: {
    docs: { description: { story: 'Tamaño `sm`.' } },
  },
};

export const Large: Story = {
  args: { size: 'lg' },
  parameters: {
    docs: { description: { story: 'Tamaño `lg`.' } },
  },
};

export const MaxTen: Story = {
  args: { max: 10 },
  parameters: {
    docs: { description: { story: '`max=10` expande el número de estrellas.' } },
  },
};

export const Interactive: Story = {
  parameters: {
    docs: {
      description: { story: 'Modo controlado. El valor seleccionado se muestra debajo. Clic en la misma estrella reinicia a 0.' },
      source: {
        code: `const [rating, setRating] = useState(0);

<JRating value={rating} onChange={setRating} />`,
      },
    },
  },
  render: (args) => {
    const [rating, setRating] = useState(0);
    return (
      <JPanel variant="ghost" padding="none" className="flex flex-col gap-3">
        <JRating
          value={rating}
          onChange={(v) => { args.onChange?.(v); setRating(v); }}
          onHover={args.onHover}
        />
        <JLabel size="sm" color="muted">
          {rating === 0 ? 'Sin calificación' : `Calificación: ${rating} / 5`}
        </JLabel>
      </JPanel>
    );
  },
};
