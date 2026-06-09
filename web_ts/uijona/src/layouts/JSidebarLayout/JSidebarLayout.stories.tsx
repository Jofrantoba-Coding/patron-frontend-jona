import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { useState } from 'react';
import { JSidebarLayout, JSIDEBAR_LAYOUT_DEFAULTS } from './JSidebarLayout';
import { JPanel } from '../../atoms/JPanel/JPanel';
import { JLabel } from '../../atoms/JLabel';

const HomeIcon = () => (
  <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 12L12 3l9 9M4 10v10a1 1 0 001 1h4v-6h6v6h4a1 1 0 001-1V10" />
  </svg>
);
const UsersIcon = () => (
  <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round" d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2M9 7a4 4 0 100 8 4 4 0 000-8zM23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" />
  </svg>
);
const SettingsIcon = () => (
  <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} aria-hidden="true">
    <circle cx="12" cy="12" r="3"/><path strokeLinecap="round" strokeLinejoin="round" d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z" />
  </svg>
);

const NAV = [
  {
    items: [
      { key: 'home', label: 'Inicio', icon: <HomeIcon /> },
    ],
  },
  {
    label: 'Gestión',
    items: [
      { key: 'users', label: 'Usuarios', icon: <UsersIcon />, badge: 3 },
    ],
  },
  {
    label: 'Sistema',
    items: [
      { key: 'settings', label: 'Configuración', icon: <SettingsIcon /> },
    ],
  },
];

const meta: Meta<typeof JSidebarLayout> = {
  title: 'Layouts/JSidebarLayout',
  component: JSidebarLayout,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'JSidebarLayout es el layout de aplicación con sidebar de JONA. Implementa el patrón de shell de aplicación: sidebar de navegación fijo a la izquierda y área de contenido principal a la derecha. En mobile, el sidebar se superpone como overlay con transición CSS. Soporta colapso del sidebar (icono-only), header y footer personalizables, y grupos de navegación con íconos, badges y estado activo.',
      },
    },
  },
  args: {
    nav: NAV,
    activeKey: 'home',
    onNavItemClick: fn(),
    children: (
      <JPanel layout="box" gap="sm" className="p-6">
        <JLabel as="h1" size="xl" className="font-semibold text-neutral-800">Contenido principal</JLabel>
        <JLabel size="sm" color="muted">Área de trabajo de la aplicación.</JLabel>
      </JPanel>
    ),
  },
  argTypes: {
    nav: {
      description: 'Array de grupos de navegación `{ label?, items[] }`. Cada ítem tiene `key`, `label`, y opcionalmente `icon`, `badge`, `href`, `onClick`. Todos los ítems del mismo sidebar deben tener `key` único.',
      table: { type: { summary: 'SidebarNavGroup[]' } },
    },
    activeKey: {
      description: 'Clave del ítem de navegación activo. Controla el estado visual de selección. Actualizar en `onNavItemClick`.',
      control: 'text',
      table: { type: { summary: 'string' } },
    },
    collapsible: {
      description: 'Permite colapsar el sidebar a modo icono-only. `true` (default) muestra el botón de colapso; `false` mantiene el sidebar siempre expandido.',
      control: 'boolean',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: String(JSIDEBAR_LAYOUT_DEFAULTS.collapsible) },
      },
    },
    defaultCollapsed: {
      description: 'Estado inicial del sidebar. `false` (default) comienza expandido. `true` comienza colapsado a modo icono.',
      control: 'boolean',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: String(JSIDEBAR_LAYOUT_DEFAULTS.defaultCollapsed) },
      },
    },
    sidebarWidth: {
      description: 'Ancho del sidebar expandido. Acepta cualquier valor CSS válido: `"16rem"` (default), `"240px"`, `"20%"`. En modo colapsado se reduce automáticamente.',
      control: 'text',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: JSIDEBAR_LAYOUT_DEFAULTS.sidebarWidth },
      },
    },
    header: {
      description: 'Contenido de la cabecera del sidebar. Típicamente logo + nombre de la aplicación. Se oculta o adapta cuando el sidebar colapsa.',
      table: { type: { summary: 'ReactNode' } },
    },
    footer: {
      description: 'Contenido del pie del sidebar. Típicamente datos del usuario, versión o acceso rápido a configuración.',
      table: { type: { summary: 'ReactNode' } },
    },
    children: {
      description: 'Contenido del área principal de la aplicación. Ocupa todo el espacio a la derecha del sidebar.',
      table: { type: { summary: 'ReactNode' } },
    },
    onNavItemClick: {
      description: 'Callback al hacer clic en un ítem de navegación. Recibe el ítem completo `{ key, label, icon?, badge?, href? }`. Usar para actualizar `activeKey` y navegar.',
      table: { type: { summary: '(item: SidebarNavItem) => void' } },
    },
  },
};
export default meta;
type Story = StoryObj<typeof JSidebarLayout>;

export const Default: Story = {
  parameters: {
    docs: {
      description: { story: 'JSidebarLayout con navegación de ejemplo. Playground interactivo: colapsa el sidebar con el botón de flecha, prueba el badge en "Usuarios".' },
    },
  },
};

export const WithHeader: Story = {
  parameters: {
    docs: {
      description: { story: 'Con `header` personalizado: logo + nombre de la app. El header se muestra en la parte superior del sidebar, antes de la navegación.' },
    },
  },
  args: {
    header: (
      <JPanel layout="flow" gap="sm" alignItems="center" className="px-4 py-3">
        <JPanel layout="box" alignItems="center" justifyContent="center" className="h-7 w-7 rounded-md bg-primary-600 text-xs font-bold text-white">J</JPanel>
        <JLabel as="span" size="sm" className="font-semibold text-neutral-800">JONA App</JLabel>
      </JPanel>
    ),
  },
};

export const DefaultCollapsed: Story = {
  parameters: {
    docs: {
      description: { story: '`defaultCollapsed=true` inicia con el sidebar en modo icono-only. El usuario puede expandirlo desde el botón de flecha.' },
    },
  },
  args: { defaultCollapsed: true },
};

export const NotCollapsible: Story = {
  parameters: {
    docs: {
      description: { story: '`collapsible=false` oculta el botón de colapso. El sidebar permanece siempre expandido al ancho de `sidebarWidth`.' },
    },
  },
  args: { collapsible: false },
};

export const Interactive: Story = {
  parameters: {
    docs: {
      description: { story: 'Ejemplo de integración completa: `activeKey` controlado por el padre, `onNavItemClick` actualiza la sección visible y el estado de navegación.' },
    },
  },
  args: {
    onNavItemClick: fn(),
  },
  render: (args) => {
    const [activeKey, setActiveKey] = useState('home');
    return (
      <JSidebarLayout
        nav={NAV}
        activeKey={activeKey}
        onNavItemClick={(item) => { args.onNavItemClick?.(item); setActiveKey(item.key); }}
        header={
          <JPanel layout="flow" gap="sm" alignItems="center" className="px-4 py-3">
            <JPanel layout="box" alignItems="center" justifyContent="center" className="h-7 w-7 rounded-md bg-primary-600 text-xs font-bold text-white">J</JPanel>
            <JLabel as="span" size="sm" className="font-semibold text-neutral-800">JONA App</JLabel>
          </JPanel>
        }
      >
        <JPanel layout="box" gap="sm" className="p-6">
          <JLabel as="h1" size="xl" className="font-semibold text-neutral-800">Sección: {activeKey}</JLabel>
          <JLabel size="sm" color="muted">Haz clic en un ítem de la barra lateral para navegar.</JLabel>
        </JPanel>
      </JSidebarLayout>
    );
  },
};
