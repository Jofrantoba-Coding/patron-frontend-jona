import type { Meta, StoryObj } from '@storybook/react';
import {
  TableMolecule,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
  TableCaption,
} from './TableMolecule';
import { BadgeAtom } from '../../atoms/BadgeAtom/BadgeAtom';

const meta: Meta<typeof TableMolecule> = {
  title: 'Molecules/TableMolecule',
  component: TableMolecule,
  tags: ['autodocs'],
};
export default meta;
type Story = StoryObj<typeof TableMolecule>;

export const Default: Story = {
  render: () => (
    <TableMolecule style={{ width: '600px' }}>
      <TableCaption>Lista de usuarios registrados</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>Nombre</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Estado</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow>
          <TableCell>Jonathan Franck</TableCell>
          <TableCell>jofrantoba@gmail.com</TableCell>
          <TableCell><BadgeAtom variant="default">Activo</BadgeAtom></TableCell>
        </TableRow>
        <TableRow>
          <TableCell>Ana García</TableCell>
          <TableCell>ana@empresa.com</TableCell>
          <TableCell><BadgeAtom variant="secondary">Inactivo</BadgeAtom></TableCell>
        </TableRow>
        <TableRow>
          <TableCell>Carlos Pérez</TableCell>
          <TableCell>carlos@empresa.com</TableCell>
          <TableCell><BadgeAtom variant="destructive">Bloqueado</BadgeAtom></TableCell>
        </TableRow>
      </TableBody>
    </TableMolecule>
  ),
};
