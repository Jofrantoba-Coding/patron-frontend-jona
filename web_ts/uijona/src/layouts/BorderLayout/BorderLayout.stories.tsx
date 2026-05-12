import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { BorderLayout } from './BorderLayout';
import { ButtonAtom } from '../../atoms/ButtonAtom/ButtonAtom';
import { PanelAtom } from '../../atoms/PanelAtom/PanelAtom';
import { TextAtom } from '../../atoms/TextAtom/TextAtom';

const meta: Meta<typeof BorderLayout> = {
  title: 'Layouts/BorderLayout',
  component: BorderLayout,
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen' },
};
export default meta;
type Story = StoryObj<typeof BorderLayout>;

const Box = ({ label, color }: { label: string; color: string }) => (
  <PanelAtom variant="ghost" padding="none" style={{ background: color, padding: '12px 16px', color: '#fff', fontWeight: 'bold', fontSize: '14px' }}>
    {label}
  </PanelAtom>
);

export const AllZones: Story = {
  render: () => (
    <PanelAtom variant="ghost" padding="none" style={{ height: '400px' }}>
      <BorderLayout
        north={<Box label="North (Header)" color="#2563eb" />}
        south={<Box label="South (Footer)" color="#374151" />}
        west={<Box label="West (Sidebar)" color="#6b7280" />}
        east={<Box label="East (Panel)" color="#6b7280" />}
        center={<Box label="Center (Content)" color="#10b981" />}
      />
    </PanelAtom>
  ),
};

export const WithoutSidebars: Story = {
  render: () => (
    <PanelAtom variant="ghost" padding="none" style={{ height: '400px' }}>
      <BorderLayout
        north={<Box label="Header" color="#2563eb" />}
        south={<Box label="Footer" color="#374151" />}
        center={<Box label="Contenido principal" color="#10b981" />}
      />
    </PanelAtom>
  ),
};

export const CenterOnly: Story = {
  render: () => (
    <PanelAtom variant="ghost" padding="none" style={{ height: '300px' }}>
      <BorderLayout
        center={<Box label="Solo contenido central" color="#8b5cf6" />}
      />
    </PanelAtom>
  ),
};

export const WithWestSidebar: Story = {
  render: () => (
    <PanelAtom variant="ghost" padding="none" style={{ height: '400px' }}>
      <BorderLayout
        north={<Box label="Header" color="#2563eb" />}
        west={<Box label="Menú lateral" color="#6b7280" />}
        center={<Box label="Contenido" color="#10b981" />}
        south={<Box label="Footer" color="#374151" />}
      />
    </PanelAtom>
  ),
};

export const Interactive: Story = {
  render: () => {
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [activePage, setActivePage] = useState('Dashboard');
    const pages = ['Dashboard', 'Usuarios', 'Reportes', 'Configuración'];
    return (
      <PanelAtom variant="ghost" padding="none" style={{ height: '420px' }}>
        <BorderLayout
          north={
            <PanelAtom variant="ghost" padding="none" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 16px', background: '#1e40af', color: '#fff' }}>
              <TextAtom as="span" className="font-bold text-neutral-950">JONA UI</TextAtom>
              <ButtonAtom variant="outline" size="sm" onClick={() => setSidebarOpen((s) => !s)} className="border-white/40 text-white hover:bg-white/10 hover:text-white">
                {sidebarOpen ? 'Colapsar' : 'Expandir'}
              </ButtonAtom>
            </PanelAtom>
          }
          west={sidebarOpen ? (
            <PanelAtom variant="ghost" padding="none" style={{ display: 'flex', flexDirection: 'column', gap: '2px', padding: '12px 8px', background: '#f5f5f5', borderRight: '1px solid #e5e5e5', height: '100%' }}>
              <TextAtom as="p" className="text-[10px] font-semibold text-neutral-400 uppercase px-2 mb-1">Menú</TextAtom>
              {pages.map((page) => (
                <ButtonAtom
                  key={page}
                  variant={activePage === page ? 'secondary' : 'ghost'}
                  size="sm"
                  onClick={() => setActivePage(page)}
                  fullWidth
                  className="justify-start"
                >
                  {page}
                </ButtonAtom>
              ))}
            </PanelAtom>
          ) : undefined}
          center={
            <PanelAtom variant="ghost" padding="none" className="p-5">
              <TextAtom className="font-semibold mb-2 text-neutral-950">{activePage}</TextAtom>
              <TextAtom size="sm" className="text-neutral-600">Contenido de la sección <strong>{activePage}</strong>. El sidebar está {sidebarOpen ? 'visible' : 'colapsado'}.</TextAtom>
            </PanelAtom>
          }
          south={
            <PanelAtom variant="ghost" padding="none" style={{ padding: '8px 16px', fontSize: '12px', color: '#a3a3a3', background: '#fafafa', borderTop: '1px solid #e5e5e5' }}>
              © 2026 JONA Pattern
            </PanelAtom>
          }
        />
      </PanelAtom>
    );
  },
};
