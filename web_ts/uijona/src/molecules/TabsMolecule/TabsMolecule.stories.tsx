import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { useState } from 'react';
import { TabsMolecule, TabsList, TabsTrigger, TabsContent } from './TabsMolecule';

const meta: Meta<typeof TabsMolecule> = {
  title: 'Molecules/TabsMolecule',
  component: TabsMolecule,
  tags: ['autodocs'],
  args: { onChange: fn() },
  argTypes: {
    variant:     { control: 'radio', options: ['pill', 'line'] },
    orientation: { control: 'radio', options: ['horizontal', 'vertical'] },
  },
};
export default meta;
type Story = StoryObj<typeof TabsMolecule>;

export const Default: Story = {
  render: () => {
    const [tab, setTab] = useState('cuenta');
    return (
      <TabsMolecule value={tab} onChange={setTab} style={{ width: '400px' }}>
        <TabsList>
          <TabsTrigger value="cuenta">Cuenta</TabsTrigger>
          <TabsTrigger value="seguridad">Seguridad</TabsTrigger>
          <TabsTrigger value="notificaciones">Notificaciones</TabsTrigger>
        </TabsList>
        <TabsContent value="cuenta">Configuración de cuenta</TabsContent>
        <TabsContent value="seguridad">Configuración de seguridad</TabsContent>
        <TabsContent value="notificaciones">Preferencias de notificación</TabsContent>
      </TabsMolecule>
    );
  },
};

export const LineVariant: Story = {
  render: () => {
    const [tab, setTab] = useState('overview');
    return (
      <TabsMolecule value={tab} onChange={setTab} variant="line" style={{ width: '400px' }}>
        <TabsList>
          <TabsTrigger value="overview">Resumen</TabsTrigger>
          <TabsTrigger value="analytics">Analítica</TabsTrigger>
          <TabsTrigger value="reports">Reportes</TabsTrigger>
        </TabsList>
        <TabsContent value="overview">Vista de resumen</TabsContent>
        <TabsContent value="analytics">Datos analíticos</TabsContent>
        <TabsContent value="reports">Reportes generados</TabsContent>
      </TabsMolecule>
    );
  },
};
