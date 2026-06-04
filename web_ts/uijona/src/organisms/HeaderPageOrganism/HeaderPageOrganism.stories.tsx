import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { HeaderPageOrganism } from './HeaderPageOrganism';
import { JButton } from '../../atoms/JButton/JButton';
import { JUserAvatar } from '../../molecules/JUserAvatar';
import { JPanel } from '../../atoms/JPanel/JPanel';

const meta: Meta<typeof HeaderPageOrganism> = {
  title: 'Organisms/HeaderPageOrganism',
  component: HeaderPageOrganism,
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen' },
};
export default meta;
type Story = StoryObj<typeof HeaderPageOrganism>;

export const Default: Story = {
  args: { title: 'JONA UI' },
};

export const WithNav: Story = {
  args: {
    title: 'JONA UI',
    nav: (
      <nav style={{ display: 'flex', gap: '16px' }}>
        <a href="#">Inicio</a>
        <a href="#">Componentes</a>
        <a href="#">Documentación</a>
      </nav>
    ),
  },
};

export const WithActions: Story = {
  args: {
    title: 'JONA UI',
    nav: (
      <nav style={{ display: 'flex', gap: '16px' }}>
        <a href="#">Dashboard</a>
        <a href="#">Reportes</a>
      </nav>
    ),
    actions: (
      <JPanel variant="ghost" padding="none" style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
        <JButton variant="ghost" size="sm">Ayuda</JButton>
        <JUserAvatar name="Jonathan Franck" size="sm" />
      </JPanel>
    ),
  },
};

export const Interactive: Story = {
  render: () => {
    const [currentPage, setCurrentPage] = useState('Dashboard');
    const pages = ['Dashboard', 'Proyectos', 'Reportes', 'Configuración'];
    return (
      <JPanel variant="ghost" padding="none" style={{ display: 'flex', flexDirection: 'column' }}>
        <HeaderPageOrganism
          title="JONA UI"
          nav={
            <nav style={{ display: 'flex', gap: '4px' }}>
              {pages.map((p) => (
                <JButton
                  key={p}
                  variant="ghost"
                  size="sm"
                  onClick={() => setCurrentPage(p)}
                  className={currentPage === p ? 'bg-white/20 text-inherit font-semibold hover:bg-white/30 hover:text-inherit' : 'text-inherit hover:bg-white/10 hover:text-inherit'}
                >
                  {p}
                </JButton>
              ))}
            </nav>
          }
          actions={
            <JPanel variant="ghost" padding="none" style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              <JButton variant="ghost" size="sm">Ayuda</JButton>
              <JUserAvatar name="Jonathan Franck" size="sm" />
            </JPanel>
          }
        />
        <JPanel variant="ghost" padding="none" style={{ padding: '24px', fontSize: '14px', color: '#525252' }}>
          Página actual: <strong>{currentPage}</strong>
        </JPanel>
      </JPanel>
    );
  },
};
