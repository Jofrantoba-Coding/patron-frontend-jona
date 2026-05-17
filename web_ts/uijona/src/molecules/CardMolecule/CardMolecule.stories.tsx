import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import {
  CardMolecule,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from './CardMolecule';
import { JButton } from '../../atoms/JButton/JButton';
import { JPanel } from '../../atoms/JPanel/JPanel';
import { JLabel } from '../../atoms/JLabel';

const meta: Meta<typeof CardMolecule> = {
  title: 'Molecules/CardMolecule',
  component: CardMolecule,
  tags: ['autodocs'],
};
export default meta;
type Story = StoryObj<typeof CardMolecule>;

export const Default: Story = {
  render: () => (
    <CardMolecule style={{ width: '360px' }}>
      <CardHeader>
        <CardTitle>Título de la tarjeta</CardTitle>
        <CardDescription>Descripción breve del contenido</CardDescription>
      </CardHeader>
      <CardContent>
        <JLabel>Contenido principal de la tarjeta. Puede ser cualquier elemento React.</JLabel>
      </CardContent>
      <CardFooter>
        <JButton variant="outline" size="sm">Cancelar</JButton>
        <JButton size="sm">Confirmar</JButton>
      </CardFooter>
    </CardMolecule>
  ),
};

export const Simple: Story = {
  render: () => (
    <CardMolecule style={{ width: '360px', padding: '16px' }}>
      <JLabel>Tarjeta simple con solo contenido directo.</JLabel>
    </CardMolecule>
  ),
};

export const Interactive: Story = {
  render: () => {
    const [liked, setLiked] = useState(false);
    const [added, setAdded] = useState(false);
    return (
      <CardMolecule style={{ width: '360px' }}>
        <CardHeader>
          <JPanel variant="ghost" padding="none" className="flex justify-between items-start">
            <CardTitle>Producto Premium</CardTitle>
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
          <CardDescription>Plan anual con soporte prioritario incluido</CardDescription>
        </CardHeader>
        <CardContent>
          <JLabel size="2xl" className="font-bold mb-1">$99.00/año</JLabel>
          <JLabel size="sm" color="muted">Equivale a $8.25/mes. Cancela cuando quieras.</JLabel>
        </CardContent>
        <CardFooter>
          <JButton variant="outline" size="sm" onClick={() => setAdded(false)} disabled={!added}>
            Quitar
          </JButton>
          <JButton size="sm" onClick={() => setAdded(true)} disabled={added}>
            {added ? 'En carrito' : 'Agregar al carrito'}
          </JButton>
        </CardFooter>
      </CardMolecule>
    );
  },
};
