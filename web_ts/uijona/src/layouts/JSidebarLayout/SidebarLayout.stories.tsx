import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { useState } from 'react';
import { JSidebarLayout } from './SidebarLayout';
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
  parameters: { layout: 'fullscreen' },
  args: {
    nav: NAV,
    activeKey: 'home',
    onNavItemClick: fn(),
    children: (
      <JPanel variant="ghost" padding="none" className="p-6">
        <JLabel as="h1" size="xl" className="font-semibold text-neutral-800">Contenido principal</JLabel>
        <JLabel size="sm" color="muted" className="mt-2">Área de trabajo de la aplicación.</JLabel>
      </JPanel>
    ),
  },
};
export default meta;
type Story = StoryObj<typeof JSidebarLayout>;

export const Default: Story = {};

export const WithHeader: Story = {
  args: {
    header: (
      <JPanel variant="ghost" padding="none" className="flex items-center gap-2 px-4 py-3">
        <JPanel variant="ghost" padding="none" className="flex h-7 w-7 items-center justify-center rounded-md bg-primary-600 text-xs font-bold text-white">J</JPanel>
        <JLabel as="span" size="sm" className="font-semibold text-neutral-800">JONA App</JLabel>
      </JPanel>
    ),
  },
};

export const DefaultCollapsed: Story = {
  args: { defaultCollapsed: true },
};

export const NotCollapsible: Story = {
  args: { collapsible: false },
};

export const Interactive: Story = {
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
          <JPanel variant="ghost" padding="none" className="flex items-center gap-2 px-4 py-3">
            <JPanel variant="ghost" padding="none" className="flex h-7 w-7 items-center justify-center rounded-md bg-primary-600 text-xs font-bold text-white">J</JPanel>
            <JLabel as="span" size="sm" className="font-semibold text-neutral-800">JONA App</JLabel>
          </JPanel>
        }
      >
        <JPanel variant="ghost" padding="none" className="p-6">
          <JLabel as="h1" size="xl" className="font-semibold text-neutral-800">Sección: {activeKey}</JLabel>
          <JLabel size="sm" color="muted" className="mt-2">Haz clic en un ítem de la barra lateral para navegar.</JLabel>
        </JPanel>
      </JSidebarLayout>
    );
  },
};
