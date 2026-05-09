import type { Meta, StoryObj } from '@storybook/react';
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
