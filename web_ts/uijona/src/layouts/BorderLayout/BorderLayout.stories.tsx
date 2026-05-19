import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { JBorderLayout } from './BorderLayout';
import { JButton } from '../../atoms/JButton/JButton';
import { JPanel } from '../../atoms/JPanel/JPanel';
import { JLabel } from '../../atoms/JLabel';

const meta: Meta<typeof JBorderLayout> = {
  title: 'Layouts/JBorderLayout',
  component: JBorderLayout,
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen' },
};
export default meta;
type Story = StoryObj<typeof JBorderLayout>;

const Slot = ({ label, color }: { label: string; color: string }) => (
  <div style={{ background: color, padding: '10px 16px', color: '#fff', fontWeight: 600, fontSize: 13 }}>
    {label}
  </div>
);

export const AllZones: Story = {
  name: 'Todas las zonas',
  render: () => (
    <JBorderLayout
      className="h-96"
      north={<Slot label="North · header" color="#2563eb" />}
      west={<Slot label="West · sidebar" color="#6b7280" />}
      center={<Slot label="Center · main" color="#10b981" />}
      east={<Slot label="East · panel" color="#6b7280" />}
      south={<Slot label="South · footer" color="#374151" />}
    />
  ),
};

export const SinSidebars: Story = {
  name: 'Sin sidebars',
  render: () => (
    <JBorderLayout
      className="h-64"
      north={<Slot label="Header" color="#2563eb" />}
      center={<Slot label="Contenido principal" color="#10b981" />}
      south={<Slot label="Footer" color="#374151" />}
    />
  ),
};

export const SoloCenter: Story = {
  name: 'Solo center',
  render: () => (
    <JBorderLayout
      className="h-48"
      center={<Slot label="Centro" color="#8b5cf6" />}
    />
  ),
};

export const ConSidebarIzquierdo: Story = {
  name: 'Con sidebar izquierdo',
  render: () => (
    <JBorderLayout
      className="h-80"
      north={<Slot label="Header" color="#2563eb" />}
      west={
        <JPanel variant="ghost" padding="none" className="w-48 flex flex-col gap-1 p-2">
          {['Dashboard', 'Usuarios', 'Reportes'].map((p) => (
            <JButton key={p} variant="ghost" size="sm" fullWidth className="justify-start">{p}</JButton>
          ))}
        </JPanel>
      }
      center={<Slot label="Contenido" color="#10b981" />}
      south={<Slot label="Footer" color="#374151" />}
    />
  ),
};

export const Interactive: Story = {
  render: () => {
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [activePage, setActivePage] = useState('Dashboard');
    const pages = ['Dashboard', 'Usuarios', 'Reportes', 'Configuración'];
    return (
      <JBorderLayout
        className="h-screen"
        north={
          <JPanel variant="ghost" padding="none" className="flex items-center justify-between px-4 py-2 bg-primary-700">
            <JLabel className="font-bold text-white">JONA UI</JLabel>
            <JButton size="sm" variant="ghost" className="text-white hover:bg-white/10" onClick={() => setSidebarOpen((s) => !s)}>
              {sidebarOpen ? 'Colapsar' : 'Expandir'}
            </JButton>
          </JPanel>
        }
        west={sidebarOpen ? (
          <JPanel variant="ghost" padding="none" className="w-48 flex flex-col gap-1 p-2 border-r border-neutral-200 h-full">
            <JLabel size="xs" color="muted" className="uppercase font-semibold px-2 py-1">Menú</JLabel>
            {pages.map((page) => (
              <JButton
                key={page}
                size="sm"
                variant={activePage === page ? 'secondary' : 'ghost'}
                fullWidth
                className="justify-start"
                onClick={() => setActivePage(page)}
              >
                {page}
              </JButton>
            ))}
          </JPanel>
        ) : undefined}
        center={
          <JPanel variant="ghost" padding="md">
            <JLabel className="font-semibold text-neutral-800 block mb-1">{activePage}</JLabel>
            <JLabel size="sm" color="muted">
              Contenido de <strong>{activePage}</strong>. Sidebar {sidebarOpen ? 'visible' : 'colapsado'}.
            </JLabel>
          </JPanel>
        }
        south={
          <JPanel variant="ghost" padding="none" className="px-4 py-2 text-xs text-neutral-400 border-t border-neutral-200">
            © 2026 JONA Pattern
          </JPanel>
        }
      />
    );
  },
};
