import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { TextAtom } from './TextAtom';
import { PanelAtom } from '../PanelAtom/PanelAtom';
import { ButtonAtom } from '../ButtonAtom/ButtonAtom';

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
    <PanelAtom variant="ghost" padding="none" style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
      <TextAtom color="default">Default</TextAtom>
      <TextAtom color="muted">Muted</TextAtom>
      <TextAtom color="primary">Primary</TextAtom>
      <TextAtom color="danger">Danger</TextAtom>
      <TextAtom color="success">Success</TextAtom>
      <TextAtom color="warning">Warning</TextAtom>
    </PanelAtom>
  ),
};

export const AllSizes: Story = {
  render: () => (
    <PanelAtom variant="ghost" padding="none" style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
      <TextAtom size="xs">Extra small (xs)</TextAtom>
      <TextAtom size="sm">Small (sm)</TextAtom>
      <TextAtom size="base">Base</TextAtom>
      <TextAtom size="lg">Large (lg)</TextAtom>
      <TextAtom size="xl">Extra large (xl)</TextAtom>
      <TextAtom size="2xl">2XL</TextAtom>
    </PanelAtom>
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
      <PanelAtom variant="ghost" padding="none" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <TextAtom color={colorMap[status]}>{msgMap[status]}</TextAtom>
        <PanelAtom variant="ghost" padding="none" style={{ display: 'flex', gap: '8px' }}>
          <ButtonAtom variant="outline" size="sm" onClick={() => setStatus('success')}>Éxito</ButtonAtom>
          <ButtonAtom variant="outline" size="sm" onClick={() => setStatus('error')}>Error</ButtonAtom>
          <ButtonAtom variant="outline" size="sm" onClick={() => setStatus('idle')}>Reiniciar</ButtonAtom>
        </PanelAtom>
      </PanelAtom>
    );
  },
};
