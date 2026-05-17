import type { Meta, StoryObj } from '@storybook/react';
import { JLabel } from './JLabel';

const meta: Meta<typeof JLabel> = {
  title: 'Atoms/JLabel',
  component: JLabel,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    variant:  { control: 'select' },
    size:     { control: 'select' },
    color:    { control: 'select' },
    as:       { control: 'select' },
    truncate: { control: 'boolean' },
    required: { control: 'boolean' },
    disabled: { control: 'boolean' },
    children: { control: 'text' },
    href:     { control: 'text' },
    htmlFor:  { control: 'text' },
    message:  { control: 'text' },
  },
};

export default meta;
type Story = StoryObj<typeof JLabel>;

// ── Body ──────────────────────────────────────────────────────────────
export const Body: Story = {
  args: { variant: 'body', children: 'Texto de cuerpo normal.' },
};

export const BodySizes: Story = {
  render: () => (
    <div className="flex flex-col gap-2">
      {(['xs', 'sm', 'base', 'lg', 'xl', '2xl'] as const).map(s => (
        <JLabel key={s} variant="body" size={s}>{s} — El rápido zorro marrón</JLabel>
      ))}
    </div>
  ),
};

export const BodyColors: Story = {
  render: () => (
    <div className="flex flex-col gap-2">
      {(['default', 'muted', 'primary', 'danger', 'success', 'warning'] as const).map(c => (
        <JLabel key={c} variant="body" color={c}>{c} — Texto de ejemplo</JLabel>
      ))}
    </div>
  ),
};

// ── Heading ───────────────────────────────────────────────────────────
export const Headings: Story = {
  render: () => (
    <div className="flex flex-col gap-2">
      {(['h1', 'h2', 'h3', 'h4', 'h5', 'h6'] as const).map((tag, i) => {
        const sizes = ['2xl', 'xl', 'lg', 'base', 'sm', 'xs'] as const;
        return (
          <JLabel key={tag} variant="heading" as={tag} size={sizes[i]}>
            {tag.toUpperCase()} — Título de ejemplo
          </JLabel>
        );
      })}
    </div>
  ),
};

// ── Label ─────────────────────────────────────────────────────────────
export const LabelBasic: Story = {
  args: { variant: 'label', htmlFor: 'email', children: 'Correo electrónico' },
};

export const LabelRequired: Story = {
  args: { variant: 'label', htmlFor: 'name', required: true, children: 'Nombre completo' },
};

export const LabelDisabled: Story = {
  args: { variant: 'label', htmlFor: 'pwd', disabled: true, children: 'Contraseña' },
};

// ── Link ──────────────────────────────────────────────────────────────
export const LinkDefault: Story = {
  args: { variant: 'link', href: '#', children: 'Enlace primario' },
};

export const LinkMuted: Story = {
  args: { variant: 'link-muted', href: '#', children: 'Enlace neutro' },
};

export const LinkButton: Story = {
  args: { variant: 'link-button', href: '#', children: 'Enlace botón' },
};

export const LinkDanger: Story = {
  args: { variant: 'link-danger', href: '#', children: 'Eliminar cuenta' },
};

export const LinkDisabled: Story = {
  args: { variant: 'link', href: '#', disabled: true, children: 'Enlace deshabilitado' },
};

export const LinkExternal: Story = {
  args: { variant: 'link', href: 'https://example.com', target: '_blank', children: 'Abre en nueva pestaña' },
};

// ── Error ─────────────────────────────────────────────────────────────
export const ErrorWithChildren: Story = {
  args: { variant: 'error', children: 'Este campo es obligatorio.' },
};

export const ErrorWithMessage: Story = {
  args: { variant: 'error', message: 'Formato de correo inválido.' },
};

export const ErrorEmpty: Story = {
  name: 'Error — vacío (render null)',
  render: () => (
    <div>
      <p className="text-sm text-neutral-500 mb-2">El JLabel error vacío no renderiza nada:</p>
      <div className="border border-dashed border-neutral-300 p-2 min-h-8">
        <JLabel variant="error" />
      </div>
    </div>
  ),
};

// ── Description ───────────────────────────────────────────────────────
export const DescriptionBasic: Story = {
  args: { variant: 'description', children: 'Texto auxiliar descriptivo en gris.' },
};

export const DescriptionEmpty: Story = {
  name: 'Description — vacía (render null)',
  render: () => (
    <div>
      <p className="text-sm text-neutral-500 mb-2">El JLabel description vacío no renderiza nada:</p>
      <div className="border border-dashed border-neutral-300 p-2 min-h-8">
        <JLabel variant="description" />
      </div>
    </div>
  ),
};

// ── Truncate ──────────────────────────────────────────────────────────
export const Truncate: Story = {
  render: () => (
    <div className="w-64">
      <JLabel variant="body" truncate>
        Este texto muy largo debería truncarse con puntos suspensivos al final de la línea.
      </JLabel>
    </div>
  ),
};

// ── Interactive ───────────────────────────────────────────────────────
export const Interactive: Story = {
  args: {
    variant:  'body',
    size:     'base',
    color:    'default',
    children: 'Texto configurable',
    truncate: false,
    required: false,
    disabled: false,
  },
};
