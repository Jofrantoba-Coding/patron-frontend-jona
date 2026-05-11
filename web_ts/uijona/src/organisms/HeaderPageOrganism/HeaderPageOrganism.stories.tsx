import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { HeaderPageOrganism } from './HeaderPageOrganism';
import { ButtonAtom } from '../../atoms/ButtonAtom/ButtonAtom';
import { UserAvatarMolecule } from '../../molecules/UserAvatarMolecule/UserAvatarMolecule';
import { PanelAtom } from '../../atoms/PanelAtom/PanelAtom';

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
      <PanelAtom variant="ghost" padding="none" style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
        <ButtonAtom variant="ghost" size="sm">Ayuda</ButtonAtom>
        <UserAvatarMolecule name="Jonathan Franck" size="sm" />
      </PanelAtom>
    ),
  },
};

export const Interactive: Story = {
  render: () => {
    const [currentPage, setCurrentPage] = useState('Dashboard');
    const pages = ['Dashboard', 'Proyectos', 'Reportes', 'Configuración'];
    return (
      <PanelAtom variant="ghost" padding="none" style={{ display: 'flex', flexDirection: 'column' }}>
        <HeaderPageOrganism
          title="JONA UI"
          nav={
            <nav style={{ display: 'flex', gap: '4px' }}>
              {pages.map((p) => (
                <ButtonAtom
                  key={p}
                  variant="ghost"
                  size="sm"
                  onClick={() => setCurrentPage(p)}
                  className={currentPage === p ? 'bg-white/20 text-inherit font-semibold hover:bg-white/30 hover:text-inherit' : 'text-inherit hover:bg-white/10 hover:text-inherit'}
                >
                  {p}
                </ButtonAtom>
              ))}
            </nav>
          }
          actions={
            <PanelAtom variant="ghost" padding="none" style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              <ButtonAtom variant="ghost" size="sm">Ayuda</ButtonAtom>
              <UserAvatarMolecule name="Jonathan Franck" size="sm" />
            </PanelAtom>
          }
        />
        <PanelAtom variant="ghost" padding="none" style={{ padding: '24px', fontSize: '14px', color: '#525252' }}>
          Página actual: <strong>{currentPage}</strong>
        </PanelAtom>
      </PanelAtom>
    );
  },
};
