import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { JBorderLayout, BORDER_LAYOUT_DEFAULTS } from './BorderLayout';
import { JButton } from '../../atoms/JButton/JButton';
import { JPanel } from '../../atoms/JPanel/JPanel';
import { JLabel } from '../../atoms/JLabel';

const meta: Meta<typeof JBorderLayout> = {
  title: 'Layouts/JBorderLayout',
  component: JBorderLayout,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'JBorderLayout es el layout de 5 zonas de JONA. Divide el espacio en `north` (header), `south` (footer), `west` (sidebar izquierdo), `east` (panel derecho) y `center` (contenido principal). Todas las zonas son opcionales: si se omite una, el `center` expande para ocupar ese espacio. Es el layout estándar para pantallas de aplicación con header fijo y sidebar de navegación.',
      },
    },
  },
  argTypes: {
    north: {
      description: 'Zona superior. Típicamente el header de la aplicación: logo, barra de búsqueda, menú de usuario.',
      table: { type: { summary: 'ReactNode' } },
    },
    south: {
      description: 'Zona inferior. Típicamente el footer con copyright, links secundarios o información de estado.',
      table: { type: { summary: 'ReactNode' } },
    },
    west: {
      description: 'Zona izquierda. Típicamente la navegación principal o un sidebar de filtros.',
      table: { type: { summary: 'ReactNode' } },
    },
    east: {
      description: 'Zona derecha. Típicamente un panel de detalles, inspector o bandeja de notificaciones.',
      table: { type: { summary: 'ReactNode' } },
    },
    center: {
      description: 'Zona central principal. Siempre ocupa el espacio restante después de norte, sur, este y oeste.',
      table: { type: { summary: 'ReactNode' } },
    },
    northClassName: {
      description: 'Clases extra para el contenedor de la zona `north`. El layout ya aplica la estructura base.',
      control: 'text',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: BORDER_LAYOUT_DEFAULTS.northClassName },
      },
    },
    southClassName: {
      description: 'Clases extra para el contenedor de la zona `south`.',
      control: 'text',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: BORDER_LAYOUT_DEFAULTS.southClassName },
      },
    },
    westClassName: {
      description: 'Clases extra para el contenedor de la zona `west`.',
      control: 'text',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: BORDER_LAYOUT_DEFAULTS.westClassName },
      },
    },
    eastClassName: {
      description: 'Clases extra para el contenedor de la zona `east`.',
      control: 'text',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: BORDER_LAYOUT_DEFAULTS.eastClassName },
      },
    },
    centerClassName: {
      description: 'Clases extra para el contenedor de la zona `center`.',
      control: 'text',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: BORDER_LAYOUT_DEFAULTS.centerClassName },
      },
    },
  },
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
  parameters: {
    docs: {
      description: { story: 'Las 5 zonas coloreadas para distinguir su posición. El `center` (verde) ocupa todo el espacio restante después de norte, sur, este y oeste.' },
    },
  },
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
  parameters: {
    docs: {
      description: { story: 'Sin `west` ni `east`, el `center` ocupa todo el ancho. Patrón para páginas de artículo o formularios sin navegación lateral.' },
    },
  },
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
  parameters: {
    docs: {
      description: { story: 'Solo el `center`. Todas las zonas son opcionales; el `center` siempre cubre el espacio disponible.' },
    },
  },
  render: () => (
    <JBorderLayout
      className="h-48"
      center={<Slot label="Centro" color="#8b5cf6" />}
    />
  ),
};

export const ConSidebarIzquierdo: Story = {
  name: 'Con sidebar izquierdo',
  parameters: {
    docs: {
      description: { story: 'Layout clásico de aplicación: header fijo, sidebar de navegación izquierdo y footer. El `west` contiene el menú de páginas.' },
    },
  },
  render: () => (
    <JBorderLayout
      className="h-80"
      north={<Slot label="Header" color="#2563eb" />}
      west={
        <JPanel layout="box" gap="xs" className="w-48 p-2">
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
  parameters: {
    docs: {
      description: { story: 'Layout de aplicación completo con sidebar colapsable y navegación activa. El `west` se monta/desmonta según el estado del toggle.' },
    },
  },
  render: () => {
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [activePage, setActivePage] = useState('Dashboard');
    const pages = ['Dashboard', 'Usuarios', 'Reportes', 'Configuración'];
    return (
      <JBorderLayout
        className="h-screen"
        north={
          <JPanel layout="box" direction="row" alignItems="center" justifyContent="between" className="px-4 py-2 bg-primary-700">
            <JLabel className="font-bold text-white">JONA UI</JLabel>
            <JButton size="sm" variant="ghost" className="text-white hover:bg-white/10" onClick={() => setSidebarOpen((s) => !s)}>
              {sidebarOpen ? 'Colapsar' : 'Expandir'}
            </JButton>
          </JPanel>
        }
        west={sidebarOpen ? (
          <JPanel layout="box" gap="xs" className="w-48 p-2 border-r border-neutral-200 h-full">
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
          <JPanel layout="box" gap="xs" className="p-4">
            <JLabel className="font-semibold text-neutral-800">{activePage}</JLabel>
            <JLabel size="sm" color="muted">
              Contenido de <strong>{activePage}</strong>. Sidebar {sidebarOpen ? 'visible' : 'colapsado'}.
            </JLabel>
          </JPanel>
        }
        south={
          <JPanel layout="box" className="px-4 py-2 border-t border-neutral-200">
            <JLabel size="xs" color="muted">© 2026 JONA Pattern</JLabel>
          </JPanel>
        }
      />
    );
  },
};
