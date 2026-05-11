import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { useState } from 'react';
import { RatingAtom } from './RatingAtom';

const meta: Meta<typeof RatingAtom> = {
  title: 'Atoms/RatingAtom',
  component: RatingAtom,
  tags: ['autodocs'],
  args: {
    onChange: fn(),
    onHover: fn(),
  },
  argTypes: {
    size:     { control: 'select', options: ['sm', 'md', 'lg'] },
    max:      { control: 'number', min: 1, max: 10 },
    value:    { control: 'number', min: 0, max: 10 },
    readOnly: { control: 'boolean' },
  },
};
export default meta;
type Story = StoryObj<typeof RatingAtom>;

// Sin value en args → uncontrolled, se puede clicar para cambiar la calificación
export const Default: Story = {};

export const ReadOnly: Story = {
  args: { value: 4, readOnly: true },
};

export const Empty: Story = {
  args: { value: 0 },
};

export const Small: Story = {
  args: { size: 'sm' },
};

export const Large: Story = {
  args: { size: 'lg' },
};

export const MaxTen: Story = {
  args: { max: 10 },
};

export const Interactive: Story = {
  args: {
    onChange: fn(),
  },
  render: (args) => {
    const [rating, setRating] = useState(0);
    return (
      <div className="flex flex-col gap-3">
        <RatingAtom value={rating} onChange={(v) => { args.onChange?.(v); setRating(v); }} />
        <p className="text-sm text-neutral-500">
          {rating === 0 ? 'Sin calificación' : `Calificación: ${rating} / 5`}
        </p>
      </div>
    );
  },
};
