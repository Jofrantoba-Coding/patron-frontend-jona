import type { Meta, StoryObj } from '@storybook/react';
import { fn, userEvent, within } from '@storybook/test';
import { useState } from 'react';
import { JAppShell, JAPPSHELL_DEFAULTS } from './JAppShell';
import { JTreeNav, JTreeNavNode } from '../../molecules/JTreeNav';
import { JPageHeader } from '../../molecules/JPageHeader';

const MENU: JTreeNavNode[] = [
  {
    id: 'maestros',
    label: 'Maestros',
    children: [
      { id: 'cliente', label: 'Cliente' },
      { id: 'color', label: 'Color' },
      { id: 'marca', label: 'Marca' },
    ],
  },
  {
    id: 'ventas',
    label: 'Ventas',
    children: [{ id: 'registro', label: 'Registro de Ventas', disabled: true, badge: 'Próximamente' }],
  },
];

function Shell({ defaultCollapsed }: { defaultCollapsed?: boolean }) {
  const [expandedIds, setExpandedIds] = useState(['maestros']);
  const [activeId, setActiveId] = useState('cliente');
  return (
    <JAppShell
      brand="SoftCommerce"
      topbarEnd={<span>Administrador</span>}
      navLabel="Menú principal"
      defaultCollapsed={defaultCollapsed}
      onCollapsedChange={fn()}
      sidebar={(api) =>
        api.collapsed ? null : (
          <JTreeNav
            ariaLabel="Opciones"
            nodes={MENU}
            expandedIds={expandedIds}
            activeId={activeId}
            onToggle={(id, expanded) =>
              setExpandedIds((ids) => (expanded ? [...ids, id] : ids.filter((other) => other !== id)))
            }
            onSelect={(id) => {
              setActiveId(id);
              api.close();
            }}
          />
        )
      }
    >
      <div className="p-4">
        <JPageHeader title="Cliente" count={134} />
      </div>
    </JAppShell>
  );
}

const meta: Meta<typeof JAppShell> = {
  title: 'Layouts/JAppShell',
  component: JAppShell,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'JAppShell es el marco de la aplicación: una barra superior de 48 px (`banner`) con la marca y un hueco final, una barra lateral `navigation` y el `main`. Desde `lg` la barra lateral está en línea y se contrae a un riel; por debajo es un cajón modal que abre `Abrir menú` y que cierran `Cerrar menú`, Esc (en su propia raíz) o el host con `api.close()`.',
      },
    },
  },
  argTypes: {
    sidebarWidth: { control: 'text', table: { defaultValue: { summary: JAPPSHELL_DEFAULTS.sidebarWidth } } },
    railWidth: { control: 'text', table: { defaultValue: { summary: JAPPSHELL_DEFAULTS.railWidth } } },
  },
};
export default meta;
type Story = StoryObj<typeof JAppShell>;

export const Default: Story = {
  render: () => <Shell />,
};

export const Rail: Story = {
  parameters: { docs: { description: { story: '`defaultCollapsed`: desde `lg` la barra lateral empieza como riel.' } } },
  render: () => <Shell defaultCollapsed />,
};

export const DrawerOpen: Story = {
  parameters: {
    viewport: { defaultViewport: 'mobile1' },
    docs: { description: { story: 'Por debajo de `lg`, `Abrir menú` abre el cajón con el foco dentro.' } },
  },
  render: () => <Shell />,
  play: async ({ canvasElement }) => {
    const open = within(canvasElement).queryByRole('button', { name: 'Abrir menú' });
    if (open && open.offsetParent !== null) await userEvent.click(open);
  },
};
