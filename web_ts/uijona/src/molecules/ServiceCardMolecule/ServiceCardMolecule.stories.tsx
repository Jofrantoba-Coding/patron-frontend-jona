import type { Meta, StoryObj } from '@storybook/react';
import { ServiceCardMolecule } from './ServiceCardMolecule';

const meta: Meta<typeof ServiceCardMolecule> = {
  title: 'Molecules/ServiceCardMolecule',
  component: ServiceCardMolecule,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof ServiceCardMolecule>;

export const Default: Story = {
  args: {
    icon: '☁️',
    title: 'Migración y arquitectura cloud',
    description:
      'Diseñamos la arquitectura cloud correcta para tu carga y te acompañamos en la migración sin interrumpir tu operación.',
    tags: ['AWS', 'GCP', 'Azure'],
  },
};

export const WithLink: Story = {
  args: {
    icon: '📊',
    title: 'Inteligencia de datos y BI',
    description: 'Construimos el pipeline de datos que te falta y los dashboards que tu equipo realmente usa.',
    tags: ['Power BI', 'Looker', 'dbt'],
    href: '/servicios/inteligencia-de-datos',
  },
};

export const NoIcon: Story = {
  args: {
    title: 'Desarrollo de software a medida',
    description: 'Aplicaciones web y móviles adaptadas a tus procesos, integradas con tus sistemas existentes.',
  },
};

export const Grid: Story = {
  render: () => (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '16px' }}>
      <ServiceCardMolecule icon="☁️" title="Cloud" description="Migración y arquitectura cloud para tu empresa." tags={['AWS', 'GCP']} />
      <ServiceCardMolecule icon="📊" title="Datos & BI" description="Pipeline de datos y dashboards que tu equipo usa." tags={['Power BI', 'dbt']} />
      <ServiceCardMolecule icon="🔐" title="Seguridad" description="Auditorías de seguridad y cumplimiento normativo." tags={['ISO 27001']} />
    </div>
  ),
};
