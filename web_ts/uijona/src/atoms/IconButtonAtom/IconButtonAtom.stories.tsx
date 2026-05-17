import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { useState } from 'react';
import { IconButtonAtom } from './IconButtonAtom';
import { JPanel } from '../JPanel/JPanel';
import { TextAtom } from '../TextAtom/TextAtom';

const SearchIcon = () => (
  <span aria-hidden="true" style={{ fontSize: 14, fontWeight: 700, lineHeight: 1 }}>
    S
  </span>
);

const meta: Meta<typeof IconButtonAtom> = {
  title: 'Atoms/IconButtonAtom',
  component: IconButtonAtom,
  tags: ['autodocs'],
  args: { icon: <SearchIcon />, label: 'Buscar', onClick: fn() },
  argTypes: {
    label: { control: 'text' },
    variant: { control: 'select', options: ['default', 'outline', 'ghost', 'destructive', 'secondary', 'link'] },
    loading: { control: 'boolean' },
    disabled: { control: 'boolean' },
  },
};
export default meta;
type Story = StoryObj<typeof IconButtonAtom>;

export const Default: Story = {};

export const Outline: Story = {
  args: { variant: 'outline', label: 'Buscar con borde' },
};

export const Destructive: Story = {
  args: { variant: 'destructive', label: 'Eliminar' },
};

export const Loading: Story = {
  args: { loading: true, label: 'Cargando' },
};

export const Disabled: Story = {
  args: { disabled: true, label: 'No disponible' },
};

export const Interactive: Story = {
  args: {
    onClick: fn(),
  },
  render: (args) => {
    const [saved, setSaved] = useState(false);
    const HeartIcon = () => (
      <span aria-hidden="true" style={{ fontSize: 16, lineHeight: 1 }}>{saved ? '♥' : '♡'}</span>
    );
    return (
      <JPanel variant="ghost" padding="none" className="flex flex-col items-center gap-2">
        <IconButtonAtom
          icon={<HeartIcon />}
          label={saved ? 'Quitar de favoritos' : 'Añadir a favoritos'}
          variant={saved ? 'destructive' : 'outline'}
          onClick={(event) => { args.onClick?.(event); setSaved((s) => !s); }}
        />
        <TextAtom size="xs" color="muted">{saved ? 'Guardado en favoritos' : 'Sin guardar'}</TextAtom>
      </JPanel>
    );
  },
};
