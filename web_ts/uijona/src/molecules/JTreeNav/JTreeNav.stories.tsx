import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { useState } from 'react';
import { JTreeNav, InterJTreeNav, JTreeNavNode } from './JTreeNav';

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

type Args = Partial<InterJTreeNav>;

/** A host that owns the expansion and the active node, as the contract asks. */
function Host({ nodes = MENU, initialExpanded = ['recientes', 'maestros'], ...args }: Args & { initialExpanded?: string[] }) {
  const [expandedIds, setExpandedIds] = useState(initialExpanded);
  const [activeId, setActiveId] = useState<string | null>('cliente');
  return (
    <div style={{ width: '16.5rem' }}>
      <JTreeNav
        ariaLabel="Menú principal"
        nodes={nodes}
        expandedIds={expandedIds}
        activeId={activeId}
        {...args}
        onToggle={(id, expanded) => {
          args.onToggle?.(id, expanded);
          setExpandedIds((ids) => (expanded ? [...ids, id] : ids.filter((other) => other !== id)));
        }}
        onSelect={(id) => {
          args.onSelect?.(id);
          setActiveId(id);
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
  args: { onToggle: fn(), onSelect: fn() },
};
export default meta;
type Story = StoryObj<typeof JTreeNav>;

export const Default: Story = {
  parameters: {
    docs: { description: { story: 'Menú con `Recientes` arriba, un nodo activo (`aria-current="page"`) y una hoja `Próximamente`.' } },
  },
  render: (args) => <Host {...args} initialExpanded={['recientes', 'maestros', 'generales', 'ventas']} />,
};
