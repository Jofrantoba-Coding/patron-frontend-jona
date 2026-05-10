import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { TextAtom } from './TextAtom';

const meta: Meta<typeof TextAtom> = {
  title: 'Atoms/TextAtom',
  component: TextAtom,
  tags: ['autodocs'],
  argTypes: {
    as:       { control: 'select', options: ['p', 'span', 'div', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'label'] },
    size:     { control: 'select', options: ['xs', 'sm', 'base', 'lg', 'xl', '2xl'] },
    color:    { control: 'select', options: ['default', 'muted', 'primary', 'danger', 'success', 'warning'] },
    truncate: { control: 'boolean' },
  },
};
export default meta;
type Story = StoryObj<typeof TextAtom>;

export const Default: Story = {
  args: { children: 'Texto de ejemplo', size: 'base', color: 'default' },
};

export const Heading: Story = {
  args: { as: 'h1', size: '2xl', children: 'Título principal' },
};

export const Muted: Story = {
  args: { color: 'muted', children: 'Texto secundario o de ayuda' },
};

export const Danger: Story = {
  args: { color: 'danger', children: 'Error al procesar la solicitud' },
};

export const Success: Story = {
  args: { color: 'success', children: 'Operación exitosa' },
};

export const AllColors: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
      <TextAtom color="default">Default</TextAtom>
      <TextAtom color="muted">Muted</TextAtom>
      <TextAtom color="primary">Primary</TextAtom>
      <TextAtom color="danger">Danger</TextAtom>
      <TextAtom color="success">Success</TextAtom>
      <TextAtom color="warning">Warning</TextAtom>
    </div>
  ),
};

export const AllSizes: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
      <TextAtom size="xs">Extra small (xs)</TextAtom>
      <TextAtom size="sm">Small (sm)</TextAtom>
      <TextAtom size="base">Base</TextAtom>
      <TextAtom size="lg">Large (lg)</TextAtom>
      <TextAtom size="xl">Extra large (xl)</TextAtom>
      <TextAtom size="2xl">2XL</TextAtom>
    </div>
  ),
};

export const Interactive: Story = {
  render: () => {
    const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
    const colorMap = { idle: 'default', success: 'success', error: 'danger' } as const;
    const msgMap = {
      idle: 'Esperando acción del usuario...',
      success: 'Operación completada con éxito.',
      error: 'Ha ocurrido un error inesperado.',
    };
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <TextAtom color={colorMap[status]}>{msgMap[status]}</TextAtom>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button onClick={() => setStatus('success')} style={{ borderRadius: '6px', border: '1px solid #d4d4d4', padding: '4px 10px', fontSize: '13px', cursor: 'pointer' }}>Éxito</button>
          <button onClick={() => setStatus('error')} style={{ borderRadius: '6px', border: '1px solid #d4d4d4', padding: '4px 10px', fontSize: '13px', cursor: 'pointer' }}>Error</button>
          <button onClick={() => setStatus('idle')} style={{ borderRadius: '6px', border: '1px solid #d4d4d4', padding: '4px 10px', fontSize: '13px', cursor: 'pointer' }}>Reiniciar</button>
        </div>
      </div>
    );
  },
};
