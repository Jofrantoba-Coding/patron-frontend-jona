import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
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
  argTypes: {
    responsiveMode: {
      control: 'inline-radio',
      options: ['scroll', 'cards', 'none'],
    },
  },
  decorators: [(Story) => <div className="w-full max-w-full p-2"><Story /></div>],
};

export default meta;
type Story = StoryObj<typeof TableMolecule>;

const users = [
  { name: 'Jonathan Franck', email: 'jofrantoba@gmail.com', role: 'Admin', status: 'Activo', variant: 'default' as const },
  { name: 'Ana Garcia', email: 'ana.garcia@empresa-interna.example.com', role: 'Operaciones', status: 'Inactivo', variant: 'secondary' as const },
  { name: 'Carlos Perez', email: 'carlos.perez@empresa-interna.example.com', role: 'Soporte tecnico', status: 'Bloqueado', variant: 'destructive' as const },
  { name: 'Maria Torres', email: 'maria.torres@empresa-interna.example.com', role: 'Producto', status: 'Activo', variant: 'default' as const },
];

function UsersTable({ responsiveMode = 'scroll' }: { responsiveMode?: 'scroll' | 'cards' | 'none' }) {
  return (
    <TableMolecule responsiveMode={responsiveMode}>
      <TableCaption>Lista de usuarios registrados</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>Nombre</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Rol</TableHead>
          <TableHead>Estado</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {users.map((user) => (
          <TableRow key={user.email}>
            <TableCell>{user.name}</TableCell>
            <TableCell>{user.email}</TableCell>
            <TableCell>{user.role}</TableCell>
            <TableCell><BadgeAtom variant={user.variant}>{user.status}</BadgeAtom></TableCell>
          </TableRow>
        ))}
      </TableBody>
    </TableMolecule>
  );
}

export const Default: Story = {
  args: {
    responsiveMode: 'scroll',
  },
  render: (args) => <UsersTable responsiveMode={args.responsiveMode} />,
};

export const MobileCards: Story = {
  args: {
    responsiveMode: 'cards',
  },
  render: (args) => (
    <div className="max-w-[360px]">
      <UsersTable responsiveMode={args.responsiveMode} />
    </div>
  ),
};

export const WideContent: Story = {
  args: {
    responsiveMode: 'scroll',
  },
  render: (args) => (
    <div className="max-w-[360px]">
      <TableMolecule responsiveMode={args.responsiveMode}>
        <TableHeader>
          <TableRow>
            <TableHead>Orden</TableHead>
            <TableHead>Cliente</TableHead>
            <TableHead>Descripcion larga</TableHead>
            <TableHead>Total</TableHead>
            <TableHead>Estado</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell>#ORD-2026-0001</TableCell>
            <TableCell>Acme Corporation International</TableCell>
            <TableCell>Solicitud con texto largo que debe mantenerse legible sin romper el layout mobile.</TableCell>
            <TableCell>$12,450.00</TableCell>
            <TableCell><BadgeAtom variant="default">Pagada</BadgeAtom></TableCell>
          </TableRow>
        </TableBody>
      </TableMolecule>
    </div>
  ),
};

export const Interactive: Story = {
  render: () => {
    const [filter, setFilter] = useState('');
    const filtered = users.filter(
      (user) => user.name.toLowerCase().includes(filter.toLowerCase()) || user.email.toLowerCase().includes(filter.toLowerCase())
    );

    return (
      <div className="flex w-full max-w-xl flex-col gap-3">
        <input
          placeholder="Buscar por nombre o email..."
          value={filter}
          onChange={(event) => setFilter(event.target.value)}
          className="h-9 rounded-md border border-neutral-300 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
        />
        <TableMolecule responsiveMode="cards">
          <TableCaption>Usuarios del sistema ({filtered.length})</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Nombre</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Estado</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.length > 0 ? filtered.map((user) => (
              <TableRow key={user.email}>
                <TableCell>{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell><BadgeAtom variant={user.variant}>{user.status}</BadgeAtom></TableCell>
              </TableRow>
            )) : (
              <TableRow>
                <TableCell colSpan={3} data-label="">
                  <span className="block text-center text-neutral-400">Sin resultados</span>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </TableMolecule>
      </div>
    );
  },
};
