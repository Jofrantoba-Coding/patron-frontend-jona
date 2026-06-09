import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import {
  JTable,
  JTableHead,
  JTableRow,
  JTableCell,
  JTableHeader,
  JTableBody,
  type JTableSortDirection,
  type JTablePaginationConfig,
  type JTableColumnsConfig,
  type JTableColumnDef,
} from './JTable';
import { JBadge, type JBadgeVariant } from '../../atoms/JBadge';
import { JPanel } from '../../atoms/JPanel/JPanel';

const meta: Meta<typeof JTable> = {
  title: 'Molecules/JTable',
  component: JTable,
  subcomponents: { JTableHead, JTableRow, JTableCell, JTableHeader, JTableBody },
  tags: ['autodocs'],
  argTypes: {
    responsiveMode: {
      control: 'inline-radio',
      options: ['scroll', 'cards', 'none'],
      description: 'Comportamiento responsivo de la tabla.',
      table: { defaultValue: { summary: 'scroll' } },
    },
    wrapperClassName: {
      control: 'text',
      description: 'Clases CSS adicionales para el div contenedor externo.',
      table: { defaultValue: { summary: 'undefined' } },
    },
  },
  decorators: [(Story) => <JPanel variant="ghost" padding="none" className="w-full max-w-full p-2"><Story /></JPanel>],
};

export default meta;
type Story = StoryObj<typeof JTable>;

// ─── Dataset ──────────────────────────────────────────────────────────────────

type BadgeVariant = 'default' | 'secondary' | 'destructive';

const allUsers = [
  { name: 'Jonathan Franck',  email: 'jofrantoba@gmail.com',                role: 'Admin',           status: 'Activo',    variant: 'default'     as JBadgeVariant, phone: '+51 912 345 678', lastAccess: 'Hoy 09:30'    },
  { name: 'Ana Garcia',       email: 'ana.garcia@empresa.example.com',       role: 'Operaciones',     status: 'Inactivo',  variant: 'secondary'   as JBadgeVariant, phone: '+51 923 456 789', lastAccess: 'Ayer 15:20'   },
  { name: 'Carlos Perez',     email: 'carlos.perez@empresa.example.com',     role: 'Soporte tecnico', status: 'Bloqueado', variant: 'destructive' as JBadgeVariant, phone: '+51 934 567 890', lastAccess: '2026-04-28'   },
  { name: 'Maria Torres',     email: 'maria.torres@empresa.example.com',     role: 'Producto',        status: 'Activo',    variant: 'default'     as JBadgeVariant, phone: '+51 945 678 901', lastAccess: 'Hoy 11:45'    },
  { name: 'Luis Mendez',      email: 'luis.mendez@empresa.example.com',      role: 'Ventas',          status: 'Activo',    variant: 'default'     as JBadgeVariant, phone: '+51 956 789 012', lastAccess: 'Ayer 08:00'   },
  { name: 'Sofia Ramirez',    email: 'sofia.ramirez@empresa.example.com',    role: 'Diseno',          status: 'Inactivo',  variant: 'secondary'   as JBadgeVariant, phone: '+51 967 890 123', lastAccess: '2026-05-01'   },
  { name: 'Diego Vargas',     email: 'diego.vargas@empresa.example.com',     role: 'Ingenieria',      status: 'Activo',    variant: 'default'     as JBadgeVariant, phone: '+51 978 901 234', lastAccess: 'Hoy 14:10'    },
  { name: 'Valentina Cruz',   email: 'valentina.cruz@empresa.example.com',   role: 'RR.HH.',          status: 'Activo',    variant: 'default'     as JBadgeVariant, phone: '+51 989 012 345', lastAccess: 'Ayer 17:30'   },
  { name: 'Andres Molina',    email: 'andres.molina@empresa.example.com',    role: 'Legal',           status: 'Bloqueado', variant: 'destructive' as JBadgeVariant, phone: '+51 990 123 456', lastAccess: '2026-04-15'   },
  { name: 'Camila Ortega',    email: 'camila.ortega@empresa.example.com',    role: 'Finanzas',        status: 'Activo',    variant: 'default'     as JBadgeVariant, phone: '+51 901 234 567', lastAccess: 'Hoy 10:00'    },
  { name: 'Sebastian Rojas',  email: 'sebastian.rojas@empresa.example.com',  role: 'Producto',        status: 'Inactivo',  variant: 'secondary'   as JBadgeVariant, phone: '+51 912 345 001', lastAccess: '2026-05-03'   },
  { name: 'Isabella Morales', email: 'isabella.morales@empresa.example.com', role: 'Operaciones',     status: 'Activo',    variant: 'default'     as JBadgeVariant, phone: '+51 923 456 002', lastAccess: 'Ayer 12:15'   },
  { name: 'Mateo Herrera',    email: 'mateo.herrera@empresa.example.com',    role: 'Ingenieria',      status: 'Activo',    variant: 'default'     as JBadgeVariant, phone: '+51 934 567 003', lastAccess: 'Hoy 08:45'    },
  { name: 'Luciana Castro',   email: 'luciana.castro@empresa.example.com',   role: 'Ventas',          status: 'Inactivo',  variant: 'secondary'   as JBadgeVariant, phone: '+51 945 678 004', lastAccess: '2026-04-30'   },
  { name: 'Nicolas Soto',     email: 'nicolas.soto@empresa.example.com',     role: 'Diseno',          status: 'Activo',    variant: 'default'     as JBadgeVariant, phone: '+51 956 789 005', lastAccess: 'Ayer 09:20'   },
  { name: 'Mariana Diaz',     email: 'mariana.diaz@empresa.example.com',     role: 'Marketing',       status: 'Activo',    variant: 'default'     as JBadgeVariant, phone: '+51 967 890 006', lastAccess: 'Hoy 16:00'    },
  { name: 'Emilio Reyes',     email: 'emilio.reyes@empresa.example.com',     role: 'Admin',           status: 'Bloqueado', variant: 'destructive' as JBadgeVariant, phone: '+51 978 901 007', lastAccess: '2026-04-20'   },
  { name: 'Adriana Flores',   email: 'adriana.flores@empresa.example.com',   role: 'Finanzas',        status: 'Activo',    variant: 'default'     as JBadgeVariant, phone: '+51 989 012 008', lastAccess: 'Ayer 14:50'   },
  { name: 'Roberto Jimenez',  email: 'roberto.jimenez@empresa.example.com',  role: 'Soporte tecnico', status: 'Inactivo',  variant: 'secondary'   as JBadgeVariant, phone: '+51 990 123 009', lastAccess: '2026-05-05'   },
  { name: 'Patricia Nunez',   email: 'patricia.nunez@empresa.example.com',   role: 'RR.HH.',          status: 'Activo',    variant: 'default'     as JBadgeVariant, phone: '+51 901 234 010', lastAccess: 'Hoy 07:30'    },
  { name: 'Fernando Ruiz',    email: 'fernando.ruiz@empresa.example.com',    role: 'Ingenieria',      status: 'Activo',    variant: 'default'     as JBadgeVariant, phone: '+51 912 345 011', lastAccess: 'Ayer 11:00'   },
  { name: 'Gabriela Pena',    email: 'gabriela.pena@empresa.example.com',    role: 'Legal',           status: 'Activo',    variant: 'default'     as JBadgeVariant, phone: '+51 923 456 012', lastAccess: 'Hoy 13:25'    },
  { name: 'Ricardo Vega',     email: 'ricardo.vega@empresa.example.com',     role: 'Marketing',       status: 'Inactivo',  variant: 'secondary'   as JBadgeVariant, phone: '+51 934 567 013', lastAccess: '2026-05-02'   },
  { name: 'Elena Medina',     email: 'elena.medina@empresa.example.com',     role: 'Producto',        status: 'Activo',    variant: 'default'     as JBadgeVariant, phone: '+51 945 678 014', lastAccess: 'Ayer 16:40'   },
];

const users = allUsers.slice(0, 4);

type UserRow = typeof allUsers[0];
type UserKey = keyof UserRow;

const orders = [
  { id: '#ORD-2026-0001', client: 'Acme Corporation International', description: 'Solicitud con texto largo que debe mantenerse legible sin romper el layout mobile.', total: '$12,450.00', status: 'Pagada',    statusVariant: 'default'     as JBadgeVariant },
  { id: '#ORD-2026-0002', client: 'Global Tech Solutions S.A.',      description: 'Renovacion anual de licencias de software y soporte premium extendido.',             total: '$8,200.00',  status: 'Pendiente', statusVariant: 'secondary'   as JBadgeVariant },
  { id: '#ORD-2026-0003', client: 'Inversiones Norte Ltda.',         description: 'Implementacion de modulo de reportes con exportacion a PDF y Excel.',                total: '$3,750.00',  status: 'Vencida',   statusVariant: 'destructive' as JBadgeVariant },
];

// ─── Column definitions ───────────────────────────────────────────────────────

const statusRender: JTableColumnDef['render'] = (v, row) => (
  <JBadge variant={row['variant'] as JBadgeVariant}>{String(v)}</JBadge>
);

const userColumns: JTableColumnDef[] = [
  { key: 'name',   header: 'Nombre', sortable: true, filterable: true, resizable: true, filterPlaceholder: 'Filtrar nombre', minWidth: 140 },
  { key: 'email',  header: 'Email',                  filterable: true, resizable: true, filterPlaceholder: 'Filtrar email',  minWidth: 180 },
  { key: 'role',   header: 'Rol',    sortable: true, filterable: true, resizable: true, filterPlaceholder: 'Filtrar rol',    minWidth: 120 },
  { key: 'status', header: 'Estado',                 filterable: true, resizable: true, filterPlaceholder: 'Filtrar estado', minWidth: 100, render: statusRender },
];

const groupedUserColumns: JTableColumnsConfig = [
  {
    label: 'Usuario',
    columns: [
      { key: 'name', header: 'Nombre', resizable: true, minWidth: 120 },
    ],
  },
  {
    label: 'Contacto',
    columns: [
      { key: 'email', header: 'Email',     sortable: true, filterable: true, resizable: true, filterPlaceholder: 'Filtrar email',    minWidth: 180 },
      { key: 'phone', header: 'Telefono',                  filterable: true, resizable: true, filterPlaceholder: 'Filtrar telefono', minWidth: 130 },
    ],
  },
  {
    label: 'Actividad',
    columns: [
      { key: 'lastAccess', header: 'Ultimo acceso',                   filterable: true, resizable: true, filterPlaceholder: 'Filtrar acceso', minWidth: 130 },
      { key: 'status',     header: 'Estado',       sortable: true,    filterable: true, resizable: true, filterPlaceholder: 'Filtrar estado', minWidth: 100, render: statusRender },
    ],
  },
];

const orderColumns: JTableColumnDef[] = [
  { key: 'id',          header: 'Orden',             resizable: true, filterable: true, filterPlaceholder: 'Filtrar orden',       minWidth: 130 },
  { key: 'client',      header: 'Cliente',            resizable: true, filterable: true, filterPlaceholder: 'Filtrar cliente',     minWidth: 180 },
  { key: 'description', header: 'Descripcion',        resizable: true, filterable: true, filterPlaceholder: 'Filtrar descripcion', minWidth: 260 },
  { key: 'total',       header: 'Total',   align: 'right', resizable: true, filterable: true, filterPlaceholder: 'Filtrar total', minWidth: 100 },
  {
    key: 'status', header: 'Estado', resizable: true, filterable: true, filterPlaceholder: 'Filtrar estado', minWidth: 100,
    render: (v, row) => <JBadge variant={row['statusVariant'] as JBadgeVariant}>{String(v)}</JBadge>,
  },
];

// ─── Sort helper ──────────────────────────────────────────────────────────────

function sortUsers(data: UserRow[], key: UserKey, direction: JTableSortDirection): UserRow[] {
  if (!direction) return data;
  return [...data].sort((a, b) => {
    const r = String(a[key]).localeCompare(String(b[key]));
    return direction === 'asc' ? r : -r;
  });
}

// ─── Stories ──────────────────────────────────────────────────────────────────

export const Default: Story = {
  args: { responsiveMode: 'scroll' },
  render: (args) => (
    <JTable
      responsiveMode={args.responsiveMode}
      columns={userColumns}
      data={users}
      caption="Lista de usuarios registrados"
    />
  ),
};

export const MobileCards: Story = {
  args: { responsiveMode: 'cards' },
  render: (args) => (
    <JPanel variant="ghost" padding="none" className="max-w-[360px]">
      <JTable
        responsiveMode={args.responsiveMode}
        columns={userColumns}
        data={users}
        caption="Vista mobile en modo cards"
      />
    </JPanel>
  ),
};

export const WideContent: Story = {
  args: { responsiveMode: 'scroll' },
  render: (args) => (
    <JPanel variant="ghost" padding="none" className="max-w-[360px]">
      <JTable
        responsiveMode={args.responsiveMode}
        columns={orderColumns}
        data={orders}
        caption="Ordenes — tabla con contenido ancho"
      />
    </JPanel>
  ),
};

export const GroupedHeaders: Story = {
  args: { responsiveMode: 'scroll' },
  render: (args) => (
    <JTable
      responsiveMode={args.responsiveMode}
      columns={groupedUserColumns}
      data={users}
      caption="Headers agrupados con columnas hijas independientes"
    />
  ),
};

export const GroupedHeadersMobileCards: Story = {
  render: () => (
    <JPanel variant="ghost" padding="none" className="max-w-[360px]">
      <JTable
        responsiveMode="cards"
        columns={[
          {
            label: 'Usuario',
            columns: [
              { key: 'name', header: 'Nombre', resizable: true, minWidth: 120 },
            ],
          },
          {
            label: 'Contacto',
            columns: [
              { key: 'email', header: 'Email',    filterable: true, resizable: true, filterPlaceholder: 'Filtrar email',    minWidth: 160 },
              { key: 'phone', header: 'Telefono', filterable: true, resizable: true, filterPlaceholder: 'Filtrar telefono', minWidth: 120 },
            ],
          },
        ] satisfies JTableColumnsConfig}
        data={users.slice(0, 2)}
        caption="Headers agrupados en modo cards"
      />
    </JPanel>
  ),
};

export const AutoFiltering: Story = {
  render: () => (
    <JTable
      responsiveMode="scroll"
      columns={userColumns}
      data={users}
      caption="Filtros automaticos por columna — sin estado externo"
    />
  ),
};

export const Interactive: Story = {
  render: () => {
    const [sort, setSort] = useState<{ key: string; direction: JTableSortDirection }>({ key: '', direction: null });
    const sorted = sort.direction ? sortUsers(users, sort.key as UserKey, sort.direction) : users;

    const handleSort = (key: string) => (direction: JTableSortDirection) => setSort({ key, direction });

    const columns: JTableColumnsConfig = userColumns.map((col) => ({
      ...col,
      ...(col.sortable
        ? {
            sortDirection: sort.key === col.key ? sort.direction : null,
            onSortChange: handleSort(col.key),
          }
        : {}),
    }));

    return (
      <JTable
        responsiveMode="cards"
        columns={columns}
        data={sorted}
        caption="Ordenamiento controlado externamente"
      />
    );
  },
};

export const JPagination: Story = {
  render: () => {
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(5);

    const totalRows = allUsers.length;
    const paginated = allUsers.slice((currentPage - 1) * pageSize, currentPage * pageSize);

    const pagination: JTablePaginationConfig = {
      currentPage,
      pageSize,
      totalRows,
      pageSizeOptions: [5, 10, 20],
      onPageChange: setCurrentPage,
      onPageSizeChange: (size) => { setPageSize(size); setCurrentPage(1); },
    };

    return (
      <JTable
        responsiveMode="scroll"
        columns={userColumns}
        data={paginated}
        caption={`Usuarios del sistema — ${totalRows} en total`}
        pagination={pagination}
      />
    );
  },
};

export const PaginationSortFilter: Story = {
  render: () => {
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(5);
    const [sort, setSort] = useState<{ key: string; direction: JTableSortDirection }>({ key: '', direction: null });
    const [filters, setFilters] = useState({ name: '', email: '', role: '', status: '' });

    const filtered = allUsers.filter((u) =>
      u.name.toLowerCase().includes(filters.name.toLowerCase()) &&
      u.email.toLowerCase().includes(filters.email.toLowerCase()) &&
      u.role.toLowerCase().includes(filters.role.toLowerCase()) &&
      u.status.toLowerCase().includes(filters.status.toLowerCase())
    );

    const sorted = sort.direction ? sortUsers(filtered, sort.key as UserKey, sort.direction) : filtered;
    const paginated = sorted.slice((currentPage - 1) * pageSize, currentPage * pageSize);

    const handleSort = (key: string) => (direction: JTableSortDirection) => {
      setSort({ key, direction });
      setCurrentPage(1);
    };

    const handleFilter = (key: keyof typeof filters) => (value: string) => {
      setFilters((p) => ({ ...p, [key]: value }));
      setCurrentPage(1);
    };

    const columns: JTableColumnsConfig = [
      {
        key: 'name', header: 'Nombre', sortable: true, filterable: true, resizable: true, minWidth: 140,
        filterPlaceholder: 'Filtrar nombre',
        sortDirection: sort.key === 'name' ? sort.direction : null, onSortChange: handleSort('name'),
        filterValue: filters.name, onFilterChange: handleFilter('name'),
      },
      {
        key: 'email', header: 'Email', filterable: true, resizable: true, minWidth: 180,
        filterPlaceholder: 'Filtrar email',
        filterValue: filters.email, onFilterChange: handleFilter('email'),
      },
      {
        key: 'role', header: 'Rol', sortable: true, filterable: true, resizable: true, minWidth: 120,
        filterPlaceholder: 'Filtrar rol',
        sortDirection: sort.key === 'role' ? sort.direction : null, onSortChange: handleSort('role'),
        filterValue: filters.role, onFilterChange: handleFilter('role'),
      },
      {
        key: 'status', header: 'Estado', sortable: true, filterable: true, resizable: true, minWidth: 100,
        filterPlaceholder: 'Filtrar estado',
        sortDirection: sort.key === 'status' ? sort.direction : null, onSortChange: handleSort('status'),
        filterValue: filters.status, onFilterChange: handleFilter('status'),
        render: statusRender,
      },
    ];

    const pagination: JTablePaginationConfig = {
      currentPage,
      pageSize,
      totalRows: filtered.length,
      pageSizeOptions: [5, 10, 20],
      onPageChange: setCurrentPage,
      onPageSizeChange: (size) => { setPageSize(size); setCurrentPage(1); },
    };

    return (
      <JTable
        responsiveMode="scroll"
        columns={columns}
        data={paginated}
        caption={`${filtered.length} de ${allUsers.length} usuarios`}
        emptyMessage="No hay usuarios que coincidan con los filtros"
        pagination={pagination}
      />
    );
  },
};

export const SortFilterResize: Story = {
  render: () => {
    const [sort, setSort] = useState<{ key: string; direction: JTableSortDirection }>({ key: '', direction: null });
    const [filters, setFilters] = useState({ name: '', email: '', role: '', status: '' });

    const filtered = users.filter((u) =>
      u.name.toLowerCase().includes(filters.name.toLowerCase()) &&
      u.email.toLowerCase().includes(filters.email.toLowerCase()) &&
      u.role.toLowerCase().includes(filters.role.toLowerCase()) &&
      u.status.toLowerCase().includes(filters.status.toLowerCase())
    );
    const sorted = sort.direction ? sortUsers(filtered, sort.key as UserKey, sort.direction) : filtered;

    const handleSort = (key: string) => (direction: JTableSortDirection) => setSort({ key, direction });
    const handleFilter = (key: keyof typeof filters) => (value: string) =>
      setFilters((c) => ({ ...c, [key]: value }));

    const columns: JTableColumnsConfig = [
      {
        key: 'name', header: 'Nombre', sortable: true, filterable: true, resizable: true, minWidth: 140,
        filterPlaceholder: 'Filtrar nombre',
        sortDirection: sort.key === 'name' ? sort.direction : null, onSortChange: handleSort('name'),
        filterValue: filters.name, onFilterChange: handleFilter('name'),
      },
      {
        key: 'email', header: 'Email', filterable: true, resizable: true, minWidth: 180,
        filterPlaceholder: 'Filtrar email',
        filterValue: filters.email, onFilterChange: handleFilter('email'),
      },
      {
        key: 'role', header: 'Rol', sortable: true, filterable: true, resizable: true, minWidth: 140,
        filterPlaceholder: 'Filtrar rol',
        sortDirection: sort.key === 'role' ? sort.direction : null, onSortChange: handleSort('role'),
        filterValue: filters.role, onFilterChange: handleFilter('role'),
      },
      {
        key: 'status', header: 'Estado', sortable: true, filterable: true, resizable: true, minWidth: 100,
        filterPlaceholder: 'Filtrar estado',
        sortDirection: sort.key === 'status' ? sort.direction : null, onSortChange: handleSort('status'),
        filterValue: filters.status, onFilterChange: handleFilter('status'),
        render: statusRender,
      },
    ];

    return (
      <JTable
        responsiveMode="scroll"
        columns={columns}
        data={sorted}
        caption="Columnas con ordenamiento, filtros y resizing"
        emptyMessage="Sin resultados"
      />
    );
  },
};
