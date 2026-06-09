import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import {
  JCard,
  JCardHeader,
  JCardTitle,
  JCardDescription,
  JCardContent,
  JCardFooter,
} from './JCard';
import { JButton } from '../../atoms/JButton/JButton';
import { JPanel } from '../../atoms/JPanel/JPanel';
import { JLabel } from '../../atoms/JLabel';

const meta: Meta<typeof JCard> = {
  title: 'Molecules/JCard',
  component: JCard,
  tags: ['autodocs'],
};
export default meta;
type Story = StoryObj<typeof JCard>;

export const Default: Story = {
  render: () => (
    <JCard style={{ width: '360px' }}>
      <JCardHeader>
        <JCardTitle>Título de la tarjeta</JCardTitle>
        <JCardDescription>Descripción breve del contenido</JCardDescription>
      </JCardHeader>
      <JCardContent>
        <JLabel>Contenido principal de la tarjeta. Puede ser cualquier elemento React.</JLabel>
      </JCardContent>
      <JCardFooter>
        <JButton variant="outline" size="sm">Cancelar</JButton>
        <JButton size="sm">Confirmar</JButton>
      </JCardFooter>
    </JCard>
  ),
};

export const Simple: Story = {
  render: () => (
    <JCard style={{ width: '360px', padding: '16px' }}>
      <JLabel>Tarjeta simple con solo contenido directo.</JLabel>
    </JCard>
  ),
};

export const Interactive: Story = {
  render: () => {
    const [liked, setLiked] = useState(false);
    const [added, setAdded] = useState(false);
    return (
      <JCard style={{ width: '360px' }}>
        <JCardHeader>
          <JPanel variant="ghost" padding="none" className="flex justify-between items-start">
            <JCardTitle>Producto Premium</JCardTitle>
            <JButton
              variant="ghost"
              size="icon"
              onClick={() => setLiked((l) => !l)}
              className="text-xl"
              aria-label={liked ? 'Quitar de favoritos' : 'Añadir a favoritos'}
            >
              {liked ? '♥' : '♡'}
            </JButton>
          </JPanel>
          <JCardDescription>Plan anual con soporte prioritario incluido</JCardDescription>
        </JCardHeader>
        <JCardContent>
          <JLabel size="2xl" className="font-bold mb-1">$99.00/año</JLabel>
          <JLabel size="sm" color="muted">Equivale a $8.25/mes. Cancela cuando quieras.</JLabel>
        </JCardContent>
        <JCardFooter>
          <JButton variant="outline" size="sm" onClick={() => setAdded(false)} disabled={!added}>
            Quitar
          </JButton>
          <JButton size="sm" onClick={() => setAdded(true)} disabled={added}>
            {added ? 'En carrito' : 'Agregar al carrito'}
          </JButton>
        </JCardFooter>
      </JCard>
    );
  },
};
