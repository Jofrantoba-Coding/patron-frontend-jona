import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { useState } from 'react';
import { JTabs, JTabsList, JTabsTrigger, JTabsContent, JTABS_DEFAULTS } from './JTabs';
import { JLabel } from '../../atoms/JLabel';

const meta: Meta<typeof JTabs> = {
  title: 'Molecules/JTabs',
  component: JTabs,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'JTabs es un sistema de pestañas compuesto: `JTabs` (root) + `JTabsList` + `JTabsTrigger` + `JTabsContent`. Soporta variante `pill` / `line` y orientación `horizontal` / `vertical`.',
      },
    },
  },
  args: { onChange: fn() },
  argTypes: {
    variant: {
      control: 'radio',
      options: ['pill', 'line'],
      table: { defaultValue: { summary: JTABS_DEFAULTS.variant } },
    },
    orientation: {
      control: 'radio',
      options: ['horizontal', 'vertical'],
      table: { defaultValue: { summary: JTABS_DEFAULTS.orientation } },
    },
  },
};
export default meta;
type Story = StoryObj<typeof JTabs>;

export const Default: Story = {
  render: () => {
    const [tab, setTab] = useState('cuenta');
    return (
      <div style={{ width: '400px' }}>
        <JTabs value={tab} onChange={setTab}>
          <JTabsList>
            <JTabsTrigger value="cuenta">Cuenta</JTabsTrigger>
            <JTabsTrigger value="seguridad">Seguridad</JTabsTrigger>
            <JTabsTrigger value="notificaciones">Notificaciones</JTabsTrigger>
          </JTabsList>
          <JTabsContent value="cuenta">Configuración de cuenta</JTabsContent>
          <JTabsContent value="seguridad">Configuración de seguridad</JTabsContent>
          <JTabsContent value="notificaciones">Preferencias de notificación</JTabsContent>
        </JTabs>
      </div>
    );
  },
};

export const LineVariant: Story = {
  parameters: {
    docs: { description: { story: '`variant="line"` dibuja una línea inferior en la pestaña activa.' } },
  },
  render: () => {
    const [tab, setTab] = useState('overview');
    return (
      <div style={{ width: '400px' }}>
        <JTabs value={tab} onChange={setTab} variant="line">
          <JTabsList>
            <JTabsTrigger value="overview">Resumen</JTabsTrigger>
            <JTabsTrigger value="analytics">Analítica</JTabsTrigger>
            <JTabsTrigger value="reports">Reportes</JTabsTrigger>
          </JTabsList>
          <JTabsContent value="overview" className="mt-2">Vista de resumen</JTabsContent>
          <JTabsContent value="analytics" className="mt-2">Datos analíticos</JTabsContent>
          <JTabsContent value="reports" className="mt-2">Reportes generados</JTabsContent>
        </JTabs>
      </div>
    );
  },
};

export const Vertical: Story = {
  parameters: {
    docs: { description: { story: '`orientation="vertical"`: pestañas en columna izquierda, contenido a la derecha (a partir de `sm`).' } },
  },
  render: () => {
    const [tab, setTab] = useState('perfil');
    return (
      <div style={{ width: '480px' }}>
        <JTabs value={tab} onChange={setTab} orientation="vertical">
          <JTabsList>
            <JTabsTrigger value="perfil">Perfil</JTabsTrigger>
            <JTabsTrigger value="seguridad">Seguridad</JTabsTrigger>
            <JTabsTrigger value="facturacion">Facturación</JTabsTrigger>
          </JTabsList>
          <JTabsContent value="perfil" className="p-2">Datos del perfil de usuario</JTabsContent>
          <JTabsContent value="seguridad" className="p-2">Contraseña y 2FA</JTabsContent>
          <JTabsContent value="facturacion" className="p-2">Métodos de pago y facturas</JTabsContent>
        </JTabs>
      </div>
    );
  },
};

export const WithDisabled: Story = {
  parameters: {
    docs: { description: { story: 'Pestaña con `disabled`: no responde a clicks y queda opaca.' } },
  },
  render: () => {
    const [tab, setTab] = useState('activo');
    return (
      <div style={{ width: '400px' }}>
        <JTabs value={tab} onChange={setTab}>
          <JTabsList>
            <JTabsTrigger value="activo">Activo</JTabsTrigger>
            <JTabsTrigger value="borrador" disabled>Borrador</JTabsTrigger>
            <JTabsTrigger value="archivado">Archivado</JTabsTrigger>
          </JTabsList>
          <JTabsContent value="activo" className="mt-1">Contenido activo</JTabsContent>
          <JTabsContent value="archivado" className="mt-1">Contenido archivado</JTabsContent>
        </JTabs>
      </div>
    );
  },
};

export const Interactive: Story = {
  parameters: {
    docs: {
      description: { story: 'Tres pestañas controladas con contenido dinámico. El panel de acciones registra cada cambio de pestaña.' },
      source: {
        code: `const [tab, setTab] = useState('perfil');

<JTabs value={tab} onChange={setTab}>
  <JTabsList>
    <JTabsTrigger value="perfil">Perfil</JTabsTrigger>
    <JTabsTrigger value="seguridad">Seguridad</JTabsTrigger>
    <JTabsTrigger value="notificaciones">Notificaciones</JTabsTrigger>
  </JTabsList>
  <JTabsContent value="perfil">...</JTabsContent>
  <JTabsContent value="seguridad">...</JTabsContent>
  <JTabsContent value="notificaciones">...</JTabsContent>
</JTabs>`,
      },
    },
  },
  args: { onChange: fn() },
  render: (args) => {
    const [tab, setTab] = useState('perfil');
    const tabData = {
      perfil:         'Nombre: Jonathan Franck\nEmail: jofrantoba@gmail.com\nRol: Administrador',
      seguridad:      'Contraseña: •••••••• (último cambio: hace 30 días)\nAutenticación 2FA: Activada',
      notificaciones: 'Correos: Activados\nPush: Desactivados\nSMS: Solo alertas críticas',
    };
    return (
      <div style={{ width: '420px' }}>
        <JTabs value={tab} onChange={(v) => { args.onChange?.(v); setTab(v); }}>
          <JTabsList>
            <JTabsTrigger value="perfil">Perfil</JTabsTrigger>
            <JTabsTrigger value="seguridad">Seguridad</JTabsTrigger>
            <JTabsTrigger value="notificaciones">Notificaciones</JTabsTrigger>
          </JTabsList>
          <JTabsContent value="perfil" className="mt-2">
            <div className="flex flex-col gap-1">
              {tabData.perfil.split('\n').map((line, i) => <JLabel key={i} size="sm" color="muted">{line}</JLabel>)}
            </div>
          </JTabsContent>
          <JTabsContent value="seguridad" className="mt-2">
            <div className="flex flex-col gap-1">
              {tabData.seguridad.split('\n').map((line, i) => <JLabel key={i} size="sm" color="muted">{line}</JLabel>)}
            </div>
          </JTabsContent>
          <JTabsContent value="notificaciones" className="mt-2">
            <div className="flex flex-col gap-1">
              {tabData.notificaciones.split('\n').map((line, i) => <JLabel key={i} size="sm" color="muted">{line}</JLabel>)}
            </div>
          </JTabsContent>
        </JTabs>
      </div>
    );
  },
};
