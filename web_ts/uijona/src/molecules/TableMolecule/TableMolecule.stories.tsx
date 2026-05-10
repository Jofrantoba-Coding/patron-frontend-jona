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

export const Interactive: Story = {
  render: () => {
    const allUsers = [
      { name: 'Jonathan Franck', email: 'jofrantoba@gmail.com', status: 'Activo', variant: 'default' as const },
      { name: 'Ana García', email: 'ana@empresa.com', status: 'Inactivo', variant: 'secondary' as const },
      { name: 'Carlos Pérez', email: 'carlos@empresa.com', status: 'Bloqueado', variant: 'destructive' as const },
      { name: 'María Torres', email: 'maria@empresa.com', status: 'Activo', variant: 'default' as const },
    ];
    const [filter, setFilter] = useState('');
    const filtered = allUsers.filter(
      (u) => u.name.toLowerCase().includes(filter.toLowerCase()) || u.email.toLowerCase().includes(filter.toLowerCase())
    );
    return (
      <div style={{ width: '600px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <input
          placeholder="Buscar por nombre o email..."
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          style={{ borderRadius: '6px', border: '1px solid #d4d4d4', padding: '8px 12px', fontSize: '14px' }}
        />
        <TableMolecule>
          <TableCaption>Usuarios del sistema ({filtered.length})</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Nombre</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Estado</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.length > 0 ? filtered.map((u) => (
              <TableRow key={u.email}>
                <TableCell>{u.name}</TableCell>
                <TableCell>{u.email}</TableCell>
                <TableCell><BadgeAtom variant={u.variant}>{u.status}</BadgeAtom></TableCell>
              </TableRow>
            )) : (
              <TableRow>
                <TableCell colSpan={3} style={{ textAlign: 'center', color: '#a3a3a3' }}>
                  Sin resultados
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </TableMolecule>
      </div>
    );
  },
};
