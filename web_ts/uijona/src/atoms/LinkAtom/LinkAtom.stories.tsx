import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { LinkAtom } from './LinkAtom';

const meta: Meta<typeof LinkAtom> = {
  title: 'Atoms/LinkAtom',
  component: LinkAtom,
  tags: ['autodocs'],
  argTypes: {
    variant: { control: 'select', options: ['default', 'muted', 'button', 'danger'] },
    disabled: { control: 'boolean' },
    href: { control: 'text' },
  },
};
export default meta;
type Story = StoryObj<typeof LinkAtom>;

export const Default: Story = {
  args: {
    href: '#',
    children: 'Ver detalle',
  },
};

export const Muted: Story = {
  args: {
    href: '#',
    variant: 'muted',
    children: 'Politica de privacidad',
  },
};

export const Button: Story = {
  args: {
    href: '#',
    variant: 'button',
    children: 'Abrir recurso',
  },
};

export const Danger: Story = {
  args: {
    href: '#',
    variant: 'danger',
    children: 'Eliminar enlace',
  },
};

export const Disabled: Story = {
  args: {
    href: '#',
    disabled: true,
    children: 'No disponible',
  },
};

export const AllVariants: Story = {
  render: () => (
    <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
      <LinkAtom href="#">Default</LinkAtom>
      <LinkAtom href="#" variant="muted">Muted</LinkAtom>
      <LinkAtom href="#" variant="button">Button</LinkAtom>
      <LinkAtom href="#" variant="danger">Danger</LinkAtom>
      <LinkAtom href="#" disabled>Disabled</LinkAtom>
    </div>
  ),
};

export const Interactive: Story = {
  render: () => {
    const pages = ['Inicio', 'Productos', 'Detalle', 'Soporte'];
    const [current, setCurrent] = useState('Inicio');
    return (
      <div className="flex flex-col gap-3">
        <div className="flex flex-wrap gap-3">
          {pages.map((page) => (
            <LinkAtom
              key={page}
              href="#"
              variant={current === page ? 'button' : 'default'}
              onClick={(e) => { e.preventDefault(); setCurrent(page); }}
            >
              {page}
            </LinkAtom>
          ))}
        </div>
        <p className="text-sm text-neutral-500">
          Página actual: <strong>{current}</strong>
        </p>
      </div>
    );
  },
};
