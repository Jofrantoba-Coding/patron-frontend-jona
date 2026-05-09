import type { Meta, StoryObj } from '@storybook/react';
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
