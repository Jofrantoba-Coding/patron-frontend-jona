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
};
export default meta;
type Story = StoryObj<typeof RatingAtom>;

export const Default: Story = {
  args: { value: 3 },
};

export const ReadOnly: Story = {
  args: { value: 4, readOnly: true },
};

export const Empty: Story = {
  args: { value: 0 },
};

export const Small: Story = {
  args: { value: 3, size: 'sm' },
};

export const Large: Story = {
  args: { value: 5, size: 'lg' },
};

export const MaxTen: Story = {
  args: { value: 7, max: 10 },
};

export const Interactive: Story = {
  render: () => {
    const [rating, setRating] = useState(0);
    return (
      <div className="flex flex-col gap-3">
        <RatingAtom value={rating} onChange={setRating} />
        <p className="text-sm text-neutral-500">
          {rating === 0 ? 'Sin calificación' : `Calificación: ${rating} / 5`}
        </p>
      </div>
    );
  },
};
