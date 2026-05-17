import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import React, { useState } from 'react';
import {
  JTextBox,
  JTEXTBOX_DEFAULTS,
  JTEXTBOX_VARIANTS,
  JTEXTBOX_SIZES,
  type JTextBoxVariant,
  type JTextBoxSize,
} from './JTextBox';
import { JPanel } from '../JPanel/JPanel';
import { JLabel } from '../JLabel';

const meta: Meta<typeof JTextBox> = {
  title: 'Atoms/JTextBox',
  component: JTextBox,
  tags: ['autodocs'],
  args: { onChange: fn(), onBlur: fn() },
  parameters: {
    docs: {
      description: {
        component:
          'JTextBox es el atom de entrada de texto de JONA. Soporta icono izquierdo y derecho, 3 variantes visuales y 3 tamaños. Los eventos siguen el patrón JONA: value-first.',
      },
    },
  },
  argTypes: {
    variant: {
      control: 'select',
      options: Object.keys(JTEXTBOX_VARIANTS) as JTextBoxVariant[],
      table: { defaultValue: { summary: JTEXTBOX_DEFAULTS.variant } },
    },
    size: {
      control: 'select',
      options: Object.keys(JTEXTBOX_SIZES) as JTextBoxSize[],
      table: { defaultValue: { summary: JTEXTBOX_DEFAULTS.size } },
    },
    type: {
      control: 'select',
      options: ['text', 'email', 'password', 'number', 'tel', 'url', 'search'],
    },
    hasError:  { control: 'boolean' },
    disabled:  { control: 'boolean' },
    readOnly:  { control: 'boolean' },
  },
};

export default meta;
type Story = StoryObj<typeof JTextBox>;

// Iconos SVG inline para demos
const SearchIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
  </svg>
);

const MailIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect width="20" height="16" x="2" y="4" rx="2" />
    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
  </svg>
);

const LockIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
  </svg>
);

const UserIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="8" r="4" /><path d="M20 21a8 8 0 1 0-16 0" />
  </svg>
);

const EyeIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

export const Default: Story = {
  args: {
    placeholder: 'Escribí aquí...',
    variant: 'default',
    size: 'md',
    hasError: false,
    disabled: false,
  },
  parameters: {
    docs: {
      description: {
        story: 'Playground interactivo. Modificá cualquier prop desde los controles.',
      },
    },
  },
};

export const Variants: Story = {
  parameters: {
    docs: {
      description: { story: 'Las 3 variantes visuales de JTextBox.' },
    },
  },
  render: () => (
    <JPanel gap="md" className="max-w-xs">
      <JPanel gap="xs">
        <JLabel size="xs" color="muted">default</JLabel>
        <JTextBox variant="link" placeholder="Variante default" />
      </JPanel>
      <JPanel gap="xs">
        <JLabel size="xs" color="muted">filled</JLabel>
        <JTextBox variant="filled" placeholder="Variante filled" />
      </JPanel>
      <JPanel gap="xs" className="bg-neutral-100 p-3 rounded-md">
        <JLabel size="xs" color="muted">ghost (sobre fondo)</JLabel>
        <JTextBox variant="ghost" placeholder="Variante ghost" />
      </JPanel>
    </JPanel>
  ),
};

export const Sizes: Story = {
  parameters: {
    docs: {
      description: { story: 'Tres tamaños disponibles. md es el default.' },
    },
  },
  render: () => (
    <JPanel gap="sm" className="max-w-xs">
      <JTextBox size="sm" placeholder="Small — 28px" />
      <JTextBox size="md" placeholder="Medium — 36px (default)" />
      <JTextBox size="lg" placeholder="Large — 44px" />
    </JPanel>
  ),
};

export const WithIcons: Story = {
  parameters: {
    docs: {
      description: {
        story: 'iconLeft e iconRight posicionan el ícono dentro del campo. El padding del input se ajusta automáticamente.',
      },
      source: {
        code: `<JTextBox iconLeft={<SearchIcon />} placeholder="Buscar..." />
<JTextBox iconLeft={<MailIcon />} placeholder="correo@ejemplo.com" type="email" />
<JTextBox iconLeft={<LockIcon />} iconRight={<EyeIcon />} placeholder="Contraseña" type="password" />`,
      },
    },
  },
  render: () => (
    <JPanel gap="sm" className="max-w-xs">
      <JTextBox iconLeft={<SearchIcon />} placeholder="Buscar..." />
      <JTextBox iconLeft={<MailIcon />} placeholder="correo@ejemplo.com" type="email" />
      <JTextBox iconLeft={<UserIcon />} placeholder="Nombre de usuario" />
      <JTextBox iconLeft={<LockIcon />} iconRight={<EyeIcon />} placeholder="Contraseña" type="password" />
    </JPanel>
  ),
};

export const ErrorState: Story = {
  parameters: {
    docs: {
      description: { story: 'hasError cambia el color del borde y del icono. Combinable con iconLeft.' },
    },
  },
  render: () => (
    <JPanel gap="sm" className="max-w-xs">
      <JTextBox hasError placeholder="Sin icono con error" defaultValue="valor inválido" />
      <JTextBox hasError iconLeft={<MailIcon />} placeholder="Con icono y error" defaultValue="usuario@" />
    </JPanel>
  ),
};

export const States: Story = {
  parameters: {
    docs: {
      description: { story: 'Disabled y readOnly bloquean la edición con estilos distintos.' },
    },
  },
  render: () => (
    <JPanel gap="sm" className="max-w-xs">
      <JTextBox placeholder="Normal" />
      <JTextBox disabled defaultValue="Deshabilitado" />
      <JTextBox readOnly defaultValue="Solo lectura" />
    </JPanel>
  ),
};

export const Types: Story = {
  parameters: {
    docs: {
      description: { story: 'JTextBox soporta todos los tipos de input de HTML.' },
    },
  },
  render: () => (
    <JPanel gap="sm" className="max-w-xs">
      <JTextBox type="text"     placeholder="text" />
      <JTextBox type="email"    placeholder="email" iconLeft={<MailIcon />} />
      <JTextBox type="password" placeholder="password" iconLeft={<LockIcon />} />
      <JTextBox type="number"   placeholder="number" />
      <JTextBox type="search"   placeholder="search" iconLeft={<SearchIcon />} />
      <JTextBox type="tel"      placeholder="tel" />
    </JPanel>
  ),
};

export const Interactive: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Validación en tiempo real. onChange recibe el value primero (patrón JONA).',
      },
      source: {
        code: `const [value, setValue] = useState('');
const hasError = value.length > 0 && !/^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/.test(value);

<JTextBox
  type="email"
  iconLeft={<MailIcon />}
  placeholder="correo@ejemplo.com"
  value={value}
  hasError={hasError}
  onChange={(v) => setValue(v)}
/>`,
      },
    },
  },
  args: { onChange: fn(), onBlur: fn() },
  render: (args) => {
    const [value, setValue] = useState('');
    const isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
    const hasError = value.length > 0 && !isValid;

    return (
      <JPanel gap="xs" className="max-w-xs">
        <JTextBox
          type="email"
          iconLeft={<MailIcon />}
          placeholder="correo@ejemplo.com"
          value={value}
          hasError={hasError}
          onChange={(v, e) => { args.onChange?.(v, e); setValue(v); }}
          onBlur={args.onBlur}
        />
        {hasError && (
          <JLabel size="xs" className="text-danger-500">
            El formato de email no es válido.
          </JLabel>
        )}
        {isValid && (
          <JLabel size="xs" className="text-green-600">
            Email válido ✓
          </JLabel>
        )}
      </JPanel>
    );
  },
};
