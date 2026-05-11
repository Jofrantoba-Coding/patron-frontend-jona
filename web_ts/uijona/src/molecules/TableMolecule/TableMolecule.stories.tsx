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
  type TableSortDirection,
  type TablePaginationConfig,
} from './TableMolecule';
import { BadgeAtom } from '../../atoms/BadgeAtom/BadgeAtom';

const meta: Meta<typeof TableMolecule> = {
  title: 'Molecules/TableMolecule',
  component: TableMolecule,
  subcomponents: { TableHead, TableRow, TableCell, TableHeader, TableBody },
  tags: ['autodocs'],
  argTypes: {
    responsiveMode: {
      control: 'inline-radio',
      options: ['scroll', 'cards', 'none'],
      description: 'Comportamiento responsivo de la tabla.',
      table: {
        defaultValue: { summary: 'scroll' },
      },
    },
    wrapperClassName: {
      control: 'text',
      description: 'Clases CSS adicionales para el div contenedor externo.',
      table: {
        defaultValue: { summary: 'undefined' },
      },
    },
  },
  decorators: [(Story) => <div className="w-full max-w-full p-2"><Story /></div>],
};

export default meta;
type Story = StoryObj<typeof TableMolecule>;

const allUsers = [
  { name: 'Jonathan Franck',  email: 'jofrantoba@gmail.com',                    role: 'Admin',           status: 'Activo',   variant: 'default'     as const },
  { name: 'Ana Garcia',       email: 'ana.garcia@empresa.example.com',           role: 'Operaciones',     status: 'Inactivo', variant: 'secondary'   as const },
  { name: 'Carlos Perez',     email: 'carlos.perez@empresa.example.com',         role: 'Soporte tecnico', status: 'Bloqueado',variant: 'destructive' as const },
  { name: 'Maria Torres',     email: 'maria.torres@empresa.example.com',         role: 'Producto',        status: 'Activo',   variant: 'default'     as const },
  { name: 'Luis Mendez',      email: 'luis.mendez@empresa.example.com',          role: 'Ventas',          status: 'Activo',   variant: 'default'     as const },
  { name: 'Sofia Ramirez',    email: 'sofia.ramirez@empresa.example.com',        role: 'Diseno',          status: 'Inactivo', variant: 'secondary'   as const },
  { name: 'Diego Vargas',     email: 'diego.vargas@empresa.example.com',         role: 'Ingenieria',      status: 'Activo',   variant: 'default'     as const },
  { name: 'Valentina Cruz',   email: 'valentina.cruz@empresa.example.com',       role: 'RR.HH.',          status: 'Activo',   variant: 'default'     as const },
  { name: 'Andres Molina',    email: 'andres.molina@empresa.example.com',        role: 'Legal',           status: 'Bloqueado',variant: 'destructive' as const },
  { name: 'Camila Ortega',    email: 'camila.ortega@empresa.example.com',        role: 'Finanzas',        status: 'Activo',   variant: 'default'     as const },
  { name: 'Sebastian Rojas',  email: 'sebastian.rojas@empresa.example.com',      role: 'Producto',        status: 'Inactivo', variant: 'secondary'   as const },
  { name: 'Isabella Morales', email: 'isabella.morales@empresa.example.com',     role: 'Operaciones',     status: 'Activo',   variant: 'default'     as const },
  { name: 'Mateo Herrera',    email: 'mateo.herrera@empresa.example.com',        role: 'Ingenieria',      status: 'Activo',   variant: 'default'     as const },
  { name: 'Luciana Castro',   email: 'luciana.castro@empresa.example.com',       role: 'Ventas',          status: 'Inactivo', variant: 'secondary'   as const },
  { name: 'Nicolas Soto',     email: 'nicolas.soto@empresa.example.com',         role: 'Diseno',          status: 'Activo',   variant: 'default'     as const },
  { name: 'Mariana Diaz',     email: 'mariana.diaz@empresa.example.com',         role: 'Marketing',       status: 'Activo',   variant: 'default'     as const },
  { name: 'Emilio Reyes',     email: 'emilio.reyes@empresa.example.com',         role: 'Admin',           status: 'Bloqueado',variant: 'destructive' as const },
  { name: 'Adriana Flores',   email: 'adriana.flores@empresa.example.com',       role: 'Finanzas',        status: 'Activo',   variant: 'default'     as const },
  { name: 'Roberto Jimenez',  email: 'roberto.jimenez@empresa.example.com',      role: 'Soporte tecnico', status: 'Inactivo', variant: 'secondary'   as const },
  { name: 'Patricia Nunez',   email: 'patricia.nunez@empresa.example.com',       role: 'RR.HH.',          status: 'Activo',   variant: 'default'     as const },
  { name: 'Fernando Ruiz',    email: 'fernando.ruiz@empresa.example.com',        role: 'Ingenieria',      status: 'Activo',   variant: 'default'     as const },
  { name: 'Gabriela Pena',    email: 'gabriela.pena@empresa.example.com',        role: 'Legal',           status: 'Activo',   variant: 'default'     as const },
  { name: 'Ricardo Vega',     email: 'ricardo.vega@empresa.example.com',         role: 'Marketing',       status: 'Inactivo', variant: 'secondary'   as const },
  { name: 'Elena Medina',     email: 'elena.medina@empresa.example.com',         role: 'Producto',        status: 'Activo',   variant: 'default'     as const },
];

// 4-item slice for stories that don't need pagination
const users = allUsers.slice(0, 4);

type UserKey = keyof (typeof allUsers)[0];

function sortUsers(data: typeof users, key: UserKey, direction: TableSortDirection) {
  if (!direction) return data;
  return [...data].sort((a, b) => {
    const r = String(a[key]).localeCompare(String(b[key]));
    return direction === 'asc' ? r : -r;
  });
}

// UsersTable: automatic filters, external sorting, and resizing.
function UsersTable({ responsiveMode = 'scroll' as const }: { responsiveMode?: 'scroll' | 'cards' | 'none' }) {
  const [sort, setSort] = useState<{ key: UserKey; direction: TableSortDirection }>({ key: 'name', direction: null });
  const [widths, setWidths] = useState({ name: 200, email: 260, role: 160, status: 120 });
  const sorted = sortUsers(users, sort.key, sort.direction);

  return (
    <TableMolecule responsiveMode={responsiveMode}>
      <TableCaption>Lista de usuarios registrados</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead
            sortable filterable resizable
            width={widths.name} minWidth={120}
            sortDirection={sort.key === 'name' ? sort.direction : null}
            filterPlaceholder="Filtrar nombre"
            onSortChange={(d) => setSort({ key: 'name', direction: d })}
            onColumnResize={(w) => setWidths((p) => ({ ...p, name: w }))}
          >
            Nombre
          </TableHead>
          <TableHead
            filterable resizable
            width={widths.email} minWidth={160}
            filterPlaceholder="Filtrar email"
            onColumnResize={(w) => setWidths((p) => ({ ...p, email: w }))}
          >
            Email
          </TableHead>
          <TableHead
            sortable filterable resizable
            width={widths.role} minWidth={100}
            sortDirection={sort.key === 'role' ? sort.direction : null}
            filterPlaceholder="Filtrar rol"
            onSortChange={(d) => setSort({ key: 'role', direction: d })}
            onColumnResize={(w) => setWidths((p) => ({ ...p, role: w }))}
          >
            Rol
          </TableHead>
          <TableHead
            filterable resizable
            width={widths.status} minWidth={100}
            filterPlaceholder="Filtrar estado"
            onColumnResize={(w) => setWidths((p) => ({ ...p, status: w }))}
          >
            Estado
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {sorted.map((user) => (
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
  args: { responsiveMode: 'scroll' },
  render: (args) => <UsersTable responsiveMode={args.responsiveMode} />,
};

export const MobileCards: Story = {
  args: { responsiveMode: 'cards' },
  render: (args) => (
    <div className="max-w-[360px]">
      <UsersTable responsiveMode={args.responsiveMode} />
    </div>
  ),
};

export const WideContent: Story = {
  args: { responsiveMode: 'scroll' },
  render: (args) => (
    <div className="max-w-[360px]">
      <TableMolecule responsiveMode={args.responsiveMode}>
        <TableHeader>
          <TableRow>
            <TableHead resizable filterable minWidth={100} filterPlaceholder="Filtrar orden">Orden</TableHead>
            <TableHead resizable filterable minWidth={140} filterPlaceholder="Filtrar cliente">Cliente</TableHead>
            <TableHead resizable filterable minWidth={200} filterPlaceholder="Filtrar descripcion">Descripcion larga</TableHead>
            <TableHead resizable filterable minWidth={80} filterPlaceholder="Filtrar total">Total</TableHead>
            <TableHead resizable filterable minWidth={80} filterPlaceholder="Filtrar estado">Estado</TableHead>
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

export const GroupedHeaders: Story = {
  args: { responsiveMode: 'scroll' },
  render: (args) => {
    const [sort, setSort] = useState<{ key: 'email' | 'status'; direction: TableSortDirection }>({ key: 'email', direction: null });
    const [widths, setWidths] = useState({ name: 160, email: 220, phone: 140, access: 140, status: 120 });

    const sorted = sort.direction
      ? [...users].sort((a, b) => {
          const valA = sort.key === 'status' ? a.status : a.email;
          const valB = sort.key === 'status' ? b.status : b.email;
          const r = valA.localeCompare(valB);
          return sort.direction === 'asc' ? r : -r;
        })
      : users;

    return (
      <TableMolecule responsiveMode={args.responsiveMode}>
        <TableCaption>Headers agrupados con columnas hijas independientes</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead
              rowSpan={2} resizable
              width={widths.name} minWidth={120}
              onColumnResize={(w) => setWidths((p) => ({ ...p, name: w }))}
            >
              Usuario
            </TableHead>
            <TableHead colSpan={2} groupHeader>Contacto</TableHead>
            <TableHead colSpan={2} groupHeader>Actividad</TableHead>
          </TableRow>
          <TableRow>
            <TableHead
              sortable filterable resizable
              width={widths.email} minWidth={160}
              sortDirection={sort.key === 'email' ? sort.direction : null}
              filterPlaceholder="Filtrar email"
              onSortChange={(d) => setSort({ key: 'email', direction: d })}
              onColumnResize={(w) => setWidths((p) => ({ ...p, email: w }))}
            >
              Email
            </TableHead>
            <TableHead
              filterable resizable
              width={widths.phone} minWidth={100}
              filterPlaceholder="Filtrar telefono"
              onColumnResize={(w) => setWidths((p) => ({ ...p, phone: w }))}
            >
              Telefono
            </TableHead>
            <TableHead
              filterable resizable
              width={widths.access} minWidth={100}
              filterPlaceholder="Filtrar acceso"
              onColumnResize={(w) => setWidths((p) => ({ ...p, access: w }))}
            >
              Ultimo acceso
            </TableHead>
            <TableHead
              sortable filterable resizable
              width={widths.status} minWidth={100}
              sortDirection={sort.key === 'status' ? sort.direction : null}
              filterPlaceholder="Filtrar estado"
              onSortChange={(d) => setSort({ key: 'status', direction: d })}
              onColumnResize={(w) => setWidths((p) => ({ ...p, status: w }))}
            >
              Estado
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sorted.map((user, index) => (
            <TableRow key={user.email}>
              <TableCell>{user.name}</TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>+51 999 000 00{index}</TableCell>
              <TableCell>{index === 0 ? 'Hoy 09:30' : 'Ayer 17:45'}</TableCell>
              <TableCell><BadgeAtom variant={user.variant}>{user.status}</BadgeAtom></TableCell>
            </TableRow>
          ))}
        </TableBody>
      </TableMolecule>
    );
  },
};

export const GroupedHeadersMobileCards: Story = {
  render: () => (
    <div className="max-w-[360px]">
      <TableMolecule responsiveMode="cards">
        <TableCaption>Headers agrupados en modo cards</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead rowSpan={2} resizable minWidth={100}>Usuario</TableHead>
            <TableHead colSpan={2} groupHeader>Contacto</TableHead>
          </TableRow>
          <TableRow>
            <TableHead resizable filterable minWidth={160} filterPlaceholder="Filtrar email">Email</TableHead>
            <TableHead resizable filterable minWidth={100} filterPlaceholder="Filtrar telefono">Telefono</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.slice(0, 2).map((user, index) => (
            <TableRow key={user.email}>
              <TableCell>{user.name}</TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>+51 999 000 00{index}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </TableMolecule>
    </div>
  ),
};

export const AutoFiltering: Story = {
  render: () => (
    <TableMolecule responsiveMode="scroll">
      <TableCaption>Filtros automaticos por columna (sin estado externo)</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead resizable filterable minWidth={120} filterPlaceholder="Filtrar nombre">Nombre</TableHead>
          <TableHead resizable filterable minWidth={160} filterPlaceholder="Filtrar email">Email</TableHead>
          <TableHead resizable filterable minWidth={100} filterPlaceholder="Filtrar rol">Rol</TableHead>
          <TableHead resizable filterable minWidth={100} filterPlaceholder="Filtrar estado">Estado</TableHead>
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
  ),
};

export const Interactive: Story = {
  render: () => {
    const [sort, setSort] = useState<{ key: UserKey; direction: TableSortDirection }>({ key: 'name', direction: null });
    const [widths, setWidths] = useState({ name: 200, email: 260, role: 160, status: 120 });
    const sorted = sortUsers(users, sort.key, sort.direction);

    return (
      <TableMolecule responsiveMode="cards">
        <TableCaption>Usuarios del sistema</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead
              sortable filterable resizable
              width={widths.name} minWidth={120}
              sortDirection={sort.key === 'name' ? sort.direction : null}
              filterPlaceholder="Filtrar nombre"
              onSortChange={(d) => setSort({ key: 'name', direction: d })}
              onColumnResize={(w) => setWidths((p) => ({ ...p, name: w }))}
            >
              Nombre
            </TableHead>
            <TableHead
              filterable resizable
              width={widths.email} minWidth={160}
              filterPlaceholder="Filtrar email"
              onColumnResize={(w) => setWidths((p) => ({ ...p, email: w }))}
            >
              Email
            </TableHead>
            <TableHead
              sortable filterable resizable
              width={widths.role} minWidth={100}
              sortDirection={sort.key === 'role' ? sort.direction : null}
              filterPlaceholder="Filtrar rol"
              onSortChange={(d) => setSort({ key: 'role', direction: d })}
              onColumnResize={(w) => setWidths((p) => ({ ...p, role: w }))}
            >
              Rol
            </TableHead>
            <TableHead
              filterable resizable
              width={widths.status} minWidth={100}
              filterPlaceholder="Filtrar estado"
              onColumnResize={(w) => setWidths((p) => ({ ...p, status: w }))}
            >
              Estado
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sorted.map((user) => (
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
  },
};

export const Pagination: Story = {
  render: () => {
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(5);

    const totalRows = allUsers.length;
    const paginated = allUsers.slice((currentPage - 1) * pageSize, currentPage * pageSize);

    const pagination: TablePaginationConfig = {
      currentPage,
      pageSize,
      totalRows,
      pageSizeOptions: [5, 10, 20],
      onPageChange: setCurrentPage,
      onPageSizeChange: setPageSize,
    };

    return (
      <TableMolecule responsiveMode="scroll" pagination={pagination}>
        <TableCaption>Usuarios del sistema ({totalRows} en total)</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead resizable filterable minWidth={140} filterPlaceholder="Filtrar nombre">Nombre</TableHead>
            <TableHead resizable filterable minWidth={180} filterPlaceholder="Filtrar email">Email</TableHead>
            <TableHead resizable filterable minWidth={120} filterPlaceholder="Filtrar rol">Rol</TableHead>
            <TableHead resizable filterable minWidth={100} filterPlaceholder="Filtrar estado">Estado</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {paginated.map((user) => (
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
  },
};

export const PaginationSortFilter: Story = {
  render: () => {
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(5);
    const [sort, setSort] = useState<{ key: UserKey; direction: TableSortDirection }>({ key: 'name', direction: null });
    const [filters, setFilters] = useState({ name: '', role: '', status: '' });
    const [widths, setWidths] = useState({ name: 180, email: 240, role: 160, status: 130 });

    const filtered = allUsers.filter((u) =>
      u.name.toLowerCase().includes(filters.name.toLowerCase()) &&
      u.role.toLowerCase().includes(filters.role.toLowerCase()) &&
      u.status.toLowerCase().includes(filters.status.toLowerCase())
    );

    const sorted = sortUsers(filtered, sort.key, sort.direction);
    const paginated = sorted.slice((currentPage - 1) * pageSize, currentPage * pageSize);

    const handleFilterChange = (key: keyof typeof filters) => (value: string) => {
      setFilters((p) => ({ ...p, [key]: value }));
      setCurrentPage(1);
    };

    const handleSort = (key: UserKey) => (direction: TableSortDirection) => {
      setSort({ key, direction });
      setCurrentPage(1);
    };

    const pagination: TablePaginationConfig = {
      currentPage,
      pageSize,
      totalRows: filtered.length,
      pageSizeOptions: [5, 10, 20],
      onPageChange: setCurrentPage,
      onPageSizeChange: (size) => { setPageSize(size); setCurrentPage(1); },
    };

    return (
      <TableMolecule responsiveMode="scroll" pagination={pagination}>
        <TableCaption>
          {filtered.length} de {allUsers.length} usuarios
        </TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead
              sortable filterable resizable
              width={widths.name} minWidth={140}
              sortDirection={sort.key === 'name' ? sort.direction : null}
              filterValue={filters.name}
              filterPlaceholder="Filtrar nombre"
              onSortChange={handleSort('name')}
              onFilterChange={handleFilterChange('name')}
              onColumnResize={(w) => setWidths((p) => ({ ...p, name: w }))}
            >Nombre</TableHead>
            <TableHead
              resizable filterable
              width={widths.email} minWidth={180}
              filterPlaceholder="Filtrar email"
              onColumnResize={(w) => setWidths((p) => ({ ...p, email: w }))}
            >Email</TableHead>
            <TableHead
              sortable filterable resizable
              width={widths.role} minWidth={120}
              sortDirection={sort.key === 'role' ? sort.direction : null}
              filterValue={filters.role}
              filterPlaceholder="Filtrar rol"
              onSortChange={handleSort('role')}
              onFilterChange={handleFilterChange('role')}
              onColumnResize={(w) => setWidths((p) => ({ ...p, role: w }))}
            >Rol</TableHead>
            <TableHead
              sortable filterable resizable
              width={widths.status} minWidth={100}
              sortDirection={sort.key === 'status' ? sort.direction : null}
              filterValue={filters.status}
              filterPlaceholder="Filtrar estado"
              onSortChange={handleSort('status')}
              onFilterChange={handleFilterChange('status')}
              onColumnResize={(w) => setWidths((p) => ({ ...p, status: w }))}
            >Estado</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {paginated.length > 0 ? paginated.map((user) => (
            <TableRow key={user.email}>
              <TableCell>{user.name}</TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>{user.role}</TableCell>
              <TableCell><BadgeAtom variant={user.variant}>{user.status}</BadgeAtom></TableCell>
            </TableRow>
          )) : (
            <TableRow>
              <TableCell colSpan={4}>
                <span className="block py-6 text-center text-neutral-400">Sin resultados</span>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </TableMolecule>
    );
  },
};

export const SortFilterResize: Story = {
  render: () => {
    const [sort, setSort] = useState<{ key: UserKey; direction: TableSortDirection }>({
      key: 'name',
      direction: null,
    });
    const [filters, setFilters] = useState({ name: '', role: '' });
    const [widths, setWidths] = useState({ name: 180, email: 260, role: 180, status: 140 });

    const filtered = users.filter((user) => (
      user.name.toLowerCase().includes(filters.name.toLowerCase())
      && user.role.toLowerCase().includes(filters.role.toLowerCase())
    ));

    const sorted = sortUsers(filtered, sort.key, sort.direction);

    const handleSort = (key: UserKey) => (direction: TableSortDirection) => {
      setSort({ key, direction });
    };

    return (
      <TableMolecule responsiveMode="scroll">
        <TableCaption>Columnas con ordenamiento, filtros y resizing</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead
              sortable filterable resizable
              width={widths.name} minWidth={140}
              sortDirection={sort.key === 'name' ? sort.direction : null}
              filterValue={filters.name}
              filterPlaceholder="Filtrar nombre"
              onSortChange={handleSort('name')}
              onFilterChange={(value) => setFilters((c) => ({ ...c, name: value }))}
              onColumnResize={(w) => setWidths((c) => ({ ...c, name: w }))}
            >
              Nombre
            </TableHead>
            <TableHead
              resizable filterable
              width={widths.email} minWidth={180}
              filterPlaceholder="Filtrar email"
              onColumnResize={(w) => setWidths((c) => ({ ...c, email: w }))}
            >
              Email
            </TableHead>
            <TableHead
              sortable filterable resizable
              width={widths.role} minWidth={140}
              sortDirection={sort.key === 'role' ? sort.direction : null}
              filterValue={filters.role}
              filterPlaceholder="Filtrar rol"
              onSortChange={handleSort('role')}
              onFilterChange={(value) => setFilters((c) => ({ ...c, role: value }))}
              onColumnResize={(w) => setWidths((c) => ({ ...c, role: w }))}
            >
              Rol
            </TableHead>
            <TableHead
              sortable filterable resizable
              width={widths.status} minWidth={100}
              sortDirection={sort.key === 'status' ? sort.direction : null}
              filterPlaceholder="Filtrar estado"
              onSortChange={handleSort('status')}
              onColumnResize={(w) => setWidths((c) => ({ ...c, status: w }))}
            >
              Estado
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sorted.length > 0 ? sorted.map((user) => (
            <TableRow key={user.email}>
              <TableCell>{user.name}</TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>{user.role}</TableCell>
              <TableCell><BadgeAtom variant={user.variant}>{user.status}</BadgeAtom></TableCell>
            </TableRow>
          )) : (
            <TableRow>
              <TableCell colSpan={4}>
                <span className="block py-6 text-center text-neutral-400">Sin resultados</span>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </TableMolecule>
    );
  },
};
