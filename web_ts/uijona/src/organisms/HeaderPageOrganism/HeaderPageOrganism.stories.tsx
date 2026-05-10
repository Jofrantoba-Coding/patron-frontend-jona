import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { HeaderPageOrganism } from './HeaderPageOrganism';
import { ButtonAtom } from '../../atoms/ButtonAtom/ButtonAtom';
import { UserAvatarMolecule } from '../../molecules/UserAvatarMolecule/UserAvatarMolecule';

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
      <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
        <ButtonAtom variant="ghost" size="sm">Ayuda</ButtonAtom>
        <UserAvatarMolecule name="Jonathan Franck" size="sm" />
      </div>
    ),
  },
};

export const Interactive: Story = {
  render: () => {
    const [currentPage, setCurrentPage] = useState('Dashboard');
    const pages = ['Dashboard', 'Proyectos', 'Reportes', 'Configuración'];
    return (
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <HeaderPageOrganism
          title="JONA UI"
          nav={
            <nav style={{ display: 'flex', gap: '4px' }}>
              {pages.map((p) => (
                <button
                  key={p}
                  onClick={() => setCurrentPage(p)}
                  style={{ padding: '4px 10px', borderRadius: '6px', border: 'none', cursor: 'pointer', fontSize: '14px', background: currentPage === p ? 'rgba(255,255,255,0.2)' : 'transparent', color: 'inherit', fontWeight: currentPage === p ? 600 : 400 }}
                >
                  {p}
                </button>
              ))}
            </nav>
          }
          actions={
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              <ButtonAtom variant="ghost" size="sm">Ayuda</ButtonAtom>
              <UserAvatarMolecule name="Jonathan Franck" size="sm" />
            </div>
          }
        />
        <div style={{ padding: '24px', fontSize: '14px', color: '#525252' }}>
          Página actual: <strong>{currentPage}</strong>
        </div>
      </div>
    );
  },
};
