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
import { ButtonAtom } from '../../atoms/ButtonAtom/ButtonAtom';

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
        <p>Contenido principal de la tarjeta. Puede ser cualquier elemento React.</p>
      </CardContent>
      <CardFooter>
        <ButtonAtom variant="outline" size="sm">Cancelar</ButtonAtom>
        <ButtonAtom size="sm">Confirmar</ButtonAtom>
      </CardFooter>
    </CardMolecule>
  ),
};

export const Simple: Story = {
  render: () => (
    <CardMolecule style={{ width: '360px', padding: '16px' }}>
      <p>Tarjeta simple con solo contenido directo.</p>
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
          <div className="flex justify-between items-start">
            <CardTitle>Producto Premium</CardTitle>
            <button
              onClick={() => setLiked((l) => !l)}
              style={{ fontSize: '20px', background: 'none', border: 'none', cursor: 'pointer', lineHeight: 1 }}
              aria-label={liked ? 'Quitar de favoritos' : 'Añadir a favoritos'}
            >
              {liked ? '♥' : '♡'}
            </button>
          </div>
          <CardDescription>Plan anual con soporte prioritario incluido</CardDescription>
        </CardHeader>
        <CardContent>
          <p style={{ fontSize: '24px', fontWeight: 700, margin: '0 0 4px' }}>$99.00/año</p>
          <p style={{ fontSize: '13px', color: '#737373', margin: 0 }}>Equivale a $8.25/mes. Cancela cuando quieras.</p>
        </CardContent>
        <CardFooter>
          <ButtonAtom variant="outline" size="sm" onClick={() => setAdded(false)} disabled={!added}>
            Quitar
          </ButtonAtom>
          <ButtonAtom size="sm" onClick={() => setAdded(true)} disabled={added}>
            {added ? 'En carrito' : 'Agregar al carrito'}
          </ButtonAtom>
        </CardFooter>
      </CardMolecule>
    );
  },
};
