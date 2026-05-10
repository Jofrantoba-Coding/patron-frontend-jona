import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { BorderLayout } from './BorderLayout';

const meta: Meta<typeof BorderLayout> = {
  title: 'Layouts/BorderLayout',
  component: BorderLayout,
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen' },
};
export default meta;
type Story = StoryObj<typeof BorderLayout>;

const Box = ({ label, color }: { label: string; color: string }) => (
  <div style={{ background: color, padding: '12px 16px', color: '#fff', fontWeight: 'bold', fontSize: '14px' }}>
    {label}
  </div>
);

export const AllZones: Story = {
  render: () => (
    <div style={{ height: '400px' }}>
      <BorderLayout
        north={<Box label="North (Header)" color="#2563eb" />}
        south={<Box label="South (Footer)" color="#374151" />}
        west={<Box label="West (Sidebar)" color="#6b7280" />}
        east={<Box label="East (Panel)" color="#6b7280" />}
        center={<Box label="Center (Content)" color="#10b981" />}
      />
    </div>
  ),
};

export const WithoutSidebars: Story = {
  render: () => (
    <div style={{ height: '400px' }}>
      <BorderLayout
        north={<Box label="Header" color="#2563eb" />}
        south={<Box label="Footer" color="#374151" />}
        center={<Box label="Contenido principal" color="#10b981" />}
      />
    </div>
  ),
};

export const CenterOnly: Story = {
  render: () => (
    <div style={{ height: '300px' }}>
      <BorderLayout
        center={<Box label="Solo contenido central" color="#8b5cf6" />}
      />
    </div>
  ),
};

export const WithWestSidebar: Story = {
  render: () => (
    <div style={{ height: '400px' }}>
      <BorderLayout
        north={<Box label="Header" color="#2563eb" />}
        west={<Box label="Menú lateral" color="#6b7280" />}
        center={<Box label="Contenido" color="#10b981" />}
        south={<Box label="Footer" color="#374151" />}
      />
    </div>
  ),
};

export const Interactive: Story = {
  render: () => {
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [activePage, setActivePage] = useState('Dashboard');
    const pages = ['Dashboard', 'Usuarios', 'Reportes', 'Configuración'];
    return (
      <div style={{ height: '420px' }}>
        <BorderLayout
          north={
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 16px', background: '#1e40af', color: '#fff' }}>
              <span style={{ fontWeight: 700, fontSize: '15px' }}>JONA UI</span>
              <button
                onClick={() => setSidebarOpen((s) => !s)}
                style={{ background: 'none', border: '1px solid rgba(255,255,255,0.4)', borderRadius: '4px', color: '#fff', padding: '3px 10px', fontSize: '12px', cursor: 'pointer' }}
              >
                {sidebarOpen ? 'Colapsar' : 'Expandir'}
              </button>
            </div>
          }
          west={sidebarOpen ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', padding: '12px 8px', background: '#f5f5f5', borderRight: '1px solid #e5e5e5', height: '100%' }}>
              <p style={{ fontSize: '10px', fontWeight: 600, color: '#a3a3a3', textTransform: 'uppercase', padding: '4px 8px', marginBottom: '4px' }}>Menú</p>
              {pages.map((page) => (
                <button
                  key={page}
                  onClick={() => setActivePage(page)}
                  style={{ textAlign: 'left', padding: '7px 12px', borderRadius: '6px', fontSize: '13px', border: 'none', cursor: 'pointer', background: activePage === page ? '#dbeafe' : 'transparent', color: activePage === page ? '#1d4ed8' : '#404040', fontWeight: activePage === page ? 600 : 400 }}
                >
                  {page}
                </button>
              ))}
            </div>
          ) : undefined}
          center={
            <div style={{ padding: '20px', fontSize: '14px', color: '#525252' }}>
              <p style={{ fontWeight: 600, marginBottom: '8px', color: '#171717' }}>{activePage}</p>
              <p>Contenido de la sección <strong>{activePage}</strong>. El sidebar está {sidebarOpen ? 'visible' : 'colapsado'}.</p>
            </div>
          }
          south={
            <div style={{ padding: '8px 16px', fontSize: '12px', color: '#a3a3a3', background: '#fafafa', borderTop: '1px solid #e5e5e5' }}>
              © 2026 JONA Pattern
            </div>
          }
        />
      </div>
    );
  },
};
