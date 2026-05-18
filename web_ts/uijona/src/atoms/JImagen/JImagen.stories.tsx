import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { JImagen } from './JImagen';
import { JPanel } from '../JPanel/JPanel';
import { JLabel } from '../JLabel';

const sampleSrc = 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=900&q=80';

const meta: Meta<typeof JImagen> = {
  title: 'Atoms/JImagen',
  component: JImagen,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
  args: {
    src: sampleSrc,
    alt: 'Oficina moderna con equipo de trabajo',
    fit: 'cover',
    radius: 'lg',
    aspectRatio: 'video',
    block: true,
    onImageError: fn(),
  },
  argTypes: {
    fit:         { control: 'select',  options: ['contain', 'cover', 'fill', 'none', 'scale-down'] },
    radius:      { control: 'select',  options: ['none', 'sm', 'md', 'lg', 'xl', 'full'] },
    aspectRatio: { control: 'select',  options: ['auto', 'square', 'video', 'wide', 'portrait'] },
    block:       { control: 'boolean' },
    loading:     { control: 'select',  options: ['lazy', 'eager'] },
    decoding:    { control: 'select',  options: ['async', 'auto', 'sync'] },
  },
};
export default meta;
type Story = StoryObj<typeof JImagen>;

export const Default: Story = {};

export const AspectRatios: Story = {
  render: () => (
    <JPanel variant="ghost" padding="none" className="grid gap-4 sm:grid-cols-3 w-[600px]">
      {(['square', 'video', 'portrait'] as const).map((ar) => (
        <JPanel key={ar} variant="ghost" padding="none" className="flex flex-col gap-2">
          <JImagen src={sampleSrc} alt={`Imagen ${ar}`} aspectRatio={ar} radius="md" block />
          <JLabel as="span" size="sm" color="muted">{ar}</JLabel>
        </JPanel>
      ))}
    </JPanel>
  ),
};

export const Radii: Story = {
  render: () => (
    <JPanel variant="ghost" padding="none" className="flex flex-wrap gap-4 w-[600px]">
      {(['none', 'sm', 'md', 'lg', 'xl', 'full'] as const).map((r) => (
        <JPanel key={r} variant="ghost" padding="none" className="flex flex-col gap-1 w-28">
          <JImagen src={sampleSrc} alt={`radius ${r}`} radius={r} aspectRatio="square" block />
          <JLabel as="span" size="xs" color="muted">{r}</JLabel>
        </JPanel>
      ))}
    </JPanel>
  ),
};

export const FitModes: Story = {
  render: () => (
    <JPanel variant="ghost" padding="none" className="grid gap-4 grid-cols-3 w-[600px]">
      {(['contain', 'cover', 'fill', 'none', 'scale-down'] as const).map((f) => (
        <JPanel key={f} variant="ghost" padding="none" className="flex flex-col gap-1">
          <JImagen src={sampleSrc} alt={`fit ${f}`} fit={f} aspectRatio="square" radius="md" block />
          <JLabel as="span" size="xs" color="muted">{f}</JLabel>
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

export const LazyLoading: Story = {
  args: {
    src: sampleSrc,
    alt: 'Carga diferida',
    loading: 'lazy',
    aspectRatio: 'video',
    radius: 'md',
    block: true,
  },
};
