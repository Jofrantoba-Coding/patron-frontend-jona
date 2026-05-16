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
    title: 'Migración y modernización',
    description: 'Migración de sistemas legacy a arquitecturas cloud-native con mínimo impacto operativo.',
    proof: 'Reduce deuda técnica y habilita la escalabilidad sin detener la operación del negocio.',
    href: '/servicios/migracion-modernizacion',
  },
};

export const SinLink: Story = {
  args: {
    icon: '📊',
    title: 'Gobierno de datos, BI e IA',
    description: 'Modelo operativo de datos, catálogo, calidad, linaje, data lake, BI y analítica avanzada.',
    proof: 'Convierte datos críticos en activos gobernados, explotables y accionables.',
  },
};

export const Grid: Story = {
  render: () => (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
      <ServiceCardMolecule icon="☁️" title="Cloud" description="Migración y arquitectura cloud." proof="Reduce deuda técnica." href="/servicios/cloud" />
      <ServiceCardMolecule icon="📊" title="Datos & BI" description="Pipeline de datos y dashboards." proof="Convierte datos en activos." href="/servicios/datos" />
      <ServiceCardMolecule icon="🔐" title="Seguridad" description="Arquitectura zero trust y cumplimiento." proof="Alineado a NIST CSF y COBIT." href="/servicios/seguridad" />
    </div>
  ),
};
