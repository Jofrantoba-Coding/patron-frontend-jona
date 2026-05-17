import type { Meta, StoryObj } from '@storybook/react';
import { ImageAtom } from './ImageAtom';
import { JPanel } from '../JPanel/JPanel';
import { JLabel } from '../JLabel';

const sampleSrc = 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=900&q=80';

const meta: Meta<typeof ImageAtom> = {
  title: 'Atoms/ImageAtom',
  component: ImageAtom,
  tags: ['autodocs'],
  argTypes: {
    fit: { control: 'select', options: ['contain', 'cover', 'fill', 'none', 'scale-down'] },
    radius: { control: 'select', options: ['none', 'sm', 'md', 'lg', 'xl', 'full'] },
    aspectRatio: { control: 'select', options: ['auto', 'square', 'video', 'wide', 'portrait'] },
    block: { control: 'boolean' },
    loading: { control: 'select', options: ['eager', 'lazy'] },
    decoding: { control: 'select', options: ['async', 'auto', 'sync'] },
  },
  args: {
    src: sampleSrc,
    alt: 'Oficina moderna con equipo de trabajo',
    fit: 'cover',
    radius: 'lg',
    aspectRatio: 'video',
    block: true,
  },
};
export default meta;
type Story = StoryObj<typeof ImageAtom>;

export const Default: Story = {};

export const AspectRatios: Story = {
  render: () => (
    <JPanel variant="ghost" padding="none" className="grid gap-4 sm:grid-cols-3">
      {(['square', 'video', 'portrait'] as const).map((aspectRatio) => (
        <JPanel key={aspectRatio} variant="ghost" padding="none" className="flex flex-col gap-2">
          <ImageAtom src={sampleSrc} alt={`Imagen con aspecto ${aspectRatio}`} aspectRatio={aspectRatio} radius="md" block />
          <JLabel as="span" size="sm" color="muted">{aspectRatio}</JLabel>
        </JPanel>
      ))}
    </JPanel>
  ),
};

export const Fallback: Story = {
  args: {
    src: '/missing-image.jpg',
    fallbackSrc: sampleSrc,
    alt: 'Imagen con fallback',
    radius: 'md',
    aspectRatio: 'video',
    block: true,
  },
};
