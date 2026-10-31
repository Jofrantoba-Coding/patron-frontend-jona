import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { useState } from 'react';
import { JTreeNav, JTREENAV_DEFAULTS, InterJTreeNav, JTreeNavNode } from './JTreeNav';

const GENERALES = [
  'Cliente', 'Clínica', 'Color', 'Marca', 'Moneda', 'Localidad', 'Proveedor', 'Transportista', 'Unidad de Medida',
  'Tipo de Cliente', 'Zona', 'Vendedor',
];

const MENU: JTreeNavNode[] = [
  {
    id: 'recientes',
    label: 'Recientes',
    children: [
      { id: 'r-cliente', label: 'Cliente' },
      { id: 'r-color', label: 'Color' },
    ],
  },
  {
    id: 'maestros',
    label: 'Maestros',
    children: [
      {
        id: 'generales',
        label: 'Generales',
        children: [
          ...GENERALES.map((label) => ({ id: label.toLowerCase(), label })),
          ...Array.from({ length: 49 - GENERALES.length }, (_, index) => ({ id: `op-${index}`, label: `Opción ${index + 1}` })),
        ],
      },
    ],
  },
  {
    id: 'ventas',
    label: 'Ventas',
    children: [
      { id: 'registro', label: 'Registro de Ventas', disabled: true, badge: 'Próximamente' },
      { id: 'cotizacion', label: 'Cotización' },
    ],
  },
];

const PERMISOS: JTreeNavNode[] = [
  {
    id: 'maestros',
    label: 'Maestros',
    children: GENERALES.map((label) => ({ id: label.toLowerCase(), label })),
  },
  {
    id: 'seguridad',
    label: 'Seguridad',
    children: [
      { id: 'perfil', label: 'Perfil' },
      { id: 'usuario', label: 'Usuario' },
    ],
  },
];

type Args = Partial<InterJTreeNav>;

/** A host that owns the expansion, the active node and the checks, as the contract asks. */
function Host({ nodes = MENU, initialExpanded = ['recientes', 'maestros'], ...args }: Args & { initialExpanded?: string[] }) {
  const [expandedIds, setExpandedIds] = useState(initialExpanded);
  const [activeId, setActiveId] = useState<string | null>('cliente');
  const [checkedIds, setCheckedIds] = useState<string[]>(['maestros', 'cliente', 'color']);
  return (
    <div style={{ width: '16.5rem' }}>
      <JTreeNav
        ariaLabel="Menú principal"
        nodes={nodes}
        expandedIds={expandedIds}
        activeId={activeId}
        checkedIds={checkedIds}
        {...args}
        onToggle={(id, expanded) => {
          args.onToggle?.(id, expanded);
          setExpandedIds((ids) => (expanded ? [...ids, id] : ids.filter((other) => other !== id)));
        }}
        onSelect={(id) => {
          args.onSelect?.(id);
          setActiveId(id);
        }}
        onCheckedChange={(id, checked) => {
          args.onCheckedChange?.(id, checked);
          setCheckedIds((ids) => (checked ? [...ids, id] : ids.filter((other) => other !== id)));
        }}
      />
    </div>
  );
}

const meta: Meta<typeof JTreeNav> = {
  title: 'Molecules/JTreeNav',
  component: JTreeNav,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'JTreeNav es un árbol ARIA (`role="tree"`) con una sola parada de tabulación: ↑ ↓ Home End recorren los nodos visibles, → abre una rama o entra en ella, ← la cierra o sube al padre, Enter y Espacio activan, y una letra salta al siguiente nodo que empieza por ella. La expansión es controlada (`expandedIds`, `onToggle`). Un nodo `disabled` sigue enfocable y reporta `onSelect`; su `badge` es la descripción accesible. `filterTree` filtra hojas sin distinguir mayúsculas ni tildes.',
      },
    },
  },
  args: { onToggle: fn(), onSelect: fn(), onCheckedChange: fn(), onFilterChange: fn() },
  argTypes: {
    variant: { control: 'radio', options: ['nav', 'checkbox'], table: { defaultValue: { summary: JTREENAV_DEFAULTS.variant } } },
    filterLabel: { control: 'text', table: { defaultValue: { summary: JTREENAV_DEFAULTS.filterLabel } } },
    noResultsLabel: { control: 'text', table: { defaultValue: { summary: JTREENAV_DEFAULTS.noResultsLabel } } },
  },
};
export default meta;
type Story = StoryObj<typeof JTreeNav>;

export const Default: Story = {
  parameters: {
    docs: { description: { story: 'Menú con `Recientes` arriba, un nodo activo (`aria-current="page"`) y una hoja `Próximamente`.' } },
  },
  render: (args) => <Host {...args} initialExpanded={['recientes', 'maestros', 'generales', 'ventas']} />,
};

export const WithFilter: Story = {
  parameters: {
    docs: { description: { story: 'Caja de filtro (`showFilter`) sobre 49 hojas en `Generales`. Pruebe `cli`: muestra `Cliente`, `Clínica` y `Tipo de Cliente` con sus ancestros abiertos; al limpiar, vuelve la expansión previa. `maxHeight` limita el área con scroll.' } },
  },
  render: (args) => <Host {...args} showFilter filterLabel="Buscar opción" maxHeight="24rem" />,
};

export const Filtered: Story = {
  parameters: { docs: { description: { story: 'Filtro controlado `cli`: solo las hojas que lo contienen, con sus ancestros abiertos.' } } },
  render: (args) => <Host {...args} showFilter filter="cli" />,
};

export const NoResults: Story = {
  parameters: { docs: { description: { story: 'Un filtro sin coincidencias muestra `Sin resultados`.' } } },
  render: (args) => <Host {...args} showFilter filter="zzz" />,
};

export const Checkbox: Story = {
  parameters: {
    docs: { description: { story: '`variant="checkbox"`: Espacio o un clic en la casilla marcan solo ese nodo (sin propagación); un clic en el texto o las flechas lo seleccionan.' } },
  },
  render: (args) => <Host {...args} nodes={PERMISOS} variant="checkbox" initialExpanded={['maestros']} maxHeight="16rem" />,
};
